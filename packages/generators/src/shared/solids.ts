// 3D shapes: their properties, sketches in oblique projection (hidden edges dashed), and nets on
// squared paper. Sketches use the geometry diagram type; nets use the cartesian grid.
import type {
  CartesianPolygon,
  CartesianSpec,
  Coord,
  GeometrySpec,
  GeoSegment,
} from "@mathsplanner/diagrams";

export type Solid =
  | "cube"
  | "cuboid"
  | "triangular prism"
  | "square-based pyramid"
  | "triangular pyramid"
  | "hexagonal prism"
  | "cylinder"
  | "cone"
  | "sphere";

export interface SolidFacts {
  faces: number;
  edges: number;
  vertices: number;
  /** The flat faces, in words. */
  faceShapes: string;
  curved: boolean;
}

export const FACTS: Record<Solid, SolidFacts> = {
  cube: { faces: 6, edges: 12, vertices: 8, faceShapes: "6 squares", curved: false },
  cuboid: { faces: 6, edges: 12, vertices: 8, faceShapes: "6 rectangles", curved: false },
  "triangular prism": {
    faces: 5,
    edges: 9,
    vertices: 6,
    faceShapes: "2 triangles and 3 rectangles",
    curved: false,
  },
  "square-based pyramid": {
    faces: 5,
    edges: 8,
    vertices: 5,
    faceShapes: "1 square and 4 triangles",
    curved: false,
  },
  "triangular pyramid": {
    faces: 4,
    edges: 6,
    vertices: 4,
    faceShapes: "4 triangles",
    curved: false,
  },
  "hexagonal prism": {
    faces: 8,
    edges: 18,
    vertices: 12,
    faceShapes: "2 hexagons and 6 rectangles",
    curved: false,
  },
  cylinder: { faces: 3, edges: 2, vertices: 0, faceShapes: "2 circles", curved: true },
  cone: { faces: 2, edges: 1, vertices: 1, faceShapes: "1 circle", curved: true },
  sphere: { faces: 1, edges: 0, vertices: 0, faceShapes: "none", curved: true },
};

export const POLYHEDRA: Solid[] = [
  "cube",
  "cuboid",
  "triangular prism",
  "square-based pyramid",
  "triangular pyramid",
  "hexagonal prism",
];
export const SOLIDS: Solid[] = [...POLYHEDRA, "cylinder", "cone", "sphere"];
/** The 2D shape a student might name instead of the solid. */
export const FLAT_NAME: Partial<Record<Solid, string>> = {
  cube: "square",
  cuboid: "rectangle",
  "square-based pyramid": "triangle",
  "triangular pyramid": "triangle",
  cylinder: "circle",
  cone: "triangle",
  sphere: "circle",
};

// Oblique projection: depth goes up and to the right at half scale.
const KX = 0.5 * Math.cos((35 * Math.PI) / 180);
const KY = 0.5 * Math.sin((35 * Math.PI) / 180);
const project = ([x, y, z]: [number, number, number]): Coord => [x + z * KX, y + z * KY];

/** Whether p is strictly inside a convex polygon. */
function inside(p: Coord, poly: Coord[]): boolean {
  let sign = 0;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i] as Coord;
    const b = poly[(i + 1) % poly.length] as Coord;
    const cross = (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]);
    if (Math.abs(cross) < 1e-9) return false;
    if (sign === 0) sign = Math.sign(cross);
    else if (Math.sign(cross) !== sign) return false;
  }
  return true;
}

/**
 * A prism with a convex cross-section `front` (x, y) and depth d. An edge is hidden when its
 * midpoint lies behind the front face.
 */
export function prism(
  front: Coord[],
  d: number,
  labels: { front?: [number, string][]; depth?: string } = {},
): GeometrySpec {
  const n = front.length;
  const back = front.map(([x, y]) => project([x, y, d]));
  const points: Record<string, Coord> = {};
  front.forEach((p, i) => (points[`F${i}`] = p));
  back.forEach((p, i) => (points[`B${i}`] = p));
  const segments: GeoSegment[] = [];
  const add = (a: string, b: string, label?: string) => {
    const pa = points[a] as Coord;
    const pb = points[b] as Coord;
    const mid: Coord = [(pa[0] + pb[0]) / 2, (pa[1] + pb[1]) / 2];
    const hidden = a.startsWith("B") || b.startsWith("B") ? inside(mid, front) : false;
    segments.push({
      from: a,
      to: b,
      ...(hidden ? { dashed: true } : {}),
      ...(label ? { label } : {}),
    });
  };
  const frontLabels = new Map(labels.front ?? []);
  for (let i = 0; i < n; i++) add(`F${i}`, `F${(i + 1) % n}`, frontLabels.get(i));
  for (let i = 0; i < n; i++) add(`B${i}`, `B${(i + 1) % n}`);
  // The depth label goes on the visible depth edge furthest to the right.
  const right = front.reduce(
    (best, p, i) =>
      p[0] > (front[best] as Coord)[0] ||
      (p[0] === (front[best] as Coord)[0] && p[1] < (front[best] as Coord)[1])
        ? i
        : best,
    0,
  );
  for (let i = 0; i < n; i++) add(`F${i}`, `B${i}`, i === right ? labels.depth : undefined);
  return { type: "geometry", points, segments, description: "A 3D shape." };
}

/** An ellipse of points around (cx, cy) in the horizontal plane; the back half dashed. */
function ellipse(
  points: Record<string, Coord>,
  segments: GeoSegment[],
  name: string,
  cx: number,
  cy: number,
  r: number,
  allSolid = false,
) {
  const n = 24;
  for (let i = 0; i < n; i++) {
    const t = (2 * Math.PI * i) / n;
    points[`${name}${i}`] = [cx + r * Math.cos(t), cy + 0.35 * r * Math.sin(t)];
  }
  for (let i = 0; i < n; i++) {
    const back = i < n / 2; // sin(t) > 0: the far side
    segments.push({
      from: `${name}${i}`,
      to: `${name}${(i + 1) % n}`,
      ...(back && !allSolid ? { dashed: true } : {}),
    });
  }
}

/** A sketch of a solid. Sizes are illustrative; prisms and cuboids can be labelled separately. */
export function sketch(solid: Solid): GeometrySpec {
  const points: Record<string, Coord> = {};
  const segments: GeoSegment[] = [];
  switch (solid) {
    case "cube":
      return prism(
        [
          [0, 0],
          [3, 0],
          [3, 3],
          [0, 3],
        ],
        3,
      );
    case "cuboid":
      return prism(
        [
          [0, 0],
          [5, 0],
          [5, 2.5],
          [0, 2.5],
        ],
        3,
      );
    case "triangular prism":
      return prism(
        [
          [0, 0],
          [3, 0],
          [1.5, 2.6],
        ],
        5,
      );
    case "hexagonal prism":
      return prism(
        Array.from(
          { length: 6 },
          (_, i) =>
            [
              1.6 + 1.6 * Math.cos((Math.PI * i) / 3),
              1.4 + 1.6 * Math.sin((Math.PI * i) / 3),
            ] as Coord,
        ),
        4,
      );
    case "square-based pyramid": {
      const s = 4;
      const base: [number, number, number][] = [
        [0, 0, 0],
        [s, 0, 0],
        [s, 0, s],
        [0, 0, s],
      ];
      base.forEach((v, i) => (points[`P${i}`] = project(v)));
      points.T = project([s / 2, 4, s / 2]);
      const hidden = new Set(["P2-P3", "P3-P0", "T-P3"]);
      for (const [a, b] of [
        ["P0", "P1"],
        ["P1", "P2"],
        ["P2", "P3"],
        ["P3", "P0"],
        ["T", "P0"],
        ["T", "P1"],
        ["T", "P2"],
        ["T", "P3"],
      ] as [string, string][])
        segments.push({ from: a, to: b, ...(hidden.has(`${a}-${b}`) ? { dashed: true } : {}) });
      return { type: "geometry", points, segments, description: "A 3D shape." };
    }
    case "triangular pyramid": {
      const s = 4;
      const base: [number, number, number][] = [
        [0, 0, 0],
        [s, 0, 0],
        [s / 2, 0, s * 0.87],
      ];
      base.forEach((v, i) => (points[`P${i}`] = project(v)));
      points.T = project([s / 2, 3.6, s * 0.29]);
      const hidden = new Set(["P2-P0", "T-P2"]);
      for (const [a, b] of [
        ["P0", "P1"],
        ["P1", "P2"],
        ["P2", "P0"],
        ["T", "P0"],
        ["T", "P1"],
        ["T", "P2"],
      ] as [string, string][])
        segments.push({ from: a, to: b, ...(hidden.has(`${a}-${b}`) ? { dashed: true } : {}) });
      return { type: "geometry", points, segments, description: "A 3D shape." };
    }
    case "cylinder": {
      const r = 2;
      const h = 4;
      ellipse(points, segments, "b", 0, 0, r);
      ellipse(points, segments, "t", 0, h, r, true);
      points.L0 = [-r, 0];
      points.L1 = [-r, h];
      points.R0 = [r, 0];
      points.R1 = [r, h];
      segments.push({ from: "L0", to: "L1" }, { from: "R0", to: "R1" });
      return { type: "geometry", points, segments, description: "A 3D shape." };
    }
    case "cone": {
      const r = 2;
      ellipse(points, segments, "b", 0, 0, r);
      points.T = [0, 4.5];
      points.L0 = [-r, 0];
      points.R0 = [r, 0];
      segments.push({ from: "L0", to: "T" }, { from: "R0", to: "T" });
      return { type: "geometry", points, segments, description: "A 3D shape." };
    }
    default: {
      const r = 2.4;
      ellipse(points, segments, "e", 0, 0, r);
      points.O = [0, 0];
      return {
        type: "geometry",
        points,
        segments,
        circles: [{ centre: "O", radius: r }],
        description: "A 3D shape.",
      };
    }
  }
}

// --- nets -------------------------------------------------------------------------------------

/** A net made of unit squares (and optional triangles), drawn on squared paper. */
export function netGrid(
  squares: Coord[],
  triangles: Coord[][] = [],
  description = "A net drawn on squared paper.",
): CartesianSpec {
  const all = [...squares, ...triangles.flat()];
  const maxX = Math.max(...squares.map((s) => s[0] + 1), ...all.map((p) => p[0])) + 1;
  const maxY = Math.max(...squares.map((s) => s[1] + 1), ...all.map((p) => p[1])) + 1;
  const minX = Math.min(...all.map((p) => p[0])) - 1;
  const minY = Math.min(...all.map((p) => p[1])) - 1;
  const polygons: CartesianPolygon[] = [
    ...squares.map(([x, y]) => ({
      vertices: [
        [x, y],
        [x + 1, y],
        [x + 1, y + 1],
        [x, y + 1],
      ] as Coord[],
      shaded: true,
    })),
    ...triangles.map((t) => ({ vertices: t, shaded: true })),
  ];
  return {
    type: "cartesian",
    x: { min: Math.floor(minX), max: Math.ceil(maxX), step: 1 },
    y: { min: Math.floor(minY), max: Math.ceil(maxY), step: 1 },
    grid: true,
    axes: false,
    polygons,
    description,
  };
}

const row = (cells: string): Coord[] => {
  // "x,y x,y …" in grid units.
  return cells.split(" ").map((c) => c.split(",").map(Number) as Coord);
};

/** All eleven nets of a cube. */
export const CUBE_NETS: Coord[][] = [
  "0,1 1,1 2,1 3,1 0,0 0,2",
  "0,1 1,1 2,1 3,1 0,0 1,2",
  "0,1 1,1 2,1 3,1 0,0 2,2",
  "0,1 1,1 2,1 3,1 0,0 3,2",
  "0,1 1,1 2,1 3,1 1,0 1,2",
  "0,1 1,1 2,1 3,1 1,0 2,2",
  "0,0 1,0 1,1 2,1 3,1 2,2",
  "0,0 1,0 1,1 2,1 2,2 3,2",
  "0,0 1,0 2,0 2,1 3,1 4,1",
  "0,0 1,0 1,1 2,1 3,1 3,2",
  "0,0 1,0 1,1 2,1 3,1 1,2",
].map(row);

/** Six squares joined edge to edge that do not fold into a cube (each checked by rolling a cube). */
export const NOT_CUBE_NETS: Coord[][] = [
  "0,0 1,0 2,0 0,1 1,1 2,1",
  "0,1 1,1 2,1 3,1 4,1 0,0",
  "0,0 1,0 0,1 1,1 2,1 3,1",
  "0,1 1,1 2,1 3,1 0,2 1,2",
  "0,1 1,1 2,1 3,1 0,2 2,2",
  "1,0 0,1 1,1 2,1 1,2 2,2",
].map(row);

/** A square-based pyramid net: a square with a triangle on each side. */
export const PYRAMID_NET = {
  squares: row("1,1"),
  triangles: [
    [
      [1, 1],
      [2, 1],
      [1.5, 0],
    ],
    [
      [2, 1],
      [2, 2],
      [3, 1.5],
    ],
    [
      [2, 2],
      [1, 2],
      [1.5, 3],
    ],
    [
      [1, 2],
      [1, 1],
      [0, 1.5],
    ],
  ] as Coord[][],
};
/** The same square with only three triangles: it cannot close up. */
export const PYRAMID_NET_SHORT = {
  squares: row("1,1"),
  triangles: PYRAMID_NET.triangles.slice(0, 3),
};
/** A triangular prism net: three squares in a row with a triangle on each end of the middle one. */
export const PRISM_NET = {
  squares: row("0,1 1,1 2,1"),
  triangles: [
    [
      [1, 2],
      [2, 2],
      [1.5, 2.87],
    ],
    [
      [1, 1],
      [2, 1],
      [1.5, 0.13],
    ],
  ] as Coord[][],
};
/** A triangular pyramid net: four equilateral triangles. */
export const TETRA_NET = {
  squares: [] as Coord[],
  triangles: [
    [
      [1, 0],
      [3, 0],
      [2, 1.73],
    ],
    [
      [0, 1.73],
      [1, 0],
      [2, 1.73],
    ],
    [
      [2, 1.73],
      [3, 0],
      [4, 1.73],
    ],
    [
      [1, 0],
      [3, 0],
      [2, -1.73],
    ],
  ] as Coord[][],
};

/** A cylinder drawn to scale with its height labelled and a radius drawn (give its length in words). */
export function cylinder(r: number, h: number, unit = "cm"): GeometrySpec {
  const points: Record<string, Coord> = {};
  const segments: GeoSegment[] = [];
  ellipse(points, segments, "b", 0, 0, r);
  ellipse(points, segments, "t", 0, h, r, true);
  points.L0 = [-r, 0];
  points.L1 = [-r, h];
  points.R0 = [r, 0];
  points.R1 = [r, h];
  points.C = [0, h];
  segments.push(
    { from: "L0", to: "L1" },
    { from: "R1", to: "R0", label: `${h}\text{ ${unit}}` },
    { from: "C", to: "R1", dashed: true },
  );
  return {
    type: "geometry",
    points,
    segments,
    dots: ["C"],
    description: `A cylinder with radius ${r} ${unit} and height ${h} ${unit}.`,
  };
}
