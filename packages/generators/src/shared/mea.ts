// Shared pieces for the measurement strand: clocks and time words, money, scales, rulers, shapes
// on squared grids, labelled rectilinear shapes, cuboids, triangles and parallelograms.
import type { Numbers, Rng } from "@mathsplanner/core";
import type {
  BarModelSpec,
  CartesianSpec,
  ClockSpec,
  Coord,
  GeometrySpec,
  GeoSegment,
  RulerSpec,
  ScaleSpec,
} from "@mathsplanner/diagrams";

// --- time ------------------------------------------------------------------------------------

export const clock = (
  hours: number,
  minutes: number,
  extra: Partial<ClockSpec> = {},
): ClockSpec => ({
  type: "measure",
  instrument: "clock",
  hours: ((hours % 24) + 24) % 24,
  minutes,
  ...extra,
});

export const h12 = (h: number) => (((h % 12) + 12) % 12 === 0 ? 12 : ((h % 12) + 12) % 12);
export const pad = (n: number) => String(n).padStart(2, "0");

/** "3 o'clock", "half past 3", "quarter to 4", "20 past 3", "25 to 4", "17 minutes past 3". */
export function timeWords(h: number, m: number): string {
  if (m === 0) return `${h12(h)} o'clock`;
  if (m === 15) return `quarter past ${h12(h)}`;
  if (m === 30) return `half past ${h12(h)}`;
  if (m === 45) return `quarter to ${h12(h + 1)}`;
  const n = m < 30 ? m : 60 - m;
  const unit = n % 5 === 0 ? "" : n === 1 ? " minute" : " minutes";
  return m < 30 ? `${n}${unit} past ${h12(h)}` : `${n}${unit} to ${h12(h + 1)}`;
}

/** 12-hour digital time without am/pm: 3:05. */
export const digital = (h: number, m: number) => `${h12(h)}:${pad(m)}`;
/** 24-hour time: 15:05. */
export const time24 = (h: number, m: number) => `${pad(((h % 24) + 24) % 24)}:${pad(m)}`;
/** 12-hour time with am or pm: 3:05 pm. */
export const ampm = (h: number, m: number) =>
  `${digital(h, m)} ${((h % 24) + 24) % 24 < 12 ? "am" : "pm"}`;
/** Minutes after midnight as a time of day [hours, minutes]. */
export const hm = (minutes: number): [number, number] => [
  Math.floor(minutes / 60) % 24,
  minutes % 60,
];
/** "2 hours 5 minutes", "45 minutes", "1 hour". */
export function duration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const hs = h === 0 ? "" : `${h} hour${h === 1 ? "" : "s"}`;
  const ms = m === 0 ? "" : `${m} minute${m === 1 ? "" : "s"}`;
  return [hs, ms].filter(Boolean).join(" ") || "0 minutes";
}

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// --- money -----------------------------------------------------------------------------------

/** Pence as money: 35p, or £2.35 from 100p up. */
export const money = (pence: number) => (pence < 100 ? `${pence}p` : pounds(pence));
/** Pence in pounds: £2.35, £4.00. */
export const pounds = (pence: number) => `£${(pence / 100).toFixed(2)}`;
export const COINS = [1, 2, 5, 10, 20, 50, 100, 200];
export const coinName = (p: number) => (p >= 100 ? `£${p / 100}` : `${p}p`);

/** The fewest coins (1p to £2) that make an amount. */
export function fewestCoins(pence: number): number[] {
  const out: number[] = [];
  let left = pence;
  for (const c of [...COINS].reverse()) {
    while (left >= c) {
      out.push(c);
      left -= c;
    }
  }
  return out;
}

/** Exactly `count` coins (1p to £2, largest first) that make an amount, if any do. */
export function coinsMaking(
  pence: number,
  count: number,
  from = COINS.length - 1,
): number[] | undefined {
  if (count === 0) return pence === 0 ? [] : undefined;
  for (let i = from; i >= 0; i--) {
    const c = COINS[i] as number;
    if (c > pence || c * count < pence) continue;
    const rest = coinsMaking(pence - c, count - 1, i);
    if (rest) return [c, ...rest];
  }
  return undefined;
}

/** Change found by taking each digit from 10 (the last from 10, the others from 9 is right). */
export function changeSlip(from: number, cost: number): number | undefined {
  const digits = String(cost)
    .padStart(String(from).length - 1, "0")
    .split("")
    .map(Number);
  if (digits[digits.length - 1] === 0) return undefined;
  const slip = Number(digits.map((d) => 10 - d).join(""));
  return slip === from - cost ? undefined : slip;
}

/** Column subtraction taking the smaller digit from the larger in each column. */
export function smallerFromLarger(a: number, b: number): number {
  const as = String(a);
  const bs = String(b).padStart(as.length, "0");
  return Number(
    as
      .split("")
      .map((d, i) => Math.abs(Number(d) - Number(bs[i])))
      .join(""),
  );
}

/** Column addition that forgets to carry. */
export function noCarry(a: number, b: number): number {
  const width = Math.max(String(a).length, String(b).length);
  const as = String(a).padStart(width, "0");
  const bs = String(b).padStart(width, "0");
  return Number(
    as
      .split("")
      .map((d, i) => (Number(d) + Number(bs[i])) % 10)
      .join(""),
  );
}

// --- scales ----------------------------------------------------------------------------------

export interface Scale {
  max: number;
  step: number;
  divisions: number;
  reading: number;
}

/**
 * A scale to read: numbered marks every `step` with `divisions` spaces between, and a reading on a
 * mark. Friendly scales count in 1s or 2s on small numbers; stretch scales count in 25s, 50s or 20s.
 */
export function pickScale(rng: Rng, numbers: Numbers, onNumbered = false): Scale {
  const options: [number, number, number][] =
    numbers === "friendly"
      ? [
          [10, 2, 1],
          [10, 10, 5],
          [20, 10, 5],
          [10, 5, 5],
        ]
      : numbers === "standard"
        ? [
            [100, 10, 2],
            [100, 20, 2],
            [100, 10, 5],
            [50, 10, 5],
            [500, 100, 5],
          ]
        : [
            [1000, 200, 4],
            [1000, 100, 4],
            [500, 100, 4],
            [1000, 250, 5],
            [200, 50, 5],
          ];
  const [max, step, divisions] = rng.pick(options);
  const interval = step / divisions;
  const count = max / interval;
  let reading = rng.int(1, count - 1) * interval;
  if (onNumbered) reading = rng.int(1, max / step - 1) * step;
  return { max, step, divisions, reading };
}

/** The reading a student gets by counting each unnumbered mark as 1. */
export function countMarksReading(s: Scale): number {
  const interval = s.step / s.divisions;
  const below = Math.floor(s.reading / s.step + 1e-9) * s.step;
  return below + Math.round((s.reading - below) / interval);
}

export const scaleSpec = (
  instrument: ScaleSpec["instrument"],
  s: Scale,
  unit: string,
  min = 0,
): ScaleSpec => ({
  type: "measure",
  instrument,
  ...(min === 0 ? {} : { min }),
  max: s.max,
  step: s.step,
  divisions: s.divisions,
  reading: s.reading,
  unit,
});

export const ruler = (length: number, from: number, to: number, mm = true): RulerSpec => ({
  type: "measure",
  instrument: "ruler",
  length,
  object: { from, to },
  ...(mm ? {} : { mm: false }),
});

/** Ribbons of different lengths, for comparing. */
export const ribbons = (lengths: number[], names: string[]): BarModelSpec => ({
  type: "bar-model",
  bars: lengths.map((size, i) => ({ label: `\\text{${names[i] ?? ""}}`, parts: [{ size }] })),
  description: `${lengths.length} ribbons, labelled ${names.join(", ")}, of different lengths.`,
});

// --- shapes ----------------------------------------------------------------------------------

/** An L-shape: a W by H rectangle with an a by b piece cut from its top right corner. */
export const lVertices = (W: number, H: number, a: number, b: number): Coord[] => [
  [0, 0],
  [W, 0],
  [W, H - b],
  [W - a, H - b],
  [W - a, H],
  [0, H],
];

/** Shapes drawn shaded on a squared grid, one square per unit, side by side. */
export function onGrid(shapes: Coord[][], description: string): CartesianSpec {
  let x = 1;
  const polygons = shapes.map((v) => {
    const moved = v.map(([px, py]) => [px + x, py + 1] as Coord);
    x += Math.max(...v.map((p) => p[0])) + 2;
    return { vertices: moved, shaded: true };
  });
  const top = Math.max(...shapes.flatMap((v) => v.map((p) => p[1]))) + 2;
  return {
    type: "cartesian",
    x: { min: 0, max: x - 1, step: 1 },
    y: { min: 0, max: top, step: 1 },
    grid: true,
    axes: false,
    polygons,
    description,
  };
}

/** The area of a polygon (shoelace), for checking. */
export function polygonArea(v: readonly Coord[]): number {
  let s = 0;
  v.forEach((p, i) => {
    const q = v[(i + 1) % v.length] as Coord;
    s += p[0] * q[1] - q[0] * p[1];
  });
  return Math.abs(s) / 2;
}

/** The perimeter of a polygon. */
export function polygonPerimeter(v: readonly Coord[]): number {
  return v.reduce((s, p, i) => {
    const q = v[(i + 1) % v.length] as Coord;
    return s + Math.hypot(q[0] - p[0], q[1] - p[1]);
  }, 0);
}

const cm = (n: number, unit: string) => `${n}\\text{ ${unit}}`;

/** A rectangle with its length and width labelled. */
export function rectangle(l: number, w: number, unit = "cm", description?: string): GeometrySpec {
  return {
    type: "geometry",
    points: { A: [0, 0], B: [l, 0], C: [l, w], D: [0, w] },
    polygons: [{ vertices: ["A", "B", "C", "D"] }],
    segments: [
      { from: "A", to: "B", label: cm(l, unit), length: l },
      { from: "B", to: "C", label: cm(w, unit), length: w },
    ],
    angles: ["A", "B", "C", "D"].map((v, i, all) => ({
      vertex: v,
      from: all[(i + 1) % 4] ?? "",
      to: all[(i + 3) % 4] ?? "",
      right: true,
    })),
    description: description ?? `A rectangle ${l} ${unit} long and ${w} ${unit} wide.`,
  };
}

/**
 * An L-shape with the sides in `show` labelled (indices into the six sides, starting with the
 * bottom and going anticlockwise).
 */
export function lShape(
  W: number,
  H: number,
  a: number,
  b: number,
  show: number[],
  unit = "cm",
  description = "An L-shaped rectilinear shape with some side lengths labelled.",
): GeometrySpec {
  const names = ["A", "B", "C", "D", "E", "F"];
  const v = lVertices(W, H, a, b);
  const points = Object.fromEntries(names.map((n, i) => [n, v[i] as Coord]));
  const segments: GeoSegment[] = show.map((i) => {
    const p = v[i] as Coord;
    const q = v[(i + 1) % 6] as Coord;
    const len = Math.hypot(q[0] - p[0], q[1] - p[1]);
    return {
      from: names[i] ?? "",
      to: names[(i + 1) % 6] ?? "",
      label: cm(len, unit),
      length: len,
    };
  });
  return { type: "geometry", points, polygons: [{ vertices: names }], segments, description };
}

/** The six side lengths of an L-shape, bottom first, anticlockwise. */
export const lSides = (W: number, H: number, a: number, b: number) => [W, H - b, a, b, W - a, H];

/**
 * A cuboid drawn in oblique projection, with length, depth and height labelled. Hidden edges are
 * dashed; the depth is drawn at half scale as in textbooks, so lengths are labels only.
 */
export function cuboid(l: number, w: number, h: number, unit = "cm", cubes = false): GeometrySpec {
  const s = 1;
  const k = cubes ? 0.75 : 0.5;
  const dx = k * w * Math.cos(Math.PI / 5);
  const dy = k * w * Math.sin(Math.PI / 5);
  const P: Record<string, Coord> = {
    A: [0, 0],
    B: [l * s, 0],
    C: [l * s, h * s],
    D: [0, h * s],
    E: [dx, dy],
    F: [l * s + dx, dy],
    G: [l * s + dx, h * s + dy],
    H: [dx, h * s + dy],
  };
  const segments: GeoSegment[] = [
    { from: "A", to: "B", label: cm(l, unit) },
    { from: "B", to: "C" },
    { from: "C", to: "D" },
    { from: "D", to: "A", label: cm(h, unit) },
    { from: "B", to: "F", label: cm(w, unit) },
    { from: "F", to: "G" },
    { from: "G", to: "H" },
    { from: "C", to: "G" },
    { from: "D", to: "H" },
    { from: "A", to: "E", dashed: true },
    { from: "E", to: "F", dashed: true },
    { from: "E", to: "H", dashed: true },
  ];
  if (cubes) {
    // Grid lines on the three visible faces show the centimetre cubes.
    for (let i = 1; i < l; i++) {
      P[`f${i}`] = [i, 0];
      P[`g${i}`] = [i, h];
      P[`t${i}`] = [i + dx, h + dy];
      segments.push({ from: `f${i}`, to: `g${i}` }, { from: `g${i}`, to: `t${i}` });
    }
    for (let j = 1; j < h; j++) {
      P[`l${j}`] = [0, j];
      P[`r${j}`] = [l, j];
      P[`b${j}`] = [l + dx, j + dy];
      segments.push({ from: `l${j}`, to: `r${j}` }, { from: `r${j}`, to: `b${j}` });
    }
    for (let k = 1; k < w; k++) {
      const ox = (dx * k) / w;
      const oy = (dy * k) / w;
      P[`u${k}`] = [ox, h + oy];
      P[`v${k}`] = [l + ox, h + oy];
      P[`s${k}`] = [l + ox, oy];
      segments.push({ from: `u${k}`, to: `v${k}` }, { from: `v${k}`, to: `s${k}` });
    }
  }
  return {
    type: "geometry",
    points: P,
    segments: cubes
      ? segments.map((g) => ({ from: g.from, to: g.to, ...(g.dashed ? { dashed: true } : {}) }))
      : segments,
    description: cubes
      ? `A cuboid built from centimetre cubes, ${l} cubes long, ${w} cubes deep and ${h} cube${h === 1 ? "" : "s"} high.`
      : `A cuboid ${l} ${unit} long, ${w} ${unit} deep and ${h} ${unit} high.`,
  };
}

/** Pythagorean offsets that give a whole-number slant side for a whole-number height. */
export const SLANTS: [number, number, number][] = [
  [3, 4, 5],
  [4, 3, 5],
  [6, 8, 10],
  [8, 6, 10],
  [5, 12, 13],
  [9, 12, 15],
  [12, 9, 15],
];

/** A triangle with base and perpendicular height marked; the slant side labelled if asked. */
export function triangle(
  base: number,
  height: number,
  offset: number,
  slant?: number,
  unit = "cm",
): GeometrySpec {
  return {
    type: "geometry",
    points: { A: [0, 0], B: [base, 0], C: [offset, height], F: [offset, 0] },
    polygons: [{ vertices: ["A", "B", "C"] }],
    segments: [
      { from: "A", to: "B", label: cm(base, unit), length: base },
      { from: "F", to: "C", label: cm(height, unit), length: height, dashed: true },
      ...(slant ? [{ from: "C", to: "A", label: cm(slant, unit), length: slant }] : []),
    ],
    angles: [{ vertex: "F", from: "B", to: "C", right: true }],
    description: `A triangle with base ${base} ${unit} and perpendicular height ${height} ${unit}${slant ? `; one sloping side is ${slant} ${unit}` : ""}.`,
  };
}

/** A parallelogram with base, perpendicular height and slant side labelled. */
export function parallelogram(
  base: number,
  height: number,
  offset: number,
  slant: number,
  unit = "cm",
): GeometrySpec {
  return {
    type: "geometry",
    points: {
      A: [0, 0],
      B: [base, 0],
      C: [base + offset, height],
      D: [offset, height],
      F: [offset, 0],
    },
    polygons: [{ vertices: ["A", "B", "C", "D"] }],
    segments: [
      { from: "A", to: "B", label: cm(base, unit), length: base },
      { from: "F", to: "D", label: cm(height, unit), length: height, dashed: true },
      { from: "B", to: "C", label: cm(slant, unit), length: slant },
    ],
    angles: [{ vertex: "F", from: "B", to: "D", right: true }],
    description: `A parallelogram with base ${base} ${unit}, perpendicular height ${height} ${unit} and sloping sides ${slant} ${unit}.`,
  };
}
