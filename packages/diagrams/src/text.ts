// Label text: a classroom subset of LaTeX laid out as SVG <text>, measured with KaTeX's own font
// metrics so the placement solver knows each label's size without a browser. Anything outside
// the subset throws, so a generator's tests catch it before a student sees it.
import fontMetricsData from "katex/src/fontMetricsData.js";
import { fmt, escapeXml } from "./svg.ts";

export class LabelError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LabelError";
  }
}

type Font = "math" | "main";

type Node =
  | { kind: "glyphs"; text: string; font: Font; literal?: boolean }
  | { kind: "space"; em: number }
  | { kind: "frac"; num: Node[]; den: Node[] }
  | { kind: "sqrt"; body: Node[] }
  | { kind: "overline"; body: Node[] }
  | { kind: "script"; sup?: Node[]; sub?: Node[] };

const SYMBOLS: Record<string, [string, Font]> = {
  times: ["×", "main"],
  div: ["÷", "main"],
  pm: ["±", "main"],
  mp: ["∓", "main"],
  cdot: ["⋅", "main"],
  le: ["≤", "main"],
  leq: ["≤", "main"],
  ge: ["≥", "main"],
  geq: ["≥", "main"],
  ne: ["≠", "main"],
  neq: ["≠", "main"],
  approx: ["≈", "main"],
  infty: ["∞", "main"],
  angle: ["∠", "main"],
  triangle: ["△", "main"],
  parallel: ["∥", "main"],
  perp: ["⊥", "main"],
  ldots: ["…", "main"],
  cdots: ["⋯", "main"],
  to: ["→", "main"],
  rightarrow: ["→", "main"],
  circ: ["°", "main"],
  degree: ["°", "main"],
  prime: ["′", "main"],
  "%": ["%", "main"],
  "{": ["{", "main"],
  "}": ["}", "main"],
  $: ["$", "main"],
  "#": ["#", "main"],
  "&": ["&", "main"],
  alpha: ["α", "math"],
  beta: ["β", "math"],
  gamma: ["γ", "math"],
  delta: ["δ", "math"],
  epsilon: ["ϵ", "math"],
  theta: ["θ", "math"],
  lambda: ["λ", "math"],
  mu: ["μ", "math"],
  pi: ["π", "math"],
  rho: ["ρ", "math"],
  sigma: ["σ", "math"],
  phi: ["ϕ", "math"],
  omega: ["ω", "math"],
  Delta: ["Δ", "main"],
  Theta: ["Θ", "main"],
  Pi: ["Π", "main"],
  Sigma: ["Σ", "main"],
  Phi: ["Φ", "main"],
  Omega: ["Ω", "main"],
};

const SPACES: Record<string, number> = {
  ",": 0.167,
  ":": 0.222,
  ";": 0.278,
  "!": -0.167,
  " ": 0.333,
  quad: 1,
  qquad: 2,
};
const FUNCTIONS = new Set(["sin", "cos", "tan", "log", "ln", "exp"]);

/** Parses a label into nodes, or throws LabelError naming what is not supported. */
export function parseLabel(latex: string): Node[] {
  let i = 0;
  const fail = (message: string): never => {
    throw new LabelError(`label "${latex}": ${message}`);
  };

  const readCommand = (): string => {
    i++; // backslash
    const letters = /^[A-Za-z]+/.exec(latex.slice(i));
    if (letters) {
      i += letters[0].length;
      return letters[0];
    }
    const ch = latex[i];
    if (ch === undefined) return fail("ends with a backslash");
    i++;
    return ch;
  };

  /** The raw text of a {…} group, for \text. */
  const readRawGroup = (): string => {
    while (latex[i] === " ") i++;
    if (latex[i] !== "{") return fail("expected { after \\text");
    let depth = 0;
    let out = "";
    for (; i < latex.length; i++) {
      const ch = latex[i] ?? "";
      if (ch === "{" && depth++ === 0) continue;
      if (ch === "}" && --depth === 0) {
        i++;
        return out.replace(/\\([%$#&{}_])/g, "$1");
      }
      out += ch;
    }
    return fail("unclosed {");
  };

  const parseGroup = (): Node[] => {
    i++; // {
    const nodes = parseList("}");
    if (latex[i] !== "}") fail("unclosed {");
    i++;
    return nodes;
  };

  /** One argument: a {group} or a single token. */
  const parseArgument = (): Node[] => {
    while (latex[i] === " ") i++;
    if (latex[i] === "{") return parseGroup();
    if (i >= latex.length) return fail("missing argument");
    const before = i;
    const nodes = parseToken();
    if (i === before) return fail("missing argument");
    return nodes;
  };

  const parseToken = (): Node[] => {
    const ch = latex[i] ?? "";
    if (ch === "\\") {
      const name = readCommand();
      const symbol = SYMBOLS[name];
      if (symbol) return [{ kind: "glyphs", text: symbol[0], font: symbol[1] }];
      const space = SPACES[name];
      if (space !== undefined) return [{ kind: "space", em: space }];
      if (FUNCTIONS.has(name))
        return [
          { kind: "glyphs", text: name, font: "main" },
          { kind: "space", em: 0.167 },
        ];
      switch (name) {
        case "frac":
        case "dfrac":
        case "tfrac":
          return [{ kind: "frac", num: parseArgument(), den: parseArgument() }];
        case "sqrt":
          if (latex[i] === "[") return fail("\\sqrt[n] is not supported");
          return [{ kind: "sqrt", body: parseArgument() }];
        case "overline":
          return [{ kind: "overline", body: parseArgument() }];
        case "text":
        case "textrm":
        case "mathrm":
        case "mbox":
          // Non-breaking spaces, because SVG drops leading and trailing spaces in <text>.
          return [
            {
              kind: "glyphs",
              text: readRawGroup().replace(/ /g, "\u00a0"),
              font: "main",
              literal: true,
            },
          ];
        case "left":
        case "right": {
          while (latex[i] === " ") i++;
          if (latex[i] === "\\") {
            const delimiter = readCommand();
            const glyph = SYMBOLS[delimiter];
            if (!glyph) return fail(`unsupported delimiter \\${delimiter}`);
            return [{ kind: "glyphs", text: glyph[0], font: "main" }];
          }
          const delimiter = latex[i++] ?? "";
          return delimiter === "." ? [] : [{ kind: "glyphs", text: delimiter, font: "main" }];
        }
        default:
          return fail(`\\${name} is not supported in diagram labels`);
      }
    }
    i++;
    if (/\s/.test(ch)) return [];
    if (ch === "~") return [{ kind: "space", em: 0.333 }];
    if (ch === "-") return [{ kind: "glyphs", text: "−", font: "main" }];
    if (ch === "'") return [{ kind: "glyphs", text: "′", font: "main" }];
    if (/[A-Za-z]/.test(ch)) return [{ kind: "glyphs", text: ch, font: "math" }];
    if (
      ch === "{" ||
      ch === "}" ||
      ch === "^" ||
      ch === "_" ||
      ch === "&" ||
      ch === "#" ||
      ch === "$"
    ) {
      return fail(`unexpected ${ch}`);
    }
    return [{ kind: "glyphs", text: ch, font: "main" }];
  };

  const parseList = (end?: string): Node[] => {
    const nodes: Node[] = [];
    while (i < latex.length && latex[i] !== end) {
      const ch = latex[i];
      if (ch === "{") {
        nodes.push(...parseGroup());
      } else if (ch === "^" || ch === "_") {
        i++;
        const arg = parseArgument();
        const last = nodes[nodes.length - 1];
        const field = ch === "^" ? "sup" : "sub";
        // x^\circ and 52^\circ: the degree sign sits on the line as a normal glyph.
        if (
          field === "sup" &&
          arg.length === 1 &&
          arg[0]?.kind === "glyphs" &&
          arg[0].text === "°"
        ) {
          nodes.push(arg[0]);
        } else if (last?.kind === "script" && last[field] === undefined) {
          last[field] = arg;
        } else {
          nodes.push({ kind: "script", [field]: arg });
        }
      } else if (ch === "}") {
        fail("unexpected }");
      } else {
        nodes.push(...parseToken());
      }
    }
    return nodes;
  };

  const nodes = parseList();
  if (i < latex.length) fail("unexpected }");
  return spaceOperators(nodes);
}

const RELATIONS = new Set(["=", "<", ">", "≤", "≥", "≠", "≈", "→"]);
const BINARIES = new Set(["+", "−", "×", "÷", "±", "∓", "⋅"]);
const OPENERS = new Set(["(", "[", "{", ","]);

/**
 * Adds the spacing KaTeX puts around relations (=, <) and binary operators (+, −), and after
 * commas. A sign at the start or after another operator is unary and gets no space.
 */
function spaceOperators(nodes: Node[]): Node[] {
  const out: Node[] = [];
  let prev: Node | undefined;
  for (const node of nodes) {
    if (node.kind === "frac") {
      out.push({ ...node, num: spaceOperators(node.num), den: spaceOperators(node.den) });
    } else if (node.kind === "sqrt" || node.kind === "overline") {
      out.push({ ...node, body: spaceOperators(node.body) });
    } else if (node.kind === "glyphs" && !node.literal && RELATIONS.has(node.text)) {
      out.push({ kind: "space", em: 0.278 }, node, { kind: "space", em: 0.278 });
    } else if (node.kind === "glyphs" && !node.literal && BINARIES.has(node.text)) {
      const last = prev?.kind === "glyphs" && !prev.literal ? prev.text.slice(-1) : undefined;
      const unary =
        prev === undefined ||
        (last !== undefined && (RELATIONS.has(last) || BINARIES.has(last) || OPENERS.has(last)));
      if (unary) out.push(node);
      else out.push({ kind: "space", em: 0.222 }, node, { kind: "space", em: 0.222 });
    } else if (node.kind === "glyphs" && !node.literal && node.text === ",") {
      out.push(node, { kind: "space", em: 0.167 });
    } else {
      out.push(node);
    }
    if (node.kind !== "space") prev = node;
  }
  return out;
}

// --- layout ----------------------------------------------------------------------------------

type Metrics = Record<number, [number, number, number, number, number]>;
const FONTS = fontMetricsData as unknown as Record<string, Metrics>;
const MAIN = FONTS["Main-Regular"] ?? {};
const MATH = FONTS["Math-Italic"] ?? {};

function glyphMetrics(ch: string, font: Font): { width: number; height: number; depth: number } {
  const code = ch === "\u00a0" ? 32 : (ch.codePointAt(0) ?? 0);
  const m = (font === "math" ? MATH[code] : undefined) ?? MAIN[code] ?? MATH[code];
  // Unknown glyphs (rare in labels) get an average width.
  return m ? { depth: m[0], height: m[1], width: m[4] } : { depth: 0, height: 0.7, width: 0.55 };
}

type Item =
  | { kind: "text"; x: number; y: number; size: number; font: Font; text: string }
  | { kind: "line"; x1: number; y1: number; x2: number; y2: number; width: number }
  | { kind: "path"; d: [number, number][]; width: number };

interface Box {
  width: number;
  /** Above the baseline (positive). */
  ascent: number;
  /** Below the baseline (positive). */
  descent: number;
  items: Item[];
}

function shift(items: Item[], dx: number, dy: number): Item[] {
  return items.map((it) => {
    switch (it.kind) {
      case "text":
        return { ...it, x: it.x + dx, y: it.y + dy };
      case "line":
        return { ...it, x1: it.x1 + dx, x2: it.x2 + dx, y1: it.y1 + dy, y2: it.y2 + dy };
      case "path":
        return { ...it, d: it.d.map(([x, y]) => [x + dx, y + dy] as [number, number]) };
    }
  });
}

function layoutNodes(nodes: Node[], size: number): Box {
  const box: Box = { width: 0, ascent: 0, descent: 0, items: [] };
  const append = (child: Box) => {
    box.items.push(...shift(child.items, box.width, 0));
    box.width += child.width;
    box.ascent = Math.max(box.ascent, child.ascent);
    box.descent = Math.max(box.descent, child.descent);
  };

  for (const node of nodes) {
    switch (node.kind) {
      case "glyphs": {
        let width = 0;
        let ascent = 0;
        let descent = 0;
        for (const ch of node.text) {
          const m = glyphMetrics(ch, node.font);
          width += m.width * size;
          ascent = Math.max(ascent, m.height * size);
          descent = Math.max(descent, m.depth * size);
        }
        append({
          width,
          ascent,
          descent,
          items: [{ kind: "text", x: 0, y: 0, size, font: node.font, text: node.text }],
        });
        break;
      }
      case "space":
        box.width += node.em * size;
        break;
      case "frac": {
        const num = layoutNodes(node.num, size * 0.85);
        const den = layoutNodes(node.den, size * 0.85);
        const axis = 0.25 * size;
        const gap = 0.14 * size;
        const pad = 0.12 * size;
        const width = Math.max(num.width, den.width) + 2 * pad;
        const numBaseline = -axis - gap - num.descent;
        const denBaseline = -axis + gap + den.ascent;
        append({
          width,
          ascent: axis + gap + num.descent + num.ascent,
          descent: denBaseline + den.descent,
          items: [
            ...shift(num.items, (width - num.width) / 2, numBaseline),
            ...shift(den.items, (width - den.width) / 2, denBaseline),
            {
              kind: "line",
              x1: pad / 2,
              y1: -axis,
              x2: width - pad / 2,
              y2: -axis,
              width: 0.06 * size,
            },
          ],
        });
        break;
      }
      case "sqrt": {
        const body = layoutNodes(node.body, size);
        const top = body.ascent + 0.12 * size;
        const sign = 0.55 * size;
        append({
          width: sign + body.width + 0.08 * size,
          ascent: top + 0.04 * size,
          descent: body.descent + 0.05 * size,
          items: [
            ...shift(body.items, sign, 0),
            {
              kind: "path",
              d: [
                [0.05 * size, -0.25 * size],
                [0.18 * size, -0.32 * size],
                [0.3 * size, body.descent],
                [0.5 * size, -top],
                [sign + body.width + 0.08 * size, -top],
              ],
              width: 0.06 * size,
            },
          ],
        });
        break;
      }
      case "overline": {
        const body = layoutNodes(node.body, size);
        const y = -body.ascent - 0.12 * size;
        append({
          width: body.width,
          ascent: -y + 0.04 * size,
          descent: body.descent,
          items: [
            ...body.items,
            { kind: "line", x1: 0, y1: y, x2: body.width, y2: y, width: 0.06 * size },
          ],
        });
        break;
      }
      case "script": {
        const sup = node.sup && layoutNodes(node.sup, size * 0.7);
        const sub = node.sub && layoutNodes(node.sub, size * 0.7);
        const supShift = -0.42 * size;
        const subShift = 0.22 * size;
        append({
          width: Math.max(sup?.width ?? 0, sub?.width ?? 0) + 0.05 * size,
          ascent: sup ? -supShift + sup.ascent : 0,
          descent: sub ? subShift + sub.descent : 0,
          items: [
            ...(sup ? shift(sup.items, 0, supShift) : []),
            ...(sub ? shift(sub.items, 0, subShift) : []),
          ],
        });
        break;
      }
    }
  }
  return box;
}

export interface TextBox {
  width: number;
  ascent: number;
  descent: number;
  height: number;
  /** SVG for the label with its left end of the baseline at (x, baseline). */
  svg(x: number, baseline: number): string;
  /** The label as plain text, for descriptions. */
  plain: string;
}

const FONT_FAMILY: Record<Font, string> = {
  math: `font-family="KaTeX_Math, 'Times New Roman', serif" font-style="italic"`,
  main: `font-family="KaTeX_Main, 'Times New Roman', serif"`,
};

/** Lays out a label at `size` px. Throws LabelError for LaTeX outside the subset. */
export function layoutLabel(latex: string, size = 16): TextBox {
  const nodes = parseLabel(latex);
  const box = layoutNodes(nodes, size);
  return {
    width: box.width,
    ascent: box.ascent,
    descent: box.descent,
    height: box.ascent + box.descent,
    plain: plainText(nodes),
    svg(x, baseline) {
      return shift(box.items, x, baseline)
        .map((it) => {
          switch (it.kind) {
            case "text":
              return `<text x="${fmt(it.x)}" y="${fmt(it.y)}" font-size="${fmt(it.size)}" ${FONT_FAMILY[it.font]}>${escapeXml(it.text)}</text>`;
            case "line":
              return `<line x1="${fmt(it.x1)}" y1="${fmt(it.y1)}" x2="${fmt(it.x2)}" y2="${fmt(it.y2)}" stroke="currentColor" stroke-width="${fmt(it.width)}"/>`;
            case "path":
              return `<polyline points="${it.d.map(([px, py]) => `${fmt(px)},${fmt(py)}`).join(" ")}" fill="none" stroke="currentColor" stroke-width="${fmt(it.width)}"/>`;
          }
        })
        .join("");
    },
  };
}

const SUPERSCRIPTS: Record<string, string> = { "2": "²", "3": "³" };

function plainText(nodes: Node[]): string {
  return nodes
    .map((n) => {
      switch (n.kind) {
        case "glyphs":
          return n.text;
        case "space":
          return n.em > 0.15 ? " " : "";
        case "frac": {
          const wrap = (s: string) => (/^[\w.]+$/u.test(s) ? s : `(${s})`);
          return `${wrap(plainText(n.num))}/${wrap(plainText(n.den))}`;
        }
        case "sqrt": {
          const body = plainText(n.body);
          return body.length === 1 || /^\d+$/.test(body) ? `√${body}` : `√(${body})`;
        }
        case "overline":
          return plainText(n.body);
        case "script": {
          const sup = n.sup ? plainText(n.sup) : "";
          const sub = n.sub ? plainText(n.sub) : "";
          return (sub ? `_${sub}` : "") + (sup ? (SUPERSCRIPTS[sup] ?? `^${sup}`) : "");
        }
      }
    })
    .join("");
}

/** A label as plain text: 52°, 3/4, √2, x². */
export function latexToPlain(latex: string): string {
  return plainText(parseLabel(latex))
    .replace(/\u00a0/g, " ")
    .replace(/ {2,}/g, " ")
    .trim();
}
