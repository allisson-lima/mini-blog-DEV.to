import { UnpublishedArticlesList } from '@/components/drafts/unpublished-articles-list';

export default function DraftsPage() {
  return (
    <div>
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <UnpublishedArticlesList />
        </div>
      </div>
    </div>
  );
}
