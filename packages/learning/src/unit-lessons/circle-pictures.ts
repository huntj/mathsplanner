// Circle theorem diagrams, drawn accurately from where each point sits on the circle, so the angles
// a pupil sees match the numbers. Points are single letters; O is the centre. Lines are written as
// two letters ("OA"), angles as three ("ACB": at C, between CA and CB).
import type { DrawingPic, Point } from "./types.ts";

const P = (x: number, y: number): Point => ({ x, y });
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => ((r * 180) / Math.PI + 360) % 360;

export interface CircleSpec {
  /** The radius; 3 unless set. */
  r?: number;
  /** Points on the circle, by their direction from the centre in degrees. */
  on: Record<string, number>;
  /** Points off the circle, such as where two tangents meet. */
  off?: Record<string, Point>;
  /** Show the centre O. */
  centre?: boolean;
  lines?: string[];
  dashed?: string[];
  /** Angles to mark: "ACB" and its label, such as "40°", "x" or "?". */
  angles?: [string, string][];
  /** Tangents: a line through a point on the circle at right angles to its radius, with the
   * names of its two ends (or "" for none) and its half-length. */
  tangents?: { at: string; ends?: [string, string]; len?: number }[];
  /** For a Tap screen: every line and marked angle can be tapped, by its name ("OA", "ACB").
   * Angles with an empty label are then drawn too, as unlabelled choices. */
  tap?: boolean;
  /** Labels beside lines, such as a radius of 5 cm: the line ("OA") and its label. */
  sides?: [string, string][];
}

/** Where a named point is. */
function placer(spec: CircleSpec) {
  const r = spec.r ?? 3;
  const pts: Record<string, Point> = { O: P(0, 0), ...spec.off };
  for (const [name, d] of Object.entries(spec.on))
    pts[name] = P(r * Math.cos(rad(d)), r * Math.sin(rad(d)));
  for (const t of spec.tangents ?? []) {
    const at = pts[t.at];
    const d = spec.on[t.at];
    if (!at || d === undefined || !t.ends) continue;
    const len = t.len ?? 2.6;
    const dir = P(-Math.sin(rad(d)), Math.cos(rad(d)));
    const [a, b] = t.ends;
    if (a) pts[a] = P(at.x - len * dir.x, at.y - len * dir.y);
    if (b) pts[b] = P(at.x + len * dir.x, at.y + len * dir.y);
  }
  return { r, pts };
}

/** The direction from one point to another, in degrees. */
const towards = (a: Point, b: Point) => deg(Math.atan2(b.y - a.y, b.x - a.x));

/** An angle at `v` between two directions, as the renderer wants it: anticlockwise, under 180°. */
export function angleBetween(v: Point, a: Point, b: Point): { from: number; to: number } {
  const d1 = towards(v, a);
  const d2 = towards(v, b);
  const sweep = (d2 - d1 + 360) % 360;
  return sweep <= 180 ? { from: d1, to: d1 + sweep } : { from: d2, to: d2 + (360 - sweep) };
}

/** The size of angle "ACB" in a diagram, in degrees, for checking numbers against the picture. */
export function measure(spec: CircleSpec, abc: string): number {
  const { pts } = placer(spec);
  const [a, v, b] = [...abc].map((n) => pts[n]);
  if (!a || !v || !b) return NaN;
  const { from, to } = angleBetween(v, a, b);
  return to - from;
}

/** Where to put a point's name: away from the centre, or for O, away from its lines. */
function nameAt(
  name: string,
  at: Point,
  r: number,
  spec: CircleSpec,
  pts: Record<string, Point>,
): Point {
  if (name !== "O") {
    const away = Math.hypot(at.x, at.y) || 1;
    const k = Math.hypot(at.x, at.y) > r + 0.1 ? 0.5 : 0.48;
    return P(at.x + (at.x / away) * k, at.y + (at.y / away) * k);
  }
  // For O, the direction furthest from every line that leaves it.
  const used = [...(spec.lines ?? []), ...(spec.dashed ?? [])]
    .filter((l) => l.includes("O"))
    .map((l) => pts[l.replace("O", "")])
    .filter((p): p is Point => p !== undefined)
    .map((p) => towards(P(0, 0), p));
  let best = 315;
  let gap = -1;
  for (let d = 0; d < 360; d += 15) {
    const g = Math.min(...used.map((u) => Math.min(Math.abs(u - d), 360 - Math.abs(u - d))), 360);
    if (g > gap) {
      gap = g;
      best = d;
    }
  }
  return P(0.45 * Math.cos(rad(best)), 0.45 * Math.sin(rad(best)));
}

/** A circle diagram from its spec. */
export function circlePic(spec: CircleSpec): DrawingPic {
  const { r, pts } = placer(spec);
  const seg = (l: string) => {
    const a = pts[l[0] ?? ""];
    const b = pts[l[1] ?? ""];
    if (!a || !b) throw new Error(`No line ${l}`);
    return [a, b] as [Point, Point];
  };
  const items: DrawingPic["items"] = [{ arc: P(0, 0), r, from: 0, to: 360 }];
  for (const l of spec.lines ?? []) items.push({ line: seg(l), ...(spec.tap ? { tap: l } : {}) });
  for (const l of spec.dashed ?? []) items.push({ line: seg(l), dashed: true });
  for (const t of spec.tangents ?? []) {
    const [a, b] = t.ends ?? [];
    const at = pts[t.at];
    const d = spec.on[t.at];
    if (!at || d === undefined) continue;
    const len = t.len ?? 2.6;
    const dir = P(-Math.sin(rad(d)), Math.cos(rad(d)));
    items.push({
      line: [P(at.x - len * dir.x, at.y - len * dir.y), P(at.x + len * dir.x, at.y + len * dir.y)],
      ...(spec.tap && a && b ? { tap: `${a}${b}` } : {}),
    });
    for (const n of [a, b])
      if (n && pts[n]) items.push({ text: n, at: nameAt(n, pts[n] as Point, r, spec, pts) });
  }
  if (spec.centre) items.push({ dot: P(0, 0) });
  for (const [abc, label] of spec.angles ?? []) {
    if (!label && !spec.tap) continue;
    const [a, v, b] = [...abc].map((n) => pts[n]);
    if (!a || !v || !b) throw new Error(`No angle ${abc}`);
    items.push({ angle: v, ...angleBetween(v, a, b), label, ...(spec.tap ? { tap: abc } : {}) });
  }
  // Side labels sit outside each line, away from the middle of the drawing.
  const all = Object.values(pts);
  const mid = P(
    all.reduce((t, p) => t + p.x, 0) / all.length,
    all.reduce((t, p) => t + p.y, 0) / all.length,
  );
  for (const [l, label] of spec.sides ?? []) items.push({ side: seg(l), label, inside: mid });
  const tangentEnds = new Set((spec.tangents ?? []).flatMap((t) => t.ends ?? []));
  for (const [name, at] of Object.entries(pts))
    if ((name !== "O" || spec.centre) && !tangentEnds.has(name))
      items.push({ text: name, at: nameAt(name, at, r, spec, pts) });
  const xs = Object.values(pts).map((p) => p.x);
  const ys = Object.values(pts).map((p) => p.y);
  const m = 0.9;
  return {
    kind: "drawing",
    frame: {
      xMin: Math.min(-r, ...xs) - m,
      xMax: Math.max(r, ...xs) + m,
      yMin: Math.min(-r, ...ys) - m,
      yMax: Math.max(r, ...ys) + m,
    },
    items,
  };
}
