import Link from "next/link";
import { useEffect, useState } from "react";
import { getCalApi } from "@calcom/embed-react";
import { Calendar } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionTitle } from "@/components/ui/section";
import { externalProps } from "@/components/ui/text-link";
import { facts, hrefOf, t } from "@/lib/content";
import { pendingCopy } from "@/lib/pending";

const rigaTime = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Riga", hour: "2-digit", minute: "2-digit" });

/** Live time in Riga. Ships empty and fills on mount, so a prerendered page is never wrong. */
function RigaClock() {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const tick = () => setNow(rigaTime.format(new Date()));
    tick();
    // Align to the next minute, then tick each minute.
    let interval = 0;
    const timeout = window.setTimeout(() => {
      tick();
      interval = window.setInterval(tick, 60_000);
    }, 60_000 - (Date.now() % 60_000));
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, []);
  return (
    <p className="type-label text-right text-fg-muted">
      {t.contact.localTimeLabel} · <time className="type-num" dateTime={now ?? undefined}>{now ?? "--:--"}</time> <span className="font-mono text-fg-subtle">EET</span>
    </p>
  );
}

/** §7 Contact: the last poster. Full height, grain, pinned bottom-left. One path, no form. */
export function Contact() {
  const call = facts.contact.find((c) => c.id === "call");
  const callHref = hrefOf(call?.href);
  const poster = pendingCopy.letsTalk;
  const calLink = callHref ? callHref.replace("https://cal.com/", "") : "dmytropolizhai/briefing";

  useEffect(() => {
    if (!calLink) return;
    (async function () {
      try {
        const cal = await getCalApi();
        cal("ui", {
          theme: "dark",
          styles: { branding: { brandColor: "#ffffff" } },
          hideEventTypeDetails: false,
          layout: "month_view",
        });
      } catch {
        // Fallback to direct navigation if Cal embed fails to load
      }
    })();
  }, [calLink]);

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="texture-grain relative flex min-h-svh flex-col"
    >
      <div className="container-site relative z-(--z-content) flex flex-1 flex-col pt-(--section-y) pb-(--section-y)">
        <RigaClock />

        <div className="mt-auto pt-(--space-24)">
          {poster.show && (
            <p
              aria-hidden="true"
              className="type-display text-[clamp(2.5rem,11.5vw,9rem)] tracking-[-0.06em] whitespace-nowrap"
            >
              {poster.text}
            </p>
          )}
          <SectionTitle id="contact-title" className={poster.show ? "mt-(--space-8)" : undefined}>
            {t.contact.heading}
          </SectionTitle>

          <Reveal>
            <p className="type-body mt-(--space-4) max-w-[54ch] text-fg-muted">{t.contact.body}</p>
            <div className="mt-(--space-8) flex flex-wrap items-center gap-3">
              {callHref && (
                <Link
                  href={callHref}
                  {...externalProps(callHref)}
                  className={buttonVariants({ variant: "primary" })}
                  data-cal-link={calLink}
                  data-cal-config='{"layout":"month_view","theme":"dark"}'
                >
                  <Calendar className="size-4" aria-hidden="true" />
                  <span>{t.contact.labels.call}</span>
                </Link>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
