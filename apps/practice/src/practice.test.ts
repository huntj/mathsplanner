import { markQuestion } from "@mathsplanner/marking";
import { describe, expect, it } from "vitest";
import { emptyDraft, isComplete, toResponse } from "./answers.ts";
import { topicOf, unitPool, yearPool } from "./papers.ts";
import { answerText, csvField, resultsCsv } from "./results.ts";
import {
  describeSpec,
  formatRoute,
  generatorFor,
  itemMarks,
  parseRoute,
  practisable,
  sessionItems,
  statements,
  type SessionSpec,
} from "./session.ts";

const spec: SessionSpec = {
  statements: ["Y5-GEO-04", "Y6-GEO-03"],
  depths: [1, 4],
  numbers: "standard",
  count: 7,
  seed: 42,
  feedback: "each",
};

describe("session links", () => {
  it("round-trips a session and drops anything invalid", () => {
    expect(parseRoute(formatRoute({ page: "session", spec }))).toEqual({ page: "session", spec });
    expect(parseRoute("#/")).toEqual({ page: "home" });
    expect(parseRoute("#/practice")).toEqual({ page: "setup" });
    expect(formatRoute({ page: "setup" })).toBe("#/practice");
    expect(parseRoute("#/welcome?step=3")).toEqual({ page: "welcome", step: 3 });
    expect(parseRoute("#/welcome?step=x")).toEqual({ page: "welcome", step: 0 });
    expect(parseRoute(formatRoute({ page: "timetable" }))).toEqual({ page: "timetable" });
    expect(parseRoute("#/nowhere")).toEqual({ page: "home" });
    expect(parseRoute(formatRoute({ page: "class", id: "ab12", guide: 2 }))).toEqual({
      page: "class",
      id: "ab12",
      guide: 2,
    });
    expect(parseRoute("#/class?id=ab12&guide=9")).toEqual({ page: "class", id: "ab12" });
    for (const route of [
      { page: "class", id: "ab12", term: 5 },
      { page: "class", id: "ab12", edit: true },
      { page: "class", id: "ab12" },
    ] as const)
      expect(parseRoute(formatRoute(route))).toEqual(route);
    expect(parseRoute("#/session?statements=NOPE")).toEqual({ page: "setup" });
    const route = parseRoute(
      "#/session?statements=Y5-GEO-04,NOPE&depths=9,2&numbers=huge&count=500&seed=-1&feedback=x",
    );
    expect(route).toEqual({
      page: "session",
      spec: {
        statements: ["Y5-GEO-04"],
        depths: [2],
        numbers: "standard",
        count: 10,
        seed: 0,
        feedback: "each",
      },
    });
  });

  it("round-trips a worksheet link with its print options", () => {
    const sheet = { title: "Angles & turns", answers: true, solutions: false, reducedInk: true };
    expect(parseRoute(formatRoute({ page: "worksheet", spec, sheet }))).toEqual({
      page: "worksheet",
      spec,
      sheet,
    });
    expect(parseRoute("#/worksheet?statements=Y5-GEO-04&title=")).toMatchObject({
      page: "worksheet",
      sheet: { title: "Maths practice", answers: true, solutions: true, reducedInk: false },
    });
  });

  it("gives the same questions for the same link, easiest first", () => {
    const items = sessionItems(spec);
    expect(items).toEqual(sessionItems(spec));
    expect(items).toHaveLength(7);
    expect(items.map((i) => i.depth)).toEqual([...items.map((i) => i.depth)].sort());
    for (const item of items) expect(generatorFor(item.statementId)?.depths).toContain(item.depth);
    expect(sessionItems({ ...spec, seed: 43 })).not.toEqual(items);
  });

  it("brings in a statement's sub-statements with it", () => {
    const items = sessionItems({ ...spec, statements: ["GF-A4"], depths: [1, 2, 4], count: 40 });
    const ids = new Set(items.map((i) => i.statementId));
    expect(ids.has("GF-A4")).toBe(true);
    expect([...ids].some((id) => id.startsWith("GF-A4."))).toBe(true);
  });

  it("only offers statements that have a generator", () => {
    expect(practisable.length).toBeGreaterThan(0);
    for (const s of practisable) expect(generatorFor(s.id)).toBeDefined();
  });
});

describe("year and unit tests", () => {
  const year: SessionSpec = {
    statements: yearPool(statements, "Y5").filter((id) => generatorFor(id)),
    depths: [1, 2, 3, 4],
    numbers: "standard",
    count: 12,
    seed: 7,
    feedback: "end",
    paper: { kind: "year", stage: "Y5", start: 1, end: 4, marks: 0 },
  };
  const unit: SessionSpec = {
    statements: unitPool(statements, "algebra", ["Y7", "Y8"]).filter((id) => generatorFor(id)),
    depths: [2, 4],
    numbers: "standard",
    count: 10,
    seed: 3,
    feedback: "end",
    paper: { kind: "unit", topic: "algebra", stages: ["Y7", "Y8"], marks: 15 },
  };

  it("round-trips paper links, rebuilding the pool from the year or topic", () => {
    expect(parseRoute(formatRoute({ page: "session", spec: year }))).toEqual({
      page: "session",
      spec: year,
    });
    expect(parseRoute(formatRoute({ page: "session", spec: unit }))).toEqual({
      page: "session",
      spec: unit,
    });
    expect(formatRoute({ page: "session", spec: year })).not.toContain("statements=");
    expect(parseRoute("#/worksheet?paper=year&stage=Y5&count=5")).toMatchObject({
      sheet: { title: "Year 5 test" },
    });
    expect(parseRoute("#/session?paper=unit&topic=nope&stages=Y7")).toEqual({ page: "unit" });
  });

  it("ramps the depth from the start to the end of a year test", () => {
    const items = sessionItems(year);
    expect(items).toHaveLength(12);
    expect(items[0]?.depth).toBe(1);
    expect(items.at(-1)?.depth).toBe(4);
    const depths = items.map((i) => i.depth);
    expect(depths).toEqual([...depths].sort());
    for (const item of items) expect(item.statementId.startsWith("Y5-")).toBe(true);
    // Spread over the year: no statement twice while others are unused.
    expect(new Set(items.map((i) => i.statementId)).size).toBeGreaterThanOrEqual(10);
    const down = sessionItems({
      ...year,
      paper: { kind: "year", stage: "Y5", start: 4, end: 1, marks: 0 },
    });
    expect(down[0]?.depth).toBe(4);
    expect(down.at(-1)?.depth).toBe(1);
  });

  it("aims a paper at its mark total, moving depths at most one step", () => {
    const marked = {
      ...year,
      paper: { kind: "year" as const, stage: "Y5", start: 1 as const, end: 4 as const, marks: 18 },
    };
    const items = sessionItems(marked);
    const total = (xs: typeof items) =>
      xs.reduce((sum, item) => sum + itemMarks(item, "standard"), 0);
    expect(items).toHaveLength(12);
    expect(Math.abs(total(items) - 18)).toBeLessThanOrEqual(1);
    expect(total(sessionItems(year))).not.toBe(18);
    const depths = items.map((i) => i.depth);
    expect(depths).toEqual([...depths].sort());
    expect(Math.abs(total(sessionItems(unit)) - 15)).toBeLessThanOrEqual(1);
    for (const item of sessionItems(unit)) expect([2, 4]).toContain(item.depth);
    expect(describeSpec(unit, 10)).toContain("Algebra · Year 7, Year 8");
  });

  it("puts every statement in a topic, and a Higher paper includes Foundation", () => {
    for (const s of statements) expect(topicOf(s), s.id).toBeDefined();
    const higher = yearPool(statements, "GH");
    expect(higher.some((id) => id.startsWith("GF-"))).toBe(true);
    expect(higher.some((id) => id.startsWith("GH-"))).toBe(true);
  });
});

describe("answers", () => {
  const number = { type: "number" as const, value: 40, accuracy: { exact: true as const } };

  it("turns drafts into responses", () => {
    expect(toResponse(number, { type: "text", text: " 40° " })).toEqual({
      type: "number",
      value: 40,
    });
    expect(toResponse(number, { type: "text", text: "forty" })).toEqual({
      type: "text",
      text: "forty",
    });
    expect(toResponse(number, { type: "text", text: "" })).toBeUndefined();
    const condition = {
      type: "condition" as const,
      inputs: ["number", "coordinate"] as ("number" | "coordinate")[],
      describe: [],
    };
    expect(toResponse(condition, { type: "values", texts: ["100", "(3, -2)"] })).toEqual({
      type: "values",
      values: [
        { type: "number", value: 100 },
        { type: "coordinate", x: "3", y: "-2" },
      ],
    });
  });

  it("only lets a part be checked when every input is filled", () => {
    const options = ["A", "B"].map((id) => ({ id, content: [] }));
    const reasoned = {
      type: "choice-with-reason" as const,
      options,
      correct: "A",
      reasons: options,
      correctReason: "B",
    };
    expect(isComplete(reasoned, { type: "reasoned", id: "A" })).toBe(false);
    expect(isComplete(reasoned, { type: "reasoned", id: "A", reason: "B" })).toBe(true);
    const match = {
      type: "match" as const,
      left: options,
      right: options,
      correct: [
        ["A", "B"],
        ["B", "A"],
      ] as [string, string][],
    };
    expect(isComplete(match, { type: "match", pairs: { A: "B" } })).toBe(false);
    expect(isComplete(match, emptyDraft(match))).toBe(false);
  });
});

describe("results", () => {
  it("quotes CSV fields and stops formulas running in spreadsheets", () => {
    expect(csvField("plain")).toBe("plain");
    expect(csvField('say "hi", then')).toBe('"say ""hi"", then"');
    expect(csvField("=SUM(A1)")).toBe("'=SUM(A1)");
    expect(csvField(-3)).toBe("-3");
  });

  it("writes one row per part, with what was answered in the letters shown", () => {
    const generator = generatorFor("Y5-GEO-04");
    if (!generator) throw new Error("no generator");
    const question = generator.generate({ depth: 1, numbers: "standard", seed: 1 });
    const part = question.parts[0];
    if (!part) throw new Error("no part");
    const response = { type: "number" as const, value: 1 };
    const mark = markQuestion(question, [response]);
    const csv = resultsCsv("Sam, Year 5", new Date("2026-10-20T09:00:00Z"), [
      { question, mark, answers: [answerText(part, response)] },
    ]);
    const [header, row] = csv.trim().split("\r\n");
    expect(header).toMatch(/^Name,Date,Question,Statement/);
    expect(row).toMatch(/^"Sam, Year 5",2026-10-20,1,Y5-GEO-04,/);
    expect(row).toMatch(/,0,1,Incorrect,/);
    expect(row?.endsWith(",1")).toBe(true);
  });
});
