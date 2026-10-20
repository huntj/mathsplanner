// Label placement: every label proposes candidate positions in priority order, and the solver
// picks a set with no overlaps between labels, lines and arcs. Overlaps it cannot avoid are
// reported, never hidden, so the quality checks can fail a generator on them.
import {
  inflate,
  overlapArea,
  rectsOverlap,
  segmentHitsRect,
  type Rect,
  type Segment,
} from "./geom.ts";
import type { Point } from "./svg.ts";
import type { TextBox } from "./text.ts";

export interface LabelRequest {
  /** Names the label in collision reports, e.g. "angle at B". */
  id: string;
  text: TextBox;
  /** Centre positions to try, best first. */
  candidates: Point[];
  /**
   * May be left out rather than overlap anything, like an axis number where a curve crosses
   * the axis. Required labels are never dropped.
   */
  optional?: boolean;
}

export type Obstacle = { id: string; segment: Segment } | { id: string; rect: Rect };

export interface Placement {
  id: string;
  rect: Rect;
  /** Index of the candidate used. */
  candidate: number;
  svg: string;
}

export interface Collision {
  label: string;
  with: string;
}

/** Breathing room kept around every label. */
const MARGIN = 2;

function rectAt(text: TextBox, [cx, cy]: Point): Rect {
  return { x: cx - text.width / 2, y: cy - text.height / 2, w: text.width, h: text.height };
}

function hitsObstacle(rect: Rect, o: Obstacle): boolean {
  return "segment" in o ? segmentHitsRect(o.segment, rect) : rectsOverlap(rect, o.rect);
}

export function placeLabels(
  requests: readonly LabelRequest[],
  obstacles: readonly Obstacle[],
): { placements: Placement[]; collisions: Collision[] } {
  const placed: { request: LabelRequest; rect: Rect; candidate: number }[] = [];
  const collisions: Collision[] = [];

  const blockedByObstacles = (rect: Rect) =>
    obstacles.filter((o) => hitsObstacle(inflate(rect, MARGIN), o));
  const blockingLabels = (rect: Rect, ignore?: number) =>
    placed.filter((p, i) => i !== ignore && rectsOverlap(inflate(rect, MARGIN), p.rect));

  for (const request of requests) {
    const rects = request.candidates.map((c) => rectAt(request.text, c));
    if (rects.length === 0) {
      collisions.push({ label: request.id, with: "nothing: no candidate positions" });
      continue;
    }

    // 1. The best candidate that is completely free.
    let choice = rects.findIndex(
      (r) => blockedByObstacles(r).length === 0 && blockingLabels(r).length === 0,
    );

    // 2. A candidate that is free of lines once labels in its way move to another free spot.
    if (choice < 0) {
      for (let c = 0; c < rects.length && choice < 0; c++) {
        const rect = rects[c] as Rect;
        if (blockedByObstacles(rect).length > 0) continue;
        const moves: [number, number, Rect][] = [];
        let ok = true;
        for (const blocker of blockingLabels(rect)) {
          const index = placed.indexOf(blocker);
          const alternatives = blocker.request.candidates.map((p) =>
            rectAt(blocker.request.text, p),
          );
          const alt = alternatives.findIndex(
            (r, k) =>
              k !== blocker.candidate &&
              !rectsOverlap(inflate(r, MARGIN), rect) &&
              blockedByObstacles(r).length === 0 &&
              blockingLabels(r, index).length === 0 &&
              moves.every(([, , m]) => !rectsOverlap(inflate(r, MARGIN), m)),
          );
          if (alt < 0) {
            ok = false;
            break;
          }
          moves.push([index, alt, alternatives[alt] as Rect]);
        }
        if (ok) {
          for (const [index, alt, r] of moves) {
            const moved = placed[index];
            if (moved) Object.assign(moved, { rect: r, candidate: alt });
          }
          choice = c;
        }
      }
    }

    // 3. An optional label that cannot be placed cleanly is left out.
    if (choice < 0 && request.optional) continue;

    // 4. Otherwise the least-bad candidate, with every overlap reported.
    if (choice < 0) {
      const penalty = (r: Rect) =>
        blockedByObstacles(r).length * 100 +
        blockingLabels(r).reduce((sum, p) => sum + 100 + overlapArea(r, p.rect), 0);
      choice = rects.reduce(
        (best, r, k) => (penalty(r) < penalty(rects[best] as Rect) ? k : best),
        0,
      );
      const rect = rects[choice] as Rect;
      const others = [
        ...blockedByObstacles(rect).map((o) => o.id),
        ...blockingLabels(rect).map((p) => p.request.id),
      ];
      for (const id of new Set(others)) collisions.push({ label: request.id, with: id });
    }

    placed.push({ request, rect: rects[choice] as Rect, candidate: choice });
  }

  return {
    placements: placed.map(({ request, rect, candidate }) => ({
      id: request.id,
      rect,
      candidate,
      svg: request.text.svg(rect.x, rect.y + request.text.ascent),
    })),
    collisions,
  };
}
