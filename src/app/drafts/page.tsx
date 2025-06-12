import { DraftsList } from "@/components/drafts/drafts-list";

export default function DraftsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <DraftsList />
      </main>
    </div>
  );
}
