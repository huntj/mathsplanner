// Probability diagrams: two-set Venn diagrams in a universal-set rectangle, with a label in each of
// the four regions, and tree diagrams (or frequency trees) drawn left to right. The default
// descriptions list the labels; a generator asking the student to read one sets its own.
import type { LabelRequest, Obstacle } from "../labels.ts";
import type { Scene } from "../scene.ts";
import type { ProbabilitySpec, TreeBranch, TreeSpec, VennSpec } from "../spec.ts";
import { circle, line, polygon, type Point } from "../svg.ts";
import { label, plain } from "./shared.ts";

const R = 70;
const GAP = 80;
const PAD = 30;

export function checkProbability(spec: ProbabilitySpec): string[] {
  if (spec.kind === "tree") return checkTree(spec);
  if (spec.kind !== "venn")
    return [`unknown probability diagram kind ${String((spec as { kind: unknown }).kind)}`];
  const problems: string[] = [];
  if (!Array.isArray(spec.sets) || spec.sets.length !== 2)
    problems.push("a Venn diagram needs two set names");
  if (!Array.isArray(spec.regions) || spec.regions.length !== 4)
    problems.push("a Venn diagram needs four regions: only A, both, only B, neither");
  return problems;
}

export function describeProbability(spec: ProbabilitySpec): string {
  if (spec.description) return spec.description;
  if (spec.kind === "tree") return describeTree(spec);
  const [a, b] = spec.sets.map(plain);
  const [onlyA, both, onlyB, neither] = spec.regions.map(plain);
  return `Venn diagram of sets ${a} and ${b}: ${onlyA} in ${a} only, ${both} in both, ${onlyB} in ${b} only, and ${neither} in neither.`;
}

export function layoutProbability(spec: ProbabilitySpec): Scene {
  if (spec.kind === "tree") return layoutTree(spec);
  return layoutVenn(spec);
}

function layoutVenn(spec: VennSpec): Scene {
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

// --- trees -----------------------------------------------------------------------------------

const LEVEL = 150;
const LEAF = 54;
const OUTCOME_GAP = 44;

function checkTree(spec: TreeSpec): string[] {
  const problems: string[] = [];
  const walk = (branches: TreeBranch[], depth: number) => {
    if (branches.length < 2 || branches.length > 4)
      problems.push("each point of a tree has 2 to 4 branches");
    if (depth > 3) problems.push("a tree has at most 3 levels");
    for (const b of branches) if (b.children) walk(b.children, depth + 1);
  };
  if (!Array.isArray(spec.branches)) return ["a tree needs branches"];
  walk(spec.branches, 1);
  return problems;
}

function describeTree(spec: TreeSpec): string {
  const say = (branches: TreeBranch[]): string =>
    branches
      .map(
        (b) =>
          `${plain(b.outcome)} (${plain(b.label)})${b.children ? `, then ${say(b.children)}` : ""}`,
      )
      .join("; ");
  return `A tree diagram${spec.root ? ` starting from ${plain(spec.root)}` : ""}. Branches: ${say(spec.branches)}.`;
}

interface Placed {
  branch: TreeBranch;
  end: Point;
  kids: Placed[];
}

function layoutTree(spec: TreeSpec): Scene {
  const problems = checkTree(spec);
  const description = describeTree(spec);
  const shapes: string[] = [];
  const obstacles: Obstacle[] = [];
  const labels: LabelRequest[] = [];
  if (problems.length > 0)
    return {
      shapes: [],
      bounds: { x: 0, y: 0, w: 10, h: 10 },
      obstacles,
      labels,
      description,
      problems,
    };

  // Pass 1: leaves take rows in order; a parent sits level with the middle of its children.
  let row = 0;
  let maxX = 0;
  const place = (branches: TreeBranch[], x: number): Placed[] =>
    branches.map((branch) => {
      const endX = x + LEVEL;
      maxX = Math.max(maxX, endX);
      if (!branch.children) {
        const placed: Placed = { branch, end: [endX, row * LEAF], kids: [] };
        row += 1;
        return placed;
      }
      // Children start after room for this branch's outcome label.
      const kids = place(branch.children, endX + OUTCOME_GAP);
      const y = ((kids[0] as Placed).end[1] + (kids[kids.length - 1] as Placed).end[1]) / 2;
      return { branch, end: [endX, y], kids };
    });
  const top = place(spec.branches, 0);
  const rootY = ((top[0] as Placed).end[1] + (top[top.length - 1] as Placed).end[1]) / 2;

  // Pass 2: draw each branch from its parent point, with its label and outcome.
  let id = 0;
  const draw = (nodes: Placed[], from: Point) => {
    for (const node of nodes) {
      const { branch, end } = node;
      shapes.push(line(from, end, { width: 1.6 }));
      obstacles.push({ id: `branch ${id}`, segment: [from, end] });
      const mid: Point = [(from[0] + end[0]) / 2, (from[1] + end[1]) / 2];
      const up = end[1] <= from[1];
      const text = label(branch.label);
      // Lift the label clear of the branch at its corners, not just at its centre.
      const slope = Math.abs((end[1] - from[1]) / (end[0] - from[0]));
      const gap = text.height / 2 + 6 + (slope * text.width) / 2;
      labels.push({
        id: `branch label ${id}`,
        text,
        candidates: [
          [mid[0], mid[1] + (up ? -1 : 1) * gap],
          [mid[0], mid[1] + (up ? 1 : -1) * gap],
        ],
      });
      const out = label(branch.outcome);
      labels.push({
        id: `outcome ${id}`,
        text: out,
        candidates: [[end[0] + 6 + out.width / 2, end[1]]],
      });
      id += 1;
      if (node.kids.length > 0) draw(node.kids, [end[0] + OUTCOME_GAP, end[1]]);
    }
  };
  draw(top, [0, rootY]);
  if (spec.root) {
    const r = label(spec.root);
    labels.push({ id: "root", text: r, candidates: [[-6 - r.width / 2, rootY]] });
  }
  return {
    shapes: [`<g fill="none">${shapes.join("")}</g>`],
    bounds: { x: -10, y: -LEAF / 2, w: maxX + 70, h: row * LEAF },
    obstacles,
    labels,
    description,
    problems,
  };
}
