import { withPayload } from '@payloadcms/next/withPayload';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 本地后台专用 Next 应用，不做静态导出
  reactStrictMode: true,
  output: 'standalone',
  outputFileTracingIncludes: {
    '/*': ['./node_modules/@libsql/win32-x64-msvc/**/*'],
  },
};

export default withPayload(nextConfig);
