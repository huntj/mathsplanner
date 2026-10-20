import { markQuestion } from "@mathsplanner/marking";
import { describe, expect, it } from "vitest";
import { emptyDraft, isComplete, toResponse } from "./answers.ts";
import { answerText, csvField, resultsCsv } from "./results.ts";
import {
  formatRoute,
  generatorFor,
  parseRoute,
  practisable,
  sessionItems,
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
    expect(parseRoute("#/")).toEqual({ page: "setup" });
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

  it("only offers statements that have a generator", () => {
    expect(practisable.length).toBeGreaterThan(0);
    for (const s of practisable) expect(generatorFor(s.id)).toBeDefined();
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
