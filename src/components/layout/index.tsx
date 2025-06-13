import { Header } from './header';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1 container py-6 md:px-0 px-3 mx-auto">
        {children}
      </div>
    </div>
  );
}
