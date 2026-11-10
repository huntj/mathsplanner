import { describe, expect, it } from "vitest";
import {
  build,
  canAfford,
  emptySave,
  lessonFinished,
  loadSave,
  newCity,
  nextPrice,
  occupied,
  placeMachine,
  population,
  powerLeft,
  readSave,
  SAVE_KEY,
  settle,
  storeSave,
  withCity,
} from "./city.ts";
import { noRates } from "./economy.ts";

const MINUTE = 60_000;
const T0 = 1_800_000_000_000;
const stone = (n: number) => ({ ...noRates(), stone: n });

describe("power and production", () => {
  it("makes nothing without power", () => {
    const city = settle(newCity(1, T0), stone(6), T0 + 60 * MINUTE);
    expect(city.stock.stone).toBe(0);
  });

  it("a lesson pays a crate at once and 30 minutes of power", () => {
    const city = lessonFinished(newCity(1, T0), noRates(), stone(2), T0, "stone");
    expect(city.stock.stone).toBe(60);
    expect(powerLeft(city, T0)).toBe(30);
    expect(city.lessons).toBe(1);
  });

  it("runs while there is power and stops when it has gone", () => {
    const start = lessonFinished(newCity(1, T0), noRates(), stone(2), T0, "stone");
    const tenMinutes = settle(start, stone(2), T0 + 10 * MINUTE);
    expect(tenMinutes.stock.stone).toBeCloseTo(80);
    const nextDay = settle(tenMinutes, stone(2), T0 + 24 * 60 * MINUTE);
    expect(nextDay.stock.stone).toBeCloseTo(120);
    expect(powerLeft(nextDay, T0 + 24 * 60 * MINUTE)).toBe(0);
  });

  it("gives the same stock however often it is settled", () => {
    const start = lessonFinished(newCity(1, T0), noRates(), stone(4), T0, "stone");
    let often = start;
    for (let s = 1; s <= 45 * 60; s++) often = settle(often, stone(4), T0 + s * 1000);
    const once = settle(start, stone(4), T0 + 45 * MINUTE);
    expect(often.stock.stone).toBeCloseTo(once.stock.stone, 6);
  });

  it("saves power up: three lessons in a row give ninety minutes", () => {
    let city = newCity(1, T0);
    for (let i = 0; i < 3; i++) city = lessonFinished(city, stone(2), stone(2), T0, "stone");
    expect(powerLeft(city, T0)).toBe(90);
  });

  it("gains nothing and loses nothing when the clock is set back", () => {
    const start = lessonFinished(newCity(1, T0), noRates(), stone(2), T0, "stone");
    expect(settle(start, stone(2), T0 - 60 * MINUTE)).toBe(start);
  });

  it("a crate is ten minutes of the city's output once that passes 60", () => {
    const rates = { stone: 20, ore: 6, timber: 0, sand: 0 };
    const city = lessonFinished(newCity(1, T0), rates, rates, T0);
    expect(city.stock.stone).toBe(200);
    expect(city.stock.ore).toBe(60);
  });
});

describe("building", () => {
  const rich = () => ({ ...newCity(1, T0), stock: { ...newCity(1, T0).stock, stone: 1000 } });

  it("buys a building, and each cottage costs 8% more than the last", () => {
    let city = rich();
    expect(nextPrice(city, "cottage")).toEqual({ stone: 40 });
    city = build(city, "cottage", { x: 1, y: 1 }) ?? city;
    expect(city.stock.stone).toBe(960);
    expect(nextPrice(city, "cottage")).toEqual({ stone: 43 });
    expect(population(city)).toBe(4);
  });

  it("will not build on a taken square, or without the stock", () => {
    const city = placeMachine(rich(), "Y7-NPV-01", { x: 2, y: 2 });
    expect(occupied(city, { x: 2, y: 2 })).toBe(true);
    expect(build(city, "cottage", { x: 2, y: 2 })).toBeUndefined();
    expect(canAfford(city, "architects-office")).toBe(false);
    expect(build(city, "architects-office", { x: 3, y: 3 })).toBeUndefined();
  });

  it("does not let a fraction of a stone buy anything", () => {
    const city = { ...newCity(1, T0), stock: { ...newCity(1, T0).stock, stone: 39.9 } };
    expect(canAfford(city, "cottage")).toBe(false);
  });
});

describe("the save", () => {
  it("comes back as it was stored", () => {
    const store = new Map<string, string>();
    const storage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
    };
    let city = lessonFinished(newCity(42, T0), noRates(), stone(2), T0, "stone");
    city = placeMachine(city, "Y7-NPV-01", { x: 3, y: 4 });
    city = build(city, "cottage", { x: 5, y: 5 }) ?? city;
    const save = withCity(emptySave(), "Y7", city);
    expect(storeSave(save, storage)).toBe(true);
    expect(store.has(SAVE_KEY)).toBe(true);
    expect(loadSave(storage)).toEqual(save);
  });

  it("starts afresh from anything unreadable", () => {
    expect(readSave(null)).toEqual(emptySave());
    expect(readSave({ version: 99, cities: {} })).toEqual(emptySave());
    expect(loadSave({ getItem: () => "{not json" })).toEqual(emptySave());
  });

  it("keeps only what is valid", () => {
    const save = readSave({
      version: 1,
      cities: {
        Y7: {
          seed: 7,
          settledAt: T0,
          poweredUntil: T0 - 5,
          lessons: -3,
          machines: { "Y7-NPV-01": { x: 1, y: 2 }, bad: { x: "1" } },
          buildings: [{ type: "cottage", x: 0, y: 0 }, { type: "castle", x: 1, y: 1 }, 7],
          stock: { stone: 12.5, ore: -4, timber: "lots" },
        },
        Y99: { seed: 1 },
      },
    });
    const city = save.cities.Y7;
    expect(Object.keys(save.cities)).toEqual(["Y7"]);
    expect(city?.machines).toEqual({ "Y7-NPV-01": { x: 1, y: 2 } });
    expect(city?.buildings).toEqual([{ type: "cottage", x: 0, y: 0 }]);
    expect(city?.stock.stone).toBe(12.5);
    expect(city?.stock.ore).toBe(0);
    expect(city?.stock.timber).toBe(0);
    expect(city?.lessons).toBe(0);
    expect(city?.poweredUntil).toBe(T0);
  });
});
