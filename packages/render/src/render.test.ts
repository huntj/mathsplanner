import type { AnswerSpec, Question } from "@mathsplanner/core";
import { describe, expect, it } from "vitest";
import {
  escapeHtml,
  renderAnswer,
  renderMath,
  renderQuestion,
  renderRich,
  RenderError,
} from "./render.ts";

const question: Question = {
  key: { statementId: "Y6-FR-03", depth: 4, numbers: "standard", seed: 7, version: "1.0.0" },
  archetype: "explain-the-error",
  stem: [
    { t: "text", v: "Sam says " },
    { t: "math", v: "\\frac{1}{3} + \\frac{1}{4} = \\frac{2}{7}" },
    { t: "text", v: ". Is he right? <check>" },
    { t: "diagram", i: 0 },
  ],
  diagrams: [{ type: "bar-model", bars: [{ parts: [{ size: 1 }, { size: 3 }] }] }],
  parts: [
    {
      label: "(a)",
      prompt: [{ t: "text", v: "Which explanation is correct?" }],
      answer: {
        type: "choice",
        options: [
          { id: "a", content: [{ t: "text", v: "He added the tops and the bottoms." }] },
          { id: "b", content: [{ t: "text", v: "He is right." }] },
        ],
        correct: "a",
      },
      marks: 1,
      misconceptions: [
        {
          code: "FR.ADD.TOPS-AND-BOTTOMS",
          answer: { type: "choice", id: "b" },
          feedback: [{ t: "text", v: "Check with a bar model." }],
          remediate: "Y5-FR-04",
        },
      ],
    },
    {
      label: "(b)",
      prompt: [{ t: "text", v: "Work out the correct answer." }],
      answer: { type: "exact", value: "\\frac{7}{12}", form: "simplest" },
      marks: 2,
      misconceptions: [],
    },
  ],
  solution: [
    {
      say: [{ t: "text", v: "Use twelfths." }],
      math: "\\frac{4}{12} + \\frac{3}{12} = \\frac{7}{12}",
    },
  ],
  meta: { calculator: false, marks: 3, minutes: 3, tags: [] },
};

describe("renderMath", () => {
  it("renders HTML and MathML for screen readers", () => {
    const html = renderMath("\\frac{1}{2}");
    expect(html).toContain('class="katex"');
    expect(html).toContain("<math");
    expect(renderMath("x", true)).toContain("katex-display");
  });

  it("throws on bad LaTeX instead of showing it to students", () => {
    expect(() => renderMath("\\frac{1}{")).toThrow(RenderError);
    expect(() => renderMath("\\notacommand")).toThrow(RenderError);
  });
});

describe("renderRich", () => {
  it("escapes text", () => {
    expect(renderRich([{ t: "text", v: 'a < b & "c"' }])).toBe("a &lt; b &amp; &quot;c&quot;");
    expect(escapeHtml("'")).toBe("&#39;");
  });

  it("draws supported diagrams as SVG with a description", () => {
    const html = renderRich(
      [{ t: "diagram", i: 0 }],
      [{ type: "number-line", min: 0, max: 10, step: 1 }],
    );
    expect(html).toContain('<figure class="mp-diagram"><svg');
    expect(html).toContain('aria-label="Number line from 0 to 10, marked every 1."');
  });

  it("shows types the engine does not draw yet as labelled placeholders", () => {
    const html = renderRich([{ t: "diagram", i: 0 }], [{ type: "probability" }]);
    expect(html).toContain('role="img"');
    expect(html).toContain("probability diagram");
    expect(() => renderRich([{ t: "diagram", i: 1 }], [])).toThrow("diagram 1 does not exist");
  });

  it("refuses diagrams that contradict their numbers or are malformed", () => {
    const lying = {
      type: "geometry" as const,
      points: { A: [0, 0], B: [1, 0], C: [0, 1] },
      angles: [{ vertex: "A", from: "B", to: "C", value: 60 }],
    };
    expect(() => renderRich([{ t: "diagram", i: 0 }], [lying])).toThrow(
      "stated as 60° but drawn as 90.0°",
    );
    expect(() => renderRich([{ t: "diagram", i: 0 }], [{ type: "cartesian" }])).toThrow(
      "x and y need numeric min and max",
    );
  });
});

describe("renderQuestion", () => {
  it("renders the stem, parts, options and marks", () => {
    const html = renderQuestion(question);
    expect(html).toContain('data-key="Y6-FR-03 depth 4 standard seed 7 v1.0.0"');
    expect(html).toContain("&lt;check&gt;");
    expect(html).toContain('<span class="mp-label">(a)</span>');
    expect(html).toContain("He added the tops and the bottoms.");
    expect(html).toContain("[1 mark]");
    expect(html).toContain("[2 marks]");
    expect(html).not.toContain("mp-answer");
    expect(html).not.toContain("mp-correct");
    expect(html).not.toContain("Worked solution");
  });

  it("adds answers, misconceptions and the solution when asked", () => {
    const html = renderQuestion(question, { showAnswers: true, showSolution: true });
    expect(html).toContain('<li class="mp-correct" data-option="a">');
    expect(html).toContain("FR.ADD.TOPS-AND-BOTTOMS");
    expect(html).toContain("Step back to Y5-FR-04.");
    expect(html).toContain("(in its simplest form)");
    expect(html).toContain("Worked solution");
  });

  it("gives the same HTML for the same question", () => {
    const copy = JSON.parse(JSON.stringify(question)) as Question;
    expect(renderQuestion(copy, { showAnswers: true })).toBe(
      renderQuestion(question, { showAnswers: true }),
    );
  });
});

describe("renderAnswer", () => {
  const option = (id: string) => ({ id, content: [{ t: "text" as const, v: `option ${id}` }] });
  const cases: [AnswerSpec, string][] = [
    [
      { type: "number", value: 3.5, accuracy: { dp: 1 }, units: "cm" },
      "3.5 cm (to 1 decimal place)",
    ],
    [{ type: "number", value: 120, accuracy: { sf: 2 } }, "120 (to 2 significant figures)"],
    [{ type: "number", value: 63, accuracy: { exact: true }, units: "°" }, "63°"],
    [{ type: "number", value: 7, accuracy: { tolerance: 0.5 } }, "7 (±0.5)"],
    [{ type: "coordinate", x: "2", y: "-3" }, "<math"],
    [{ type: "multi-select", options: [option("p"), option("q")], correct: ["q"] }, "option q"],
    [
      {
        type: "choice-with-reason",
        options: [option("t"), option("f")],
        correct: "f",
        reasons: [option("r1"), option("r2")],
        correctReason: "r2",
      },
      "option f, because",
    ],
    [{ type: "order", options: [option("1"), option("2")], correct: ["2", "1"] }, "option 2, "],
    [{ type: "match", left: [option("l")], right: [option("r")], correct: [["l", "r"]] }, "1 ↔ A"],
    [
      { type: "condition", inputs: ["exact"], describe: [{ t: "text", v: "two unit fractions" }] },
      "two unit fractions",
    ],
    [
      { type: "free-text", markScheme: [{ t: "text", v: "mentions 180" }] },
      "Mark scheme: mentions 180",
    ],
    [
      {
        type: "plot",
        target: { type: "cartesian", x: { min: 0, max: 5 }, y: { min: 0, max: 5 } },
        tolerance: 0.2,
        place: ["P"],
      },
      "Coordinate grid",
    ],
  ];

  it.each(cases)("renders %j", (answer, expected) => {
    expect(renderAnswer(answer)).toContain(expected);
  });

  it("refuses unknown option IDs", () => {
    expect(() => renderAnswer({ type: "choice", options: [option("a")], correct: "z" })).toThrow(
      'option "z" does not exist',
    );
  });
});
