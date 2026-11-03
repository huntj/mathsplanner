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
}

/** Words, with maths between dollar signs, as elsewhere in the app. */
export type Words = string;

/** A screen that explains, with Dot and an optional picture. */
export interface Explain {
  kind: "explain";
  title: Words;
  text: Words[];
  scene?: Scene;
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

export type Screen = Explain | Machine | Plot | Choice | Slider | Build | DragLine;

export interface UnitLesson {
  /** The course unit it opens, as in data/course.json. */
  unit: string;
  title: Words;
  /** One line for the path and the sheet. */
  summary: Words;
  screens: Screen[];
}
