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
type Box = Extract<ChartSpec, { kind: "box" }>;

const PLOT_HEIGHT = 220;
const BAR_WIDTH = 34;
const BAR_GAP = 22;
const SYMBOL = 24;
const ROW = SYMBOL + 14;
const RADIUS = 100;

const isValue = (v: unknown) => typeof v === "number" && Number.isFinite(v) && v >= 0;

export function checkChart(spec: ChartSpec): string[] {
  if (spec.kind === "box") return checkBox(spec);
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
  if (spec.kind === "box") return describeBox(spec);
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
      spec.kind === "box"
        ? layoutBox(spec, shapes, obstacles, labels)
        : spec.kind === "bar"
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

const BOX_WIDTH = 360;
const BOX_ROW = 56;
const BOX_HEIGHT = 26;

function checkBox(spec: Box): string[] {
  const problems: string[] = [];
  const { min, max, step } = spec.axis ?? {};
  if (!Array.isArray(spec.plots) || spec.plots.length === 0 || spec.plots.length > 3)
    return ["a box plot chart needs 1 to 3 plots"];
  if (!(typeof min === "number" && typeof max === "number" && max > min && step > 0))
    return ["the axis needs min < max and a positive step"];
  const ticks = (max - min) / step;
  if (Math.abs(ticks - Math.round(ticks)) > 1e-9)
    problems.push(`step ${step} does not divide the axis`);
  if (ticks > 20) problems.push(`${Math.round(ticks)} axis steps is too many to read`);
  spec.plots.forEach((p, i) => {
    const v = p.values;
    if (!Array.isArray(v) || v.length !== 5 || !v.every((x) => Number.isFinite(x)))
      problems.push(`plot ${i + 1} needs five numbers`);
    else if (v.some((x, j) => j > 0 && x < (v[j - 1] ?? x)))
      problems.push(`plot ${i + 1}'s five numbers must be in order`);
    else if ((v[0] ?? 0) < min || (v[4] ?? 0) > max) problems.push(`plot ${i + 1} is off the axis`);
  });
  return problems;
}

function describeBox(spec: Box): string {
  const one = (p: Box["plots"][number]) => {
    const [lo, q1, med, q3, hi] = p.values.map(numberPlain);
    return `${p.name ? `${plain(p.name)}: ` : ""}minimum ${lo}, lower quartile ${q1}, median ${med}, upper quartile ${q3}, maximum ${hi}`;
  };
  return `Box plot${spec.plots.length > 1 ? "s" : ""} on a scale from ${numberPlain(spec.axis.min)} to ${numberPlain(spec.axis.max)}. ${spec.plots.map(one).join("; ")}.`;
}

function layoutBox(
  spec: Box,
  shapes: string[],
  obstacles: Obstacle[],
  labels: LabelRequest[],
): Rect {
  const { min, max, step } = spec.axis;
  const x = (v: number) => ((v - min) / (max - min)) * BOX_WIDTH;
  const axisY = spec.plots.length * BOX_ROW;
  // Faint vertical grid lines help read the values.
  for (let t = min; t <= max + 1e-9; t += step) {
    shapes.push(line([x(t), 0], [x(t), axisY], { width: 0.6, dashed: true }));
  }
  spec.plots.forEach((p, i) => {
    const [lo, q1, med, q3, hi] = p.values;
    const cy = i * BOX_ROW + BOX_ROW / 2;
    const top = cy - BOX_HEIGHT / 2;
    const bottom = cy + BOX_HEIGHT / 2;
    const parts: [Point, Point][] = [
      [
        [x(lo), cy],
        [x(q1), cy],
      ],
      [
        [x(q3), cy],
        [x(hi), cy],
      ],
      [
        [x(lo), top + 6],
        [x(lo), bottom - 6],
      ],
      [
        [x(hi), top + 6],
        [x(hi), bottom - 6],
      ],
      [
        [x(med), top],
        [x(med), bottom],
      ],
    ];
    for (const [a, b] of parts) {
      shapes.push(line(a, b, { width: 1.6 }));
      obstacles.push({ id: `plot ${i + 1}`, segment: [a, b] });
    }
    const box: Point[] = [
      [x(q1), top],
      [x(q3), top],
      [x(q3), bottom],
      [x(q1), bottom],
    ];
    shapes.push(polygon(box, { shaded: true }));
    for (const segment of polylineSegments(box, true))
      obstacles.push({ id: `plot ${i + 1}`, segment });
    if (p.name) {
      const text = label(p.name);
      labels.push({ id: `name ${i + 1}`, text, candidates: [[-12 - text.width / 2, cy]] });
    }
  });
  const axis: [Point, Point] = [
    [0, axisY],
    [BOX_WIDTH, axisY],
  ];
  shapes.push(line(axis[0], axis[1], { width: 1.6 }));
  obstacles.push({ id: "axis", segment: axis });
  for (let t = min; t <= max + 1e-9; t += step) {
    shapes.push(line([x(t), axisY], [x(t), axisY + 4], { width: 1.2 }));
    const text = label(numberLabel(t));
    labels.push({ id: `axis ${t}`, text, candidates: [[x(t), axisY + 8 + text.height / 2]] });
  }
  if (spec.axis.label) {
    const text = label(spec.axis.label);
    labels.push({
      id: "axis name",
      text,
      candidates: [[BOX_WIDTH / 2, axisY + 34 + text.height / 2]],
    });
  }
  return { x: 0, y: 0, w: BOX_WIDTH, h: axisY + 4 };
}
