/**
 * @statement GF-N14
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-N14: Estimate answers; check calculations using approximation and estimation, including
// answers obtained using technology
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  c: number;
  shown: number;
}

/** Round to 1 significant figure. */
const sf1 = (x: number) => {
  const p = 10 ** Math.floor(Math.log10(Math.abs(x)));
  return Math.round(x / p) * p;
};
const r = (x: number) => Math.round(x * 1e6) / 1e6;

export default defineGenerator<Params>({
  id: "GF-N14",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.ROUND.WRONG-PLACE", "NPV.DECIMAL.POINT-PLACE"],

  params(rng) {
    const a = r(rng.int(21, 89) / 10 + rng.int(1, 9) / 100);
    const b = rng.int(31, 980);
    const c = r(rng.int(11, 49) / 10 + rng.int(1, 9) / 100);
    if (Math.round(sf1(c)) === 0 || (sf1(a) * sf1(b)) % sf1(c) !== 0)
      reject("an estimate that divides exactly");
    return { a, b, c, shown: rng.pick([10, 0.1, 1]) };
  },

  build(p, depth, rng): QuestionDraft {
    const est = (sf1(p.a) * sf1(p.b)) / sf1(p.c);
    const exact = (p.a * p.b) / p.c;
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "By rounding each number to 1 significant figure, estimate ",
            A.math(`\\frac{${p.a} \\times ${p.b}}{${p.c}}`),
            ".",
          ],
          answer: A.number(est),
          wrong: wrongs(est, [
            {
              code: "NPV.ROUND.WRONG-PLACE",
              value: A.number(r((Math.round(p.a) * Math.round(p.b / 10) * 10) / Math.round(p.c))),
              feedback: "Round every number to 1 significant figure: its first non-zero digit.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\frac{${sf1(p.a)} \\times ${sf1(p.b)}}{${sf1(p.c)}} = \\frac{${sf1(p.a) * sf1(p.b)}}{${sf1(p.c)}} = ${est}`,
            },
          ],
        });
      case 2: {
        const wrongShown = r(exact * p.shown);
        const ok = p.shown === 1;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "Jo uses a calculator to work out ",
            A.math(`\\frac{${p.a} \\times ${p.b}}{${p.c}}`),
            ` and gets ${Math.round(wrongShown * 100) / 100}.`,
          ],
          ask: "Use an estimate to decide whether her answer is sensible.",
          correct: ok ? `Sensible: the estimate is ${est}` : `Not sensible: the estimate is ${est}`,
          distractors: [
            {
              content: ok
                ? `Not sensible: the estimate is ${est}`
                : `Sensible: the estimate is ${est}`,
              code: "NPV.DECIMAL.POINT-PLACE",
              feedback: `Compare the size: ${est} and ${Math.round(wrongShown * 100) / 100}${ok ? " are close" : " differ by a factor of 10"}.`,
            },
            {
              content: "You cannot tell without working it out exactly",
              feedback: "An estimate shows whether the answer is about the right size.",
            },
          ],
          solution: [
            { say: `Estimate ${est}; the exact answer is about ${Math.round(exact * 100) / 100}.` },
          ],
        });
      }
      default: {
        const truth = est > exact;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Mo estimates ",
            A.math(`\\frac{${p.a} \\times ${p.b}}{${p.c}}`),
            ` as ${est} and says this is an overestimate.`,
          ],
          truth,
          reasons: [
            {
              text: `${truth ? "True" : "False"}. The exact answer is about ${Math.round(exact * 10) / 10}, so ${est} is an ${est > exact ? "over" : "under"}estimate.`,
              correct: true,
            },
            {
              text: `${truth ? "False" : "True"}. Rounding always makes the answer bigger.`,
              code: "NPV.ROUND.WRONG-PLACE",
            },
            { text: `${truth ? "False" : "True"}. Estimates are always exactly right.` },
          ],
          solution: [
            {
              say: "Rounding the top up or the bottom down makes the estimate too big, and the reverse makes it too small.",
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return numberAnswer(question) === (sf1(p.a) * sf1(p.b)) / sf1(p.c);
    if (question.archetype === "varied-form")
      return chosenText(question).startsWith(p.shown === 1 ? "Sensible" : "Not");
    return true;
  },
});
