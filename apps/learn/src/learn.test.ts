import type { CourseSection, Depth } from "@mathsplanner/core";
import { describe, expect, it } from "vitest";
import { buildPath, course, skillLevels, YEARS, yearsReady, type SkillLevels } from "./course.ts";
import { exampleProgress } from "./example.ts";
import { familyOf } from "./families.ts";
import {
  addDays,
  emptyProgress,
  loadProgress,
  readProgress,
  saveProgress,
  STORAGE_KEY,
  streak,
} from "./progress.ts";
import { hasGenerator, levelsOf, misconceptionsOf } from "./skills.ts";
import { pathFor } from "./path.ts";
import topicsFile from "../../../data/topics.json" with { type: "json" };

const names = (info: SkillLevels) => info.levels.map((l) => l.name);

describe("skill levels", () => {
  it("climbs every depth a generator supports, with Reason marking mastery", () => {
    const all = skillLevels([1, 2, 3, 4, 5]);
    expect(names(all)).toEqual(["Learn", "Practise", "Picture", "Reason", "Legendary"]);
    expect(all).toMatchObject({ pathLevels: 3, mastery: 4 });
    expect(all.levels[0]).toEqual({ name: "Learn", depths: [1], numbers: "friendly" });
    expect(all.levels[4]).toEqual({ name: "Legendary", depths: [5], numbers: "stretch" });
  });

  it("leaves out levels whose depth is missing, and makes the deepest one legendary", () => {
    const typical = skillLevels([1, 2, 4]);
    expect(names(typical)).toEqual(["Learn", "Practise", "Reason", "Legendary"]);
    expect(typical).toMatchObject({ pathLevels: 2, mastery: 3 });
    expect(typical.levels[3]).toEqual({ name: "Legendary", depths: [4], numbers: "stretch" });

    const noReasoning = skillLevels([1, 2, 3] as Depth[]);
    expect(names(noReasoning)).toEqual(["Learn", "Practise", "Picture", "Legendary"]);
    expect(noReasoning.mastery).toBeUndefined();
  });
});

const SECTION: CourseSection = {
  stage: "Y7",
  name: "Year 7",
  units: [
    { id: "a", name: "A", topic: "ratio", skills: ["a1", "a2"] },
    { id: "b", name: "B", topic: "ratio", skills: ["b1", "b2"] },
  ],
};
const INFO = skillLevels([1, 2, 4]);

describe("the path", () => {
  it("opens the first unfinished skill and locks the rest", () => {
    const levels: Record<string, number> = { a1: 2, a2: 1 };
    const units = buildPath(
      SECTION,
      (s) => levels[s] ?? 0,
      () => INFO,
    );
    expect(units.flatMap((u) => u.nodes.map((n) => n.state))).toEqual([
      "done",
      "current",
      "locked",
      "locked",
    ]);
    expect(units.map((u) => u.review)).toEqual(["locked", "locked"]);
  });

  it("marks mastered and legendary skills, opens reviews and keeps skills started out of order", () => {
    const levels: Record<string, number> = { a1: 3, a2: 4, b2: 1 };
    const units = buildPath(
      SECTION,
      (s) => levels[s] ?? 0,
      () => INFO,
    );
    expect(units.flatMap((u) => u.nodes.map((n) => n.state))).toEqual([
      "mastered",
      "legendary",
      "current",
      "started",
    ]);
    expect(units.map((u) => u.review)).toEqual(["open", "locked"]);
  });

  it("locks nothing in teacher mode", () => {
    const levels: Record<string, number> = { a1: 2 };
    const units = buildPath(
      SECTION,
      (s) => levels[s] ?? 0,
      () => INFO,
      { open: true, reviewed: (id) => id === "b" },
    );
    expect(units.flatMap((u) => u.nodes.map((n) => n.state))).toEqual([
      "done",
      "current",
      "started",
      "started",
    ]);
    expect(units.map((u) => u.review)).toEqual(["open", "done"]);
  });
});

describe("the course in the app", () => {
  it("has a generator for every skill, and a family for every topic up to GCSE", () => {
    const skills = course.sections.flatMap((s) => s.units.flatMap((u) => u.skills));
    expect(skills.filter((s) => !hasGenerator(s))).toEqual([]);
    const gcse = new Set(YEARS.map((y) => y.stage));
    const topics = (topicsFile as { topics: { id: string; statements: string[] }[] }).topics.filter(
      (t) =>
        t.statements.some((id) => gcse.has(id.split("-")[0] as (typeof YEARS)[number]["stage"])),
    );
    const unmapped = topics.filter((t) => familyOf(t.id) === "number" && !NUMBER_TOPICS.has(t.id));
    expect(unmapped.map((t) => t.id)).toEqual([]);
  });

  it("gives every skill at least one level to move along the path", () => {
    for (const s of course.sections.flatMap((x) => x.units.flatMap((u) => u.skills)))
      expect(levelsOf(s).pathLevels).toBeGreaterThan(0);
  });
});

const NUMBER_TOPICS = new Set([
  "counting",
  "place-value",
  "negatives",
  "rounding",
  "standard-form",
  "surds",
  "factors",
  "powers",
  "listing",
]);

describe("progress", () => {
  const today = "2026-10-29";

  it("counts a streak of days that met the goal, carrying on from yesterday until today ends", () => {
    const p = emptyProgress();
    p.settings.dailyGoal = 2;
    for (let d = 1; d <= 5; d++) p.days[addDays(today, -d)] = 2;
    p.days[addDays(today, -7)] = 3;
    expect(streak(p, today)).toBe(5);
    p.days[today] = 2;
    expect(streak(p, today)).toBe(6);
    p.days[addDays(today, -3)] = 1;
    expect(streak(p, today)).toBe(3);
  });

  it("works out days across month and year ends", () => {
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
  });

  it("reads back what it saved and drops anything invalid", () => {
    const store = new Map<string, string>();
    const storage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
    };
    const p = emptyProgress();
    p.settings.stage = "Y7";
    p.skills["Y7-ALG-04.a"] = { level: 2, lessons: 2, last: today, box: 3, due: "2026-11-05" };
    p.xp = 25;
    p.days[today] = 2;
    p.mistakes["ALG.LIKE"] = 1;
    p.reviews["y7-notation"] = today;
    expect(saveProgress(p, storage)).toBe(true);
    expect(loadProgress(storage)).toEqual(p);

    store.set(STORAGE_KEY, "not json");
    expect(loadProgress(storage)).toEqual(emptyProgress());
    expect(readProgress({ version: 99 })).toEqual(emptyProgress());
    expect(
      readProgress({
        version: 1,
        settings: { stage: "Y99", dailyGoal: 4, sound: "yes", theme: "dark", teacher: true },
        skills: {
          a: { level: -1, lessons: 2.5, last: "today" },
          b: "x",
          c: { level: 2, lessons: 2, last: today, box: 9, due: today },
        },
        xp: "lots",
        days: { "2026-10-29": 2, tomorrow: 1 },
        reviews: { u1: today, u2: "soon" },
      }),
    ).toEqual({
      ...emptyProgress(),
      settings: { ...emptyProgress().settings, theme: "dark", teacher: true },
      skills: {
        a: { level: 0, lessons: 0, last: "", box: 0, due: "" },
        c: { level: 2, lessons: 2, last: today, box: 6, due: today },
      },
      days: { "2026-10-29": 2 },
      reviews: { u1: today },
    });
  });

  it("copes with storage that throws", () => {
    const broken = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    };
    expect(loadProgress(broken)).toEqual(emptyProgress());
    expect(saveProgress(emptyProgress(), broken)).toBe(false);
  });
});

describe("example progress", () => {
  it("finishes about half of Year 7, with reviews and mistakes to do and a streak", () => {
    const section = course.sections.find((s) => s.stage === "Y7");
    if (!section) throw new Error("no Year 7");
    const today = "2026-10-29";
    const p = exampleProgress(section, levelsOf, today, misconceptionsOf);
    expect(p.example).toBe(true);
    expect(p.settings.stage).toBe("Y7");
    const units = pathFor(section, p, today);
    const half = Math.ceil(units.length / 2);
    expect(units.slice(0, half - 2).every((u) => u.review === "done")).toBe(true);
    expect(units.slice(half - 2, half).every((u) => u.review === "open")).toBe(true);
    const due = units.flatMap((u) => u.nodes.filter((n) => n.due));
    expect(due.length).toBeGreaterThan(3);
    expect(due.length).toBeLessThan(units.slice(0, half).flatMap((u) => u.nodes).length);
    expect(Object.keys(p.mistakes)).toHaveLength(3);
    const states = units.flatMap((u) => u.nodes.map((n) => n.state));
    expect(states.filter((s) => s === "current")).toHaveLength(1);
    expect(states).toContain("mastered");
    expect(states).toContain("legendary");
    expect(units[half]?.nodes[1]?.state).toBe("current");
    expect(streak(p, today)).toBe(14);
    expect(readProgress(JSON.parse(JSON.stringify(p)))).toEqual(p);
  });
});

describe("the years ready so far", () => {
  it("names them for the test version's notes", () => {
    expect(yearsReady(["Y7"])).toBe("Year 7 is");
    expect(yearsReady(["Y8", "Y7"])).toBe("Years 7 and 8 are");
    expect(yearsReady(["Y7", "Y8", "Y9"])).toBe("Years 7, 8 and 9 are");
    expect(yearsReady(["Y7", "Y8", "GF"])).toBe("Years 7, 8 and GCSE Foundation are");
    expect(yearsReady(["GF", "GH"])).toBe("GCSE Foundation and GCSE Higher are");
    expect(yearsReady()).toMatch(/^Years? .+ (is|are)$/);
  });
});
