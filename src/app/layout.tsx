import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { SITE } from '@/lib/utils';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | 工业级能源采集与数字孪生解决方案`,
    template: `%s | ${SITE.shortName}`,
  },
  description: SITE.description,
  keywords: ['能源数据采集', '数字孪生', 'Modbus', 'OPC UA', 'MQTT', '边缘计算网关', '能效大屏', 'PUE 优化', '零碳园区'],
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#061524',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <Header />
        <main className="min-h-screen pb-16 lg:pb-0">{children}</main>
        <Footer />
        <MobileBottomNav />
      </body>
    </html>
  );
}
