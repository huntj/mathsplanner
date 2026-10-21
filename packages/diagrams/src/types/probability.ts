// Probability diagrams. So far, two-set Venn diagrams in a universal-set rectangle, with a label in
// each of the four regions. The default description lists the regions; a generator asking the
// student to read a region sets its own.
import type { LabelRequest, Obstacle } from "../labels.ts";
import type { Scene } from "../scene.ts";
import type { ProbabilitySpec } from "../spec.ts";
import { circle, polygon, type Point } from "../svg.ts";
import { label, plain } from "./shared.ts";

const R = 70;
const GAP = 80;
const PAD = 30;

export function checkProbability(spec: ProbabilitySpec): string[] {
  if (spec.kind !== "venn") return [`unknown probability diagram kind ${String(spec.kind)}`];
  const problems: string[] = [];
  if (!Array.isArray(spec.sets) || spec.sets.length !== 2)
    problems.push("a Venn diagram needs two set names");
  if (!Array.isArray(spec.regions) || spec.regions.length !== 4)
    problems.push("a Venn diagram needs four regions: only A, both, only B, neither");
  return problems;
}

export function describeProbability(spec: ProbabilitySpec): string {
  if (spec.description) return spec.description;
  const [a, b] = spec.sets.map(plain);
  const [onlyA, both, onlyB, neither] = spec.regions.map(plain);
  return `Venn diagram of sets ${a} and ${b}: ${onlyA} in ${a} only, ${both} in both, ${onlyB} in ${b} only, and ${neither} in neither.`;
}

export function layoutProbability(spec: ProbabilitySpec): Scene {
  const problems = checkProbability(spec);
  const description = describeProbability(spec);
  const shapes: string[] = [];
  const obstacles: Obstacle[] = [];
  const labels: LabelRequest[] = [];
  // Two circles overlapping by R − GAP / 2 on each side of the middle.
  const ca: Point = [0, 0];
  const cb: Point = [GAP, 0];
  const box = { x: -R - PAD, y: -R - PAD, w: GAP + 2 * R + 2 * PAD, h: 2 * R + 2 * PAD };
  const corners: Point[] = [
    [box.x, box.y],
    [box.x + box.w, box.y],
    [box.x + box.w, box.y + box.h],
    [box.x, box.y + box.h],
  ];
  shapes.push(polygon(corners, { width: 1.4 }));
  shapes.push(circle(ca, R, { width: 1.6 }), circle(cb, R, { width: 1.6 }));
  // The circles as obstacles: many short chords.
  for (const c of [ca, cb]) {
    for (let k = 0; k < 48; k++) {
      const [t0, t1] = [(k * Math.PI) / 24, ((k + 1) * Math.PI) / 24];
      obstacles.push({
        id: "circle",
        segment: [
          [c[0] + R * Math.cos(t0), c[1] + R * Math.sin(t0)],
          [c[0] + R * Math.cos(t1), c[1] + R * Math.sin(t1)],
        ],
      });
    }
  }
  if (problems.length === 0) {
    const [nameA, nameB] = spec.sets.map(label);
    if (nameA)
      labels.push({
        id: "set A",
        text: nameA,
        candidates: [
          [ca[0] - R * 0.75, -R - 8 - nameA.height / 2],
          [ca[0] - R - 6 - nameA.width / 2, -R + 6],
        ],
      });
    if (nameB)
      labels.push({
        id: "set B",
        text: nameB,
        candidates: [
          [cb[0] + R * 0.75, -R - 8 - nameB.height / 2],
          [cb[0] + R + 6 + nameB.width / 2, -R + 6],
        ],
      });
    const spots: Point[][] = [
      [
        [ca[0] - R * 0.45, 0],
        [ca[0] - R * 0.45, 14],
      ],
      [
        [GAP / 2, 0],
        [GAP / 2, 14],
      ],
      [
        [cb[0] + R * 0.45, 0],
        [cb[0] + R * 0.45, 14],
      ],
      [
        [box.x + box.w - 22, box.y + box.h - 16],
        [box.x + 22, box.y + box.h - 16],
      ],
    ];
    spec.regions.forEach((r, i) => {
      const text = label(r);
      labels.push({
        id: `region ${["only A", "both", "only B", "neither"][i]}`,
        text,
        candidates: (spots[i] ?? []).map((p): Point =>
          i === 3 ? [p[0] + (p[0] > 0 ? -text.width / 2 : text.width / 2), p[1]] : p,
        ),
      });
    });
  }
  return {
    shapes: [`<g fill="none">${shapes.join("")}</g>`],
    bounds: box,
    obstacles,
    labels,
    description,
    problems,
  };
}
