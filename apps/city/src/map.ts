// A year's map, made from a seed kept in the city's save, so each pupil's is their own and is the
// same every time it is drawn. It is a grid of squares. Each unit is a zone: a patch of ground with
// one outcrop for each skill. The zones lie along a road from the camp, in course order, winding
// down the map. The land between is open to build on, with trees and ponds here and there.
//
// Outcrops sit on every other square of their zone, never on the road, and nothing is put beside
// them, so all four squares round an outcrop are free for its machine. Everything here is pure.
import type { CourseUnit } from "@mathsplanner/core";
import { occupied, type City, type Tile } from "./city.ts";

export type Ground = "grass" | "zone" | "road" | "water" | "tree" | "outcrop" | "camp";

export interface Square {
  ground: Ground;
  /** For a zone's ground and its outcrops: which zone, counting from 0. */
  zone?: number;
  /** For an outcrop: its skill. */
  skill?: string;
}

export interface Zone {
  unit: CourseUnit;
  /** The middle of its patch, which the road runs through. */
  centre: Tile;
  outcrops: { skill: string; x: number; y: number }[];
}

export interface WorldMap {
  width: number;
  height: number;
  /** Row by row from the top. */
  squares: Square[];
  zones: Zone[];
  camp: Tile;
}

/** The space each zone has, the edge round the map, and the strip at the top for the camp. */
const CELL_W = 12;
const CELL_H = 10;
const MARGIN = 2;
const TOP = 3;
/** Zones across the map: three at most, so it stays narrow enough to cross on a phone. */
const ACROSS = 3;

/** A small seeded random number generator (mulberry32): the same seed gives the same numbers. */
export function randomFrom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}

export const squareAt = (map: WorldMap, { x, y }: Tile): Square | undefined =>
  x < 0 || y < 0 || x >= map.width || y >= map.height ? undefined : map.squares[y * map.width + x];

/** The squares above, below and either side of one, where they are on the map. */
export const beside = (map: WorldMap, { x, y }: Tile): Tile[] =>
  [
    { x, y: y - 1 },
    { x: x + 1, y },
    { x, y: y + 1 },
    { x: x - 1, y },
  ].filter((t) => squareAt(map, t) !== undefined);

/** Whether a square is ground that can be built on, before asking what stands there already. */
export function isOpen(map: WorldMap, tile: Tile): boolean {
  const ground = squareAt(map, tile)?.ground;
  return ground === "grass" || ground === "zone";
}

/** Whether something can be built on a square now: open ground with nothing standing on it. */
export const canBuildOn = (map: WorldMap, city: City, tile: Tile): boolean =>
  isOpen(map, tile) && !occupied(city, tile);

/** Where a skill's outcrop is. */
export const outcropOf = (map: WorldMap, skill: string): Tile | undefined =>
  map.zones.flatMap((z) => z.outcrops).find((o) => o.skill === skill);

/** The free squares beside a skill's outcrop, where its machine can go. */
export function machineSpots(map: WorldMap, city: City, skill: string): Tile[] {
  const outcrop = outcropOf(map, skill);
  return outcrop ? beside(map, outcrop).filter((t) => canBuildOn(map, city, t)) : [];
}

/** Makes the map for some units of a year, in course order. */
export function makeMap(units: readonly CourseUnit[], seed: number): WorldMap {
  const random = randomFrom(seed);
  const across = Math.max(1, Math.min(ACROSS, units.length));
  const down = Math.max(1, Math.ceil(units.length / across));
  const width = across * CELL_W + 2 * MARGIN;
  const height = TOP + down * CELL_H + MARGIN;
  const squares: Square[] = Array.from({ length: width * height }, () => ({ ground: "grass" }));
  const at = (x: number, y: number) => squares[y * width + x];
  const set = (x: number, y: number, square: Square) => {
    if (x >= 0 && y >= 0 && x < width && y < height) squares[y * width + x] = square;
  };

  // Zones wind down the map: left to right, then right to left on the row below.
  const centres = units.map((_, i) => {
    const row = Math.floor(i / across);
    const along = i % across;
    const col = row % 2 === 0 ? along : across - 1 - along;
    return { x: MARGIN + col * CELL_W + CELL_W / 2, y: TOP + row * CELL_H + CELL_H / 2 };
  });

  // Each zone's patch: a rough oval of ground round its centre.
  const patches = centres.map((c, zone) => {
    const rx = 3.6 + random() * 1.2;
    const ry = 2.8 + random() * 0.9;
    const patch: Tile[] = [];
    for (let y = c.y - 4; y <= c.y + 4; y++)
      for (let x = c.x - 5; x <= c.x + 5; x++) {
        const d = ((x - c.x) / rx) ** 2 + ((y - c.y) / ry) ** 2;
        if (d <= 0.75 + random() * 0.35) {
          patch.push({ x, y });
          set(x, y, { ground: "zone", zone });
        }
      }
    return patch;
  });

  // The road: from the camp to the first zone, then from each zone to the next.
  const camp = { x: MARGIN, y: 1 };
  const road = (from: Tile, to: Tile) => {
    const stepX = Math.sign(to.x - from.x);
    for (let x = from.x; x !== to.x; x += stepX) set(x, from.y, { ground: "road" });
    const stepY = Math.sign(to.y - from.y);
    for (let y = from.y; y !== to.y; y += stepY) set(to.x, y, { ground: "road" });
    set(to.x, to.y, { ground: "road" });
  };
  let last: Tile = camp;
  for (const centre of centres) {
    // Between rows the road drops straight down, so it turns before it runs along.
    if (last !== camp && last.y !== centre.y) {
      road(last, { x: last.x, y: centre.y });
      last = { x: last.x, y: centre.y };
    }
    road(last, centre);
    last = centre;
  }
  set(camp.x, camp.y, { ground: "camp" });

  // Outcrops: on every other square of the patch, so no two touch or share all their free sides.
  const zones: Zone[] = units.map((unit, zone) => {
    const centre = centres[zone] ?? camp;
    const spots = (patches[zone] ?? []).filter(
      (t) =>
        (t.x - centre.x) % 2 === 0 &&
        (t.y - centre.y) % 2 === 0 &&
        at(t.x, t.y)?.ground === "zone" &&
        // Keep a square clear on every side.
        t.x > 0 &&
        t.y > 0 &&
        t.x < width - 1 &&
        t.y < height - 1,
    );
    // Should a patch come out too small for its skills, the squares further out take the rest.
    for (let ring = 2; spots.length < unit.skills.length && ring <= 4; ring += 2)
      for (let dy = -ring; dy <= ring; dy += 2)
        for (let dx = -ring - 2; dx <= ring + 2; dx += 2) {
          const t = { x: centre.x + dx, y: centre.y + dy };
          if (
            at(t.x, t.y)?.ground !== "road" &&
            !spots.some((s) => s.x === t.x && s.y === t.y) &&
            Math.abs(dx) <= 4 &&
            Math.abs(dy) <= 4
          )
            spots.push(t);
        }
    const outcrops = unit.skills.flatMap((skill) => {
      const [spot] = spots.splice(Math.floor(random() * spots.length), 1);
      if (!spot) return [];
      set(spot.x, spot.y, { ground: "outcrop", zone, skill });
      return [{ skill, ...spot }];
    });
    return { unit, centre, outcrops };
  });

  // Trees and ponds on open grass, never beside a zone, the road or the camp.
  const clear = (x: number, y: number) => {
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        const ground = at(x + dx, y + dy)?.ground;
        if (ground !== undefined && ground !== "grass" && ground !== "tree") return false;
      }
    return true;
  };
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const roll = random();
      if (at(x, y)?.ground !== "grass" || !clear(x, y)) continue;
      if (roll < 0.03) set(x, y, { ground: "water" });
      else if (roll < 0.17) set(x, y, { ground: "tree" });
    }

  return { width, height, squares, zones, camp };
}
