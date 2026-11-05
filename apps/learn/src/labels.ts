// Where labels go on a shape, in screen coordinates (y down), so they never cross a line: a side's
// label sits level, just outside the side, pushed out by as much as its width needs; an angle's
// label sits on the angle's bisector, past an arc that marks the angle, and clear of both arms.

export interface Pt {
  x: number;
  y: number;
}

/** A label's box: its centre and half its width and height. */
export interface Box extends Pt {
  hw: number;
  hh: number;
}

/** How big a label is at a font size, near enough: the display font's letters average 0.58em. */
export function textSize(text: string, size = 16): { hw: number; hh: number } {
  return { hw: Math.max(1, [...text].length) * size * 0.29 + 2, hh: size * 0.5 };
}

const unit = (v: Pt): Pt => {
  const l = Math.hypot(v.x, v.y) || 1;
  return { x: v.x / l, y: v.y / l };
};

/** Is the point inside the polygon? (Even-odd rule.) */
export function inside(p: Pt, poly: Pt[]): boolean {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i];
    const b = poly[j];
    if (!a || !b) continue;
    if (a.y > p.y !== b.y > p.y && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x)
      hit = !hit;
  }
  return hit;
}

/** How far a box reaches in a direction from its centre. */
const reach = (d: Pt, hw: number, hh: number) => Math.abs(d.x) * hw + Math.abs(d.y) * hh;

/** A level label for the side from a to b of a polygon, just outside it. */
export function sideLabel(a: Pt, b: Pt, poly: Pt[], text: string, gap = 5, size = 16): Box {
  const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  let n = unit({ x: b.y - a.y, y: -(b.x - a.x) });
  if (inside({ x: mid.x + n.x * 2, y: mid.y + n.y * 2 }, poly)) n = { x: -n.x, y: -n.y };
  const { hw, hh } = textSize(text, size);
  const d = reach(n, hw, hh) + gap;
  return { x: mid.x + n.x * d, y: mid.y + n.y * d, hw, hh };
}

export interface AngleMark {
  /** The arc, from one arm to the other, or none for a right angle marked with a square. */
  arc?: { from: Pt; to: Pt; r: number; large: boolean; sweep: boolean };
  label: Box;
}

/**
 * The arc and label for the angle at p between the arms to a and b. The angle is the one inside
 * the polygon, if given; otherwise the smaller one. A right angle with a square gets no arc.
 */
export function angleMark(
  p: Pt,
  a: Pt,
  b: Pt,
  text: string,
  opts: { poly?: Pt[]; square?: boolean; size?: number } = {},
): AngleMark {
  const u = unit({ x: a.x - p.x, y: a.y - p.y });
  const v = unit({ x: b.x - p.x, y: b.y - p.y });
  const small = Math.acos(Math.max(-1, Math.min(1, u.x * v.x + u.y * v.y)));
  let bis =
    Math.hypot(u.x + v.x, u.y + v.y) < 1e-6
      ? { x: -u.y, y: u.x }
      : unit({ x: u.x + v.x, y: u.y + v.y });
  let angle = small;
  if (opts.poly && !inside({ x: p.x + bis.x * 3, y: p.y + bis.y * 3 }, opts.poly)) {
    bis = { x: -bis.x, y: -bis.y };
    angle = 2 * Math.PI - small;
  }
  // A small angle gets a bigger arc, so the arc and its label have room between the arms.
  const deg = (angle * 180) / Math.PI;
  const r = opts.square ? 14 : deg < 30 ? 40 : deg < 50 ? 32 : deg < 80 ? 27 : 23;
  const { hw, hh } = textSize(text, opts.size ?? 15);
  const half = Math.sin(Math.min(angle, Math.PI) / 2);
  const clear = (arm: Pt) => (reach({ x: -arm.y, y: arm.x }, hw, hh) + 3) / Math.max(half, 0.05);
  const d = Math.max(
    r + 5 + reach(bis, hw, hh),
    angle < Math.PI ? Math.max(clear(u), clear(v)) : 0,
  );
  const label = { x: p.x + bis.x * d, y: p.y + bis.y * d, hw, hh };
  if (opts.square) return { label };
  // On a thin angle the label sits far out, so the arc reaches out to meet it.
  const arcR = Math.max(r, d - reach(bis, hw, hh) - 6);
  // SVG's sweep flag is clockwise on screen: the arc turns from u towards the bisector.
  const turn = Math.atan2(bis.y, bis.x) - Math.atan2(u.y, u.x);
  const sweep = Math.sin(turn) > 0;
  return {
    arc: {
      from: { x: p.x + u.x * arcR, y: p.y + u.y * arcR },
      to: { x: p.x + v.x * arcR, y: p.y + v.y * arcR },
      r: arcR,
      large: angle > Math.PI,
      sweep,
    },
    label,
  };
}

/** Do two boxes overlap? */
export const overlap = (a: Box, b: Box) =>
  Math.abs(a.x - b.x) < a.hw + b.hw && Math.abs(a.y - b.y) < a.hh + b.hh;

/** Does the segment from a to b pass through the box? */
export function crosses(box: Box, a: Pt, b: Pt): boolean {
  // Liang–Barsky clipping against the box.
  let t0 = 0;
  let t1 = 1;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const edges: [number, number][] = [
    [-dx, a.x - (box.x - box.hw)],
    [dx, box.x + box.hw - a.x],
    [-dy, a.y - (box.y - box.hh)],
    [dy, box.y + box.hh - a.y],
  ];
  for (const [p, q] of edges) {
    if (p === 0) {
      if (q < 0) return false;
    } else {
      const t = q / p;
      if (p < 0) t0 = Math.max(t0, t);
      else t1 = Math.min(t1, t);
      if (t0 > t1) return false;
    }
  }
  return true;
}

/** The shape fields the layout needs (a ShapePic from unit-lessons/types.ts). */
export interface ShapeLike {
  points: Pt[];
  sides?: (string | null)[];
  angles?: (string | null)[];
  names?: string[];
  square?: number[];
  dashed?: [Pt, Pt][];
  mirrors?: [Pt, Pt][];
  dots?: Pt[];
}

/**
 * A shape laid out on screen, 200px across at its widest, with every label placed: side labels
 * (or the marks a pupil has put on its sides), angle arcs and labels, and corner names.
 */
export function layoutShape(pic: ShapeLike, sideMarks?: (string | undefined)[]) {
  const extra = [...(pic.mirrors ?? []).flat(), ...(pic.dashed ?? []).flat(), ...(pic.dots ?? [])];
  const all = [...pic.points, ...extra];
  const minX = Math.min(...all.map((p) => p.x));
  const maxX = Math.max(...all.map((p) => p.x));
  const minY = Math.min(...all.map((p) => p.y));
  const maxY = Math.max(...all.map((p) => p.y));
  const k = 200 / (Math.max(maxX - minX, maxY - minY) || 1);
  const sx = (x: number) => (x - minX) * k;
  const sy = (y: number) => (maxY - y) * k;
  const scr = pic.points.map((p) => ({ x: sx(p.x), y: sy(p.y) }));
  const corner = (i: number) => scr[(i + scr.length) % scr.length] ?? { x: 0, y: 0 };
  const centre = {
    x: scr.reduce((a, p) => a + p.x, 0) / scr.length,
    y: scr.reduce((a, p) => a + p.y, 0) / scr.length,
  };
  const boxes: Box[] = [];
  const sideLabels = scr.map((a, i) => {
    const text = sideMarks ? sideMarks[i] : pic.sides?.[i];
    if (!text) return null;
    const box = sideLabel(a, corner(i + 1), scr, text);
    boxes.push(box);
    return { box, text };
  });
  const angleMarks = scr.map((p, i) => {
    const text = pic.angles?.[i];
    if (!text) return null;
    const mark = angleMark(p, corner(i - 1), corner(i + 1), text, {
      poly: scr,
      square: pic.square?.includes(i) ?? false,
    });
    boxes.push(mark.label);
    return { ...mark, text };
  });
  const names = scr.map((p, i) => {
    const name = pic.names?.[i];
    if (!name) return null;
    const out = { x: p.x - centre.x, y: p.y - centre.y };
    const l = Math.hypot(out.x, out.y) || 1;
    const box = { x: p.x + (out.x / l) * 16, y: p.y + (out.y / l) * 16, hw: 7, hh: 8 };
    boxes.push(box);
    return { box, name };
  });
  return { scr, sideLabels, angleMarks, names, boxes, sx, sy };
}
