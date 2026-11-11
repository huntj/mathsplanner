import { sectionFor } from "@mathsplanner/learning";
import { describe, expect, it } from "vitest";
import { newCity, placeMachine } from "./city.ts";
import {
  beside,
  canBuildOn,
  isOpen,
  machineSpots,
  makeMap,
  squareAt,
  type WorldMap,
} from "./map.ts";

const year = sectionFor("Y7")?.units ?? [];
const slice = year.filter((u) => u.id === "y7-place-value");
const SEEDS = Array.from({ length: 150 }, (_, i) => i * 7919 + 1);

/** The squares that can be walked to from the camp without crossing water or trees. */
function reachable(map: WorldMap): Set<string> {
  const seen = new Set<string>([`${map.camp.x},${map.camp.y}`]);
  const queue = [map.camp];
  for (let tile = queue.shift(); tile; tile = queue.shift())
    for (const next of beside(map, tile)) {
      const ground = squareAt(map, next)?.ground;
      const key = `${next.x},${next.y}`;
      if (seen.has(key) || ground === "water" || ground === "tree") continue;
      seen.add(key);
      if (ground !== "outcrop") queue.push(next);
    }
  return seen;
}

describe.each([
  ["the Place value zone", slice],
  ["all of Year 7", year],
])("a map of %s", (_, units) => {
  const skills = units.flatMap((u) => u.skills);

  it("is the same map for the same seed, and a different one for another", () => {
    expect(makeMap(units, 42)).toEqual(makeMap(units, 42));
    expect(makeMap(units, 42)).not.toEqual(makeMap(units, 43));
  });

  it("has one outcrop for every skill, each on its own square of its zone", () => {
    for (const seed of SEEDS) {
      const map = makeMap(units, seed);
      const outcrops = map.zones.flatMap((z) => z.outcrops);
      expect(outcrops.map((o) => o.skill)).toEqual(skills);
      expect(new Set(outcrops.map((o) => `${o.x},${o.y}`)).size).toBe(skills.length);
      map.zones.forEach((zone, i) => {
        expect(zone.unit).toBe(units[i]);
        for (const o of zone.outcrops)
          expect(squareAt(map, o)).toEqual({ ground: "outcrop", zone: i, skill: o.skill });
      });
    }
  });

  it("leaves all four squares beside every outcrop free for its machine", () => {
    for (const seed of SEEDS) {
      const map = makeMap(units, seed);
      for (const o of map.zones.flatMap((z) => z.outcrops)) {
        expect(beside(map, o)).toHaveLength(4);
        for (const t of beside(map, o)) expect(isOpen(map, t)).toBe(true);
      }
    }
  });

  it("still has a square for every machine when each takes the first one free", () => {
    for (const seed of SEEDS.slice(0, 40)) {
      const map = makeMap(units, seed);
      let city = newCity(seed, 0);
      for (const skill of skills) {
        const [spot] = machineSpots(map, city, skill);
        expect(spot).toBeDefined();
        if (spot) city = placeMachine(city, skill, spot);
      }
      expect(Object.keys(city.machines)).toHaveLength(skills.length);
    }
  });

  it("lets every outcrop be reached from the camp", () => {
    for (const seed of SEEDS) {
      const map = makeMap(units, seed);
      const seen = reachable(map);
      expect(squareAt(map, map.camp)?.ground).toBe("camp");
      for (const o of map.zones.flatMap((z) => z.outcrops))
        expect(seen.has(`${o.x},${o.y}`)).toBe(true);
    }
  });

  it("leaves most of the land open to build on", () => {
    for (const seed of SEEDS.slice(0, 20)) {
      const map = makeMap(units, seed);
      const city = newCity(seed, 0);
      let open = 0;
      for (let y = 0; y < map.height; y++)
        for (let x = 0; x < map.width; x++) if (canBuildOn(map, city, { x, y })) open++;
      expect(open / (map.width * map.height)).toBeGreaterThan(0.6);
    }
  });
});

it("is 16 squares by 15 for one zone, and 40 by 65 for Year 7", () => {
  expect(makeMap(slice, 1)).toMatchObject({ width: 16, height: 15 });
  expect(makeMap(year, 1)).toMatchObject({ width: 40, height: 65 });
});
