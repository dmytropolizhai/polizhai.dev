import { animate, motion, useMotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { HighlightText } from "@/components/ui/highlight-text";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Reveal } from "@/components/ui/reveal";
import { facts, stats, t } from "@/lib/content";
import { pendingCopy, shots } from "@/lib/pending";
import { cn } from "@/lib/utils";
import { ShotPlaceholder, Tile, TileActions, TileBody, TileMeta, type Play } from "./tile";

/*
 * The seven bento tiles (design/landing-page.md §2). One animation each, vertical only,
 * transforms and opacity only, --motion-move, finished state under reduced motion.
 * Grid spans: 12 cols ≥1024, 6 cols ≥640, 1 col below.
 */

const MOVE = [0.65, 0, 0.35, 1] as const; // --motion-move
const SECTION_S = 0.56; // --dur-section

// ---------------------------------------------------------------------------
// 1. Prolifts (8 × 2): the page scrolls itself
// ---------------------------------------------------------------------------

function ScrollingPage({ playing }: Play) {
  const windowRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);

  useEffect(() => {
    const win = windowRef.current;
    const page = pageRef.current;
    if (!win || !page) return;
    const distance = Math.max(0, page.offsetHeight - win.offsetHeight);
    const controls = playing
      ? animate(y, -distance, { duration: 8, ease: "linear" })
      : animate(y, 0, { duration: SECTION_S, ease: MOVE });
    return () => controls.stop();
  }, [playing, y]);

  return (
    <div ref={windowRef} className="relative aspect-[4/3] overflow-hidden border border-line bg-raised lg:aspect-auto lg:h-full">
      <motion.div ref={pageRef} style={{ y }} className="absolute inset-x-0 top-0">
        {shots.prolifts ? (
          <img src={shots.prolifts} alt="" className="block w-full" />
        ) : (
          <PagePlaceholder />
        )}
      </motion.div>
    </div>
  );
}

/** A grey wireframe of a long page, so the animation reads before the real screenshot exists. */
function PagePlaceholder() {
  const blocks = [
    "h-48 bg-line", "mx-4 mt-4 h-4 w-2/3 bg-line-strong", "mx-4 mt-2 h-3 w-1/2 bg-line",
    "mx-4 mt-6 grid h-28 grid-cols-3 gap-2", "mx-4 mt-6 h-36 bg-line", "mx-4 mt-4 h-3 w-3/4 bg-line",
    "mx-4 mt-2 h-3 w-2/3 bg-line", "mx-4 mt-6 grid h-28 grid-cols-3 gap-2", "mx-4 mt-6 h-40 bg-line",
    "mx-4 mt-4 h-3 w-1/2 bg-line", "mx-4 mt-6 h-24 bg-line-strong/50", "mx-4 my-6 h-10 w-1/3 bg-line",
  ];
  return (
    <div className="texture-halftone pb-6" aria-hidden="true">
      {blocks.map((cls, i) =>
        cls.includes("grid") ? (
          <div key={i} className={cls}>
            <div className="bg-line" />
            <div className="bg-line" />
            <div className="bg-line" />
          </div>
        ) : (
          <div key={i} className={cls} />
        ),
      )}
      <span className="type-label mx-4 mt-2 block text-fg-muted">screenshot · pro-lifts.lv</span>
    </div>
  );
}

export function ProliftsTile({ index }: { index: number }) {
  return (
    <Tile project="prolifts" index={index} span="sm:col-span-6 sm:row-span-2 lg:col-span-8">
      {(play) => (
        <div className="grid h-full gap-6 lg:grid-cols-[56fr_44fr]">
          <ScrollingPage {...play} />
          <div className="flex flex-col">
            <TileMeta id="prolifts" />
            <h3 className="type-h3 mt-auto pt-8 text-[2.75rem] font-black uppercase leading-[0.95]">
              {facts.projects.prolifts.name}
            </h3>
            <TileBody id="prolifts" oneLinerClass="text-fg" />
            <TileActions id="prolifts" lead="primary" />
          </div>
        </div>
      )}
    </Tile>
  );
}

// ---------------------------------------------------------------------------
// 2. Stundio (4 × 2): the number counts, then one underline sweep
// ---------------------------------------------------------------------------

function StundioVisual({ playing, reduced }: Play) {
  const [counted, setCounted] = useState(true);
  useEffect(() => {
    if (playing) setCounted(false);
  }, [playing]);

  return (
    <>
      <div className="flex h-44 items-end justify-center gap-3 overflow-hidden border border-line bg-raised px-6 pt-6">
        {shots.stundio.map((src, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={playing && !reduced ? { y: [14, 0], opacity: [0, 1] } : { y: 0, opacity: 1 }}
            transition={{ duration: SECTION_S, ease: MOVE, delay: i * 0.06 }}
            className="aspect-[9/19.5] w-[34%] translate-y-6 overflow-hidden border border-line-strong bg-surface"
          >
            {src ? <img src={src} alt="" className="h-full w-full object-cover object-top" /> : <PhonePlaceholder />}
          </motion.div>
        ))}
      </div>
      <p className="mt-5 flex flex-wrap items-baseline gap-x-3">
        <span className="type-h2 type-num">
          <NumberTicker value={stats.stundioUsers.value} play={playing} onDone={() => setCounted(true)} />
          {stats.stundioUsers.suffix}
        </span>
        <span className="type-small">
          <HighlightText on={counted || reduced}>{t.stats.stundioUsers}</HighlightText>
        </span>
      </p>
    </>
  );
}

function PhonePlaceholder() {
  return (
    <div className="flex h-full flex-col gap-1.5 p-2" aria-hidden="true">
      <div className="h-2 w-1/2 bg-line-strong" />
      {Array.from({ length: 7 }, (_, i) => (
        <div key={i} className={cn("h-5 bg-line", i === 2 && "bg-line-strong")} />
      ))}
    </div>
  );
}

export function StundioTile({ index }: { index: number }) {
  return (
    <Tile project="stundio" index={index} span="sm:col-span-3 sm:row-span-2 lg:col-span-4">
      {(play) => (
        <>
          <TileMeta id="stundio" />
          <div className="mt-5">
            <StundioVisual {...play} />
          </div>
          <h3 className="type-h3 mt-6">{facts.projects.stundio.name}</h3>
          <TileBody id="stundio" />
          <div className="mt-auto">
            <TileActions id="stundio" lead="secondary" />
          </div>
        </>
      )}
    </Tile>
  );
}

// ---------------------------------------------------------------------------
// 3. Curio (4 × 2): two bars, a tenth less waiting
// ---------------------------------------------------------------------------

function CurioStat({ playing, reduced }: Play) {
  const grow = playing && !reduced;
  const bars = pendingCopy.curioBars;
  return (
    <div className="mt-5 flex items-end gap-6">
      <p className="flex flex-col">
        <span className="type-h2 type-num">
          <NumberTicker value={stats.curioLoadTime.value} play={playing} />
          {stats.curioLoadTime.suffix}
        </span>
        <span className="type-small mt-1">{t.stats.curioLoadTime}</span>
      </p>
      {bars.show && (
        <div className="ml-auto flex items-end gap-3" aria-hidden="true">
          {[
            { h: "h-20", fill: "bg-control", label: bars.before, delay: 0 },
            { h: "h-[4.5rem]", fill: "bg-fg", label: bars.after, delay: 0.16 },
          ].map((b) => (
            <div key={b.label} className="flex flex-col items-center gap-1.5">
              <div className="flex h-20 items-end border-b border-line">
                <motion.div
                  initial={false}
                  animate={grow ? { scaleY: [0, 1] } : { scaleY: 1 }}
                  transition={{ duration: SECTION_S, ease: MOVE, delay: b.delay }}
                  className={cn("w-2.5 origin-bottom", b.h, b.fill)}
                />
              </div>
              <span className="type-label text-fg-subtle">{b.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function CurioTile({ index }: { index: number }) {
  return (
    <Tile project="curio" index={index} span="sm:col-span-3 sm:row-span-2 lg:col-span-4">
      {(play) => (
        <>
          <TileMeta id="curio" />
          <div className="mt-5 aspect-[16/10] overflow-hidden border border-line">
            {shots.curio ? (
              <img src={shots.curio} alt="" className="h-full w-full object-cover object-top" />
            ) : (
              <ShotPlaceholder label="screenshot · curio.today" className="h-full" />
            )}
          </div>
          <CurioStat {...play} />
          <h3 className="type-h3 mt-6">{facts.projects.curio.name}</h3>
          <TileBody id="curio" />
          <div className="mt-auto">
            <TileActions id="curio" lead="secondary" />
          </div>
        </>
      )}
    </Tile>
  );
}

// ---------------------------------------------------------------------------
// 4. Numerologgi (4 × 2): three screens, browse → choose → pay
// ---------------------------------------------------------------------------

const SCREEN_LABELS = ["catalogue", "product", "checkout"] as const;

function ThreeScreens({ playing }: Play) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!playing) {
      setStep(0);
      return;
    }
    // 560ms move + 1.4s hold per screen.
    const id = window.setInterval(() => setStep((s) => (s + 1) % SCREEN_LABELS.length), 1960);
    return () => window.clearInterval(id);
  }, [playing]);

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden border border-line bg-raised">
        {SCREEN_LABELS.map((label, i) => {
          const src = shots.numerologgi[i];
          return (
            <motion.div
              key={label}
              initial={false}
              animate={{ y: i === 0 || i <= step ? "0%" : "100%" }}
              transition={{ duration: SECTION_S, ease: MOVE }}
              className="absolute inset-0"
              style={{ zIndex: i }}
            >
              {src ? (
                <img src={src} alt="" className="h-full w-full object-cover object-top" />
              ) : (
                <ShotPlaceholder label={`screenshot · ${label}`} className="h-full border-t border-line" />
              )}
            </motion.div>
          );
        })}
      </div>
      <div className="mt-2 flex gap-1.5" aria-hidden="true">
        {SCREEN_LABELS.map((label, i) => (
          <span
            key={label}
            className={cn(
              "h-px flex-1 transition-colors duration-(--dur-micro)",
              i === step ? "bg-fg" : "bg-line-strong",
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function NumerologgiTile({ index }: { index: number }) {
  return (
    <Tile project="numerologgi" index={index} span="sm:col-span-3 sm:row-span-2 lg:col-span-4">
      {(play) => (
        <>
          <TileMeta id="numerologgi" />
          <div className="mt-5">
            <ThreeScreens {...play} />
          </div>
          <h3 className="type-h3 mt-6">{facts.projects.numerologgi.name}</h3>
          <TileBody id="numerologgi" />
          <div className="mt-auto">
            <TileActions id="numerologgi" lead="secondary" />
          </div>
        </>
      )}
    </Tile>
  );
}

// ---------------------------------------------------------------------------
// 5. one-to-one (4 × 2): a conversation reduced to lines
// ---------------------------------------------------------------------------

const CHAT = [
  { side: "left", w: "w-2/5" },
  { side: "right", w: "w-1/2" },
  { side: "left", w: "w-1/3" },
  { side: "right", w: "w-2/5" },
  { side: "left", w: "w-3/5" },
] as const;

function Conversation({ playing }: Play) {
  const [shown, setShown] = useState<number>(CHAT.length);

  useEffect(() => {
    if (!playing) {
      setShown(CHAT.length);
      return;
    }
    setShown(0);
    let n = 0;
    const id = window.setInterval(() => {
      n = n >= CHAT.length + 2 ? 0 : n + 1; // two beats of rest, then fade and start again
      setShown(n);
    }, 420);
    return () => window.clearInterval(id);
  }, [playing]);

  return (
    <div className="texture-halftone flex aspect-[16/10] flex-col justify-center gap-3 border border-line bg-raised px-6" aria-hidden="true">
      {CHAT.map((m, i) => (
        <motion.div
          key={i}
          initial={false}
          animate={i < shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 0.32, ease: MOVE }}
          className={cn(
            "relative z-(--z-content) h-1.5",
            m.w,
            m.side === "left" ? "bg-control" : "ml-auto bg-fg",
          )}
        />
      ))}
    </div>
  );
}

export function OneToOneTile({ index }: { index: number }) {
  return (
    <Tile project="one-to-one" index={index} span="sm:col-span-3 sm:row-span-2 lg:col-span-4">
      {(play) => (
        <>
          <TileMeta id="one-to-one" />
          <div className="mt-5">
            <Conversation {...play} />
          </div>
          <h3 className="type-h3 mt-6">{facts.projects["one-to-one"].name}</h3>
          <TileBody id="one-to-one" />
          <div className="mt-auto">
            <TileActions id="one-to-one" lead="secondary" />
          </div>
        </>
      )}
    </Tile>
  );
}

// ---------------------------------------------------------------------------
// 6. DNF (7 × 1): the timer runs
// ---------------------------------------------------------------------------

function Stopwatch({ playing }: Play) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!playing) {
      const id = window.setTimeout(() => (el.textContent = "0.00"), 600); // stop for a moment, then reset
      return () => window.clearTimeout(id);
    }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      el.textContent = ((now - start) / 1000).toFixed(2);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className="type-num min-w-[5ch] shrink-0 text-right text-[clamp(3rem,7vw,5.5rem)] leading-none font-black tracking-tight [font-stretch:125%]"
    >
      0.00
    </span>
  );
}

export function DnfTile({ index }: { index: number }) {
  return (
    <Tile project="dnf" index={index} span="sm:col-span-6 lg:col-span-7">
      {(play) => (
        <div className="flex h-full flex-col gap-6 md:flex-row md:items-center">
          <div className="flex min-w-0 flex-1 flex-col">
            <TileMeta id="dnf" />
            <h3 className="type-h3 mt-4">{facts.projects.dnf.name}</h3>
            <TileBody id="dnf" />
            <TileActions id="dnf" lead="link" />
          </div>
          <Stopwatch {...play} />
        </div>
      )}
    </Tile>
  );
}

// ---------------------------------------------------------------------------
// 7. Statement (5 × 1): two beats, the grid explains itself
// ---------------------------------------------------------------------------

export function StatementTile({ index }: { index: number }) {
  // Two beats: split after the first sentence (keeps its own period).
  const [first = "", second = ""] = t.work.secondaryLine.split(/(?<=[.!?])\s+(.*)/s);
  return (
    <li className="flex min-w-0 items-end bg-bg p-6 sm:col-span-6 lg:col-span-5">
      <p className="type-h3">
        <Reveal as="span" index={index} className="block">
          {first}
        </Reveal>
        <Reveal as="span" index={index + 5} className="block">
          {second}
        </Reveal>
      </p>
    </li>
  );
}
