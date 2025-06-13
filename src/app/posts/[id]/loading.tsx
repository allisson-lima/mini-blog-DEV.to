import { Skeleton } from '@/components/ui/skeleton';

export default function ArticleLoading() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <Skeleton className="h-12 w-3/4 mb-4" />

            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-5 w-40 mb-2" />
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-16 rounded-full" />
              ))}
            </div>

            <Skeleton className="aspect-video w-full rounded-lg mb-6" />

            <div className="flex items-center justify-between py-4 border-y">
              <div className="flex items-center gap-6">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          </header>

          <div className="space-y-4 mb-12">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i + 10} className="h-4 w-full" />
            ))}
          </div>

          <Skeleton className="h-px w-full my-8" />

          <section className="space-y-6">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-32 w-full rounded-lg" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg" />
              ))}
            </div>
          </section>
        </article>
      </main>
    </div>
  );
}
