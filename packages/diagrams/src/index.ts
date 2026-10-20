// @mathsplanner/diagrams: DiagramSpec → SVG, label placement and truth checks. See docs/design.md.
export * from "./builders.ts";
export { compileExpression, ExpressionError } from "./expr.ts";
export type { Collision } from "./labels.ts";
export {
  DiagramError,
  drawDiagram,
  isSupported,
  renderDiagram,
  SUPPORTED_TYPES,
} from "./render.ts";
export type { DiagramResult, Frame } from "./scene.ts";
export * from "./spec.ts";
export { LabelError, latexToPlain, layoutLabel } from "./text.ts";
export { REFERENCE_DIAGRAMS, type ReferenceDiagram } from "./references.ts";
