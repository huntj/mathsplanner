// A made-up full city, for seeing how the map draws and scrolls when it is busy: every Year 7
// skill's machine built, and buildings on most of the open ground. It is never saved.
import type { CourseUnit } from "@mathsplanner/core";
import { newCity, placeMachine, type City } from "./city.ts";
import { materialOf, type BuildingType, type MachineState } from "./economy.ts";
import { canBuildOn, machineSpots, makeMap, randomFrom, type WorldMap } from "./map.ts";

/** Buildings in the made-up city. */
export const DEMO_BUILDINGS = 500;

export function demoCity(
  units: readonly CourseUnit[],
  seed: number,
): { map: WorldMap; city: City; machines: MachineState[] } {
  const map = makeMap(units, seed);
  const random = randomFrom(seed + 1);
  let city = newCity(seed, 0);
  const machines: MachineState[] = [];
  for (const skill of units.flatMap((u) => u.skills)) {
    const [spot] = machineSpots(map, city, skill);
    if (!spot) continue;
    city = placeMachine(city, skill, spot);
    const tier = 1 + Math.floor(random() * 5);
    machines.push({
      skill,
      material: materialOf(skill),
      tier,
      stage: 1 + Math.floor(random() * 6),
      rate: tier + 1,
      tuned: true,
      due: random() < 0.1,
    });
  }
  const kinds: BuildingType[] = ["cottage", "cottage", "cottage", "path", "well", "masons-yard"];
  const buildings = [...city.buildings];
  for (let y = 0; y < map.height && buildings.length < DEMO_BUILDINGS; y++)
    for (let x = 0; x < map.width && buildings.length < DEMO_BUILDINGS; x++) {
      if (random() > 0.45 || !canBuildOn(map, city, { x, y })) continue;
      buildings.push({ x, y, type: kinds[Math.floor(random() * kinds.length)] ?? "cottage" });
    }
  return { map, city: { ...city, buildings }, machines };
}
