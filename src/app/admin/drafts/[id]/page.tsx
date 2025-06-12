import { PostEditor } from "@/components/editor/post-editor";

interface EditDraftPageProps {
  params: {
    id: string;
  };
}

export default function EditDraftPage({ params }: EditDraftPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <PostEditor draftId={params.id} />
      </main>
    </div>
  );
}
