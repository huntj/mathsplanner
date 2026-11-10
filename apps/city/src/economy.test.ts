// The economy's rules, and made-up pupils played through them (simulate.ts), to keep the numbers in
// docs/proposals/city-game.md honest. The check that every stage offers about one new building a
// lesson needs the whole year's price list, and comes with it.
import {
  emptyProgress,
  finishUnitLesson,
  levelsOf,
  sectionFor,
  type Progress,
} from "@mathsplanner/learning";
import { describe, expect, it } from "vitest";
import { build, canAfford, lessonFinished, newCity } from "./city.ts";
import {
  BUILDINGS,
  crateFor,
  lessonWorth,
  machineState,
  materialOf,
  noRates,
  priceOf,
  rankOf,
  STONE_FOR_BLOCK,
  type Material,
} from "./economy.ts";
import { KEEN, simulate, SLOW, TYPICAL, type Pupil } from "./simulate.ts";

const TODAY = "2026-09-01";
const SKILL = "Y7-NPV-02.a";

const withLevel = (level: number, due = ""): Progress => {
  const progress = emptyProgress();
  progress.skills[SKILL] = { level, lessons: level, last: TODAY, box: due ? 1 : 0, due };
  return progress;
};
const state = (progress: Progress, today = TODAY) =>
  machineState(progress, SKILL, levelsOf(SKILL), today);

describe("materials", () => {
  it("gives Year 7 its four materials in the proportions the design counts", () => {
    const counts: Record<Material, number> = noRates();
    for (const unit of sectionFor("Y7")?.units ?? [])
      for (const skill of unit.skills) counts[materialOf(skill)]++;
    expect(counts).toEqual({ stone: 28, ore: 12, timber: 19, sand: 13 });
  });
});

describe("a machine", () => {
  it("is only a site until its lesson is done", () => {
    expect(state(emptyProgress())).toMatchObject({ tier: 0, rate: 0, material: "stone" });
  });

  it("is built by its lesson, at 2 a minute", () => {
    const progress = finishUnitLesson(emptyProgress(), "y7-place-value/negatives", TODAY);
    expect(state(progress)).toMatchObject({ tier: 1, rate: 2, tuned: false });
  });

  it("gets faster with each level, and runs tuned once the skill is finished", () => {
    expect(state(withLevel(1))).toMatchObject({ tier: 2, level: "Learn", rate: 3 });
    // Finished at Practise: in the review schedule, and not due until tomorrow.
    expect(state(withLevel(2, "2026-09-02"))).toMatchObject({
      level: "Practise",
      rate: 6,
      tuned: true,
    });
    expect(state(withLevel(3, "2026-09-02"))).toMatchObject({ level: "Reason", rate: 9 });
    expect(state(withLevel(4, "2026-09-02"))).toMatchObject({ level: "Legendary", rate: 12 });
  });

  it("goes back to its plain rate when its review is due, and loses nothing else", () => {
    expect(state(withLevel(3, "2026-09-02"), "2026-09-02")).toMatchObject({
      rate: 6,
      tuned: false,
      due: true,
      tier: 4,
    });
  });

  it("is built at its level when the skill was learnt without the lesson", () => {
    expect(state(withLevel(1)).tier).toBe(2);
  });
});

describe("a lesson's pay", () => {
  it("is never less than a crate of 60", () => {
    expect(crateFor(noRates(), "ore")).toEqual({ stone: 0, ore: 60, timber: 0, sand: 0 });
    expect(crateFor({ ...noRates(), stone: 2 }, "stone").stone).toBe(60);
  });

  it("is worth 40 minutes of the city's output", () => {
    expect(lessonWorth({ stone: 20, ore: 10, timber: 6, sand: 0 })).toBe(36 * 40);
  });

  it("buys the first cottage straight away", () => {
    const city = lessonFinished(newCity(1, 0), noRates(), { ...noRates(), stone: 2 }, 0, "stone");
    expect(canAfford(city, "cottage")).toBe(true);
    expect(build(city, "cottage", { x: 0, y: 0 })?.stock.stone).toBe(20);
  });
});

describe("prices and ranks", () => {
  it("raises a cottage's price by 8% each time, and leaves a path's alone", () => {
    expect(priceOf("cottage", 0)).toEqual({ stone: 40 });
    expect(priceOf("cottage", 10)).toEqual({ stone: 86 });
    expect(priceOf("path", 50)).toEqual({ stone: 5 });
  });

  it("ranks a city by the machines it has built", () => {
    expect(rankOf(0, 72)).toBe("Camp");
    expect(rankOf(1, 72)).toBe("Hamlet");
    expect(rankOf(8, 72)).toBe("Village");
    expect(rankOf(39, 72)).toBe("Town");
    expect(rankOf(71, 72)).toBe("City");
    expect(rankOf(72, 72)).toBe("Metropolis");
    // A longer year needs every one of its skills for the top rank.
    expect(rankOf(72, 176)).toBe("City");
  });
});

describe("the Place value zone, played in one sitting", () => {
  const run = simulate("Y7", { ...TYPICAL, perDay: 99 }, ["y7-place-value"]);

  it("is 18 lessons: each skill's lesson and levels to mastery, then the unit review", () => {
    expect(run.steps).toHaveLength(18);
    expect(run.steps.at(-1)).toMatchObject({ machines: 4, rate: 36 });
  });

  it("pays what the design's table says", () => {
    expect(run.steps.map((s) => s.worth)).toEqual([
      120, 150, 180, 300, 380, 420, 540, 620, 660, 780, 860, 900, 1020, 1080, 1200, 1320, 1440,
      1440,
    ]);
  });

  it("pays for the yard, the office, the monument and a small town of cottages", () => {
    const blocks =
      BUILDINGS["architects-office"].cost.blocks + BUILDINGS["place-value-monument"].cost.blocks;
    let left =
      run.city.stock.stone - BUILDINGS["masons-yard"].cost.stone - blocks * STONE_FOR_BLOCK;
    let cottages = 0;
    for (;;) {
      const price = priceOf("cottage", cottages).stone ?? 0;
      if (price > left) break;
      left -= price;
      cottages++;
    }
    expect(run.city.stock.stone).toBeGreaterThan(18_000);
    expect(cottages).toBeGreaterThanOrEqual(35);
    expect(cottages).toBeLessThanOrEqual(60);
  });
});

describe("a whole year", () => {
  const year = (pupil: Pupil) => {
    const run = simulate("Y7", pupil);
    const worth = run.steps.map((s) => s.worth);
    const total = Object.values(run.city.stock).reduce((a, b) => a + b, 0);
    return { run, worth, last: worth.at(-1) ?? 0, total };
  };
  const slow = year(SLOW);
  const typical = year(TYPICAL);
  const keen = year(KEEN);

  it("builds all 72 machines for every pupil", () => {
    for (const pupil of [slow, typical, keen]) expect(pupil.run.steps.at(-1)?.machines).toBe(72);
  });

  it("grows steadily, not explosively", () => {
    for (const pupil of [slow, typical, keen]) {
      expect(Math.min(...pupil.worth)).toBeGreaterThanOrEqual(120);
      // No lesson is worth more than every machine Legendary and tuned.
      expect(Math.max(...pupil.worth)).toBeLessThanOrEqual(72 * 12 * 40);
      // The whole year, unspent, stays a number that can be shown in full.
      expect(pupil.total).toBeLessThan(10_000_000);
    }
    expect(typical.last / (typical.worth[0] ?? 1)).toBeGreaterThan(100);
    expect(typical.last / (typical.worth[0] ?? 1)).toBeLessThan(400);
  });

  it("ends about where the design says", () => {
    expect(typical.last).toBeGreaterThan(20_000);
    expect(typical.last).toBeLessThan(30_000);
    expect(keen.last).toBeGreaterThan(30_000);
  });

  it("pays a pupil who never tunes up or masters a skill well too", () => {
    expect(slow.last).toBeGreaterThan(0.4 * typical.last);
    expect(slow.total).toBeGreaterThan(1_000_000);
  });

  it("never sets a pupil who keeps working back far", () => {
    // Tuning can lapse, so a lesson may be worth less than the one before, but never by much.
    for (const pupil of [slow, typical, keen]) {
      let best = 0;
      for (const w of pupil.worth) {
        expect(w).toBeGreaterThan(best * 0.6);
        best = Math.max(best, w);
      }
    }
  });
});
