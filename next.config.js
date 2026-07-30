/** @type {import('next').NextConfig} */
const nextConfig = {
  // 纯静态导出 (SSG) —— 编译期生成 out 静态站点，0 线上服务器成本
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
  // 静态导出下 next/image 优化不可用，改用 unoptimized（配合 WebP 手动优化）
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
