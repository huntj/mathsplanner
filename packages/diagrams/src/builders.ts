// Builders turn the numbers a generator knows (angles, sides) into to-scale specs, so
// generators never compute coordinates by hand.
import type { Coord, GeoAngle, GeometrySpec, Label } from "./spec.ts";

const rad = (deg: number) => (deg * Math.PI) / 180;
const round = (v: number) => Math.round(v * 1e9) / 1e9;

/** The point `length` from `origin` in direction `degrees` (anticlockwise from east). */
export function pointAt(origin: Coord, degrees: number, length: number): Coord {
  return [
    round(origin[0] + length * Math.cos(rad(degrees))),
    round(origin[1] + length * Math.sin(rad(degrees))),
  ];
}

export interface AngleSpec {
  /** Size in degrees. */
  value: number;
  /** Defaults to the size, e.g. 52°. Use a letter for an unknown. */
  label?: Label;
}

const POINT_NAMES = "ABCDEFGHIJKLMNPQRSTUVWXYZ";

function fan(angles: AngleSpec[], start: number, closeTo?: string): GeometrySpec {
  const points: Record<string, Coord> = { O: [0, 0] };
  const names: string[] = [];
  let heading = start;
  const rayNames: string[] = [];
  const first = POINT_NAMES[0] ?? "A";
  points[first] = pointAt([0, 0], heading, 1);
  rayNames.push(first);
  angles.forEach((_, i) => {
    heading += angles[i]?.value ?? 0;
    const name = i === angles.length - 1 && closeTo ? closeTo : (POINT_NAMES[i + 1] ?? `P${i + 1}`);
    if (!(closeTo && name === closeTo && points[name])) points[name] = pointAt([0, 0], heading, 1);
    rayNames.push(name);
  });
  names.push(...new Set(rayNames));
  const geoAngles: GeoAngle[] = angles.map((a, i) => ({
    vertex: "O",
    from: rayNames[i] ?? "",
    to: rayNames[i + 1] ?? "",
    value: a.value,
    ...(a.label === undefined ? {} : { label: a.label }),
    ...(a.value === 90 && a.label === undefined ? { right: true } : {}),
  }));
  return {
    type: "geometry",
    points,
    segments: names.map((n) => ({ from: "O", to: n })),
    angles: geoAngles,
  };
}

/** Angles on a straight line: the angles must add up to 180°. */
export function anglesOnLine(angles: AngleSpec[]): GeometrySpec {
  const total = angles.reduce((sum, a) => sum + a.value, 0);
  if (Math.abs(total - 180) > 1e-9)
    throw new RangeError(`angles on a line add up to ${total}°, not 180°`);
  const spec = fan(angles, 0);
  const last = Object.keys(spec.points).at(-1) ?? "";
  // Replace the two outer rays with one straight line through O.
  return {
    ...spec,
    segments: [
      { from: "A", to: last, extend: false },
      ...(spec.segments ?? []).filter((s) => s.to !== "A" && s.to !== last),
    ],
  };
}

/** Angles at a point: the angles must add up to 360°. */
export function anglesAtPoint(angles: AngleSpec[], start = 20): GeometrySpec {
  const total = angles.reduce((sum, a) => sum + a.value, 0);
  if (Math.abs(total - 360) > 1e-9)
    throw new RangeError(`angles at a point add up to ${total}°, not 360°`);
  return fan(angles, start, "A");
}

/** A regular polygon with vertices A, B, C… on a circle of the given radius. */
export function regularPolygon(sides: number, radius = 1, start = -90 - 180 / sides): GeometrySpec {
  const points: Record<string, Coord> = {};
  const vertices: string[] = [];
  for (let i = 0; i < sides; i++) {
    const name = POINT_NAMES[i] ?? `P${i}`;
    points[name] = pointAt([0, 0], start + (360 * i) / sides, radius);
    vertices.push(name);
  }
  return { type: "geometry", points, polygons: [{ vertices }] };
}

/**
 * Triangle ABC from two angles and the side between them (ASA): A at the origin, B along the
 * x-axis, C above. Angles in degrees.
 */
export function triangleASA(
  angleA: number,
  ab: number,
  angleB: number,
): Record<"A" | "B" | "C", Coord> {
  const angleC = 180 - angleA - angleB;
  if (!(angleC > 0))
    throw new RangeError(`angles ${angleA}° and ${angleB}° do not leave room for a triangle`);
  const ac = (ab * Math.sin(rad(angleB))) / Math.sin(rad(angleC));
  return { A: [0, 0], B: [ab, 0], C: pointAt([0, 0], angleA, ac) };
}

/** Triangle ABC from three sides (SSS), A at the origin and B along the x-axis. */
export function triangleSSS(ab: number, bc: number, ca: number): Record<"A" | "B" | "C", Coord> {
  if (!(ab + bc > ca && bc + ca > ab && ca + ab > bc)) {
    throw new RangeError(`sides ${ab}, ${bc}, ${ca} break the triangle inequality`);
  }
  const x = (ab * ab + ca * ca - bc * bc) / (2 * ab);
  return { A: [0, 0], B: [ab, 0], C: [round(x), round(Math.sqrt(ca * ca - x * x))] };
}

/**
 * A bearing: a north line at A and a line to B, with the angle measured clockwise from north.
 * The bearing is in degrees from 0 to 360.
 */
export function bearing(
  degrees: number,
  options: { label?: Label; distance?: number } = {},
): GeometrySpec {
  if (!(degrees > 0 && degrees < 360))
    throw new RangeError(`a bearing is between 0° and 360°, not ${degrees}°`);
  const distance = options.distance ?? 3;
  return {
    type: "geometry",
    points: { A: [0, 0], N: [0, 1.6], B: pointAt([0, 0], 90 - degrees, distance) },
    segments: [
      { from: "A", to: "N", arrow: true },
      { from: "A", to: "B" },
    ],
    // Clockwise from north to B is anticlockwise from B to north.
    angles: [
      {
        vertex: "A",
        from: "B",
        to: "N",
        value: degrees,
        turn: "clockwise",
        ...(options.label === undefined ? {} : { label: options.label }),
      },
    ],
    pointLabels: ["A", "B", "N"],
    dots: ["A", "B"],
  };
}

/** A turn: an arrow facing `heading` (degrees anticlockwise from east), turned through `degrees`. */
export function turn(
  degrees: number,
  direction: "clockwise" | "anticlockwise",
  options: { heading?: number; label?: Label } = {},
): GeometrySpec {
  if (!(degrees > 0 && degrees < 360))
    throw new RangeError(`a turn is between 0° and 360°, not ${degrees}°`);
  const heading = options.heading ?? 90;
  const end = direction === "anticlockwise" ? heading + degrees : heading - degrees;
  const start = pointAt([0, 0], heading, 2);
  const finish = pointAt([0, 0], end, 2);
  return {
    type: "geometry",
    points: { O: [0, 0], S: start, F: finish },
    segments: [
      { from: "O", to: "S", arrow: true, dashed: true },
      { from: "O", to: "F", arrow: true },
    ],
    angles: [
      direction === "anticlockwise"
        ? {
            vertex: "O",
            from: "S",
            to: "F",
            value: degrees,
            turn: "anticlockwise",
            ...(options.label === undefined ? {} : { label: options.label }),
          }
        : {
            vertex: "O",
            from: "F",
            to: "S",
            value: degrees,
            turn: "clockwise",
            ...(options.label === undefined ? {} : { label: options.label }),
          },
    ],
    dots: ["O"],
  };
}

export type ShapeKind =
  | "square"
  | "rectangle"
  | "rhombus"
  | "parallelogram"
  | "trapezium"
  | "kite"
  | "equilateral"
  | "isosceles"
  | "scalene"
  | "right-angled";

/** Vertices of each shape, anticlockwise, so interior angles turn from the next vertex to the previous. */
const SHAPES: Record<ShapeKind, Coord[]> = {
  square: [
    [0, 0],
    [2, 0],
    [2, 2],
    [0, 2],
  ],
  rectangle: [
    [0, 0],
    [3.2, 0],
    [3.2, 2],
    [0, 2],
  ],
  rhombus: [
    [0, 0],
    [2, 0],
    [3.2, 1.6],
    [1.2, 1.6],
  ],
  parallelogram: [
    [0, 0],
    [3, 0],
    [3.9, 1.6],
    [0.9, 1.6],
  ],
  trapezium: [
    [0, 0],
    [3.6, 0],
    [2.7, 1.8],
    [0.8, 1.8],
  ],
  kite: [
    [0, 0],
    [1.4, 1.2],
    [0, 3.4],
    [-1.4, 1.2],
  ],
  equilateral: [
    [0, 0],
    [2.6, 0],
    [1.3, 2.252],
  ],
  isosceles: [
    [0, 0],
    [2.4, 0],
    [1.2, 2.8],
  ],
  scalene: [
    [0, 0],
    [3.4, 0],
    [1, 2],
  ],
  "right-angled": [
    [0, 0],
    [3, 0],
    [0, 2.2],
  ],
};

/** Equal-side groups (by side index: side i joins vertex i to vertex i + 1). */
const TICKS: Partial<Record<ShapeKind, number[]>> = {
  square: [1, 1, 1, 1],
  rectangle: [1, 2, 1, 2],
  rhombus: [1, 1, 1, 1],
  parallelogram: [1, 2, 1, 2],
  kite: [1, 2, 2, 1],
  equilateral: [1, 1, 1],
  isosceles: [0, 1, 1],
  scalene: [1, 2, 3],
};

/** Parallel-side groups by side index; 0 means none. */
const ARROWS: Partial<Record<ShapeKind, number[]>> = {
  rhombus: [1, 2, 1, 2],
  parallelogram: [1, 2, 1, 2],
  trapezium: [1, 0, 1, 0],
};

const RIGHT_ANGLES: Partial<Record<ShapeKind, number[]>> = {
  square: [0, 1, 2, 3],
  rectangle: [0, 1, 2, 3],
  "right-angled": [0],
};

export interface ShapeOptions {
  /** Degrees anticlockwise about the centre. */
  rotation?: number;
  /** Multiply every length. */
  scale?: number;
  /** Mark equal sides, parallel sides and right angles. */
  marks?: boolean;
  /** Name the vertices A, B, C… */
  names?: boolean;
}

/** A named quadrilateral or triangle, drawn honestly, optionally with its marks. */
export function shape(kind: ShapeKind, options: ShapeOptions = {}): GeometrySpec {
  const base = SHAPES[kind];
  const k = options.scale ?? 1;
  const cx = base.reduce((s, p) => s + p[0], 0) / base.length;
  const cy = base.reduce((s, p) => s + p[1], 0) / base.length;
  const turnBy = rad(options.rotation ?? 0);
  const names = base.map((_, i) => POINT_NAMES[i] ?? `P${i}`);
  const points: Record<string, Coord> = {};
  base.forEach(([x, y], i) => {
    const dx = (x - cx) * k;
    const dy = (y - cy) * k;
    points[names[i] ?? ""] = [
      round(dx * Math.cos(turnBy) - dy * Math.sin(turnBy)),
      round(dx * Math.sin(turnBy) + dy * Math.cos(turnBy)),
    ];
  });
  const n = names.length;
  const name = (i: number) => names[((i % n) + n) % n] ?? "";
  const spec: GeometrySpec = { type: "geometry", points, polygons: [{ vertices: names }] };
  if (options.marks) {
    const ticks = TICKS[kind];
    const arrows = ARROWS[kind];
    const segments = names.flatMap((_, i) => {
      const t = ticks?.[i] ?? 0;
      const a = arrows?.[i] ?? 0;
      if (!t && !a) return [];
      // Sides in the same parallel group run in the same direction, so the arrows agree.
      const reversed = a > 0 && arrows?.indexOf(a) !== i;
      return [
        {
          from: reversed ? name(i + 1) : name(i),
          to: reversed ? name(i) : name(i + 1),
          ...(t ? { ticks: t } : {}),
          ...(a ? { arrows: a } : {}),
        },
      ];
    });
    if (segments.length) spec.segments = segments;
    const rights = RIGHT_ANGLES[kind];
    if (rights)
      spec.angles = rights.map((i) => ({
        vertex: name(i),
        from: name(i + 1),
        to: name(i - 1),
        right: true,
      }));
  }
  if (options.names) spec.pointLabels = true;
  return spec;
}

/** A single angle of `degrees` between two arms, for estimating, classifying and comparing. */
export function angle(
  degrees: number,
  options: { rotation?: number; arms?: [number, number]; label?: Label } = {},
): GeometrySpec {
  if (!(degrees > 0 && degrees < 360))
    throw new RangeError(`an angle is between 0° and 360°, not ${degrees}°`);
  const start = options.rotation ?? 0;
  const [l1, l2] = options.arms ?? [3, 3];
  return {
    type: "geometry",
    points: { O: [0, 0], A: pointAt([0, 0], start, l1), B: pointAt([0, 0], start + degrees, l2) },
    segments: [
      { from: "O", to: "A" },
      { from: "O", to: "B" },
    ],
    angles: [
      degrees === 90
        ? { vertex: "O", from: "A", to: "B", right: true }
        : { vertex: "O", from: "A", to: "B", value: degrees, label: options.label ?? "" },
    ],
  };
}

/**
 * Quadrilateral ABCD with interior angles a, b, c, d (degrees, adding up to 360), drawn to scale
 * with AB along the bottom. Throws if those angles do not make a convex quadrilateral.
 */
export function quadrilateralFromAngles(
  a: number,
  b: number,
  c: number,
  d: number,
): Record<"A" | "B" | "C" | "D", Coord> {
  if (Math.abs(a + b + c + d - 360) > 1e-9)
    throw new RangeError(`quadrilateral angles add up to ${a + b + c + d}°, not 360°`);
  if (![a, b, c, d].every((v) => v > 0 && v < 180))
    throw new RangeError("each angle must be between 0° and 180°");
  const A: Coord = [0, 0];
  const B: Coord = [4, 0];
  // From D the side DC turns through the angle at D; from B the side BC leaves at 180° − b.
  const u: Coord = [Math.cos(rad(a + 180 + d)), Math.sin(rad(a + 180 + d))];
  const v: Coord = [Math.cos(rad(180 - b)), Math.sin(rad(180 - b))];
  const det = u[0] * -v[1] - u[1] * -v[0];
  if (Math.abs(det) < 1e-9) throw new RangeError("sides DC and BC are parallel");
  // Try a few lengths for AD until C lands where it should, with sides of a sensible length.
  for (const ad of [2.4, 3, 1.8, 3.6, 1.4, 4.4]) {
    const D = pointAt(A, a, ad);
    const s = ((B[0] - D[0]) * -v[1] - (B[1] - D[1]) * -v[0]) / det;
    const t = (u[0] * (B[1] - D[1]) - u[1] * (B[0] - D[0])) / det;
    if (s > 0.8 && t > 0.8 && s < 8 && t < 8) {
      const C: Coord = [round(D[0] + s * u[0]), round(D[1] + s * u[1])];
      return { A, B, C, D };
    }
  }
  throw new RangeError(`angles ${a}°, ${b}°, ${c}°, ${d}° do not make a usable quadrilateral`);
}

/**
 * Two straight lines AB and CD crossing at O, with ∠AOC = `degrees`. A is at direction `rotation`.
 * The four angles are ∠AOC = ∠BOD = degrees and ∠COB = ∠DOA = 180° − degrees.
 */
export function crossingLines(degrees: number, rotation = 15): GeometrySpec {
  if (!(degrees > 0 && degrees < 180))
    throw new RangeError(`lines cross at an angle between 0° and 180°, not ${degrees}°`);
  return {
    type: "geometry",
    points: {
      O: [0, 0],
      A: pointAt([0, 0], rotation, 3),
      B: pointAt([0, 0], rotation + 180, 3),
      C: pointAt([0, 0], rotation + degrees, 3),
      D: pointAt([0, 0], rotation + degrees + 180, 3),
    },
    segments: [
      { from: "B", to: "A" },
      { from: "D", to: "C" },
    ],
  };
}

/**
 * Parallel lines AB (bottom) and CD (top), 3 units apart, cut by a transversal through P on AB and
 * Q on CD at `degrees` to the parallel lines, extended to S below and T above. The angles at P are
 * ∠BPQ = degrees (with ∠QPA, ∠APS, ∠SPB going round); at Q, ∠DQT = degrees likewise.
 */
export function transversal(degrees: number): GeometrySpec {
  if (!(degrees > 0 && degrees < 180))
    throw new RangeError(`a transversal crosses at an angle between 0° and 180°, not ${degrees}°`);
  const P: Coord = [3, 0];
  const Q: Coord = [round(3 + 3 / Math.tan(rad(degrees))), 3];
  // The parallel lines run well past both crossings, so A and C are always to the left of them.
  const left = Math.min(P[0], Q[0]) - 3.5;
  const right = Math.max(P[0], Q[0]) + 3.5;
  return {
    type: "geometry",
    points: {
      A: [left, 0],
      B: [right, 0],
      C: [left, 3],
      D: [right, 3],
      P,
      Q,
      S: pointAt(P, degrees + 180, 1.4),
      T: pointAt(Q, degrees, 1.4),
    },
    segments: [
      { from: "A", to: "B", arrows: 1 },
      { from: "C", to: "D", arrows: 1 },
      { from: "S", to: "T" },
    ],
  };
}
