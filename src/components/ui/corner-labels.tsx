import { facts } from "@/lib/content";
import { cn } from "@/lib/utils";

/** The poster corner labels: hairline, `polizhai` left, the topic right. */
export function CornerLabels({ topic, aside, className }: { topic: string; aside?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("border-t border-line pt-3", className)}>
      <div className="type-label flex items-baseline justify-between gap-4 text-fg-muted">
        <span>{facts.person.familyName.toLowerCase()}</span>
        <span>{topic}</span>
      </div>
      {aside}
    </div>
  );
}
