// DiagramSpec → SVG. The only place in MathsPlanner that produces SVG.
import type { DiagramSpec } from "@mathsplanner/core";
import { compose, type DiagramResult } from "./scene.ts";
import type { SupportedDiagramSpec } from "./spec.ts";
import { layoutBarModel } from "./types/barModel.ts";
import { layoutCartesian } from "./types/cartesian.ts";
import { layoutChart } from "./types/chart.ts";
import { layoutCounters } from "./types/counters.ts";
import { layoutGeometry } from "./types/geometry.ts";
import { layoutProtractor } from "./types/measure.ts";
import { layoutNumberLine } from "./types/numberLine.ts";

export class DiagramError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DiagramError";
  }
}

export const SUPPORTED_TYPES = [
  "geometry",
  "cartesian",
  "number-line",
  "bar-model",
  "measure",
  "counters",
  "chart",
] as const;

export function isSupported(
  spec: DiagramSpec | SupportedDiagramSpec,
): spec is SupportedDiagramSpec {
  return (SUPPORTED_TYPES as readonly string[]).includes(spec.type);
}

/**
 * Lays out and draws a diagram. Collisions and truth problems are returned, not thrown, so the
 * quality checks can report them; use `drawDiagram` when they should stop rendering.
 */
export function renderDiagram(spec: DiagramSpec | SupportedDiagramSpec): DiagramResult {
  if (!isSupported(spec)) {
    throw new DiagramError(`"${spec.type}" diagrams are not supported yet (Phase 7)`);
  }
  const shape = shapeProblem(spec);
  if (shape) throw new DiagramError(`${spec.type} diagram: ${shape}`);
  switch (spec.type) {
    case "geometry":
      return compose(layoutGeometry(spec));
    case "cartesian":
      return compose(layoutCartesian(spec));
    case "number-line":
      return compose(layoutNumberLine(spec));
    case "bar-model":
      return compose(layoutBarModel(spec));
    case "measure":
      return compose(layoutProtractor(spec));
    case "counters":
      return compose(layoutCounters(spec));
    case "chart":
      return compose(layoutChart(spec));
  }
}

const isNumber = (v: unknown) => typeof v === "number" && Number.isFinite(v);
const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const COUNTER_LAYOUTS = [
  "objects",
  "ten-frame",
  "array",
  "place-value",
  "part-whole",
  "fingers",
  "tally",
];

/** Catches specs with missing or mistyped fields before layout, with a readable message. */
function shapeProblem(spec: SupportedDiagramSpec): string | undefined {
  const s = spec as unknown as Record<string, unknown>;
  switch (spec.type) {
    case "geometry":
      return isObject(s.points) ? undefined : "points must be an object of named [x, y] pairs";
    case "cartesian":
      return [s.x, s.y].every((a) => isObject(a) && isNumber(a.min) && isNumber(a.max))
        ? undefined
        : "x and y need numeric min and max";
    case "number-line":
      return [s.min, s.max, s.step].every(isNumber)
        ? undefined
        : "min, max and step must be numbers";
    case "bar-model":
      return Array.isArray(s.bars) && s.bars.every((b) => isObject(b) && Array.isArray(b.parts))
        ? undefined
        : "bars must be a list of { parts: [...] }";
    case "measure":
      return s.instrument === "protractor" && isNumber(s.angle)
        ? undefined
        : "only protractors with a numeric angle are supported so far";
    case "chart":
      return ["bar", "pictogram", "pie"].includes(s.kind as string) && Array.isArray(s.values)
        ? undefined
        : "kind must be bar, pictogram or pie, with a list of values";
    case "counters":
      return COUNTER_LAYOUTS.includes(s.layout as string)
        ? undefined
        : `layout must be one of ${COUNTER_LAYOUTS.join(", ")}`;
  }
}

/** Like renderDiagram, but throws DiagramError if the drawing contradicts the numbers. */
export function drawDiagram(spec: DiagramSpec | SupportedDiagramSpec): DiagramResult {
  const result = renderDiagram(spec);
  if (result.problems.length > 0) {
    throw new DiagramError(`diagram does not tell the truth: ${result.problems.join("; ")}`);
  }
  return result;
}
