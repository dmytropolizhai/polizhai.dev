import { Reveal } from "@/components/ui/reveal";
import { SectionTitle } from "@/components/ui/section";
import { t } from "@/lib/content";
import { pendingCopy } from "@/lib/pending";

/** §3 How I work: a spec sheet. Sticky left column (5/12), four hairline rows on the right (7/12). */
export function How() {
  const figures = pendingCopy.budgetFigures;
  return (
    <section id="how" aria-labelledby="how-title" className="container-site py-(--section-y)">
      <div className="grid gap-x-6 gap-y-12 lg:grid-cols-12">
        <header className="lg:col-span-5">
          <div className="lg:sticky lg:top-12">
            <SectionTitle id="how-title">{t.how.heading}</SectionTitle>
            <p className="type-lede mt-(--space-6) max-w-[24ch] text-fg-muted">{t.how.intro}</p>
          </div>
        </header>

        <ol className="lg:col-span-7">
          {t.how.rows.map((row, i) => (
            <Reveal as="li" key={row.title} className="grid gap-4 border-t border-line py-(--space-8) md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-6">
              <h3 className="type-h3">{row.title}</h3>
              <div>
                <p className="type-body text-fg-muted">{row.body}</p>
                {i === 1 && figures.show && (
                  <dl className="mt-6 flex gap-10">
                    {figures.items.map((f) => (
                      <div key={f.label} className="flex flex-col-reverse">
                        <dt className="type-label mt-1 text-fg-muted">{f.label}</dt>
                        <dd className="type-num text-[clamp(2rem,4vw,3rem)] leading-none font-normal tracking-[-0.035em] whitespace-nowrap">
                          {f.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            </Reveal>
          ))}
        </ol>
      </div>

      <Reveal>
        <p className="type-lede mt-(--space-16) border-t border-line pt-(--space-8)">{t.how.languagesLine}</p>
      </Reveal>
    </section>
  );
}
