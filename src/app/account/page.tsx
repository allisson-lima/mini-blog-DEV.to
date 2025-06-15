'use client';

import dynamic from 'next/dynamic';

const AccountDashboard = dynamic(
  () =>
    import('@/components/account/account-dashboard').then(
      (mod) => mod.AccountDashboard,
    ),
  {
    ssr: false,
  },
);

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <AccountDashboard />
      </div>
    </div>
  );
}
