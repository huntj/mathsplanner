// Geometry: points, segments, polygons, circles and angles, drawn to scale from maths
// coordinates. Truth checks compare every stated angle, length, equal mark and parallel mark
// with the drawing, so a diagram cannot quietly contradict its question.
import {
  add,
  arcPoints,
  boundsOf,
  centroid,
  cross,
  degrees,
  direction,
  distance,
  length,
  midpoint,
  polylineSegments,
  rotate,
  scale,
  sub,
  turn,
  union,
  unit,
  type Rect,
  type Segment,
} from "../geom.ts";
import type { LabelRequest, Obstacle } from "../labels.ts";
import type { Scene } from "../scene.ts";
import type { GeoAngle, GeometrySpec } from "../spec.ts";
import { circle, line, polygon as polygonSvg, polyline, type Point } from "../svg.ts";
import { aroundPoint, arrowhead, label, listJoin, plain, reach } from "./shared.ts";

const MAX_WIDTH = 340;
const MAX_HEIGHT = 250;
const ANGLE_TOLERANCE = 0.5; // degrees
const LENGTH_TOLERANCE = 0.01; // relative

const POLYGON_NAMES: Record<number, string> = {
  3: "Triangle",
  4: "Quadrilateral",
  5: "Pentagon",
  6: "Hexagon",
  7: "Heptagon",
  8: "Octagon",
  9: "Nonagon",
  10: "Decagon",
};

const angleName = (a: GeoAngle) => `angle ${a.from}${a.vertex}${a.to}`;

/** The angle in degrees, turning anticlockwise from the ray to `from` to the ray to `to`. */
function measuredAngle(spec: GeometrySpec, a: GeoAngle): number | undefined {
  const v = spec.points[a.vertex];
  const p = spec.points[a.from];
  const q = spec.points[a.to];
  if (!v || !p || !q) return undefined;
  return degrees(turn(direction(sub(p, v)), direction(sub(q, v))));
}

/** Truth checks on maths coordinates. */
export function checkGeometry(spec: GeometrySpec): string[] {
  const problems: string[] = [];
  const has = (name: string, where: string) => {
    if (spec.points[name]) return true;
    problems.push(`${where} uses point ${name}, which is not defined`);
    return false;
  };
  for (const [name, p] of Object.entries(spec.points)) {
    if (!p.every(Number.isFinite)) problems.push(`point ${name} has non-finite coordinates`);
  }
  for (const s of spec.segments ?? []) {
    if (has(s.from, `segment ${s.from}${s.to}`) && has(s.to, `segment ${s.from}${s.to}`)) {
      if (distance(spec.points[s.from] as Point, spec.points[s.to] as Point) === 0) {
        problems.push(`segment ${s.from}${s.to} has zero length`);
      }
    }
  }
  for (const poly of spec.polygons ?? []) {
    const name = poly.vertices.join("");
    if (poly.vertices.length < 3) problems.push(`polygon ${name} has fewer than 3 vertices`);
    if (!poly.vertices.every((v) => has(v, `polygon ${name}`))) continue;
    const pts = poly.vertices.map((v) => spec.points[v] as Point);
    const area = pts.reduce((s, p, i) => s + cross(p, pts[(i + 1) % pts.length] as Point), 0) / 2;
    if (Math.abs(area) < 1e-9) problems.push(`polygon ${name} has no area`);
  }
  for (const c of spec.circles ?? []) {
    has(c.centre, `circle ${c.centre}`);
    if (!(c.radius > 0)) problems.push(`circle with centre ${c.centre} has radius ${c.radius}`);
  }

  for (const a of spec.angles ?? []) {
    if (![a.vertex, a.from, a.to].every((p) => has(p, angleName(a)))) continue;
    const measured = measuredAngle(spec, a) ?? 0;
    if (a.right && Math.abs(measured - 90) > ANGLE_TOLERANCE) {
      problems.push(
        `${angleName(a)} is marked as a right angle but drawn as ${measured.toFixed(1)}°`,
      );
    }
    if (a.right && a.value !== undefined && a.value !== 90) {
      problems.push(`${angleName(a)} is marked as a right angle but stated as ${a.value}°`);
    }
    if (
      !spec.notToScale &&
      a.value !== undefined &&
      Math.abs(measured - a.value) > ANGLE_TOLERANCE
    ) {
      problems.push(
        `${angleName(a)} is stated as ${a.value}° but drawn as ${measured.toFixed(1)}°`,
      );
    }
  }

  const known = (s: { from: string; to: string }) => spec.points[s.from] && spec.points[s.to];
  const segLength = (s: { from: string; to: string }) =>
    distance(spec.points[s.from] as Point, spec.points[s.to] as Point);

  if (!spec.notToScale) {
    // Stated lengths share one scale.
    const stated = (spec.segments ?? []).filter((s) => s.length !== undefined && known(s));
    const first = stated[0];
    if (first && first.length !== undefined) {
      const ratio = segLength(first) / first.length;
      for (const s of stated.slice(1)) {
        const expected = (s.length ?? 0) * ratio;
        if (Math.abs(segLength(s) - expected) > LENGTH_TOLERANCE * expected) {
          problems.push(
            `${s.from}${s.to} is stated as ${s.length} but drawn in proportion to ${(segLength(s) / ratio).toFixed(2)} (scale set by ${first.from}${first.to})`,
          );
        }
      }
    }
    // Equal tick marks mean equal lengths.
    const byTicks = new Map<number, { from: string; to: string }[]>();
    for (const s of spec.segments ?? []) {
      if (s.ticks && known(s)) byTicks.set(s.ticks, [...(byTicks.get(s.ticks) ?? []), s]);
    }
    for (const group of byTicks.values()) {
      const base = segLength(group[0] as { from: string; to: string });
      for (const s of group.slice(1)) {
        if (Math.abs(segLength(s) - base) > LENGTH_TOLERANCE * base) {
          problems.push(
            `${s.from}${s.to} is marked equal to ${group[0]?.from}${group[0]?.to} but is drawn a different length`,
          );
        }
      }
    }
  } else {
    // Not to scale: the stated numbers must still be consistent with each other.
    for (const poly of spec.polygons ?? []) {
      const n = poly.vertices.length;
      const interior = poly.vertices.map((v, i) => {
        const prev = poly.vertices[(i + n - 1) % n];
        const next = poly.vertices[(i + 1) % n];
        return (spec.angles ?? []).find(
          (a) =>
            a.vertex === v &&
            ((a.from === prev && a.to === next) || (a.from === next && a.to === prev)),
        );
      });
      const values = interior.map((a) => (a?.right ? 90 : a?.value));
      if (values.every((v) => v !== undefined)) {
        const sum = values.reduce<number>((s, v) => s + (v ?? 0), 0);
        if (Math.abs(sum - (n - 2) * 180) > 1e-6) {
          problems.push(
            `the angles of ${poly.vertices.join("")} are stated to add up to ${sum}°, not ${(n - 2) * 180}°`,
          );
        }
      }
    }
  }

  // Parallel arrows mean parallel lines, to scale or not.
  const byArrows = new Map<number, { from: string; to: string }[]>();
  for (const s of spec.segments ?? []) {
    if (s.arrows && known(s)) byArrows.set(s.arrows, [...(byArrows.get(s.arrows) ?? []), s]);
  }
  for (const group of byArrows.values()) {
    const d0 = unit(
      sub(spec.points[group[0]?.to ?? ""] as Point, spec.points[group[0]?.from ?? ""] as Point),
    );
    for (const s of group.slice(1)) {
      const d = unit(sub(spec.points[s.to] as Point, spec.points[s.from] as Point));
      if (Math.abs(cross(d0, d)) > Math.sin((ANGLE_TOLERANCE * Math.PI) / 180)) {
        problems.push(
          `${s.from}${s.to} is marked parallel to ${group[0]?.from}${group[0]?.to} but is not drawn parallel`,
        );
      }
    }
  }
  return problems;
}

export function describeGeometry(spec: GeometrySpec): string {
  if (spec.description) return spec.description;
  const parts: string[] = [];
  if (spec.notToScale) parts.push("Diagram not drawn to scale.");
  const polygonSides = new Set<string>();
  for (const poly of spec.polygons ?? []) {
    const n = poly.vertices.length;
    parts.push(
      `${POLYGON_NAMES[n] ?? "Polygon"} ${poly.vertices.join("")}${poly.shaded ? ", shaded" : ""}.`,
    );
    poly.vertices.forEach((v, i) => {
      const w = poly.vertices[(i + 1) % n] ?? "";
      polygonSides.add(v + w);
      polygonSides.add(w + v);
    });
  }
  for (const s of spec.segments ?? []) {
    const name = `${s.from}${s.to}`;
    if (!polygonSides.has(name))
      parts.push(s.extend ? `A line through ${s.from} and ${s.to}.` : `Line segment ${name}.`);
    if (s.label) parts.push(`${name} is labelled ${plain(s.label)}.`);
  }
  for (const c of spec.circles ?? []) {
    parts.push(`A circle with centre ${c.centre}${c.label ? `, labelled ${plain(c.label)}` : ""}.`);
  }
  for (const a of spec.angles ?? []) {
    const name = `Angle ${a.from}${a.vertex}${a.to}`;
    if (a.turn) {
      parts.push(
        `An arrow shows a turn ${a.turn} from ${a.from} to ${a.to}${a.label ? `, labelled ${plain(a.label)}` : ""}.`,
      );
    } else if (a.right) parts.push(`${name} is a right angle.`);
    else if (a.label) parts.push(`${name} is labelled ${plain(a.label)}.`);
    else if (a.value !== undefined) parts.push(`${name} is ${a.value}°.`);
  }
  const groups = (key: "ticks" | "arrows") => {
    const map = new Map<number, string[]>();
    for (const s of spec.segments ?? []) {
      const k = s[key];
      if (k) map.set(k, [...(map.get(k) ?? []), `${s.from}${s.to}`]);
    }
    return [...map.values()].filter((g) => g.length > 1);
  };
  for (const g of groups("ticks")) parts.push(`${listJoin(g)} are marked as equal.`);
  for (const g of groups("arrows")) parts.push(`${listJoin(g)} are marked as parallel.`);
  return parts.join(" ") || "Geometry diagram.";
}

export function layoutGeometry(spec: GeometrySpec): Scene {
  const problems = checkGeometry(spec);
  const description = describeGeometry(spec);

  // Fit the figure (including circles) into the target size, keeping it to scale.
  const extents: Point[] = Object.values(spec.points);
  for (const c of spec.circles ?? []) {
    const o = spec.points[c.centre];
    if (o) extents.push(add(o, [-c.radius, -c.radius]), add(o, [c.radius, c.radius]));
  }
  const fit = boundsOf(extents.length ? extents : [[0, 0]]);
  const k = Math.min(MAX_WIDTH / (fit.w || 1), MAX_HEIGHT / (fit.h || 1));
  const px = (p: Point): Point => [(p[0] - fit.x) * k, (fit.y + fit.h - p[1]) * k];
  const P = (name: string): Point | undefined => {
    const p = spec.points[name];
    return p && px(p);
  };

  const shapes: string[] = [];
  const obstacles: Obstacle[] = [];
  const labels: LabelRequest[] = [];
  const drawn: Point[] = [];
  /** Directions (px) of lines leaving each point, to place its name outside them. */
  const spokes = new Map<string, Point[]>();
  const addSpoke = (name: string, toward: Point) => {
    const from = P(name);
    if (!from) return;
    spokes.set(name, [...(spokes.get(name) ?? []), unit(sub(toward, from))]);
  };
  const addSegments = (id: string, segs: Segment[]) => {
    for (const segment of segs) obstacles.push({ id, segment });
  };

  const allCentre = centroid(Object.values(spec.points).map(px));

  for (const poly of spec.polygons ?? []) {
    const pts = poly.vertices.map(P);
    if (pts.some((p) => !p)) continue;
    const list = pts as Point[];
    shapes.push(polygonSvg(list, { shaded: poly.shaded }));
    addSegments(`side of ${poly.vertices.join("")}`, polylineSegments(list, true));
    drawn.push(...list);
    poly.vertices.forEach((v, i) => {
      const n = poly.vertices.length;
      addSpoke(v, list[(i + 1) % n] as Point);
      addSpoke(v, list[(i + n - 1) % n] as Point);
    });
  }

  /** Centroid of the polygon a segment is a side of, for "outward". */
  const polygonCentreFor = (a: string, b: string): Point | undefined => {
    for (const poly of spec.polygons ?? []) {
      const n = poly.vertices.length;
      const isSide = poly.vertices.some(
        (v, i) =>
          (v === a && poly.vertices[(i + 1) % n] === b) ||
          (v === b && poly.vertices[(i + 1) % n] === a),
      );
      if (isSide) return centroid(poly.vertices.map(P).filter((p): p is Point => p !== undefined));
    }
    return undefined;
  };

  for (const s of spec.segments ?? []) {
    let a = P(s.from);
    let b = P(s.to);
    if (!a || !b) continue;
    const id = `${s.from}${s.to}`;
    const along = unit(sub(b, a));
    if (s.extend) {
      const extra = Math.max(24, 0.2 * distance(a, b));
      a = add(a, scale(along, -extra));
      b = add(b, scale(along, extra));
    }
    shapes.push(line(a, b, { dashed: s.dashed }));
    if (s.arrow) {
      const head = arrowhead(b, along, 10);
      shapes.push(polyline(head));
      addSegments(`arrow on ${id}`, polylineSegments(head));
    }
    addSegments(`line ${id}`, [[a, b]]);
    drawn.push(a, b);
    const pa = P(s.from) as Point;
    const pb = P(s.to) as Point;
    addSpoke(s.from, pb);
    addSpoke(s.to, pa);
    if (s.extend) {
      addSpoke(s.from, a);
      addSpoke(s.to, b);
    }

    const mid = midpoint(pa, pb);
    const normal: Point = [-along[1], along[0]];
    if (s.ticks) {
      for (let t = 0; t < s.ticks; t++) {
        const c = add(mid, scale(along, (t - (s.ticks - 1) / 2) * 4));
        const tick: Segment = [add(c, scale(normal, -5)), add(c, scale(normal, 5))];
        shapes.push(line(tick[0], tick[1], { width: 1.4 }));
        obstacles.push({ id: `ticks on ${id}`, segment: tick });
      }
    }
    if (s.arrows) {
      for (let t = 0; t < s.arrows; t++) {
        const tip = add(mid, scale(along, 3 + (t - (s.arrows - 1) / 2) * 6));
        const back = scale(along, -6);
        const chevron: Point[] = [
          add(tip, add(back, scale(normal, 4.5))),
          tip,
          add(tip, add(back, scale(normal, -4.5))),
        ];
        shapes.push(polyline(chevron, { width: 1.4 }));
        addSegments(`arrows on ${id}`, polylineSegments(chevron));
      }
    }
    if (s.label) {
      const text = label(s.label);
      const centre = polygonCentreFor(s.from, s.to) ?? allCentre;
      // The side of the segment away from the shape's centre.
      const outward: Point =
        normal[0] * (mid[0] - centre[0]) + normal[1] * (mid[1] - centre[1]) >= 0
          ? normal
          : scale(normal, -1);
      const gap = 6 + reach(text, outward);
      const candidates: Point[] = [];
      for (const extra of [0, 6, 14]) {
        candidates.push(add(mid, scale(outward, gap + extra)));
        for (const t of [-0.2, 0.2]) {
          candidates.push(add(add(mid, scale(sub(pb, pa), t)), scale(outward, gap + extra)));
        }
      }
      for (const extra of [0, 6]) candidates.push(add(mid, scale(outward, -(gap + extra))));
      labels.push({ id: `label of ${id}`, text, candidates });
    }
  }

  for (const c of spec.circles ?? []) {
    const o = P(c.centre);
    if (!o) continue;
    const r = c.radius * k;
    shapes.push(circle(o, r, { dashed: c.dashed }));
    if (c.label) {
      const text = label(c.label);
      // Just outside the circle, trying the top right first.
      const candidates: Point[] = [45, 135, 315, 225, 90, 0, 180, 270].map((deg) => {
        const u: Point = [Math.cos((deg * Math.PI) / 180), -Math.sin((deg * Math.PI) / 180)];
        return add(o, scale(u, r + 6 + reach(text, u)));
      });
      labels.push({ id: `label of circle ${c.centre}`, text, candidates });
    }
    addSegments(`circle centre ${c.centre}`, polylineSegments(arcPoints(o, r, 0, 2 * Math.PI, 48)));
    drawn.push(add(o, [-r, -r]), add(o, [r, r]));
  }

  for (const a of spec.angles ?? []) {
    const v = P(a.vertex);
    const p = P(a.from);
    const q = P(a.to);
    if (!v || !p || !q) continue;
    // Directions in the maths frame (y up), which arcPoints expects.
    const d1 = Math.atan2(-(p[1] - v[1]), p[0] - v[0]);
    const sweep = turn(d1, Math.atan2(-(q[1] - v[1]), q[0] - v[0]));
    const shortest = Math.min(distance(v, p), distance(v, q));
    const id = angleName(a);
    let reachOut: number;
    if (a.right) {
      const s = Math.min(12, shortest * 0.3);
      const u1: Point = unit(sub(p, v));
      const u2: Point = unit(sub(q, v));
      const square: Point[] = [
        add(v, scale(u1, s)),
        add(v, add(scale(u1, s), scale(u2, s))),
        add(v, scale(u2, s)),
      ];
      shapes.push(polyline(square, { width: 1.4 }));
      addSegments(id, polylineSegments(square));
      reachOut = s * 1.5;
    } else {
      // Small angles get a larger arc, so their label has room.
      const deg = degrees(sweep);
      const base = deg < 40 ? 22 + (40 - deg) * 0.7 : deg > 200 ? 16 : 20;
      // Turn arrows are drawn large: the turn itself is what the student has to read.
      const r = a.turn
        ? Math.max(28, shortest * 0.35)
        : Math.max(10, Math.min(base, shortest * 0.45));
      const arcs = a.arcs ?? 1;
      for (let n = 0; n < arcs; n++) {
        const pts = arcPoints(v, r + n * 4, d1, sweep, Math.max(8, Math.ceil(degrees(sweep) / 6)));
        shapes.push(polyline(pts, { width: 1.4 }));
        drawn.push(...pts);
        addSegments(id, polylineSegments(pts));
        if (a.turn && n === 0) {
          // The arrowhead points along the arc in the direction of the turn.
          const [tip, before] =
            a.turn === "anticlockwise"
              ? [pts[pts.length - 1], pts[pts.length - 2]]
              : [pts[0], pts[1]];
          if (tip && before) {
            const head = arrowhead(tip, sub(tip, before), 8);
            shapes.push(polyline(head, { width: 1.4 }));
            addSegments(id, polylineSegments(head));
          }
        }
      }
      reachOut = r + (arcs - 1) * 4;
    }
    const text = a.label ?? (a.value !== undefined && !a.right ? `${a.value}^\\circ` : undefined);
    if (text) {
      const box = label(text);
      const candidates: Point[] = [];
      // Further out the wedge is wider; far positions are only used when nearer ones are blocked.
      const distances = [4, 10, 18, 28, 45, 70, 100, 130];
      for (const extra of distances) {
        for (const f of [0.5, 0.35, 0.65]) {
          const b = d1 + sweep * f;
          const u: Point = [Math.cos(b), -Math.sin(b)];
          candidates.push(add(v, scale(u, reachOut + extra + reach(box, u))));
        }
      }
      labels.push({ id: `label of ${id}`, text: box, candidates });
    }
  }

  for (const name of spec.dots ?? []) {
    const p = P(name);
    if (!p) continue;
    shapes.push(circle(p, 3, { filled: true, width: 0 }));
    obstacles.push({ id: `dot ${name}`, rect: { x: p[0] - 3, y: p[1] - 3, w: 6, h: 6 } });
    drawn.push(p);
  }

  const named = spec.pointLabels === true ? Object.keys(spec.points) : spec.pointLabels || [];
  for (const name of named) {
    const p = P(name);
    if (!p) continue;
    drawn.push(p);
    const dirs = spokes.get(name) ?? [];
    const sum = dirs.reduce<Point>((s, d) => add(s, d), [0, 0]);
    // Away from the lines that meet here; for a point in the middle of a straight line, go sideways.
    let away: Point =
      length(sum) > 0.3
        ? scale(sum, -1)
        : dirs[0]
          ? rotate(dirs[0], Math.PI / 2)
          : sub(p, allCentre);
    if (length(away) === 0) away = [0, -1];
    const text = label(spec.names?.[name] ?? `\\mathrm{${name}}`);
    labels.push({ id: `point ${name}`, text, candidates: aroundPoint(p, away, text, 5) });
  }

  const bounds: Rect = union([boundsOf(drawn.length ? drawn : [[0, 0]])]);
  return {
    shapes: [`<g fill="none">${shapes.join("")}</g>`],
    bounds,
    obstacles,
    // Point names first: they have the least room to move.
    labels: [
      ...labels.filter((l) => l.id.startsWith("point ")),
      ...labels.filter((l) => !l.id.startsWith("point ")),
    ],
    ...(spec.notToScale ? { caption: "Not drawn to scale" } : {}),
    description,
    problems,
  };
}
