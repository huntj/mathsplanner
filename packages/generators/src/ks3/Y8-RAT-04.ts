/**
 * @statement Y8-RAT-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y8-RAT-04: Solve problems involving direct proportion, including graphical and algebraic
// representations
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { slash } from "../shared/fr.ts";

interface Params {
  /** y = (num/den) x; known x = den × m, asked x = den × n. */
  num: number;
  den: number;
  m: number;
  n: number;
}

export default defineGenerator<Params>({
  id: "Y8-RAT-04",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.ADDITIVE", "RAT.INVERSE.AS-DIRECT"],

  params(rng, numbers) {
    const den = rng.int(1, numbers === "friendly" ? 2 : 5);
    const num = rng.int(2, 12);
    const [m, n] = [rng.int(1, 6), rng.int(2, 12)];
    if (m === n || num === den) reject("different values");
    return { num, den, m, n };
  },

  build(p, depth, rng): QuestionDraft {
    const k = frac(p.num, p.den);
    const [x1, y1] = [p.den * p.m, p.num * p.m];
    const [x2, y2] = [p.den * p.n, p.num * p.n];
    const kText = p.den === 1 ? String(p.num) : slash(p.num, p.den);
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "y is directly proportional to x. When ",
            A.math(`x = ${x1}`),
            ", ",
            A.math(`y = ${y1}`),
            ".",
          ],
          ask: ["Find y when ", A.math(`x = ${x2}`), "."],
          answer: A.number(y2),
          wrong: wrongs(y2, [
            {
              code: "RAT.ADDITIVE",
              value: A.number(y1 + (x2 - x1)),
              feedback:
                "In direct proportion y is multiplied by the same number as x, not increased by the same amount.",
            },
            {
              code: "RAT.INVERSE.AS-DIRECT",
              value: A.number((x1 * y1) / x2),
              feedback: "That is inverse proportion. When x gets bigger, y gets bigger too.",
            },
          ]),
          solution: [
            { say: `y = kx with k = ${y1} ÷ ${x1} = ${kText}. So y = ${kText} × ${x2} = ${y2}.` },
          ],
        });
      case 2:
        return A.standard({
          question: [
            "y is directly proportional to x, so ",
            A.math("y = kx"),
            ". When ",
            A.math(`x = ${x1}`),
            ", ",
            A.math(`y = ${y1}`),
            ".",
          ],
          ask: ["Find k."],
          answer: A.exact(k),
          solution: [{ say: `k = y ÷ x = ${y1} ÷ ${x1} = ${kText}.` }],
        });
      default:
        return A.alwaysSometimesNever({
          rng,
          claim:
            "If y is directly proportional to x, the graph of y against x is a straight line through the origin.",
          truth: "always",
          reasons: [
            {
              text: "Always. y = kx is a straight line with gradient k, and when x = 0, y = 0.",
              correct: true,
            },
            { text: "Sometimes. Only when k is a whole number." },
            { text: "Never. Proportion graphs are curves.", code: "RAT.INVERSE.AS-DIRECT" },
          ],
          solution: [
            { say: `For example, y = ${kText}x: doubling x doubles y, and x = 0 gives y = 0.` },
          ],
        });
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (a?.type === "exact") return String(a.value) === toLatex(frac(p.num, p.den));
    if (question.archetype === "standard") return numberAnswer(question) === p.num * p.n;
    return true;
  },
});
