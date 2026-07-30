'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { SITE } from '@/lib/utils';

/**
 * 预约 3D 演示表单。
 * 纯静态导出下无后端，示例采用邮件 mailto 兜底；生产可替换为表单托管服务 (如腾讯云函数/第三方表单)。
 */
export function DemoForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-energy/30 bg-energy/10 p-8 text-center">
        <CheckCircle2 className="h-10 w-10 text-energy" />
        <p className="text-lg font-semibold text-navy-deep dark:text-white">预约提交成功</p>
        <p className="text-sm text-slate-600 dark:text-slate-300">我们的能效顾问将在 1 个工作日内与您联系，安排专属 3D 数字孪生大屏演示。</p>
      </div>
    );
  }

  const field = 'h-11 w-full rounded-lg border border-black/10 dark:border-white/15 bg-white dark:bg-navy px-3 text-sm text-navy-deep dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-500 focus:border-energy focus:outline-none';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input required name="name" placeholder="您的称呼 *" className={field} />
        <input required name="phone" type="tel" placeholder="联系电话 *" className={field} />
      </div>
      <input name="company" placeholder="公司名称" className={field} />
      <select name="scene" className={field} defaultValue="">
        <option value="" disabled>请选择应用场景</option>
        {SITE.demoScenes.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>
      <textarea name="message" rows={3} placeholder="简单描述您的采集点位规模与需求" className="w-full rounded-lg border border-black/10 dark:border-white/15 bg-white dark:bg-navy px-3 py-2 text-sm text-navy-deep dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-500 focus:border-energy focus:outline-none" />
      <button type="submit" className="h-11 w-full rounded-lg bg-energy text-sm font-semibold text-navy-deep hover:bg-energy-dark">
        提交预约 · 获取 3D 演示
      </button>
    </form>
  );
}
