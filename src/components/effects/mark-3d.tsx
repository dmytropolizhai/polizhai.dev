import { cn } from "@/lib/utils";
import { useEffect, useRef, type CSSProperties, type RefObject } from "react";

/**
 * The brand mark extruded into a solid slab that turns toward the cursor.
 * CSS 3D only: six faces, one rotor. Geometry and faces live in index.css (`.mark3d*`);
 * this file owns the shading maths and the pointer loop. No React state per frame.
 */

type Vec3 = readonly [x: number, y: number, z: number];
type Pose = { rx: number; ry: number }; // degrees; ry > 0 turns the front toward the right, rx > 0 tilts it up

const COS30 = Math.cos(Math.PI / 6);

/** Outward face normals in the slab's own space (CSS axes: x right, y down, z toward the viewer). */
const NORMALS = {
  front: [0, 0, 1],
  top: [0, -1, 0],
  bottom: [0, 1, 0],
  left: [-COS30, -0.5, 0],
  right: [COS30, 0.5, 0],
} as const satisfies Record<string, Vec3>;
type FaceId = keyof typeof NORMALS;
const FACE_IDS = ["front", "top", "bottom", "left", "right"] as const satisfies readonly FaceId[];

const TUNING = {
  rest: { rx: -18, ry: -30 } satisfies Pose, // three-quarter view, looking slightly down onto the top edge
  range: { rx: 9, ry: 14 }, // degrees of travel around the rest pose
  light: [-0.45, -0.2, 0.87] satisfies Vec3, // upper-left-front, unit length
  wrap: 0.05, // soft terminator: lets faces just past edge-on keep a little tone
  gamma: 1.3, // shoulder: bright faces saturate to white, mid faces fall off quickly
  floor: 0.17, // lightness of a face turned fully away (~#2b)
  sheenTravel: 0.55, // % of sheen travel per degree of yaw
  smoothTime: 0.3, // seconds; critically damped, so it never overshoots
  epsilon: 0.02, // degrees (and deg/s) below which the loop stops
} as const;

/** Rotation as CSS applies it: `rotateX(rx) rotateY(ry)`, i.e. yaw first, then pitch. */
function rotate([x, y, z]: Vec3, { rx, ry }: Pose): Vec3 {
  const [cy, sy] = [Math.cos((ry * Math.PI) / 180), Math.sin((ry * Math.PI) / 180)];
  const [cx, sx] = [Math.cos((rx * Math.PI) / 180), Math.sin((rx * Math.PI) / 180)];
  const [x1, z1] = [x * cy + z * sy, -x * sy + z * cy];
  return [x1, y * cx - z1 * sx, y * sx + z1 * cx];
}

/** Pure shading: Lambert with a wrap and a soft shoulder, as lightness % per face (0.5 steps). */
function shade(pose: Pose): Record<FaceId, number> {
  const { light, wrap, gamma, floor } = TUNING;
  const tone = (face: FaceId) => {
    const n = rotate(NORMALS[face], pose);
    const lambert = n[0] * light[0] + n[1] * light[1] + n[2] * light[2];
    const v = Math.min(1, Math.max(0, (lambert + wrap) / (1 + wrap)));
    const lightness = floor + (1 - floor) * (1 - (1 - v) ** gamma);
    return Math.round(lightness * 200) / 2;
  };
  return { front: tone("front"), top: tone("top"), bottom: tone("bottom"), left: tone("left"), right: tone("right") };
}

/** Every custom property the stylesheet reads, for one pose. */
function poseVars(pose: Pose): Record<string, string> {
  const tones = shade(pose);
  const vars: Record<string, string> = {
    "--mark-rx": pose.rx.toFixed(2),
    "--mark-ry": pose.ry.toFixed(2),
    "--mark-sheen": ((pose.ry - TUNING.rest.ry) * TUNING.sheenTravel).toFixed(2),
  };
  for (const id of FACE_IDS) vars[`--tone-${id}`] = `${tones[id]}%`;
  return vars;
}

/** Rendered on first paint, so the rest pose is already shaded before any effect runs. */
const REST_STYLE = poseVars(TUNING.rest) as CSSProperties;

type Axis = { pos: number; vel: number; target: number };

/** Critically damped spring (the SmoothDamp form): frame-rate independent, no overshoot. */
function stepAxis(a: Axis, dt: number) {
  const omega = 2 / TUNING.smoothTime;
  const x = omega * dt;
  const decay = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const change = a.pos - a.target;
  const temp = (a.vel + omega * change) * dt;
  a.vel = (a.vel - omega * temp) * decay;
  a.pos = a.target + (change + temp) * decay;
}

const isSettled = (a: Axis) => Math.abs(a.pos - a.target) < TUNING.epsilon && Math.abs(a.vel) < TUNING.epsilon;

type SaveDataNavigator = Navigator & { connection?: { saveData?: boolean } };
const saveDataOn = () => (navigator as SaveDataNavigator).connection?.saveData === true;

/** Attaches the pointer loop to `el`; returns its cleanup, which also restores the rest pose. */
function track(el: HTMLElement): () => void {
  const ry: Axis = { pos: TUNING.rest.ry, vel: 0, target: TUNING.rest.ry };
  const rx: Axis = { pos: TUNING.rest.rx, vel: 0, target: TUNING.rest.rx };
  const written = new Map<string, string>(); // only touch the DOM when a value changed
  let raf = 0;
  let last = 0;
  let visible = false;

  const write = (pose: Pose) => {
    for (const [name, value] of Object.entries(poseVars(pose))) {
      if (written.get(name) === value) continue;
      written.set(name, value);
      el.style.setProperty(name, value);
    }
  };

  const frame = (now: number) => {
    const dt = Math.min(Math.max((now - last) / 1000, 0), 0.05); // rAF time can predate the input event
    last = now;
    stepAxis(ry, dt);
    stepAxis(rx, dt);
    if (isSettled(ry) && isSettled(rx)) {
      [ry.pos, ry.vel] = [ry.target, 0];
      [rx.pos, rx.vel] = [rx.target, 0];
      raf = 0;
    } else {
      raf = requestAnimationFrame(frame);
    }
    write({ rx: rx.pos, ry: ry.pos });
  };

  const start = () => {
    if (raf || !visible) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };

  const onMove = (e: PointerEvent) => {
    const nx = (e.clientX / (window.innerWidth || 1)) * 2 - 1;
    const ny = (e.clientY / (window.innerHeight || 1)) * 2 - 1;
    ry.target = TUNING.rest.ry + nx * TUNING.range.ry; // cursor right: front turns right
    rx.target = TUNING.rest.rx - ny * TUNING.range.rx; // cursor up: front tilts up
    start();
  };

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) visible = entry.isIntersecting;
    if (visible) {
      if (!isSettled(ry) || !isSettled(rx)) start();
    } else if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  });
  io.observe(el);
  window.addEventListener("pointermove", onMove, { passive: true });

  return () => {
    window.removeEventListener("pointermove", onMove);
    io.disconnect();
    cancelAnimationFrame(raf);
    for (const [name, value] of Object.entries(poseVars(TUNING.rest))) el.style.setProperty(name, value); // back to rest
  };
}

/** Pointer tracking only on fine hover pointers, with motion allowed and Save-Data off. */
function useMarkTilt(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const queries = [matchMedia("(hover: hover) and (pointer: fine)"), matchMedia("(prefers-reduced-motion: no-preference)")];
    let stop: (() => void) | null = null;

    const sync = () => {
      const allowed = queries.every((q) => q.matches) && !saveDataOn();
      if (allowed && !stop) stop = track(el);
      else if (!allowed && stop) {
        stop();
        stop = null;
      }
    };
    sync();
    for (const q of queries) q.addEventListener("change", sync);
    return () => {
      for (const q of queries) q.removeEventListener("change", sync);
      stop?.();
    };
  }, [ref]);
}

export function Mark3D({ className }: { className?: string }) {
  const rotorRef = useRef<HTMLDivElement>(null);
  useMarkTilt(rotorRef);

  return (
    <div aria-hidden="true" className={cn("mark3d", className)}>
      <div ref={rotorRef} className="mark3d-rotor" style={REST_STYLE}>
        <div className="mark3d-face mark3d-back" />
        <div className="mark3d-face mark3d-left" />
        <div className="mark3d-face mark3d-right" />
        <div className="mark3d-face mark3d-bottom" />
        <div className="mark3d-face mark3d-top" />
        <div className="mark3d-face mark3d-front" />
      </div>
    </div>
  );
}
