/**
 * @statement Y7-NPV-09.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-NPV-09.a: Estimate answers by rounding
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  top: number;
  c: number;
  k: number;
  m: number;
}

const sf1 = (n: number) => {
  const p = 10 ** Math.floor(Math.log10(n));
  return Math.round(n / p) * p;
};

export default defineGenerator<Params>({
  id: "Y7-NPV-09.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.ROUND.WRONG-PLACE", "NPV.ROUND.ALWAYS-DOWN"],

  params(rng) {
    const p = {
      a: rng.int(31, 89),
      b: rng.int(110, 890),
      top: rng.int(5, 9) * 100 + rng.int(1, 40),
      c: rng.int(26, 49),
      k: rng.int(3, 9),
      m: rng.int(2, 8),
    };
    if (p.a % 10 === 0 || p.b % 10 === 0 || p.c % 10 === 0 || p.k <= p.m)
      reject("numbers that need rounding");
    if (sf1(p.a) * sf1(p.b) === Math.round(p.a / 10) * 10 * Math.round(p.b / 10) * 10)
      reject("a wrong-place estimate that differs");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = sf1(p.a) * sf1(p.b);
        return A.standard({
          question: [
            "Estimate ",
            A.math(`${p.a} \\times ${p.b}`),
            " by rounding each number to 1 significant figure.",
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "NPV.ROUND.WRONG-PLACE",
              value: A.number(Math.round(p.a / 10) * 10 * Math.round(p.b / 10) * 10),
              feedback: `Round ${p.b} to 1 significant figure: ${sf1(p.b)}, not to the nearest 10.`,
            },
          ]),
          solution: [{ say: "", math: `${sf1(p.a)} \\times ${sf1(p.b)} = ${v}` }],
        });
      }
      case 2: {
        const d = p.c / 10;
        const top = sf1(p.top);
        const v = top / Math.round(d);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Estimate ",
                A.math(`${p.top} \\div ${d}`),
                " by rounding each number to 1 significant figure.",
              ],
            },
          ],
          answer: A.number(Math.round(v * 100) / 100),
          wrong: wrongs(Math.round(v * 100) / 100, [
            {
              code: "NPV.ROUND.ALWAYS-DOWN",
              value: A.number(Math.round((top / Math.floor(d)) * 100) / 100),
              feedback: `${d} rounds to ${Math.round(d)}, not ${Math.floor(d)}.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `${top} \\div ${Math.round(d)} \\approx ${Math.round(v * 100) / 100}`,
            },
          ],
        });
      }
      default: {
        const x = 10 * p.k - 1;
        const y = 10 * p.m + 1;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Kim estimates ${x} × ${y} as ${10 * p.k} × ${10 * p.m} = ${100 * p.k * p.m}. She says the exact answer must be less than ${100 * p.k * p.m}.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. ${x} was rounded up but ${y} was rounded down, so the estimate could be too big or too small. In fact ${x} × ${y} = ${x * y}.`,
              correct: true,
            },
            { text: "True. Rounding always gives an overestimate.", code: "NPV.ROUND.ALWAYS-DOWN" },
            {
              text: "True. Estimates are always bigger than exact answers.",
              code: "NPV.ROUND.WRONG-PLACE",
            },
          ],
          solution: [{ say: "Look at which way each number was rounded." }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === sf1(p.a) * sf1(p.b);
    if (question.key.depth === 2)
      return numberAnswer(question) === Math.round((sf1(p.top) / Math.round(p.c / 10)) * 100) / 100;
    return true;
  },
});
