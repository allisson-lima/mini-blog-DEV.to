import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <AdminDashboard />
      </main>
    </div>
  );
}
