// What stands on a square, and how to say it: for drawing the map, for the sheet that opens when a
// square is chosen, and for screen readers as the cursor moves.
import { familyOf, skillText, type Family } from "@mathsplanner/learning";
import type { Art } from "./art.tsx";
import type { City, Tile } from "./city.ts";
import { BUILDINGS, GOOD_NAMES, MACHINE_NAMES, materialOf, type MachineState } from "./economy.ts";
import { squareAt, type WorldMap } from "./map.ts";

export const keyOf = ({ x, y }: Tile) => `${x},${y}`;

export interface Thing {
  /** The drawing, if the square has anything standing on it. */
  art?: Art;
  title: string;
  /** The skill a machine or outcrop is for, in the course's words. */
  skill?: string;
  text: string;
  /** For a zone's ground and its outcrops: the topic family, for its colour. */
  family?: Family;
}

/** A city's machines and buildings by square, for looking up as the map is drawn. */
export interface Placed {
  machines: ReadonlyMap<string, MachineState>;
  buildings: ReadonlyMap<string, keyof typeof BUILDINGS>;
}

export function placedIn(city: City, machines: readonly MachineState[]): Placed {
  const states = new Map(machines.map((m) => [m.skill, m]));
  const bySquare = new Map<string, MachineState>();
  for (const [skill, tile] of Object.entries(city.machines)) {
    const state = states.get(skill);
    if (state) bySquare.set(keyOf(tile), state);
  }
  return {
    machines: bySquare,
    buildings: new Map(city.buildings.map((b) => [keyOf(b), b.type])),
  };
}

/** What is on a square. */
export function thingAt(map: WorldMap, placed: Placed, tile: Tile): Thing {
  const square = squareAt(map, tile);
  const zone = square?.zone === undefined ? undefined : map.zones[square.zone];
  const family = zone ? { family: familyOf(zone.unit.topic) } : {};

  const machine = placed.machines.get(keyOf(tile));
  if (machine) {
    const name = MACHINE_NAMES[machine.material];
    if (machine.tier === 0)
      return {
        art: "site",
        title: `${name} site`,
        skill: skillText(machine.skill),
        text: "Its lesson will build it.",
        ...family,
      };
    return {
      art: `machine-${machine.material}`,
      title: `${name}, tier ${machine.tier}`,
      skill: skillText(machine.skill),
      text: `It makes ${machine.rate} ${GOOD_NAMES[machine.material].toLowerCase()} a minute while the city has power.${machine.due ? " It needs a tune-up." : ""}`,
      ...family,
    };
  }
  const building = placed.buildings.get(keyOf(tile));
  if (building)
    return { art: building, title: BUILDINGS[building].name, text: "You built this.", ...family };

  switch (square?.ground) {
    case "outcrop": {
      const material = materialOf(square.skill ?? "");
      return {
        art: `outcrop-${material}`,
        title: `${GOOD_NAMES[material]} outcrop`,
        skill: skillText(square.skill ?? ""),
        text: `A ${MACHINE_NAMES[material].toLowerCase()} beside it will work it.`,
        ...family,
      };
    }
    case "camp":
      return { art: "camp", title: "Your camp", text: "Dot lives here. Every city starts small." };
    case "tree":
      return { art: "tree", title: "Trees", text: "A little shade." };
    case "water":
      return { art: "pond", title: "A pond", text: "Too wet to build on." };
    case "road":
      return { title: "The road", text: "It runs from the camp through every zone." };
    case "zone":
      return {
        title: zone ? zone.unit.name : "A zone",
        text: "Open ground in this zone. You can build here.",
        ...family,
      };
    default:
      return { title: "Open ground", text: "You can build here." };
  }
}

/** A square as a screen reader says it: what it is, then where. */
export const spoken = (thing: Thing, tile: Tile) =>
  `${thing.title}. Row ${tile.y + 1}, column ${tile.x + 1}.`;
