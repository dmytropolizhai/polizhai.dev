import type { ProjectId } from "@content/site";
import { lazy, Suspense, useState } from "react";
import { ProjectCanvas } from "./project-canvas";

// The dialog (Base UI) is only needed after a click, so it stays out of the first bundle (160 kB JS budget).
const ProjectDialog = lazy(() => import("./project-dialog").then((m) => ({ default: m.ProjectDialog })));

type Props = { onHoverChange?: (over: boolean) => void; className?: string };

/** The project showcase: the draggable canvas plus the dialog it opens. Owns which project is open. */
export function ProjectExplorer({ onHoverChange, className }: Props) {
    const [open, setOpen] = useState<ProjectId | null>(null);
    // Mount the dialog on the first open and keep it, so the close transition can play.
    const [wanted, setWanted] = useState(false);
    const onOpen = (id: ProjectId) => {
        setWanted(true);
        setOpen(id);
    };

    return (
        <>

            <ProjectCanvas onOpen={onOpen} onHoverChange={onHoverChange} className={className} />
            {wanted && (
                <Suspense fallback={null}>
                    <ProjectDialog id={open} onClose={() => setOpen(null)} />
                </Suspense>
            )}
        </>
    );
}
