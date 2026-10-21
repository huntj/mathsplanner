// Charts: bar charts, pictograms and pie charts, drawn exactly from their data. Every value is checked
// against the scale before drawing, and the default description lists the data; a generator asking
// the student to read the chart sets its own description so it does not give the answer.
import { polylineSegments, union, type Rect } from "../geom.ts";
import type { LabelRequest, Obstacle } from "../labels.ts";
import type { Scene } from "../scene.ts";
import type { ChartSpec } from "../spec.ts";
import { circle, fmt, line, path, polygon, type Point } from "../svg.ts";
import { label, listJoin, numberLabel, numberPlain, plain } from "./shared.ts";

type Bar = Extract<ChartSpec, { kind: "bar" }>;
type Pictogram = Extract<ChartSpec, { kind: "pictogram" }>;
type Pie = Extract<ChartSpec, { kind: "pie" }>;

const PLOT_HEIGHT = 220;
const BAR_WIDTH = 34;
const BAR_GAP = 22;
const SYMBOL = 24;
const ROW = SYMBOL + 14;
const RADIUS = 100;

const isValue = (v: unknown) => typeof v === "number" && Number.isFinite(v) && v >= 0;

export function checkChart(spec: ChartSpec): string[] {
  const problems: string[] = [];
  const { categories, values } = spec;
  if (!Array.isArray(categories) || !Array.isArray(values) || categories.length !== values.length) {
    return ["a chart needs one value for each category"];
  }
  const most = spec.kind === "bar" ? 10 : spec.kind === "pictogram" ? 8 : 8;
  if (categories.length === 0 || categories.length > most)
    problems.push(`a ${spec.kind} chart needs 1 to ${most} categories, not ${categories.length}`);
  values.forEach((v, i) => {
    if (!isValue(v))
      problems.push(`value ${i + 1} must be a number of at least 0, not ${String(v)}`);
  });
  switch (spec.kind) {
    case "bar": {
      const { max, step } = spec.axis;
      if (!(max > 0 && step > 0)) problems.push("the axis needs a positive max and step");
      else {
        const ticks = max / step;
        if (Math.abs(ticks - Math.round(ticks)) > 1e-9)
          problems.push(`step ${step} does not divide ${max}`);
        if (ticks > 20) problems.push(`${Math.round(ticks)} axis steps is too many to read`);
      }
      values.forEach((v, i) => {
        if (v > max + 1e-9) problems.push(`value ${i + 1}, ${v}, is off the axis (0 to ${max})`);
      });
      break;
    }
    case "pictogram": {
      if (!(spec.key > 0)) problems.push("the key must be positive");
      values.forEach((v, i) => {
        const quarters = (v / spec.key) * 4;
        if (Math.abs(quarters - Math.round(quarters)) > 1e-9)
          problems.push(`value ${i + 1}, ${v}, is not a whole number of quarter symbols`);
        if (v / spec.key > 12) problems.push(`value ${i + 1} needs more than 12 symbols`);
      });
      break;
    }
    case "pie":
      if (values.reduce((s, v) => s + v, 0) <= 0)
        problems.push("a pie chart needs a positive total");
      break;
  }
  return problems;
}

/** The angle of each sector, in degrees. */
export const pieAngles = (values: readonly number[]): number[] => {
  const total = values.reduce((s, v) => s + v, 0);
  return values.map((v) => (v / total) * 360);
};

export function describeChart(spec: ChartSpec): string {
  if (spec.description) return spec.description;
  const title = spec.title ? ` of ${plain(spec.title)}` : "";
  const pairs = (f: (v: number, i: number) => string) =>
    listJoin(spec.categories.map((c, i) => `${plain(c)} ${f(spec.values[i] ?? 0, i)}`));
  switch (spec.kind) {
    case "bar":
      return `Bar chart${title}, with a scale from 0 to ${numberPlain(spec.axis.max)} in steps of ${numberPlain(spec.axis.step)}: ${pairs((v) => numberPlain(v))}.`;
    case "pictogram":
      return `Pictogram${title}, where one symbol stands for ${numberPlain(spec.key)}: ${pairs((v) => `${numberPlain(v / spec.key)} symbols (${numberPlain(v)})`)}.`;
    case "pie": {
      const angles = pieAngles(spec.values);
      return `Pie chart${title}: ${pairs((_, i) => `${numberPlain(Number((angles[i] ?? 0).toFixed(1)))}°`)}.`;
    }
  }
}

function layoutBar(
  spec: Bar,
  shapes: string[],
  obstacles: Obstacle[],
  labels: LabelRequest[],
): Rect {
  const n = spec.categories.length;
  const width = n * (BAR_WIDTH + BAR_GAP) + BAR_GAP;
  const ky = PLOT_HEIGHT / spec.axis.max;
  const y = (v: number) => PLOT_HEIGHT - v * ky;
  // Faint grid lines, the axes, then the bars.
  for (let t = spec.axis.step; t <= spec.axis.max + 1e-9; t += spec.axis.step) {
    shapes.push(line([0, y(t)], [width, y(t)], { width: 0.6, dashed: true }));
  }
  const axes: Point[][] = [
    [
      [0, 0],
      [0, PLOT_HEIGHT],
    ],
    [
      [0, PLOT_HEIGHT],
      [width, PLOT_HEIGHT],
    ],
  ];
  for (const [a, b] of axes) {
    shapes.push(line(a as Point, b as Point, { width: 1.6 }));
    obstacles.push({ id: "axis", segment: [a as Point, b as Point] });
  }
  for (let t = 0; t <= spec.axis.max + 1e-9; t += spec.axis.step) {
    shapes.push(line([-4, y(t)], [0, y(t)], { width: 1.2 }));
    const text = label(numberLabel(t));
    labels.push({ id: `axis ${t}`, text, candidates: [[-8 - text.width / 2, y(t)]] });
  }
  // Category names share one baseline, whatever their ascenders and descenders.
  const names = spec.categories.map((c) => label(c));
  const baseline = PLOT_HEIGHT + 8 + Math.max(...names.map((t) => t.ascent));
  spec.values.forEach((v, i) => {
    const x0 = BAR_GAP + i * (BAR_WIDTH + BAR_GAP);
    const corners: Point[] = [
      [x0, y(v)],
      [x0 + BAR_WIDTH, y(v)],
      [x0 + BAR_WIDTH, PLOT_HEIGHT],
      [x0, PLOT_HEIGHT],
    ];
    if (v > 0) {
      shapes.push(polygon(corners, { shaded: true }));
      for (const segment of polylineSegments(corners, true))
        obstacles.push({ id: `bar ${i + 1}`, segment });
    }
    const text = names[i] ?? label("");
    const cx = x0 + BAR_WIDTH / 2;
    const cy = baseline - text.ascent + text.height / 2;
    labels.push({
      id: `category ${i + 1}`,
      text,
      candidates: [
        [cx, cy],
        [cx, cy + 18],
      ],
    });
  });
  if (spec.axis.label) {
    const text = label(spec.axis.label);
    labels.push({
      id: "axis name",
      text,
      candidates: [[text.width / 2 - 10, -14 - text.height / 2]],
    });
  }
  return { x: -4, y: 0, w: width + 4, h: PLOT_HEIGHT };
}

/** A whole or partial symbol: a disc sector or the left part of a square, clockwise from the top. */
function symbol(kind: "circle" | "square", at: Point, fraction: number): string {
  const r = SYMBOL / 2;
  if (kind === "square") {
    const corners: Point[] = [
      [at[0] - r, at[1] - r],
      [at[0] - r + SYMBOL * fraction, at[1] - r],
      [at[0] - r + SYMBOL * fraction, at[1] + r],
      [at[0] - r, at[1] + r],
    ];
    return path(`M${corners.map((p) => `${fmt(p[0])} ${fmt(p[1])}`).join(" L")} Z`, {
      fill: "currentColor",
    });
  }
  if (fraction >= 1 - 1e-9) return circle(at, r, { filled: true });
  const a = fraction * 2 * Math.PI;
  const end: Point = [at[0] + r * Math.sin(a), at[1] - r * Math.cos(a)];
  return path(
    `M${fmt(at[0])} ${fmt(at[1])} L${fmt(at[0])} ${fmt(at[1] - r)} A${fmt(r)} ${fmt(r)} 0 ${fraction > 0.5 ? 1 : 0} 1 ${fmt(end[0])} ${fmt(end[1])} Z`,
    { fill: "currentColor" },
  );
}

function layoutPictogram(
  spec: Pictogram,
  shapes: string[],
  obstacles: Obstacle[],
  labels: LabelRequest[],
): Rect {
  const kind = spec.symbol ?? "circle";
  const names = spec.categories.map((c) => label(c));
  const left = Math.max(...names.map((t) => t.width)) + 16;
  let widest = left + SYMBOL;
  spec.values.forEach((v, i) => {
    const y = i * ROW + SYMBOL / 2;
    const name = names[i];
    if (name)
      labels.push({
        id: `category ${i + 1}`,
        text: name,
        candidates: [[left - 12 - name.width / 2, y]],
      });
    const count = v / spec.key;
    for (let k = 0; k < Math.ceil(count - 1e-9); k++) {
      const at: Point = [left + SYMBOL / 2 + k * (SYMBOL + 6), y];
      shapes.push(symbol(kind, at, Math.min(1, count - k)));
      obstacles.push({
        id: `symbol ${i + 1}.${k + 1}`,
        rect: { x: at[0] - SYMBOL / 2, y: at[1] - SYMBOL / 2, w: SYMBOL, h: SYMBOL },
      });
      widest = Math.max(widest, at[0] + SYMBOL / 2);
    }
  });
  const height = spec.values.length * ROW;
  shapes.push(line([left - 4, -6], [left - 4, height - 8], { width: 1.2 }));
  obstacles.push({
    id: "divider",
    segment: [
      [left - 4, -6],
      [left - 4, height - 8],
    ],
  });
  // The key, under the rows.
  const keyAt: Point = [left + SYMBOL / 2, height + 10 + SYMBOL / 2];
  shapes.push(symbol(kind, keyAt, 1));
  obstacles.push({
    id: "key symbol",
    rect: { x: keyAt[0] - SYMBOL / 2, y: keyAt[1] - SYMBOL / 2, w: SYMBOL, h: SYMBOL },
  });
  const keyText = label(`\\text{stands for } ${numberLabel(spec.key)}`);
  labels.push({
    id: "key",
    text: keyText,
    candidates: [[keyAt[0] + SYMBOL / 2 + 8 + keyText.width / 2, keyAt[1]]],
  });
  return { x: 0, y: -6, w: widest, h: height + 10 + SYMBOL + 6 };
}

function layoutPie(
  spec: Pie,
  shapes: string[],
  obstacles: Obstacle[],
  labels: LabelRequest[],
): Rect {
  const angles = pieAngles(spec.values);
  const at = (deg: number, r: number): Point => [
    r * Math.sin((deg * Math.PI) / 180),
    -r * Math.cos((deg * Math.PI) / 180),
  ];
  shapes.push(circle([0, 0], RADIUS, { width: 1.6 }));
  const rim: Point[] = Array.from({ length: 48 }, (_, k) => at(k * 7.5, RADIUS));
  for (const segment of polylineSegments(rim, true)) obstacles.push({ id: "rim", segment });
  let start = 0;
  const drawn = spec.values.filter((v) => v > 0).length;
  angles.forEach((a, i) => {
    if (a <= 0) return;
    if (drawn > 1) {
      const edge = at(start, RADIUS);
      shapes.push(line([0, 0], edge, { width: 1.4 }));
      obstacles.push({ id: `radius ${i + 1}`, segment: [[0, 0], edge] });
    }
    const mid = start + a / 2;
    const name = spec.categories[i] ?? "";
    const text = label(
      spec.showAngles ? `${name}\\ ${numberLabel(Number(a.toFixed(1)))}^\\circ` : name,
    );
    const outside =
      RADIUS +
      10 +
      (Math.abs(Math.sin((mid * Math.PI) / 180)) * text.width) / 2 +
      (Math.abs(Math.cos((mid * Math.PI) / 180)) * text.height) / 2;
    labels.push({
      id: `sector ${i + 1}`,
      text,
      candidates: [
        at(mid, RADIUS * 0.6),
        at(mid, RADIUS * 0.5),
        at(mid, outside),
        at(mid, outside + 12),
      ],
    });
    start += a;
  });
  return { x: -RADIUS, y: -RADIUS, w: 2 * RADIUS, h: 2 * RADIUS };
}

export function layoutChart(spec: ChartSpec): Scene {
  const problems = checkChart(spec);
  const description = describeChart(spec);
  const shapes: string[] = [];
  const obstacles: Obstacle[] = [];
  const labels: LabelRequest[] = [];
  let bounds: Rect = { x: 0, y: 0, w: 1, h: 1 };
  if (problems.length === 0) {
    bounds =
      spec.kind === "bar"
        ? layoutBar(spec, shapes, obstacles, labels)
        : spec.kind === "pictogram"
          ? layoutPictogram(spec, shapes, obstacles, labels)
          : layoutPie(spec, shapes, obstacles, labels);
  }
  if (spec.title) {
    const text = label(spec.title);
    labels.push({
      id: "title",
      text,
      candidates: [[bounds.x + bounds.w / 2, bounds.y - 30 - text.height / 2]],
    });
  }
  return {
    shapes: [`<g fill="none">${shapes.join("")}</g>`],
    bounds: union([bounds]),
    obstacles,
    labels,
    description,
    problems,
  };
}
