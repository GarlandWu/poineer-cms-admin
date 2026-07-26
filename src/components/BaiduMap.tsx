import { MapPin, ExternalLink } from 'lucide-react';
import { SITE } from '@/lib/utils';

/**
 * 百度地图嵌入。
 * - 默认用 `api.map.baidu.com/marker`（output=html）iframe，**无需 AK 密钥**即可展示带标注的地图。
 * - 若配置了 `NEXT_PUBLIC_BAIDU_MAP_AK`，则改用静态图 API（更快、更适合 SSG，无第三方脚本）。
 * 坐标与地址取自 SITE.map / SITE.address。
 */
export function BaiduMap({ className }: { className?: string }) {
  const { lng, lat, coordType } = SITE.map;
  const title = encodeURIComponent(SITE.shortName);
  const content = encodeURIComponent(SITE.address);
  const ak = process.env.NEXT_PUBLIC_BAIDU_MAP_AK;

  // 在百度地图打开（始终可用，移动端可唤起 App 导航）
  const openUrl = `https://api.map.baidu.com/marker?location=${lat},${lng}&title=${title}&content=${content}&output=html&coord_type=${coordType}&zoom=16&src=webapp.energy-portal`;

  // 无需密钥的 iframe 嵌入
  const iframeSrc = openUrl;

  // 有 AK 时的静态图（1:2 宽高，2x 清晰）
  const staticSrc = ak
    ? `https://api.map.baidu.com/staticimage/v2?ak=${ak}&center=${lng},${lat}&zoom=16&width=760&height=360&scale=2&coordtype=${coordType}&markers=${lng},${lat}&markerStyles=l,A,0xff22c55e`
    : null;

  return (
    <div className={className}>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-navy">
        {staticSrc ? (
          <a href={openUrl} target="_blank" rel="noreferrer" aria-label="在百度地图查看公司位置">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={staticSrc} alt={`${SITE.shortName}公司位置地图`} className="h-56 w-full object-cover md:h-72" loading="lazy" />
          </a>
        ) : (
          <iframe
            src={iframeSrc}
            title={`${SITE.shortName}公司位置`}
            className="h-56 w-full md:h-72"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        )}
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2 text-sm text-slate-400">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-energy" />
          {SITE.address}
        </p>
        <a
          href={openUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 items-center gap-1.5 self-start rounded-lg border border-electric/50 bg-electric/10 px-4 text-sm font-medium text-electric-light hover:bg-electric/20"
        >
          在百度地图查看 <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
