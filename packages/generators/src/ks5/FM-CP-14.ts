/**
 * @statement FM-CP-14
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-CP-14: Sum series using standard results for Σr, Σr², Σr³
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  n: number;
  k: number;
}

const tri = (n: number) => (n * (n + 1)) / 2;
const sq = (n: number) => (n * (n + 1) * (2 * n + 1)) / 6;

export default defineGenerator<Params>({
  id: "FM-CP-14",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SERIES.STANDARD", "ALG.SIGMA.COUNT"],

  params(rng) {
    return { n: rng.int(8, 30), k: rng.int(4, 12) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = sq(p.n);
        return A.standard({
          question: ["Use a standard result to work out ", A.math(`\\sum_{r=1}^{${p.n}} r^2`), "."],
          answer: A.number(v),
          wrong: signedWrongs(v, [
            {
              code: "ALG.SERIES.STANDARD",
              value: A.number(tri(p.n) ** 2),
              feedback: "(Σr)² is the result for Σr³. Σr² = n(n + 1)(2n + 1)/6.",
            },
          ]),
          solution: [
            { say: "", math: `\\frac{${p.n} \\times ${p.n + 1} \\times ${2 * p.n + 1}}{6} = ${v}` },
          ],
        });
      }
      case 2: {
        const top = p.k + p.n;
        const v = tri(top) ** 2 - tri(p.k - 1) ** 2;
        return A.variedForm({
          rng,
          forms: [
            { question: ["Work out ", A.math(`\\sum_{r=${p.k}}^{${top}} r^3`), "."] },
            { question: ["Find the value of ", A.math(`\\sum_{r=${p.k}}^{${top}} r^3`), "."] },
          ],
          answer: A.number(v),
          wrong: signedWrongs(v, [
            {
              code: "ALG.SIGMA.COUNT",
              value: A.number(tri(top) ** 2 - tri(p.k) ** 2),
              feedback: `The sum includes r = ${p.k}, so subtract only the sum up to ${p.k - 1}.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\sum_{r=1}^{${top}} r^3 - \\sum_{r=1}^{${p.k - 1}} r^3 = ${tri(top)}^2 - ${tri(p.k - 1)}^2 = ${v}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Fay says ",
            A.math(`\\sum_{r=1}^{n} r^2 = \\left(\\sum_{r=1}^{n} r\\right)^2`),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: `False. With n = 2: 1 + 4 = 5 but (1 + 2)² = 9. It is Σr³ that equals (Σr)².`,
              correct: true,
            },
            {
              text: "True. Squaring each term is the same as squaring the total.",
              code: "ALG.SERIES.STANDARD",
            },
            { text: "True. Both are n(n + 1)(2n + 1)/6.", code: "ALG.SERIES.STANDARD" },
          ],
          solution: [{ say: "Σr² = n(n + 1)(2n + 1)/6 and Σr³ = n²(n + 1)²/4 = (Σr)²." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === sq(p.n);
    return true;
  },
});
