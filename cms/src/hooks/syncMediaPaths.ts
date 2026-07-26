import type { CollectionBeforeChangeHook } from 'payload';

/**
 * 生成 beforeChange 钩子：把「媒体选择器字段」(upload) 选中的媒体，
 * 解析为 /uploads/<filename> 写入同组的「路径文本字段」。
 * 这样后台可下拉选图，而内容里存的仍是路径字符串（前端零改动）。
 *
 * @param pairs [选择器字段名, 目标路径字段名][]
 */
export const syncMediaPaths = (pairs: [pick: string, target: string][]): CollectionBeforeChangeHook =>
  async ({ data, req }) => {
    for (const [pick, target] of pairs) {
      const v = (data as any)?.[pick];
      if (!v) continue;
      const id = typeof v === 'object' ? (v.id ?? v.value) : v;
      try {
        const m: any = await req.payload.findByID({ collection: 'media', id });
        if (m?.filename) (data as any)[target] = `/uploads/${m.filename}`;
      } catch {
        /* 媒体不存在则忽略，保留原路径 */
      }
    }
    return data;
  };
