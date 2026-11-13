import type { ProjectStatus } from "@content/site";
import { useSiteContent } from "@/lib/content-context";
import { Mark } from "./mark";

/** Live marker: the mark plus "live". Code-only: no mark, subtle grey. State is shape + word, never colour alone. */
export function Status({ status }: { status: Exclude<ProjectStatus, "hidden"> }) {
  const { t } = useSiteContent();
  if (status === "live") {
    return (
      <span className="type-label inline-flex items-center gap-2 text-fg">
        <Mark />
        {t.common.statusLabels.live}
      </span>
    );
  }
  return <span className="type-label text-fg-subtle">{t.common.statusLabels["repo-only"]}</span>;
}
