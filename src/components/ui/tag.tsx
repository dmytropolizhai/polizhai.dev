import { cn } from "@/lib/utils";

/** Design system §9 Tag: pill, 28px, 1px line-strong, 13px medium, muted. Not clickable. */
export function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <li
      className={cn(
        "inline-flex h-7 items-center rounded-pill border border-line-strong px-3 text-label font-medium text-fg-muted",
        className,
      )}
    >
      {children}
    </li>
  );
}

export function TagList({ items, label }: { items: readonly string[]; label?: string }) {
  return (
    <ul aria-label={label} className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Tag key={item}>{item}</Tag>
      ))}
    </ul>
  );
}
