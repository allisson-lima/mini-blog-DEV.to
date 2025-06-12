import { Header } from "./header";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-6 mx-auto">{children}</main>
    </div>
  );
}
