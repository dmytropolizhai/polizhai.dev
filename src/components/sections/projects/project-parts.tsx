import Link from "next/link";
import type { ProjectId } from "@content/site";
import { buttonVariants } from "@/components/ui/button";
import { Status } from "@/components/ui/status";
import { TagList } from "@/components/ui/tag";
import { ExternalNote, TextLink, externalProps } from "@/components/ui/text-link";
import { hrefOf } from "@/lib/content";
import { useSiteContent } from "@/lib/content-context";
import { caseStudyPagesLive } from "@/lib/pending";
import { cn } from "@/lib/utils";

/** Kind label left, live marker right. */
export function TileMeta({ id }: { id: ProjectId }) {
  const { projectsById } = useSiteContent();
  const project = projectsById[id];
  if (!project) return null;
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="type-label text-fg-muted">{project.kindLabel}</span>
      {project.status !== "hidden" && <Status status={project.status} />}
    </div>
  );
}

/** One-liner, role, optional note, tags. */
export function TileBody({ id, oneLinerClass = "text-fg-muted" }: { id: ProjectId; oneLinerClass?: string }) {
  const { pendingCopy, projectsById, t } = useSiteContent();
  const project = projectsById[id];
  if (!project) return null;
  return (
    <>
      <p className={cn("type-body mt-3", oneLinerClass)}>{project.oneLiner}</p>
      <p className="type-small mt-2 text-fg-muted">{project.role}</p>
      {project.note && <p className="type-small mt-1 text-fg-subtle">{project.note}</p>}
      {pendingCopy.projectOutcome.show && (
        <div className="mt-5 border-t border-line pt-4">
          <p className="type-label text-fg-muted">{t.work.outcomeLabel}</p>
          <p className="type-body mt-1">{project.outcome}</p>
        </div>
      )}
      {project.stack.length > 0 && (
        <div className="mt-5">
          <TagList items={project.stack} />
        </div>
      )}
    </>
  );
}

/**
 * Actions from `facts.projects[id].links`. The first becomes a pill (`lead`), the rest underlined
 * links. The dialog uses one shared style for all projects, so none is singled out.
 */
export function TileActions({ id, lead }: { id: ProjectId; lead: "primary" | "secondary" | "link" }) {
  const { projectsById, t } = useSiteContent();
  const project = projectsById[id];
  if (!project) return null;
  const links = project.links
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
        <Link href={first.href} {...externalProps(first.href)} className={buttonVariants({ variant: lead, size: "sm" })}>
          {t.common.linkLabels[first.kind]}
          <ExternalNote href={first.href} />
        </Link>
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
