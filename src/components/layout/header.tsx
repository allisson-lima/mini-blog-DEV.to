"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, PenTool, BookOpen, Settings, Tag } from "lucide-react";
import { useBlogStore } from "@/stores/blog-store";

export function Header() {
  const pathname = usePathname();
  const { searchQuery, setSearchQuery, selectedTags, clearFilters } =
    useBlogStore();

  const navItems = [
    { href: "/", label: "Posts", icon: BookOpen },
    { href: "/drafts", label: "Rascunhos", icon: PenTool },
    { href: "/tags", label: "Tags", icon: Tag },
    { href: "/admin", label: "Admin", icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">DevBlog</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    size="sm"
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-10"
            />
          </div>

          {(selectedTags.length > 0 || searchQuery) && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Limpar filtros
            </Button>
          )}

          <Link href="/admin/new">
            <Button size="sm" className="gap-2">
              <PenTool className="h-4 w-4" />
              Novo Post
            </Button>
          </Link>
        </div>
      </div>

      {selectedTags.length > 0 && (
        <div className="border-t bg-muted/50 px-4 py-2">
          <div className="container flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Tags selecionadas:
            </span>
            {selectedTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
