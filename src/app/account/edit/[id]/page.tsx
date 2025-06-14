import { PostEditForm } from '@/components/editor/post-edit-form';

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  return (
    <div>
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <PostEditForm articleId={id} />
        </div>
      </div>
    </div>
  );
}
