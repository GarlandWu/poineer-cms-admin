import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-energy">404</p>
      <h1 className="mt-4 text-xl font-bold text-navy-deep dark:text-white">页面走丢了</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">您访问的页面不存在或已被移动。</p>
      <Link href="/" className="mt-6 inline-flex h-11 items-center rounded-lg bg-energy px-5 text-sm font-semibold text-navy-deep hover:bg-energy-dark">
        返回首页
      </Link>
    </div>
  );
}
