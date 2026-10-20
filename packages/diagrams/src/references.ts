// The 50 reference diagrams for the Phase 3 exit check: they must render with no label
// collisions and no truth problems, and a teacher reviews them in the gallery. They lean
// towards angles and geometry, the Phase 4 slice.
import {
  anglesAtPoint,
  anglesOnLine,
  pointAt,
  regularPolygon,
  triangleASA,
  triangleSSS,
} from "./builders.ts";
import type { Coord, GeometrySpec, SupportedDiagramSpec } from "./spec.ts";

export interface ReferenceDiagram {
  id: string;
  title: string;
  spec: SupportedDiagramSpec;
}

const cm = (v: number | string) => `${v}\\text{ cm}`;

/** Two parallel lines y = 0 and y = 3 cut by a transversal through P(p, 0) at `angle`°. */
function transversal(angle: number): Record<string, Coord> {
  const p: Coord = [1, 0];
  const q: Coord = [1 + 3 / Math.tan((angle * Math.PI) / 180), 3];
  return {
    A: [-2, 0],
    B: [8, 0],
    C: [-2, 3],
    D: [8, 3],
    P: p,
    Q: q,
    S: pointAt(p, angle + 180, 1.6),
    T: pointAt(q, angle, 1.6),
  };
}

const parallelLines: GeometrySpec["segments"] = [
  { from: "A", to: "B", arrows: 1 },
  { from: "C", to: "D", arrows: 1 },
  { from: "S", to: "T" },
];

const hexagon = regularPolygon(6, 3);
const hexA = hexagon.points.A as Coord;
const hexB = hexagon.points.B as Coord;
const pentagon = regularPolygon(5, 3);

export const REFERENCE_DIAGRAMS: ReferenceDiagram[] = [
  // --- geometry: triangles ----------------------------------------------------------------
  {
    id: "g-triangle-angles",
    title: "Triangle with two angles and an unknown",
    spec: {
      type: "geometry",
      points: triangleASA(50, 6, 70),
      polygons: [{ vertices: ["A", "B", "C"] }],
      angles: [
        { vertex: "A", from: "B", to: "C", value: 50 },
        { vertex: "B", from: "C", to: "A", value: 70 },
        { vertex: "C", from: "A", to: "B", label: "x" },
      ],
      pointLabels: true,
    },
  },
  {
    id: "g-right-triangle-hypotenuse",
    title: "Right-angled triangle, unknown hypotenuse",
    spec: {
      type: "geometry",
      points: triangleSSS(4, 5, 3),
      polygons: [{ vertices: ["A", "B", "C"] }],
      segments: [
        { from: "A", to: "B", label: cm(4), length: 4 },
        { from: "C", to: "A", label: cm(3), length: 3 },
        { from: "B", to: "C", label: "x" },
      ],
      angles: [{ vertex: "A", from: "B", to: "C", right: true }],
      pointLabels: true,
    },
  },
  {
    id: "g-isosceles",
    title: "Isosceles triangle with equal sides and angles marked",
    spec: {
      type: "geometry",
      points: { A: [0, 0], B: [6, 0], C: [3, 5] },
      polygons: [{ vertices: ["A", "B", "C"] }],
      segments: [
        { from: "A", to: "C", ticks: 1 },
        { from: "B", to: "C", ticks: 1 },
      ],
      angles: [
        { vertex: "A", from: "B", to: "C" },
        { vertex: "B", from: "C", to: "A" },
        { vertex: "C", from: "A", to: "B", label: "y" },
      ],
      pointLabels: true,
    },
  },
  {
    id: "g-equilateral",
    title: "Equilateral triangle",
    spec: {
      ...regularPolygon(3, 3),
      segments: [
        { from: "A", to: "B", ticks: 1 },
        { from: "B", to: "C", ticks: 1 },
        { from: "C", to: "A", ticks: 1 },
      ],
      angles: [
        { vertex: "A", from: "B", to: "C", value: 60 },
        { vertex: "B", from: "C", to: "A", value: 60 },
        { vertex: "C", from: "A", to: "B", value: 60 },
      ],
    },
  },
  {
    id: "g-small-angle",
    title: "Triangle with a small angle",
    spec: {
      type: "geometry",
      points: triangleASA(12, 8, 40),
      polygons: [{ vertices: ["A", "B", "C"] }],
      angles: [
        { vertex: "A", from: "B", to: "C", value: 12 },
        { vertex: "B", from: "C", to: "A", value: 40 },
        { vertex: "C", from: "A", to: "B", label: "x" },
      ],
      pointLabels: true,
    },
  },
  {
    id: "g-exterior-angle",
    title: "Exterior angle of a triangle",
    spec: {
      type: "geometry",
      points: { ...triangleASA(50, 6, 60), D: [8.5, 0] },
      polygons: [{ vertices: ["A", "B", "C"] }],
      segments: [{ from: "B", to: "D" }],
      angles: [
        { vertex: "A", from: "B", to: "C", value: 50 },
        { vertex: "B", from: "C", to: "A", value: 60 },
        { vertex: "B", from: "D", to: "C", label: "x" },
      ],
      pointLabels: ["A", "B", "C", "D"],
    },
  },
  {
    id: "g-trig-theta",
    title: "Right-angled triangle for trigonometry",
    spec: {
      type: "geometry",
      points: { A: [0, 0], B: [8, 0], C: [8, 5] },
      polygons: [{ vertices: ["A", "B", "C"] }],
      segments: [
        { from: "A", to: "B", label: cm(8), length: 8 },
        { from: "B", to: "C", label: cm(5), length: 5 },
      ],
      angles: [
        { vertex: "B", from: "C", to: "A", right: true },
        { vertex: "A", from: "B", to: "C", label: "\\theta" },
      ],
    },
  },
  {
    id: "g-not-to-scale",
    title: "Triangle not drawn to scale",
    spec: {
      type: "geometry",
      points: { A: [0, 0], B: [7, 0], C: [2, 4] },
      polygons: [{ vertices: ["A", "B", "C"] }],
      angles: [
        { vertex: "A", from: "B", to: "C", value: 35 },
        { vertex: "B", from: "C", to: "A", value: 75 },
        { vertex: "C", from: "A", to: "B", label: "x" },
      ],
      pointLabels: true,
      notToScale: true,
    },
  },
  // --- geometry: quadrilaterals and polygons -----------------------------------------------
  {
    id: "g-rectangle",
    title: "Rectangle with side lengths",
    spec: {
      type: "geometry",
      points: { A: [0, 0], B: [7, 0], C: [7, 4], D: [0, 4] },
      polygons: [{ vertices: ["A", "B", "C", "D"] }],
      segments: [
        { from: "A", to: "B", label: cm(7), length: 7 },
        { from: "B", to: "C", label: cm(4), length: 4 },
      ],
      angles: [
        { vertex: "A", from: "B", to: "D", right: true },
        { vertex: "B", from: "C", to: "A", right: true },
        { vertex: "C", from: "D", to: "B", right: true },
        { vertex: "D", from: "A", to: "C", right: true },
      ],
    },
  },
  {
    id: "g-parallelogram",
    title: "Parallelogram with parallel sides and angles",
    spec: {
      type: "geometry",
      points: { A: [0, 0], B: [6, 0], C: [9, 3], D: [3, 3] },
      polygons: [{ vertices: ["A", "B", "C", "D"] }],
      segments: [
        { from: "A", to: "B", arrows: 1 },
        { from: "D", to: "C", arrows: 1 },
        { from: "A", to: "D", arrows: 2 },
        { from: "B", to: "C", arrows: 2 },
      ],
      angles: [
        { vertex: "A", from: "B", to: "D", value: 45 },
        { vertex: "B", from: "C", to: "A", label: "x" },
      ],
      pointLabels: true,
    },
  },
  {
    id: "g-trapezium",
    title: "Trapezium with its height",
    spec: {
      type: "geometry",
      points: { A: [0, 0], B: [8, 0], C: [6, 3], D: [2, 3], E: [2, 0] },
      polygons: [{ vertices: ["A", "B", "C", "D"] }],
      segments: [
        { from: "A", to: "B", label: cm(8), length: 8, arrows: 1 },
        { from: "D", to: "C", label: cm(4), length: 4, arrows: 1 },
        { from: "E", to: "D", label: cm(3), length: 3, dashed: true },
      ],
      angles: [{ vertex: "E", from: "B", to: "D", right: true }],
    },
  },
  {
    id: "g-kite",
    title: "Kite with equal sides marked",
    spec: {
      type: "geometry",
      points: { A: [0, 0], B: [3, 3], C: [0, 5], D: [-3, 3] },
      polygons: [{ vertices: ["A", "B", "C", "D"] }],
      segments: [
        { from: "A", to: "B", ticks: 1 },
        { from: "A", to: "D", ticks: 1 },
        { from: "B", to: "C", ticks: 2 },
        { from: "D", to: "C", ticks: 2 },
      ],
      pointLabels: true,
    },
  },
  {
    id: "g-pentagon-interior",
    title: "Regular pentagon, interior angle",
    spec: {
      ...pentagon,
      angles: [{ vertex: "B", from: "C", to: "A", value: 108 }],
    },
  },
  {
    id: "g-hexagon-exterior",
    title: "Regular hexagon, exterior angle",
    spec: {
      ...hexagon,
      points: { ...hexagon.points, X: [2 * hexB[0] - hexA[0], 2 * hexB[1] - hexA[1]] },
      segments: [{ from: "B", to: "X", dashed: true }],
      angles: [{ vertex: "B", from: "X", to: "C", value: 60, label: "e" }],
    },
  },
  // --- geometry: angle facts ----------------------------------------------------------------
  {
    id: "g-line-two",
    title: "Two angles on a straight line",
    spec: anglesOnLine([{ value: 130 }, { value: 50, label: "x" }]),
  },
  {
    id: "g-line-three",
    title: "Three angles on a straight line",
    spec: anglesOnLine([{ value: 40 }, { value: 95 }, { value: 45, label: "y" }]),
  },
  {
    id: "g-line-right",
    title: "Right angle on a straight line",
    spec: anglesOnLine([{ value: 90 }, { value: 35 }, { value: 55, label: "a" }]),
  },
  {
    id: "g-point-three",
    title: "Three angles at a point",
    spec: anglesAtPoint([{ value: 110 }, { value: 140 }, { value: 110, label: "a" }]),
  },
  {
    id: "g-point-five",
    title: "Five angles at a point",
    spec: anglesAtPoint([
      { value: 50 },
      { value: 70 },
      { value: 80 },
      { value: 65 },
      { value: 95, label: "x" },
    ]),
  },
  {
    id: "g-vertically-opposite",
    title: "Vertically opposite angles",
    spec: {
      type: "geometry",
      points: {
        O: [0, 0],
        A: pointAt([0, 0], 20, 3),
        B: pointAt([0, 0], 200, 3),
        C: pointAt([0, 0], 90, 3),
        D: pointAt([0, 0], 270, 3),
      },
      segments: [
        { from: "A", to: "B" },
        { from: "C", to: "D" },
      ],
      angles: [
        { vertex: "O", from: "A", to: "C", value: 70 },
        { vertex: "O", from: "B", to: "D", value: 70, label: "x" },
        { vertex: "O", from: "C", to: "B", value: 110, label: "y" },
      ],
    },
  },
  {
    id: "g-reflex",
    title: "Reflex angle",
    spec: {
      type: "geometry",
      points: { B: [0, 0], A: pointAt([0, 0], 0, 3), C: pointAt([0, 0], 70, 3) },
      segments: [
        { from: "B", to: "A" },
        { from: "B", to: "C" },
      ],
      angles: [{ vertex: "B", from: "C", to: "A", value: 290 }],
      pointLabels: true,
    },
  },
  {
    id: "g-alternate",
    title: "Alternate angles",
    spec: {
      type: "geometry",
      points: transversal(45),
      segments: parallelLines,
      angles: [
        { vertex: "P", from: "B", to: "Q", value: 45 },
        { vertex: "Q", from: "C", to: "P", label: "x" },
      ],
    },
  },
  {
    id: "g-corresponding",
    title: "Corresponding angles",
    spec: {
      type: "geometry",
      points: transversal(60),
      segments: parallelLines,
      angles: [
        { vertex: "P", from: "B", to: "Q", value: 60 },
        { vertex: "Q", from: "D", to: "T", label: "y" },
      ],
    },
  },
  {
    id: "g-co-interior",
    title: "Co-interior angles",
    spec: {
      type: "geometry",
      points: transversal(60),
      segments: parallelLines,
      angles: [
        { vertex: "P", from: "B", to: "Q", value: 60 },
        { vertex: "Q", from: "P", to: "D", label: "z" },
      ],
    },
  },
  // --- geometry: circles --------------------------------------------------------------------
  {
    id: "g-circle-radius",
    title: "Circle with a radius",
    spec: {
      type: "geometry",
      points: { O: [0, 0], A: pointAt([0, 0], 30, 5) },
      circles: [{ centre: "O", radius: 5 }],
      segments: [{ from: "O", to: "A", label: cm(5), length: 5 }],
      dots: ["O"],
      pointLabels: ["O", "A"],
    },
  },
  {
    id: "g-semicircle-theorem",
    title: "Angle in a semicircle",
    spec: {
      type: "geometry",
      points: { O: [0, 0], A: [-3, 0], B: [3, 0], C: pointAt([0, 0], 60, 3) },
      circles: [{ centre: "O", radius: 3 }],
      polygons: [{ vertices: ["A", "B", "C"] }],
      angles: [
        { vertex: "C", from: "A", to: "B", right: true },
        { vertex: "A", from: "B", to: "C", value: 30 },
      ],
      dots: ["O"],
      pointLabels: true,
    },
  },
  // --- cartesian ----------------------------------------------------------------------------
  {
    id: "c-blank-grid",
    title: "Four-quadrant grid",
    spec: { type: "cartesian", x: { min: -5, max: 5 }, y: { min: -5, max: 5 } },
  },
  {
    id: "c-points",
    title: "Points in all four quadrants",
    spec: {
      type: "cartesian",
      x: { min: -5, max: 5 },
      y: { min: -5, max: 5 },
      points: [
        { at: [2, 3], label: "\\mathrm{A}" },
        { at: [-3, 1], label: "\\mathrm{B}" },
        { at: [-2, -4], label: "\\mathrm{C}" },
        { at: [4, -2], label: "\\mathrm{D}" },
      ],
    },
  },
  {
    id: "c-first-quadrant-shape",
    title: "Shape in the first quadrant",
    spec: {
      type: "cartesian",
      x: { min: 0, max: 8 },
      y: { min: 0, max: 6 },
      polygons: [
        {
          vertices: [
            [1, 1],
            [4, 1],
            [1, 5],
          ],
          label: "\\mathrm{A}",
          shaded: true,
        },
      ],
    },
  },
  {
    id: "c-straight-line",
    title: "Straight-line graph",
    spec: {
      type: "cartesian",
      x: { min: -4, max: 4 },
      y: { min: -6, max: 6, step: 2 },
      curves: [{ y: "2x - 1", label: "y = 2x - 1" }],
    },
  },
  {
    id: "c-two-lines",
    title: "Two lines and their intersection",
    spec: {
      type: "cartesian",
      x: { min: -2, max: 5 },
      y: { min: -2, max: 6 },
      curves: [
        { y: "x + 1", label: "y = x + 1" },
        { y: "3 - x", label: "y = 3 - x" },
      ],
      points: [{ at: [1, 2], label: "\\mathrm{P}" }],
    },
  },
  {
    id: "c-parabola",
    title: "Quadratic graph with roots and turning point",
    spec: {
      type: "cartesian",
      x: { min: -3, max: 5 },
      y: { min: -5, max: 8 },
      curves: [{ y: "x^2 - 2x - 3" }],
      points: [{ at: [-1, 0] }, { at: [3, 0] }, { at: [1, -4], label: "(1, -4)" }],
    },
  },
  {
    id: "c-reciprocal",
    title: "Reciprocal graph",
    spec: {
      type: "cartesian",
      x: { min: -5, max: 5 },
      y: { min: -5, max: 5 },
      curves: [{ y: "1/x", label: "y = \\frac{1}{x}" }],
    },
  },
  {
    id: "c-sine",
    title: "Sine graph in degrees",
    spec: {
      type: "cartesian",
      x: { min: 0, max: 360, step: 90 },
      y: { min: -1.5, max: 1.5, step: 0.5 },
      grid: false,
      curves: [{ y: "sin(x)", degrees: true, label: "y = \\sin x" }],
    },
  },
  {
    id: "c-tangent",
    title: "Tangent graph with asymptotes",
    spec: {
      type: "cartesian",
      x: { min: 0, max: 360, step: 90 },
      y: { min: -4, max: 4, step: 1 },
      grid: false,
      curves: [{ y: "tan(x)", degrees: true }],
      verticals: [
        { x: 90, dashed: true },
        { x: 270, dashed: true },
      ],
    },
  },
  {
    id: "c-cubic",
    title: "Cubic graph",
    spec: {
      type: "cartesian",
      x: { min: -3, max: 3 },
      y: { min: -6, max: 6, step: 2 },
      curves: [{ y: "x^3 - 4x" }],
    },
  },
  {
    id: "c-reflection",
    title: "Reflection in y = x",
    spec: {
      type: "cartesian",
      x: { min: 0, max: 6 },
      y: { min: 0, max: 6 },
      curves: [{ y: "x", dashed: true, label: "y = x" }],
      polygons: [
        {
          vertices: [
            [2, 0.5],
            [4, 0.5],
            [4, 1.5],
          ],
          label: "\\mathrm{A}",
          shaded: true,
        },
        {
          vertices: [
            [0.5, 2],
            [0.5, 4],
            [1.5, 4],
          ],
          label: "\\mathrm{B}",
        },
      ],
    },
  },
  {
    id: "c-vector",
    title: "A translation vector",
    spec: {
      type: "cartesian",
      x: { min: 0, max: 6 },
      y: { min: 0, max: 5 },
      segments: [{ from: [1, 1], to: [4, 3], arrow: true, label: "a" }],
    },
  },
  // --- number lines -------------------------------------------------------------------------
  {
    id: "n-zero-to-ten",
    title: "0 to 10 with a marked point",
    spec: {
      type: "number-line",
      min: 0,
      max: 10,
      step: 1,
      points: [{ value: 7, label: "\\mathrm{A}" }],
    },
  },
  {
    id: "n-negatives-jump",
    title: "Negative numbers with a jump",
    spec: {
      type: "number-line",
      min: -5,
      max: 5,
      step: 1,
      jumps: [{ from: -3, to: 2, label: "+5" }],
    },
  },
  {
    id: "n-fractions",
    title: "Fractions between 0 and 1",
    spec: {
      type: "number-line",
      min: 0,
      max: 1,
      step: 0.25,
      minor: 2,
      labels: [
        { value: 0, label: "0" },
        { value: 0.25, label: "\\frac{1}{4}" },
        { value: 0.5, label: "\\frac{1}{2}" },
        { value: 0.75, label: "\\frac{3}{4}" },
        { value: 1, label: "1" },
      ],
      points: [{ value: 0.625, label: "?", style: "arrow" }],
    },
  },
  {
    id: "n-decimals",
    title: "Hundredths between 2.3 and 2.4",
    spec: {
      type: "number-line",
      min: 2.3,
      max: 2.4,
      step: 0.05,
      minor: 5,
      points: [{ value: 2.37, label: "A", style: "arrow" }],
    },
  },
  {
    id: "n-inequality",
    title: "Inequality −2 < x ≤ 3",
    spec: {
      type: "number-line",
      min: -4,
      max: 5,
      step: 1,
      intervals: [{ from: -2, to: 3, fromIncluded: false, toIncluded: true }],
    },
  },
  {
    id: "n-inequality-unbounded",
    title: "Inequality x ≥ 1",
    spec: {
      type: "number-line",
      min: -2,
      max: 6,
      step: 1,
      intervals: [{ from: 1, fromIncluded: true }],
    },
  },
  {
    id: "n-counting-on",
    title: "Counting on in jumps",
    spec: {
      type: "number-line",
      min: 0,
      max: 20,
      step: 5,
      minor: 5,
      jumps: [
        { from: 8, to: 10, label: "+2" },
        { from: 10, to: 15, label: "+5" },
        { from: 15, to: 16, label: "+1", side: "below" },
      ],
    },
  },
  // --- bar models ---------------------------------------------------------------------------
  {
    id: "b-part-whole",
    title: "Part-whole bar",
    spec: {
      type: "bar-model",
      bars: [
        {
          parts: [
            { size: 24, label: "24" },
            { size: 16, label: "?" },
          ],
        },
      ],
      braces: [{ bar: 0, from: 0, to: 1, label: "40" }],
    },
  },
  {
    id: "b-comparison",
    title: "Comparison bars",
    spec: {
      type: "bar-model",
      bars: [
        { label: "\\text{Sam}", parts: [{ size: 5, label: "£5" }] },
        {
          label: "\\text{Amy}",
          parts: [
            { size: 5, label: "£5" },
            { size: 3, label: "?" },
          ],
        },
      ],
      braces: [{ bar: 1, from: 0, to: 1, label: "£8", side: "below" }],
    },
  },
  {
    id: "b-fraction-of-amount",
    title: "Three fifths of 60",
    spec: {
      type: "bar-model",
      bars: [{ parts: [1, 2, 3, 4, 5].map((k) => ({ size: 1, shaded: k <= 3 })) }],
      braces: [
        { bar: 0, from: 0, to: 4, label: "60" },
        { bar: 0, from: 0, to: 2, label: "\\frac{3}{5}\\text{ of }60", side: "below" },
      ],
    },
  },
  {
    id: "b-ratio",
    title: "Ratio 2 : 3",
    spec: {
      type: "bar-model",
      bars: [
        { label: "\\text{Boys}", parts: [{ size: 1 }, { size: 1 }] },
        { label: "\\text{Girls}", parts: [{ size: 1 }, { size: 1 }, { size: 1 }] },
      ],
      braces: [{ bar: 1, from: 0, to: 2, label: "45", side: "below" }],
    },
  },
  {
    id: "b-percentages",
    title: "Percentages of an amount",
    spec: {
      type: "bar-model",
      bars: [{ parts: [1, 2, 3, 4].map((k) => ({ size: 1, label: "25\\%", shaded: k === 1 })) }],
      braces: [{ bar: 0, from: 0, to: 3, label: "£80" }],
    },
  },
];
