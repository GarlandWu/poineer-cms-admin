'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Zap } from 'lucide-react';
import { cn, SITE } from '@/lib/utils';
import { DemoCTA } from './CTAButtons';
import { ThemeToggle } from './ThemeToggle';

const NAV = SITE.nav;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-electric/10 bg-white/80 backdrop-blur-md dark:border-energy/20 dark:bg-black/20 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-electric/40 dark:after:via-energy/50 after:to-transparent">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-navy-deep dark:text-white group">
          <Zap className="h-6 w-6 text-energy group-hover:text-glow-energy transition-colors" />
          <span className="text-base md:text-lg">能源数字孪生</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-slate-700 transition-all hover:text-electric dark:text-slate-300 dark:hover:text-energy hover:scale-105">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <DemoCTA />
        </div>

        <button
          type="button"
          aria-label="打开菜单"
          className="flex h-11 w-11 items-center justify-center text-white lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div className={cn('lg:hidden', open ? 'block' : 'hidden')}>
        <nav className="space-y-1 border-t border-electric/10 px-4 py-3 dark:border-energy/20 dark:bg-black/20">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex h-11 items-center rounded-lg px-3 text-slate-600 hover:bg-black/5 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-white/5 dark:hover:text-energy"
            >
              {item.label}
            </Link>
          ))}
          <div className="flex gap-2 border-t border-black/10 py-3 dark:border-white/10">
            <ThemeToggle />
            <DemoCTA className="flex-1" />
          </div>
        </nav>
      </div>
    </header>
  );
}
