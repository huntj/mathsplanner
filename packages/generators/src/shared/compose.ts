// Shapes made from smaller shapes, for composing and decomposing in the early years.
import type { Coord, GeometrySpec, GeoSegment } from "@mathsplanner/diagrams";

export interface Composite {
  /** What the whole shape is called. */
  whole: string;
  /** The smaller shapes it is made of, e.g. "triangles". */
  parts: string;
  count: number;
  spec: GeometrySpec;
}

const shape = (
  points: Record<string, Coord>,
  outline: string[],
  inner: [string, string][],
  description: string,
): GeometrySpec => ({
  type: "geometry",
  points,
  polygons: [{ vertices: outline }],
  segments: inner.map(([from, to]): GeoSegment => ({ from, to })),
  description,
});

const hexagon = (): GeometrySpec => {
  const points: Record<string, Coord> = { O: [0, 0] };
  const names = ["A", "B", "C", "D", "E", "F"];
  names.forEach(
    (n, i) => (points[n] = [2 * Math.cos((Math.PI * i) / 3), 2 * Math.sin((Math.PI * i) / 3)]),
  );
  return shape(
    points,
    names,
    names.map((n) => ["O", n] as [string, string]),
    "A hexagon cut into smaller shapes from its centre.",
  );
};

export const COMPOSITES: Composite[] = [
  {
    whole: "square",
    parts: "triangles",
    count: 2,
    spec: shape(
      { A: [0, 0], B: [3, 0], C: [3, 3], D: [0, 3] },
      ["A", "B", "C", "D"],
      [["A", "C"]],
      "A square cut into smaller shapes by one diagonal.",
    ),
  },
  {
    whole: "square",
    parts: "triangles",
    count: 4,
    spec: shape(
      { A: [0, 0], B: [3, 0], C: [3, 3], D: [0, 3] },
      ["A", "B", "C", "D"],
      [
        ["A", "C"],
        ["B", "D"],
      ],
      "A square cut into smaller shapes by both diagonals.",
    ),
  },
  {
    whole: "rectangle",
    parts: "squares",
    count: 2,
    spec: shape(
      { A: [0, 0], B: [6, 0], C: [6, 3], D: [0, 3], M: [3, 0], N: [3, 3] },
      ["A", "B", "C", "D"],
      [["M", "N"]],
      "A rectangle cut into smaller shapes.",
    ),
  },
  {
    whole: "rectangle",
    parts: "squares",
    count: 3,
    spec: shape(
      { A: [0, 0], B: [6, 0], C: [6, 2], D: [0, 2], M: [2, 0], N: [2, 2], P: [4, 0], Q: [4, 2] },
      ["A", "B", "C", "D"],
      [
        ["M", "N"],
        ["P", "Q"],
      ],
      "A rectangle cut into smaller shapes.",
    ),
  },
  {
    whole: "triangle",
    parts: "triangles",
    count: 4,
    spec: shape(
      { A: [0, 0], B: [4, 0], C: [2, 3.46], P: [2, 0], Q: [3, 1.73], R: [1, 1.73] },
      ["A", "B", "C"],
      [
        ["P", "Q"],
        ["Q", "R"],
        ["R", "P"],
      ],
      "A triangle cut into smaller shapes.",
    ),
  },
  { whole: "hexagon", parts: "triangles", count: 6, spec: hexagon() },
];
