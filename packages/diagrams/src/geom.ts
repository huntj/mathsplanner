// Plane geometry helpers, in whatever units the caller uses.
import type { Point } from "./svg.ts";

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type Segment = [Point, Point];

export const add = (a: Point, b: Point): Point => [a[0] + b[0], a[1] + b[1]];
export const sub = (a: Point, b: Point): Point => [a[0] - b[0], a[1] - b[1]];
export const scale = (a: Point, k: number): Point => [a[0] * k, a[1] * k];
export const length = (a: Point): number => Math.hypot(a[0], a[1]);
export const distance = (a: Point, b: Point): number => length(sub(a, b));
export const midpoint = (a: Point, b: Point): Point => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
export const cross = (a: Point, b: Point): number => a[0] * b[1] - a[1] * b[0];
export const dot = (a: Point, b: Point): number => a[0] * b[0] + a[1] * b[1];

export function unit(a: Point): Point {
  const l = length(a);
  return l === 0 ? [0, 0] : [a[0] / l, a[1] / l];
}

/** Rotates anticlockwise by `radians` in a y-up frame. */
export function rotate(a: Point, radians: number): Point {
  const c = Math.cos(radians);
  const s = Math.sin(radians);
  return [a[0] * c - a[1] * s, a[0] * s + a[1] * c];
}

/** Direction angle in radians, anticlockwise from the positive x-axis (y up). */
export const direction = (a: Point): number => Math.atan2(a[1], a[0]);

/** The anticlockwise turn from direction a to direction b, in [0, 2π). */
export function turn(a: number, b: number): number {
  const t = (b - a) % (2 * Math.PI);
  return t < 0 ? t + 2 * Math.PI : t;
}

export const degrees = (radians: number): number => (radians * 180) / Math.PI;
export const radians = (deg: number): number => (deg * Math.PI) / 180;

export function centroid(list: readonly Point[]): Point {
  const sum = list.reduce<Point>((s, p) => add(s, p), [0, 0]);
  return scale(sum, 1 / Math.max(1, list.length));
}

export function inflate(r: Rect, by: number): Rect {
  return { x: r.x - by, y: r.y - by, w: r.w + 2 * by, h: r.h + 2 * by };
}

export function rectsOverlap(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
}

export function overlapArea(a: Rect, b: Rect): number {
  const w = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
  const h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
  return w > 0 && h > 0 ? w * h : 0;
}

/** Whether any part of the segment lies inside the rectangle (Liang-Barsky clipping). */
export function segmentHitsRect([p, q]: Segment, r: Rect): boolean {
  const dx = q[0] - p[0];
  const dy = q[1] - p[1];
  let t0 = 0;
  let t1 = 1;
  const checks: [number, number][] = [
    [-dx, p[0] - r.x],
    [dx, r.x + r.w - p[0]],
    [-dy, p[1] - r.y],
    [dy, r.y + r.h - p[1]],
  ];
  for (const [pp, qq] of checks) {
    if (pp === 0) {
      if (qq < 0) return false;
    } else {
      const t = qq / pp;
      if (pp < 0) {
        if (t > t1) return false;
        t0 = Math.max(t0, t);
      } else {
        if (t < t0) return false;
        t1 = Math.min(t1, t);
      }
    }
  }
  return t0 <= t1;
}

export function union(rects: readonly Rect[]): Rect {
  if (rects.length === 0) return { x: 0, y: 0, w: 0, h: 0 };
  const x0 = Math.min(...rects.map((r) => r.x));
  const y0 = Math.min(...rects.map((r) => r.y));
  const x1 = Math.max(...rects.map((r) => r.x + r.w));
  const y1 = Math.max(...rects.map((r) => r.y + r.h));
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

export function boundsOf(list: readonly Point[]): Rect {
  return union(list.map(([x, y]) => ({ x, y, w: 0, h: 0 })));
}

/** Points along an arc (SVG frame, y down), for drawing and as collision obstacles. */
export function arcPoints(c: Point, r: number, start: number, sweep: number, steps = 16): Point[] {
  const out: Point[] = [];
  for (let i = 0; i <= steps; i++) {
    const a = start + (sweep * i) / steps;
    out.push([c[0] + r * Math.cos(a), c[1] - r * Math.sin(a)]);
  }
  return out;
}

export function polylineSegments(list: readonly Point[], closed = false): Segment[] {
  const segs: Segment[] = [];
  for (let i = 0; i + 1 < list.length; i++) segs.push([list[i] as Point, list[i + 1] as Point]);
  if (closed && list.length > 2) segs.push([list[list.length - 1] as Point, list[0] as Point]);
  return segs;
}
