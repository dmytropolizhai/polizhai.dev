import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { facts, hrefOf, showClientQuote, t } from "@/lib/content";

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
  if (!showClientQuote) return null;

  const testimonials = facts.testimonials;
  const copyDeck = t.testimonials;

  return (
    <Section id="client" title={copyDeck.heading} intro={copyDeck.subheading}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
        {testimonials.map((item, idx) => {
          const itemCopy = copyDeck.items[item.id] ?? {
            quote: t.client.quote,
            context: "Review",
          };
          const initials = getInitials(item.name);
          const projectFacts = (facts.projects as Record<string, { name: string; display: string; links: readonly { kind: string; href: string }[] }>)[item.project];
          const rawLiveLink = projectFacts?.links.find((l) => l.kind === "visit" || l.kind === "app")?.href ?? null;
          const liveHref = hrefOf(rawLiveLink as Parameters<typeof hrefOf>[0]);

          return (
            <Reveal
              key={item.id}
              as="article"
              index={idx}
              className="flex flex-col justify-between border border-line bg-surface p-(--space-8) transition-colors hover:border-line-strong"
            >
              <div>
                <blockquote className="type-h3 font-medium tracking-tight text-fg break-words [text-wrap:pretty]">
                  “{itemCopy.quote}”
                </blockquote>
              </div>

              <div className="mt-(--space-8) flex flex-wrap items-center justify-between gap-4 border-t border-line pt-(--space-6)">
                <div className="flex items-center gap-4 min-w-0">
                  {/* Person Photo / Avatar */}
                  <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden border border-line bg-raised">
                    {item.photo ? (
                      <img
                        src={item.photo}
                        alt={item.name}
                        width={48}
                        height={48}
                        loading="lazy"
                        decoding="async"
                        className="size-full object-cover grayscale contrast-[1.04] transition-[filter] duration-300 hover:grayscale-0"
                      />
                    ) : (
                      <span aria-hidden="true" className="font-mono text-xs font-bold tracking-wider text-fg-muted">
                        {initials}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="type-body font-bold text-fg leading-none">{item.name}</p>
                      <span className="type-label border border-line px-1.5 py-0.5 font-mono text-[10px] text-fg-subtle uppercase tracking-wider">
                        {item.kind === "venture" ? "Co-founder" : "Client"}
                      </span>
                    </div>
                    <p className="type-label mt-1 text-fg-muted uppercase tracking-wider">
                      {item.role} · {item.company}
                    </p>
                    {itemCopy.context && (
                      <p className="type-small mt-0.5 text-fg-subtle [text-wrap:pretty]">
                        {itemCopy.context}
                      </p>
                    )}
                  </div>
                </div>

                {liveHref ? (
                  <a
                    href={liveHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${projectFacts?.name ?? "project"} live site (${projectFacts?.display ?? "opens in new tab"})`}
                    className="type-label group inline-flex min-h-[44px] items-center gap-1.5 border border-line bg-surface px-3 py-2 font-mono text-fg-muted transition-colors hover:border-line-strong hover:bg-raised hover:text-fg focus-visible:outline-2 focus-visible:outline-inverse focus-visible:outline-offset-2"
                  >
                    <span>{projectFacts?.display ?? projectFacts?.name ?? "Live site"}</span>
                    <ArrowUpRight
                      className="size-3.5 text-fg-subtle transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </a>
                ) : (
                  <span className="type-label inline-flex min-h-[44px] items-center gap-1.5 border border-line bg-surface px-3 py-2 font-mono text-fg-subtle">
                    {projectFacts?.display ?? projectFacts?.name ?? "Project"}
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
