// Statistics helpers: everyday data contexts, charts whose descriptions do not give the data away,
// and tables written as LaTeX arrays.
import type { Rng } from "@mathsplanner/core";
import type { CartesianSpec, ChartSpec } from "@mathsplanner/diagrams";

export interface Topic {
  what: string;
  who: string;
  categories: string[];
}

export const TOPICS: Topic[] = [
  {
    what: "favourite fruit",
    who: "children",
    categories: ["apple", "banana", "grape", "pear", "orange"],
  },
  { what: "pets", who: "children", categories: ["cat", "dog", "fish", "rabbit", "hamster"] },
  {
    what: "favourite sport",
    who: "pupils",
    categories: ["football", "netball", "tennis", "swimming", "cricket"],
  },
  { what: "way to school", who: "children", categories: ["walk", "car", "bus", "bike", "scooter"] },
  {
    what: "favourite colour",
    who: "people",
    categories: ["red", "blue", "green", "yellow", "purple"],
  },
];

/** A category name as a LaTeX label. */
export const txt = (s: string) => `\\text{${s}}`;

/** k distinct values from lo to hi in steps of `step`. */
export function distinctValues(rng: Rng, k: number, lo: number, hi: number, step = 1): number[] {
  const options = Array.from({ length: Math.floor((hi - lo) / step) + 1 }, (_, i) => lo + i * step);
  return rng.shuffle(options).slice(0, k);
}

export function barChart(topic: Topic, values: number[], step: number, max?: number): ChartSpec {
  const top = max ?? Math.ceil((Math.max(...values) + 1) / step) * step;
  return {
    type: "chart",
    kind: "bar",
    categories: topic.categories.slice(0, values.length).map(txt),
    values,
    axis: { max: top, step, label: txt(topic.who) },
    description: `A bar chart of ${topic.what}, with a scale going up in ${step}s.`,
  };
}

export function pictogram(topic: Topic, values: number[], key: number): ChartSpec {
  return {
    type: "chart",
    kind: "pictogram",
    categories: topic.categories.slice(0, values.length).map(txt),
    values,
    key,
    description: `A pictogram of ${topic.what}, where one symbol stands for ${key}.`,
  };
}

export function pieChart(topic: Topic, values: number[], showAngles: boolean): ChartSpec {
  return {
    type: "chart",
    kind: "pie",
    categories: topic.categories.slice(0, values.length).map(txt),
    values,
    showAngles,
    description: `A pie chart of ${topic.what}${showAngles ? ", with the angle of each sector marked" : ""}.`,
  };
}

/** A table as a LaTeX array with ruled lines: tableLatex(["Fruit", "Children"], [["apple", 5]]). */
export function tableLatex(headers: string[], rows: (string | number)[][]): string {
  const cols = `|${headers.map((_, i) => (i === 0 ? "l" : "c")).join("|")}|`;
  const cell = (c: string | number) => (typeof c === "number" ? String(c) : txt(c));
  const lines = [headers.map(txt).join(" & "), ...rows.map((r) => r.map(cell).join(" & "))];
  return `\\begin{array}{${cols}}\\hline ${lines.join(" \\\\ \\hline ")} \\\\ \\hline\\end{array}`;
}

/** A grouped frequency table with classes lo < v ≤ lo + width; `heading` is LaTeX. */
export function groupedTable(
  variable: string,
  heading: string,
  lows: number[],
  width: number,
  freqs: number[],
): string {
  const rows = lows.map((lo, i) => `${lo} < ${variable} \\le ${lo + width} & ${freqs[i] ?? 0}`);
  return `\\begin{array}{|c|c|}\\hline ${heading} & \\text{frequency} \\\\ \\hline ${rows.join(" \\\\ \\hline ")} \\\\ \\hline\\end{array}`;
}

/** A line graph of y against x as joined points on a grid. */
export function lineGraph(
  points: [number, number][],
  x: { min: number; max: number; step: number; label: string },
  y: { min: number; max: number; step: number; label: string },
  description: string,
): CartesianSpec {
  return {
    type: "cartesian",
    x: { min: x.min, max: x.max, step: x.step, label: txt(x.label) },
    y: { min: y.min, max: y.max, step: y.step, label: txt(y.label) },
    grid: true,
    segments: points.slice(1).map((to, i) => ({ from: points[i] ?? to, to })),
    points: points.map((at) => ({ at })),
    description,
  };
}
