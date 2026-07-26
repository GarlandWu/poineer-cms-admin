import type { Protocol } from '@/types/schema';
import { cn } from '@/lib/utils';

/** 工业协议标签 */
export function ProtocolTag({ protocol, className }: { protocol: Protocol; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border border-electric/30 bg-electric/10 px-2.5 py-1 text-xs font-medium text-electric-light',
        className
      )}
    >
      {protocol}
    </span>
  );
}

export function ProtocolTagList({ protocols }: { protocols: Protocol[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {protocols.map((p) => (
        <ProtocolTag key={p} protocol={p} />
      ))}
    </div>
  );
}
