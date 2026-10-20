import type { Question } from "@mathsplanner/core";
import { describe, expect, it } from "vitest";
import { renderQuestion } from "./render.ts";
import { renderWorksheet, worksheetSubtitle } from "./worksheet.ts";

const key = {
  statementId: "Y5-GEO-04",
  depth: 1 as const,
  numbers: "standard" as const,
  seed: 1,
  version: "1.0.0",
};
const meta = { calculator: false, marks: 1, minutes: 1, tags: [] };

const numberQuestion: Question = {
  key,
  archetype: "standard",
  stem: [{ t: "text", v: "Find x." }],
  diagrams: [],
  parts: [
    {
      prompt: [],
      answer: { type: "number", value: 40, accuracy: { exact: true }, units: "°" },
      marks: 1,
      misconceptions: [],
    },
  ],
  solution: [{ say: [{ t: "text", v: "Subtract from 180°." }] }],
  meta,
};

const plotQuestion: Question = {
  key: { ...key, statementId: "Y6-GEO-01", depth: 3 },
  archetype: "draw-or-plot",
  stem: [
    { t: "text", v: "Draw triangle ABC." },
    { t: "diagram", i: 0 },
  ],
  diagrams: [
    { type: "geometry", points: { A: [0, 0], B: [5, 0] }, segments: [{ from: "A", to: "B" }] },
  ],
  parts: [
    {
      prompt: [],
      answer: {
        type: "plot",
        target: { type: "geometry", points: { A: [0, 0], B: [5, 0], C: [2, 3] } },
        tolerance: 0.2,
        place: ["C"],
      },
      marks: 1,
      misconceptions: [],
    },
  ],
  solution: [],
  meta,
};

describe("print mode", () => {
  it("adds working space and an answer line with units for typed answers", () => {
    const html = renderQuestion(numberQuestion, { print: true });
    expect(html).toContain('class="mp-working"');
    expect(html).toMatch(/Answer: <span class="mp-blank"><\/span>°/);
    expect(renderQuestion(numberQuestion)).not.toContain("mp-blank");
  });

  it("draws a plot's canvas at true size, one unit to a centimetre", () => {
    const html = renderQuestion(plotQuestion, { print: true });
    expect(html).toContain("mp-true-size");
    const width = Number(/style="width: ([\d.]+)cm/.exec(html)?.[1]);
    // The 5-unit side plus room for the point labels either side.
    expect(width).toBeGreaterThan(5);
    expect(width).toBeLessThan(7);
  });
});

describe("worksheets", () => {
  it("number questions, total the marks and put answers on their own pages", () => {
    const html = renderWorksheet([numberQuestion, plotQuestion], {
      title: "Angles",
      subtitle: worksheetSubtitle(["Y5-GEO-04", "Y6-GEO-01"], "standard", 2),
      answers: true,
      solutions: true,
      footer: "seed 1",
    });
    expect(html).toContain('<span class="ws-number">2</span>');
    expect(html).toContain("/ 2 marks");
    expect(html).toContain('class="ws-page ws-answers"');
    expect(html).toContain("Subtract from 180°.");
    expect(html).toContain("Y5-GEO-04, Y6-GEO-01 · standard numbers · 2 questions");
    expect(worksheetSubtitle(["Y1-GEO-01"], "friendly", 1)).toMatch(/1 question$/);
  });

  it("can leave out the questions or the solutions", () => {
    const answersOnly = renderWorksheet([numberQuestion], {
      title: "A",
      questions: false,
      answers: true,
    });
    expect(answersOnly).not.toContain("Name ");
    expect(answersOnly).not.toContain("Worked solution");
  });
});
