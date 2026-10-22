/**
 * @statement AL-P5.5b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P5.5b: Use sec²θ = 1 + tan²θ and cosec²θ = 1 + cot²θ
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, toLatex, type QuestionDraft } from "@mathsplanner/core";

const TRIPLES = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
] as const;

interface Params {
  t: number;
  swap: boolean;
  claimTrue: boolean;
}

export default defineGenerator<Params>({
  id: "AL-P5.5b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.TRIG.IDENTITY"],

  params(rng) {
    return { t: rng.int(0, TRIPLES.length - 1), swap: rng.bool(), claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const [x, y, h] = TRIPLES[p.t] ?? (TRIPLES[0] as (typeof TRIPLES)[number]);
    const [o, a] = p.swap ? [y, x] : [x, y];
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "Given that ",
            A.math(`\\tan\\theta = ${toLatex(frac(o, a))}`),
            " and θ is acute, find the exact value of ",
            A.math("\\sec\\theta"),
            ".",
          ],
          answer: A.exact(frac(h, a)),
          wrong: [
            {
              code: "GEO.TRIG.IDENTITY",
              value: A.exact(frac(a + o, a)),
              feedback: "sec²θ = 1 + tan²θ: square tan θ before adding 1, then square root.",
            },
          ],
          solution: [
            {
              say: "",
              math: `\\sec^2\\theta = 1 + ${toLatex(frac(o * o, a * a))} = ${toLatex(frac(h * h, a * a))} \\Rightarrow \\sec\\theta = ${toLatex(frac(h, a))}`,
            },
          ],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            { question: ["Simplify ", A.math("\\frac{\\sec^2 x - 1}{\\tan x}"), "."] },
            {
              question: [
                "Write ",
                A.math("\\frac{\\sec^2 x - 1}{\\tan x}"),
                " as a single trigonometric function.",
              ],
            },
          ],
          // Brackets: the marker strips spaces, and "\tanx" would not parse.
          answer: A.exact("\\tan(x)"),
          wrong: [
            {
              code: "GEO.TRIG.IDENTITY",
              value: A.exact("\\frac{1}{\\tan(x)}"),
              feedback: "sec²x − 1 = tan²x, and tan²x ÷ tan x = tan x.",
            },
          ],
          solution: [
            {
              say: "",
              math: `\\frac{\\sec^2 x - 1}{\\tan x} = \\frac{\\tan^2 x}{\\tan x} = \\tan x`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: p.claimTrue
            ? [
                "Lou says ",
                A.math("\\operatorname{cosec}^2 x - \\cot^2 x = 1"),
                " for every x where both are defined.",
              ]
            : ["Lou says ", A.math("1 + \\tan^2 x = \\operatorname{cosec}^2 x"), "."],
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: "True. Divide sin²x + cos²x = 1 by sin²x: 1 + cot²x = cosec²x.",
                  correct: true,
                },
                { text: "False. It equals −1.", code: "GEO.TRIG.IDENTITY" },
                { text: "False. Only sin and cos have identities." },
              ]
            : [
                {
                  text: "False. 1 + tan²x = sec²x (divide sin²x + cos²x = 1 by cos²x). It is 1 + cot²x = cosec²x.",
                  correct: true,
                },
                { text: "True. tan goes with cosec.", code: "GEO.TRIG.IDENTITY" },
                { text: "True. Divide by sin²x.", code: "GEO.TRIG.IDENTITY" },
              ],
          solution: [
            {
              say: "Divide sin²x + cos²x = 1 by cos²x for the sec identity, or by sin²x for the cosec identity.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    const [x, y, h] = TRIPLES[p.t] ?? (TRIPLES[0] as (typeof TRIPLES)[number]);
    const a = p.swap ? x : y;
    const ans = question.parts[0]?.answer;
    if (question.key.depth === 1) return ans?.type === "exact" && ans.value === toLatex(frac(h, a));
    return true;
  },
});
