import Link from 'next/link';
import { Zap, Phone, MessageCircle, MapPin, Clock } from 'lucide-react';
import { SITE } from '@/lib/utils';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy-deep text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-bold text-white">
            <Zap className="h-6 w-6 text-energy" />
            能源数字孪生
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            水/电/气/冷/热能源数据采集与工业级数字孪生解决方案提供商。
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">产品与方案</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/solutions/" className="hover:text-energy">数字孪生解决方案</Link></li>
            <li><Link href="/products/" className="hover:text-energy">数据采集硬件</Link></li>
            <li><Link href="/cases/" className="hover:text-energy">客户成功案例</Link></li>
            <li><Link href="/news/" className="hover:text-energy">新闻与技术干货</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">联系我们</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-energy" />{SITE.phone}</li>
            <li className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-energy" />微信：{SITE.wechat}</li>
            <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-energy" />{SITE.workingHours}</li>
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-energy" />{SITE.address}</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">开始使用</h3>
          <p className="text-sm text-slate-400">预约一场专属的能效数字孪生大屏 3D 演示，获取定制化零碳方案。</p>
          <Link href="/contact/#demo" className="mt-3 inline-flex h-11 items-center rounded-lg bg-energy px-4 text-sm font-semibold text-navy-deep hover:bg-energy-dark">
            预约 3D 演示
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {SITE.name} · {SITE.icp} · Powered by Next.js SSG
      </div>
    </footer>
  );
}
