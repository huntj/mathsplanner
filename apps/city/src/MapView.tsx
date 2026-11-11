// The map: a grid of squares drawn in SVG inside a box that scrolls. Dragging (or the scroll wheel)
// moves it, a tap chooses a square, and the arrow keys move a cursor square that Enter opens. Only
// the squares in view are drawn, back row first, so tall things overlap the row behind them.
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ArtDefs, artId, RISE, TILE } from "./art.tsx";
import type { Tile } from "./city.ts";
import { squareAt, type WorldMap } from "./map.ts";
import { keyOf, spoken, thingAt, type Placed } from "./tiles.ts";

export const ZOOMS = [0.5, 0.75, 1, 1.5] as const;

interface View {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

/** The squares showing in a scrolled box, with one more all round for what overlaps the edge. */
export function squaresInView(
  box: { left: number; top: number; width: number; height: number },
  map: { width: number; height: number },
  zoom: number,
): View {
  const size = TILE * zoom;
  const rise = RISE * zoom;
  return {
    x0: Math.max(0, Math.floor(box.left / size) - 1),
    x1: Math.min(map.width - 1, Math.floor((box.left + box.width) / size) + 1),
    y0: Math.max(0, Math.floor((box.top - rise) / size) - 1),
    // Two more below: a tall thing in the row under the edge still shows its top.
    y1: Math.min(map.height - 1, Math.floor((box.top + box.height - rise) / size) + 2),
  };
}

/** How far a mouse may move during a click before it counts as dragging the map. */
const DRAG = 5;

export function MapView({
  map,
  placed,
  zoom,
  cursor,
  marked,
  onCursor,
  onOpen,
  onZoom,
}: {
  map: WorldMap;
  placed: Placed;
  zoom: number;
  cursor: Tile;
  /** Show the cursor even without the keyboard: its square's sheet is open. */
  marked: boolean;
  onCursor: (tile: Tile) => void;
  onOpen: (tile: Tile) => void;
  /** One step in (+1) or out (−1), from the keyboard. */
  onZoom: (step: 1 | -1) => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>({ x0: 0, x1: 12, y0: 0, y1: 16 });
  /** Set when the cursor moved by keyboard, so the map follows it; a tap never moves the map. */
  const follow = useRef(false);
  const drag = useRef<{ x: number; y: number; left: number; top: number; moved: boolean }>(null);

  const measure = useCallback(() => {
    const el = box.current;
    if (!el) return;
    const next = squaresInView(
      { left: el.scrollLeft, top: el.scrollTop, width: el.clientWidth, height: el.clientHeight },
      map,
      zoom,
    );
    setView((v) =>
      v.x0 === next.x0 && v.x1 === next.x1 && v.y0 === next.y0 && v.y1 === next.y1 ? v : next,
    );
  }, [map, zoom]);

  useLayoutEffect(measure, [measure]);
  // Start with the camp at the left edge, so the road leads the eye to the first zone.
  useLayoutEffect(() => {
    if (box.current) box.current.scrollLeft = Math.max(0, map.camp.x - 1) * TILE * ZOOMS[2];
  }, [map]);
  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // Keep the cursor in view when the keyboard moves it.
  useEffect(() => {
    const el = box.current;
    if (!el || !follow.current) return;
    follow.current = false;
    const size = TILE * zoom;
    const left = cursor.x * size;
    const top = cursor.y * size;
    const bottom = top + size + RISE * zoom;
    if (left < el.scrollLeft) el.scrollLeft = left;
    else if (left + size > el.scrollLeft + el.clientWidth)
      el.scrollLeft = left + size - el.clientWidth;
    if (top < el.scrollTop) el.scrollTop = top;
    else if (bottom > el.scrollTop + el.clientHeight) el.scrollTop = bottom - el.clientHeight;
  }, [cursor, zoom]);

  const squareUnder = (e: { clientX: number; clientY: number }, svg: SVGSVGElement): Tile => {
    const rect = svg.getBoundingClientRect();
    return {
      x: Math.min(map.width - 1, Math.max(0, Math.floor((e.clientX - rect.left) / (TILE * zoom)))),
      y: Math.min(
        map.height - 1,
        Math.max(0, Math.floor(((e.clientY - rect.top) / zoom - RISE) / TILE)),
      ),
    };
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const steps: Record<string, [number, number]> = {
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
    };
    const step = steps[e.key];
    if (step) {
      e.preventDefault();
      follow.current = true;
      onCursor({
        x: Math.min(map.width - 1, Math.max(0, cursor.x + step[0])),
        y: Math.min(map.height - 1, Math.max(0, cursor.y + step[1])),
      });
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen(cursor);
    } else if (e.key === "+" || e.key === "=") onZoom(1);
    else if (e.key === "-") onZoom(-1);
  };

  const { ground, things } = useMemo(() => {
    const ground: React.ReactNode[] = [];
    const things: React.ReactNode[] = [];
    for (let y = view.y0; y <= view.y1; y++)
      for (let x = view.x0; x <= view.x1; x++) {
        const tile = { x, y };
        const key = keyOf(tile);
        const kind = squareAt(map, tile)?.ground;
        const thing = thingAt(map, placed, tile);
        if (kind === "road")
          ground.push(
            <rect
              key={key}
              x={x * TILE}
              y={y * TILE}
              width={TILE}
              height={TILE}
              className="road"
            />,
          );
        else if (thing.family)
          ground.push(
            <rect
              key={key}
              x={x * TILE}
              y={y * TILE}
              width={TILE}
              height={TILE}
              className={`zone-ground family-${thing.family}`}
            />,
          );
        if (thing.art)
          things.push(
            <use
              key={key}
              href={`#${artId(thing.art)}`}
              x={x * TILE}
              y={y * TILE - RISE}
              width={TILE}
              height={TILE + RISE}
            />,
          );
      }
    return { ground, things };
  }, [map, placed, view]);

  const width = map.width * TILE;
  const height = map.height * TILE + RISE;
  const here = thingAt(map, placed, cursor);

  return (
    <div
      ref={box}
      className={marked ? "map-box marked" : "map-box"}
      tabIndex={0}
      role="application"
      aria-label="Your city’s map. Arrow keys move, Enter opens a square, plus and minus zoom."
      aria-describedby="map-here"
      onScroll={measure}
      onKeyDown={onKeyDown}
      onPointerDown={(e) => {
        if (e.pointerType !== "mouse" || !box.current) return;
        drag.current = {
          x: e.clientX,
          y: e.clientY,
          left: box.current.scrollLeft,
          top: box.current.scrollTop,
          moved: false,
        };
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d || !box.current || e.buttons === 0) return;
        if (Math.hypot(e.clientX - d.x, e.clientY - d.y) > DRAG) d.moved = true;
        if (d.moved) {
          box.current.scrollLeft = d.left - (e.clientX - d.x);
          box.current.scrollTop = d.top - (e.clientY - d.y);
        }
      }}
    >
      <svg
        className="map"
        width={width * zoom}
        height={height * zoom}
        viewBox={`0 ${-RISE} ${width} ${height}`}
        aria-hidden="true"
        onClick={(e) => {
          const dragged = drag.current?.moved;
          drag.current = null;
          if (dragged) return;
          const tile = squareUnder(e, e.currentTarget);
          onCursor(tile);
          onOpen(tile);
        }}
      >
        <defs>
          <ArtDefs />
          <pattern id="map-squares" width={TILE} height={TILE} patternUnits="userSpaceOnUse">
            <path d={`M${TILE} 0 V${TILE} H0`} className="map-line" />
          </pattern>
        </defs>
        <rect x="0" y={-RISE} width={width} height={height} className="grass" />
        {ground}
        <rect x="0" y="0" width={width} height={map.height * TILE} fill="url(#map-squares)" />
        {things}
        <rect
          className="map-cursor"
          x={cursor.x * TILE + 2}
          y={cursor.y * TILE + 2}
          width={TILE - 4}
          height={TILE - 4}
          rx="8"
        />
      </svg>
      <p id="map-here" className="sr-only" aria-live="polite">
        {spoken(here, cursor)}
      </p>
    </div>
  );
}
