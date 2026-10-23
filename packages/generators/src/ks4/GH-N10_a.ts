/**
 * @statement GH-N10.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GH-N10.a: Change recurring decimals into fractions
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { exactAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
}

export default defineGenerator<Params>({
  id: "GH-N10.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["FR.RECURRING.OVER-TEN", "NPV.INFINITE.NOTHING-BETWEEN"],

  params(rng) {
    const p = { a: rng.int(1, 8), b: rng.int(0, 9) };
    if (p.a === p.b) reject("two different digits");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = frac(p.a, 9);
        return A.standard({
          question: ["Write ", A.math(`0.\\dot{${p.a}}`), " as a fraction in its simplest form."],
          answer: A.exact(v),
          wrong: [
            {
              code: "FR.RECURRING.OVER-TEN",
              value: A.exact(frac(p.a, 10)),
              feedback: `${p.a}/10 = 0.${p.a} exactly; the digits stop. One recurring digit goes over 9.`,
            },
          ],
          solution: [
            {
              say: "",
              math: `x = 0.\\dot{${p.a}}, \\; 10x - x = ${p.a} \\Rightarrow x = ${toLatex(v)}`,
            },
          ],
        });
      }
      case 2: {
        const n = 10 * p.a + p.b;
        const v = frac(n, 99);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Write ",
                A.math(`0.\\dot{${p.a}}\\dot{${p.b}}`),
                " as a fraction in its simplest form.",
              ],
            },
          ],
          answer: A.exact(v),
          wrong: [
            {
              code: "FR.RECURRING.OVER-TEN",
              value: A.exact(frac(n, 100)),
              feedback: "Two recurring digits go over 99, not 100.",
            },
          ],
          solution: [
            { say: "", math: `100x - x = ${n} \\Rightarrow x = \\frac{${n}}{99} = ${toLatex(v)}` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: ["Eva says ", A.math("0.\\dot{9} = 1"), "."],
          truth: true,
          reasons: [
            {
              text: "True. If x = 0.999…, then 10x − x = 9.999… − 0.999… = 9, so 9x = 9 and x = 1.",
              correct: true,
            },
            {
              text: "False. 0.999… is always a tiny bit less than 1.",
              code: "NPV.INFINITE.NOTHING-BETWEEN",
            },
            { text: "False. 0.999… = 9/10.", code: "FR.RECURRING.OVER-TEN" },
          ],
          solution: [{ say: "There is no number between 0.999… and 1, so they are equal." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return exactAnswer(question) === toLatex(frac(p.a, 9));
    if (question.key.depth === 2)
      return exactAnswer(question) === toLatex(frac(10 * p.a + p.b, 99));
    return true;
  },
});
