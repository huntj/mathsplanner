import { describe, expect, it } from "vitest";
import {
  allocate,
  courseById,
  coverage,
  draftScheme,
  emptyScheme,
  formatScheme,
  lessonsOf,
  needsOf,
  parseScheme,
  placeItem,
  placesOf,
  prerequisitesOf,
  setLessons,
  weekHomework,
  weekPlan,
  type Course,
  type HomeworkOptions,
  type Scheme,
} from "./scheme.ts";
import { formatRoute, parseRoute, reviewCount, sessionItems, stepsOf } from "./session.ts";
import { courseTopics, mainTopic, suggest, topicsOf } from "./topics.ts";

const course = (id: string) => courseById.get(id) as Course;
const options: HomeworkOptions = {
  count: 10,
  earlierTerms: false,
  numbers: "standard",
  feedback: "each",
};

/** Year 7, three lessons a week: GF-A4's style of steps spread over the first weeks. */
function year7(): Scheme {
  const s = emptyScheme(course("Y7"), undefined, "7X2", 42);
  s.halfTerms[0] = {
    weeks: 6,
    items: ["Y7-NPV-01", "Y7-NPV-02", "Y7-NPV-03", "Y7-NPV-04", "Y7-NPV-05", "Y7-NPV-06"],
  };
  s.halfTerms[1] = { weeks: 7, items: ["Y7-ALG-01", "Y7-ALG-02"] };
  return s;
}

describe("scheme links with class, lessons and seed", () => {
  it("round-trips the class, lessons a week, lesson changes and seed", () => {
    let scheme = year7();
    scheme = setLessons({ ...scheme, lessonsPerWeek: 4 }, "Y7-NPV-01", 3);
    const link = formatScheme(scheme);
    expect(link).toContain("class=7X2");
    expect(link).toContain("Y7-NPV-01*3");
    expect(parseScheme(link.split("?")[1] ?? "")).toEqual(scheme);
    expect(parseRoute(formatRoute({ page: "scheme", scheme, guide: 2 }))).toEqual({
      page: "scheme",
      scheme,
      guide: 2,
    });
  });

  it("reads older links with defaults", () => {
    const scheme = parseScheme("course=Y7&title=Old&h1=Y7-NPV-01*99,Y7-NPV-02");
    expect(scheme).toMatchObject({ className: "", lessonsPerWeek: 3, seed: 0, lessons: {} });
    expect(scheme?.title).toBe("Old");
  });

  it("names a one-year course for Years 10 to 13 and offers its year's statements", () => {
    expect(course("GH10").name).toBe("Year 10 GCSE Higher");
    expect(course("AL13").years).toEqual(["Year 13"]);
    expect(emptyScheme(course("GH10")).halfTerms).toHaveLength(6);
    expect(emptyScheme(course("Y3")).lessonsPerWeek).toBe(5);
  });
});

describe("lessons and weeks", () => {
  it("gives a statement one lesson a step, and puts each item in the week it starts", () => {
    expect(lessonsOf(year7(), "Y7-NPV-02")).toBe((stepsOf.get("Y7-NPV-02") ?? []).length);
    expect(lessonsOf(year7(), "Y7-NPV-06")).toBe(1);
    const plan = weekPlan(year7(), 0);
    expect(plan.capacity).toBe(18);
    expect(plan.starts[0]).toBe(0);
    expect(plan.starts).toEqual([...plan.starts].sort((a, b) => a - b));
    // A statement split into steps is taught a step a lesson, so its steps can span weeks.
    const steps = (stepsOf.get("Y7-NPV-03") ?? []).map((s) => s.id);
    const weeksOfSteps = plan.weeks.flatMap((w, i) =>
      w.some((id) => steps.includes(id)) ? [i] : [],
    );
    expect(weeksOfSteps.length).toBeGreaterThan(1);
    expect(plan.weeks.flat()).not.toContain("Y7-NPV-03");
    // Giving it lessons of its own keeps it whole, in one week.
    const whole = weekPlan(setLessons(year7(), "Y7-NPV-03", 2), 0);
    expect(whole.weeks.flat()).toContain("Y7-NPV-03");
  });

  it("puts anything past the last week into the last week", () => {
    const plan = weekPlan({ ...year7(), lessonsPerWeek: 1 }, 0);
    expect(plan.lessons).toBeGreaterThan(plan.capacity);
    expect(plan.weeks).toHaveLength(6);
    expect(Math.max(...plan.starts)).toBe(5);
  });
});

describe("weekly homework", () => {
  it("shares call-backs so every earlier week appears and recent weeks get more", () => {
    expect(allocate([["a"], ["b"], ["c"]], 5, "recent").map((g) => g.count)).toEqual([1, 2, 2]);
    expect(allocate([["a"], ["b"], ["c"]], 6, "even").map((g) => g.count)).toEqual([2, 2, 2]);
    const merged = allocate([["a"], ["b"], ["c"], ["d"]], 2, "recent");
    expect(merged).toEqual([
      { statements: ["a", "b", "c"], count: 1 },
      { statements: ["d"], count: 1 },
    ]);
    expect(allocate([[], ["a"]], 0, "recent")).toEqual([]);
  });

  it("practises the first week's content only, then mixes in earlier weeks", () => {
    const scheme = year7();
    const plan = weekPlan(scheme, 0);
    const first = weekHomework(scheme, 0, 0, options);
    expect(first?.kind).toBe("week");
    expect(first?.spec.review).toBeUndefined();
    expect(first?.spec.statements).toEqual(plan.weeks[0]);
    expect(first?.spec.title).toBe("7X2: Autumn 1 week 1 homework");

    const third = weekHomework(scheme, 0, 2, options);
    expect(third?.spec.statements).toEqual(plan.weeks[2]);
    expect(reviewCount(third?.spec.review)).toBe(5);
    expect(third?.spec.review?.groups.map((g) => g.statements)).toEqual([
      plan.weeks[0],
      plan.weeks[1],
    ]);
    expect(third?.spec.review?.depths).toEqual([2, 3, 4]);

    if (!third) throw new Error("no homework for week 3");
    const items = sessionItems(third.spec);
    expect(items).toHaveLength(10);
    const old = new Set([...(plan.weeks[0] ?? []), ...(plan.weeks[1] ?? [])]);
    const recalled = items.filter((i) => old.has(i.statementId));
    expect(recalled).toHaveLength(5);
    for (const i of recalled) expect([2, 3, 4]).toContain(i.depth);
    // The link opens the same homework.
    const spec = third.spec;
    const route = parseRoute(formatRoute({ page: "session", spec }));
    expect(route).toEqual({ page: "session", spec });
    expect(weekHomework(scheme, 0, 2, options)).toEqual(third);
  });

  it("reviews the whole half-term in the last week, with a question on every item", () => {
    const scheme = year7();
    const plan = weekPlan(scheme, 0);
    const last = weekHomework(scheme, 0, plan.weeks.length - 1, options);
    expect(last?.kind).toBe("review");
    const units = plan.weeks.flat();
    expect(last?.spec.count).toBe(Math.max(10, units.length));
    if (!last) throw new Error("no review homework");
    const asked = new Set(sessionItems(last.spec).map((i) => i.statementId));
    for (const id of units) expect(asked.has(id), id).toBe(true);
  });

  it("can call back to earlier half-terms, and gives empty weeks call-backs only", () => {
    const scheme = year7();
    const withTerms = weekHomework(scheme, 1, 1, { ...options, earlierTerms: true });
    expect(withTerms?.spec.review?.groups[0]?.statements).toEqual(scheme.halfTerms[0]?.items);
    // Autumn 2 has two items over seven weeks, so week 4 has nothing new.
    const quiet = weekHomework(scheme, 1, 3, options);
    expect(quiet?.taught).toEqual([]);
    expect(reviewCount(quiet?.spec.review)).toBe(10);
    expect(weekHomework(emptyScheme(course("Y7")), 0, 0, options)).toBeUndefined();
  });
});

describe("prerequisites across years", () => {
  it("treats what a second-year scheme leaves out as taught last year", () => {
    const y10 = placeItem(emptyScheme(course("GH10")), "GF-A18", 0);
    const y11 = placeItem(emptyScheme(course("GH11")), "GF-A18", 0);
    const statuses = (s: Scheme) => needsOf(s, placesOf(s), "GF-A18").map((n) => n.status);
    expect(statuses(y10)).toContain("missing");
    expect(statuses(y11)).not.toContain("missing");
    expect(prerequisitesOf(y10, 0).length).toBeGreaterThan(0);
  });
});

describe("coverage", () => {
  it("lists the year's statements not yet planned, and none once a draft is made", () => {
    const empty = coverage(emptyScheme(course("Y5")));
    expect(empty?.unplanned.length).toBe(empty?.all.length);
    expect(empty?.unplanned.some((s) => s.statutory)).toBe(true);
    expect(coverage(draftScheme(course("Y5")))?.unplanned).toEqual([]);
    const part = placeItem(emptyScheme(course("GF10")), "GF-A4.a", 0);
    expect(coverage(part)?.partly.map((s) => s.id)).toEqual(["GF-A4"]);
  });
});

describe("topics", () => {
  it("gives every statement a topic, steps their parent's", () => {
    expect(mainTopic("Y5-MD-01")).toBe("factors");
    expect(mainTopic("GF-A4.b")).toBe("expressions");
    expect(topicsOf("Y6-FR-01")).toEqual(["fractions", "factors"]);
  });

  it("offers a year's topics and suggests statements around the year", () => {
    const topics = courseTopics(course("Y7")).map((t) => t.id);
    expect(topics).toContain("factors");
    expect(topics).not.toContain("differentiation");
    const factors = suggest(course("Y7"), "factors");
    expect(factors.thisYear.map((s) => s.id)).toEqual(["Y7-NPV-04"]);
    expect(factors.earlier.map((s) => s.id)).toContain("Y5-MD-01");
    expect(factors.neededFirst.has("Y5-MD-01")).toBe(true);
    for (const s of factors.earlier) expect(["Y5", "Y6"]).toContain(s.stage);
    const equations = suggest(course("Y7"), "equations");
    expect(equations.stretch.map((s) => s.id)).toContain("Y8-ALG-04");
    expect(equations.otherTopics.map((s) => s.id)).toContain("Y7-ALG-04");
    // A level stretch stays within A level.
    const vectors = suggest(course("AL12"), "vectors");
    expect(vectors.earlier.some((s) => s.stage === "GF")).toBe(true);
    for (const s of vectors.stretch) expect(s.stage).toBe("AL");
  });
});
