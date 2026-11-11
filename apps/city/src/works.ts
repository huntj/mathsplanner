// A city's machines today: each skill with a machine placed, as the learning record makes it.
import { levelsOf, type Progress } from "@mathsplanner/learning";
import type { City } from "./city.ts";
import { machineState, totalRates, type MachineState, type Rates } from "./economy.ts";

/** The machines that stand in a city, in the order they were placed. */
export const machinesOf = (city: City, progress: Progress, today: string): MachineState[] =>
  Object.keys(city.machines).map((skill) => machineState(progress, skill, levelsOf(skill), today));

/** The machines that are built: their lesson is done, so they work while there is power. */
export const builtMachines = (machines: readonly MachineState[]) =>
  machines.filter((m) => m.tier > 0);

/** What a city makes each minute while it has power. */
export const ratesOf = (city: City, progress: Progress, today: string): Rates =>
  totalRates(machinesOf(city, progress, today));
