/**
 * @statement Y6-FR-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-FR-01: Use common factors to simplify fractions; use common multiples to express fractions in the
// same denomination
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { fracTex, gcdOf, slash } from "../shared/fr.ts";

export interface Params {
  n: number;
  d: number;
  g: number;
  /** Depth 2: denominators that share a factor. */
  b: number;
  e: number;
  claimTrue: boolean;
}

export default defineGenerator<Params>({
  id: "Y6-FR-01",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["FR.EQUIV.ADD-SAME", "NPV.FACTOR.LCM-PRODUCT"],

  params(rng, numbers) {
    const d = rng.int(3, numbers === "friendly" ? 6 : 10);
    const n = rng.int(1, d - 1);
    const g = rng.int(2, numbers === "stretch" ? 12 : 6);
    const shared = rng.int(2, 4);
    const [b, e] = [shared * rng.int(2, 5), shared * rng.int(2, 5)];
    if (gcdOf(n, d) !== 1 || b === e || b % e === 0 || e % b === 0)
      reject("simplest n/d; unrelated denominators");
    return { n, d, g, b, e, claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const [N, D] = [p.n * p.g, p.d * p.g];
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Write ", A.math(fracTex(N, D)), " in its simplest form."],
          answer: A.exact(frac(p.n, p.d), "simplest"),
          solution: [
            {
              say: `The highest common factor of ${N} and ${D} is ${p.g}. Divide both by ${p.g}: ${slash(p.n, p.d)}.`,
            },
          ],
        });
      case 2: {
        const lcm = (p.b * p.e) / gcdOf(p.b, p.e);
        return A.standard({
          question: [
            "Find the lowest common denominator of ",
            A.math(fracTex(1, p.b)),
            " and ",
            A.math(fracTex(1, p.e)),
            ".",
          ],
          answer: A.number(lcm),
          wrong: wrongs(lcm, [
            {
              code: "NPV.FACTOR.LCM-PRODUCT",
              value: A.number(p.b * p.e),
              feedback: `${p.b} × ${p.e} works, but ${p.b} and ${p.e} share a factor, so there is a smaller common multiple.`,
            },
          ]),
          solution: [
            {
              say: `Multiples of ${p.b}: ${[1, 2, 3, 4].map((k) => k * p.b).join(", ")}, … The first that is also a multiple of ${p.e} is ${lcm}.`,
            },
          ],
        });
      }
      default: {
        const k = rng.int(1, Math.min(N, D) - 1);
        const shown = p.claimTrue ? fracTex(p.n, p.d) : fracTex(N - k, D - k);
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Eli says ",
            A.math(`${fracTex(N, D)} = ${shown}`),
            p.claimTrue
              ? `, because he divided the top and bottom by ${p.g}.`
              : `, because he took ${k} from the top and bottom.`,
          ],
          truth: p.claimTrue || frac(N - k, D - k).eq(frac(N, D)),
          reasons: p.claimTrue
            ? [
                {
                  text: `True. Dividing the top and bottom by the same number, ${p.g}, keeps the fraction the same.`,
                  correct: true,
                },
                { text: "False. The numbers are smaller, so the fraction is smaller." },
                { text: "False. You must subtract, not divide.", code: "FR.EQUIV.ADD-SAME" },
              ]
            : [
                {
                  text: `False. Subtracting changes the fraction. Divide by a common factor instead: ${slash(N, D)} = ${slash(p.n, p.d)}.`,
                  correct: true,
                },
                {
                  text: "True. Doing the same to the top and bottom keeps it equal.",
                  code: "FR.EQUIV.ADD-SAME",
                },
                { text: "True. Both fractions are less than 1." },
              ],
          solution: [
            { say: `${slash(N, D)} simplifies by dividing by ${p.g}: ${slash(p.n, p.d)}.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (a?.type === "exact") return String(a.value) === toLatex(frac(p.n, p.d));
    if (question.archetype === "standard")
      return numberAnswer(question) % p.b === 0 && numberAnswer(question) % p.e === 0;
    return true;
  },
});
