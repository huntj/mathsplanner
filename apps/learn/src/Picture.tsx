// The pictures a unit lesson screen can show: a coordinate grid, a number line, angles round a
// point, a labelled shape, bar models, a shaded grid, a cuboid, a spinner, a table, a growing
// pattern, a ruler, big maths and a place value chart. Each is drawn in SVG (or HTML for tables)
// from the theme's colours, so it works in light and dark.
import { useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { angleMark, layoutShape, type Pt } from "./labels.ts";
import { latticeOn, LineGraph, type GraphLine, type GraphPoint } from "./LineGraph.tsx";
import {
  onLine,
  ruleText,
  type AnglesPic,
  type BarChartPic,
  type BarsPic,
  type CuboidPic,
  type DotsPic,
  type DrawingPic,
  type GridPic,
  type NumberLinePic,
  type Picture,
  type PlaceValuePic,
  type Point,
  type Rule,
  type RulerPic,
  type Scene,
  type ShapePic,
  type SpinnerPic,
  type StacksPic,
  type VennPic,
} from "./unit-lessons/index.ts";
import { fmt, say, W } from "./unit-ui.tsx";

export function sceneProps(scene: Scene, rise = true) {
  const first = scene.lines?.[0];
  return {
    range: scene.range,
    lines: (scene.lines ?? []).map((rule): GraphLine => ({ rule })),
    points: (scene.points ?? []).map((at): GraphPoint => ({ at })),
    star: scene.star,
    steps: scene.steps && first ? stepsFor(first, scene) : [],
    verticals: scene.verticals ?? [],
    shapes: scene.shapes ?? [],
    curves: scene.curves ?? [],
    rise,
  };
}

/**
 * Where to draw a line's steps: between the points shown, if any are on it; otherwise from where
 * it crosses the y-axis, a few steps along, as a pupil would draw it.
 */
export function stepsFor(rule: Rule, scene: Scene): Point[] {
  const shown = (scene.points ?? []).filter((p) => onLine(rule, p)).sort((a, b) => a.x - b.x);
  if (shown.length > 1) return shown;
  return latticeOn(rule, scene.range)
    .filter((p) => p.x >= 0)
    .slice(0, 4);
}

export function describeScene(scene: Scene): string {
  const parts = [
    ...(scene.lines ?? []).map((l) => `the line ${ruleText(l)}`),
    ...(scene.points?.length ? [`points at ${scene.points.map(say).join(", ")}`] : []),
  ];
  return parts.length ? `A grid showing ${parts.join(" and ")}.` : "An empty grid.";
}

/** A number as a pupil writes it: a proper minus, and no float noise (0.1 + 0.2 shows as 0.3). */
export function numberText(n: number): string {
  const clean = Number.parseFloat(n.toFixed(6));
  return fmt(Object.is(clean, -0) ? 0 : clean);
}

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

/** A tick's value as a fraction over `den`, simplified, or a whole number. */
function fractionParts(value: number, den: number): { whole?: string; num?: string; den?: string } {
  const top = Math.round(value * den);
  if (top % den === 0) return { whole: numberText(top / den) };
  const g = gcd(top, den);
  return { num: numberText(top / g), den: String(den / g) };
}

const SECTOR_COLOURS = [
  "var(--number)",
  "var(--fractions)",
  "var(--geometry)",
  "var(--algebra)",
  "var(--ratio)",
  "var(--measures)",
];

/** A sector named after a colour is that colour; others take the next colour in turn. */
const NAMED_COLOURS: Record<string, string> = {
  red: "var(--wrong)",
  blue: "var(--number)",
  green: "var(--geometry)",
  orange: "var(--fractions)",
  purple: "var(--algebra)",
  yellow: "var(--gold-deep)",
  pink: "var(--ratio)",
};

const sectorColour = (label: string, i: number) =>
  NAMED_COLOURS[label.toLowerCase()] ?? SECTOR_COLOURS[i % SECTOR_COLOURS.length];

export function PictureView({ picture }: { picture: Picture }) {
  switch (picture.kind) {
    case "graph":
      return <LineGraph {...sceneProps(picture)} label={describeScene(picture)} />;
    case "number-line":
      return <NumberLine line={picture} />;
    case "angles":
      return <Angles pic={picture} />;
    case "shape":
      return <Shape pic={picture} />;
    case "bars":
      return <Bars pic={picture} />;
    case "grid":
      return <Grid pic={picture} />;
    case "cuboid":
      return <Cuboid pic={picture} />;
    case "spinner":
      return <Spinner pic={picture} />;
    case "table":
      return (
        <table className="ul-table pic-table">
          {picture.head && (
            <thead>
              <tr>
                {picture.head.map((h, i) => (
                  <th key={i} scope="col">
                    <W text={h} />
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {picture.rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>
                    <W text={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    case "stacks":
      return <Stacks pic={picture} />;
    case "ruler":
      return <Ruler pic={picture} />;
    case "maths":
      return (
        <div className="pic-maths">
          <W text={`$${picture.tex}$`} />
        </div>
      );
    case "place-value":
      return <PlaceValue pic={picture} />;
    case "bar-chart":
      return <BarChart pic={picture} />;
    case "drawing":
      return <Drawing pic={picture} />;
    case "venn":
      return <Venn pic={picture} />;
    case "dots":
      return <Dots pic={picture} />;
  }
}

/** An SVG picture that keeps its shape and fits the column. */
function Svg({
  width,
  height,
  label,
  children,
  className,
}: {
  width: number;
  height: number;
  label: string;
  children: ReactNode;
  className?: string | undefined;
}) {
  return (
    <svg
      className={`pic${className ? ` ${className}` : ""}`}
      viewBox={`0 0 ${width} ${height}`}
      style={{ maxWidth: `${width * 1.15}px` }}
      role="img"
      aria-label={label}
    >
      {children}
    </svg>
  );
}

// Number lines.

const NL_W = 360;
const NL_PAD = 22;

/** Where a value sits along a number line, in the drawing's units. */
const nlX = (line: NumberLinePic, v: number) =>
  NL_PAD + ((v - line.min) / (line.max - line.min)) * (NL_W - 2 * NL_PAD);

/** The tick nearest a position along the line. */
export function snapToTick(line: NumberLinePic, v: number): number {
  const n = Math.round((v - line.min) / line.step);
  const max = Math.round((line.max - line.min) / line.step);
  return Number.parseFloat((line.min + Math.min(max, Math.max(0, n)) * line.step).toFixed(6));
}

export function NumberLine({
  line,
  extra = [],
  onTap,
  label,
}: {
  line: NumberLinePic;
  /** Marks added by the screen, such as the pupil's own. */
  extra?: NonNullable<NumberLinePic["marks"]>;
  onTap?: (value: number) => void;
  label?: string;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState<number>();
  const ticks = Math.round((line.max - line.min) / line.step);
  const every = line.every ?? 1;
  const fractions = line.denominator !== undefined;
  const y = fractions ? 64 : 58;
  const height = fractions ? 112 : 96;
  const marks = [...(line.marks ?? []), ...extra];

  const valueAt = (e: PointerEvent<SVGSVGElement>) => {
    const ctm = svgRef.current?.getScreenCTM();
    if (!ctm) return undefined;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    return snapToTick(
      line,
      line.min + ((p.x - NL_PAD) / (NL_W - 2 * NL_PAD)) * (line.max - line.min),
    );
  };
  const key = (e: KeyboardEvent<SVGSVGElement>) => {
    if (!onTap) return;
    const at = cursor ?? line.min;
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      setCursor(snapToTick(line, at + (e.key === "ArrowRight" ? line.step : -line.step)));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onTap(at);
    }
  };

  return (
    <div className="graph-wrap">
      <svg
        ref={svgRef}
        className={`pic number-line${onTap ? " tappable" : ""}`}
        viewBox={`0 0 ${NL_W} ${height}`}
        role={onTap ? "application" : "img"}
        aria-label={
          label ??
          `A number line from ${numberText(line.min)} to ${numberText(line.max)}${marks.length ? `, marked at ${marks.map((m) => m.label ?? numberText(m.at)).join(", ")}` : ""}.`
        }
        tabIndex={onTap ? 0 : undefined}
        onPointerMove={
          onTap
            ? (e) => {
                const v = valueAt(e);
                if (v !== undefined) setCursor(v);
              }
            : undefined
        }
        onPointerUp={
          onTap
            ? (e) => {
                const v = valueAt(e);
                if (v !== undefined) onTap(v);
              }
            : undefined
        }
        onKeyDown={key}
      >
        {onTap && <rect x="0" y="0" width={NL_W} height={height} fill="transparent" />}
        <line className="nl-axis" x1={NL_PAD - 10} x2={NL_W - NL_PAD + 10} y1={y} y2={y} />
        {line.interval && (
          <g className="nl-interval">
            {/* An end left out runs off the line, with an arrow. */}
            <line
              x1={line.interval.from === undefined ? NL_PAD - 12 : nlX(line, line.interval.from)}
              x2={line.interval.to === undefined ? NL_W - NL_PAD + 12 : nlX(line, line.interval.to)}
              y1={y - 14}
              y2={y - 14}
            />
            {line.interval.from === undefined && (
              <path className="nl-arrow" d={`M${NL_PAD - 18} ${y - 14} l9 -6 v12 z`} />
            )}
            {line.interval.to === undefined && (
              <path className="nl-arrow" d={`M${NL_W - NL_PAD + 18} ${y - 14} l-9 -6 v12 z`} />
            )}
            {(
              [
                [line.interval.from, line.interval.fromClosed],
                [line.interval.to, line.interval.toClosed],
              ] as const
            ).map(([at, closed], i) =>
              at === undefined ? null : (
                <g key={i}>
                  <line
                    className="nl-drop"
                    x1={nlX(line, at)}
                    x2={nlX(line, at)}
                    y1={y - 14}
                    y2={y}
                  />
                  <circle
                    cx={nlX(line, at)}
                    cy={y - 14}
                    r="6"
                    className={closed ? "closed" : "open"}
                  />
                </g>
              ),
            )}
          </g>
        )}
        {Array.from({ length: ticks + 1 }, (_, i) => {
          const v = line.min + i * line.step;
          const x = nlX(line, v);
          const labelled = every === 0 ? i === 0 || i === ticks : i % every === 0;
          const parts =
            fractions && line.denominator ? fractionParts(v, line.denominator) : undefined;
          return (
            <g key={i}>
              <line
                className="nl-tick"
                x1={x}
                x2={x}
                y1={y - (labelled ? 8 : 5)}
                y2={y + (labelled ? 8 : 5)}
              />
              {labelled &&
                (parts?.num ? (
                  <g className="nl-label">
                    <text x={x} y={y + 24} textAnchor="middle">
                      {parts.num}
                    </text>
                    <line x1={x - 7} x2={x + 7} y1={y + 29} y2={y + 29} />
                    <text x={x} y={y + 43} textAnchor="middle">
                      {parts.den}
                    </text>
                  </g>
                ) : (
                  <text className="nl-label" x={x} y={y + 26} textAnchor="middle">
                    {parts?.whole ?? numberText(v)}
                  </text>
                ))}
            </g>
          );
        })}
        {(line.jumps ?? []).map((j, i) => {
          const x1 = nlX(line, j.from);
          const x2 = nlX(line, j.to);
          const top = y - 10 - Math.min(34, Math.abs(x2 - x1) / 2.4);
          return (
            <g key={i} className="nl-jump">
              <path d={`M${x1} ${y - 4} Q${(x1 + x2) / 2} ${top - 8} ${x2} ${y - 4}`} />
              {j.label && (
                <text x={(x1 + x2) / 2} y={top - 6} textAnchor="middle">
                  {j.label}
                </text>
              )}
            </g>
          );
        })}
        {marks.map((m, i) => (
          <g key={i} className={`nl-mark tone-${m.tone ?? "given"}`}>
            <circle cx={nlX(line, m.at)} cy={y} r="7" />
            {m.label && (
              <text x={nlX(line, m.at)} y={y - 15} textAnchor="middle">
                {m.label}
              </text>
            )}
          </g>
        ))}
        {onTap && cursor !== undefined && (
          <circle className="nl-cursor" cx={nlX(line, cursor)} cy={y} r="11" />
        )}
      </svg>
      {onTap && (
        <p className="graph-readout" aria-live="polite">
          {cursor !== undefined ? numberText(cursor) : " "}
        </p>
      )}
    </div>
  );
}

// Angles round a point.

const rad = (deg: number) => (deg * Math.PI) / 180;

function Angles({ pic }: { pic: AnglesPic }) {
  const R = 92;
  const cx = 130;
  const cy = 110;
  const end = (deg: number, r: number) => ({
    x: cx + r * Math.cos(rad(deg)),
    y: cy - r * Math.sin(rad(deg)),
  });
  // Crop to what is drawn, so a straight line's angles do not leave an empty half.
  const all = [...pic.rays.map((d) => end(d, R + 4)), { x: cx, y: cy }];
  const arcsAt = pic.arcs.map((a) => {
    const from = pic.rays[a.from] ?? 0;
    let to = pic.rays[a.to] ?? 0;
    if (to <= from) to += 360;
    return { ...a, start: from, sweep: to - from };
  });
  for (const a of arcsAt) all.push(end(a.start + a.sweep / 2, 66));
  const minX = Math.min(...all.map((p) => p.x)) - 26;
  const maxX = Math.max(...all.map((p) => p.x)) + 26;
  const minY = Math.min(...all.map((p) => p.y)) - 20;
  const maxY = Math.max(...all.map((p) => p.y)) + 20;
  return (
    <svg
      className="pic"
      viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}
      style={{ maxWidth: `${(maxX - minX) * 1.3}px` }}
      role="img"
      aria-label={`Angles at a point: ${pic.arcs.map((a) => a.label).join(", ")}.`}
    >
      {arcsAt.map((a, i) => {
        const r = a.sweep > 200 ? 22 : 30 + (i % 2) * 6;
        const p1 = end(a.start, r);
        const p2 = end(a.start + a.sweep, r);
        const mid = end(a.start + a.sweep / 2, r + 24);
        const right = Math.abs(a.sweep - 90) < 1e-9;
        const corner = end(a.start + 45, 14 * Math.SQRT2);
        const side1 = end(a.start, 14);
        const side2 = end(a.start + 90, 14);
        return (
          <g key={i} className={`pic-arc${a.find ? " find" : ""}`}>
            {right ? (
              <path d={`M${side1.x} ${side1.y} L${corner.x} ${corner.y} L${side2.x} ${side2.y}`} />
            ) : (
              <path
                d={`M${p1.x} ${p1.y} A${r} ${r} 0 ${a.sweep > 180 ? 1 : 0} 0 ${p2.x} ${p2.y}`}
              />
            )}
            <text x={mid.x} y={mid.y + 5} textAnchor="middle">
              {a.label}
            </text>
          </g>
        );
      })}
      {pic.rays.map((d, i) => {
        const p = end(d, R);
        return <line key={i} className="pic-ray" x1={cx} y1={cy} x2={p.x} y2={p.y} />;
      })}
      <circle className="pic-centre" cx={cx} cy={cy} r="3.5" />
    </svg>
  );
}

// Shapes.

/** Sides to label by tapping: what is on each, how each was marked, and what a tap does. */
export interface SidePick {
  marks: (string | undefined)[];
  states?: ("right" | "wrong" | undefined)[];
  onSide: (side: number) => void;
  disabled?: boolean;
}

/** An angle's label: a letter or "?" is to be found, and drawn in the "find" colour. */
const toFind = (label: string) => !/\d|θ/.test(label);

export function Shape({ pic, pick }: { pic: ShapePic; pick?: SidePick }) {
  const extraPts = [
    ...(pic.mirrors ?? []).flat(),
    ...(pic.dashed ?? []).flat(),
    ...(pic.dots ?? []),
  ];
  const { scr, sideLabels, angleMarks, names, boxes, sx, sy } = layoutShape(
    pic,
    pick ? pick.marks : undefined,
  );
  const corner = (i: number) => scr[(i + scr.length) % scr.length] ?? { x: 0, y: 0 };

  const m = 10;
  const xs = [...scr.map((p) => p.x), ...extraPts.map((p) => sx(p.x))];
  const ys = [...scr.map((p) => p.y), ...extraPts.map((p) => sy(p.y))];
  const left = Math.min(...xs, ...boxes.map((b) => b.x - b.hw)) - m;
  const right = Math.max(...xs, ...boxes.map((b) => b.x + b.hw)) + m;
  const top = Math.min(...ys, ...boxes.map((b) => b.y - b.hh)) - m;
  const bottom = Math.max(...ys, ...boxes.map((b) => b.y + b.hh)) + m;
  const width = right - left;
  const height = bottom - top;
  const at = (p: Pt) => `${p.x},${p.y}`;
  const line = (a: Point, b: Point) => ({ x1: sx(a.x), y1: sy(a.y), x2: sx(b.x), y2: sy(b.y) });

  const body = (
    <g transform={`translate(${-left} ${-top})`}>
      <polygon className="pic-shape" points={scr.map(at).join(" ")} />
      {(pic.dashed ?? []).map(([a, b], i) => (
        <line key={`d${i}`} className="pic-dashed" {...line(a, b)} />
      ))}
      {(pic.mirrors ?? []).map(([a, b], i) => (
        <line key={`m${i}`} className="pic-mirror" {...line(a, b)} />
      ))}
      {(pic.square ?? []).map((i) => {
        const p = corner(i);
        const unitTo = (q: Pt) => {
          const l = Math.hypot(q.x - p.x, q.y - p.y) || 1;
          return { x: ((q.x - p.x) / l) * 12, y: ((q.y - p.y) / l) * 12 };
        };
        const u = unitTo(corner(i - 1));
        const v = unitTo(corner(i + 1));
        return (
          <path
            key={`s${i}`}
            className="pic-square"
            d={`M${p.x + u.x} ${p.y + u.y} L${p.x + u.x + v.x} ${p.y + u.y + v.y} L${p.x + v.x} ${p.y + v.y}`}
          />
        );
      })}
      {angleMarks.map((mark, i) =>
        mark ? (
          <g key={`a${i}`} className={`pic-angle-mark${toFind(mark.text) ? " find" : ""}`}>
            {mark.arc && (
              <path
                d={`M${mark.arc.from.x} ${mark.arc.from.y} A${mark.arc.r} ${mark.arc.r} 0 ${mark.arc.large ? 1 : 0} ${mark.arc.sweep ? 1 : 0} ${mark.arc.to.x} ${mark.arc.to.y}`}
              />
            )}
            <text className="pic-angle" x={mark.label.x} y={mark.label.y + 5} textAnchor="middle">
              {mark.text}
            </text>
          </g>
        ) : null,
      )}
      {pick &&
        scr.map((a, i) => {
          const b = corner(i + 1);
          const state = pick.states?.[i];
          const mark = pick.marks[i];
          return (
            <g
              key={`p${i}`}
              className={`pic-pick${mark ? " marked" : ""}${state ? ` ${state}` : ""}`}
              role="button"
              tabIndex={pick.disabled ? -1 : 0}
              aria-label={`Side ${i + 1}${mark ? `: ${mark}` : ", not labelled"}`}
              aria-disabled={pick.disabled ?? false}
              onClick={() => !pick.disabled && pick.onSide(i)}
              onKeyDown={(e) => {
                if (pick.disabled || (e.key !== "Enter" && e.key !== " ")) return;
                e.preventDefault();
                pick.onSide(i);
              }}
            >
              <line className="pic-pick-line" x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
              <line className="pic-pick-hit" x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
            </g>
          );
        })}
      {sideLabels.map((l, i) =>
        l ? (
          <text
            key={`l${i}`}
            className={`pic-label${pick?.marks[i] ? ` pic-pick-mark${pick.states?.[i] ? ` ${pick.states[i]}` : ""}` : ""}`}
            x={l.box.x}
            y={l.box.y + 5.5}
            textAnchor="middle"
          >
            {l.text}
          </text>
        ) : null,
      )}
      {names.map((n, i) =>
        n ? (
          <text key={`n${i}`} className="pic-label" x={n.box.x} y={n.box.y + 6} textAnchor="middle">
            {n.name}
          </text>
        ) : null,
      )}
      {(pic.dots ?? []).map((p, i) => (
        <circle key={`o${i}`} className="pic-centre" cx={sx(p.x)} cy={sy(p.y)} r="4" />
      ))}
    </g>
  );
  if (pick)
    return (
      <svg
        className="pic pic-picking"
        viewBox={`0 0 ${width} ${height}`}
        style={{ maxWidth: `${width * 1.15}px` }}
        role="group"
        aria-label={`${shapeLabel(pic)} Tap a side to label it.`}
      >
        {body}
      </svg>
    );
  return (
    <Svg width={width} height={height} label={shapeLabel(pic)}>
      {body}
    </Svg>
  );
}

function shapeLabel(pic: ShapePic): string {
  const sides = (pic.sides ?? []).filter(Boolean);
  const angles = (pic.angles ?? []).filter(Boolean);
  return `A ${pic.points.length}-sided shape${sides.length ? `, sides labelled ${sides.join(", ")}` : ""}${angles.length ? `, angles labelled ${angles.join(", ")}` : ""}${pic.mirrors?.length ? `, with ${pic.mirrors.length} line${pic.mirrors.length > 1 ? "s" : ""} of symmetry` : ""}.`;
}

// Bar models.

function Bars({ pic }: { pic: BarsPic }) {
  const most = Math.max(...pic.rows.map((r) => r.parts));
  const labelW = Math.max(...pic.rows.map((r) => r.label.length)) * 9 + 14;
  const part = Math.min(46, (340 - labelW) / most);
  const top = pic.total ? 34 : 6;
  const rowH = 44;
  const width = labelW + part * most + 8;
  const height = top + pic.rows.length * rowH;
  return (
    <Svg
      width={width}
      height={height}
      label={`Bar model: ${pic.rows.map((r) => `${r.label}, ${r.parts} parts`).join("; ")}${pic.total ? `; total ${pic.total}` : ""}.`}
    >
      {pic.total && (
        <g className="pic-brace">
          <path d={`M${labelW} ${top - 6} v-8 H${labelW + part * most} v8`} />
          <text x={labelW + (part * most) / 2} y={top - 19} textAnchor="middle">
            {pic.total}
          </text>
        </g>
      )}
      {pic.rows.map((r, i) => (
        <g key={i} transform={`translate(0 ${top + i * rowH})`}>
          <text className="pic-label" x={labelW - 10} y={rowH / 2 + 3} textAnchor="end">
            {r.label}
          </text>
          {Array.from({ length: r.parts }, (_, j) => (
            <g key={j}>
              <rect
                className="pic-part"
                x={labelW + j * part}
                y="4"
                width={part}
                height={rowH - 12}
              />
              {/* Shaded in part when the shading ends partway, as in a pictogram's half symbol. */}
              <rect
                className="pic-part shaded"
                x={labelW + j * part}
                y="4"
                width={part * Math.max(0, Math.min(1, (r.shaded ?? r.parts) - j))}
                height={rowH - 12}
              />
              <rect
                className="pic-part outline"
                x={labelW + j * part}
                y="4"
                width={part}
                height={rowH - 12}
              />
              {r.each && (
                <text
                  className="pic-part-label"
                  x={labelW + j * part + part / 2}
                  y={rowH / 2 + 3}
                  textAnchor="middle"
                >
                  {r.each}
                </text>
              )}
            </g>
          ))}
        </g>
      ))}
    </Svg>
  );
}

// A grid of squares.

export function Grid({
  pic,
  shadedCells,
  onCell,
}: {
  pic: GridPic;
  /** Which squares are shaded, when the pupil is shading them. */
  shadedCells?: ReadonlySet<number>;
  onCell?: (i: number) => void;
}) {
  const left = pic.rowLabels ? 30 : 2;
  const top = pic.colLabels ? 26 : 2;
  const size = Math.min(52, (300 - left) / pic.cols, 300 / pic.rows);
  const width = left + pic.cols * size + 2;
  const height = top + pic.rows * size + 2;
  const isShaded = (i: number) =>
    shadedCells ? shadedCells.has(i) : pic.cells ? pic.cells.includes(i) : i < pic.shaded;
  const count = shadedCells ? shadedCells.size : (pic.cells?.length ?? pic.shaded);
  return (
    <Svg
      width={width}
      height={height}
      className={onCell ? "tappable" : undefined}
      label={`A grid of ${pic.cols * pic.rows} squares, ${count} shaded.`}
    >
      {pic.colLabels?.map((l, i) => (
        <text
          key={`c${i}`}
          className="pic-label small"
          x={left + (i + 0.5) * size}
          y={top - 8}
          textAnchor="middle"
        >
          {l}
        </text>
      ))}
      {pic.rowLabels?.map((l, i) => (
        <text
          key={`r${i}`}
          className="pic-label small"
          x={left - 8}
          y={top + (i + 0.5) * size + 5}
          textAnchor="end"
        >
          {l}
        </text>
      ))}
      {Array.from({ length: pic.cols * pic.rows }, (_, i) => (
        <rect
          key={i}
          className={`pic-cell${isShaded(i) ? " shaded" : ""}`}
          x={left + (i % pic.cols) * size}
          y={top + Math.floor(i / pic.cols) * size}
          width={size}
          height={size}
          {...(onCell ? { onPointerDown: () => onCell(i) } : {})}
        />
      ))}
      {pic.values &&
        Array.from({ length: pic.cols * pic.rows }, (_, i) => (
          <text
            key={`v${i}`}
            className="pic-label small grid-value"
            x={left + ((i % pic.cols) + 0.5) * size}
            y={top + (Math.floor(i / pic.cols) + 0.5) * size + 5}
            textAnchor="middle"
          >
            {pic.values?.[i]}
          </text>
        ))}
    </Svg>
  );
}

// A cuboid, drawn with depth going up and to the right.

export function Cuboid({ pic, layers }: { pic: CuboidPic; layers?: number }) {
  const { w, d, h } = pic;
  const shown = layers ?? h;
  const U = Math.min(34, 220 / (w + d * 0.6), 170 / (h + d * 0.4));
  const dx = 0.55 * U;
  const dy = 0.38 * U;
  const ox = 14;
  const oy = 14 + d * dy + h * U;
  const P = (x: number, y: number, z: number) => `${ox + x * U + z * dx},${oy - y * U - z * dy}`;
  const face = (pts: string[], cls: string, key: string) => (
    <polygon key={key} className={cls} points={pts.join(" ")} />
  );
  const parts: ReactNode[] = [];
  if (pic.cubes) {
    for (let z = d - 1; z >= 0; z--)
      for (let y = 0; y < shown; y++)
        for (let x = 0; x < w; x++) {
          const k = `${x}-${y}-${z}`;
          parts.push(
            face(
              [P(x, y, z), P(x + 1, y, z), P(x + 1, y + 1, z), P(x, y + 1, z)],
              "cube-front",
              `f${k}`,
            ),
            face(
              [P(x, y + 1, z), P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)],
              "cube-top",
              `t${k}`,
            ),
            face(
              [P(x + 1, y, z), P(x + 1, y, z + 1), P(x + 1, y + 1, z + 1), P(x + 1, y + 1, z)],
              "cube-side",
              `s${k}`,
            ),
          );
        }
    if (shown < h)
      parts.unshift(
        face([P(0, 0, 0), P(w, 0, 0), P(w, h, 0), P(0, h, 0)], "cube-ghost", "g1"),
        face([P(0, h, 0), P(w, h, 0), P(w, h, d), P(0, h, d)], "cube-ghost", "g2"),
        face([P(w, 0, 0), P(w, 0, d), P(w, h, d), P(w, h, 0)], "cube-ghost", "g3"),
      );
  } else {
    parts.push(
      face([P(0, 0, 0), P(w, 0, 0), P(w, h, 0), P(0, h, 0)], "cube-front", "f"),
      face([P(0, h, 0), P(w, h, 0), P(w, h, d), P(0, h, d)], "cube-top", "t"),
      face([P(w, 0, 0), P(w, 0, d), P(w, h, d), P(w, h, 0)], "cube-side", "s"),
    );
  }
  const width = ox * 2 + w * U + d * dx + 30;
  const height = oy + 30;
  const [lw, ld, lh] = pic.labels ?? [];
  const xy = (x: number, y: number, z: number) => {
    const [a = "0", b = "0"] = P(x, y, z).split(",");
    return { x: Number(a), y: Number(b) };
  };
  const bottom = xy(w / 2, 0, 0);
  const side = xy(0, h / 2, 0);
  const depth = xy(w, 0, d / 2);
  return (
    <Svg
      width={width}
      height={height}
      label={`A cuboid ${w} by ${d} by ${h}${layers !== undefined ? `, ${shown} layers built` : ""}.`}
    >
      {parts}
      {lw && (
        <text className="pic-label" x={bottom.x} y={bottom.y + 20} textAnchor="middle">
          {lw}
        </text>
      )}
      {lh && (
        <text className="pic-label" x={side.x - 8} y={side.y + 5} textAnchor="end">
          {lh}
        </text>
      )}
      {ld && (
        <text className="pic-label" x={depth.x + 10} y={depth.y + 12}>
          {ld}
        </text>
      )}
    </Svg>
  );
}

// A spinner.

export function Spinner({ pic, turn = 0 }: { pic: SpinnerPic; turn?: number }) {
  const total = pic.sectors.reduce((a, s) => a + s.size, 0);
  const r = 90;
  const c = 110;
  let start = 0;
  return (
    <Svg
      width={220}
      height={230}
      label={`A spinner: ${pic.sectors.map((s) => `${s.label} ${s.size} of ${total}`).join(", ")}.`}
    >
      <g
        className="spinner-wheel"
        style={{ transform: `rotate(${turn}deg)`, transformOrigin: `${c}px ${c + 10}px` }}
      >
        {pic.sectors.map((s, i) => {
          const a0 = (start / total) * 360;
          const a1 = ((start + s.size) / total) * 360;
          start += s.size;
          const p0 = { x: c + r * Math.sin(rad(a0)), y: c + 10 - r * Math.cos(rad(a0)) };
          const p1 = { x: c + r * Math.sin(rad(a1)), y: c + 10 - r * Math.cos(rad(a1)) };
          const mid = (a0 + a1) / 2;
          const lp = {
            x: c + r * 0.62 * Math.sin(rad(mid)),
            y: c + 10 - r * 0.62 * Math.cos(rad(mid)),
          };
          return (
            <g key={i}>
              {pic.sectors.length === 1 ? (
                <circle
                  cx={c}
                  cy={c + 10}
                  r={r}
                  fill={sectorColour(s.label, 0)}
                  className="spinner-sector"
                />
              ) : (
                <path
                  className="spinner-sector"
                  fill={sectorColour(s.label, i)}
                  d={`M${c} ${c + 10} L${p0.x} ${p0.y} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${p1.x} ${p1.y} Z`}
                />
              )}
              <text className="spinner-label" x={lp.x} y={lp.y + 6} textAnchor="middle">
                {s.label}
              </text>
            </g>
          );
        })}
      </g>
      {!pic.pie && <path className="spinner-pointer" d={`M${c - 10} 2 L${c + 10} 2 L${c} 26 Z`} />}
      <circle className="pic-centre" cx={c} cy={c + 10} r="6" />
    </Svg>
  );
}

// A growing pattern.

function Stacks({ pic }: { pic: StacksPic }) {
  const most = Math.max(...pic.counts);
  const size = Math.min(18, 150 / most);
  const colW = Math.max(54, size * 2);
  const width = colW * pic.counts.length + 10;
  const height = most * size + 40;
  return (
    <Svg width={width} height={height} label={`A pattern: ${pic.counts.join(", ")} squares.`}>
      {pic.counts.map((n, i) => (
        <g key={i}>
          {Array.from({ length: n }, (_, j) => (
            <rect
              key={j}
              className="pic-cell shaded"
              x={5 + i * colW + colW / 2 - size / 2}
              y={height - 28 - (j + 1) * size}
              width={size}
              height={size}
            />
          ))}
          <text
            className="pic-label small"
            x={5 + i * colW + colW / 2}
            y={height - 8}
            textAnchor="middle"
          >
            {pic.labels?.[i] ?? `Term ${i + 1}`}
          </text>
        </g>
      ))}
    </Svg>
  );
}

// A ruler.

function Ruler({ pic }: { pic: RulerPic }) {
  const lo = Math.floor(pic.from);
  const hi = Math.ceil(pic.to) + 1;
  const k = 320 / (hi - lo);
  const x = (cm: number) => 16 + (cm - lo) * k;
  return (
    <Svg
      width={352}
      height={100}
      label={`A line on a ruler, from ${numberText(pic.from)} cm to ${numberText(pic.to)} cm.`}
    >
      <line className="pic-segment" x1={x(pic.from)} x2={x(pic.to)} y1="18" y2="18" />
      <line className="pic-segment-end" x1={x(pic.from)} x2={x(pic.from)} y1="10" y2="26" />
      <line className="pic-segment-end" x1={x(pic.to)} x2={x(pic.to)} y1="10" y2="26" />
      <rect className="pic-ruler" x="8" y="34" width="336" height="58" rx="6" />
      {Array.from({ length: (hi - lo) * 10 + 1 }, (_, i) => {
        const cm = lo + i / 10;
        const big = i % 10 === 0;
        const half = i % 5 === 0;
        return (
          <g key={i}>
            <line
              className="pic-ruler-tick"
              x1={x(cm)}
              x2={x(cm)}
              y1="34"
              y2={34 + (big ? 18 : half ? 12 : 7)}
            />
            {big && (
              <text className="pic-label small" x={x(cm)} y="72" textAnchor="middle">
                {cm}
              </text>
            )}
          </g>
        );
      })}
      <text className="pic-label small" x="336" y="86" textAnchor="end">
        cm
      </text>
    </Svg>
  );
}

// A place value chart.

const COLUMN_NAMES: Record<number, string> = {
  6: "M",
  5: "HTh",
  4: "TTh",
  3: "Th",
  2: "H",
  1: "T",
  0: "O",
  [-1]: "t",
  [-2]: "h",
  [-3]: "th",
  [-4]: "tth",
  [-5]: "hth",
  [-6]: "mth",
};

/** A number's digit in each column, by power of ten. */
export function digitsByColumn(number: string): Map<number, string> {
  const [whole = "", part = ""] = number.replace(/[^0-9.]/g, "").split(".");
  const out = new Map<number, string>();
  [...whole].reverse().forEach((d, i) => out.set(i, d));
  [...part].forEach((d, i) => out.set(-1 - i, d));
  return out;
}

function PlaceValue({ pic }: { pic: PlaceValuePic }) {
  const digits = digitsByColumn(pic.number);
  const cols: number[] = [];
  for (let p = pic.from; p >= pic.to; p--) cols.push(p);
  return (
    <table className="ul-table place-value" aria-label={`${pic.number} in a place value chart`}>
      <thead>
        <tr>
          {cols.map((p) => (
            <th
              key={p}
              scope="col"
              className={`${p === pic.highlight ? "hl" : ""}${p === -1 ? " point" : ""}`}
            >
              {COLUMN_NAMES[p] ?? `10^${p}`}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {cols.map((p) => (
            <td key={p} className={`${p === pic.highlight ? "hl" : ""}${p === -1 ? " point" : ""}`}>
              {digits.get(p) ?? (p >= 0 && p < Math.max(...digits.keys()) ? "0" : "")}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}

// Bar charts and vertical line charts.

function BarChart({ pic }: { pic: BarChartPic }) {
  const left = 40;
  const top = 12;
  const plotH = 170;
  const barGap = 300 / pic.bars.length;
  const width = left + barGap * pic.bars.length + 10;
  const height = top + plotH + 34;
  const y = (v: number) => top + plotH - (v / pic.max) * plotH;
  const marks = Array.from({ length: Math.floor(pic.max / pic.step) + 1 }, (_, i) => i * pic.step);
  return (
    <Svg
      width={width}
      height={height}
      label={`A ${pic.lines ? "vertical line" : "bar"} chart: ${pic.bars.map((b) => `${b.label} ${numberText(b.value)}`).join(", ")}.`}
    >
      {marks.map((m) => (
        <g key={m}>
          <line className="chart-grid" x1={left} x2={width - 6} y1={y(m)} y2={y(m)} />
          <text className="pic-label small" x={left - 6} y={y(m) + 4} textAnchor="end">
            {numberText(m)}
          </text>
        </g>
      ))}
      {pic.bars.map((b, i) => {
        const cx = left + barGap * i + barGap / 2;
        return (
          <g key={i}>
            {pic.lines ? (
              <line className="chart-stick" x1={cx} x2={cx} y1={y(0)} y2={y(b.value)} />
            ) : (
              <rect
                className="chart-bar"
                x={cx - barGap * 0.32}
                y={y(b.value)}
                width={barGap * 0.64}
                height={y(0) - y(b.value)}
              />
            )}
            <text className="pic-label small" x={cx} y={y(0) + 18} textAnchor="middle">
              {b.label}
            </text>
          </g>
        );
      })}
      <line className="chart-axis" x1={left} x2={width - 6} y1={y(0)} y2={y(0)} />
      <line className="chart-axis" x1={left} x2={left} y1={top - 4} y2={y(0)} />
      {pic.axis && (
        <text className="pic-label small" x={left + 6} y={top + 4}>
          {pic.axis}
        </text>
      )}
    </Svg>
  );
}

// Free drawings: constructions, parallel lines, solids.

function Drawing({ pic }: { pic: DrawingPic }) {
  const pts: Point[] = [];
  for (const it of pic.items) {
    if ("line" in it) pts.push(...it.line);
    else if ("arc" in it)
      for (let a = it.from; a <= it.to; a += 10)
        pts.push({
          x: it.arc.x + it.r * Math.cos(rad(a)),
          y: it.arc.y + (it.ry ?? it.r) * Math.sin(rad(a)),
        });
    else if ("dot" in it) pts.push(it.dot);
    else if ("angle" in it) pts.push(it.angle);
    else pts.push(it.at);
  }
  // A fixed frame keeps a drawing still while a construction adds to it step by step.
  if (pic.frame)
    pts.push({ x: pic.frame.xMin, y: pic.frame.yMin }, { x: pic.frame.xMax, y: pic.frame.yMax });
  const minX = Math.min(...pts.map((p) => p.x));
  const maxX = Math.max(...pts.map((p) => p.x));
  const minY = Math.min(...pts.map((p) => p.y));
  const maxY = Math.max(...pts.map((p) => p.y));
  const k = Math.min(260 / (maxX - minX || 1), 200 / (maxY - minY || 1));
  const pad = 22;
  const sx = (x: number) => pad + (x - minX) * k;
  const sy = (y: number) => pad + (maxY - y) * k;
  // Angles are marked on screen, and the drawing grows to fit their labels.
  const marks = pic.items.map((it) => {
    if (!("angle" in it)) return null;
    const p = { x: sx(it.angle.x), y: sy(it.angle.y) };
    const arm = (deg: number) => ({
      x: p.x + 50 * Math.cos(rad(deg)),
      y: p.y - 50 * Math.sin(rad(deg)),
    });
    return angleMark(p, arm(it.from), arm(it.to), it.label);
  });
  const w0 = (maxX - minX) * k + 2 * pad;
  const h0 = (maxY - minY) * k + 2 * pad;
  const labels = marks.flatMap((m) => (m ? [m.label] : []));
  const left = Math.min(0, ...labels.map((b) => b.x - b.hw - 6));
  const top = Math.min(0, ...labels.map((b) => b.y - b.hh - 6));
  const right = Math.max(w0, ...labels.map((b) => b.x + b.hw + 6));
  const bottom = Math.max(h0, ...labels.map((b) => b.y + b.hh + 6));
  const named = pic.items.flatMap((i) => ("text" in i ? [i.text] : "angle" in i ? [i.label] : []));
  return (
    <Svg
      width={right - left}
      height={bottom - top}
      label={`A drawing${named.length ? `, labelled ${named.join(", ")}` : ""}.`}
    >
      <g transform={`translate(${-left} ${-top})`}>
        {pic.items.map((it, i) => {
          const mark = marks[i];
          if ("angle" in it && mark) {
            const arc = mark.arc;
            return (
              <g key={i} className={`pic-angle-mark${toFind(it.label) ? " find" : ""}`}>
                {arc && (
                  <path
                    d={`M${arc.from.x} ${arc.from.y} A${arc.r} ${arc.r} 0 ${arc.large ? 1 : 0} ${arc.sweep ? 1 : 0} ${arc.to.x} ${arc.to.y}`}
                  />
                )}
                <text
                  className="pic-angle"
                  x={mark.label.x}
                  y={mark.label.y + 5}
                  textAnchor="middle"
                >
                  {it.label}
                </text>
              </g>
            );
          }
          if ("angle" in it) return null;
          if ("line" in it) {
            const [a, b] = it.line;
            return (
              <line
                key={i}
                className={`draw-line tone-${it.tone ?? "main"}${it.dashed ? " dashed" : ""}`}
                x1={sx(a.x)}
                y1={sy(a.y)}
                x2={sx(b.x)}
                y2={sy(b.y)}
                markerEnd={it.arrow ? "url(#draw-arrow)" : undefined}
              />
            );
          }
          if ("arc" in it) {
            // An oval when ry is set, as for the ends of a cylinder.
            const ry = it.ry ?? it.r;
            const p1 = {
              x: it.arc.x + it.r * Math.cos(rad(it.from)),
              y: it.arc.y + ry * Math.sin(rad(it.from)),
            };
            const p2 = {
              x: it.arc.x + it.r * Math.cos(rad(it.to)),
              y: it.arc.y + ry * Math.sin(rad(it.to)),
            };
            const className = `draw-arc${it.ry !== undefined ? " oval" : ""}${it.dashed ? " dashed" : ""}`;
            // A whole turn is a circle: an arc that ends where it starts draws nothing.
            if (it.to - it.from >= 360)
              return (
                <ellipse
                  key={i}
                  className={className}
                  cx={sx(it.arc.x)}
                  cy={sy(it.arc.y)}
                  rx={it.r * k}
                  ry={ry * k}
                />
              );
            return (
              <path
                key={i}
                className={className}
                d={`M${sx(p1.x)} ${sy(p1.y)} A${it.r * k} ${ry * k} 0 ${it.to - it.from > 180 ? 1 : 0} 0 ${sx(p2.x)} ${sy(p2.y)}`}
              />
            );
          }
          if ("dot" in it)
            return (
              <circle key={i} className="pic-centre" cx={sx(it.dot.x)} cy={sy(it.dot.y)} r="4" />
            );
          return (
            <text
              key={i}
              className={`pic-label${it.tone === "find" ? " find" : ""}`}
              x={sx(it.at.x)}
              y={sy(it.at.y) + 6}
              textAnchor="middle"
            >
              {it.text}
            </text>
          );
        })}
        <defs>
          <marker
            id="draw-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0 0 L10 5 L0 10 z" className="draw-arrowhead" />
          </marker>
        </defs>
      </g>
    </Svg>
  );
}

// A Venn diagram.

function Venn({ pic }: { pic: VennPic }) {
  const list = (items: string[], x: number) =>
    items.map((t, i) => (
      <text
        key={`${x}-${i}`}
        className="pic-label venn-item"
        x={x}
        y={118 + (i - (items.length - 1) / 2) * 22}
        textAnchor="middle"
      >
        {t}
      </text>
    ));
  return (
    <Svg
      width={340}
      height={230}
      label={`A Venn diagram. ${pic.a} only: ${pic.onlyA.join(", ") || "nothing"}. Both: ${pic.both.join(", ") || "nothing"}. ${pic.b} only: ${pic.onlyB.join(", ") || "nothing"}.${pic.neither?.length ? ` Neither: ${pic.neither.join(", ")}.` : ""}`}
    >
      <rect className="venn-frame" x="4" y="4" width="332" height="222" rx="10" />
      <circle className="venn-a" cx="128" cy="118" r="86" />
      <circle className="venn-b" cx="212" cy="118" r="86" />
      <text className="pic-label" x="84" y="30" textAnchor="middle">
        {pic.a}
      </text>
      <text className="pic-label" x="256" y="30" textAnchor="middle">
        {pic.b}
      </text>
      {list(pic.onlyA, 88)}
      {list(pic.both, 170)}
      {list(pic.onlyB, 252)}
      {(pic.neither ?? []).map((t, i) => (
        <text
          key={`n${i}`}
          className="pic-label venn-item"
          x={318 - i * 26}
          y="214"
          textAnchor="end"
        >
          {t}
        </text>
      ))}
    </Svg>
  );
}

// Dot patterns: triangular and square numbers.

function Dots({ pic }: { pic: DotsPic }) {
  const gap = 13;
  const terms = Array.from({ length: pic.terms }, (_, i) => i + 1);
  const widths = terms.map((n) => n * gap);
  const width = widths.reduce((a, b) => a + b + 22, 0) + 10;
  const height = pic.terms * gap + 34;
  let x0 = 12;
  return (
    <Svg
      width={width}
      height={height}
      label={`${pic.shape === "triangle" ? "Triangular" : "Square"} numbers as dots: ${terms.map((n) => (pic.shape === "triangle" ? (n * (n + 1)) / 2 : n * n)).join(", ")}.`}
    >
      {terms.map((n, t) => {
        const dots = [];
        for (let r = 0; r < n; r++) {
          const inRow = pic.shape === "triangle" ? r + 1 : n;
          for (let c = 0; c < inRow; c++)
            dots.push(
              <circle
                key={`${r}-${c}`}
                className="dot-pattern"
                cx={
                  x0 + c * gap + (pic.shape === "triangle" ? ((n - inRow) * gap) / 2 : 0) + gap / 2
                }
                cy={height - 30 - (n - 1 - r) * gap}
                r="4.5"
              />,
            );
        }
        const label = pic.shape === "triangle" ? (n * (n + 1)) / 2 : n * n;
        const g = (
          <g key={t}>
            {dots}
            <text
              className="pic-label small"
              x={x0 + (widths[t] ?? 0) / 2}
              y={height - 8}
              textAnchor="middle"
            >
              {label}
            </text>
          </g>
        );
        x0 += (widths[t] ?? 0) + 22;
        return g;
      })}
    </Svg>
  );
}
