/**
 * @statement GF-A10
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-A10: Identify and interpret gradients and intercepts of linear functions graphically and
// algebraically
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { clearOfOrigin, grid, poly, signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  m: number;
  c: number;
  k: number;
  fixed: number;
  rate: number;
}

export default defineGenerator<Params>({
  id: "GF-A10",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.GRADIENT.RUN-RISE", "ALG.LINE.M-C", "ALG.SOLVE.WRONG-INVERSE"],

  params(rng) {
    const m = rng.pick([2, 3, -2, -3, 4, -1]);
    const c = rng.int(-4, 4);
    if (c === 0 || Math.abs(m) === Math.abs(c) || !clearOfOrigin(m, c))
      reject("a line clear of the origin label");
    if ([-6, 6].some((x) => Math.abs(m * x + c) > 8) && Math.abs(m) > 2) {
      // Steep lines leave the grid quickly; that is fine as long as two lattice points show.
    }
    return { m, c, k: rng.int(2, 5), fixed: rng.int(2, 6) * 5, rate: rng.int(2, 9) * 5 };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "The graph shows a straight line.",
            A.figure(grid(8, [poly([p.m, p.c])], [], "A straight line on a coordinate grid.")),
          ],
          ask: "What is the gradient of the line?",
          answer: A.number(p.m),
          wrong: signedWrongs(p.m, [
            {
              code: "ALG.GRADIENT.RUN-RISE",
              value: A.number(Math.round((1 / p.m) * 1000) / 1000),
              feedback: "Gradient = up ÷ across.",
            },
            {
              code: "ALG.LINE.M-C",
              value: A.number(p.c),
              feedback: "That is where it crosses the y-axis, the intercept.",
            },
            {
              code: "ALG.GRADIENT.RUN-RISE",
              value: A.number(-p.m),
              feedback: `The line goes ${p.m > 0 ? "up" : "down"} from left to right, so the gradient is ${p.m > 0 ? "positive" : "negative"}.`,
            },
          ]),
          solution: [
            {
              say: `For every 1 across, the line goes ${p.m > 0 ? "up" : "down"} ${Math.abs(p.m)}: gradient ${p.m}.`,
            },
          ],
        });
      case 2:
        return A.standard({
          question: [
            "A line has equation ",
            A.math(`${p.k}y = ${poly([p.k * p.m, p.k * p.c])}`),
            ".",
          ],
          ask: "Write down the y-intercept of the line.",
          answer: A.number(p.c),
          wrong: signedWrongs(p.c, [
            {
              code: "ALG.SOLVE.WRONG-INVERSE",
              value: A.number(p.k * p.c),
              feedback: `Divide every term by ${p.k} first to get y = mx + c.`,
            },
            { code: "ALG.LINE.M-C", value: A.number(p.m), feedback: "That is the gradient." },
          ]),
          solution: [
            {
              say: "Divide by " + p.k + ": ",
              math: `y = ${poly([p.m, p.c])}\\text{, so the intercept is } ${p.c}`,
            },
          ],
        });
      default: {
        const truth = rng.bool();
        const meaning = truth
          ? `£${p.rate / 100 < 1 ? `${p.rate}p` : p.rate} for each mile`
          : `a fixed charge of £${p.rate}`;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "A taxi fare is ",
            A.math(`C = ${p.rate}m + ${p.fixed}`),
            ` pence, where m is the number of miles. Ali says the ${p.rate} means ${meaning}.`,
          ],
          truth,
          reasons: truth
            ? [
                {
                  text: `True. ${p.rate} is the gradient: the cost goes up ${p.rate}p for each extra mile.`,
                  correct: true,
                },
                { text: `False. ${p.rate} is the fixed charge.`, code: "ALG.LINE.M-C" },
                { text: "False. The numbers in a formula have no meaning." },
              ]
            : [
                {
                  text: `False. ${p.rate} is the gradient, the cost per mile; the fixed charge is the intercept, ${p.fixed}p.`,
                  correct: true,
                },
                {
                  text: `True. The first number is always the starting value.`,
                  code: "ALG.LINE.M-C",
                },
                { text: "True. Both numbers are fixed charges.", code: "ALG.LINE.M-C" },
              ],
          solution: [
            { say: `Gradient ${p.rate}p per mile; intercept ${p.fixed}p, the cost before moving.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") {
      const n = numberAnswer(question);
      return question.key.depth === 1 ? n === p.m : n === p.c;
    }
    return true;
  },
});
