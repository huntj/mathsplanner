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
  /** Draw the axes and their numbers (default). Turn off for a plain squared grid. */
  axes?: boolean;
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

/** An analogue clock. The default description does not give the time away. */
export type ClockSpec = {
  type: "measure";
  instrument: "clock";
  /** 0 to 23, shown on a 12-hour face. */
  hours: number;
  /** 0 to 59. */
  minutes: number;
  /** Roman numerals I to XII rather than 1 to 12. */
  roman?: boolean;
  /** Leave the hands off, for drawing a time. */
  hideHands?: boolean;
  description?: string;
};

/** A centimetre ruler, with an object lying along it from one reading to another. */
export type RulerSpec = {
  type: "measure";
  instrument: "ruler";
  /** Length of the ruler in whole centimetres, 1 to 15. */
  length: number;
  /** The object's ends as readings in cm, to the nearest millimetre. */
  object?: { from: number; to: number };
  /** Millimetre marks (default true). */
  mm?: boolean;
  description?: string;
};

/**
 * A scale read like a number line: the liquid in a measuring jug, the mercury in a thermometer or
 * the pointer on a dial of weighing scales. Marks every `step` are numbered, with `divisions`
 * equal spaces between them.
 */
export type ScaleSpec = {
  type: "measure";
  instrument: "jug" | "thermometer" | "scales";
  /** Default 0; a thermometer can go below. */
  min?: number;
  max: number;
  step: number;
  /** Equal spaces in each step, 1 to 10 (default 1: no unnumbered marks). */
  divisions?: number;
  /** The amount shown. */
  reading: number;
  /** The unit, e.g. \text{ml}, ^\circ\text{C} or \text{g}. */
  unit: Label;
  description?: string;
};

export type MeasureSpec = ProtractorSpec | ClockSpec | RulerSpec | ScaleSpec;

// --- counters ----------------------------------------------------------------------------

/** How a group of counters is laid out. "scatter" is jittered from `seed` but always the same. */
export type CounterArrangement = "dice" | "row" | "scatter";
export type CounterShape = "circle" | "square" | "star" | "triangle";

/**
 * Countable pictures for early number: dots and objects, ten frames, arrays, place-value charts,
 * part-whole models, fingers and tally marks. Counts are checked against what is drawn.
 */
export type CountersSpec = { type: "counters"; description?: string } & (
  | {
      layout: "objects";
      /** How many of each colour: filled, then outlined. One number for a single colour. */
      counts: number[];
      shape?: CounterShape;
      arrangement?: CounterArrangement;
      seed?: number;
    }
  | {
      layout: "ten-frame";
      /** Counters in each frame, 0 to 10; with `second`, that many of them are outlined. */
      frames: number[];
      second?: number[];
    }
  | { layout: "array"; rows: number; columns: number; shape?: CounterShape }
  | {
      layout: "place-value";
      /** Column headings, largest place first, e.g. ["H", "T", "O"] or ["Th", "H", "T", "O"]. */
      columns: string[];
      /** How many counters or blocks in each column. */
      counts: number[];
      /** Counters labelled with their value, or base-10 blocks (hundreds, tens, ones only). */
      style?: "counters" | "blocks";
      /** The value each column's counters show, e.g. ["100", "10", "1"]. */
      values?: string[];
    }
  | { layout: "part-whole"; whole: Label; parts: Label[] }
  | { layout: "fingers"; count: number }
  | { layout: "tally"; count: number }
  | {
      layout: "pattern";
      /** Shapes in a row, filled or outlined; null leaves a dashed gap marked "?". */
      items: ({ shape: CounterShape; filled?: boolean } | null)[];
    }
);

// --- charts ------------------------------------------------------------------------------

/**
 * Statistical charts drawn from their data: bar charts, pictograms and pie charts. Line graphs and
 * scatter graphs use the cartesian type. The default description lists the data; a generator asking
 * the student to read the chart sets its own description so it does not give the answer.
 */
export type ChartSpec = { type: "chart"; description?: string; title?: Label } & (
  | {
      kind: "bar";
      categories: Label[];
      values: number[];
      /** The value axis runs from 0 to max, labelled every step. */
      axis: { max: number; step: number; label?: Label };
    }
  | {
      kind: "pictogram";
      categories: Label[];
      values: number[];
      /** What one whole symbol stands for. Values must be whole quarters of it. */
      key: number;
      symbol?: "circle" | "square";
    }
  | {
      kind: "pie";
      categories: Label[];
      /** Frequencies; each sector's angle is in proportion. */
      values: number[];
      /** Write each sector's angle on it as well as its name. */
      showAngles?: boolean;
    }
);

// --- probability -------------------------------------------------------------------------

/**
 * Probability diagrams. So far, two-set Venn diagrams: each region holds a label (a count, a list
 * of elements, or an unknown such as x), in the order only A, both, only B, neither.
 */
export type ProbabilitySpec = {
  type: "probability";
  kind: "venn";
  sets: [Label, Label];
  regions: [Label, Label, Label, Label];
  description?: string;
};

export type SupportedDiagramSpec =
  | ProbabilitySpec
  | GeometrySpec
  | CartesianSpec
  | NumberLineSpec
  | BarModelSpec
  | MeasureSpec
  | CountersSpec
  | ChartSpec;
