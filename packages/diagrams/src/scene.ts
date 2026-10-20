// A Scene is one diagram laid out in pixels (y down): its shapes, the obstacles labels must
// avoid, and the labels still to place. compose() places the labels and writes the SVG.
import { union, type Rect } from "./geom.ts";
import { placeLabels, type Collision, type LabelRequest, type Obstacle } from "./labels.ts";
import { escapeXml, fmt } from "./svg.ts";
import { layoutLabel } from "./text.ts";

/**
 * How the diagram's own coordinates map to SVG pixels: svg = (origin.x + scale.x × x,
 * origin.y − scale.y × y). Interactive questions use it to turn a tap into a point.
 */
export interface Frame {
  origin: [number, number];
  scale: [number, number];
}

export interface Scene {
  shapes: string[];
  frame?: Frame;
  /** Bounds of everything in `shapes`. */
  bounds: Rect;
  obstacles: Obstacle[];
  labels: LabelRequest[];
  /** A caption under the diagram, e.g. "Not drawn to scale". */
  caption?: string;
  description: string;
  /** Ways the drawing contradicts the numbers (truth checks). */
  problems: string[];
}

export interface DiagramResult {
  /** A self-contained SVG string. */
  svg: string;
  /** Text description for screen readers. */
  description: string;
  width: number;
  height: number;
  /** Labels that overlap each other or a line; the quality checks require none. */
  collisions: Collision[];
  /** Ways the drawing contradicts the numbers; the renderer refuses to show these. */
  problems: string[];
  /** The diagram's coordinate frame, for types that have one (geometry, cartesian, protractor). */
  frame?: Frame;
}

/** Size of label text in px. */
export const LABEL_SIZE = 16;
const PADDING = 6;

export function compose(scene: Scene): DiagramResult {
  const { placements, collisions } = placeLabels(scene.labels, scene.obstacles);
  let box = union([scene.bounds, ...placements.map((p) => p.rect)]);

  let caption = "";
  if (scene.caption) {
    const text = layoutLabel(`\\text{${scene.caption}}`, 13);
    const baseline = box.y + box.h + 10 + text.ascent;
    const x = box.x + (box.w - text.width) / 2;
    caption = `<g font-style="italic">${text.svg(x, baseline)}</g>`;
    box = union([box, { x, y: baseline - text.ascent, w: text.width, h: text.height }]);
  }

  const x = box.x - PADDING;
  const y = box.y - PADDING;
  const width = Math.ceil(box.w + 2 * PADDING);
  const height = Math.ceil(box.h + 2 * PADDING);
  const description = scene.description;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${fmt(x)} ${fmt(y)} ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${escapeXml(description)}" class="mp-svg">` +
    `<title>${escapeXml(description)}</title>` +
    scene.shapes.join("") +
    `<g fill="currentColor">${placements.map((p) => p.svg).join("")}${caption}</g>` +
    `</svg>`;
  return {
    svg,
    description,
    width,
    height,
    collisions,
    problems: scene.problems,
    ...(scene.frame ? { frame: scene.frame } : {}),
  };
}
