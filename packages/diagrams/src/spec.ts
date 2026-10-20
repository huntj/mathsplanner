// DiagramSpec types: generators describe *what* to draw in maths units; the engine decides
// where everything goes on the page. Every spec is plain JSON, so it travels inside a Question.
//
// Type aliases rather than interfaces: only aliases fit core's DiagramSpec index signature, which
// is how a spec travels inside a Question.
/* eslint-disable @typescript-eslint/consistent-type-definitions */

/** LaTeX for a label, in the classroom subset the engine can lay out (see text.ts). */
export type Label = string;

export type Coord = [number, number];

// --- geometry ------------------------------------------------------------------------------

export type GeoSegment = {
  from: string;
  to: string;
  label?: Label;
  /** The length the label states, in any unit; checked against the drawing unless not to scale. */
  length?: number;
  /** Equal-length tick marks; segments with the same count must be equal. */
  ticks?: number;
  /** Parallel arrows; segments with the same count must be parallel. */
  arrows?: number;
  dashed?: boolean;
  /** Extend beyond both points, to show a line rather than a segment. */
  extend?: boolean;
  /** An arrowhead at `to`, for rays, directions and north lines. */
  arrow?: boolean;
};

export type GeoPolygon = {
  /** Vertex names in order; sides are drawn between consecutive vertices. */
  vertices: string[];
  shaded?: boolean;
};

export type GeoAngle = {
  /** The angle at `vertex`, turning anticlockwise from the ray towards `from` to the ray towards `to`. */
  vertex: string;
  from: string;
  to: string;
  label?: Label;
  /** The size the label states, in degrees; checked against the drawing unless not to scale. */
  value?: number;
  /** Draw a right-angle square; the angle must be 90°. */
  right?: boolean;
  /** Number of arcs, to mark equal angles. Default 1. */
  arcs?: number;
  /** An arrowhead on the arc, to show a turn: at the `to` end (anticlockwise) or the `from` end (clockwise). */
  turn?: "anticlockwise" | "clockwise";
};

export type GeoCircle = {
  centre: string;
  radius: number;
  dashed?: boolean;
  /** A label just outside the circle, e.g. "circumference". */
  label?: Label;
};

export type GeometrySpec = {
  type: "geometry";
  /** Named points in maths coordinates (y up). Units are arbitrary but shared by every point. */
  points: Record<string, Coord>;
  segments?: GeoSegment[];
  polygons?: GeoPolygon[];
  angles?: GeoAngle[];
  circles?: GeoCircle[];
  /** Points to name on the diagram: true for all, or a list. Labels default to the point name. */
  pointLabels?: boolean | string[];
  /** Label text for named points, e.g. { N1: "\mathrm{N}" } for a north line. */
  names?: Record<string, Label>;
  /** Points to mark with a dot. */
  dots?: string[];
  /** The drawing deliberately does not match the numbers; adds the caption and relaxes checks. */
  notToScale?: boolean;
  description?: string;
};

// --- cartesian -----------------------------------------------------------------------------

export type Axis = {
  min: number;
  max: number;
  /** Distance between labelled ticks; chosen automatically if missing. */
  step?: number;
  /** Axis name, default x or y. */
  label?: Label;
};

export type CartesianPoint = {
  at: Coord;
  label?: Label;
  /** Hollow rather than filled. */
  open?: boolean;
};

export type CartesianCurve = {
  /** y as an expression in x, e.g. "x^2 - 3x + 2", "1/x", "2sin(x)". */
  y: string;
  domain?: [number, number];
  label?: Label;
  dashed?: boolean;
  /** Trigonometric functions take degrees (GCSE) rather than radians. */
  degrees?: boolean;
};

export type CartesianPolygon = {
  vertices: Coord[];
  label?: Label;
  shaded?: boolean;
  dashed?: boolean;
};

export type CartesianSpec = {
  type: "cartesian";
  x: Axis;
  y: Axis;
  grid?: boolean;
  points?: CartesianPoint[];
  curves?: CartesianCurve[];
  /** Vertical lines x = value. */
  verticals?: { x: number; label?: Label; dashed?: boolean }[];
  segments?: { from: Coord; to: Coord; dashed?: boolean; arrow?: boolean; label?: Label }[];
  polygons?: CartesianPolygon[];
  description?: string;
};

// --- number line ---------------------------------------------------------------------------

export type NumberLinePoint = {
  value: number;
  label?: Label;
  /** A filled dot (default), an open circle, or an arrow pointing down at the value. */
  style?: "filled" | "open" | "arrow";
};

export type NumberLineSpec = {
  type: "number-line";
  min: number;
  max: number;
  /** Distance between labelled (major) ticks. */
  step: number;
  /** Minor intervals per major interval, e.g. 10 for tenths. */
  minor?: number;
  /** Tick labels: every major tick (default), only the ends, none, or your own. */
  labels?: "all" | "ends" | "none" | { value: number; label: Label }[];
  points?: NumberLinePoint[];
  jumps?: { from: number; to: number; label?: Label; side?: "above" | "below" }[];
  /** Inequalities: a missing end runs off the line with an arrow. */
  intervals?: { from?: number; to?: number; fromIncluded?: boolean; toIncluded?: boolean }[];
  description?: string;
};

// --- bar model -----------------------------------------------------------------------------

export type BarPart = {
  size: number;
  label?: Label;
  shaded?: boolean;
};

export type BarModelSpec = {
  type: "bar-model";
  bars: { label?: Label; parts: BarPart[] }[];
  /** Braces span parts `from` to `to` (inclusive) of one bar. */
  braces?: { bar: number; from: number; to: number; label: Label; side?: "above" | "below" }[];
  description?: string;
};

// --- measures -----------------------------------------------------------------------------

export type ProtractorSpec = {
  type: "measure";
  instrument: "protractor";
  /** The angle between the two arms, 0° to 180°. */
  angle: number;
  /** Which way the first arm runs along the zero line. "right" is read on the inner scale, "left" on the outer. */
  baseline: "right" | "left";
  /** Labels at the ends of the arms, e.g. point names. */
  armLabels?: [Label, Label];
  /** Hide the second arm, for drawing an angle. */
  hideSecondArm?: boolean;
  /**
   * Overrides the generated description. The default does not give the reading away, since
   * reading the scale is the question.
   */
  description?: string;
};

export type MeasureSpec = ProtractorSpec;

export type SupportedDiagramSpec =
  GeometrySpec | CartesianSpec | NumberLineSpec | BarModelSpec | MeasureSpec;
