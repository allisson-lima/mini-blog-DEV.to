'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  PenTool,
  BookOpen,
  Tag,
  User,
  LogOut,
  FileText,
  Settings,
  Moon,
  Sun,
  Laptop,
} from 'lucide-react';
import { useBlogStore } from '@/stores/blog-store';
import { useUserStore } from '@/stores/user-store';
import { useTheme } from 'next-themes';

export function Header() {
  const pathname = usePathname();
  const { searchQuery, selectedTags, clearFilters } = useBlogStore();
  const { user, isLoggedIn, logout } = useUserStore();
  const { theme, setTheme } = useTheme();

  const navItems = [
    { href: '/', label: 'Posts', icon: BookOpen },
    { href: '/drafts', label: 'Rascunhos', icon: PenTool },
    { href: '/tags', label: 'Tags', icon: Tag },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="md:container w-[95%] mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="hidden md:flex font-bold text-xl">DevBlog</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={pathname === item.href ? 'secondary' : 'ghost'}
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
          {/* <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-10"
            />
          </div> */}

          {(selectedTags.length > 0 || searchQuery) && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Limpar filtros
            </Button>
          )}

          {/* Theme Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                {theme === 'light' ? (
                  <Sun className="h-[1.2rem] w-[1.2rem]" />
                ) : theme === 'dark' ? (
                  <Moon className="h-[1.2rem] w-[1.2rem]" />
                ) : (
                  <Laptop className="h-[1.2rem] w-[1.2rem]" />
                )}
                <span className="sr-only">Alternar tema</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setTheme('light')}
                className="cursor-pointer"
              >
                <Sun className="mr-2 h-4 w-4" />
                <span>Claro</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme('dark')}
                className="cursor-pointer"
              >
                <Moon className="mr-2 h-4 w-4" />
                <span>Escuro</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme('system')}
                className="cursor-pointer"
              >
                <Laptop className="mr-2 h-4 w-4" />
                <span>Sistema</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* New Post Button */}
          <Link href="/admin/new" className="hidden md:flex">
            <Button size="sm" className="gap-2">
              <PenTool className="h-4 w-4" />
              Novo Post
            </Button>
          </Link>

          {/* User Menu */}
          {isLoggedIn && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.avatar || '/placeholder.svg'}
                      alt={user.name}
                    />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      @{user.username}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin" className="cursor-pointer flex w-full">
                    <User className="mr-2 h-4 w-4" />
                    <span>Minha Conta</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/drafts" className="cursor-pointer flex w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Meus Posts</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/admin/settings"
                    className="cursor-pointer flex w-full"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">
                <User className="mr-2 h-4 w-4" />
                Entrar
              </Link>
            </Button>
          )}
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
