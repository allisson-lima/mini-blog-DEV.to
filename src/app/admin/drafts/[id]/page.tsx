import { PostEditor } from '@/components/editor/post-editor';

interface EditDraftPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditDraftPage({ params }: EditDraftPageProps) {
  const { id } = await params;
  return (
    <div className="bg-background min-h-screen">
      <div className="container py-8">
        <PostEditor draftId={id} />
      </div>
    </div>
  );
}
