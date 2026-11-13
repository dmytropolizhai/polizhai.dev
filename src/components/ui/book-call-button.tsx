import { useEffect } from "react";
import { getCalApi } from "@calcom/embed-react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hrefOf } from "@/lib/content";
import { useSiteContent } from "@/lib/content-context";

const CAL_UI_CONFIG = {
  theme: "dark" as const,
  styles: { branding: { brandColor: "#ffffff" } },
  hideEventTypeDetails: false,
  layout: "month_view" as const,
};

const CAL_MODAL_CONFIG = {
  layout: "month_view" as const,
  theme: "dark" as const,
};

function extractCalLink(href: string): string | null {
  try {
    const url = new URL(href);
    if (url.hostname !== "cal.com" && url.hostname !== "www.cal.com") return null;
    const path = url.pathname.replace(/^\/+|\/+$/g, "");
    return path || null;
  } catch {
    return null;
  }
}

type BookCallButtonProps = {
  className?: string;
};

/** Opens the Cal.com briefing embed modal, falling back to a new tab if the embed is unavailable. */
export function BookCallButton({ className }: BookCallButtonProps) {
  const { facts, t } = useSiteContent();
  const callHref = hrefOf(facts.contact.find((c) => c.id === "call")?.href);
  const calLink = callHref ? extractCalLink(callHref) : null;

  useEffect(() => {
    if (!calLink) return;
    (async function () {
      try {
        const cal = await getCalApi();
        cal("ui", CAL_UI_CONFIG);
      } catch {
        // Embed failed to preload
      }
    })();
  }, [calLink]);

  if (!callHref) {
    return null;
  }

  const handleClick = async () => {
    if (!calLink) {
      window.open(callHref, "_blank", "noopener,noreferrer");
      return;
    }
    try {
      const cal = await getCalApi();
      cal("ui", CAL_UI_CONFIG);
      cal("modal", {
        calLink,
        config: CAL_MODAL_CONFIG,
      });
    } catch {
      window.open(callHref, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Button
      type="button"
      variant="primary"
      className={className}
      onClick={handleClick}
    >
      <Calendar className="size-4" aria-hidden="true" />
      <span>{t.contact.labels.call}</span>
    </Button>
  );
}
