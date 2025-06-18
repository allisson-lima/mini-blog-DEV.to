'use client';

import Link from 'next/link';
import { Github, Linkedin, Mail, Heart, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const footerLinks = {
  navigation: [
    { name: 'Home', href: '/' },
    { name: 'Artigos', href: '/posts' },
    { name: 'Tags', href: '/tags' },
    { name: 'Sobre', href: '/about' },
  ],
  resources: [
    { name: 'Documentação', href: '/docs' },
    { name: 'API', href: '/api/docs' },
    { name: 'Changelog', href: '/changelog' },
    { name: 'Status', href: '/status' },
  ],
  legal: [
    { name: 'Privacidade', href: '/privacy' },
    { name: 'Termos', href: '/terms' },
    { name: 'Cookies', href: '/cookies' },
    { name: 'Licença', href: '/license' },
  ],
};

const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com/allisson-lima/mini-blog-aiva',
    icon: Github,
    external: true,
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/allisson-lima-3382121b6',
    icon: Linkedin,
    external: true,
  },
  {
    name: 'Email',
    href: 'mailto:allisson.lima.dev@gmail.com',
    icon: Mail,
    external: false,
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-sm font-bold">MB</span>
              </div>
              <span className="text-lg font-bold">Mini Blog CMS</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Uma plataforma moderna de blog/CMS construída com Next.js 15 e
              DEV.to API. Desenvolvido como parte do desafio técnico da Aiva.
            </p>
            <div className="mt-6 flex space-x-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Button
                    key={social.name}
                    variant="ghost"
                    size="icon"
                    asChild
                    className="h-9 w-9"
                  >
                    <Link
                      href={social.href}
                      target={social.external ? '_blank' : undefined}
                      rel={social.external ? 'noopener noreferrer' : undefined}
                      aria-label={social.name}
                    >
                      <Icon className="h-4 w-4" />
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:col-span-3">
            <div>
              <h3 className="text-sm font-semibold">Navegação</h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.navigation.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold">Recursos</h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.name}
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold">Legal</h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
          <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Mini Blog CMS. Todos os direitos reservados.
            </p>
            <div className="hidden sm:block">
              <Separator orientation="vertical" className="h-4" />
            </div>
            <p className="flex items-center text-sm text-muted-foreground">
              Feito com{' '}
              <Heart className="mx-1 h-3 w-3 fill-red-500 text-red-500" /> para
              o desafio Aiva
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <span>Powered by</span>
            <Link
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-foreground"
            >
              Next.js
            </Link>
            <span>•</span>
            <Link
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-foreground"
            >
              Vercel
            </Link>
            <span>•</span>
            <Link
              href="https://developers.forem.com/api"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-foreground"
            >
              DEV.to API
            </Link>
          </div>
        </div>

        <div className="mt-8 rounded-lg border bg-muted/50 p-4">
          <div className="flex flex-col items-center justify-between space-y-2 sm:flex-row sm:space-y-0">
            <div className="text-center sm:text-left">
              <p className="text-sm font-medium">🚀 Desafio Técnico Aiva</p>
              <p className="text-xs text-muted-foreground">
                Demonstração de habilidades em React, TypeScript e Next.js
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link
                  href="https://github.com/allisson-lima/mini-blog-aiva"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-3 w-3" />
                  Ver Código
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link
                  href="https://mini-blog-cms-aiva.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-3 w-3" />
                  Demo Live
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
