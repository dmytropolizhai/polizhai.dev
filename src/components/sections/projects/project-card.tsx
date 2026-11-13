import { Mark } from "@/components/ui/mark";
import type { VisibleProjectId } from "@/lib/content";
import { useSiteContent } from "@/lib/content-context";
import { shots } from "@/lib/pending";
import type { ProjectId } from "@content/site";
import { ShotPlaceholder } from "./project-parts";

type Props = {
  id: VisibleProjectId;
  onOpen: (id: ProjectId) => void;
  /** `object-position` for the 16:10 crop of a 2:1 shot. */
  crop?: string;
  eager?: boolean;
  /** Show the one-liner under the name (phone marquee; the canvas card has no room for it). */
  describe?: boolean;
  /** DOM id for deep links; leave out where the card is cloned (marquee). */
  anchorId?: string;
  className?: string;
};

/**
 * The Liquid Glass project card face, shared by the desktop canvas and the phone marquee.
 * Its parent must be the size container (`container-type: inline-size`): the type scales in cqw.
 */
export function ProjectCard({ id, onOpen, crop, eager = false, describe = false, anchorId, className }: Props) {
  const { projectsById, t } = useSiteContent();
  const project = projectsById[id];
  if (!project) return null;
  const shot = project.shot;
  const isRemoteShot = shot?.startsWith("http");
  return (
    <button
      type="button"
      id={anchorId}
      data-card-id={id}
      onClick={() => onOpen(id)}
      // Liquid Glass (Dmytro, 2026-11-12): see .glass-card in index.css.
      className={`glass-card size-full text-left outline-offset-4 ${className ?? ""}`}
    >
      {shot ? (
        isRemoteShot ? (
          <img
            src={shot}
            alt=""
            width={shots.projectSize.w}
            height={shots.projectSize.h}
            draggable={false}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            className="glass-shot size-full object-cover"
            style={crop ? { objectPosition: crop } : undefined}
          />
        ) : (
          <picture className="glass-shot">
            <source type="image/avif" srcSet={`${shot}.avif`} />
            <img
              src={`${shot}.webp`}
              alt=""
              width={shots.projectSize.w}
              height={shots.projectSize.h}
              draggable={false}
              loading={eager ? "eager" : "lazy"}
              decoding="async"
              className="size-full object-cover"
              style={crop ? { objectPosition: crop } : undefined}
            />
          </picture>
        )
      ) : (
        <ShotPlaceholder label="screenshot · 16:10" className="glass-shot" />
      )}
      <span className="glass-plate flex flex-col justify-center px-[4.5cqw] py-[3cqw]">
        <span className="block truncate text-[max(1.125rem,8.5cqw)] leading-none font-bold tracking-[-0.03em] text-white">
          {project.name}
        </span>
        <span className="mt-[2.5cqw] flex min-w-0 items-center gap-[2cqw] text-[max(0.75rem,4.2cqw)] leading-[1.3] text-white">
          {project.status === "live" && (
            <>
              <Mark className="text-white" />
              <span className="sr-only">{t.common.statusLabels.live}, </span>
            </>
          )}
          <span className="truncate">{project.display}</span>
        </span>
        {describe && (
          <span className="mt-[2.5cqw] line-clamp-2 text-[max(0.75rem,4.2cqw)] leading-[1.3] text-white/80">
            {project.oneLiner}
          </span>
        )}
      </span>
    </button>
  );
}
