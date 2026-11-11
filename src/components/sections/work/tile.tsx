import type { ProjectId } from "@content/site";
import { buttonVariants } from "@/components/ui/button";
import { Status } from "@/components/ui/status";
import { TagList } from "@/components/ui/tag";
import { ExternalNote, TextLink, externalProps } from "@/components/ui/text-link";
import { Reveal } from "@/components/ui/reveal";
import { usePlayTrigger } from "@/hooks/use-play-trigger";
import { facts, hrefOf, t } from "@/lib/content";
import { caseStudyPagesLive } from "@/lib/pending";
import { cn } from "@/lib/utils";

export type Play = { playing: boolean; reduced: boolean };

type TileProps = {
  /** Anchor target `#work-<id>`, linked from Journey. */
  project: ProjectId;
  index: number;
  span: string;
  className?: string;
  /** Children get the play state so each tile owns exactly one animation. */
  children: (play: Play) => React.ReactNode;
};

/**
 * Bento tile shell (design-system §9 Project card + Bento grid). Square, --surface, 1px --line,
 * border goes to --control on hover. The tile never moves, scales or tilts; only its animation plays.
 * Not one big link: it holds real links so every action has a name.
 */
export function Tile({ project, index, span, className, children }: TileProps) {
  const { ref, playing, reduced, handlers } = usePlayTrigger<HTMLElement>();
  return (
    <Reveal as="li" id={`work-${project}`} index={index} className={cn("min-w-0 scroll-mt-8", span)}>
      <article
        ref={ref}
        {...handlers}
        className={cn(
          "flex h-full flex-col border border-line bg-surface p-6 transition-colors duration-(--dur-micro) ease-move hover:border-control focus-within:border-control",
          className,
        )}
      >
        {children({ playing, reduced })}
      </article>
    </Reveal>
  );
}

/** Kind label left, live marker right. */
export function TileMeta({ id }: { id: ProjectId }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="type-label text-fg-muted">{t.work.projects[id].kindLabel}</span>
      <Status status={facts.projects[id].status} />
    </div>
  );
}

/** One-liner, role, optional note, tags. */
export function TileBody({ id, oneLinerClass = "text-fg-muted" }: { id: ProjectId; oneLinerClass?: string }) {
  const copy = t.work.projects[id];
  return (
    <>
      <p className={cn("type-body mt-3", oneLinerClass)}>{copy.oneLiner}</p>
      <p className="type-small mt-2 text-fg-muted">{copy.role}</p>
      {"note" in copy && copy.note && <p className="type-small mt-1 text-fg-subtle">{copy.note}</p>}
      <div className="mt-5">
        <TagList items={facts.projects[id].stack} />
      </div>
    </>
  );
}

/**
 * Actions from `facts.projects[id].links`. The first becomes a pill (`lead`), the rest underlined
 * links. Only the Prolifts tile gets the white pill; a grid never shows a row of white buttons.
 */
export function TileActions({ id, lead }: { id: ProjectId; lead: "primary" | "secondary" | "link" }) {
  const links = facts.projects[id].links
    .map((l) => ({ kind: l.kind, href: hrefOf(l.href) }))
    .filter((l): l is { kind: typeof l.kind; href: NonNullable<typeof l.href> } => l.href !== null)
    .filter((l) => caseStudyPagesLive || l.kind !== "caseStudy");
  const [first, ...rest] = links;
  if (!first) return null;

  return (
    <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 pt-1">
      {lead === "link" ? (
        <TextLink href={first.href} className="type-small font-bold">
          {t.common.linkLabels[first.kind]}
        </TextLink>
      ) : (
        <a href={first.href} {...externalProps(first.href)} className={buttonVariants({ variant: lead, size: "sm" })}>
          {t.common.linkLabels[first.kind]}
          <ExternalNote href={first.href} />
        </a>
      )}
      {rest.map((l) => (
        <TextLink key={l.kind} href={l.href} className="type-small font-bold">
          {t.common.linkLabels[l.kind]}
        </TextLink>
      ))}
    </div>
  );
}

/** Placeholder for a missing screenshot: --raised + halftone, a muted label, same ratio as the real file. */
export function ShotPlaceholder({ label, className }: { label: string; className?: string }) {
  return (
    <div aria-hidden="true" className={cn("texture-halftone flex items-end bg-raised p-3", className)}>
      <span className="type-label relative z-(--z-content) bg-raised px-1 text-fg-muted">{label}</span>
    </div>
  );
}
