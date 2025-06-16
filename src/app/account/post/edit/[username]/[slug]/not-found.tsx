'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileX, Home, ArrowLeft } from 'lucide-react';

export default function EditPostNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="flex justify-center mb-6">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
              <FileX className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Artigo não encontrado</h1>
          <p className="text-muted-foreground mb-8">
            O artigo que você está tentando editar não foi encontrado ou você
            não tem permissão para editá-lo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="gap-2">
              <Link href="/admin">
                <Home className="h-4 w-4" />
                Ir para Dashboard
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
