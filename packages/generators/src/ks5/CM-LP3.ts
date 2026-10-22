/**
 * @statement CM-LP3
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// CM-LP3: Recognise, sketch and interpret linear function graphs
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  c: number;
  d: number;
}

export default defineGenerator<Params>({
  id: "CM-LP3",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.LINE.M-C", "ALG.SIMULTANEOUS.SIGN"],

  params(rng) {
    const p = {
      a: 5 * rng.int(2, 8),
      b: rng.pick([0.2, 0.25, 0.3, 0.4, 0.5]),
      c: 5 * rng.int(0, 4),
      d: rng.pick([0.4, 0.5, 0.6, 0.75, 0.8]),
    };
    const x = (p.a - p.c) / (p.d - p.b);
    if (p.d <= p.b || p.a <= p.c || !Number.isInteger(x) || x > 400)
      reject("a whole-number crossing point");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = "The fixed charge, paid even for 0 miles";
        return A.choice({
          rng,
          question: [
            "The cost, £C, of hiring a van for x miles is ",
            A.math(`C = ${p.a} + ${p.b}x`),
            ".",
          ],
          ask: `What does the ${p.a} represent?`,
          correct: right,
          distractors: [
            {
              content: "The cost per mile",
              code: "ALG.LINE.M-C",
              feedback: `The cost per mile is the gradient, ${p.b}.`,
            },
            {
              content: `The number of miles that costs £${p.a}`,
              code: "ALG.LINE.M-C",
              feedback: `When x = 0, C = ${p.a}: it is the intercept.`,
            },
          ],
          solution: [{ say: `When x = 0, C = ${p.a}: the fixed charge.` }],
        });
      }
      case 2: {
        const x = (p.a - p.c) / (p.d - p.b);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Van hire company A charges ",
                A.math(`C = ${p.a} + ${p.b}x`),
                " and company B charges ",
                A.math(`C = ${p.c === 0 ? "" : `${p.c} + `}${p.d}x`),
                " pounds for x miles.",
              ],
              ask: "For how many miles do the two companies charge the same?",
            },
          ],
          answer: A.number(x, { units: "miles" }),
          wrong: wrongs(x, [
            {
              code: "ALG.SIMULTANEOUS.SIGN",
              value: A.number(Math.round(((p.a + p.c) / (p.d + p.b)) * 100) / 100, {
                units: "miles",
              }),
              feedback: `Set them equal: ${p.a} + ${p.b}x = ${p.c} + ${p.d}x, then collect like terms with care.`,
            },
            {
              code: "ALG.SIMULTANEOUS.SIGN",
              value: A.number(Math.round(((p.a - p.c) / (p.d + p.b)) * 100) / 100, {
                units: "miles",
              }),
              feedback: `Subtract ${p.b}x from both sides: the x terms give (${p.d} − ${p.b})x.`,
            },
          ]),
          solution: [
            { say: "", math: `${p.a} - ${p.c} = (${p.d} - ${p.b})x \\Rightarrow x = ${x}` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Vik says company B is always dearer, because its line on the graph is steeper.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. B's line is steeper, so it rises faster, but it starts lower (£${p.c} against £${p.a}). B is cheaper for short journeys.`,
              correct: true,
            },
            { text: "True. A steeper line is higher everywhere.", code: "ALG.LINE.M-C" },
            { text: "True. The gradient is the total cost.", code: "ALG.LINE.M-C" },
          ],
          solution: [
            {
              say: "The lines cross where the costs are equal; compare on each side of that point.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question).startsWith("The fixed charge");
    if (question.key.depth === 2) return numberAnswer(question) === (p.a - p.c) / (p.d - p.b);
    return true;
  },
});
