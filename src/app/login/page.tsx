'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookOpen, AlertCircle, EyeOffIcon, EyeIcon } from 'lucide-react';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(1, { message: 'Senha é obrigatória' }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuthStore();
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'jane@example.com',
      password: '123456',
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: LoginFormData) => {
    setError('');

    try {
      await login(data.email, data.password);
      toast.success('Login realizado com sucesso!');
      router.push('/');
    } catch (error: any) {
      setError(error.message || 'Erro ao fazer login');
      toast.error('Erro no login');
    }
  };

  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">
            Entrar no DevBlog
          </CardTitle>
          <CardDescription className="text-center">
            Entre com seu email e senha para acessar sua conta
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium">Contas de teste:</p>
            <div className="text-xs space-y-1">
              <p>
                <strong>Usuário:</strong> jane@example.com / 123456
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                {...register('email')}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  placeholder="Digite sua senha"
                  type={isVisible ? 'text' : 'password'}
                  {...register('password')}
                  disabled={isLoading}
                />
                <button
                  className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  type="button"
                  onClick={() => setIsVisible((prev) => !prev)}
                  aria-label={isVisible ? 'Hide password' : 'Show password'}
                  aria-pressed={isVisible}
                  aria-controls="password"
                >
                  {isVisible ? (
                    <EyeOffIcon size={16} aria-hidden="true" />
                  ) : (
                    <EyeIcon size={16} aria-hidden="true" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col">
          <div className="text-center text-sm text-muted-foreground mt-2">
            Não tem uma conta?{' '}
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={() => toast.info('Registro em breve!')}
            >
              Registre-se
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
