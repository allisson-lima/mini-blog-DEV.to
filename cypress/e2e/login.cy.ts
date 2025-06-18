describe('Login', () => {
  const loginUrl = 'http://localhost:3000/login';

  beforeEach(() => {
    cy.visit(loginUrl);
  });

  it('deve renderizar todos os elementos do formulário', () => {
    cy.contains('Entrar no DevBlog').should('be.visible');
    cy.contains('Entre com seu email e senha para acessar sua conta').should(
      'be.visible',
    );

    cy.get('#email').should('exist');
    cy.get('#password').should('exist');
    cy.contains('button', 'Entrar').should('exist');
    cy.contains('button', 'Registre-se').should('exist');

    cy.contains('Contas de teste:').should('exist');
    cy.contains(`Usuário: allison@example.com/ Teste@123`).should('exist');
  });

  it('deve exibir mensagens de erro se o formulário estiver vazio', () => {
    cy.get('#email').clear();
    cy.get('#password').clear();
    cy.contains('button', 'Entrar').click();

    cy.wait(500);
    cy.contains('Email inválido').should('be.visible');

    cy.wait(500);
    cy.contains('Senha é obrigatória').should('be.visible');
  });

  it('deve fazer login com credenciais válidas', () => {
    cy.get('#email', { timeout: 200000 }).clear().type('allison@example.com', {
      delay: 200,
    });
    cy.wait(200);

    cy.get('#password', { timeout: 200000 }).clear().type('Teste@123', {
      delay: 200,
    });

    cy.wait(500);
    cy.get('.space-y-4 > .inline-flex', { timeout: 20000 }).click({
      timeout: 20000,
    });

    cy.url().should('eq', 'http://localhost:3000/');
  });

  it('deve exibir erro ao tentar login com credenciais inválidas', () => {
    cy.get('#email', { timeout: 200000 }).clear().type('wrong@example.com', {
      delay: 200,
    });

    cy.wait(200);
    cy.get('#password', { timeout: 200000 }).clear().type('wrongpass', {
      delay: 200,
    });

    cy.get('.space-y-4 > .inline-flex', { timeout: 20000 }).click({
      timeout: 20000,
    });

    cy.contains('Credenciais inválidas').should('be.visible');
    cy.url().should('include', '/login');
  });

  it('deve alternar visibilidade da senha', () => {
    const passwordInput = () => cy.get('#password');

    passwordInput().should('have.attr', 'type', 'password');
    cy.wait(500);
    cy.get('#button-view-password').click();
    cy.wait(500);
    passwordInput().should('have.attr', 'type', 'text');
  });
});
