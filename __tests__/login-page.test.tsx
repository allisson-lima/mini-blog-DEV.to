import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '@/app/login/page';

const mockPush = jest.fn();
const mockLogin = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('@/stores/auth-store', () => ({
  useAuthStore: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: mockLogin,
    logout: jest.fn(),
    refreshAuth: jest.fn(),
    setUser: jest.fn(),
    setLoading: jest.fn(),
  }),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('renderização', () => {
    it('deve renderizar o formulário de login corretamente', () => {
      render(<LoginPage />);

      expect(screen.getByText('Entrar no DevBlog')).toBeInTheDocument();
      expect(
        screen.getByText('Entre com seu email e senha para acessar sua conta'),
      ).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Senha')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Entrar' }),
      ).toBeInTheDocument();
    });

    it('deve mostrar informações da conta de teste', () => {
      render(<LoginPage />);

      const testAccountBox = screen
        .getByText('Contas de teste:')
        .closest('div');
      expect(testAccountBox).toBeInTheDocument();

      const allMatches = screen.getAllByText(
        (_, element) =>
          element?.textContent === 'Usuário: jane@example.com / 123456',
      );

      expect(allMatches.length).toBeGreaterThan(0);

      const insideCorrectBox = allMatches.some((el) =>
        testAccountBox?.contains(el),
      );

      expect(insideCorrectBox).toBe(true);
    });

    it('deve renderizar o botão de registro', () => {
      render(<LoginPage />);
      expect(
        screen.getByRole('button', { name: 'Registre-se' }),
      ).toBeInTheDocument();
    });
  });

  describe('comportamento', () => {
    it('deve mostrar erro ao enviar formulário vazio', async () => {
      render(<LoginPage />);

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Senha');
      await userEvent.clear(emailInput);
      await userEvent.clear(passwordInput);

      const submitButton = screen.getByRole('button', { name: 'Entrar' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Email inválido')).toBeInTheDocument();
        expect(screen.getByText('Senha é obrigatória')).toBeInTheDocument();
      });

      expect(mockLogin).not.toHaveBeenCalled();
    });

    it('deve chamar login com credenciais válidas', async () => {
      mockLogin.mockResolvedValueOnce(undefined);
      render(<LoginPage />);

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Senha');

      await userEvent.clear(emailInput);
      await userEvent.clear(passwordInput);
      await userEvent.type(emailInput, 'jane@example.com');
      await userEvent.type(passwordInput, '123456');

      const submitButton = screen.getByRole('button', { name: 'Entrar' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('jane@example.com', '123456');
      });

      expect(mockPush).toHaveBeenCalledWith('/');
    });

    it('deve mostrar erro se o login falhar', async () => {
      const errorMsg = 'Credenciais inválidas';
      mockLogin.mockRejectedValueOnce(new Error(errorMsg));

      render(<LoginPage />);

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Senha');

      await userEvent.clear(emailInput);
      await userEvent.clear(passwordInput);
      await userEvent.type(emailInput, 'wrong@example.com');
      await userEvent.type(passwordInput, 'wrongpass');

      const submitButton = screen.getByRole('button', { name: 'Entrar' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(errorMsg)).toBeInTheDocument();
      });

      expect(mockPush).not.toHaveBeenCalled();
    });

    it('deve alternar a visibilidade da senha', async () => {
      render(<LoginPage />);

      const passwordInput = screen.getByLabelText('Senha') as HTMLInputElement;
      expect(passwordInput.type).toBe('password');

      const toggleButton = screen.getByRole('button', {
        name: /Show password/i,
      });

      await userEvent.click(toggleButton);

      expect(passwordInput.type).toBe('text');
    });
  });
});
