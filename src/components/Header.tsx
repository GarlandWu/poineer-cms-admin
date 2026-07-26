'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Zap } from 'lucide-react';
import { cn, SITE } from '@/lib/utils';
import { DemoCTA } from './CTAButtons';

const NAV = SITE.nav;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy-deep/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-white">
          <Zap className="h-6 w-6 text-energy" />
          <span className="text-base md:text-lg">能源数字孪生</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-slate-200 transition-colors hover:text-energy">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
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
        <nav className="space-y-1 border-t border-white/10 bg-navy px-4 py-3">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex h-11 items-center rounded-lg px-3 text-slate-200 hover:bg-white/5 hover:text-energy"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2">
            <DemoCTA className="w-full" />
          </div>
        </nav>
      </div>
    </header>
  );
}
