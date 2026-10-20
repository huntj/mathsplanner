// Number lines: any range and scale, tick labels, points (filled, open or arrowed), jumps for
// calculation strategies, and inequality intervals.
import { add, polylineSegments, type Rect } from "../geom.ts";
import type { LabelRequest, Obstacle } from "../labels.ts";
import type { Scene } from "../scene.ts";
import type { NumberLineSpec } from "../spec.ts";
import { circle, fmt, line, polyline, path, type Point } from "../svg.ts";
import { arrowhead, label, numberLabel, numberPlain, plain } from "./shared.ts";

const WIDTH = 400;
const MAX_TICKS = 50;

export function checkNumberLine(spec: NumberLineSpec): string[] {
  const problems: string[] = [];
  const { min, max, step } = spec;
  if (!(min < max)) problems.push(`number line runs from ${min} to ${max}`);
  if (!(step > 0)) problems.push(`step must be positive, not ${step}`);
  const count = (max - min) / step;
  if (step > 0 && Math.abs(count - Math.round(count)) > 1e-9) {
    problems.push(`step ${step} does not divide ${min} to ${max} evenly`);
  }
  if (count > MAX_TICKS) problems.push(`${Math.round(count)} major ticks is too many to read`);
  if (spec.minor !== undefined && !(Number.isInteger(spec.minor) && spec.minor >= 1)) {
    problems.push(`minor must be a whole number of divisions, not ${spec.minor}`);
  }
  const inRange = (v: number, what: string) => {
    if (!(v >= min - 1e-9 && v <= max + 1e-9))
      problems.push(`${what} ${v} is off the line (${min} to ${max})`);
  };
  for (const p of spec.points ?? []) inRange(p.value, "point");
  for (const j of spec.jumps ?? []) {
    inRange(j.from, "jump start");
    inRange(j.to, "jump end");
  }
  for (const r of spec.intervals ?? []) {
    if (r.from === undefined && r.to === undefined)
      problems.push("an interval needs at least one end");
    if (r.from !== undefined) inRange(r.from, "interval end");
    if (r.to !== undefined) inRange(r.to, "interval end");
    if (r.from !== undefined && r.to !== undefined && !(r.from < r.to)) {
      problems.push(`interval from ${r.from} to ${r.to} is empty`);
    }
  }
  if (Array.isArray(spec.labels)) for (const l of spec.labels) inRange(l.value, "tick label at");
  return problems;
}

export function describeNumberLine(spec: NumberLineSpec): string {
  if (spec.description) return spec.description;
  const parts = [
    `Number line from ${numberPlain(spec.min)} to ${numberPlain(spec.max)}, marked every ${numberPlain(spec.step)}` +
      (spec.minor && spec.minor > 1
        ? `, with each step split into ${spec.minor} smaller divisions.`
        : "."),
  ];
  if (spec.labels === "ends") parts.push("Only the ends are labelled.");
  if (spec.labels === "none") parts.push("The marks are not labelled.");
  if (Array.isArray(spec.labels)) {
    parts.push(
      `Labelled marks: ${spec.labels.map((l) => `${plain(l.label)} at ${numberPlain(l.value)}`).join(", ")}.`,
    );
  }
  for (const p of spec.points ?? []) {
    const kind = p.style === "open" ? "An open circle" : p.style === "arrow" ? "An arrow" : "A dot";
    parts.push(
      `${kind} at ${numberPlain(p.value)}${p.label ? `, labelled ${plain(p.label)}` : ""}.`,
    );
  }
  for (const j of spec.jumps ?? []) {
    parts.push(
      `A jump from ${numberPlain(j.from)} to ${numberPlain(j.to)}${j.label ? `, labelled ${plain(j.label)}` : ""}.`,
    );
  }
  for (const r of spec.intervals ?? []) {
    const from =
      r.from === undefined
        ? "the left end"
        : `${numberPlain(r.from)} (${r.fromIncluded ? "included" : "not included"})`;
    const to =
      r.to === undefined
        ? "the right end"
        : `${numberPlain(r.to)} (${r.toIncluded ? "included" : "not included"})`;
    parts.push(`An interval from ${from} to ${to}.`);
  }
  return parts.join(" ");
}

export function layoutNumberLine(spec: NumberLineSpec): Scene {
  const problems = checkNumberLine(spec);
  const description = describeNumberLine(spec);
  const { min, max } = spec;
  const step = spec.step > 0 ? spec.step : max - min || 1;
  const x = (v: number) => ((v - min) / (max - min || 1)) * WIDTH;
  const shapes: string[] = [];
  const obstacles: Obstacle[] = [];
  const labels: LabelRequest[] = [];
  const extents: Rect[] = [{ x: -8, y: -8, w: WIDTH + 16, h: 16 }];

  const unbounded = (spec.intervals ?? []).some((r) => r.from === undefined || r.to === undefined);
  const ends: [number, number] = unbounded ? [-18, WIDTH + 18] : [-8, WIDTH + 8];
  shapes.push(line([ends[0], 0], [ends[1], 0]));
  obstacles.push({
    id: "number line",
    segment: [
      [ends[0], 0],
      [ends[1], 0],
    ],
  });
  if (unbounded) {
    shapes.push(
      polyline(arrowhead([ends[1], 0], [1, 0])),
      polyline(arrowhead([ends[0], 0], [-1, 0])),
    );
  }

  const majors = Math.min(MAX_TICKS, Math.round((max - min) / step));
  const minor = spec.minor ?? 1;
  for (let i = 0; i <= majors; i++) {
    const v = min + i * step;
    const px = x(v);
    shapes.push(line([px, -7], [px, 7], { width: 1.4 }));
    if (i < majors && minor > 1) {
      for (let m = 1; m < minor; m++) {
        const mx = x(v + (m * step) / minor);
        shapes.push(line([mx, -4], [mx, 4], { width: 1 }));
      }
    }
    const show =
      spec.labels === undefined ||
      spec.labels === "all" ||
      (spec.labels === "ends" && (i === 0 || i === majors));
    if (show) {
      const text = label(numberLabel(v));
      labels.push({
        id: `tick label ${numberLabel(v)}`,
        text,
        candidates: [
          [px, 11 + text.height / 2],
          [px, 17 + text.height / 2],
        ],
      });
    }
  }
  if (Array.isArray(spec.labels)) {
    for (const l of spec.labels) {
      const text = label(l.label);
      labels.push({
        id: `tick label ${l.label}`,
        text,
        candidates: [
          [x(l.value), 11 + text.height / 2],
          [x(l.value), 18 + text.height / 2],
        ],
      });
    }
  }

  // Intervals stack above the line.
  (spec.intervals ?? []).forEach((r, i) => {
    const y = -20 - i * 16;
    const a = r.from === undefined ? ends[0] : x(r.from);
    const b = r.to === undefined ? ends[1] : x(r.to);
    shapes.push(line([a, y], [b, y], { width: 2.4 }));
    obstacles.push({
      id: "interval",
      segment: [
        [a, y],
        [b, y],
      ],
    });
    if (r.from === undefined) shapes.push(polyline(arrowhead([a, y], [-1, 0])));
    else
      shapes.push(
        circle([a, y], 4.5, { filled: r.fromIncluded ?? false }).replace(
          'fill="none"',
          'fill="Canvas"',
        ),
      );
    if (r.to === undefined) shapes.push(polyline(arrowhead([b, y], [1, 0])));
    else
      shapes.push(
        circle([b, y], 4.5, { filled: r.toIncluded ?? false }).replace(
          'fill="none"',
          'fill="Canvas"',
        ),
      );
    extents.push({ x: Math.min(a, b) - 6, y: y - 6, w: Math.abs(b - a) + 12, h: 12 });
  });

  // Jumps arc between values, above or below the line, with an arrowhead at the end.
  for (const j of spec.jumps ?? []) {
    const a = x(j.from);
    const b = x(j.to);
    const sign = j.side === "below" ? 1 : -1;
    // Jumps below the line start under the row of numbers.
    const base = sign > 0 ? 34 : -3;
    const h = sign * Math.min(36, Math.max(14, Math.abs(b - a) * 0.4));
    const start: Point = [a, base];
    const end: Point = [b, base];
    const control: Point = [(a + b) / 2, base + h * 2];
    shapes.push(
      path(
        `M ${fmt(start[0])} ${fmt(start[1])} Q ${fmt(control[0])} ${fmt(control[1])} ${fmt(end[0])} ${fmt(end[1])}`,
        { width: 1.4 },
      ),
    );
    const curve: Point[] = [];
    for (let t = 0; t <= 1.0001; t += 0.1) {
      curve.push([
        (1 - t) ** 2 * start[0] + 2 * (1 - t) * t * control[0] + t ** 2 * end[0],
        (1 - t) ** 2 * start[1] + 2 * (1 - t) * t * control[1] + t ** 2 * end[1],
      ]);
    }
    for (const segment of polylineSegments(curve))
      obstacles.push({ id: `jump ${j.from} to ${j.to}`, segment });
    shapes.push(
      polyline(arrowhead(end, [end[0] - control[0], end[1] - control[1]], 7), { width: 1.4 }),
    );
    const apex: Point = [(a + b) / 2, base + h];
    extents.push({
      x: Math.min(a, b),
      y: Math.min(base, base + h),
      w: Math.abs(b - a),
      h: Math.abs(h),
    });
    if (j.label) {
      const text = label(j.label);
      const off = sign * (4 + text.height / 2);
      labels.push({
        id: `jump label ${j.label}`,
        text,
        candidates: [
          add(apex, [0, off]),
          add(apex, [0, off + sign * 8]),
          add(apex, [0, off + sign * 18]),
        ],
      });
    }
  }

  for (const p of spec.points ?? []) {
    const px = x(p.value);
    if (p.style === "arrow") {
      const tip: Point = [px, -9];
      shapes.push(line([px, -30], tip, { width: 1.6 }), polyline(arrowhead(tip, [0, 1], 7)));
      obstacles.push({ id: `arrow at ${p.value}`, segment: [[px, -30], tip] });
      extents.push({ x: px - 5, y: -30, w: 10, h: 30 });
    } else {
      shapes.push(
        circle([px, 0], 5, { filled: p.style !== "open" }).replace('fill="none"', 'fill="Canvas"'),
      );
      obstacles.push({ id: `point at ${p.value}`, rect: { x: px - 5, y: -5, w: 10, h: 10 } });
    }
    if (p.label) {
      const text = label(p.label);
      const top = p.style === "arrow" ? -34 : -10;
      labels.push({
        id: `point label ${p.label}`,
        text,
        candidates: [
          [px, top - text.height / 2],
          [px - text.width / 2 - 4, top - text.height / 2],
          [px + text.width / 2 + 4, top - text.height / 2],
          [px, top - 10 - text.height / 2],
        ],
      });
    }
  }

  const bounds = extents.reduce((u, r) => {
    const x0 = Math.min(u.x, r.x);
    const y0 = Math.min(u.y, r.y);
    return {
      x: x0,
      y: y0,
      w: Math.max(u.x + u.w, r.x + r.w) - x0,
      h: Math.max(u.y + u.h, r.y + r.h) - y0,
    };
  });
  return {
    shapes: [`<g fill="none">${shapes.join("")}</g>`],
    bounds,
    obstacles,
    labels,
    description,
    problems,
  };
}
