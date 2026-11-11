// The city's save, kept only in this browser beside the learning record (see progress.ts in
// @mathsplanner/learning): for each year, the map's seed, where machines and buildings stand, the
// stock of each good, and how long the power lasts. A machine's tier is never saved: it is read
// from the learning record. It is one versioned object, changed only by pure functions; whatever
// is read back is checked, and anything unreadable starts afresh rather than breaking the game.
import { STAGES, type Stage } from "@mathsplanner/core";
import {
  BUILDING_TYPES,
  BUILDINGS,
  crateFor,
  GOODS,
  LESSON_POWER,
  MATERIALS,
  priceOf,
  type BuildingType,
  type Good,
  type Material,
  type Rates,
} from "./economy.ts";

export const SAVE_VERSION = 1;
export const SAVE_KEY = "mathscity.save";

const MINUTE = 60_000;

/** A square of the map. */
export interface Tile {
  x: number;
  y: number;
}

export interface Building extends Tile {
  type: BuildingType;
}

export type Stock = Record<Good, number>;

/** One year's city. */
export interface City {
  /** What the year's map is made from, so each pupil's is their own. */
  seed: number;
  /** Where each skill's machine stands, by skill. */
  machines: Record<string, Tile>;
  buildings: Building[];
  /** What is in stock. Kept exactly; shown rounded down. */
  stock: Stock;
  /** When the power runs out, and the moment the stock was last brought up to date (ms). */
  poweredUntil: number;
  settledAt: number;
  /** Lessons finished in this city, for landmarks. */
  lessons: number;
}

export interface CitySave {
  version: typeof SAVE_VERSION;
  cities: Partial<Record<Stage, City>>;
}

export const emptyStock = (): Stock => ({
  stone: 0,
  ore: 0,
  timber: 0,
  sand: 0,
  blocks: 0,
  frames: 0,
  panes: 0,
});

export const newCity = (seed: number, now: number): City => ({
  seed,
  machines: {},
  buildings: [],
  stock: emptyStock(),
  poweredUntil: now,
  settledAt: now,
  lessons: 0,
});

export const emptySave = (): CitySave => ({ version: SAVE_VERSION, cities: {} });

const isRecord = (x: unknown): x is Record<string, unknown> =>
  typeof x === "object" && x !== null && !Array.isArray(x);
const amount = (x: unknown) => (typeof x === "number" && Number.isFinite(x) && x >= 0 ? x : 0);
const whole = (x: unknown) => Math.floor(amount(x));

function readTile(raw: unknown): Tile | undefined {
  if (!isRecord(raw) || !Number.isInteger(raw.x) || !Number.isInteger(raw.y)) return undefined;
  return { x: raw.x as number, y: raw.y as number };
}

function readCity(raw: unknown): City | undefined {
  if (!isRecord(raw)) return undefined;
  const city = newCity(whole(raw.seed), amount(raw.settledAt));
  city.poweredUntil = Math.max(amount(raw.poweredUntil), city.settledAt);
  city.lessons = whole(raw.lessons);
  if (isRecord(raw.machines))
    for (const [skill, value] of Object.entries(raw.machines)) {
      const tile = readTile(value);
      if (tile) city.machines[skill] = tile;
    }
  if (Array.isArray(raw.buildings))
    for (const value of raw.buildings) {
      const tile = readTile(value);
      const type = isRecord(value) ? value.type : undefined;
      if (tile && BUILDING_TYPES.includes(type as BuildingType))
        city.buildings.push({ ...tile, type: type as BuildingType });
    }
  if (isRecord(raw.stock)) for (const good of GOODS) city.stock[good] = amount(raw.stock[good]);
  return city;
}

/** Reads a stored save, keeping only what is valid. */
export function readSave(raw: unknown): CitySave {
  const save = emptySave();
  if (!isRecord(raw) || raw.version !== SAVE_VERSION || !isRecord(raw.cities)) return save;
  for (const stage of STAGES) {
    const city = readCity(raw.cities[stage]);
    if (city) save.cities[stage] = city;
  }
  return save;
}

function safeStorage(): Storage | undefined {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}

/** The stored save, or an empty one when there is none or storage is unavailable. */
export function loadSave(storage: Pick<Storage, "getItem"> | undefined = safeStorage()): CitySave {
  try {
    const text = storage?.getItem(SAVE_KEY);
    return text ? readSave(JSON.parse(text)) : emptySave();
  } catch {
    return emptySave();
  }
}

/** Stores the save; false when the browser will not keep it (a private window, for example). */
export function storeSave(
  save: CitySave,
  storage: Pick<Storage, "setItem"> | undefined = safeStorage(),
): boolean {
  try {
    storage?.setItem(SAVE_KEY, JSON.stringify(save));
    return storage !== undefined;
  } catch {
    return false;
  }
}

export const withCity = (save: CitySave, stage: Stage, city: City): CitySave => ({
  ...save,
  cities: { ...save.cities, [stage]: city },
});

/** Minutes of power left at a moment. */
export const powerLeft = (city: City, now: number): number =>
  Math.max(0, city.poweredUntil - now) / MINUTE;

/**
 * Brings the stock up to date: the machines made `rates` each minute for as long as there was
 * power since the stock was last settled. Call it with the rates as they were over that time, so
 * before recording anything that changes them. A clock set back makes nothing and loses nothing.
 */
export function settle(city: City, rates: Rates, now: number): City {
  if (now <= city.settledAt) return city;
  const ran = Math.max(0, Math.min(now, city.poweredUntil) - city.settledAt) / MINUTE;
  const stock = { ...city.stock };
  for (const m of MATERIALS) stock[m] += rates[m] * ran;
  return { ...city, stock, settledAt: now };
}

/**
 * Records a finished lesson: the stock is settled at the old rates, then the crate arrives (at
 * the new rates, which the lesson may have raised) and the power is topped up.
 */
export function lessonFinished(
  city: City,
  before: Rates,
  after: Rates,
  now: number,
  material?: Material,
  power = LESSON_POWER,
): City {
  const settled = settle(city, before, now);
  const crate = crateFor(after, material);
  const stock = { ...settled.stock };
  for (const m of MATERIALS) stock[m] += crate[m];
  return {
    ...settled,
    stock,
    poweredUntil: Math.max(settled.poweredUntil, now) + power * MINUTE,
    lessons: settled.lessons + 1,
  };
}

/** Puts a skill's machine on a square. Machines cost nothing: the lesson is the price. */
export const placeMachine = (city: City, skill: string, tile: Tile): City => ({
  ...city,
  machines: { ...city.machines, [skill]: tile },
});

export const countOf = (city: City, type: BuildingType): number =>
  city.buildings.filter((b) => b.type === type).length;

/** What the next one of a building costs in this city. */
export const nextPrice = (city: City, type: BuildingType) => priceOf(type, countOf(city, type));

export function canAfford(city: City, type: BuildingType): boolean {
  const price = nextPrice(city, type);
  return GOODS.every((good) => Math.floor(city.stock[good]) >= (price[good] ?? 0));
}

/** Whether anything stands on a square. */
export const occupied = (city: City, tile: Tile): boolean =>
  city.buildings.some((b) => b.x === tile.x && b.y === tile.y) ||
  Object.values(city.machines).some((m) => m.x === tile.x && m.y === tile.y);

/** Buys a building and puts it on a square, or returns undefined if it cannot be paid for or the
 * square is taken. Settle the stock first. */
export function build(city: City, type: BuildingType, tile: Tile): City | undefined {
  if (!canAfford(city, type) || occupied(city, tile)) return undefined;
  const price = nextPrice(city, type);
  const stock = { ...city.stock };
  for (const good of GOODS) stock[good] -= price[good] ?? 0;
  return { ...city, stock, buildings: [...city.buildings, { ...tile, type }] };
}

/** Everyone who lives in the city: a number that only goes up. */
export const population = (city: City): number =>
  city.buildings.reduce((n, b) => n + BUILDINGS[b.type].population, 0);
