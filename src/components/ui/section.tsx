import type { SectionId } from "@content/site";
import { t } from "@/lib/content";
import { cn } from "@/lib/utils";
import { CornerLabels } from "./corner-labels";
import { Reveal } from "./reveal";

type SectionProps = {
  id: SectionId;
  title: string;
  intro?: string;
  className?: string;
  /** Header slot override (e.g. a sticky column wants the header inside it). */
  children: React.ReactNode;
};

/** Section shell: corner labels, `type-h2` title (never animated), optional `type-lede` intro, then content. */
export function Section({ id, title, intro, className, children }: SectionProps) {
  const headingId = `${id}-title`;
  return (
    <section id={id} aria-labelledby={headingId} className={cn("container-site py-(--section-y)", className)}>
      <SectionHeader id={id} headingId={headingId} title={title} intro={intro} />
      {children}
    </section>
  );
}

export function SectionHeader({
  id,
  headingId,
  title,
  intro,
  className,
}: {
  id: SectionId;
  headingId: string;
  title: string;
  intro?: string;
  className?: string;
}) {
  return (
    <header className={cn("mb-(--space-16)", className)}>
      <CornerLabels topic={t.nav.sections[id].short.toLowerCase()} />
      <h2 id={headingId} className="type-h2 mt-(--space-8)">
        {title}
      </h2>
      {intro && (
        <Reveal>
          <p className="type-lede mt-(--space-6) max-w-[36ch] text-fg-muted">{intro}</p>
        </Reveal>
      )}
    </header>
  );
}
