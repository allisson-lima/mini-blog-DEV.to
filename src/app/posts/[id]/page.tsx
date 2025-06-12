import { ArticleView } from '@/components/articles/article-view'
import { ErrorBoundary } from '@/components/common/error-boundary'

interface PostPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params
  return (
    <div className="bg-background min-h-screen">
      <main className="container py-8">
        <ErrorBoundary>
          <ArticleView articleId={id} />
        </ErrorBoundary>
      </main>
    </div>
  )
}
