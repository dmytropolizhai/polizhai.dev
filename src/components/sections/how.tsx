import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { t } from "@/lib/content";
import { pendingCopy } from "@/lib/pending";

/**
 * §3 How I work: the asymmetric 12-column hairline Proof Grid.
 * Displays all 5 commercial outcome claims and structural proof blocks at once without widget friction.
 */
export function How() {
  const c = t.how.cells;
  const figures = pendingCopy.budgetFigures;

  const languages = [
    { name: "Ukrainian", code: "UK", level: "Native" },
    { name: "Russian", code: "RU", level: "Native" },
    { name: "Latvian", code: "LV", level: "B1" },
    { name: "English", code: "EN", level: "B1" },
  ];

  return (
    <Section id="how" title={t.how.heading} intro={t.how.intro}>
      <div className="grid grid-cols-1 border-t border-l border-line md:grid-cols-2 lg:grid-cols-12">
        {/* Cell 1: Launch Speed & Solo Delivery */}
        <Reveal
          as="article"
          className="flex flex-col border-r border-b border-line bg-bg p-(--space-8) md:col-span-2 lg:col-span-7"
        >
          <h3 className="type-h3 text-fg">{c.launch.title}</h3>
          <p className="type-body mt-(--space-3) max-w-[54ch] text-fg-muted">{c.launch.body}</p>

          <div className="mt-auto pt-(--space-8)">
            <dl className="flex flex-wrap gap-x-10 gap-y-4">
              {c.launch.figures.map((fig) => (
                <div key={fig.label} className="flex flex-col-reverse">
                  <dt className="type-label mt-1 text-fg-muted">{fig.label}</dt>
                  <dd className="type-num text-[clamp(2rem,3.5vw,2.75rem)] leading-none text-fg whitespace-nowrap">
                    {fig.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-(--space-6) border-t border-line pt-(--space-4)">
              <p className="type-label mb-(--space-2) text-fg-subtle">DELIVERY PIPELINE</p>
              <ol className="flex flex-wrap items-center gap-2 type-label text-fg">
                {c.launch.stages.map((stage, idx) => (
                  <li key={stage} className="flex items-center gap-2">
                    <span className="border border-line-strong bg-raised px-2.5 py-1 font-mono text-fg">
                      {stage}
                    </span>
                    {idx < c.launch.stages.length - 1 && (
                      <span className="text-fg-subtle" aria-hidden="true">
                        →
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Reveal>

        {/* Cell 2: CMS & Content Autonomy */}
        <Reveal
          as="article"
          index={1}
          className="flex flex-col border-r border-b border-line bg-surface p-(--space-8) md:col-span-1 lg:col-span-5"
        >
          <h3 className="type-h3 text-fg">{c.cms.title}</h3>
          <p className="type-body mt-(--space-3) text-fg-muted">{c.cms.body}</p>

          <div className="mt-auto pt-(--space-8)">
            <dl>
              <div className="flex flex-col-reverse">
                <dt className="type-label mt-1 text-fg-muted">{c.cms.figure.label}</dt>
                <dd className="type-num text-[clamp(2rem,3.5vw,2.75rem)] leading-none text-fg whitespace-nowrap">
                  {c.cms.figure.value}
                </dd>
              </div>
            </dl>

            <div className="mt-(--space-6) border-t border-line pt-(--space-4)">
              <p className="type-label mb-(--space-2) text-fg-subtle">VISUAL EDITING STUDIO</p>
              <ul className="flex flex-wrap gap-2">
                {c.cms.tools.map((tool) => (
                  <li
                    key={tool}
                    className="type-label border border-line-strong bg-raised px-2.5 py-1 text-fg"
                  >
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        {/* Cell 3: Performance & Conversion */}
        <Reveal
          as="article"
          index={2}
          className="flex flex-col border-r border-b border-line bg-bg p-(--space-8) md:col-span-1 lg:col-span-4"
        >
          <h3 className="type-h3 text-fg">{c.speed.title}</h3>
          <p className="type-body mt-(--space-3) text-fg-muted">{c.speed.body}</p>

          <div className="mt-auto pt-(--space-8)">
            <dl className="flex flex-wrap gap-x-8 gap-y-4">
              {(figures.show ? figures.items : [{ value: "< 1.8 s", label: "main content, budget" }]).map(
                (fig) => (
                  <div key={fig.label} className="flex flex-col-reverse">
                    <dt className="type-label mt-1 text-fg-muted">{fig.label}</dt>
                    <dd className="type-num text-[clamp(1.75rem,3vw,2.5rem)] leading-none text-fg whitespace-nowrap">
                      {fig.value}
                    </dd>
                  </div>
                ),
              )}
            </dl>

            <div className="mt-(--space-6) border-t border-line pt-(--space-4)">
              <p className="type-label mb-(--space-2) text-fg-subtle">CORE STACK</p>
              <ul className="flex flex-wrap gap-2">
                {c.speed.stack.map((item) => (
                  <li
                    key={item}
                    className="type-label border border-line-strong bg-raised px-2.5 py-1 text-fg"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        {/* Cell 4: Warranty & Ongoing Care */}
        <Reveal
          as="article"
          index={3}
          className="flex flex-col border-r border-b border-line bg-surface p-(--space-8) md:col-span-1 lg:col-span-4"
        >
          <h3 className="type-h3 text-fg">{c.support.title}</h3>
          <p className="type-body mt-(--space-3) text-fg-muted">{c.support.body}</p>

          <div className="mt-auto pt-(--space-8)">
            <dl className="grid grid-cols-2 gap-4">
              {c.support.phases.map((phase) => (
                <div key={phase.label} className="flex flex-col-reverse">
                  <dt className="type-label mt-1 text-fg-muted">{phase.label}</dt>
                  <dd className="type-num text-[clamp(1.75rem,3vw,2.5rem)] leading-none text-fg whitespace-nowrap">
                    {phase.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-(--space-6) border-t border-line pt-(--space-4)">
              <p className="type-label mb-(--space-2) text-fg-subtle">AFTERCARE SCOPE</p>
              <ul className="flex flex-wrap gap-2">
                {c.support.tags.map((tag) => (
                  <li
                    key={tag}
                    className="type-label border border-line-strong bg-raised px-2.5 py-1 text-fg"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        {/* Cell 5: Multilingual Setup */}
        <Reveal
          as="article"
          index={4}
          className="flex flex-col border-r border-b border-line bg-bg p-(--space-8) md:col-span-2 lg:col-span-4"
        >
          <h3 className="type-h3 text-fg">{c.languages.title}</h3>
          <p className="type-body mt-(--space-3) text-fg-muted">{c.languages.body}</p>

          <div className="mt-auto pt-(--space-8)">
            <dl className="flex flex-wrap gap-x-8 gap-y-4">
              {c.languages.figures.map((fig) => (
                <div key={fig.label} className="flex flex-col-reverse">
                  <dt className="type-label mt-1 text-fg-muted">{fig.label}</dt>
                  <dd className="type-num text-[clamp(1.75rem,3vw,2.5rem)] leading-none text-fg whitespace-nowrap">
                    {fig.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-(--space-6) border-t border-line pt-(--space-4)">
              <p className="type-label mb-(--space-2) text-fg-subtle">NATIVE & B1 FLUENCY</p>
              <ul className="grid grid-cols-2 gap-2">
                {languages.map((lang) => (
                  <li
                    key={lang.code}
                    className="flex items-center justify-between border border-line bg-raised px-2.5 py-1.5 type-label"
                  >
                    <span className="text-fg">{lang.name}</span>
                    <span className="font-mono text-fg-subtle">{lang.level}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
