/**
 * @statement FM-FS1-07
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-FS1-07: Use probability generating functions
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";
import { round } from "../shared/dist.ts";

interface Params {
  /** Probabilities (in tenths) of X = 1, 2, 3. */
  w: number[];
}

const probs = (p: Params) => p.w.map((x) => x / 10);
const g1 = (p: Params) =>
  round(
    probs(p).reduce((s, x, i) => s + (i + 1) * x, 0),
    2,
  );
const g2 = (p: Params) =>
  round(
    probs(p).reduce((s, x, i) => s + (i + 1) * i * x, 0),
    2,
  );
const variance = (p: Params) => round(g2(p) + g1(p) - g1(p) ** 2, 2);

export default defineGenerator<Params>({
  id: "FM-FS1-07",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.PGF"],

  params(rng) {
    const a = rng.int(1, 6);
    const b = rng.int(1, 6);
    const c = 10 - a - b;
    if (c < 1) reject("probabilities summing to 1");
    return { w: [a, b, c] };
  },

  build(p, depth, rng): QuestionDraft {
    const [a, b, c] = probs(p) as [number, number, number];
    const G = A.math(`G_X(t) = ${a}t + ${b}t^2 + ${c}t^3`);
    switch (depth) {
      case 1: {
        const v = g1(p);
        return A.standard({
          question: ["The probability generating function of X is ", G, "."],
          ask: ["Find ", A.math("E(X)"), "."],
          answer: A.number(v, { accuracy: { dp: 2 } }),
          wrong: signedWrongs(v, [
            {
              code: "PRO.PGF",
              value: A.number(a, { accuracy: { dp: 2 } }),
              feedback: "E(X) = G′(1): evaluate the derivative at t = 1, not t = 0.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `G'(t) = ${a} + ${round(2 * b, 2)}t + ${round(3 * c, 2)}t^2, \\quad G'(1) = ${v}`,
            },
          ],
        });
      }
      case 2: {
        const v = variance(p);
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["The probability generating function of X is ", G, "."],
              ask: ["Find ", A.math("\\operatorname{Var}(X)"), "."],
            },
          ],
          answer: A.number(v, { accuracy: { dp: 2 } }),
          wrong: signedWrongs(v, [
            {
              code: "PRO.PGF",
              value: A.number(round(g2(p) - g1(p) ** 2, 2), { accuracy: { dp: 2 } }),
              feedback: "Var(X) = G″(1) + G′(1) − [G′(1)]²: include the G′(1) term.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `G''(1) + G'(1) - [G'(1)]^2 = ${g2(p)} + ${g1(p)} - ${g1(p)}^2 = ${v}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Tao says that for a probability generating function, ",
            A.math("G_X(1) = E(X)"),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: "False. G(1) = ΣP(X = x) = 1 for every distribution. The mean is G′(1).",
              correct: true,
            },
            { text: "True. Putting t = 1 gives the mean.", code: "PRO.PGF" },
            { text: "True. G(1) is the sum of the values of X.", code: "PRO.PGF" },
          ],
          solution: [{ say: `For the PGF above, G(1) = ${a} + ${b} + ${c} = 1.` }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === g1(p);
    if (question.key.depth === 2) return numberAnswer(question) === variance(p);
    return true;
  },
});
