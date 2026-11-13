import type { ProjectId } from "@content/site";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { NumberTicker } from "@/components/ui/number-ticker";
import { useSiteContent } from "@/lib/content-context";
import { useRef } from "react";
import { TileActions, TileBody, TileMeta } from "./project-parts";

/** One shared style for every project's lead action, so no project is singled out. */
const LEAD = "secondary";

type Props = {
  id: ProjectId | null;
  onClose: () => void;
  finalFocusTarget?: (id: ProjectId) => HTMLElement | null;
};

/**
 * Project detail: name, kind and status, one-liner, role, stack, stats, links.
 * Opens from a card on the canvas or an entry in the Journey timeline. Focus goes back to that
 * trigger on close (`finalFocus`), which also covers a deep link (`#work-<id>`) where no card had focus.
 */
export function ProjectDialog({ id, onClose, finalFocusTarget }: Props) {
  // Keep the last project while the exit transition runs, so the content does not blank out.
  const shown = useRef<ProjectId | null>(id);
  if (id) shown.current = id;
  const current = shown.current;

  return (
    <Dialog open={id !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        finalFocus={() => {
          if (!current) return true;
          return (finalFocusTarget ? finalFocusTarget(current) : document.getElementById(`work-${current}`)) ?? true;
        }}
      >
        {current && <Body id={current} />}
      </DialogContent>
    </Dialog>
  );
}

function Body({ id }: { id: ProjectId }) {
  const { projectsById } = useSiteContent();
  const project = projectsById[id];
  if (!project) return null;
  return (
    <>
      <DialogHeader>
        <TileMeta id={id} />
        <DialogTitle className="mt-2">{project.name}</DialogTitle>
      </DialogHeader>
      <TileBody id={id} />
      {project.stats.length > 0 && (
        <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4 border-t border-line pt-5">
          {project.stats.map((stat) => (
            <div key={stat.id}>
              <dd className="type-h3 type-num">
                <NumberTicker value={stat.value} play />
                {stat.suffix}
              </dd>
              <dt className="type-small mt-1 text-fg-muted">{stat.label}</dt>
            </div>
          ))}
        </dl>
      )}
      <TileActions id={id} lead={LEAD} />
    </>
  );
}
