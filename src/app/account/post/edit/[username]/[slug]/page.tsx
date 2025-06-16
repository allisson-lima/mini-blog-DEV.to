import { PostEditForm } from '@/components/editor/post-edit-form';
import { getArticleBySlug } from '@/lib/articles';
import { notFound } from 'next/navigation';

interface EditPostPageProps {
  params: Promise<{
    username: string;
    slug: string;
  }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { username, slug } = await params;
  const article = await getArticleBySlug(username, slug);

  if (!article) {
    notFound();
  }
  return (
    <div>
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <PostEditForm article={article} />
        </div>
      </div>
    </div>
  );
}
