import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { useSiteContent } from "@/lib/content-context";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * §6 What they say: Dual-column static editorial showcase.
 * Displays all verified client and collaborator feedback simultaneously with zero pagination friction.
 */
export function ClientQuote() {
  const { projectsById, showClientQuote, t, testimonials } = useSiteContent();
  if (!showClientQuote) return null;

  const copyDeck = t.testimonials;

  return (
    <Section id="client" title={copyDeck.heading} intro={copyDeck.subheading}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
        {testimonials.map((item, idx) => {
          const initials = getInitials(item.name);
          const projectFacts = projectsById[item.project];
          const kindLabel = item.kind === "venture" ? copyDeck.kinds.venture : copyDeck.kinds.client;
          const distinctRole =
            item.role && item.role.trim().toLowerCase() !== kindLabel.trim().toLowerCase()
              ? item.role.trim()
              : null;
          const affiliation = [distinctRole, item.company].filter(Boolean).join(" · ");
          const projectName = projectFacts?.name;

          return (
            <Reveal
              key={item.id}
              as="article"
              index={idx}
              className="flex flex-col justify-between border border-line bg-surface p-(--space-8) transition-colors hover:border-line-strong"
            >
              <div>
                <blockquote className="type-h3 font-medium tracking-tight text-fg break-words [text-wrap:pretty]">
                  “{item.quote || t.client.quote}”
                </blockquote>
              </div>

              <div className="mt-(--space-8) flex flex-wrap items-center justify-between gap-4 border-t border-line pt-(--space-6)">
                <div className="flex items-center gap-4 min-w-0">
                  {/* Person Photo / Avatar */}
                  <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line bg-raised">
                    {item.photo ? (
                      <img
                        src={item.photo}
                        alt={item.name}
                        width={48}
                        height={48}
                        loading="lazy"
                        decoding="async"
                        className="size-full object-cover"
                      />
                    ) : (
                      <span aria-hidden="true" className="font-mono text-xs font-bold tracking-wider text-fg-muted">
                        {initials}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="type-body font-bold text-fg leading-none">{item.name}</p>
                      <span className="type-label border border-line px-1.5 py-0.5 font-mono text-[10px] text-fg-subtle uppercase tracking-wider">
                        {kindLabel}
                      </span>
                    </div>
                    {affiliation && (
                      <p className="type-label mt-1 text-fg-muted uppercase tracking-wider">
                        {affiliation}
                      </p>
                    )}
                    {item.context && (
                      <p className="type-small mt-0.5 text-fg-subtle [text-wrap:pretty]">
                        {item.context}
                      </p>
                    )}
                  </div>
                </div>

                {projectName && (
                  <span className="type-label font-mono text-fg-muted">
                    {projectName}
                  </span>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
