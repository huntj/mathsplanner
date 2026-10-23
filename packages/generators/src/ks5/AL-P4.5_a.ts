/**
 * @statement AL-P4.5.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P4.5.a: Find terms of geometric sequences
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  r: number;
  n: number;
}

export default defineGenerator<Params>({
  id: "AL-P4.5.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SERIES.FORMULA", "ALG.SEQUENCE.GEOMETRIC-ADD"],

  params(rng, numbers) {
    const p = {
      a: rng.int(1, 6),
      r: rng.pick(numbers === "friendly" ? [2, 3] : [-3, -2, 2, 3]),
      n: rng.int(4, numbers === "stretch" ? 9 : 7),
    };
    if (Math.abs(p.a * p.r ** (p.n - 1)) > 50000) reject("a manageable term");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const t = (k: number) => p.a * p.r ** (k - 1);
    const ans = t(p.n);
    switch (depth) {
      case 1:
        return A.standard({
          question: `A geometric sequence has first term ${p.a} and common ratio ${p.r}.`,
          ask: `Find the ${p.n}th term.`,
          answer: A.number(ans),
          wrong: signedWrongs(ans, [
            {
              code: "ALG.SERIES.FORMULA",
              value: A.number(p.a * p.r ** p.n),
              feedback: "The nth term is ar^(n − 1): the first term has not been multiplied yet.",
            },
            {
              code: "ALG.SEQUENCE.GEOMETRIC-ADD",
              value: A.number(p.a + (p.n - 1) * p.r),
              feedback: "Geometric sequences multiply by r each time, they do not add it.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `u_{${p.n}} = ${p.a} \\times ${p.r < 0 ? `(${p.r})` : p.r}^{${p.n - 1}} = ${ans}`,
            },
          ],
        });
      case 2: {
        const seq = [1, 2, 3].map(t).join(", ");
        return A.standard({
          question: `A geometric sequence begins ${seq}, …`,
          ask: `Find the ${p.n}th term.`,
          answer: A.number(ans),
          wrong: signedWrongs(ans, [
            {
              code: "ALG.SEQUENCE.GEOMETRIC-ADD",
              value: A.number(p.a + (p.n - 1) * (t(2) - p.a)),
              feedback: `Each term is ${p.r} times the one before, not ${t(2) - p.a} more.`,
            },
          ]),
          solution: [
            {
              say: `r = ${t(2)} ÷ ${p.a} = ${p.r}, so u${p.n} = ${p.a} × ${p.r}^${p.n - 1} = ${ans}.`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `A geometric sequence has first term ${p.a} and common ratio ${p.r}. Joe says the ${p.n}th term is ${p.a} × ${p.r}^${p.n} = ${p.a * p.r ** p.n}.`,
          truth: false,
          reasons: [
            {
              text: `False. The nth term is ar^(n − 1), so it is ${p.a} × ${p.r}^${p.n - 1} = ${ans}.`,
              correct: true,
            },
            { text: "True. The nth term is arⁿ.", code: "ALG.SERIES.FORMULA" },
            { text: "True. The power always matches the position.", code: "ALG.SERIES.FORMULA" },
          ],
          solution: [{ say: "", math: "u_n = ar^{n-1}" }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 4) return true;
    return numberAnswer(question) === p.a * p.r ** (p.n - 1);
  },
});
