import { useEffect, useState } from "react";
import { BookCallButton } from "@/components/ui/book-call-button";
import { Reveal } from "@/components/ui/reveal";
import { SectionTitle } from "@/components/ui/section";
import { useSiteContent } from "@/lib/content-context";

const rigaTime = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Riga", hour: "2-digit", minute: "2-digit" });

/** Live time in Riga. Ships empty and fills on mount, so a prerendered page is never wrong. */
function RigaClock() {
  const { t } = useSiteContent();
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
  const { pendingCopy, t } = useSiteContent();
  const poster = pendingCopy.letsTalk;

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
              <BookCallButton />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
