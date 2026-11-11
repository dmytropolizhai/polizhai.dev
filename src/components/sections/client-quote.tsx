import { CornerLabels } from "@/components/ui/corner-labels";
import { Reveal } from "@/components/ui/reveal";
import { SectionTitle } from "@/components/ui/section";
import { facts, isTbd, showClientQuote, t } from "@/lib/content";

/** §6 What a client says. Renders only after sign-off (`showClientQuote`). The quote is the loud line. */
export function ClientQuote() {
  if (!showClientQuote) return null;
  const q = facts.clientQuote;
  const attribution = [q.name, isTbd(q.role) ? null : q.role, q.company].filter(Boolean).join(" · ");

  return (
    <section id="client" aria-labelledby="client-title" className="container-site py-(--section-y)">
      <CornerLabels topic={t.nav.sections.client.short.toLowerCase()} />
      <SectionTitle id="client-title" className="mt-(--space-8)">
        {t.client.heading}
      </SectionTitle>
      <Reveal>
        <figure className="mt-(--space-8) border-l-2 border-fg pl-(--space-8)">
          <blockquote className="type-h2">
            {t.client.quote}
          </blockquote>
          <figcaption className="type-label mt-(--space-8) text-fg-muted">{attribution}</figcaption>
        </figure>
      </Reveal>
    </section>
  );
}
