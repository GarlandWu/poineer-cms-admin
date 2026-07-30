import Link from 'next/link';
import { CalendarClock, FileDown, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

const base =
  'inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold transition-all';

/** 【预约 3D 演示】主转化按钮 — 渐变 + 发光效果 */
export function DemoCTA({ className }: { className?: string }) {
  return (
    <Link
      href="/contact/#demo"
      className={cn(
        base,
        'bg-gradient-to-r from-energy to-energy-dark text-navy-deep shadow-glow-energy hover:shadow-lg hover:scale-105 active:scale-95',
        className
      )}
    >
      <CalendarClock className="h-4 w-4" />
      预约 3D 演示
    </Link>
  );
}

/** 【下载选型手册 PDF】 — 发光边框 */
export function PdfCTA({ href, className }: { href: string; className?: string }) {
  return (
    <a
      href={href}
      className={cn(
        base,
        'border border-electric/50 bg-electric/10 text-electric-light hover:bg-electric/20 hover:shadow-glow-electric hover:scale-105 active:scale-95',
        className
      )}
      download
    >
      <FileDown className="h-4 w-4" />
      下载选型手册 (PDF)
    </a>
  );
}

/** 【获取零碳方案】 — 发光边框 */
export function ZeroCarbonCTA({ className }: { className?: string }) {
  return (
    <Link
      href="/contact/#demo"
      className={cn(
        base,
        'border border-energy/50 text-energy hover:bg-energy/10 hover:shadow-glow-energy hover:scale-105 active:scale-95',
        className
      )}
    >
      <Leaf className="h-4 w-4" />
      获取零碳方案
    </Link>
  );
}
