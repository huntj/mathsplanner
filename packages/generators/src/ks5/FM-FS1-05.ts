/**
 * @statement FM-FS1-05
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-FS1-05: Apply the central limit theorem
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { phi, round } from "../shared/dist.ts";

/** Sample sizes whose square roots are whole and give terminating σ/n. */
const SIZES = [4, 16, 25, 100];

interface Params {
  n: number;
  k: number;
  mu: number;
  c: number;
}

const r4 = (v: number) => round(v, 4);
const sd = (p: Params) => p.k;
const sigma = (p: Params) => p.k * Math.sqrt(p.n);

export default defineGenerator<Params>({
  id: "FM-FS1-05",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.CLT"],

  params(rng) {
    return {
      n: rng.pick(SIZES),
      k: rng.int(1, 6),
      mu: 10 * rng.int(3, 20),
      c: rng.pick([0.5, 1, 1.5, 2]),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const s = sigma(p);
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            `A population has mean ${p.mu} and standard deviation ${s}. A random sample of ${p.n} values is taken.`,
          ],
          ask: ["Find the standard deviation of the sample mean ", A.math("\\bar{X}"), "."],
          answer: A.number(sd(p)),
          wrong: wrongs(sd(p), [
            {
              code: "PRO.CLT",
              value: A.number(s / p.n),
              feedback: `The standard deviation of X̄ is σ/√n = ${s}/√${p.n}.`,
            },
            {
              code: "PRO.CLT",
              value: A.number(s),
              feedback: "The sample mean varies less than single values: divide by √n.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\frac{\\sigma}{\\sqrt{n}} = \\frac{${s}}{\\sqrt{${p.n}}} = ${sd(p)}`,
            },
          ],
        });
      case 2: {
        const z = (p.c * p.k) / sd(p);
        const v = r4(1 - phi(z));
        const slip = r4(1 - phi((p.c * p.k) / s));
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `A population has mean ${p.mu} and standard deviation ${s}. A random sample of ${p.n} values is taken.`,
              ],
              ask: [
                "Use the central limit theorem to estimate ",
                A.math(`P(\\bar{X} > ${round(p.mu + p.c * p.k, 2)})`),
                ", to 4 decimal places.",
              ],
            },
          ],
          answer: A.number(v, { accuracy: { dp: 4 } }),
          wrong: wrongs(v, [
            {
              code: "PRO.CLT",
              value: A.number(slip, { accuracy: { dp: 4 } }),
              feedback: `Standardise with σ/√n = ${sd(p)}, not σ.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\bar{X} \\approx N\\left(${p.mu}, \\frac{${s}^2}{${p.n}}\\right), \\quad z = \\frac{${p.c * p.k}}{${sd(p)}} = ${round(z, 2)}, \\quad P = ${v}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Ray says the central limit theorem means that if you take a large enough sample, the population becomes normally distributed.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. The population does not change. The theorem says the distribution of the sample mean is approximately normal when n is large.",
              correct: true,
            },
            { text: "True. Large samples make all data normal.", code: "PRO.CLT" },
            { text: "True. The theorem is about the shape of the population.", code: "PRO.CLT" },
          ],
          solution: [{ say: "X̄ ≈ N(μ, σ²/n) for large n, whatever the population's shape." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.k;
    if (question.key.depth === 2) return numberAnswer(question) === r4(1 - phi(p.c));
    return true;
  },
});
