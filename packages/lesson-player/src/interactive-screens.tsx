// Screens the pupil works on with their hands (docs/proposals/lesson-interactive.md). Tap answers
// by tapping part of a diagram. Explore is a diagram to drag, so the pupil sees what changes and
// what stays the same: points round a circle or along a line, a hundred square to shade, or a
// total to share in a ratio. A prediction can come first (reflect, expect, check), and once the
// pupil has explored, a question asks what they noticed.
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type {
  Explore,
  ExplorePoint,
  GeometryScene,
  LineReadout,
  LineScene,
  Option,
  Point,
  RatioScene,
  Readout,
  Tap,
  TapSet,
} from "@mathsplanner/learning/unit-lessons";
import { circleSegments, placeAngleMarks, type Obstacles, type Pt } from "./labels.ts";
import { NumberLine, PictureView, tapName } from "./Picture.tsx";
import { play } from "./sounds.ts";
import { shuffled } from "./unit-screens.tsx";
import { Title, useChime, Verdict, W, Working, type Step } from "./unit-ui.tsx";

// Tap the diagram.

export function TapStep({ screen, family, sound, onNext }: Step<Tap>) {
  const [chosen, setChosen] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string[]>([]);
  const [tries, setTries] = useState(0);
  const [verdict, setVerdict] = useState<"right" | "wrong">();
  const right = verdict === "right";
  const gaveUp = verdict === "wrong" && tries >= 2;
  const many = screen.answers.length > 1;
  useChime(right, sound);
  useEffect(() => {
    if (verdict === "wrong") play("wrong", sound);
  }, [verdict, tries, sound]);

  const tap = (name: string) => {
    if (right || gaveUp) return;
    if (verdict === "wrong") {
      setVerdict(undefined);
      setWrong([]);
    }
    setChosen((c) =>
      many ? (c.includes(name) ? c.filter((n) => n !== name) : [...c, name]) : [name],
    );
  };
  // Right is the answers, in any order, or any one of the other right sets.
  const sets = [screen.answers, ...(screen.anyOf ?? [])];
  const check = () => {
    const ok = sets.some(
      (set) => chosen.length === set.length && chosen.every((c) => set.includes(c)),
    );
    if (ok) setVerdict("right");
    else {
      // Marked wrong: what isn't in the right set closest to the pupil's.
      const closest = sets.reduce((best, set) =>
        set.filter((c) => chosen.includes(c)).length > best.filter((c) => chosen.includes(c)).length
          ? set
          : best,
      );
      setWrong(chosen.filter((c) => !closest.includes(c)));
      setTries(tries + 1);
      setVerdict("wrong");
    }
  };
  const firstWrong = wrong[0];
  const nudge = (firstWrong && screen.wrong?.[firstWrong]) ?? screen.hint;
  const answerWords = screen.answers.map(tapName).join(" and ");

  return (
    <>
      <main className="lesson-main">
        <Title title={screen.title} family={family} />
        {screen.text && (
          <p className="lesson-lead">
            <W text={screen.text} />
          </p>
        )}
        <div className="tap-picture">
          <PictureView
            picture={screen.picture}
            tapping={{ chosen: gaveUp ? screen.answers : chosen, wrong, onTap: tap }}
          />
        </div>
      </main>
      {verdict ? (
        <Verdict
          right={right}
          text={
            right ? screen.done : gaveUp ? `${nudge} It's ${answerWords}. ${screen.done}` : nudge
          }
          family={family}
          seed={tries + chosen.length}
          action={right || gaveUp ? "Continue" : "Try again"}
          onAction={() => {
            if (right || gaveUp) onNext();
            else {
              setVerdict(undefined);
              setWrong([]);
              setChosen([]);
            }
          }}
        />
      ) : (
        <Working
          note={
            many ? `Tap all ${screen.answers.length}, then Check.` : "Tap the diagram, then Check."
          }
        >
          <button
            type="button"
            className="button primary big"
            disabled={!chosen.length}
            onClick={check}
          >
            Check
          </button>
        </Working>
      )}
    </>
  );
}

// Explore: the geometry.

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => ((r * 180) / Math.PI + 360) % 360;

/** Where each draggable point is: degrees round the circle, distance along its ray, or a point. */
export type Positions = Record<string, number | Point>;

/** The starting positions of a scene's draggable points. */
export function startPositions(scene: GeometryScene): Positions {
  const out: Positions = {};
  for (const p of scene.points) {
    if ("onCircle" in p) out[p.name] = p.onCircle;
    else if ("dist" in p) out[p.name] = p.dist;
    else if ("free" in p) out[p.name] = p.free;
  }
  return out;
}

/** Every point of a scene, placed, for the given positions of its draggable ones. */
export function placePoints(scene: GeometryScene, at: Positions): Record<string, Point> {
  const r = scene.circle ?? 3;
  const out: Record<string, Point> = { O: { x: 0, y: 0 } };
  // Points can depend on earlier ones (a ray from a point, a point below another).
  for (const p of scene.points) {
    if ("at" in p) out[p.name] = p.at;
    else if ("onCircle" in p) {
      const d = Number(at[p.name] ?? p.onCircle);
      out[p.name] = { x: r * Math.cos(rad(d)), y: r * Math.sin(rad(d)) };
    } else if ("dist" in p) {
      const o = out[p.from] ?? { x: 0, y: 0 };
      const t = Number(at[p.name] ?? p.dist);
      out[p.name] = { x: o.x + t * Math.cos(rad(p.deg)), y: o.y + t * Math.sin(rad(p.deg)) };
    } else if ("free" in p) {
      const v = at[p.name];
      out[p.name] = typeof v === "object" ? v : p.free;
    } else if ("below" in p) {
      const above = out[p.below];
      out[p.name] = { x: above?.x ?? 0, y: 0 };
    } else {
      const e = out[p.tangentFrom] ?? { x: r * 2, y: 0 };
      const d = Math.max(Math.hypot(e.x, e.y), r + 0.01);
      const phi = Math.atan2(e.y, e.x) + p.side * Math.acos(r / d);
      out[p.name] = { x: r * Math.cos(phi), y: r * Math.sin(phi) };
    }
  }
  return out;
}

/** The size of angle "ABC" (at B), in degrees, under 180. */
export function angleOf(pts: Record<string, Point>, abc: string): number {
  const [a, b, c] = [...abc].map((n) => pts[n]);
  if (!a || !b || !c) return NaN;
  const d1 = Math.atan2(a.y - b.y, a.x - b.x);
  const d2 = Math.atan2(c.y - b.y, c.x - b.x);
  let d = Math.abs(((d1 - d2) * 180) / Math.PI) % 360;
  if (d > 180) d = 360 - d;
  return d;
}

const lengthOf = (pts: Record<string, Point>, ab: string) => {
  const [a, b] = [...ab].map((n) => pts[n]);
  return a && b ? Math.hypot(a.x - b.x, a.y - b.y) : NaN;
};

/** A readout's live value, rounded. */
export function readoutValue(pts: Record<string, Point>, r: Readout): number {
  const round = (v: number, dp = 0) => Math.round(v * 10 ** dp) / 10 ** dp;
  if ("angle" in r) return round(angleOf(pts, r.angle), r.dp);
  if ("sum" in r)
    return round(
      r.sum.reduce((s, a) => s + round(angleOf(pts, a)), 0),
      r.dp,
    );
  if ("ratio" in r) return round(angleOf(pts, r.ratio[0]) / angleOf(pts, r.ratio[1]), r.dp ?? 2);
  if ("length" in r) return round(lengthOf(pts, r.length), r.dp ?? 1);
  if ("lengths" in r)
    return round(lengthOf(pts, r.lengths[0]) / lengthOf(pts, r.lengths[1]), r.dp ?? 2);
  if ("circleArea" in r) return round(Math.PI * lengthOf(pts, r.circleArea) ** 2, r.dp ?? 1);
  return round(2 * Math.PI * lengthOf(pts, r.circumference), r.dp ?? 1);
}

/** Where a dragged pointer puts a point, snapped and kept in range. */
export function dragTo(
  p: ExplorePoint,
  pts: Record<string, Point>,
  to: Point,
): number | Point | undefined {
  if ("onCircle" in p) {
    let d = Math.round(deg(Math.atan2(to.y, to.x)));
    if (p.drag) {
      const [lo, hi] = p.drag;
      // Measure from the start of the range, so a range across 0° works.
      const span = (hi - lo + 360) % 360 || 360;
      const off = (d - lo + 360) % 360;
      if (off > span) d = off - span < 360 - off ? hi : lo;
    }
    return ((d % 360) + 360) % 360;
  }
  if ("dist" in p) {
    const o = pts[p.from] ?? { x: 0, y: 0 };
    const t = (to.x - o.x) * Math.cos(rad(p.deg)) + (to.y - o.y) * Math.sin(rad(p.deg));
    const [lo, hi] = p.drag ?? [0.5, 6];
    return Math.round(Math.min(hi, Math.max(lo, t)) * 10) / 10;
  }
  if ("free" in p) {
    const step = p.step ?? 0.5;
    const snap = (v: number, lo: number, hi: number) =>
      Math.min(hi, Math.max(lo, Math.round(v / step) * step));
    return { x: snap(to.x, p.drag.xMin, p.drag.xMax), y: snap(to.y, p.drag.yMin, p.drag.yMax) };
  }
  return undefined;
}

/** A keyboard nudge for a draggable point: degrees, distance or grid steps. */
function nudge(p: ExplorePoint, now: number | Point, key: string): number | Point | undefined {
  const sign =
    key === "ArrowRight" || key === "ArrowUp"
      ? 1
      : key === "ArrowLeft" || key === "ArrowDown"
        ? -1
        : 0;
  if (!sign) return undefined;
  if ("onCircle" in p && typeof now === "number") {
    const next = (now + 5 * sign + 360) % 360;
    return p.drag ? dragTo(p, {}, { x: Math.cos(rad(next)), y: Math.sin(rad(next)) }) : next;
  }
  if ("dist" in p && typeof now === "number") {
    const [lo, hi] = p.drag ?? [0.5, 6];
    return Math.round(Math.min(hi, Math.max(lo, now + 0.2 * sign)) * 10) / 10;
  }
  if ("free" in p && typeof now === "object") {
    const step = p.step ?? 0.5;
    const horizontal = key === "ArrowLeft" || key === "ArrowRight";
    const x = Math.min(p.drag.xMax, Math.max(p.drag.xMin, now.x + (horizontal ? step * sign : 0)));
    const y = Math.min(p.drag.yMax, Math.max(p.drag.yMin, now.y + (horizontal ? 0 : step * sign)));
    return { x, y };
  }
  return undefined;
}

/** Whether a point can be dragged: one with a range to move in. */
export const draggable = (p: ExplorePoint) =>
  ("onCircle" in p && p.drag !== undefined) || ("dist" in p && p.drag !== undefined) || "free" in p;

/** The drawing of a geometry scene, with handles on its draggable points. */
function GeometryView({
  scene,
  at,
  locked,
  onMove,
}: {
  scene: GeometryScene;
  at: Positions;
  locked: boolean;
  onMove: (name: string, v: number | Point) => void;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<string>();
  const pts = placePoints(scene, at);
  const through = scene.circleThrough ? pts[scene.circleThrough] : undefined;
  const r = through ? Math.hypot(through.x, through.y) : (scene.circle ?? 0);
  const drawCircle = r > 0 && !scene.hideCircle;
  // The centre O is drawn and named only when the diagram uses it.
  const joins = [...scene.lines, ...(scene.dashed ?? [])];
  const usesCentre =
    !scene.points.some((p) => p.name === "O") &&
    [...joins, ...(scene.angles ?? []).map((a) => a.name)].some((n) => n.includes("O"));
  // Its name sits on the side away from the lines that meet there, clear of them and their angle.
  const centreLabel = (() => {
    let dx = 0;
    let dy = 0;
    for (const l of joins) {
      // A line through the centre, such as a diameter, pushes the name off both ways.
      const [a, b] = [...l].map((n) => (n === "O" ? { x: 0, y: 0 } : pts[n]));
      if (!a || !b) continue;
      const through = Math.abs(a.x * b.y - a.y * b.x) / (Math.hypot(b.x - a.x, b.y - a.y) || 1);
      if (l.includes("O") || through > 0.05) {
        const q = pts[l.replace("O", "")];
        if (!l.includes("O") || !q) continue;
        const d = Math.hypot(q.x, q.y) || 1;
        dx += q.x / d;
        dy += q.y / d;
      } else {
        // Its two directions cancel out: lean the name off it, to one side.
        const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
        dx += (b.y - a.y) / len;
        dy -= (b.x - a.x) / len;
      }
    }
    const d = Math.hypot(dx, dy);
    const ux = d > 0.1 ? -dx / d : 0.6;
    const uy = d > 0.1 ? -dy / d : -0.8;
    return { ux, uy };
  })();
  // A fixed frame: everything any point can reach, so the drawing never jumps while dragging.
  const frame = useMemo(() => {
    const all: Point[] = Object.values(placePoints(scene, startPositions(scene)));
    const reach = scene.circleThrough
      ? Math.max(
          ...scene.points.flatMap((p) =>
            "dist" in p && p.name === scene.circleThrough ? [p.drag?.[1] ?? p.dist] : [],
          ),
          r,
        )
      : r;
    if (reach) all.push({ x: -reach, y: -reach }, { x: reach, y: reach });
    for (const p of scene.points) {
      if ("free" in p)
        all.push({ x: p.drag.xMin, y: p.drag.yMin }, { x: p.drag.xMax, y: p.drag.yMax });
      if ("dist" in p) {
        const o = placePoints(scene, startPositions(scene))[p.from] ?? { x: 0, y: 0 };
        const far = p.drag?.[1] ?? 6;
        all.push({ x: o.x + far * Math.cos(rad(p.deg)), y: o.y + far * Math.sin(rad(p.deg)) });
      }
    }
    const xs = all.map((p) => p.x);
    const ys = all.map((p) => p.y);
    return {
      xMin: Math.min(...xs) - 0.8,
      xMax: Math.max(...xs) + 0.8,
      yMin: Math.min(...ys) - 0.8,
      yMax: Math.max(...ys) + 0.8,
    };
  }, [scene]);
  const k = Math.min(300 / (frame.xMax - frame.xMin), 260 / (frame.yMax - frame.yMin));
  const width = (frame.xMax - frame.xMin) * k;
  const height = (frame.yMax - frame.yMin) * k;
  const sx = (x: number) => (x - frame.xMin) * k;
  const sy = (y: number) => (frame.yMax - y) * k;
  const toModel = (e: { clientX: number; clientY: number }): Point | undefined => {
    const m = svg.current?.getScreenCTM();
    if (!m) return undefined;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    return { x: frame.xMin + p.x / k, y: frame.yMax - p.y / k };
  };
  const move = (e: ReactPointerEvent) => {
    if (!dragging || locked) return;
    const p = scene.points.find((q) => q.name === dragging);
    const to = toModel(e);
    if (!p || !to) return;
    const v = dragTo(p, pts, to);
    if (v !== undefined) onMove(p.name, v);
  };
  const seg = (l: string) => {
    const [a, b] = [...l].map((n) => pts[n]);
    return a && b ? { x1: sx(a.x), y1: sy(a.y), x2: sx(b.x), y2: sy(b.y) } : null;
  };
  // Point names sit away from the centre of the drawing.
  const names = scene.points.flatMap((p) => {
    const at0 = pts[p.name];
    if (!at0 || p.label === false) return [];
    const cx = (frame.xMin + frame.xMax) / 2;
    const cy = (frame.yMin + frame.yMax) / 2;
    const dx = at0.x - (r ? 0 : cx);
    const dy = at0.y - (r ? 0 : cy);
    const d = Math.hypot(dx, dy) || 1;
    return [{ name: p.name, x: sx(at0.x) + (dx / d) * 18, y: sy(at0.y) - (dy / d) * 18 }];
  });
  const centreAt = { x: sx(0) + centreLabel.ux * 16, y: sy(0) - centreLabel.uy * 16 };
  // What angle labels keep clear of: every line, the circle, and the names.
  const obstacles: Obstacles = {
    segments: [
      ...joins.flatMap((l): [Pt, Pt][] => {
        const s = seg(l);
        return s
          ? [
              [
                { x: s.x1, y: s.y1 },
                { x: s.x2, y: s.y2 },
              ],
            ]
          : [];
      }),
      ...(drawCircle ? circleSegments({ x: sx(0), y: sy(0) }, r * k) : []),
    ],
    boxes: [
      ...names.map((n) => ({ x: n.x, y: n.y, hw: 7, hh: 8 })),
      ...(usesCentre ? [{ ...centreAt, hw: 7, hh: 8 }] : []),
    ],
  };

  // The angles, marked together: each label clear of the lines, the names and the others.
  const toMark = (scene.angles ?? []).flatMap((a) => {
    const [p, v, q] = [...a.name].map((n) => pts[n]);
    if (!p || !v || !q) return [];
    const V = { x: sx(v.x), y: sy(v.y) };
    const arm = (t: Point) => {
      const d = Math.hypot(sx(t.x) - V.x, sy(t.y) - V.y) || 1;
      return { x: V.x + ((sx(t.x) - V.x) / d) * 50, y: V.y + ((sy(t.y) - V.y) / d) * 50 };
    };
    const label = a.label ?? `${Math.round(angleOf(pts, a.name))}°`;
    return [{ a, label, m: { p: V, a: arm(p), b: arm(q), text: label } }];
  });
  const placed = placeAngleMarks(
    toMark.map((t) => t.m),
    obstacles,
  );
  const angleMarks = toMark.flatMap((t, i) => {
    const mark = placed[i];
    return mark ? [{ a: t.a, label: t.label, mark }] : [];
  });

  return (
    <svg
      ref={svg}
      className={`explore-svg${locked ? " locked" : ""}`}
      viewBox={`-30 -30 ${width + 60} ${height + 60}`}
      width={width + 60}
      role="group"
      aria-label="A diagram you can drag"
      onPointerMove={move}
      onPointerUp={() => setDragging(undefined)}
      onPointerCancel={() => setDragging(undefined)}
    >
      {drawCircle && <circle className="draw-arc" cx={sx(0)} cy={sy(0)} r={r * k} />}
      {scene.lines.map((l) => {
        const s = seg(l);
        return s ? <line key={l} className="draw-line tone-main" {...s} /> : null;
      })}
      {(scene.dashed ?? []).map((l) => {
        const s = seg(l);
        return s ? <line key={l} className="draw-line tone-soft dashed" {...s} /> : null;
      })}
      {angleMarks.map(({ a, label, mark }) => {
        return (
          <g key={a.name} className={`pic-angle-mark${a.label === "?" ? " find" : ""}`}>
            {mark.arc && (
              <path
                d={`M${mark.arc.from.x} ${mark.arc.from.y} A${mark.arc.r} ${mark.arc.r} 0 ${mark.arc.large ? 1 : 0} ${mark.arc.sweep ? 1 : 0} ${mark.arc.to.x} ${mark.arc.to.y}`}
              />
            )}
            <text className="pic-angle" x={mark.label.x} y={mark.label.y + 5} textAnchor="middle">
              {label}
            </text>
          </g>
        );
      })}
      {usesCentre && <circle className="pic-centre" cx={sx(0)} cy={sy(0)} r="4" />}
      {names.map((n) => (
        <text key={`n-${n.name}`} className="pic-label" x={n.x} y={n.y + 6} textAnchor="middle">
          {n.name}
        </text>
      ))}
      {usesCentre && (
        <text className="pic-label" x={centreAt.x} y={centreAt.y + 5} textAnchor="middle">
          O
        </text>
      )}
      {scene.points.filter(draggable).map((p) => {
        const at0 = pts[p.name];
        if (!at0) return null;
        const now = at[p.name];
        const say =
          typeof now === "number"
            ? "onCircle" in p
              ? `${now}° round the circle`
              : `${now} along`
            : now
              ? `at (${now.x}, ${now.y})`
              : "";
        return (
          <g
            key={`h-${p.name}`}
            className={`explore-handle${dragging === p.name ? " dragging" : ""}`}
            role="slider"
            tabIndex={locked ? -1 : 0}
            aria-label={`Point ${p.name}: drag it, or use the arrow keys`}
            aria-valuetext={say}
            aria-disabled={locked}
            data-handle={p.name}
            onPointerDown={(e) => {
              if (locked) return;
              (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
              setDragging(p.name);
            }}
            onKeyDown={(e: KeyboardEvent) => {
              if (locked || now === undefined) return;
              const v = nudge(p, now, e.key);
              if (v !== undefined) {
                e.preventDefault();
                onMove(p.name, v);
              }
            }}
          >
            <circle className="explore-handle-hit" cx={sx(at0.x)} cy={sy(at0.y)} r="22" />
            <circle className="explore-handle-dot" cx={sx(at0.x)} cy={sy(at0.y)} r="9" />
          </g>
        );
      })}
    </svg>
  );
}

// Explore: the hundred square and the ratio bar.

/** A fraction in its simplest form, as maths. */
export function simplest(n: number, d: number): string {
  const g = (a: number, b: number): number => (b ? g(b, a % b) : a);
  const k = g(n, d) || 1;
  return `$\\frac{${n / k}}{${d / k}}$`;
}

function HundredView({
  value,
  locked,
  onMove,
}: {
  value: number;
  locked: boolean;
  onMove: (v: number) => void;
}) {
  return (
    <div className="explore-hundred">
      <svg viewBox="0 0 200 200" className="explore-grid" aria-hidden="true">
        {Array.from({ length: 100 }, (_, i) => (
          <rect
            key={i}
            x={(i % 10) * 20 + 1}
            y={Math.floor(i / 10) * 20 + 1}
            width="18"
            height="18"
            className={i < value ? "shaded" : undefined}
          />
        ))}
      </svg>
      <input
        type="range"
        className="explore-range"
        min={0}
        max={100}
        value={value}
        disabled={locked}
        aria-label="Squares shaded"
        onChange={(e) => onMove(Number(e.target.value))}
      />
    </div>
  );
}

function RatioView({
  scene,
  total,
  locked,
  onMove,
}: {
  scene: RatioScene;
  total: number;
  locked: boolean;
  onMove: (v: number) => void;
}) {
  const parts = scene.rows.reduce((s, r) => s + r.parts, 0);
  const one = total / parts;
  const money = (v: number) => {
    const n = Number.isInteger(v) ? String(v) : v.toFixed(2);
    return scene.unit === "£" ? `£${n}` : scene.unit ? `${n} ${scene.unit}` : n;
  };
  return (
    <div className="explore-ratio">
      {scene.rows.map((row) => (
        <div key={row.label} className="explore-ratio-row">
          <span className="explore-ratio-label">{row.label}</span>
          <span className="explore-ratio-boxes">
            {Array.from({ length: row.parts }, (_, i) => (
              <span key={i} className="explore-ratio-box">
                {money(one)}
              </span>
            ))}
          </span>
        </div>
      ))}
      <input
        type="range"
        className="explore-range"
        min={scene.total.min}
        max={scene.total.max}
        step={scene.total.step}
        value={total}
        disabled={locked}
        aria-label="The total to share"
        onChange={(e) => onMove(Number(e.target.value))}
      />
    </div>
  );
}

/** A number cut to `dp` places, with no float dust: 0.1 + 0.2 is 0.3. */
const clean = (v: number, dp = 9) => Number.parseFloat(v.toFixed(dp));

/** Round half up (away from zero), safely past float error. */
function roundTo(v: number, unit: number): number {
  const n = Math.abs(v) / unit;
  const r = Math.floor(n + 0.5 + 1e-9) * unit;
  return clean(Math.sign(v) * r);
}

/** What a number becomes under a readout on a number-line Explore. */
export function lineValue(r: LineReadout, v: number): number {
  if ("round" in r) return roundTo(v, 10 ** -r.round);
  if ("nearest" in r) return roundTo(v, r.nearest);
  if ("sf" in r) {
    if (v === 0) return 0;
    const place = Math.floor(Math.log10(Math.abs(v)) + 1e-9) - r.sf + 1;
    return roundTo(v, 10 ** place);
  }
  if ("times" in r) return clean(v * r.times);
  if ("plus" in r) return clean(v + r.plus);
  if ("power" in r) return clean(v ** r.power);
  return clean(v);
}

/** A number as it is written: a true minus sign, and the places asked for. */
export function lineText(v: number, dp?: number): string {
  const t = dp === undefined ? String(clean(v)) : clean(v).toFixed(dp);
  return t.replace(/^-/, "−");
}

/** How many places a readout shows: as many as it rounds to, or as the number has. */
const readoutDp = (r: LineReadout, scene: LineScene) =>
  r.dp ?? ("round" in r ? r.round : "value" in r ? scene.dp : undefined);

function LineView({
  scene,
  value,
  locked,
  onMove,
}: {
  scene: LineScene;
  value: number;
  locked: boolean;
  onMove: (v: number) => void;
}) {
  const first = scene.readouts[0];
  const marks: NonNullable<Parameters<typeof NumberLine>[0]["extra"]> = [
    { at: value, label: lineText(value, scene.dp), tone: "mine" },
  ];
  if (scene.markFirst && first) {
    const to = lineValue(first, value);
    // A ring, unlabelled: its value is in the first readout, and a label would crowd the number's.
    if (to !== value) marks.push({ at: to, tone: "hint" });
  }
  const steps = Math.round((scene.max - scene.min) / scene.step);
  return (
    <div className="explore-line">
      <NumberLine
        line={{
          kind: "number-line",
          min: scene.min,
          max: scene.max,
          step: scene.tick,
          ...(scene.every ? { every: scene.every } : {}),
        }}
        extra={marks}
        label={`A number line from ${lineText(scene.min)} to ${lineText(scene.max)}, with the number at ${lineText(value, scene.dp)}.`}
      />
      <input
        type="range"
        className="explore-range"
        min={0}
        max={steps}
        value={Math.round((value - scene.min) / scene.step)}
        disabled={locked}
        aria-label="The number"
        aria-valuetext={lineText(value, scene.dp)}
        onChange={(e) => onMove(clean(scene.min + Number(e.target.value) * scene.step))}
      />
    </div>
  );
}

/** What the readouts say for a hundred square, or for a ratio, at a value. */
export function sceneReadouts(
  scene: Explore["scene"],
  value: number | Positions,
): { label: string; value: string }[] {
  if (scene.kind === "hundred" && typeof value === "number")
    return [
      { label: "Shaded", value: `${value} out of 100` },
      { label: "Fraction", value: simplest(value, 100) },
      { label: "Decimal", value: String(value / 100) },
      { label: "Percentage", value: `${value}%` },
    ];
  if (scene.kind === "ratio" && typeof value === "number") {
    const parts = scene.rows.reduce((s, r) => s + r.parts, 0);
    const one = value / parts;
    const fmt = (v: number) => {
      const n = Number.isInteger(v) ? String(v) : v.toFixed(2);
      return scene.unit === "£" ? `£${n}` : scene.unit ? `${n} ${scene.unit}` : n;
    };
    return [
      { label: "Total", value: fmt(value) },
      { label: `${parts} parts, so one part`, value: fmt(one) },
      ...scene.rows.map((r) => ({ label: `${r.label}'s share`, value: fmt(one * r.parts) })),
    ];
  }
  if (scene.kind === "line" && typeof value === "number")
    return scene.readouts.map((r) => {
      const v = lineValue(r, value);
      const dp = readoutDp(r, scene);
      return {
        label: r.label,
        value: lineText(r.dp === undefined ? v : roundTo(v, 10 ** -r.dp), dp),
      };
    });
  if (scene.kind === "geometry" && typeof value === "object") {
    const pts = placePoints(scene, value);
    return scene.readouts.map((r) => {
      const v = readoutValue(pts, r);
      const isAngle = "angle" in r || "sum" in r;
      const isLength = "length" in r || "circumference" in r;
      return {
        label: r.label,
        value: `${v}${isAngle ? "°" : isLength ? " cm" : "circleArea" in r ? " cm²" : ""}`,
      };
    });
  }
  return [];
}

/** How much exploring is enough before the question: distinct places the pupil has tried. */
const ENOUGH = 4;

export function ExploreStep({ screen, family, sound, onNext }: Step<Explore>) {
  const scene = screen.scene;
  const [at, setAt] = useState<Positions>(() =>
    scene.kind === "geometry" ? startPositions(scene) : {},
  );
  const [value, setValue] = useState(() =>
    scene.kind === "hundred"
      ? scene.start
      : scene.kind === "ratio"
        ? scene.total.start
        : scene.kind === "line"
          ? scene.start
          : 0,
  );
  const [seen, setSeen] = useState<Set<string>>(() => new Set());
  const [predicted, setPredicted] = useState<number>();
  const [tried, setTried] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  useChime(done, sound);
  const locked = screen.expect !== undefined && predicted === undefined;
  const explored = seen.size >= ENOUGH;
  const expectOrder = useMemo(
    () =>
      shuffled(
        (screen.expect?.options ?? []).map((_, i) => i),
        screen.expect?.question ?? "",
      ),
    [screen.expect],
  );
  const noticeOrder = useMemo(
    () =>
      shuffled(
        screen.notice.options.map((_, i) => i),
        screen.notice.question,
      ),
    [screen.notice],
  );
  const record = (key: string) => setSeen((s) => (s.has(key) ? s : new Set(s).add(key)));
  const readouts = sceneReadouts(scene, scene.kind === "geometry" ? at : value);

  const choose = (i: number) => {
    const o = screen.notice.options[i];
    if (!o) return;
    if (o.correct) setDone(true);
    else {
      setTried([...tried, i]);
      play("wrong", sound);
    }
  };
  const expectFeedback = (options: Option[], picked: number | undefined) => {
    const r = options.find((o) => o.correct);
    if (!r || picked === undefined) return "";
    return options[picked]?.correct
      ? `**As you expected.** ${r.feedback}`
      : `**You expected something else.** ${r.feedback}`;
  };
  const wrongNote = tried.length ? (screen.notice.options[tried.at(-1) ?? -1]?.feedback ?? "") : "";

  return (
    <>
      <main className="lesson-main">
        <Title title={screen.title} family={family} />
        {screen.text && (
          <p className="lesson-lead">
            <W text={screen.text} />
          </p>
        )}
        <div className="explore-stage">
          {scene.kind === "geometry" ? (
            <GeometryView
              scene={scene}
              at={at}
              locked={locked}
              onMove={(name, v) => {
                setAt((a) => ({ ...a, [name]: v }));
                record(`${name}:${JSON.stringify(v)}`);
              }}
            />
          ) : scene.kind === "hundred" ? (
            <HundredView
              value={value}
              locked={locked}
              onMove={(v) => {
                setValue(v);
                record(String(v));
              }}
            />
          ) : scene.kind === "line" ? (
            <LineView
              scene={scene}
              value={value}
              locked={locked}
              onMove={(v) => {
                setValue(v);
                record(String(v));
              }}
            />
          ) : (
            <RatioView
              scene={scene}
              total={value}
              locked={locked}
              onMove={(v) => {
                setValue(v);
                record(String(v));
              }}
            />
          )}
          <dl className="explore-readouts" aria-live="polite">
            {readouts.map((r) => (
              <div key={r.label}>
                <dt>
                  <W text={r.label} />
                </dt>
                <dd>
                  <W text={r.value} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
        {locked && screen.expect ? (
          <div className="ask-expect">
            <p className="ul-prompt">
              <W text={screen.expect.question} />
            </p>
            <div className="ul-options" role="group" aria-label="What do you expect?">
              {expectOrder.map((i) => {
                const o = screen.expect?.options[i];
                return o ? (
                  <button
                    key={i}
                    type="button"
                    data-i={i}
                    className="ul-option"
                    onClick={() => setPredicted(i)}
                  >
                    <W text={o.text} />
                  </button>
                ) : null;
              })}
            </div>
          </div>
        ) : explored && !done ? (
          <div className="ask-expect">
            <p className="ul-prompt">
              <W text={screen.notice.question} />
            </p>
            <div className="ul-options" role="group" aria-label="What did you notice?">
              {noticeOrder.map((i) => {
                const o = screen.notice.options[i];
                return o ? (
                  <button
                    key={i}
                    type="button"
                    data-i={i}
                    className={`ul-option${tried.includes(i) ? " tried" : ""}`}
                    disabled={tried.includes(i)}
                    onClick={() => choose(i)}
                  >
                    <W text={o.text} />
                  </button>
                ) : null;
              })}
            </div>
          </div>
        ) : null}
      </main>
      {done ? (
        <Verdict
          right
          text={[expectFeedback(screen.expect?.options ?? [], predicted), screen.done]
            .filter(Boolean)
            .join(" ")}
          family={family}
          seed={seen.size}
          action="Continue"
          onAction={onNext}
        />
      ) : (
        <Working
          note={
            locked
              ? "Before you drag: what do you expect?"
              : !explored
                ? scene.kind === "geometry"
                  ? "Drag the blue dot, and watch the numbers."
                  : "Drag the slider, and watch the numbers."
                : "What did you notice?"
          }
          hint={wrongNote || undefined}
          family={family}
        />
      )}
    </>
  );
}

/** Several Tap questions, one at a time, each on its own diagram: a quick round of spotting. */
export function TapSetStep({ screen, family, sound, onNext }: Step<TapSet>) {
  const [at, setAt] = useState(0);
  const item = screen.items[at];
  if (!item) return null;
  const last = at + 1 === screen.items.length;
  return (
    <TapStep
      // A fresh question each time.
      key={at}
      screen={{
        kind: "tap",
        title: screen.title,
        text: `Question ${at + 1} of ${screen.items.length}`,
        picture: item.picture,
        answers: item.answers,
        ...(item.anyOf ? { anyOf: item.anyOf } : {}),
        ...(item.wrong ? { wrong: item.wrong } : {}),
        hint: item.hint,
        done: last ? `${item.done} ${screen.done}` : item.done,
      }}
      family={family}
      sound={sound}
      onNext={() => (last ? onNext() : setAt(at + 1))}
    />
  );
}
