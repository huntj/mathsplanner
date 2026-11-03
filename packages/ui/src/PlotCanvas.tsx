// Drawing on a diagram, in one of three ways:
// - arm: draw a protractor's second arm (tap where it should go);
// - rays: construct a triangle from two angles, as on paper: put the protractor on each end of
//   the given side, draw a line at the right angle, and the third vertex is where the lines cross;
// - points: tap to place each missing point.
// The arrow keys do the same as tapping. Points are kept in the diagram's own units through its
// frame, so marking compares them with the target directly.
import type { AnswerSpec, DiagramSpec } from "@mathsplanner/core";
import { drawDiagram, type Frame } from "@mathsplanner/diagrams";
import { useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

type Plot = Extract<AnswerSpec, { type: "plot" }>;
type Pt = [number, number];

interface Props {
  canvas: DiagramSpec;
  answer: Plot;
  points: Record<string, Pt>;
  setPoints: (points: Record<string, Pt>) => void;
  locked: boolean;
  reveal: boolean;
}

interface Target extends DiagramSpec {
  points?: Record<string, Pt>;
  polygons?: { vertices: string[] }[];
  segments?: { from: string; to: string }[];
  angles?: { vertex: string }[];
  angle?: number;
  baseline?: "left" | "right";
}

/** Length of a drawn protractor arm in px; the protractor's radius is 160. */
const ARM = 175;
const rad = (d: number) => (d * Math.PI) / 180;
const unit = ([x, y]: Pt): Pt => {
  const n = Math.hypot(x, y) || 1;
  return [x / n, y / n];
};
const cross = (a: Pt, b: Pt) => a[0] * b[1] - a[1] * b[0];

/** Where the rays p + t·u and q + s·v cross ahead of both starts, if they do. */
function meet(p: Pt, u: Pt, q: Pt, v: Pt): Pt | undefined {
  const d = cross(u, v);
  if (Math.abs(d) < 1e-9) return undefined;
  const w: Pt = [q[0] - p[0], q[1] - p[1]];
  const t = cross(w, v) / d;
  const s = cross(w, u) / d;
  return t > 0 && s > 0 ? [p[0] + t * u[0], p[1] + t * u[1]] : undefined;
}

const protractors = new Map<string, string>();

/** The protractor drawing (vertex at 0, 0), without its outer <svg>, to place on the canvas. */
function protractorShapes(baseline: "left" | "right"): string {
  const cached = protractors.get(baseline);
  if (cached !== undefined) return cached;
  const { svg } = drawDiagram({
    type: "measure",
    instrument: "protractor",
    angle: 90,
    baseline,
    hideSecondArm: true,
  });
  const shapes = svg
    .replace(/^<svg[^>]*>/, "")
    .replace(/<\/svg>$/, "")
    .replace(/<title>.*?<\/title>/, "");
  protractors.set(baseline, shapes);
  return shapes;
}

export function PlotCanvas({ canvas, answer, points, setPoints, locked, reveal }: Props) {
  const overlay = useRef<SVGSVGElement>(null);
  const target = answer.target as Target;
  const given = (canvas.points as Record<string, Pt> | undefined) ?? {};
  const givenNames = Object.keys(given);
  const mode: "arm" | "rays" | "points" =
    target.type === "measure"
      ? "arm"
      : answer.place.length === 1 &&
          givenNames.length === 2 &&
          givenNames.every((n) => target.angles?.some((a) => a.vertex === n))
        ? "rays"
        : "points";

  const [current, setCurrent] = useState(
    mode === "rays" ? (givenNames[0] ?? "") : (answer.place[0] ?? ""),
  );
  const [rays, setRays] = useState<Record<string, Pt>>({});
  const [showProtractor, setShowProtractor] = useState(true);

  const drawn = useMemo(() => {
    const result = drawDiagram(canvas);
    const frame: Frame = result.frame ?? { origin: [0, 0], scale: [1, 1] };
    const [x, y, w, h] = (/viewBox="([^"]+)"/.exec(result.svg)?.[1] ?? "0 0 100 100")
      .split(" ")
      .map(Number) as [number, number, number, number];
    // Leave room around a half-drawn figure for the points still to place.
    const size = Math.max(w, h);
    // Constructions also need room for the protractor either side of the given side.
    const side = mode === "rays" ? 0.65 : 0.3;
    const box =
      mode === "arm"
        ? { x, y, w, h }
        : {
            x: x - side * size,
            y: y - 1.0 * size,
            w: w + 2 * side * size,
            h: h + 1.25 * size,
          };
    const viewBox = `${box.x} ${box.y} ${box.w} ${box.h}`;
    const svg = result.svg
      .replace(/viewBox="[^"]+"/, `viewBox="${viewBox}"`)
      .replace(/ width="[^"]+"/, ` width="${box.w}"`)
      .replace(/ height="[^"]+"/, ` height="${box.h}"`);
    return { svg, viewBox, frame, width: box.w };
  }, [canvas, mode]);

  const { frame } = drawn;
  const toSvg = ([x, y]: Pt): Pt => [
    frame.origin[0] + frame.scale[0] * x,
    frame.origin[1] - frame.scale[1] * y,
  ];
  const fromSvg = ([sx, sy]: Pt): Pt => [
    (sx - frame.origin[0]) / frame.scale[0],
    (frame.origin[1] - sy) / frame.scale[1],
  ];
  const round = (v: number) => Math.round(v * 1000) / 1000;

  const place = (name: string, at: Pt) => {
    const next = { ...points, [name]: [round(at[0]), round(at[1])] as Pt };
    setPoints(next);
    const unplaced = answer.place.find((n) => !next[n]);
    if (unplaced) setCurrent(unplaced);
  };

  // Rays mode: the third vertex is where the two drawn lines cross.
  const [P, Q] = givenNames.map((n) => given[n] ?? [0, 0]) as [Pt, Pt];
  const sideLength = mode === "rays" ? Math.hypot(Q[0] - P[0], Q[1] - P[1]) : 0;
  const setRay = (vertex: string, direction: Pt) => {
    const next = { ...rays, [vertex]: unit(direction) };
    setRays(next);
    const [u, v] = givenNames.map((n) => next[n]);
    const crossing = u && v ? meet(P, u, Q, v) : undefined;
    const name = answer.place[0] ?? "C";
    if (crossing) setPoints({ [name]: [round(crossing[0]), round(crossing[1])] });
    else setPoints({});
    // After the first line, move on to the other end.
    if (!next[givenNames.find((n) => n !== vertex) ?? ""])
      setCurrent(givenNames.find((n) => n !== vertex) ?? vertex);
  };

  const onPointer = (e: PointerEvent<SVGSVGElement>) => {
    if (locked || !overlay.current) return;
    const ctm = overlay.current.getScreenCTM();
    if (!ctm) return;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    const at = fromSvg([p.x, p.y]);
    if (mode === "arm") place("arm", unit([at[0], Math.max(at[1], 0)]));
    else if (mode === "rays") {
      const from = given[current] ?? [0, 0];
      setRay(current, [at[0] - from[0], at[1] - from[1]]);
    } else place(current, at);
  };

  const onKey = (e: KeyboardEvent<SVGSVGElement>) => {
    if (locked) return;
    const turn = { ArrowLeft: 1, ArrowUp: 1, ArrowRight: -1, ArrowDown: -1 }[e.key];
    if (mode !== "points" && turn === undefined) return;
    if (mode === "arm" || mode === "rays") {
      e.preventDefault();
      const now = mode === "arm" ? (points.arm ?? [1, 0]) : (rays[current] ?? [0, 1]);
      const deg = (Math.atan2(now[1], now[0]) * 180) / Math.PI + (turn ?? 0);
      const dir: Pt = [Math.cos(rad(deg)), Math.sin(rad(deg))];
      if (mode === "arm") place("arm", deg < 0 || deg > 180 ? now : dir);
      else setRay(current, dir);
      return;
    }
    const step = 0.1;
    const d = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, step],
      ArrowDown: [0, -step],
    }[e.key];
    if (!d) return;
    e.preventDefault();
    const p = points[current] ?? fromSvg([drawn.width / 4, 0]);
    place(current, [p[0] + (d[0] ?? 0), p[1] + (d[1] ?? 0)]);
  };

  // Sides of the target figure that touch a placed point, drawn as the student builds it.
  const known = (name: string): Pt | undefined => points[name] ?? given[name];
  const edges: [string, string][] = [
    ...(target.polygons ?? []).flatMap((p) =>
      p.vertices.map(
        (v, i) => [v, p.vertices[(i + 1) % p.vertices.length] ?? v] as [string, string],
      ),
    ),
    ...(target.segments ?? []).map((s) => [s.from, s.to] as [string, string]),
  ].filter(([a, b]) => answer.place.includes(a) || answer.place.includes(b));

  const line = (from: Pt, to: Pt, className: string, key?: string) => {
    const [s, t] = [toSvg(from), toSvg(to)];
    return <line key={key} x1={s[0]} y1={s[1]} x2={t[0]} y2={t[1]} className={className} />;
  };

  // The protractor sits on the current vertex with its zero line along the given side.
  const protractor = (() => {
    if (mode !== "rays") return undefined;
    const centre = given[current];
    const other = given[givenNames.find((n) => n !== current) ?? ""];
    if (!centre || !other) return undefined;
    const [a, b] = [
      toSvg(givenNames[0] === current ? centre : other),
      toSvg(givenNames[0] === current ? other : centre),
    ];
    const sidePx = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const [x, y] = toSvg(centre);
    return {
      transform: `translate(${x} ${y}) rotate(${(Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI}) scale(${Math.min(1.4, Math.max(0.6, (0.6 * sidePx) / 160))})`,
      html: protractorShapes(givenNames[0] === current ? "right" : "left"),
    };
  })();

  const expectedArm = (): Pt => {
    const angle = Number(target.angle);
    const deg = target.baseline === "left" ? 180 - angle : angle;
    return [Math.cos(rad(deg)), Math.sin(rad(deg))];
  };
  const armEnd = (u: Pt): Pt => [u[0] * ARM, -u[1] * ARM];
  const placedName = answer.place[0] ?? "C";
  const label =
    mode === "arm"
      ? "Drawing area. Tap where the second arm should go, or use the arrow keys to turn it."
      : mode === "rays"
        ? `Drawing area. Tap to draw a line from ${current}, or use the arrow keys to turn it. ${placedName} is where the two lines cross.`
        : `Drawing area. Tap to place point ${current}, or use the arrow keys to move it.`;

  return (
    <div className="plot">
      {mode === "rays" && (
        <div className="plot-points">
          <span role="radiogroup" aria-label="Draw a line from">
            {givenNames.map((name) => (
              <button
                key={name}
                type="button"
                role="radio"
                aria-checked={current === name}
                disabled={locked}
                onClick={() => setCurrent(name)}
              >
                Line from {name}
              </button>
            ))}
          </span>
          <label className="check">
            <input
              type="checkbox"
              checked={showProtractor}
              onChange={(e) => setShowProtractor(e.target.checked)}
            />
            Protractor
          </label>
        </div>
      )}
      {mode === "points" && answer.place.length > 1 && (
        <div className="plot-points" role="radiogroup" aria-label="Point to place">
          {answer.place.map((name) => (
            <button
              key={name}
              type="button"
              role="radio"
              aria-checked={current === name}
              disabled={locked}
              onClick={() => setCurrent(name)}
            >
              Place {name}
            </button>
          ))}
        </div>
      )}
      <div className="plot-stage" style={{ maxWidth: `${drawn.width}px` }}>
        <div className="plot-base" dangerouslySetInnerHTML={{ __html: drawn.svg }} />
        <svg
          ref={overlay}
          className="plot-overlay"
          viewBox={drawn.viewBox}
          role="application"
          tabIndex={locked ? -1 : 0}
          aria-label={label}
          onPointerDown={onPointer}
          onKeyDown={onKey}
        >
          {mode === "arm" && (
            <>
              {reveal && line([0, 0], [expectedArm()[0] * ARM, expectedArm()[1] * ARM], "target")}
              {points.arm && (
                <line
                  x1={0}
                  y1={0}
                  x2={armEnd(points.arm)[0]}
                  y2={armEnd(points.arm)[1]}
                  className="placed"
                />
              )}
            </>
          )}
          {mode === "rays" && (
            <>
              {protractor && showProtractor && !locked && (
                <g
                  className="tool"
                  transform={protractor.transform}
                  dangerouslySetInnerHTML={{ __html: protractor.html }}
                />
              )}
              {givenNames.map((name) => {
                const u = rays[name];
                const from = given[name];
                if (!u || !from) return null;
                return line(
                  from,
                  [from[0] + 2.5 * sideLength * u[0], from[1] + 2.5 * sideLength * u[1]],
                  "ray",
                  `ray-${name}`,
                );
              })}
            </>
          )}
          {mode !== "arm" && (
            <>
              {edges.map(([a, b]) => {
                const [p, q] = [known(a), known(b)];
                return p && q ? line(p, q, "placed", `${a}${b}`) : null;
              })}
              {reveal &&
                answer.place.map((name) => {
                  const want = target.points?.[name];
                  if (!want) return null;
                  const [x, y] = toSvg(want);
                  return <circle key={`want-${name}`} cx={x} cy={y} r={7} className="target" />;
                })}
              {answer.place.map((name) => {
                const p = points[name];
                if (!p) return null;
                const [x, y] = toSvg(p);
                return (
                  <g key={name} className="placed">
                    <circle cx={x} cy={y} r={5} />
                    <text x={x + 9} y={y - 9}>
                      {name}
                    </text>
                  </g>
                );
              })}
            </>
          )}
        </svg>
      </div>
      {mode === "rays" && !locked && !points[placedName] && (
        <p className="muted plot-key">
          Draw a line from each end of the side; {placedName} is where they cross.
        </p>
      )}
      {reveal && <p className="muted plot-key">Dashed shows where it should be.</p>}
    </div>
  );
}
