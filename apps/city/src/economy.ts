// The economy's rules, from docs/proposals/city-game.md: which material a skill gives, how fast its
// machine works, what a lesson pays and what things cost. A machine's rate comes only from the
// pupil's learning record (the skill's level and whether its review is in date), and nothing that
// is bought makes a machine faster, so the numbers cannot run away. Everything here is pure.
import {
  familyOf,
  isDue,
  memoryOf,
  unitOf,
  type Family,
  type LevelName,
  type Progress,
  type SkillLevels,
} from "@mathsplanner/learning";
import { lessonId, lessonsFor, lessonTeaches } from "@mathsplanner/learning/unit-lessons";

/** The raw materials, one for each strand, in the order a Year 7 pupil meets them. */
export const MATERIALS = ["stone", "ore", "timber", "sand"] as const;
export type Material = (typeof MATERIALS)[number];

/** What workshops make from the materials. */
export const COMPONENTS = ["blocks", "frames", "panes"] as const;
export type Component = (typeof COMPONENTS)[number];

export const GOODS = [...MATERIALS, ...COMPONENTS] as const;
export type Good = (typeof GOODS)[number];

export const GOOD_NAMES: Record<Good, string> = {
  stone: "Stone",
  ore: "Ore",
  timber: "Timber",
  sand: "Sand",
  blocks: "Blocks",
  frames: "Frames",
  panes: "Panes",
};

const FAMILY_MATERIALS: Record<Family, Material> = {
  number: "stone",
  calculation: "stone",
  fractions: "stone",
  algebra: "ore",
  geometry: "timber",
  measures: "timber",
  ratio: "sand",
  statistics: "sand",
  probability: "sand",
};

/** The material a skill's outcrop gives: its unit's topic family decides. */
export const materialOf = (skill: string): Material =>
  FAMILY_MATERIALS[familyOf(unitOf(skill)?.topic ?? "")];

/** The machine each material is worked with. */
export const MACHINE_NAMES: Record<Material, string> = {
  stone: "Quarry",
  ore: "Mine",
  timber: "Timber yard",
  sand: "Sand pit",
};

/** What a machine makes each minute once its lesson is done, before any level. */
export const BUILT_RATE = 2;
/** What it makes each minute once the skill has reached each level. */
export const LEVEL_RATES: Record<LevelName, number> = {
  Learn: 3,
  Practise: 4,
  Picture: 5,
  Reason: 6,
  Legendary: 8,
};
/** How a machine looks at each level (see MachineState.stage). */
export const LEVEL_STAGES: Record<LevelName, number> = {
  Learn: 2,
  Practise: 3,
  Picture: 4,
  Reason: 5,
  Legendary: 6,
};
export const STAGES_OF_MACHINE = 6;
/** A finished skill whose review is not due runs tuned: half as fast again. */
export const TUNED = 1.5;

/** Minutes of power a finished lesson adds, and a short refresh of one skill. */
export const LESSON_POWER = 30;
export const REFRESH_POWER = 20;
/** A lesson's crate: this many minutes of the city's output, and never less than CRATE_LEAST. */
export const CRATE_MINUTES = 10;
export const CRATE_LEAST = 60;

/** A skill's machine, as the learning record makes it. */
export interface MachineState {
  skill: string;
  material: Material;
  /** 0 for a site whose lesson is not done, 1 once it is built, then one more for each level. */
  tier: number;
  /** The level reached, if any. */
  level?: LevelName;
  /** How it looks: 0 for a site, 1 once built, then 2 to 6 for Learn up to Legendary. */
  stage: number;
  /** What it makes each minute while the city has power. */
  rate: number;
  /** A finished skill whose review is not due. */
  tuned: boolean;
  /** A finished skill whose review is due: a tune-up will put it right. */
  due: boolean;
}

/** Whether the unit lesson that teaches a skill is done; undefined when no lesson teaches it. */
export function lessonDone(progress: Progress, skill: string): boolean | undefined {
  const unit = unitOf(skill);
  if (!unit) return undefined;
  const lesson = lessonsFor(unit.id, progress.settings.teacher).find((l) =>
    lessonTeaches(l, unit.skills).includes(skill),
  );
  return lesson ? lessonId(lesson) in progress.unitLessons : undefined;
}

/**
 * A skill's machine today. Its lesson builds it; each level then makes it faster. A skill with
 * levels done is built whatever its lesson says (it was learnt in Learn Maths, or has no lesson).
 */
export function machineState(
  progress: Progress,
  skill: string,
  info: SkillLevels,
  today: string,
): MachineState {
  const done = Math.min(progress.skills[skill]?.level ?? 0, info.levels.length);
  const level = info.levels[done - 1]?.name;
  const built = done > 0 || lessonDone(progress, skill) === true;
  const memory = memoryOf(progress.skills[skill], info.pathLevels);
  const due = isDue(memory, today);
  const tuned = memory !== undefined && !due;
  const plain = level ? LEVEL_RATES[level] : built ? BUILT_RATE : 0;
  return {
    skill,
    material: materialOf(skill),
    tier: built ? done + 1 : 0,
    ...(level ? { level } : {}),
    stage: level ? LEVEL_STAGES[level] : built ? 1 : 0,
    rate: tuned ? plain * TUNED : plain,
    tuned,
    due,
  };
}

/** An amount of each material. */
export type Rates = Record<Material, number>;

export const noRates = (): Rates => ({ stone: 0, ore: 0, timber: 0, sand: 0 });

/** What the machines make each minute between them, by material. */
export function totalRates(machines: readonly MachineState[]): Rates {
  const rates = noRates();
  for (const m of machines) rates[m.material] += m.rate;
  return rates;
}

export const sumOf = (rates: Rates): number => MATERIALS.reduce((n, m) => n + rates[m], 0);

/**
 * The crate a finished lesson pays at once: CRATE_MINUTES of the city's output, topped up to
 * CRATE_LEAST with the material of the skill practised (or of the busiest machines, in a mixed
 * lesson).
 */
export function crateFor(rates: Rates, material?: Material): Rates {
  const crate = noRates();
  for (const m of MATERIALS) crate[m] = rates[m] * CRATE_MINUTES;
  const short = CRATE_LEAST - sumOf(crate);
  if (short > 0) {
    const busiest = MATERIALS.reduce((a, b) => (rates[b] > rates[a] ? b : a));
    crate[material ?? busiest] += short;
  }
  return crate;
}

/** Everything a lesson is worth at these rates: its crate, and its power once it has run down. */
export const lessonWorth = (rates: Rates, power = LESSON_POWER): number =>
  sumOf(crateFor(rates)) + sumOf(rates) * power;

/** A city's rank, from the machines it has built. */
export const RANKS = [
  { name: "Camp", machines: 0 },
  { name: "Hamlet", machines: 1 },
  { name: "Village", machines: 8 },
  { name: "Town", machines: 20 },
  { name: "Borough", machines: 40 },
  { name: "City", machines: 60 },
  { name: "Metropolis", machines: 72 },
] as const;
export type RankName = (typeof RANKS)[number]["name"];

/**
 * The rank for a number of machines built. The top rank needs every skill of the year, however
 * many that is, and a short year stops at the rank its skills reach.
 */
export function rankOf(built: number, skillsInYear: number): RankName {
  if (skillsInYear > 0 && built >= skillsInYear && skillsInYear >= 60) return "Metropolis";
  let rank: RankName = "Camp";
  for (const r of RANKS) if (r.name !== "Metropolis" && built >= r.machines) rank = r.name;
  return rank;
}

/** What can be built in the first playable version. */
export const BUILDINGS = {
  path: { name: "Path", cost: { stone: 5 }, growth: 1, population: 0 },
  cottage: { name: "Cottage", cost: { stone: 40 }, growth: 1.08, population: 4 },
  well: { name: "Well", cost: { stone: 150 }, growth: 1.08, population: 0 },
  "masons-yard": { name: "Mason's Yard", cost: { stone: 400 }, growth: 1, population: 6 },
  "architects-office": {
    name: "Architect's Office",
    cost: { blocks: 60 },
    growth: 1,
    population: 4,
  },
  "place-value-monument": {
    name: "The Great Abacus",
    cost: { blocks: 400 },
    growth: 1,
    population: 0,
  },
} as const satisfies Record<
  string,
  { name: string; cost: Partial<Record<Good, number>>; growth: number; population: number }
>;
export type BuildingType = keyof typeof BUILDINGS;
export const BUILDING_TYPES = Object.keys(BUILDINGS) as BuildingType[];

/** Stone a Mason's Yard turns into one block. */
export const STONE_FOR_BLOCK = 10;

/** What the next one of a building costs, when `owned` of them stand already. */
export function priceOf(type: BuildingType, owned: number): Partial<Record<Good, number>> {
  const { cost, growth } = BUILDINGS[type];
  const price: Partial<Record<Good, number>> = {};
  for (const good of GOODS) {
    const base = (cost as Partial<Record<Good, number>>)[good];
    if (base !== undefined) price[good] = Math.round(base * growth ** owned);
  }
  return price;
}
