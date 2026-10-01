import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig } from 'payload';
import { sqliteAdapter } from '@payloadcms/db-sqlite';
import { lexicalEditor } from '@payloadcms/richtext-lexical';

import { Users } from './collections/Users';
import { Media } from './collections/Media';
import { Solutions } from './collections/Solutions';
import { Products } from './collections/Products';
import { CaseStudies } from './collections/CaseStudies';
import { News } from './collections/News';
import { Partners } from './collections/Partners';
import { SiteSettings } from './globals/SiteSettings';
import { Homepage } from './globals/Homepage';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: { titleSuffix: ' · 能源数字孪生后台' },
    importMap: { baseDir: path.resolve(dirname) },
  },
  collections: [Users, Media, Solutions, Products, CaseStudies, News, Partners],
  globals: [SiteSettings, Homepage],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'dev-only-insecure-secret',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: sqliteAdapter({
    client: { url: process.env.DATABASE_URI || 'file:./energy-portal.db' },
  }),
  // 上传目录由桌面端配置为可写路径，构建时会随静态站一并发布
});
