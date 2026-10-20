// Bar models: proportional bars split into parts, for part-whole, comparison, fractions, ratio
// and percentages, with braces for totals and differences.
import { polylineSegments, union, type Rect } from "../geom.ts";
import type { LabelRequest, Obstacle } from "../labels.ts";
import type { Scene } from "../scene.ts";
import type { BarModelSpec } from "../spec.ts";
import { fmt, path, polygon, type Point } from "../svg.ts";
import { label, listJoin, numberPlain, plain } from "./shared.ts";

const WIDTH = 360;
const BAR_HEIGHT = 40;
const GAP = 22;
const BRACE_ROOM = 40;

export function checkBarModel(spec: BarModelSpec): string[] {
  const problems: string[] = [];
  if (spec.bars.length === 0) problems.push("bar model has no bars");
  spec.bars.forEach((bar, i) => {
    if (bar.parts.length === 0) problems.push(`bar ${i + 1} has no parts`);
    for (const p of bar.parts) {
      if (!(p.size > 0 && Number.isFinite(p.size)))
        problems.push(`bar ${i + 1} has a part of size ${p.size}`);
    }
  });
  for (const b of spec.braces ?? []) {
    const bar = spec.bars[b.bar];
    if (!bar) problems.push(`brace refers to bar ${b.bar + 1}, which does not exist`);
    else if (!(b.from >= 0 && b.to < bar.parts.length && b.from <= b.to)) {
      problems.push(
        `brace on bar ${b.bar + 1} spans parts ${b.from + 1} to ${b.to + 1}, which do not exist`,
      );
    }
  }
  return problems;
}

export function describeBarModel(spec: BarModelSpec): string {
  if (spec.description) return spec.description;
  const parts = [`Bar model with ${spec.bars.length} bar${spec.bars.length === 1 ? "" : "s"}.`];
  spec.bars.forEach((bar, i) => {
    const sizes = bar.parts.map((p) => numberPlain(p.size));
    const equal = sizes.every((s) => s === sizes[0]);
    const named = bar.label ? `, labelled ${plain(bar.label)},` : "";
    const shape = equal
      ? `${bar.parts.length} equal part${bar.parts.length === 1 ? "" : "s"}`
      : `${bar.parts.length} parts in proportion ${sizes.join(" : ")}`;
    const shaded = bar.parts.map((p, k) => (p.shaded ? String(k + 1) : "")).filter(Boolean);
    const partLabels = bar.parts.map((p) => (p.label ? plain(p.label) : "unlabelled"));
    parts.push(
      `Bar ${i + 1}${named} has ${shape}` +
        (shaded.length ? `; part${shaded.length > 1 ? "s" : ""} ${listJoin(shaded)} shaded` : "") +
        (bar.parts.some((p) => p.label) ? `; parts labelled ${listJoin(partLabels)}` : "") +
        ".",
    );
  });
  for (const b of spec.braces ?? []) {
    const span = b.from === b.to ? `part ${b.from + 1}` : `parts ${b.from + 1} to ${b.to + 1}`;
    parts.push(
      `A brace ${b.side === "below" ? "under" : "over"} ${span} of bar ${b.bar + 1}, labelled ${plain(b.label)}.`,
    );
  }
  return parts.join(" ");
}

/** A curly brace from x0 to x1 along y, opening towards `dir` (−1 up, +1 down). */
function bracePath(x0: number, x1: number, y: number, dir: number): string {
  const h = 9 * dir;
  const m = (x0 + x1) / 2;
  const q = Math.min(10, (x1 - x0) / 4);
  return (
    `M ${fmt(x0)} ${fmt(y)} Q ${fmt(x0)} ${fmt(y + h / 2)} ${fmt(x0 + q)} ${fmt(y + h / 2)}` +
    ` L ${fmt(m - q)} ${fmt(y + h / 2)} Q ${fmt(m)} ${fmt(y + h / 2)} ${fmt(m)} ${fmt(y + h)}` +
    ` Q ${fmt(m)} ${fmt(y + h / 2)} ${fmt(m + q)} ${fmt(y + h / 2)}` +
    ` L ${fmt(x1 - q)} ${fmt(y + h / 2)} Q ${fmt(x1)} ${fmt(y + h / 2)} ${fmt(x1)} ${fmt(y)}`
  );
}

export function layoutBarModel(spec: BarModelSpec): Scene {
  const problems = checkBarModel(spec);
  const description = describeBarModel(spec);
  const totals = spec.bars.map((b) => b.parts.reduce((s, p) => s + Math.max(0, p.size), 0));
  const unit = WIDTH / Math.max(...totals, 1e-9);
  const shapes: string[] = [];
  const obstacles: Obstacle[] = [];
  const labels: LabelRequest[] = [];
  const extents: Rect[] = [];

  // Leave room for braces above a bar (or below it) before the next bar starts.
  const bracesOn = (i: number, side: "above" | "below") =>
    (spec.braces ?? []).some((b) => b.bar === i && (b.side ?? "above") === side);
  const tops: number[] = [];
  let y = 0;
  spec.bars.forEach((_, i) => {
    if (bracesOn(i, "above")) y += BRACE_ROOM;
    tops.push(y);
    y += BAR_HEIGHT + GAP + (bracesOn(i, "below") ? BRACE_ROOM : 0);
  });

  const partX: number[][] = [];
  spec.bars.forEach((bar, i) => {
    const top = tops[i] ?? 0;
    const xs = [0];
    for (const p of bar.parts) xs.push((xs[xs.length - 1] ?? 0) + Math.max(0, p.size) * unit);
    partX.push(xs);
    bar.parts.forEach((p, k) => {
      const x0 = xs[k] ?? 0;
      const x1 = xs[k + 1] ?? 0;
      const corners: Point[] = [
        [x0, top],
        [x1, top],
        [x1, top + BAR_HEIGHT],
        [x0, top + BAR_HEIGHT],
      ];
      shapes.push(polygon(corners, { shaded: p.shaded }));
      for (const segment of polylineSegments(corners, true))
        obstacles.push({ id: `bar ${i + 1} part ${k + 1}`, segment });
      if (p.label) {
        const text = label(p.label);
        const centre: Point = [(x0 + x1) / 2, top + BAR_HEIGHT / 2];
        // Inside the part if it fits, otherwise just above or below it.
        labels.push({
          id: `bar ${i + 1} part ${k + 1} label`,
          text,
          candidates: [
            centre,
            [centre[0], top - 5 - text.height / 2],
            [centre[0], top + BAR_HEIGHT + 5 + text.height / 2],
          ],
        });
      }
    });
    extents.push({ x: 0, y: top, w: xs[xs.length - 1] ?? 0, h: BAR_HEIGHT });
    if (bar.label) {
      const text = label(bar.label);
      labels.push({
        id: `bar ${i + 1} name`,
        text,
        candidates: [
          [-8 - text.width / 2, top + BAR_HEIGHT / 2],
          [-14 - text.width / 2, top + BAR_HEIGHT / 2],
        ],
      });
    }
  });

  for (const b of spec.braces ?? []) {
    const xs = partX[b.bar];
    const top = tops[b.bar];
    if (!xs || top === undefined) continue;
    const x0 = (xs[b.from] ?? 0) + 1;
    const x1 = (xs[b.to + 1] ?? 0) - 1;
    const above = (b.side ?? "above") === "above";
    const dir = above ? -1 : 1;
    const y0 = above ? top - 5 : top + BAR_HEIGHT + 5;
    shapes.push(path(bracePath(x0, x1, y0, dir), { width: 1.4 }));
    obstacles.push({
      id: `brace ${plain(b.label)}`,
      rect: { x: x0, y: Math.min(y0, y0 + 9 * dir), w: x1 - x0, h: 9 },
    });
    extents.push({ x: x0, y: Math.min(y0, y0 + 9 * dir), w: x1 - x0, h: 9 });
    const text = label(b.label);
    const apex = y0 + 9 * dir;
    labels.push({
      id: `brace label ${b.label}`,
      text,
      candidates: [
        [(x0 + x1) / 2, apex + dir * (4 + text.height / 2)],
        [(x0 + x1) / 2, apex + dir * (10 + text.height / 2)],
      ],
    });
  }

  return {
    shapes: [`<g fill="none">${shapes.join("")}</g>`],
    bounds: union(extents),
    obstacles,
    labels,
    description,
    problems,
  };
}
