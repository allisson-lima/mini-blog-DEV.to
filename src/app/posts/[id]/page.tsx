import { ArticleView } from "@/components/articles/article-view";
import { ErrorBoundary } from "@/components/common/error-boundary";

interface PostPageProps {
  params: {
    id: string;
  };
}

export default function PostPage({ params }: PostPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <ErrorBoundary>
          <ArticleView articleId={params.id} />
        </ErrorBoundary>
      </main>
    </div>
  );
}
