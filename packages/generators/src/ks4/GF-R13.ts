/**
 * @statement GF-R13
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-R13: Understand that X is inversely proportional to Y is equivalent to X is proportional to 1/Y;
// interpret equations that describe direct and inverse proportion
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  k: number;
  x1: number;
  x2: number;
}

export default defineGenerator<Params>({
  id: "GF-R13",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.INVERSE.AS-DIRECT"],

  params(rng) {
    const x1 = rng.int(2, 6);
    const x2 = rng.int(2, 12);
    const k = x1 * x2 * rng.int(1, 4);
    if (x1 === x2) reject("two different values of x");
    return { k, x1, x2 };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const y1 = p.k / p.x1;
        const y2 = p.k / p.x2;
        return A.standard({
          question: `y is inversely proportional to x. When x = ${p.x1}, y = ${y1}.`,
          ask: `Find y when x = ${p.x2}.`,
          answer: A.number(y2),
          wrong: wrongs(y2, [
            {
              code: "RAT.INVERSE.AS-DIRECT",
              value: A.number(Math.round(((y1 * p.x2) / p.x1) * 100) / 100),
              feedback: "In inverse proportion xy is constant: as x increases, y decreases.",
            },
          ]),
          solution: [{ say: `k = xy = ${p.x1} × ${y1} = ${p.k}. y = ${p.k} ÷ ${p.x2} = ${y2}.` }],
        });
      }
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: "P is inversely proportional to V, with constant k.",
          ask: "Which equation shows this?",
          correct: A.math("P = \\frac{k}{V}"),
          distractors: [
            {
              content: A.math("P = kV"),
              code: "RAT.INVERSE.AS-DIRECT",
              feedback: "That is direct proportion.",
            },
            {
              content: A.math("P = k - V"),
              code: "RAT.INVERSE.AS-DIRECT",
              feedback: "Proportion is multiplicative, not a difference.",
            },
            {
              content: A.math("P = \\frac{V}{k}"),
              code: "RAT.INVERSE.AS-DIRECT",
              feedback: "That is still direct proportion: P grows as V grows.",
            },
          ],
          solution: [
            { say: "Inversely proportional means proportional to 1/V: ", math: "P = \\frac{k}{V}" },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Given ",
            A.math(`y = \\frac{${p.k}}{x}`),
            ", Ana says that tripling x makes y three times bigger.",
          ],
          truth: false,
          reasons: [
            { text: "False. y = k/x, so tripling x divides y by 3.", correct: true },
            {
              text: "True. y and x always change by the same factor.",
              code: "RAT.INVERSE.AS-DIRECT",
            },
            { text: "True. The bigger x, the bigger y.", code: "RAT.INVERSE.AS-DIRECT" },
          ],
          solution: [
            {
              say: `x = 1 gives y = ${p.k}; x = 3 gives y = ${Math.round((p.k / 3) * 100) / 100}.`,
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return numberAnswer(question) * p.x2 === p.k;
    if (question.archetype === "varied-form") return chosenText(question) === "P = \\frac{k}{V}";
    return true;
  },
});
