import { PostEditor } from '@/components/editor/post-editor';

export default function NewPostPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <PostEditor />
      </div>
    </div>
  );
}
