import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileX, Home, Search } from 'lucide-react';

export default function PostNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="flex justify-center mb-6">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
              <FileX className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Post não encontrado</h1>
          <p className="text-muted-foreground mb-8">
            O post que você está procurando foi removido ou não existe. Talvez o
            link esteja incorreto ou o post tenha sido excluído.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="gap-2">
              <Link href="/">
                <Home className="h-4 w-4" />
                Voltar para o início
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link href="/tags">
                <Search className="h-4 w-4" />
                Explorar tags
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
