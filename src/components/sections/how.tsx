import { useState } from "react";
import { Mark } from "@/components/ui/mark";
import { Section } from "@/components/ui/section";
import { t } from "@/lib/content";
import { pendingCopy } from "@/lib/pending";

/**
 * §3 How I work: 4-stage interactive Delivery Pipeline.
 * Replaces the static bento grid with an authored telemetry workflow.
 */
export function How() {
  const c = t.how.cells;
  const figures = pendingCopy.budgetFigures;
  const [activeStage, setActiveStage] = useState(0);

  const stages = [
    {
      id: "design",
      step: "01",
      name: "Design & Scope",
      title: c.launch.title,
      body: c.launch.body,
      note: "Direct collaboration with Dmytro. Zero project manager overhead or handoff latency.",
      metrics: c.launch.figures,
      tags: ["Direct Slack / Telegram", "Interactive Prototypes", "Scope Lock", "Milestones"],
    },
    {
      id: "frontend",
      step: "02",
      name: "Frontend & Speed",
      title: c.speed.title,
      body: c.speed.body,
      note: "Sub-second navigation budgets enforced in CI, zero cumulative layout shift.",
      metrics: figures.show ? figures.items : [{ value: "< 1.8 s", label: "main content, budget" }],
      tags: [...c.speed.stack, "Tailwind v4", "Vite", "Edge SSR"],
    },
    {
      id: "cms",
      step: "03",
      name: "Content & CMS",
      title: c.cms.title,
      body: c.cms.body,
      note: "Visual editing studio tailored to your exact schemas. Free multilingual support.",
      metrics: [
        c.cms.figure,
        { value: "4", label: "languages supported free" },
      ],
      tags: [...c.cms.tools, "Multilingual (EN, LV, UK, RU)", "Asset Pipeline", "Draft Previews"],
    },
    {
      id: "care",
      step: "04",
      name: "Deploy & Care",
      title: c.support.title,
      body: c.support.body,
      note: "Direct author warranty with zero-downtime edge network and automated backups.",
      metrics: c.support.phases,
      tags: [...c.support.tags, "Cloudflare Edge", "Automated Backups", "SSL & DNS"],
    },
  ];

  const current = stages[activeStage] ?? stages[0]!;

  return (
    <Section id="how" title={t.how.heading} intro={t.how.intro}>
      <div className="border border-line bg-surface">
        {/* Stage Selection Rail */}
        <div
          role="tablist"
          aria-label="Delivery stages"
          className="grid grid-cols-2 border-b border-line lg:grid-cols-4"
        >
          {stages.map((stage, idx) => {
            const isActive = activeStage === idx;
            return (
              <button
                key={stage.id}
                role="tab"
                id={`stage-tab-${stage.id}`}
                aria-selected={isActive}
                aria-controls={`stage-panel-${stage.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveStage(idx)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") {
                    e.preventDefault();
                    setActiveStage((idx + 1) % stages.length);
                  } else if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    setActiveStage((idx - 1 + stages.length) % stages.length);
                  }
                }}
                className={`group relative flex flex-col justify-between p-(--space-6) text-left transition-colors duration-(--dur-micro) motion-reduce:transition-none ${
                  idx < stages.length - 1 ? "border-r border-line" : ""
                } ${idx === 1 ? "border-r-0 lg:border-r" : ""} ${
                  idx < 2 ? "border-b border-line lg:border-b-0" : ""
                } ${isActive ? "bg-raised text-fg" : "bg-surface text-fg-muted hover:bg-raised/50 hover:text-fg"}`}
              >
                {/* Active indicator bar */}
                <div
                  className={`absolute top-0 right-0 left-0 h-0.5 transition-colors duration-(--dur-micro) motion-reduce:transition-none ${
                    isActive ? "bg-inverse" : "bg-transparent group-hover:bg-line-strong"
                  }`}
                  aria-hidden="true"
                />

                <div className="flex items-center justify-between">
                  <span className="type-label font-mono text-fg-subtle">
                    {stage.step} / 04
                  </span>
                  {isActive ? (
                    <span className="flex items-center gap-1.5 type-label text-fg">
                      <Mark className="text-fg" />
                      <span>active</span>
                    </span>
                  ) : (
                    <span className="type-label text-fg-subtle opacity-0 transition-opacity duration-(--dur-micro) group-hover:opacity-100">
                      inspect
                    </span>
                  )}
                </div>

                <div className="mt-(--space-4)">
                  <p className="type-h3 text-fg">{stage.name}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Telemetry Readout Console */}
        <div
          id={`stage-panel-${current.id}`}
          role="tabpanel"
          aria-labelledby={`stage-tab-${current.id}`}
          tabIndex={0}
          className="grid gap-8 p-(--space-8) lg:grid-cols-12 lg:gap-12 lg:p-(--space-12)"
        >
          {/* Left Column: Stage Specification & Stack */}
          <div className="flex flex-col justify-between lg:col-span-7">
            <div>
              <div className="flex items-center gap-2 type-label text-fg-subtle">
                <span className="inline-block h-1.5 w-1.5 bg-inverse" aria-hidden="true" />
                <span>STAGE {current.step} SPECIFICATION</span>
              </div>

              <h3 className="type-h3 mt-(--space-4) text-fg">{current.title}</h3>
              <p className="type-body mt-(--space-4) max-w-[54ch] text-fg-muted">{current.body}</p>

              <p className="type-small mt-(--space-6) border-l-2 border-line-strong pl-(--space-3) text-fg-subtle">
                {current.note}
              </p>
            </div>

            <div className="mt-(--space-8) border-t border-line pt-(--space-6)">
              <p className="type-label mb-(--space-3) text-fg-subtle">DELIVERABLES & ARCHITECTURE</p>
              <ul className="flex flex-wrap gap-2">
                {current.tags.map((tag) => (
                  <li
                    key={tag}
                    className="type-label border border-line-strong bg-raised px-3 py-1.5 text-fg"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Telemetry Proof Deck */}
          <div className="flex flex-col justify-between border border-line bg-bg p-(--space-6) lg:col-span-5 lg:p-(--space-8)">
            <div>
              <div className="flex items-center justify-between border-b border-line pb-(--space-3) type-label text-fg-subtle">
                <span>VERIFIED METRICS</span>
                <span className="font-mono text-fg">LIVE BENCHMARK</span>
              </div>

              <dl className="mt-(--space-6) space-y-6">
                {current.metrics.map((metric) => (
                  <div key={metric.label} className="flex flex-col-reverse">
                    <dt className="type-label mt-1 text-fg-muted">{metric.label}</dt>
                    <dd className="type-num text-[clamp(2.25rem,4vw,3.25rem)] leading-none tracking-[-0.035em] text-fg whitespace-nowrap">
                      {metric.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-(--space-8) border-t border-line pt-(--space-4)">
              <div className="flex items-center justify-between type-label text-fg-subtle">
                <span>DELIVERY MODEL</span>
                <span className="font-mono text-fg">ONE BUILDER · COMMIT TO DEPLOY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
