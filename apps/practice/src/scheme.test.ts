import { describe, expect, it } from "vitest";
import {
  COURSES,
  courseById,
  coursePool,
  draftScheme,
  earlierItems,
  emptyScheme,
  fileName,
  formatScheme,
  halfTermName,
  needsOf,
  parseScheme,
  placeItem,
  placesOf,
  readSchemeFile,
  removeItem,
  schemeFile,
  warningsPerTerm,
  yearSoFar,
  type Course,
  type Scheme,
} from "./scheme.ts";
import {
  formatRoute,
  generatorFor,
  parseRoute,
  sessionItems,
  stepsOf,
  type SessionSpec,
} from "./session.ts";

const course = (id: string) => courseById.get(id) as Course;
const query = (scheme: Scheme) => formatScheme(scheme).split("?")[1] ?? "";

function sample(): Scheme {
  const s = emptyScheme(course("GF"), "GCSE algebra");
  s.halfTerms[0] = { weeks: 8, items: ["GF-A4.a", "GF-A4.b", "GF-N1"] };
  s.halfTerms[3] = { weeks: 5, items: ["GF-A4.c"] };
  return s;
}

describe("scheme links and files", () => {
  it("has six half-terms a year", () => {
    expect(emptyScheme(course("Y7")).halfTerms).toHaveLength(6);
    expect(emptyScheme(course("KS3")).halfTerms).toHaveLength(18);
    expect(halfTermName(course("Y7"), 2)).toBe("Spring 1");
    expect(halfTermName(course("GF"), 7)).toBe("Year 11 Autumn 2");
    expect(halfTermName(course("GF"), 11, true)).toBe("Year 11 Sum 2");
  });

  it("round-trips a scheme through its link and the router", () => {
    const scheme = sample();
    expect(parseScheme(query(scheme))).toEqual(scheme);
    expect(parseRoute(formatRoute({ page: "scheme", scheme }))).toEqual({ page: "scheme", scheme });
    expect(formatScheme(scheme)).toContain("h1=GF-A4.a,GF-A4.b,GF-N1");
    expect(parseRoute("#/scheme")).toEqual({ page: "scheme", scheme: undefined });
  });

  it("drops anything invalid from a link", () => {
    expect(parseScheme("course=NOPE&h1=GF-N1")).toBeUndefined();
    const scheme = parseScheme(
      "course=Y7&weeks=99,x,3&h1=NOPE,Y7-ALG-01,Y7-ALG-01&h2=Y7-ALG-01&h7=Y7-ALG-02",
    );
    expect(scheme?.title).toBe("Year 7 scheme of work");
    expect(scheme?.halfTerms.map((h) => h.weeks)).toEqual([7, 7, 3, 6, 6, 7]);
    expect(scheme?.halfTerms[0]?.items).toEqual(["Y7-ALG-01"]);
    expect(scheme?.halfTerms.flatMap((h) => h.items)).toEqual(["Y7-ALG-01"]);
  });

  it("round-trips a scheme through its file and rejects other files", () => {
    const scheme = sample();
    const text = schemeFile(scheme);
    const file = JSON.parse(text);
    expect(file.format).toBe("mathsplanner-scheme");
    expect(file.halfTerms).toHaveLength(12);
    expect(file.halfTerms[0]).toMatchObject({ name: "Year 10 Autumn 1", weeks: 8 });
    expect(file.halfTerms[0].wording[0]).toBe("Collect like terms");
    expect(readSchemeFile(text)).toEqual(scheme);
    expect(() => readSchemeFile("not json")).toThrow(/not JSON/);
    expect(() => readSchemeFile('{"halfTerms": []}')).toThrow(/not a MathsPlanner scheme/);
    expect(() =>
      readSchemeFile('{"format": "mathsplanner-scheme", "course": "Y99", "halfTerms": []}'),
    ).toThrow(/Y99/);
    expect(fileName(scheme)).toBe("gcse-algebra.json");
  });
});

describe("editing a scheme", () => {
  it("moves an item within and between half-terms, and removes it", () => {
    const scheme = sample();
    expect(placeItem(scheme, "GF-N1", 0, 0).halfTerms[0]?.items).toEqual([
      "GF-N1",
      "GF-A4.a",
      "GF-A4.b",
    ]);
    expect(placeItem(scheme, "GF-A4.a", 0, 2).halfTerms[0]?.items).toEqual([
      "GF-A4.b",
      "GF-A4.a",
      "GF-N1",
    ]);
    const moved = placeItem(scheme, "GF-A4.a", 3, 0);
    expect(moved.halfTerms[0]?.items).toEqual(["GF-A4.b", "GF-N1"]);
    expect(moved.halfTerms[3]?.items).toEqual(["GF-A4.a", "GF-A4.c"]);
    expect(removeItem(scheme, "GF-A4.c").halfTerms[3]?.items).toEqual([]);
    expect(placeItem(scheme, "GF-A5", 1).halfTerms[1]?.items).toEqual(["GF-A5"]);
  });

  it("collects earlier half-terms for retrieval and the year so far for tests", () => {
    const scheme = sample();
    expect(earlierItems(scheme, 3)).toEqual(["GF-A4.a", "GF-A4.b", "GF-N1"]);
    expect(yearSoFar(scheme, 3)).toEqual(["GF-A4.a", "GF-A4.b", "GF-N1", "GF-A4.c"]);
    expect(yearSoFar(scheme, 6)).toEqual([]);
  });
});

describe("prerequisites", () => {
  it("marks each need as earlier, later, missing or from an earlier year", () => {
    const scheme = placeItem(sample(), "GF-A4.d", 0, 0);
    const places = placesOf(scheme);
    const status = (id: string) =>
      Object.fromEntries(needsOf(scheme, places, id).map((n) => [n.id, n.status]));
    expect(status("GF-A4.b")).toEqual({ "GF-A4.a": "earlier" });
    expect(status("GF-A4.d")).toEqual({ "GF-A4.c": "later" });
    const a = status("GF-A4.a");
    for (const [id, s] of Object.entries(a))
      expect(s, id).toBe(id.startsWith("GF-") ? "missing" : "prior");
    expect(Object.values(a)).toContain("prior");
    expect(warningsPerTerm(scheme)[0]).toBeGreaterThanOrEqual(1);
  });

  it("counts a statement as taught by its steps, and its steps by it", () => {
    const steps = (stepsOf.get("GF-A4") ?? []).map((s) => s.id);
    let scheme = emptyScheme(course("GF"));
    steps.forEach((id, i) => (scheme = placeItem(scheme, id, i < 3 ? 0 : 1)));
    expect(placesOf(scheme).get("GF-A4")).toEqual({ term: 1, index: steps.length - 4 });
    const whole = placeItem(emptyScheme(course("GF")), "GF-A4", 2);
    expect(placesOf(whole).get("GF-A4.c")).toEqual({ term: 2, index: 0 });
  });
});

describe("drafts", () => {
  it("places every statement in a course once, split into steps, before its prerequisites' dependants", () => {
    for (const c of COURSES) {
      const scheme = draftScheme(c);
      const items = scheme.halfTerms.flatMap((h) => h.items);
      expect(new Set(items).size, c.id).toBe(items.length);
      const expected = coursePool(c).flatMap((s) => {
        const steps = stepsOf.get(s.id) ?? [];
        return steps.length ? steps.map((x) => x.id) : [s.id];
      });
      expect([...items].sort(), c.id).toEqual([...expected].sort());
      for (const id of items) expect(generatorFor(id), id).toBeDefined();
      // Within a course, nothing is taught before a prerequisite from the same year or course,
      // except where the curriculum's recommended years put a need in a later year.
      const places = placesOf(scheme);
      const later = items.filter((id) =>
        needsOf(scheme, places, id).some((n) => n.status === "later" || n.status === "missing"),
      );
      if (c.years.length === 1 || c.id === "GF" || c.id === "GH" || c.id === "CM")
        expect(later, c.id).toEqual([]);
    }
  });

  it("puts KS3 statements in their own year and spreads a GCSE over both", () => {
    const ks3 = draftScheme(course("KS3"));
    expect(
      ks3.halfTerms
        .slice(0, 6)
        .flatMap((h) => h.items)
        .every((id) => id.startsWith("Y7-")),
    ).toBe(true);
    expect(
      ks3.halfTerms
        .slice(12)
        .flatMap((h) => h.items)
        .every((id) => id.startsWith("Y9-")),
    ).toBe(true);
    const gcse = draftScheme(course("GH"));
    for (const h of gcse.halfTerms) expect(h.items.length).toBeGreaterThan(0);
  });

  it("makes a link a browser can open", () => {
    // Long links are fine in browsers up to tens of thousands of characters.
    for (const c of COURSES) expect(formatScheme(draftScheme(c)).length, c.id).toBeLessThan(16_000);
  });
});

describe("half-term homework and tests", () => {
  const spec: SessionSpec = {
    statements: ["GF-A4.a", "GF-A4.b"],
    depths: [1, 2, 3, 4],
    numbers: "standard",
    count: 10,
    seed: 5,
    feedback: "each",
    title: "Autumn 1 homework",
    review: { statements: ["Y9-ALG-01", "GF-N1"], count: 3 },
  };

  it("round-trips homework with retrieval questions, and a set paper", () => {
    expect(parseRoute(formatRoute({ page: "session", spec }))).toEqual({ page: "session", spec });
    const test: SessionSpec = {
      ...spec,
      depths: [2, 3, 4],
      feedback: "end",
      title: "Autumn 1 test",
      paper: { kind: "set", start: 2, end: 4, marks: 12 },
    };
    delete test.review;
    expect(parseRoute(formatRoute({ page: "session", spec: test }))).toEqual({
      page: "session",
      spec: test,
    });
    expect(
      parseRoute(
        formatRoute({
          page: "worksheet",
          spec: test,
          sheet: { title: "", answers: true, solutions: true, reducedInk: false },
        }),
      ),
    ).toMatchObject({
      sheet: { title: "Autumn 1 test" },
    });
  });

  it("takes the retrieval share from the earlier statements", () => {
    const items = sessionItems(spec);
    expect(items).toHaveLength(10);
    const review = items.filter((i) => !i.statementId.startsWith("GF-A4"));
    expect(review).toHaveLength(3);
    expect(items.map((i) => i.depth)).toEqual([...items.map((i) => i.depth)].sort());
    expect(sessionItems(spec)).toEqual(items);
  });

  it("ramps a set paper over a half-term's statements and their steps", () => {
    const items = sessionItems({
      ...spec,
      statements: ["GF-A4"],
      count: 8,
      depths: [1, 2, 3, 4],
      paper: { kind: "set", start: 1, end: 4, marks: 0 },
    });
    expect(items).toHaveLength(8);
    expect(items[0]?.depth).toBe(1);
    expect(items.some((i) => i.statementId.startsWith("GF-A4."))).toBe(true);
  });
});
