import Link from "next/link";
import { useState, type MouseEvent } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Mark } from "@/components/ui/mark";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section";
import { TextLink } from "@/components/ui/text-link";
import type { ServiceId } from "@/lib/content";
import { useSiteContent } from "@/lib/content-context";
import { cn } from "@/lib/utils";

const HEADING_ID = "services-title";
const PANEL_ID = "services-panel";

/**
 * Desktop grid rows: row 1 is the prompt, rows 2-5 the services, row 6 a flexible filler, so a tall
 * panel (support tiers) grows the filler instead of stretching the rows. Static strings for Tailwind.
 */
const ROW_START = ["lg:row-start-2", "lg:row-start-3", "lg:row-start-4", "lg:row-start-5"] as const;

/**
 * §3b Services: the picker (design/landing-page.md). Four rows as a native radio group (arrow keys
 * for free), the first preselected so the panel is never empty. The panel sits beside the rows from
 * lg up and directly under the selected row below that (CSS `order`, one panel in the DOM).
 * The one moving thing is the panel swap; titles never animate.
 */
export function Services() {
  const { serviceIds, servicePriceLabel, services, showServices, t } = useSiteContent();
  const [selected, setSelected] = useState<ServiceId>(serviceIds[0] ?? "landing");
  // The prompt stays until the visitor picks something themselves.
  const [touched, setTouched] = useState(false);
  if (!showServices) return null;

  const s = t.services;
  const selectedIndex = serviceIds.indexOf(selected);
  const selectedItem = services.items.find((item) => item.id === selected);

  return (
    <section
      id="services"
      aria-labelledby={HEADING_ID}
      className="container-site flex flex-col py-(--section-y) lg:min-h-svh"
    >
      <SectionHeader headingId={HEADING_ID} title={s.heading} intro={s.intro} />

      <Reveal>
        <fieldset
          className="m-0 grid min-w-0 grid-cols-1 border-0 p-0 lg:grid-cols-12 lg:grid-rows-[auto_repeat(4,auto)_1fr] lg:gap-x-(--space-12)"
        >
          <legend className="sr-only">{s.heading}</legend>

          <p
            aria-hidden={touched || undefined}
            className={cn(
              "type-label order-0 pb-(--space-4) text-fg-muted lg:col-span-8 lg:row-start-1",
              touched && "invisible",
            )}
          >
            {s.pickPrompt}
          </p>

          {services.items.map((item, i) => {
            const id = item.id;
            const checked = id === selected;
            return (
              <label
                key={id}
                style={{ order: (i + 1) * 2 }}
                className={cn(
                  "group flex cursor-pointer items-baseline border-t border-line py-(--space-6) [--row-fs:clamp(2rem,5.2vw,4.5rem)] transition-colors duration-(--dur-micro) ease-move lg:col-span-8 lg:col-start-1",
                  ROW_START[i],
                  i === services.items.length - 1 && "border-b",
                  !checked && "hover:bg-surface",
                  "has-[input:focus-visible]:outline-2 has-[input:focus-visible]:-outline-offset-2 has-[input:focus-visible]:outline-inverse",
                )}
              >
                <input
                  type="radio"
                  name="service"
                  value={id}
                  checked={checked}
                  aria-controls={PANEL_ID}
                  onChange={() => setSelected(id)}
                  onClick={() => setTouched(true)}
                  className="sr-only"
                />
                {/* "You are here" is the mark, not a grey name (display type is never grey). The slot is
                    reserved on every row, so names never shift when the selection moves. */}
                <span aria-hidden="true" className="max-lg:hidden w-[calc(var(--row-fs)*0.85)] shrink-0 text-[calc(var(--row-fs)*0.6)]">
                  <Mark className={cn("text-fg", !checked && "invisible")} />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-y-(--space-2)">
                  <span className="type-display min-w-0 text-(length:--row-fs) font-extrabold [font-stretch:var(--width-wide)] text-fg [overflow-wrap:anywhere]">
                    {item.name}
                  </span>
                  <span
                    className={cn(
                      "type-small type-num whitespace-nowrap transition-colors duration-(--dur-micro) ease-move",
                      checked ? "text-fg" : "text-fg-muted group-hover:text-fg",
                    )}
                  >
                    {servicePriceLabel(id)}
                  </span>
                </span>
              </label>
            );
          })}

          <div
            id={PANEL_ID}
            role="region"
            aria-label={selectedItem?.name ?? s.items[selected].name}
            style={{ order: (selectedIndex + 1) * 2 + 1 }}
            className="pt-(--space-2) pb-(--space-12) lg:col-span-4 lg:col-start-9 lg:row-[2/7] lg:self-start lg:border-t lg:border-line lg:pt-(--space-8) lg:pb-0"
          >
            <ServicePanel
              key={selected}
              id={selected}
              className={cn(
                touched &&
                  "animate-[rise-in_var(--dur-component)_var(--motion-arrive)_both] motion-reduce:animate-none",
              )}
            />
          </div>
        </fieldset>
      </Reveal>
    </section>
  );
}

function ServicePanel({ id, className }: { id: ServiceId; className?: string }) {
  const { projectsById, servicePriceLabel, serviceProof, services, t, tierPriceLabel } = useSiteContent();
  const s = t.services;
  const item = services.items.find((entry) => entry.id === id);
  const proof = serviceProof(id);

  return (
    <div className={cn("flex flex-col gap-(--space-8)", className)}>
      <div>
        <p className="type-lede max-w-[28ch] text-fg">{item?.outcome ?? s.items[id].outcome}</p>
        <p className="type-h3 type-num mt-(--space-4) [font-stretch:var(--width-wide)] font-extrabold text-fg">
          {servicePriceLabel(id)}
        </p>
      </div>

      {id === "support" ? (
        <div>
          <table className="w-full border-collapse text-left">
            <tbody>
              {services.supportTiers.map((tier) => (
                <tr key={tier.id} className="border-t border-line last:border-b">
                  <th scope="row" className="py-(--space-3) pr-(--space-4) align-top font-normal">
                    <span className="block text-[0.9375rem] font-bold text-fg">{tier.name}</span>
                    <span className="type-small mt-(--space-1) block text-fg-muted">{tier.includes}</span>
                  </th>
                  <td className="type-small type-num py-(--space-3) text-right align-top whitespace-nowrap text-fg">
                    {tierPriceLabel(tier.id)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="type-small mt-(--space-3) text-fg-muted">{s.support.freeNote}</p>
          <TextLink href="#how" className="type-small mt-(--space-2)">
            {t.how.cells.support.title}
          </TextLink>
        </div>
      ) : (
        proof.length > 0 && (
          <div>
            <p className="type-label text-fg-muted">{s.proofLabel}</p>
            <ul className="mt-(--space-1) flex flex-wrap gap-x-(--space-6)">
              {proof.map((pid) => {
                const proj = projectsById[pid];
                if (!proj) return null;
                return (
                  <li key={pid}>
                    <TextLink href={`#work-${pid}`} onClick={replayHash} className="gap-(--space-2)">
                      {proj.status === "live" && <Mark />}
                      {proj.name}
                    </TextLink>
                  </li>
                );
              })}
            </ul>
          </div>
        )
      )}

      <div>
        <Link href="#contact" className={buttonVariants({ variant: "primary" })}>
          {s.cta}
        </Link>
      </div>
    </div>
  );
}

/**
 * The canvas opens a project on `hashchange` (`#work-<id>`, the same deep link Journey uses). Clicking
 * the link for the hash that is already set fires no event, so replay it by hand.
 */
function replayHash(e: MouseEvent<HTMLAnchorElement>) {
  if (location.hash !== e.currentTarget.hash) return;
  e.preventDefault();
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}
