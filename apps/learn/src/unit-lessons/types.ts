// A unit lesson: a short, interactive walk through a unit's big idea, in the style of a
// Brilliant course, met before the unit's skills. A lesson is data, a list of screens, each one of
// a few reusable kinds, so new lessons are mostly writing rather than code. The pupil discovers
// the idea by doing: feeding a machine, plotting points, spotting a pattern, nudging a slider,
// building the rule and drawing the line.

/** A straight line y = mx + c. */
export interface Rule {
  m: number;
  c: number;
}

export interface Point {
  x: number;
  y: number;
}

/** The part of the plane a graph shows. */
export interface Range {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

/** What a graph shows before the pupil does anything. */
export interface Scene {
  range: Range;
  /** Lines drawn in full. */
  lines?: Rule[];
  /** Points already plotted. */
  points?: Point[];
  /** A target to aim for, drawn as a star. */
  star?: Point;
  /** Draw the "1 across, m up" step between neighbouring points of the first line. */
  steps?: boolean;
  /** Upright lines, x = a, which have no rule y = mx + c. */
  verticals?: number[];
  /** Shapes drawn on the grid, such as a triangle to transform and its image. */
  shapes?: { points: Point[]; tone?: "object" | "image" | "ghost"; label?: string }[];
  /** Curves drawn in full: y = ax² + bx + c, or y = k ÷ x. */
  curves?: Curve[];
}

/** Words, with maths between dollar signs, as elsewhere in the app. */
export type Words = string;

/** A screen that explains, with Dot and an optional picture. */
export interface Explain {
  kind: "explain";
  title: Words;
  text: Words[];
  scene?: Scene;
  picture?: Picture;
}

/**
 * A function machine. The pupil feeds in each x; the first `shown` outputs are given, and for
 * the rest they choose what comes out before seeing it, so the rule is spotted, not told.
 */
export interface Machine {
  kind: "machine";
  title: Words;
  rule: Rule;
  inputs: number[];
  shown: number;
  /** Wrong outputs to offer beside the right one, by input, from common slips. */
  decoys: Record<number, number[]>;
  /** What goes in and comes out, x and y unless set (n and term, for a sequence). */
  ports?: [string, string];
  /** Said once it is done, instead of the rule. */
  done?: Words;
}

/**
 * Tap points onto a grid. With `table`, the pupil plots each pair from it; without, they plot
 * the targets in order (from an equation, or a prediction), one at a time.
 */
export interface Plot {
  kind: "plot";
  title: Words;
  text?: Words;
  scene: Scene;
  targets: Point[];
  /** Show the targets as a table of values to plot from. */
  table?: boolean;
  /** Join the plotted points with the line when they are all in. */
  rule?: Rule;
  /** Join the plotted points into a shape, in order, when they are all in. */
  join?: true;
  /** A hint shown after a wrong tap. */
  hint: Words;
  /** Said once every point is in. */
  done: Words;
}

export interface Option {
  text: Words;
  correct?: true;
  /** Why it is right, or the nudge for this wrong choice. */
  feedback: Words;
}

/** Choose an answer, with a picture; the picture can change once it is answered. */
export interface Choice {
  kind: "choice";
  title: Words;
  text?: Words;
  scene?: Scene;
  /** What the picture becomes once the right answer is chosen. */
  reveal?: Scene;
  /** A picture of another kind, and what it becomes once answered. */
  picture?: Picture;
  revealPicture?: Picture;
  options: Option[];
}

/** Nudge m or c and watch the line move, until it passes through the star. */
export interface Slider {
  kind: "slider";
  title: Words;
  text: Words;
  range: Range;
  /** The value that moves, and the other one, which stays put. */
  vary: "m" | "c";
  start: Rule;
  min: number;
  max: number;
  star: Point;
  /** Said once the line goes through the star. */
  done: Words;
}

/** Build a drawn line's equation from chips: y = [m]x + [c]. */
export interface Build {
  kind: "build";
  title: Words;
  text?: Words;
  range: Range;
  rule: Rule;
  /** The gradients and intercepts to choose from; each list holds the right one. */
  ms: number[];
  cs: number[];
  hint: Words;
}

/** Drag the two ends of a line until it is the line asked for. */
export interface DragLine {
  kind: "drag-line";
  title: Words;
  text?: Words;
  range: Range;
  rule: Rule;
  /** Where the two handles start. */
  from: [Point, Point];
  hint: Words;
}

// Pictures, for any screen that shows one. Coordinates are in the picture's own units, y upward.

/** A number line from min to max, with a tick every `step`. */
export interface NumberLinePic {
  kind: "number-line";
  min: number;
  max: number;
  step: number;
  /** Label every nth tick (1 by default); 0 labels only the ends. */
  every?: number;
  /** Label ticks as fractions with this denominator, rather than as decimals. */
  denominator?: number;
  marks?: { at: number; label?: string; tone?: "given" | "mine" | "wrong" | "hint" }[];
  /** Hops along the line, drawn as arcs above it. */
  jumps?: { from: number; to: number; label?: string }[];
  /** An interval, with a filled (closed) or empty (open) circle at each end. */
  /** An interval, with a filled (closed) or empty (open) circle at each end. An end left out
   *  runs off the line with an arrow, as in x > 3. */
  interval?: { from?: number; to?: number; fromClosed?: boolean; toClosed?: boolean };
}

/** Rays from a point, at angles in degrees (0 to the right, turning anticlockwise). */
export interface AnglesPic {
  kind: "angles";
  rays: number[];
  /** Arcs from one ray to another (indexes into rays), anticlockwise, each labelled. */
  arcs: { from: number; to: number; label: string; find?: true }[];
}

/** A polygon with labelled sides and angles. */
export interface ShapePic {
  kind: "shape";
  points: Point[];
  /** A letter for each corner, outside the shape. */
  names?: string[];
  /** A label for each side, from point i to point i + 1. */
  sides?: (string | null)[];
  /** A label for the angle at each point. */
  angles?: (string | null)[];
  /** Points that get a right-angle mark. */
  square?: number[];
  /** Dashed lines, such as a height. */
  dashed?: [Point, Point][];
  /** Lines of symmetry, drawn across the shape. */
  mirrors?: [Point, Point][];
  /** Dots, such as a centre of rotation. */
  dots?: Point[];
}

/** Bar models: rows of equal parts, for ratio and fractions. */
export interface BarsPic {
  kind: "bars";
  rows: { label: string; parts: number; shaded?: number; each?: string }[];
  /** A bracket over every row, labelled, for a total. */
  total?: string;
}

/** A grid of squares with some shaded, such as a hundred square. */
export interface GridPic {
  kind: "grid";
  cols: number;
  rows: number;
  shaded: number;
  /** The squares to shade, counting along rows from the top left, instead of the first few. */
  cells?: number[];
  /** Labels along the top and down the side, as in a sample space, and a value in each square. */
  colLabels?: string[];
  rowLabels?: string[];
  values?: string[];
}

/** A cuboid drawn in 3D, as unit cubes when `cubes` is set. */
export interface CuboidPic {
  kind: "cuboid";
  w: number;
  d: number;
  h: number;
  cubes?: boolean;
  labels?: [string, string, string];
}

export interface SpinnerPic {
  kind: "spinner";
  sectors: { label: string; size: number }[];
  /** Drawn as a pie chart: no pointer. */
  pie?: true;
}

/** A bar chart, or a vertical line chart with `lines`. */
export interface BarChartPic {
  kind: "bar-chart";
  bars: { label: string; value: number }[];
  /** The top of the scale, and the gap between its marks. */
  max: number;
  step: number;
  lines?: true;
  /** What the bars count, for the side of the chart. */
  axis?: string;
}

/** A free drawing in the picture's units: lines, arcs as from a compass, dots and labels. */
export interface DrawingPic {
  kind: "drawing";
  /** At least this much of the plane is shown, so steps that add to a drawing keep its scale. */
  frame?: Range;
  items: (
    | { line: [Point, Point]; dashed?: true; arrow?: number; tone?: "main" | "soft" | "find" }
    | { arc: Point; r: number; from: number; to: number; ry?: number; dashed?: true }
    | { dot: Point }
    | { text: string; at: Point; tone?: "main" | "find" }
  )[];
}

export interface TablePic {
  kind: "table";
  head?: Words[];
  rows: Words[][];
}

/** A growing pattern: columns of squares, one column per term. */
export interface StacksPic {
  kind: "stacks";
  counts: number[];
  /** A label under each column; "Term 1", "Term 2" and so on unless set. */
  labels?: string[];
}

/** A line segment on a ruler, in centimetres. */
export interface RulerPic {
  kind: "ruler";
  from: number;
  to: number;
}

/** Big maths on its own. */
export interface MathsPic {
  kind: "maths";
  tex: string;
}

/** A place value chart: a number's digits under their column headings. */
export interface PlaceValuePic {
  kind: "place-value";
  number: string;
  /** Columns to show, from the largest, as powers of ten (3 is thousands, -2 hundredths). */
  from: number;
  to: number;
  /** The column to pick out. */
  highlight?: number;
}

export type Picture =
  | ({ kind: "graph" } & Scene)
  | NumberLinePic
  | AnglesPic
  | ShapePic
  | BarsPic
  | GridPic
  | CuboidPic
  | SpinnerPic
  | TablePic
  | StacksPic
  | RulerPic
  | MathsPic
  | PlaceValuePic
  | BarChartPic
  | DrawingPic
  | VennPic
  | DotsPic;

/** Type an answer: a number, a fraction or a short expression. */
export interface Answer {
  kind: "answer";
  title: Words;
  text?: Words;
  picture?: Picture;
  /** Every answer accepted, as typed (spaces and case do not matter). */
  answers: string[];
  /** Shown after the box, such as a unit. */
  unit?: string;
  /** Nudges for common wrong answers. */
  wrong?: { answer: string; feedback: Words }[];
  hint: Words;
  done: Words;
}

/** Tap a number line to put each value in its place, one at a time. */
export interface Place {
  kind: "place";
  title: Words;
  text?: Words;
  line: NumberLinePic;
  /** Each value, how the pupil is asked for it, and a short mark to show once it is placed. */
  targets: { value: number; label: Words; mark?: string }[];
  hint: Words;
  done: Words;
}

/** Tap cards in order. */
export interface Order {
  kind: "order";
  title: Words;
  text?: Words;
  picture?: Picture;
  /** The cards, in the right order. */
  items: Words[];
  /** What the first and last are, such as "smallest" and "largest". */
  first: string;
  last: string;
  hint: Words;
  done: Words;
}

/** Sort cards into groups. */
export interface Sort {
  kind: "sort";
  title: Words;
  text?: Words;
  groups: Words[];
  items: { text: Words; group: number; why: Words }[];
  done: Words;
}

/** Fill the gaps, marked [], from a bank of chips. */
export interface Fill {
  kind: "fill";
  title: Words;
  text?: Words;
  picture?: Picture;
  template: Words;
  bank: Words[];
  answers: Words[];
  /** The gaps can be filled in any order, as in (x + 3)(x + 4). */
  anyOrder?: true;
  hint: Words;
  done: Words;
}

/** Tap squares of a grid to shade a given number of them. */
/** A curve on a coordinate grid. */
export type Curve =
  { kind: "quadratic"; a: number; b: number; c: number } | { kind: "inverse"; k: number };

/** Two overlapping sets, with what is in each region. */
export interface VennPic {
  kind: "venn";
  a: string;
  b: string;
  onlyA: string[];
  both: string[];
  onlyB: string[];
  neither?: string[];
}

/** Dot patterns for the first few triangular or square numbers. */
export interface DotsPic {
  kind: "dots";
  shape: "triangle" | "square";
  terms: number;
}

export interface Shade {
  kind: "shade";
  title: Words;
  text?: Words;
  cols: number;
  rows: number;
  target: number;
  /** The exact squares to shade, counting along rows from the top left; any squares if unset. */
  cells?: number[];
  /** Labels along the top and down the side, as in a sample space. */
  colLabels?: string[];
  rowLabels?: string[];
  /** A value in each square, such as the total of two dice. */
  values?: string[];
  hint: Words;
  done: Words;
}

/** Solve ax + b = c on a balance scale, keeping it level. */
export interface Balance {
  kind: "balance";
  title: Words;
  text?: Words;
  a: number;
  b: number;
  c: number;
  /** Letters on the right too: ax + b = dx + c. */
  d?: number;
  letter: string;
  done: Words;
}

/** Work something out a step at a time: each step a choice, and the working grows. */
export interface Steps {
  kind: "steps";
  title: Words;
  text?: Words;
  picture?: Picture;
  start: Words;
  /** Each step's question, and the working it adds; a picture can change with each step. */
  stages: { prompt: Words; options: Option[]; then: Words; picture?: Picture }[];
  done: Words;
}

/** Turn a ray to make an angle. */
export interface Dial {
  kind: "dial";
  title: Words;
  text?: Words;
  target: number;
  /** How close counts, in degrees. */
  within: number;
  /** Show a protractor, and the size of the angle as it turns. */
  protractor: boolean;
  hint: Words;
  done: Words;
}

/** Spin a spinner many times and watch the results settle. */
export interface Spin {
  kind: "spin";
  title: Words;
  text: Words;
  sectors: { label: string; size: number }[];
  /** Spins needed before it is done. */
  spins: number;
  done: Words;
}

/** Split a number into factors until every branch ends in a prime. */
export interface Tree {
  kind: "tree";
  title: Words;
  text?: Words;
  root: number;
  done: Words;
}

/**
 * Move a slider to change a shape and see why its formula works: slide a parallelogram's corner
 * across to make a rectangle, turn a copy of a triangle or trapezium to make a parallelogram, or
 * stack a cuboid's layers.
 */
export interface Morph {
  kind: "morph";
  title: Words;
  text: Words;
  shape: "parallelogram" | "triangle" | "trapezium" | "cuboid" | "circle";
  /** Parallelogram: base, height, slant. Triangle: base, height, apex. Trapezium: top, bottom,
   *  height, offset. Cuboid: width, depth, height. Circle: radius, and how many slices. */
  dims: number[];
  done: Words;
}

export type Screen =
  | Explain
  | Machine
  | Plot
  | Choice
  | Slider
  | Build
  | DragLine
  | Answer
  | Place
  | Order
  | Sort
  | Fill
  | Shade
  | Balance
  | Steps
  | Dial
  | Spin
  | Tree
  | Morph;

export interface UnitLesson {
  /** The course unit it opens, as in data/course.json. */
  unit: string;
  title: Words;
  /** One line for the path and the sheet. */
  summary: Words;
  screens: Screen[];
}
