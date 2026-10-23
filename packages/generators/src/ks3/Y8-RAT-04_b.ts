/**
 * @statement Y8-RAT-04.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y8-RAT-04.b: Represent direct proportion with graphs and equations
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { tableLatex } from "../shared/sta.ts";

interface Params {
  k: number;
  xs: number[];
  c: number;
}

export default defineGenerator<Params>({
  id: "Y8-RAT-04.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.PROPORTION.LINEAR-INTERCEPT", "RAT.INVERSE.AS-DIRECT", "RAT.ADDITIVE"],

  params(rng) {
    const p = {
      k: rng.int(2, 9),
      xs: [rng.int(1, 3), rng.int(4, 6), rng.int(7, 10)],
      c: rng.int(2, 6),
    };
    if ((p.xs[1] ?? 0) * p.k - (p.xs[1] ?? 0) === p.k) reject("an additive rule that differs");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: ["Which graph shows that y is directly proportional to x?"],
          correct: "A straight line through the origin",
          distractors: [
            {
              content: `A straight line that crosses the y-axis at ${p.c}`,
              code: "RAT.PROPORTION.LINEAR-INTERCEPT",
              feedback:
                "If y is proportional to x, then y = 0 when x = 0, so the line must pass through the origin.",
            },
            {
              content: "A curve that goes down as x gets bigger",
              code: "RAT.INVERSE.AS-DIRECT",
              feedback: "That is inverse proportion.",
            },
          ],
          solution: [{ say: "y = kx is a straight line through (0, 0)." }],
        });
      case 2: {
        const x1 = p.xs[0] ?? 1;
        const right = `y = ${p.k}x`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "y is directly proportional to x.",
            A.math(tableLatex(["x", ...p.xs.map(String)], [["y", ...p.xs.map((x) => p.k * x)]])),
          ],
          ask: "Which equation fits the table?",
          correct: A.math(right),
          distractors: [
            {
              content: A.math(`y = x + ${p.k * x1 - x1}`),
              code: "RAT.ADDITIVE",
              feedback: "That only works for the first column. Check y ÷ x for every column.",
            },
            {
              content: A.math(`y = \\frac{${p.k}}{x}`),
              code: "RAT.INVERSE.AS-DIRECT",
              feedback: "As x gets bigger, y gets bigger, so it is not inverse proportion.",
            },
          ],
          solution: [{ say: `y ÷ x = ${p.k} every time: `, math: right }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "A plumber charges ",
            A.math(`C = ${p.k * 10}n + ${p.c * 10}`),
            " pounds for n hours. Jo says C is directly proportional to n.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. There is a fixed charge of £${p.c * 10}, so C is not 0 when n = 0, and doubling n does not double C.`,
              correct: true,
            },
            {
              text: "True. It is a straight-line formula.",
              code: "RAT.PROPORTION.LINEAR-INTERCEPT",
            },
            {
              text: "True. C goes up by the same amount each hour.",
              code: "RAT.PROPORTION.LINEAR-INTERCEPT",
            },
          ],
          solution: [{ say: "Direct proportion has the form C = kn, with nothing added." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return chosenText(question) === "A straight line through the origin";
    if (question.key.depth === 2) return chosenText(question) === `y = ${p.k}x`;
    return true;
  },
});
