'use client';

import { useEffect } from 'react';
import { useField, useFormFields } from '@payloadcms/ui';
import type { TextFieldClientComponent } from 'payload';

/**
 * 路径字段的自定义组件：监听同组的「媒体选择器」(名为 `${path}Pick`) ，
 * 一旦选中媒体，立即把 /uploads/<filename> 写入本路径字段（所见即所得），
 * 同时仍可手动编辑路径。服务端 syncMediaPaths 钩子作为兜底。
 */
export const MediaPathField: TextFieldClientComponent = ({ path, field }) => {
  const { value, setValue } = useField<string>({ path });
  const pickPath = `${path}Pick`;
  const pickValue = useFormFields(([fields]) => fields?.[pickPath]?.value) as
    | number
    | string
    | { id?: number | string; value?: number | string }
    | undefined;

  useEffect(() => {
    if (!pickValue) return;
    const id =
      typeof pickValue === 'object' ? pickValue.id ?? pickValue.value : pickValue;
    if (id == null) return;
    let cancelled = false;
    fetch(`/api/media/${id}?depth=0`)
      .then((r) => (r.ok ? r.json() : null))
      .then((doc) => {
        if (!cancelled && doc?.filename) setValue(`/uploads/${doc.filename}`);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [pickValue, setValue]);

  const label = typeof field?.label === 'string' ? field.label : path;

  return (
    <div className="field-type text">
      <label className="field-label" htmlFor={`field-${path}`}>
        {label}
      </label>
      <input
        id={`field-${path}`}
        type="text"
        className="field-input"
        value={value ?? ''}
        onChange={(e) => setValue(e.target.value)}
        style={{ width: '100%', padding: '8px 10px', borderRadius: 4 }}
      />
      {field?.admin?.description && typeof field.admin.description === 'string' && (
        <div className="field-description">{field.admin.description}</div>
      )}
    </div>
  );
};
