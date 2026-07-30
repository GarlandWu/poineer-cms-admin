import type { Metadata } from 'next';
import { Phone, MessageCircle, MapPin, Clock, Mail } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { DemoForm } from '@/components/DemoForm';
import { BaiduMap } from '@/components/BaiduMap';
import { SITE } from '@/lib/utils';

export const metadata: Metadata = {
  title: '联系我们',
  description: '预约 3D 数字孪生大屏演示、获取零碳方案与选型咨询。展示工作时间、联系方式与办公地址。',
};

export default function ContactPage() {
  return (
    <Section className="grid gap-10 lg:grid-cols-2">
      <div>
        <h1 className="text-2xl font-bold text-navy-deep dark:text-white md:text-3xl">联系我们</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400 md:text-base">
          {SITE.contactIntro}
        </p>

        <ul className="mt-8 space-y-5">
          <li className="flex items-start gap-3">
            <Phone className="mt-0.5 h-5 w-5 text-energy" />
            <div>
              <div className="text-sm text-slate-500 dark:text-slate-400">销售热线</div>
              <a href={`tel:${SITE.phone}`} className="text-base font-semibold text-navy-deep dark:text-white hover:text-energy">{SITE.phone}</a>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <MessageCircle className="mt-0.5 h-5 w-5 text-energy" />
            <div>
              <div className="text-sm text-slate-500 dark:text-slate-400">微信客服</div>
              <div className="text-base font-semibold text-navy-deep dark:text-white">{SITE.wechat}</div>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <Mail className="mt-0.5 h-5 w-5 text-energy" />
            <div>
              <div className="text-sm text-slate-500 dark:text-slate-400">商务邮箱</div>
              <a href={`mailto:${SITE.email}`} className="text-base font-semibold text-navy-deep dark:text-white hover:text-energy">{SITE.email}</a>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <Clock className="mt-0.5 h-5 w-5 text-energy" />
            <div>
              <div className="text-sm text-slate-500 dark:text-slate-400">工作时间</div>
              <div className="text-base font-semibold text-navy-deep dark:text-white">{SITE.workingHours}</div>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 text-energy" />
            <div>
              <div className="text-sm text-slate-500 dark:text-slate-400">办公地址</div>
              <div className="text-base font-semibold text-navy-deep dark:text-white">{SITE.address}</div>
            </div>
          </li>
        </ul>

        {/* 百度地图嵌入 */}
        <BaiduMap className="mt-8" />
      </div>

      <div id="demo" className="glass-card glow-border p-6 md:p-8">
        <h2 className="text-xl font-bold text-navy-deep dark:text-white">预约 3D 演示</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">填写以下信息，我们将在 1 个工作日内联系您。</p>
        <div className="mt-6"><DemoForm /></div>
      </div>
    </Section>
  );
}
