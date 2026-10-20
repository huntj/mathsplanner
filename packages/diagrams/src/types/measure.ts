// Measuring instruments. Protractors first: a semicircle with inner and outer scales, the zero
// line and two arms, so students read (or misread) an angle as they would on paper.
import { add, polylineSegments, scale } from "../geom.ts";
import type { LabelRequest, Obstacle } from "../labels.ts";
import type { Scene } from "../scene.ts";
import type { ProtractorSpec } from "../spec.ts";
import { circle, fmt, line, path, type Point } from "../svg.ts";
import { layoutLabel } from "../text.ts";
import { label, plain } from "./shared.ts";

const R = 160;

export function checkProtractor(spec: ProtractorSpec): string[] {
  const problems: string[] = [];
  if (!(spec.angle >= 0 && spec.angle <= 180))
    problems.push(`a protractor measures 0° to 180°, not ${spec.angle}°`);
  if (spec.baseline !== "right" && spec.baseline !== "left")
    problems.push(`baseline must be "right" or "left"`);
  return problems;
}

export function describeProtractor(spec: ProtractorSpec): string {
  if (spec.description) return spec.description;
  const side = spec.baseline === "right" ? "right" : "left";
  const arms = spec.armLabels
    ? ` The arms are labelled ${plain(spec.armLabels[0])} and ${plain(spec.armLabels[1])}.`
    : "";
  return spec.hideSecondArm
    ? `A protractor with its centre on the end of a line that runs along the zero line to the ${side}. It has an inner and an outer scale from 0° to 180°.${arms}`
    : `A protractor placed over an angle, with its centre on the vertex and one arm along the zero line to the ${side}. It has an inner and an outer scale from 0° to 180°.${arms}`;
}

/** A point on the protractor at maths-frame direction `deg` and radius r (y down on screen). */
const at = (deg: number, r: number): Point => [
  r * Math.cos((deg * Math.PI) / 180),
  -r * Math.sin((deg * Math.PI) / 180),
];

export function layoutProtractor(spec: ProtractorSpec): Scene {
  const problems = checkProtractor(spec);
  const description = describeProtractor(spec);
  const shapes: string[] = [];
  const obstacles: Obstacle[] = [];
  const labels: LabelRequest[] = [];

  // The instrument, drawn faintly so the arms stand out.
  const instrument: string[] = [
    path(`M ${fmt(-R)} 0 A ${R} ${R} 0 0 1 ${fmt(R)} 0 Z`, { width: 1.2 }),
    path(`M ${fmt(-0.55 * R)} 0 A ${fmt(0.55 * R)} ${fmt(0.55 * R)} 0 0 1 ${fmt(0.55 * R)} 0`, {
      width: 0.8,
    }),
  ];
  for (let d = 0; d <= 180; d++) {
    const len = d % 10 === 0 ? 16 : d % 5 === 0 ? 10 : 5;
    instrument.push(line(at(d, R), at(d, R - len), { width: d % 10 === 0 ? 1.1 : 0.7 }));
    if (d % 10 === 0) instrument.push(line(at(d, 0.55 * R), at(d, 0.55 * R + 6), { width: 0.8 }));
  }
  // Inner scale counts anticlockwise from the right; outer scale counts clockwise from the left.
  const numbers: string[] = [];
  for (let d = 0; d <= 180; d += 10) {
    const outer = layoutLabel(String(180 - d), 11);
    const inner = layoutLabel(String(d), 10);
    const po = at(d, R - 26);
    const pi = at(d, R - 44);
    numbers.push(outer.svg(po[0] - outer.width / 2, po[1] + outer.ascent / 2));
    numbers.push(inner.svg(pi[0] - inner.width / 2, pi[1] + inner.ascent / 2));
  }
  shapes.push(`<g stroke-opacity="0.75">${instrument.join("")}</g>`);
  shapes.push(`<g fill="currentColor" fill-opacity="0.85">${numbers.join("")}</g>`);
  shapes.push(circle([0, 0], 3, { width: 1.2 }));
  shapes.push(line([-8, 0], [8, 0], { width: 1 }), line([0, -8], [0, 0], { width: 1 }));

  // The angle's arms, drawn boldly over the instrument.
  const first = spec.baseline === "right" ? 0 : 180;
  const second = spec.baseline === "right" ? spec.angle : 180 - spec.angle;
  const reach = R + 26;
  const arm1 = at(first, reach);
  shapes.push(line([0, 0], arm1, { width: 2.6 }));
  obstacles.push({ id: "first arm", segment: [[0, 0], arm1] });
  const ends: Point[] = [arm1];
  if (!spec.hideSecondArm) {
    const arm2 = at(second, reach);
    shapes.push(line([0, 0], arm2, { width: 2.6 }));
    obstacles.push({ id: "second arm", segment: [[0, 0], arm2] });
    ends.push(arm2);
  }
  obstacles.push(
    ...polylineSegments([at(0, R), at(90, R), at(180, R)]).map((segment) => ({
      id: "protractor",
      segment,
    })),
  );

  spec.armLabels?.forEach((latex, i) => {
    const end = ends[i];
    if (!end) return;
    const text = label(latex);
    const dir = scale(end, 1 / reach);
    labels.push({
      id: `arm label ${i + 1}`,
      text,
      candidates: [add(end, scale(dir, 6 + text.width / 2)), add(end, [0, -6 - text.height / 2])],
    });
  });

  return {
    // The vertex is at the origin, in pixels with y up, as the marking of a drawn arm expects.
    frame: { origin: [0, 0], scale: [1, 1] },
    shapes: [`<g fill="none">${shapes.join("")}</g>`],
    bounds: { x: -reach, y: -reach, w: 2 * reach, h: reach + 8 },
    obstacles,
    labels,
    description,
    problems,
  };
}
