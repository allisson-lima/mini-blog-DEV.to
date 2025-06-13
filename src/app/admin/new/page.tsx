import { PostEditor } from '@/components/editor/post-editor';

export default function NewPostPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <PostEditor />
      </main>
    </div>
  );
}
