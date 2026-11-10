// A coordinate grid for the unit lessons: lines drawn across it, points, a star to aim for, the
// "1 across, m up" steps between points, and dots that can be dragged. Taps land on the nearest
// whole-number point, and a readout shows where that is while the pupil hovers or presses. It
// works by keyboard too: arrow keys move a cursor (or a focused dot) and Enter plots.
import {
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import type { Curve, Point, Range, Rule } from "@mathsplanner/learning/unit-lessons";
import { yOn } from "@mathsplanner/learning/unit-lessons";

/** Pixels per unit in the drawing, and room round the grid for the numbers. */
const UNIT = 36;
const PAD = 28;

export type LineTone = "main" | "ghost" | "guess" | "right";
export type PointTone = "given" | "mine" | "wrong" | "hint";

export interface GraphShape {
  points: Point[];
  tone?: "object" | "image" | "ghost";
  label?: string;
}

export interface GraphLine {
  rule: Rule;
  tone?: LineTone;
}

export interface GraphPoint {
  at: Point;
  tone?: PointTone;
}

const fmt = (n: number) => (n < 0 ? `−${Math.abs(n)}` : String(n));
const signed = (n: number) => (n < 0 ? `−${Math.abs(n)}` : `+${n}`);
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

export function LineGraph({
  range,
  lines = [],
  verticals = [],
  shapes = [],
  curves = [],
  points = [],
  star,
  steps = [],
  rise = true,
  handles,
  through,
  onHandle,
  onTap,
  label,
}: {
  range: Range;
  lines?: GraphLine[];
  /** Upright lines, x = a. */
  verticals?: number[];
  /** Shapes drawn on the grid. */
  shapes?: GraphShape[];
  /** Curves drawn in full. */
  curves?: Curve[];
  points?: GraphPoint[];
  star?: Point | undefined;
  /** A chain of points to join with steps: across to the next x, then up or down to it. */
  steps?: Point[];
  /** Label how far each step goes up; off when that is the question. */
  rise?: boolean;
  /** Dots the pupil can drag, and where they go. */
  handles?: Point[];
  /** Draw the line through two points (which may be upright), as for dragged dots. */
  through?: [Point, Point] | undefined;
  onHandle?: (i: number, p: Point) => void;
  /** Called with the whole-number point the pupil tapped. */
  onTap?: (p: Point) => void;
  label: string;
}) {
  const { xMin, xMax, yMin, yMax } = range;
  const width = (xMax - xMin) * UNIT + 2 * PAD;
  const height = (yMax - yMin) * UNIT + 2 * PAD;
  const sx = (x: number) => PAD + (x - xMin) * UNIT;
  const sy = (y: number) => PAD + (yMax - y) * UNIT;
  const clipId = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<Point>();
  const [cursor, setCursor] = useState<Point>({ x: clamp(0, xMin, xMax), y: clamp(0, yMin, yMax) });
  const [keyboard, setKeyboard] = useState(false);
  const dragging = useRef<number | undefined>(undefined);

  /** The whole-number point nearest a pointer event, kept on the grid. */
  const snap = (e: PointerEvent<SVGSVGElement>): Point | undefined => {
    const svg = svgRef.current;
    const ctm = svg?.getScreenCTM();
    if (!svg || !ctm) return undefined;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    return {
      x: clamp(Math.round(xMin + (p.x - PAD) / UNIT), xMin, xMax),
      y: clamp(Math.round(yMax - (p.y - PAD) / UNIT), yMin, yMax),
    };
  };

  const nearHandle = (p: Point) =>
    handles?.findIndex((h) => Math.abs(h.x - p.x) <= 0.6 && Math.abs(h.y - p.y) <= 0.6) ?? -1;

  const down = (e: PointerEvent<SVGSVGElement>) => {
    const p = snap(e);
    if (!p) return;
    setKeyboard(false);
    if (handles && onHandle) {
      // Grab the dot under the finger, or else the nearer one, which jumps to the finger.
      let i = nearHandle(p);
      if (i < 0) {
        const d = handles.map((h) => (h.x - p.x) ** 2 + (h.y - p.y) ** 2);
        i = d.indexOf(Math.min(...d));
      }
      dragging.current = i;
      e.currentTarget.setPointerCapture(e.pointerId);
      onHandle(i, p);
    }
    setHover(p);
  };

  const move = (e: PointerEvent<SVGSVGElement>) => {
    const p = snap(e);
    if (!p) return;
    if (dragging.current !== undefined && onHandle) {
      const h = handles?.[dragging.current];
      if (!h || h.x !== p.x || h.y !== p.y) onHandle(dragging.current, p);
    }
    if (!hover || hover.x !== p.x || hover.y !== p.y) setHover(p);
  };

  const up = (e: PointerEvent<SVGSVGElement>) => {
    const p = snap(e);
    if (dragging.current === undefined && p && onTap) onTap(p);
    dragging.current = undefined;
    if (e.pointerType !== "mouse") setHover(undefined);
  };

  const key = (e: KeyboardEvent<SVGSVGElement>) => {
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, 1],
      ArrowDown: [0, -1],
    };
    const d = moves[e.key];
    if (d) {
      e.preventDefault();
      setKeyboard(true);
      const next = {
        x: clamp(cursor.x + d[0], xMin, xMax),
        y: clamp(cursor.y + d[1], yMin, yMax),
      };
      setCursor(next);
      setHover(next);
    } else if ((e.key === "Enter" || e.key === " ") && onTap) {
      e.preventDefault();
      onTap(cursor);
    } else if ((e.key === "1" || e.key === "2") && handles && onHandle) {
      // With dots to drag: 1 or 2 puts that dot at the cursor.
      e.preventDefault();
      onHandle(Number(e.key) - 1, cursor);
    }
  };

  // Lines run edge to edge; the clip keeps them inside the grid.
  const lineEnds = (rule: Rule) => ({
    x1: sx(xMin - 1),
    y1: sy(yOn(rule, xMin - 1)),
    x2: sx(xMax + 1),
    y2: sy(yOn(rule, xMax + 1)),
  });

  const every = Math.max(xMax - xMin, yMax - yMin) > 10 ? 2 : 1;
  const xs = Array.from({ length: xMax - xMin + 1 }, (_, i) => xMin + i);
  const ys = Array.from({ length: yMax - yMin + 1 }, (_, i) => yMin + i);
  // Where the axes sit, kept on the grid when 0 is off it.
  const ax = clamp(0, xMin, xMax);
  const ay = clamp(0, yMin, yMax);
  const interactive = Boolean(onTap || onHandle);
  const shownAt = hover ?? (keyboard ? cursor : undefined);

  return (
    <div className="graph-wrap">
      <svg
        ref={svgRef}
        className={`line-graph${interactive ? " tappable" : ""}`}
        viewBox={`0 0 ${width} ${height}`}
        // The box hugs the drawing, so taps beside it never land on nothing.
        style={{ "--ratio": width / height } as CSSProperties}
        data-x-min={xMin}
        data-y-max={yMax}
        role={interactive ? "application" : "img"}
        aria-label={label}
        tabIndex={interactive ? 0 : undefined}
        onPointerDown={interactive ? down : undefined}
        onPointerMove={interactive ? move : undefined}
        onPointerUp={interactive ? up : undefined}
        onPointerLeave={
          interactive
            ? () => {
                if (dragging.current === undefined) setHover(undefined);
              }
            : undefined
        }
        onKeyDown={interactive ? key : undefined}
        onBlur={() => setKeyboard(false)}
      >
        <defs>
          <clipPath id={clipId}>
            <rect x={sx(xMin)} y={sy(yMax)} width={width - 2 * PAD} height={height - 2 * PAD} />
          </clipPath>
        </defs>
        <rect
          className="graph-paper"
          x={sx(xMin)}
          y={sy(yMax)}
          width={width - 2 * PAD}
          height={height - 2 * PAD}
        />
        {xs.map((x) => (
          <line
            key={`gx${x}`}
            className="graph-grid"
            x1={sx(x)}
            x2={sx(x)}
            y1={sy(yMin)}
            y2={sy(yMax)}
          />
        ))}
        {ys.map((y) => (
          <line
            key={`gy${y}`}
            className="graph-grid"
            y1={sy(y)}
            y2={sy(y)}
            x1={sx(xMin)}
            x2={sx(xMax)}
          />
        ))}
        <line className="graph-axis" x1={sx(xMin)} x2={sx(xMax)} y1={sy(ay)} y2={sy(ay)} />
        <line className="graph-axis" y1={sy(yMin)} y2={sy(yMax)} x1={sx(ax)} x2={sx(ax)} />
        {xs
          .filter((x) => x !== 0 && x % every === 0)
          .map((x) => (
            <text
              key={`tx${x}`}
              className="graph-tick"
              x={sx(x)}
              y={sy(ay) + 17}
              textAnchor="middle"
            >
              {fmt(x)}
            </text>
          ))}
        {ys
          .filter((y) => y !== 0 && y % every === 0)
          .map((y) => (
            <text
              key={`ty${y}`}
              className="graph-tick"
              x={sx(ax) - 5}
              y={sy(y) + 5}
              textAnchor="end"
            >
              {fmt(y)}
            </text>
          ))}
        <text className="graph-tick" x={sx(ax) - 5} y={sy(ay) + 17} textAnchor="end">
          0
        </text>
        <text className="graph-name" x={sx(xMax) + 4} y={sy(ay) + 4}>
          x
        </text>
        <text className="graph-name" x={sx(ax)} y={sy(yMax) - 7} textAnchor="middle">
          y
        </text>

        <g clipPath={`url(#${clipId})`}>
          {lines.map((l, i) => (
            <line key={i} className={`graph-line tone-${l.tone ?? "main"}`} {...lineEnds(l.rule)} />
          ))}
          {curves.map((cv, i) => (
            <path
              key={`cv${i}`}
              className="graph-line tone-main curve"
              d={curvePath(cv, range, sx, sy)}
            />
          ))}
          {shapes.map((sh, i) => (
            <g key={`sh${i}`} className={`graph-shape tone-${sh.tone ?? "object"}`}>
              <polygon points={sh.points.map((p) => `${sx(p.x)},${sy(p.y)}`).join(" ")} />
              {sh.label && sh.points[0] && (
                <text
                  x={sh.points.reduce((a, p) => a + sx(p.x), 0) / sh.points.length}
                  y={sh.points.reduce((a, p) => a + sy(p.y), 0) / sh.points.length + 6}
                  textAnchor="middle"
                >
                  {sh.label}
                </text>
              )}
            </g>
          ))}
          {verticals.map((x) => (
            <line
              key={`v${x}`}
              className="graph-line tone-mirror"
              x1={sx(x)}
              x2={sx(x)}
              y1={sy(yMin - 1)}
              y2={sy(yMax + 1)}
            />
          ))}
          {through && <ThroughLine a={through[0]} b={through[1]} sx={sx} sy={sy} range={range} />}
          {steps.slice(1).map((to, i) => {
            const from = steps[i];
            if (!from) return null;
            const turn = { x: to.x, y: from.y };
            const up = to.y - from.y;
            return (
              <g key={`s${i}`} className="graph-step">
                <path d={`M${sx(from.x)} ${sy(from.y)} H${sx(turn.x)} V${sy(to.y)}`} />
                <text
                  x={(sx(from.x) + sx(turn.x)) / 2}
                  y={sy(from.y) + (up >= 0 ? 19 : -7)}
                  textAnchor="middle"
                >
                  {signed(to.x - from.x)}
                </text>
                {rise && up !== 0 && (
                  <text x={sx(turn.x) + 5} y={(sy(from.y) + sy(to.y)) / 2 + 6}>
                    {signed(up)}
                  </text>
                )}
              </g>
            );
          })}
        </g>

        {star && (
          <path
            className="graph-star"
            transform={`translate(${sx(star.x)} ${sy(star.y)})`}
            d="M0 -12 L3.5 -4.2 L11.4 -3.7 L5.4 1.6 L7.1 9.7 L0 5.4 L-7.1 9.7 L-5.4 1.6 L-11.4 -3.7 L-3.5 -4.2 Z"
          />
        )}
        {points.map((p, i) => (
          <circle
            key={`p${i}-${p.at.x},${p.at.y}`}
            className={`graph-point tone-${p.tone ?? "given"}`}
            cx={sx(p.at.x)}
            cy={sy(p.at.y)}
            r={p.tone === "hint" ? 9 : 6}
          />
        ))}
        {handles?.map((h, i) => (
          <g key={`h${i}`} className="graph-handle" transform={`translate(${sx(h.x)} ${sy(h.y)})`}>
            <circle r="16" className="handle-halo" />
            <circle r="8" className="handle-dot" />
          </g>
        ))}
        {interactive && shownAt && (
          <g className="graph-cursor" transform={`translate(${sx(shownAt.x)} ${sy(shownAt.y)})`}>
            <circle r="10" />
          </g>
        )}
      </svg>
      {interactive && (
        <p className="graph-readout" aria-live="polite">
          {shownAt ? `(${fmt(shownAt.x)}, ${fmt(shownAt.y)})` : " "}
        </p>
      )}
    </div>
  );
}

/** The whole-number points of a line inside a range, left to right, for drawing its steps. */
export function latticeOn(rule: Rule, range: Range): Point[] {
  const out: Point[] = [];
  for (let x = Math.ceil(range.xMin); x <= range.xMax; x++) {
    const y = yOn(rule, x);
    if (Number.isInteger(y) && y >= range.yMin && y <= range.yMax) out.push({ x, y });
  }
  return out;
}

function ThroughLine({
  a,
  b,
  sx,
  sy,
  range,
}: {
  a: Point;
  b: Point;
  sx: (x: number) => number;
  sy: (y: number) => number;
  range: Range;
}) {
  if (a.x === b.x && a.y === b.y) return null;
  // Far beyond the grid either way, along the line; the clip trims it.
  const far = 4 * Math.max(range.xMax - range.xMin, range.yMax - range.yMin);
  const len = Math.hypot(b.x - a.x, b.y - a.y);
  const dx = ((b.x - a.x) / len) * far;
  const dy = ((b.y - a.y) / len) * far;
  return (
    <line
      className="graph-line tone-main"
      x1={sx(a.x - dx)}
      y1={sy(a.y - dy)}
      x2={sx(a.x + dx)}
      y2={sy(a.y + dy)}
    />
  );
}

/** y on a curve at x, or undefined where it has none (y = k ÷ x at x = 0). */
export function curveY(curve: Curve, x: number): number | undefined {
  if (curve.kind === "quadratic") return curve.a * x * x + curve.b * x + curve.c;
  return x === 0 ? undefined : curve.k / x;
}

/** A curve as an SVG path, sampled finely, broken where it leaves the grid far behind. */
function curvePath(
  curve: Curve,
  range: Range,
  sx: (x: number) => number,
  sy: (y: number) => number,
): string {
  const n = 240;
  const span = range.yMax - range.yMin;
  let d = "";
  let pen = false;
  for (let i = 0; i <= n; i++) {
    const x = range.xMin + ((range.xMax - range.xMin) * i) / n;
    const y = curveY(curve, x);
    if (y === undefined || y > range.yMax + span || y < range.yMin - span) {
      pen = false;
      continue;
    }
    d += `${pen ? "L" : "M"}${sx(x).toFixed(1)} ${sy(y).toFixed(1)} `;
    pen = true;
  }
  return d.trim();
}
