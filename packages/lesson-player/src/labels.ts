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

/** How far out an angle's label and arc may go, in pixels: further, and they lose their angle. */
const MAX_LABEL = 62;
const MAX_ARC = 44;

/**
 * The arc and label for the angle at p between the arms to a and b. The angle is the one inside
 * the polygon, if given; otherwise the smaller one. A right angle with a square gets no arc.
 */
export function angleMark(
  p: Pt,
  a: Pt,
  b: Pt,
  text: string,
  opts: {
    poly?: Pt[];
    square?: boolean;
    size?: number;
    /** How much further out than its nearest clear place. */
    extra?: number;
    /** Where between the arms, from 0 (on the arm to a) to 1 (on the arm to b); 0.5 by default. */
    lean?: number;
  } = {},
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
  // The label's direction: the bisector, or leaning towards one arm to find room.
  const lean = opts.lean ?? 0.5;
  const turnTo = Math.sign(u.x * bis.y - u.y * bis.x) || 1;
  const at = Math.atan2(u.y, u.x) + turnTo * lean * angle;
  const dir = lean === 0.5 ? bis : { x: Math.cos(at), y: Math.sin(at) };
  // Far enough out for the label to clear both arms.
  const clear = (arm: Pt, part: number) =>
    (reach({ x: -arm.y, y: arm.x }, hw, hh) + 3) /
    Math.max(Math.sin(Math.min(part, Math.PI / 2)), 0.05);
  const d = Math.max(
    r + 5 + reach(dir, hw, hh),
    angle < Math.PI ? Math.max(clear(u, lean * angle), clear(v, (1 - lean) * angle)) : 0,
  );
  // Pushed further out, past whatever is in its way, but never so far that it leaves its angle:
  // a very thin angle's label sits just past its arc and lets its halo carry it over the arm.
  // (Shapes keep every label off their sides instead, however far out that is.)
  const far = opts.poly ? d + (opts.extra ?? 0) : Math.min(d + (opts.extra ?? 0), MAX_LABEL);
  const label = { x: p.x + dir.x * far, y: p.y + dir.y * far, hw, hh };
  if (opts.square) return { label };
  // On a thin angle, or one pushed out past a line, the label sits far out, so the arc reaches
  // out to meet it: the number stays joined to its own angle.
  const arcR = Math.max(
    r,
    opts.poly ? far - reach(dir, hw, hh) - 6 : Math.min(far - reach(dir, hw, hh) - 6, MAX_ARC),
  );
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

/** What an angle's label must keep clear of: the drawing's lines, and labels already placed. */
export interface Obstacles {
  segments: [Pt, Pt][];
  boxes: Box[];
}

/**
 * An angle's mark with its label pushed out along the bisector, a step at a time, until it is
 * clear of every line and every label already placed: where chords cross near a corner, the
 * number moves into the space beyond them. If nothing is clear within reach, the least crowded
 * place wins. The label is then added to the obstacles, so the next one keeps clear of it.
 */
export function clearAngleMark(
  p: Pt,
  a: Pt,
  b: Pt,
  text: string,
  obstacles: Obstacles,
  opts: { poly?: Pt[]; square?: boolean; size?: number } = {},
  /** Other angles' labels, to keep a little way from so each is plainly its own angle's. */
  neighbours: Box[] = [],
): AngleMark {
  // The bit of circle through the corner itself is no obstacle: every angle on a circle has it.
  const near = (q: Pt) => Math.hypot(q.x - p.x, q.y - p.y) < 45;
  const segments = obstacles.segments.filter(([s, t]) => !(near(s) && near(t)));
  const hits = (box: Box) => {
    const padded = { ...box, hw: box.hw + 2, hh: box.hh + 2 };
    return (
      segments.filter(([s, t]) => crosses(padded, s, t)).length +
      obstacles.boxes.filter((o) => overlap(padded, o)).length
    );
  };
  // How crowded a place is by other angles' labels: closer than 56px is too close to tell apart.
  const crowding = (box: Box) =>
    neighbours.reduce(
      (sum, o) => sum + 1.5 * Math.max(0, 56 - Math.hypot(box.x - o.x, box.y - o.y)),
      0,
    );
  let best: AngleMark | undefined;
  let least = Infinity;
  // On the bisector if that's clear and uncrowded; otherwise leaning towards an arm, or further
  // out, whichever is clear of lines and least crowded, the nearest such place winning.
  for (const lean of opts.poly ? [0.5] : [0.5, 0.38, 0.62, 0.27, 0.73]) {
    for (let extra = 0; extra <= 36; extra += 4) {
      const mark = angleMark(p, a, b, text, { ...opts, extra, lean });
      const cost =
        hits(mark.label) * 1000 + crowding(mark.label) + extra * 0.4 + Math.abs(lean - 0.5) * 20;
      if (cost < least) {
        best = mark;
        least = cost;
      }
    }
  }
  const chosen = best ?? angleMark(p, a, b, text, opts);
  obstacles.boxes.push(chosen.label);
  return chosen;
}

/** A circle as short straight pieces, for keeping labels off its edge. */
export function circleSegments(c: Pt, r: number, steps = 48): [Pt, Pt][] {
  const at = (i: number) => {
    const t = (i / steps) * 2 * Math.PI;
    return { x: c.x + r * Math.cos(t), y: c.y + r * Math.sin(t) };
  };
  return Array.from({ length: steps }, (_, i): [Pt, Pt] => [at(i), at(i + 1)]);
}

/** An angle to mark: its corner, a point on each arm, and its label. */
export interface AngleToMark {
  p: Pt;
  a: Pt;
  b: Pt;
  text: string;
}

/**
 * Marks for several angles, each label clear of the lines and of the others. They are placed
 * twice: the second time, each label makes room knowing where all the others went.
 */
export function placeAngleMarks(angles: AngleToMark[], obstacles: Obstacles): AngleMark[] {
  const fixed = [...obstacles.boxes];
  const marks: AngleMark[] = [];
  for (const m of angles)
    marks.push(
      clearAngleMark(
        m.p,
        m.a,
        m.b,
        m.text,
        obstacles,
        {},
        marks.map((k) => k.label),
      ),
    );
  angles.forEach((m, i) => {
    const others = marks.flatMap((k, j) => (j === i ? [] : [k.label]));
    marks[i] = clearAngleMark(
      m.p,
      m.a,
      m.b,
      m.text,
      { segments: obstacles.segments, boxes: [...fixed, ...others] },
      {},
      others,
    );
  });
  obstacles.boxes.splice(0, obstacles.boxes.length, ...fixed, ...marks.map((k) => k.label));
  return marks;
}
