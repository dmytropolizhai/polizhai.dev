import { useEffect, useState } from "react";
import { Send } from "@/components/animate-ui/icons/send";
import { buttonVariants } from "@/components/ui/button";
import { CopyEmailButton } from "@/components/ui/copy-email-button";
import { CornerLabels } from "@/components/ui/corner-labels";
import { Reveal } from "@/components/ui/reveal";
import { SectionTitle } from "@/components/ui/section";
import { ExternalNote, externalProps } from "@/components/ui/text-link";
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
    <p className="type-label mt-2 text-right text-fg-muted">
      {t.contact.localTimeLabel} · <time className="type-num">{now ?? "--:--"}</time>
    </p>
  );
}

/** §7 Contact: the last poster. Full height, grain, pinned bottom-left. One path, no form. */
export function Contact() {
  const [email, telegram, call] = facts.contact;
  const telegramHref = hrefOf(telegram?.href);
  const callHref = hrefOf(call?.href);
  const [sendHover, setSendHover] = useState(false);
  const poster = pendingCopy.letsTalk;

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="texture-grain relative flex min-h-svh flex-col"
    >
      <div className="container-site relative z-(--z-content) flex flex-1 flex-col pt-(--section-y)">
        <CornerLabels topic={t.nav.sections.contact.short.toLowerCase()} aside={<RigaClock />} />

        <div className="mt-auto pt-(--space-24)">
          {poster.show && (
            <p
              aria-hidden="true"
              className="type-display text-[clamp(3rem,13vw,10rem)] whitespace-nowrap"
            >
              {poster.text}
            </p>
          )}
          <SectionTitle id="contact-title" className={poster.show ? "mt-(--space-8)" : undefined}>
            {t.contact.heading}
          </SectionTitle>

          <Reveal>
            <p className="type-body mt-(--space-4) text-fg-muted">{t.contact.body}</p>
            {email && (
              <p className="mt-(--space-8)">
                <a
                  href={email.href}
                  className="type-h3 break-all underline decoration-control decoration-1 underline-offset-[0.2em] hover:decoration-fg"
                >
                  {email.display}
                </a>
              </p>
            )}
            <div className="mt-(--space-8) flex flex-wrap items-center gap-3">
              <CopyEmailButton label={t.a11y.copy.button} icon="copy" />
              {telegramHref && (
                <a
                  href={telegramHref}
                  {...externalProps(telegramHref)}
                  className={buttonVariants({ variant: "secondary" })}
                  onPointerEnter={() => setSendHover(true)}
                  onPointerLeave={() => setSendHover(false)}
                >
                  <Send animate={sendHover} aria-hidden="true" />
                  {t.contact.labels.telegram}
                  <span className="font-normal text-fg-muted">{telegram?.display}</span>
                  <ExternalNote href={telegramHref} />
                </a>
              )}
              {/* Hidden until the booking link exists (open item 8). */}
              {callHref && (
                <a href={callHref} {...externalProps(callHref)} className={buttonVariants({ variant: "secondary" })}>
                  {t.contact.labels.call}
                  <ExternalNote href={callHref} />
                </a>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
