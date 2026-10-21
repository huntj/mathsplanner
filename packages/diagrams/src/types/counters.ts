// Counters: countable pictures for early number. Dots and objects (in a dice pattern, a row or
// scattered), ten frames, arrays, place-value charts with counters or base-10 blocks, part-whole
// models, fingers and tally marks. Every count is checked, and the default description states the
// counts; a generator asking "how many?" sets its own description so it does not give the answer.
import type { Rect } from "../geom.ts";
import type { Scene } from "../scene.ts";
import type { CounterArrangement, CounterShape, CountersSpec } from "../spec.ts";
import { circle, fmt, line, path, polygon, type Point } from "../svg.ts";
import { layoutLabel } from "../text.ts";
import { listJoin, plain } from "./shared.ts";

const R = 13;
const CELL = 2 * R + 9;
const MAX_OBJECTS = 40;

const isCount = (n: unknown, max: number) =>
  Number.isInteger(n) && (n as number) >= 0 && (n as number) <= max;
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

/** Column values for common place-value headings, so counters can show them. */
const PLACE_VALUES: Record<string, string> = {
  M: "1\\,000\\,000",
  HTh: "100\\,000",
  TTh: "10\\,000",
  Th: "1000",
  H: "100",
  T: "10",
  O: "1",
  t: "0.1",
  h: "0.01",
  th: "0.001",
};

export function checkCounters(spec: CountersSpec): string[] {
  const problems: string[] = [];
  switch (spec.layout) {
    case "objects": {
      if (spec.counts.length < 1 || spec.counts.length > 2)
        problems.push("objects take one or two counts (filled, then outlined)");
      if (!spec.counts.every((c) => isCount(c, MAX_OBJECTS)))
        problems.push(`object counts must be whole numbers from 0 to ${MAX_OBJECTS}`);
      const total = spec.counts.reduce((s, c) => s + c, 0);
      if (total < 1 || total > MAX_OBJECTS)
        problems.push(`there must be 1 to ${MAX_OBJECTS} objects, not ${total}`);
      break;
    }
    case "ten-frame":
      if (spec.frames.length < 1 || spec.frames.length > 10)
        problems.push("there must be 1 to 10 ten frames");
      if (!spec.frames.every((f) => isCount(f, 10)))
        problems.push("each ten frame holds 0 to 10 counters");
      if (
        spec.second &&
        (spec.second.length !== spec.frames.length ||
          spec.second.some((s, i) => !isCount(s, spec.frames[i] ?? 0)))
      )
        problems.push("second-colour counts must match the frames and not exceed their counters");
      break;
    case "array":
      if (
        !isCount(spec.rows, 12) ||
        !isCount(spec.columns, 12) ||
        spec.rows < 1 ||
        spec.columns < 1
      )
        problems.push("an array has 1 to 12 rows and columns");
      break;
    case "place-value":
      if (spec.columns.length < 1 || spec.columns.length > 8)
        problems.push("a place-value chart has 1 to 8 columns");
      if (spec.counts.length !== spec.columns.length)
        problems.push("give one count for each place-value column");
      if (!spec.counts.every((c) => isCount(c, 20)))
        problems.push("each place-value column holds 0 to 20 counters");
      if (spec.values && spec.values.length !== spec.columns.length)
        problems.push("give one value for each place-value column");
      if (
        spec.style === "blocks" &&
        !spec.columns.every((c) => c === "H" || c === "T" || c === "O")
      )
        problems.push("base-10 blocks are drawn for H, T and O columns only");
      break;
    case "part-whole":
      if (spec.parts.length < 2 || spec.parts.length > 4)
        problems.push("a part-whole model has 2 to 4 parts");
      break;
    case "fingers":
      if (!isCount(spec.count, 10)) problems.push("fingers show 0 to 10");
      break;
    case "pattern":
      if (spec.items.length < 2 || spec.items.length > 16)
        problems.push("a pattern has 2 to 16 items");
      break;
    case "tally":
      if (!isCount(spec.count, 50)) problems.push("tally marks show 0 to 50");
      break;
  }
  return problems;
}

export function describeCounters(spec: CountersSpec): string {
  if (spec.description) return spec.description;
  switch (spec.layout) {
    case "objects": {
      const shape = spec.shape ?? "circle";
      const word = shape === "circle" ? "counter" : shape;
      const total = spec.counts.reduce((s, c) => s + c, 0);
      const where = { dice: " in a dice pattern", row: " in a row", scatter: ", scattered" }[
        spec.arrangement ?? "row"
      ];
      const colours =
        spec.counts.length === 2 ? `: ${spec.counts[0]} filled and ${spec.counts[1]} outlined` : "";
      return `${plural(total, word)}${where}${colours}.`;
    }
    case "ten-frame":
      return `${plural(spec.frames.length, "ten frame")}: ${listJoin(
        spec.frames.map((f, i) => {
          const second = spec.second?.[i] ?? 0;
          return second
            ? `${f} counters (${f - second} filled, ${second} outlined)`
            : plural(f, "counter");
        }),
      )}.`;
    case "array":
      return `An array of counters in ${plural(spec.rows, "row")} and ${plural(spec.columns, "column")}.`;
    case "place-value":
      return `A place-value chart with columns ${listJoin(spec.columns.map((c) => plain(heading(c))))}, holding ${listJoin(
        spec.counts.map((c, i) => `${c} in ${plain(heading(spec.columns[i] ?? ""))}`),
      )}${spec.style === "blocks" ? ", drawn as base-10 blocks" : " counters"}.`;
    case "part-whole":
      return `A part-whole model: the whole is ${plain(spec.whole)} and the parts are ${listJoin(spec.parts.map(plain))}.`;
    case "fingers":
      return `${spec.count > 5 ? "Two hands" : "A hand"} showing ${plural(spec.count, "finger")}.`;
    case "tally":
      return `${plural(spec.count, "tally mark")}.`;
    case "pattern":
      return `A row of shapes: ${spec.items
        .map((it) => (it ? `${it.filled === false ? "outlined" : "filled"} ${it.shape}` : "a gap"))
        .join(", ")}.`;
  }
}

/** Plain headings as text; LaTeX headings as they are. */
const heading = (h: string) => (h.includes("\\") ? h : `\\text{${h}}`);

/** Text drawn straight into the picture, centred on (x, y). */
function text(latex: string, x: number, y: number, size: number): string {
  const box = layoutLabel(latex, size);
  return `<g fill="currentColor">${box.svg(x - box.width / 2, y + box.ascent / 2 - 1)}</g>`;
}

function counter(at: Point, shape: CounterShape, filled: boolean, r = R): string {
  const options = { filled, width: filled ? 1.4 : 2.2 };
  const [x, y] = at;
  switch (shape) {
    case "circle":
      return circle(at, r, options);
    case "square":
      return `<rect x="${fmt(x - r * 0.85)}" y="${fmt(y - r * 0.85)}" width="${fmt(1.7 * r)}" height="${fmt(1.7 * r)}" rx="2" fill="${filled ? "currentColor" : "none"}" stroke="currentColor" stroke-width="${fmt(options.width)}"/>`;
    case "triangle":
      return `<polygon points="${fmt(x)},${fmt(y - r)} ${fmt(x + r)},${fmt(y + 0.8 * r)} ${fmt(x - r)},${fmt(y + 0.8 * r)}" fill="${filled ? "currentColor" : "none"}" stroke="currentColor" stroke-width="${fmt(options.width)}" stroke-linejoin="round"/>`;
    case "star": {
      const pts: string[] = [];
      for (let k = 0; k < 10; k++) {
        const a = -Math.PI / 2 + (k * Math.PI) / 5;
        const rr = k % 2 === 0 ? r * 1.05 : r * 0.45;
        pts.push(`${fmt(x + rr * Math.cos(a))},${fmt(y + rr * Math.sin(a))}`);
      }
      return `<polygon points="${pts.join(" ")}" fill="${filled ? "currentColor" : "none"}" stroke="currentColor" stroke-width="${fmt(options.width)}" stroke-linejoin="round"/>`;
    }
  }
}

/** Positions for n counters on a die face (1 to 6), centred on the origin. */
function dieFace(n: number): Point[] {
  const d = 24;
  const spots: Record<number, Point[]> = {
    1: [[0, 0]],
    2: [
      [-d, -d],
      [d, d],
    ],
    3: [
      [-d, -d],
      [0, 0],
      [d, d],
    ],
    4: [
      [-d, -d],
      [d, -d],
      [-d, d],
      [d, d],
    ],
    5: [
      [-d, -d],
      [d, -d],
      [0, 0],
      [-d, d],
      [d, d],
    ],
    6: [
      [-d, -d],
      [d, -d],
      [-d, 0],
      [d, 0],
      [-d, d],
      [d, d],
    ],
  };
  return spots[n] ?? [];
}

/** A small deterministic random source, so scattered counters are the same every time. */
function random(seed: number): () => number {
  let s = (seed * 2654435761) >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 10000) / 10000;
  };
}

function positions(n: number, arrangement: CounterArrangement, seed: number): Point[] {
  if (arrangement === "dice" && n <= 10) {
    // Up to 6 on one die; 7 to 10 as a full five and the rest, side by side.
    if (n <= 6) return dieFace(n);
    return [
      ...dieFace(5).map(([x, y]): Point => [x - 40, y]),
      ...dieFace(n - 5).map(([x, y]): Point => [x + 40, y]),
    ];
  }
  if (arrangement === "scatter") {
    // A jittered grid with spare cells, filled in a shuffled order.
    const side = Math.ceil(Math.sqrt(n * 1.8));
    const cells = Array.from({ length: side * side }, (_, i) => i);
    const next = random(seed + n);
    for (let i = cells.length - 1; i > 0; i--) {
      const j = Math.floor(next() * (i + 1));
      [cells[i], cells[j]] = [cells[j] ?? 0, cells[i] ?? 0];
    }
    const step = CELL + 6;
    return cells
      .slice(0, n)
      .map((c) => [
        (c % side) * step + (next() - 0.5) * 8,
        Math.floor(c / side) * step + (next() - 0.5) * 8,
      ]);
  }
  // A row, wrapping after ten.
  return Array.from({ length: n }, (_, i): Point => [(i % 10) * CELL, Math.floor(i / 10) * CELL]);
}

const box = (x: number, y: number, w: number, h: number): Rect => ({ x, y, w, h });

function layoutObjects(
  spec: Extract<CountersSpec, { layout: "objects" }>,
  shapes: string[],
  extents: Rect[],
) {
  const total = spec.counts.reduce((s, c) => s + c, 0);
  const shape = spec.shape ?? "circle";
  const at = positions(total, spec.arrangement ?? "row", spec.seed ?? 0);
  at.forEach((p, i) => {
    shapes.push(counter(p, shape, i < (spec.counts[0] ?? 0)));
    extents.push(box(p[0] - R - 2, p[1] - R - 2, 2 * R + 4, 2 * R + 4));
  });
}

function layoutTenFrames(
  spec: Extract<CountersSpec, { layout: "ten-frame" }>,
  shapes: string[],
  extents: Rect[],
) {
  const cell = 36;
  spec.frames.forEach((count, f) => {
    const top = f * (2 * cell + 14);
    const outlined = spec.second?.[f] ?? 0;
    shapes.push(
      polygon(
        [
          [0, top],
          [5 * cell, top],
          [5 * cell, top + 2 * cell],
          [0, top + 2 * cell],
        ],
        { width: 2 },
      ),
    );
    for (let c = 1; c < 5; c++)
      shapes.push(line([c * cell, top], [c * cell, top + 2 * cell], { width: 1.2 }));
    shapes.push(line([0, top + cell], [5 * cell, top + cell], { width: 1.2 }));
    for (let k = 0; k < count; k++) {
      const centre: Point = [(k % 5) * cell + cell / 2, top + Math.floor(k / 5) * cell + cell / 2];
      shapes.push(counter(centre, "circle", k < count - outlined, 13));
    }
    extents.push(box(0, top, 5 * cell, 2 * cell));
  });
}

function layoutArray(
  spec: Extract<CountersSpec, { layout: "array" }>,
  shapes: string[],
  extents: Rect[],
) {
  for (let r = 0; r < spec.rows; r++)
    for (let c = 0; c < spec.columns; c++)
      shapes.push(counter([c * CELL, r * CELL], spec.shape ?? "circle", true));
  extents.push(
    box(-R - 2, -R - 2, (spec.columns - 1) * CELL + 2 * R + 4, (spec.rows - 1) * CELL + 2 * R + 4),
  );
}

/** A hundreds flat, tens rod or ones cube with its top-left corner at (x, y). */
function block(kind: "H" | "T" | "O", x: number, y: number, u: number): string {
  const lines: string[] = [];
  const w = kind === "H" ? 10 * u : u;
  const h = kind === "O" ? u : 10 * u;
  lines.push(
    `<rect x="${fmt(x)}" y="${fmt(y)}" width="${fmt(w)}" height="${fmt(h)}" fill="currentColor" fill-opacity="0.12" stroke="currentColor" stroke-width="1.3"/>`,
  );
  if (kind !== "O")
    for (let k = 1; k < 10; k++)
      lines.push(line([x, y + k * u], [x + w, y + k * u], { width: 0.6 }));
  if (kind === "H")
    for (let k = 1; k < 10; k++)
      lines.push(line([x + k * u, y], [x + k * u, y + h], { width: 0.6 }));
  return lines.join("");
}

function layoutPlaceValue(
  spec: Extract<CountersSpec, { layout: "place-value" }>,
  shapes: string[],
  extents: Rect[],
) {
  const blocks = spec.style === "blocks";
  const u = 9;
  // Each column is wide enough for three counters (or two flats) side by side.
  const colWidth = blocks ? 2 * 10 * u + 24 : 3 * 34 + 16;
  const perRow = blocks ? undefined : 3;
  const counterRows = Math.max(2, ...spec.counts.map((c) => Math.ceil(c / (perRow ?? 1))));
  const blockHeight = Math.max(
    10 * u + 16,
    ...spec.columns.map((col, i) => {
      const n = spec.counts[i] ?? 0;
      if (col === "H") return Math.ceil(n / 2) * (10 * u + 6) + 10;
      if (col === "T") return 10 * u + 16;
      return Math.ceil(n / 5) * (u + 4) + 16;
    }),
  );
  const bodyHeight = blocks ? blockHeight : counterRows * 34 + 16;
  const head = 30;
  const width = colWidth * spec.columns.length;
  shapes.push(
    polygon(
      [
        [0, 0],
        [width, 0],
        [width, head + bodyHeight],
        [0, head + bodyHeight],
      ],
      { width: 2 },
    ),
  );
  shapes.push(line([0, head], [width, head], { width: 1.4 }));
  spec.columns.forEach((col, i) => {
    const x0 = i * colWidth;
    if (i > 0) shapes.push(line([x0, 0], [x0, head + bodyHeight], { width: 1.4 }));
    shapes.push(text(heading(col), x0 + colWidth / 2, head / 2, 15));
    const n = spec.counts[i] ?? 0;
    if (blocks) {
      const kind = col as "H" | "T" | "O";
      for (let k = 0; k < n; k++) {
        if (kind === "H")
          shapes.push(
            block(
              "H",
              x0 + 8 + (k % 2) * (10 * u + 6),
              head + 8 + Math.floor(k / 2) * (10 * u + 6),
              u,
            ),
          );
        else if (kind === "T") shapes.push(block("T", x0 + 8 + k * (u + 4), head + 8, u));
        else
          shapes.push(
            block("O", x0 + 8 + (k % 5) * (u + 4), head + 8 + Math.floor(k / 5) * (u + 4), u),
          );
      }
    } else {
      const value = spec.values?.[i] ?? PLACE_VALUES[col];
      for (let k = 0; k < n; k++) {
        const centre: Point = [x0 + 8 + 17 + (k % 3) * 34, head + 8 + 17 + Math.floor(k / 3) * 34];
        shapes.push(circle(centre, 15, { width: 1.5 }));
        if (value) shapes.push(text(value, centre[0], centre[1], value.length > 4 ? 8 : 10));
      }
    }
  });
  extents.push(box(0, 0, width, head + bodyHeight));
}

function layoutPartWhole(
  spec: Extract<CountersSpec, { layout: "part-whole" }>,
  shapes: string[],
  extents: Rect[],
) {
  const n = spec.parts.length;
  const span = (n - 1) * 90;
  const whole: Point = [span / 2, 0];
  shapes.push(circle(whole, 34, { width: 2 }));
  shapes.push(text(spec.whole, whole[0], whole[1], 18));
  spec.parts.forEach((p, i) => {
    const c: Point = [i * 90, 110];
    const dx = c[0] - whole[0];
    const dy = c[1] - whole[1];
    const d = Math.hypot(dx, dy);
    shapes.push(
      line(
        [whole[0] + (dx / d) * 34, whole[1] + (dy / d) * 34],
        [c[0] - (dx / d) * 30, c[1] - (dy / d) * 30],
        { width: 1.6 },
      ),
    );
    shapes.push(circle(c, 30, { width: 2 }));
    shapes.push(text(p, c[0], c[1], 18));
  });
  extents.push(box(-32, -36, span + 64, 178));
}

/** How far below the tallest each raised finger stops: index, middle, ring, little. */
const FINGER_TOPS = [6, 0, 4, 14];

/** One hand: the first `up` of index, middle, ring and little fingers, then the thumb, raised. */
function hand(x: number, up: number): string {
  const parts: string[] = [];
  const palm = `M ${fmt(x)} 80 Q ${fmt(x)} 128 ${fmt(x + 34)} 128 Q ${fmt(x + 68)} 128 ${fmt(x + 68)} 80 L ${fmt(x + 68)} 66 L ${fmt(x)} 66 Z`;
  parts.push(path(palm, { width: 2 }));
  for (let f = 0; f < 4; f++) {
    const fx = x + 3 + f * 16;
    const raised = f < up;
    const top = raised ? 10 + (FINGER_TOPS[f] ?? 0) : 52;
    parts.push(
      `<rect x="${fmt(fx)}" y="${fmt(top)}" width="14" height="${fmt(68 - top)}" rx="7" fill="none" stroke="currentColor" stroke-width="2"/>`,
    );
  }
  // The thumb comes out to the side when it is the fifth finger.
  const thumbUp = up >= 5;
  parts.push(
    thumbUp
      ? `<rect x="${fmt(x + 62)}" y="58" width="14" height="44" rx="7" transform="rotate(32 ${fmt(x + 69)} 102)" fill="none" stroke="currentColor" stroke-width="2"/>`
      : `<rect x="${fmt(x + 50)}" y="84" width="24" height="14" rx="7" fill="none" stroke="currentColor" stroke-width="2"/>`,
  );
  return parts.join("");
}

function layoutFingers(
  spec: Extract<CountersSpec, { layout: "fingers" }>,
  shapes: string[],
  extents: Rect[],
) {
  const hands = spec.count > 5 ? 2 : 1;
  for (let h = 0; h < hands; h++)
    shapes.push(hand(h * 110, h === 0 ? Math.min(spec.count, 5) : spec.count - 5));
  extents.push(box(-4, 0, (hands - 1) * 110 + 104, 132));
}

function layoutPattern(
  spec: Extract<CountersSpec, { layout: "pattern" }>,
  shapes: string[],
  extents: Rect[],
) {
  spec.items.forEach((it, i) => {
    const at: Point = [i * CELL, 0];
    if (it) shapes.push(counter(at, it.shape, it.filled !== false));
    else {
      shapes.push(
        `<rect x="${fmt(at[0] - R)}" y="${fmt(-R)}" width="${fmt(2 * R)}" height="${fmt(2 * R)}" rx="3" fill="none" stroke="currentColor" stroke-width="1.4" stroke-dasharray="4 3"/>`,
        text("?", at[0], 0, 16),
      );
    }
    extents.push(box(at[0] - R - 2, -R - 2, 2 * R + 4, 2 * R + 4));
  });
}

function layoutTally(
  spec: Extract<CountersSpec, { layout: "tally" }>,
  shapes: string[],
  extents: Rect[],
) {
  let x = 0;
  for (let group = 0; group * 5 < spec.count; group++) {
    const inGroup = Math.min(5, spec.count - group * 5);
    const start = x;
    for (let k = 0; k < Math.min(4, inGroup); k++) {
      shapes.push(line([x, 0], [x, 44], { width: 2.4 }));
      x += 11;
    }
    if (inGroup === 5) shapes.push(line([start - 6, 36], [start + 3 * 11 + 6, 8], { width: 2.4 }));
    x += 14;
  }
  extents.push(box(-8, -2, Math.max(x, 12), 48));
}

export function layoutCounters(spec: CountersSpec): Scene {
  const problems = checkCounters(spec);
  const description = describeCounters(spec);
  const shapes: string[] = [];
  const extents: Rect[] = [];
  if (problems.length === 0) {
    switch (spec.layout) {
      case "objects":
        layoutObjects(spec, shapes, extents);
        break;
      case "ten-frame":
        layoutTenFrames(spec, shapes, extents);
        break;
      case "array":
        layoutArray(spec, shapes, extents);
        break;
      case "place-value":
        layoutPlaceValue(spec, shapes, extents);
        break;
      case "part-whole":
        layoutPartWhole(spec, shapes, extents);
        break;
      case "fingers":
        layoutFingers(spec, shapes, extents);
        break;
      case "tally":
        layoutTally(spec, shapes, extents);
        break;
      case "pattern":
        layoutPattern(spec, shapes, extents);
        break;
    }
  }
  const xs = extents.flatMap((e) => [e.x, e.x + e.w]);
  const ys = extents.flatMap((e) => [e.y, e.y + e.h]);
  const bounds: Rect = extents.length
    ? {
        x: Math.min(...xs),
        y: Math.min(...ys),
        w: Math.max(...xs) - Math.min(...xs),
        h: Math.max(...ys) - Math.min(...ys),
      }
    : { x: 0, y: 0, w: 10, h: 10 };
  return {
    shapes: [`<g fill="none">${shapes.join("")}</g>`],
    bounds,
    obstacles: [],
    labels: [],
    description,
    problems,
  };
}
