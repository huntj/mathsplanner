// Cartesian graphs: axes with nice tick spacing, grids, points, polygons, segments and curves.
// Curves are sampled densely and broken at asymptotes (1/x, tan x), then clipped to the axes.
import { compileExpression, ExpressionError, expressionToPlain } from "../expr.ts";
import { add, centroid, polylineSegments, scale, unit, type Rect } from "../geom.ts";
import type { LabelRequest, Obstacle } from "../labels.ts";
import type { Scene } from "../scene.ts";
import type { Axis, CartesianSpec, Coord } from "../spec.ts";
import { circle, line, polygon, polyline, type Point } from "../svg.ts";
import {
  aroundPoint,
  arrowhead,
  label,
  listJoin,
  numberLabel,
  numberPlain,
  plain,
  reach,
} from "./shared.ts";

const MAX_WIDTH = 360;
const MAX_HEIGHT = 300;
const MAX_TICKS = 25;
const SAMPLES = 600;

/** A tick spacing of 1, 2 or 5 × 10ⁿ giving at most 10 intervals. */
export function niceStep(range: number): number {
  const raw = range / 10;
  const power = 10 ** Math.floor(Math.log10(raw));
  for (const m of [1, 2, 5, 10]) if (m * power >= raw) return m * power;
  return 10 * power;
}

const stepOf = (a: Axis) => (a.step && a.step > 0 ? a.step : niceStep(a.max - a.min));

function ticks(a: Axis): number[] {
  const step = stepOf(a);
  const out: number[] = [];
  const first = Math.ceil(a.min / step - 1e-9);
  for (let i = first; i * step <= a.max + 1e-9 && out.length <= MAX_TICKS; i++)
    out.push(Number((i * step).toPrecision(12)));
  return out;
}

export function checkCartesian(spec: CartesianSpec): string[] {
  const problems: string[] = [];
  for (const [name, a] of [
    ["x", spec.x],
    ["y", spec.y],
  ] as const) {
    if (!(a.min < a.max)) problems.push(`${name}-axis runs from ${a.min} to ${a.max}`);
    if (a.step !== undefined && !(a.step > 0)) problems.push(`${name}-axis step must be positive`);
    else if ((a.max - a.min) / stepOf(a) > MAX_TICKS)
      problems.push(`${name}-axis has more than ${MAX_TICKS} ticks`);
  }
  const inside = ([x, y]: Coord) =>
    x >= spec.x.min - 1e-9 &&
    x <= spec.x.max + 1e-9 &&
    y >= spec.y.min - 1e-9 &&
    y <= spec.y.max + 1e-9;
  for (const p of spec.points ?? []) {
    if (!inside(p.at))
      problems.push(
        `point ${p.label ?? ""} (${p.at.join(", ")}) is outside the axes`.replace("  ", " "),
      );
  }
  for (const poly of spec.polygons ?? []) {
    if (poly.vertices.length < 2) problems.push("a polygon needs at least 2 vertices");
    for (const v of poly.vertices)
      if (!inside(v)) problems.push(`polygon vertex (${v.join(", ")}) is outside the axes`);
  }
  for (const s of spec.segments ?? []) {
    if (!inside(s.from) || !inside(s.to))
      problems.push(`segment (${s.from.join(", ")}) to (${s.to.join(", ")}) leaves the axes`);
  }
  for (const c of spec.curves ?? []) {
    try {
      compileExpression(c.y);
    } catch (error) {
      if (error instanceof ExpressionError) problems.push(error.message);
      else throw error;
    }
  }
  for (const v of spec.verticals ?? []) {
    if (!(v.x >= spec.x.min && v.x <= spec.x.max))
      problems.push(`line x = ${v.x} is outside the axes`);
  }
  return problems;
}

export function describeCartesian(spec: CartesianSpec): string {
  if (spec.description) return spec.description;
  const parts = [
    spec.axes === false
      ? `Square grid, ${numberPlain(spec.x.max - spec.x.min)} squares wide and ${numberPlain(spec.y.max - spec.y.min)} squares high.`
      : `Coordinate ${spec.grid === false ? "axes" : "grid"} with x from ${numberPlain(spec.x.min)} to ${numberPlain(spec.x.max)} and y from ${numberPlain(spec.y.min)} to ${numberPlain(spec.y.max)}.`,
  ];
  const coord = ([x, y]: Coord) => `(${numberPlain(x)}, ${numberPlain(y)})`;
  for (const p of spec.points ?? []) {
    parts.push(
      `${p.open ? "An open point" : "Point"}${p.label ? ` ${plain(p.label)}` : ""} at ${coord(p.at)}.`,
    );
  }
  for (const c of spec.curves ?? []) {
    parts.push(
      `Graph of y = ${expressionToPlain(c.y)}${c.degrees ? " (x in degrees)" : ""}${c.label ? `, labelled ${plain(c.label)}` : ""}.`,
    );
  }
  for (const v of spec.verticals ?? [])
    parts.push(`The line x = ${numberPlain(v.x)}${v.label ? `, labelled ${plain(v.label)}` : ""}.`);
  for (const s of spec.segments ?? []) {
    parts.push(
      `${s.arrow ? "An arrow" : "A line segment"} from ${coord(s.from)} to ${coord(s.to)}${s.label ? `, labelled ${plain(s.label)}` : ""}.`,
    );
  }
  for (const poly of spec.polygons ?? []) {
    parts.push(
      `A shape${poly.label ? ` labelled ${plain(poly.label)}` : ""} with vertices ${listJoin(poly.vertices.map(coord))}${poly.shaded ? ", shaded" : ""}.`,
    );
  }
  return parts.join(" ");
}

/** Samples a curve and splits it into drawable runs inside the y-range. */
function sampleCurve(
  f: (x: number) => number,
  x0: number,
  x1: number,
  yMin: number,
  yMax: number,
): Coord[][] {
  const yRange = yMax - yMin;
  const runs: Coord[][] = [];
  let run: Coord[] = [];
  let prev: Coord | undefined;
  const finish = () => {
    if (run.length > 1) runs.push(run);
    run = [];
  };
  const clampY = (y: number) => Math.min(yMax, Math.max(yMin, y));
  for (let i = 0; i <= SAMPLES; i++) {
    const x = x0 + ((x1 - x0) * i) / SAMPLES;
    const y = f(x);
    if (!Number.isFinite(y)) {
      finish();
      prev = undefined;
      continue;
    }
    const cur: Coord = [x, y];
    if (prev) {
      const [px, py] = prev;
      // A jump across most of the window with a sign change is an asymptote: do not join it.
      if (Math.abs(y - py) > 2 * yRange && Math.sign(y) !== Math.sign(py)) {
        finish();
        prev = cur;
        if (y >= yMin && y <= yMax) run.push(cur);
        continue;
      }
      const wasIn = py >= yMin && py <= yMax;
      const isIn = y >= yMin && y <= yMax;
      if (wasIn !== isIn || (!wasIn && !isIn && Math.sign(py - yMin) !== Math.sign(y - yMin))) {
        // Crossing the edge of the window: add the crossing point.
        const edge = wasIn ? (y > yMax ? yMax : yMin) : py > yMax ? yMax : yMin;
        const t = (edge - py) / (y - py);
        const crossing: Coord = [px + t * (x - px), clampY(edge)];
        if (wasIn) {
          run.push(crossing);
          finish();
        } else {
          run = [crossing];
        }
      }
      if (isIn) run.push(cur);
    } else if (y >= yMin && y <= yMax) {
      run.push(cur);
    }
    prev = cur;
  }
  finish();
  return runs;
}

export function layoutCartesian(spec: CartesianSpec): Scene {
  const problems = checkCartesian(spec);
  const description = describeCartesian(spec);
  const { x: X, y: Y } = spec;
  const xr = X.max - X.min || 1;
  const yr = Y.max - Y.min || 1;

  // Equal scales when the axes are comparable; otherwise stretch each axis to fit.
  const equal = stepOf(X) === stepOf(Y) && xr / yr < 2.5 && yr / xr < 2.5;
  const kx = equal ? Math.min(MAX_WIDTH / xr, MAX_HEIGHT / yr) : MAX_WIDTH / xr;
  const ky = equal ? kx : Math.min(MAX_HEIGHT, Math.max(160, MAX_WIDTH * 0.6)) / yr;
  const px = ([x, y]: Coord): Point => [(x - X.min) * kx, (Y.max - y) * ky];
  const plot: Rect = { x: 0, y: 0, w: xr * kx, h: yr * ky };

  const shapes: string[] = [];
  const obstacles: Obstacle[] = [];
  const labels: LabelRequest[] = [];
  const xTicks = ticks(X);
  const yTicks = ticks(Y);

  if (spec.grid !== false) {
    const grid: string[] = [];
    for (const t of xTicks) grid.push(line(px([t, Y.min]), px([t, Y.max]), { width: 1 }));
    for (const t of yTicks) grid.push(line(px([X.min, t]), px([X.max, t]), { width: 1 }));
    shapes.push(`<g stroke-opacity="0.22">${grid.join("")}</g>`);
  }

  // Plain squared grids (for symmetry and drawing) leave out the axes and their numbers.
  if (spec.axes !== false) {
    // Axes cross at the origin when it is in view, otherwise along the bottom and left edges.
    const ax = X.min <= 0 && X.max >= 0 ? 0 : X.min;
    const ay = Y.min <= 0 && Y.max >= 0 ? 0 : Y.min;
    const xAxis: [Point, Point] = [px([X.min, ay]), add(px([X.max, ay]), [12, 0])];
    const yAxis: [Point, Point] = [add(px([ax, Y.min]), [0, 0]), add(px([ax, Y.max]), [0, -12])];
    shapes.push(line(...xAxis), polyline(arrowhead(xAxis[1], [1, 0])));
    shapes.push(line(...yAxis), polyline(arrowhead(yAxis[1], [0, -1])));
    obstacles.push({ id: "x-axis", segment: xAxis }, { id: "y-axis", segment: yAxis });

    const xName = label(X.label ?? "x");
    labels.push({
      id: "x-axis name",
      text: xName,
      candidates: [
        add(xAxis[1], [6 + xName.width / 2, 0]),
        add(xAxis[1], [0, 8 + xName.height / 2]),
      ],
    });
    const yName = label(Y.label ?? "y");
    labels.push({
      id: "y-axis name",
      text: yName,
      candidates: [
        add(yAxis[1], [0, -6 - yName.height / 2]),
        add(yAxis[1], [8 + yName.width / 2, 0]),
      ],
    });

    const originShown = ax === 0 && ay === 0;
    for (const t of xTicks) {
      const p = px([t, ay]);
      shapes.push(line(add(p, [0, -4]), add(p, [0, 4]), { width: 1.2 }));
      if (originShown && t === 0) continue;
      const text = label(numberLabel(t));
      // Negative numbers sit a little left so the minus sign clears the tick.
      const dx = t < 0 ? -3 : 0;
      labels.push({
        id: `x tick ${t}`,
        text,
        candidates: [
          add(p, [dx, 7 + text.height / 2]),
          add(p, [dx + text.width / 2 + 3, 7 + text.height / 2]),
          add(p, [dx - text.width / 2 - 3, 7 + text.height / 2]),
          add(p, [dx, -7 - text.height / 2]),
          add(p, [dx + text.width / 2 + 3, -7 - text.height / 2]),
          add(p, [dx - text.width / 2 - 3, -7 - text.height / 2]),
        ],
        optional: true,
      });
    }
    for (const t of yTicks) {
      const p = px([ax, t]);
      shapes.push(line(add(p, [-4, 0]), add(p, [4, 0]), { width: 1.2 }));
      if (originShown && t === 0) continue;
      const text = label(numberLabel(t));
      labels.push({
        id: `y tick ${t}`,
        text,
        candidates: [
          add(p, [-7 - text.width / 2, 0]),
          add(p, [-7 - text.width / 2, -text.height / 2 - 1]),
          add(p, [-7 - text.width / 2, text.height / 2 + 1]),
          add(p, [7 + text.width / 2, 0]),
        ],
        optional: true,
      });
    }
    if (originShown) {
      const text = label("\\mathrm{O}");
      const o = px([0, 0]);
      labels.push({
        id: "origin",
        text,
        candidates: [add(o, [-6 - text.width / 2, 6 + text.height / 2])],
      });
    }
  }

  for (const v of spec.verticals ?? []) {
    const a = px([v.x, Y.min]);
    const b = px([v.x, Y.max]);
    shapes.push(line(a, b, { dashed: v.dashed, width: 2 }));
    obstacles.push({ id: `line x = ${v.x}`, segment: [a, b] });
    if (v.label) {
      const text = label(v.label);
      labels.push({
        id: `label x = ${v.x}`,
        text,
        candidates: [
          add(b, [6 + text.width / 2, text.height / 2 + 2]),
          add(b, [-6 - text.width / 2, text.height / 2 + 2]),
        ],
      });
    }
  }

  for (const poly of spec.polygons ?? []) {
    const pts = poly.vertices.map(px);
    shapes.push(
      poly.vertices.length > 2
        ? polygon(pts, { shaded: poly.shaded, dashed: poly.dashed, width: 2 })
        : polyline(pts, { width: 2 }),
    );
    for (const segment of polylineSegments(pts, pts.length > 2))
      obstacles.push({ id: `shape ${poly.label ?? ""}`.trim(), segment });
    if (poly.label) {
      const text = label(poly.label);
      const c = centroid(pts);
      labels.push({
        id: `shape label ${poly.label}`,
        text,
        candidates: [
          c,
          ...pts.map((p) =>
            add(
              p,
              scale(
                unit([p[0] - c[0], p[1] - c[1]]),
                8 + reach(text, unit([p[0] - c[0], p[1] - c[1]])),
              ),
            ),
          ),
        ],
      });
    }
  }

  for (const s of spec.segments ?? []) {
    const a = px(s.from);
    const b = px(s.to);
    shapes.push(line(a, b, { dashed: s.dashed, width: 2 }));
    if (s.arrow) shapes.push(polyline(arrowhead(b, [b[0] - a[0], b[1] - a[1]], 9), { width: 2 }));
    obstacles.push({ id: `segment to (${s.to.join(", ")})`, segment: [a, b] });
    if (s.label) {
      const text = label(s.label);
      const mid: Point = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      const n = unit([-(b[1] - a[1]), b[0] - a[0]]);
      const d = 6 + reach(text, n);
      labels.push({
        id: `segment label ${s.label}`,
        text,
        candidates: [add(mid, scale(n, d)), add(mid, scale(n, -d))],
      });
    }
  }

  for (const c of spec.curves ?? []) {
    let f: (x: number) => number;
    try {
      f = compileExpression(c.y, { degrees: c.degrees ?? false });
    } catch {
      continue; // reported by checkCartesian
    }
    const [d0, d1] = c.domain ?? [X.min, X.max];
    const runs = sampleCurve(f, Math.max(d0, X.min), Math.min(d1, X.max), Y.min, Y.max);
    for (const run of runs) {
      const pts = run.map(px);
      shapes.push(polyline(pts, { dashed: c.dashed, width: 2.2 }));
      for (const segment of polylineSegments(
        pts.filter((_, i) => i % 6 === 0 || i === pts.length - 1),
      )) {
        obstacles.push({ id: `curve y = ${c.y}`, segment });
      }
    }
    if (c.label) {
      const text = label(c.label);
      const longest = runs.reduce<Coord[]>((best, r) => (r.length > best.length ? r : best), []);
      const candidates: Point[] = [];
      for (const f2 of [0.9, 0.75, 0.6, 0.4, 0.2]) {
        const i = Math.floor((longest.length - 1) * f2);
        const p = longest[i];
        const q = longest[Math.min(longest.length - 1, i + 1)];
        if (!p || !q) continue;
        const a = px(p);
        const b = px(q);
        const n = unit([b[1] - a[1], -(b[0] - a[0])]);
        for (const side of [1, -1]) candidates.push(add(a, scale(n, side * (8 + reach(text, n)))));
      }
      labels.push({ id: `curve label ${c.label}`, text, candidates });
    }
  }

  for (const p of spec.points ?? []) {
    const c = px(p.at);
    shapes.push(
      p.open
        ? circle(c, 4, { width: 1.6 }).replace('fill="none"', 'fill="Canvas"')
        : circle(c, 4, { filled: true, width: 0 }),
    );
    obstacles.push({
      id: `point (${p.at.join(", ")})`,
      rect: { x: c[0] - 4, y: c[1] - 4, w: 8, h: 8 },
    });
    if (p.label) {
      const text = label(p.label);
      labels.push({
        id: `point label ${p.label}`,
        text,
        candidates: aroundPoint(c, [1, -1], text, 6),
      });
    }
  }

  return {
    frame: { origin: [-X.min * kx, Y.max * ky], scale: [kx, ky] },
    shapes: [`<g fill="none">${shapes.join("")}</g>`],
    bounds: { x: plot.x - 4, y: plot.y - 16, w: plot.w + 20, h: plot.h + 20 },
    obstacles,
    // Tick labels first: they have the fewest places to go.
    labels: [
      ...labels.filter((l) => l.id.includes("tick") || l.id === "origin"),
      ...labels.filter((l) => !(l.id.includes("tick") || l.id === "origin")),
    ],
    description,
    problems,
  };
}
