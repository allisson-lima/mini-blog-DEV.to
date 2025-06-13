import { ArticlesList } from '@/components/articles/articles-list';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Posts Recentes</h1>
          <p className="text-muted-foreground">
            Descubra os últimos artigos da comunidade dev.to
          </p>
        </div>
        <ArticlesList />
      </div>
    </div>
  );
}
