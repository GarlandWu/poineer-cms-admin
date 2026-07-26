'use client';

import { useState } from 'react';
import { Phone, MessageCircle, CalendarClock, X } from 'lucide-react';
import Link from 'next/link';
import { SITE } from '@/lib/utils';

/** 移动端常驻底部导航：一键拨号 + 微信客服 + 预约演示 */
export function MobileBottomNav() {
  const [showWechat, setShowWechat] = useState(false);

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-white/10 bg-navy-deep/95 backdrop-blur lg:hidden">
        <a href={`tel:${SITE.phone}`} className="flex h-14 flex-col items-center justify-center gap-0.5 text-xs text-slate-200">
          <Phone className="h-5 w-5 text-energy" />
          一键拨号
        </a>
        <button
          type="button"
          onClick={() => setShowWechat(true)}
          className="flex h-14 flex-col items-center justify-center gap-0.5 text-xs text-slate-200"
        >
          <MessageCircle className="h-5 w-5 text-energy" />
          微信客服
        </button>
        <Link href="/contact/#demo" className="flex h-14 flex-col items-center justify-center gap-0.5 bg-energy text-xs font-semibold text-navy-deep">
          <CalendarClock className="h-5 w-5" />
          预约演示
        </Link>
      </div>

      {showWechat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 lg:hidden" onClick={() => setShowWechat(false)}>
          <div className="relative w-full max-w-xs rounded-2xl bg-white p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <button type="button" aria-label="关闭" className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center text-slate-500" onClick={() => setShowWechat(false)}>
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-base font-bold text-navy">微信扫码咨询</h3>
            <div className="mx-auto mt-4 flex h-40 w-40 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
              客服二维码
            </div>
            <p className="mt-3 text-sm text-slate-600">微信号：{SITE.wechat}</p>
          </div>
        </div>
      )}
    </>
  );
}
