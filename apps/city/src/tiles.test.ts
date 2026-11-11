import { sectionFor } from "@mathsplanner/learning";
import { describe, expect, it } from "vitest";
import { build, newCity, placeMachine } from "./city.ts";
import { demoCity, DEMO_BUILDINGS } from "./demo.ts";
import { machineSpots, makeMap, squareAt } from "./map.ts";
import { squaresInView } from "./MapView.tsx";
import { placedIn, spoken, thingAt } from "./tiles.ts";

const year = sectionFor("Y7")?.units ?? [];
const map = makeMap(
  year.filter((u) => u.id === "y7-place-value"),
  7,
);
const [outcrop] = map.zones[0]?.outcrops ?? [];
if (!outcrop) throw new Error("The map has no outcrop");

describe("what is on a square", () => {
  it("names an outcrop by its material and skill, in its zone's family", () => {
    const thing = thingAt(map, placedIn(newCity(7, 0), []), outcrop);
    expect(thing).toMatchObject({
      art: "outcrop-stone",
      title: "Stone outcrop",
      family: "number",
      text: "A quarry beside it will work it.",
    });
    expect(thing.skill).toMatch(/place value/);
    expect(spoken(thing, outcrop)).toBe(
      `Stone outcrop. Row ${outcrop.y + 1}, column ${outcrop.x + 1}.`,
    );
  });

  it("shows a machine as a site until its lesson is done, then as a working machine", () => {
    const [spot] = machineSpots(map, newCity(7, 0), outcrop.skill);
    if (!spot) throw new Error("No square for the machine");
    const city = placeMachine(newCity(7, 0), outcrop.skill, spot);
    const state = { skill: outcrop.skill, material: "stone" as const, tuned: false, due: false };
    expect(
      thingAt(map, placedIn(city, [{ ...state, tier: 0, stage: 0, rate: 0 }]), spot),
    ).toMatchObject({
      art: "site",
      title: "Quarry site",
    });
    expect(
      thingAt(map, placedIn(city, [{ ...state, tier: 2, stage: 2, rate: 3, due: true }]), spot),
    ).toMatchObject({
      art: "machine-stone",
      title: "Quarry, tier 2",
      text: "It makes 3 stone a minute while the city has power. It needs a tune-up.",
    });
  });

  it("shows a building where one stands, and the ground elsewhere", () => {
    const rich = { ...newCity(7, 0), stock: { ...newCity(7, 0).stock, stone: 100 } };
    const city = build(rich, "cottage", { x: 0, y: 5 }) ?? rich;
    const placed = placedIn(city, []);
    expect(thingAt(map, placed, { x: 0, y: 5 })).toMatchObject({
      art: "cottage",
      title: "Cottage",
    });
    expect(thingAt(map, placed, map.camp).title).toBe("Your camp");
    expect(thingAt(map, placed, { x: map.camp.x + 1, y: map.camp.y }).title).toBe("The road");
  });
});

describe("the squares in view", () => {
  const size = { width: 40, height: 65 };

  it("are those the box shows, with a border for what overlaps the edge", () => {
    expect(squaresInView({ left: 0, top: 0, width: 390, height: 700 }, size, 1)).toEqual({
      x0: 0,
      x1: 9,
      y0: 0,
      y1: 16,
    });
    expect(squaresInView({ left: 480, top: 960, width: 390, height: 700 }, size, 1)).toEqual({
      x0: 9,
      x1: 19,
      y0: 18,
      y1: 36,
    });
  });

  it("are more when zoomed out, and never off the map", () => {
    const view = squaresInView({ left: 0, top: 0, width: 1366, height: 700 }, size, 0.5);
    expect(view).toEqual({ x0: 0, x1: 39, y0: 0, y1: 30 });
  });
});

describe("the made-up city", () => {
  const demo = demoCity(year, 2026);

  it("has every machine beside its outcrop and a few hundred buildings on open ground", () => {
    expect(demo.machines).toHaveLength(72);
    expect(demo.city.buildings).toHaveLength(DEMO_BUILDINGS);
    const taken = new Set<string>();
    for (const tile of [...Object.values(demo.city.machines), ...demo.city.buildings]) {
      expect(["grass", "zone"]).toContain(squareAt(demo.map, tile)?.ground);
      expect(taken.has(`${tile.x},${tile.y}`)).toBe(false);
      taken.add(`${tile.x},${tile.y}`);
    }
  });
});
