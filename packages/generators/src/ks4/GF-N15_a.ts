/**
 * @statement GF-N15.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-N15.a: Round to decimal places
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  i: number;
  d1: number;
  d2: number;
  d3: number;
}

export default defineGenerator<Params>({
  id: "GF-N15.a",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.ROUND.ALWAYS-DOWN", "NPV.ROUND.WRONG-PLACE"],

  params(rng) {
    const p = { i: rng.int(0, 99), d1: rng.int(0, 8), d2: rng.int(0, 8), d3: rng.int(5, 9) };
    if (p.d1 === 0 && p.d2 === 0) reject("a number with decimals");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        // i.d1 d2 d3 to 2 dp: d3 ≥ 5 rounds d2 up (d2 ≤ 8, so no carry).
        const x = `${p.i}.${p.d1}${p.d2}${p.d3}`;
        const v = Number(`${p.i}.${p.d1}${p.d2 + 1}`);
        const down = Number(`${p.i}.${p.d1}${p.d2}`);
        const one = Number(`${p.i}.${p.d1 + (p.d2 >= 5 ? 1 : 0)}`);
        return A.standard({
          question: ["Round ", A.math(x), " to 2 decimal places."],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "NPV.ROUND.ALWAYS-DOWN",
              value: A.number(down),
              feedback: `The next digit is ${p.d3}, which is 5 or more, so round up.`,
            },
            {
              code: "NPV.ROUND.WRONG-PLACE",
              value: A.number(one),
              feedback: "Two decimal places means keep the hundredths digit.",
            },
          ]),
          solution: [
            { say: `The third decimal digit is ${p.d3}, so the second goes up: `, math: String(v) },
          ],
        });
      }
      case 2: {
        // i.9 d3 to 1 dp carries into the ones.
        const x = `${p.i}.9${p.d3}`;
        const v = p.i + 1;
        return A.variedForm({
          rng,
          forms: [
            { question: ["Round ", A.math(x), " to 1 decimal place."] },
            { question: [`A plank is ${x} m long.`], ask: "Round its length to 1 decimal place." },
          ],
          answer: A.number(v, { accuracy: { dp: 1 } }),
          wrong: wrongs(v, [
            {
              code: "NPV.ROUND.ALWAYS-DOWN",
              value: A.number(Number(`${p.i}.9`), { accuracy: { dp: 1 } }),
              feedback: `The next digit is ${p.d3}, so 9 tenths rounds up to 10 tenths, which is 1 whole.`,
            },
          ]),
          solution: [{ say: "", math: `${x} \\approx ${p.i + 1}.0` }],
        });
      }
      default: {
        const x = `${p.i}.${p.d1}4${p.d3}`;
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                "Mo says ",
                A.math(x),
                ` to 1 decimal place is ${p.i}.${p.d1 + 1}, because ${x} → ${p.i}.${p.d1}5 → ${p.i}.${p.d1 + 1}.`,
              ],
              truth: false,
              reasons: [
                {
                  text: `False. Round once, looking only at the next digit: it is 4, so the answer is ${p.i}.${p.d1}.`,
                  correct: true,
                },
                {
                  text: "True. Round each digit from the end, one at a time.",
                  code: "NPV.ROUND.WRONG-PLACE",
                },
                {
                  text: `True. Any digit after the 4 makes it round up.`,
                  code: "NPV.ROUND.WRONG-PLACE",
                },
              ],
              solution: [{ say: "Rounding in steps can give the wrong answer." }],
            }),
          [
            {
              statement: "Ana rounds 0.0476 to 2 significant figures and gets 0.048.",
              truth: true,
              right:
                "True. The first significant figure is 4; the next digit after 7 is 6, so round up.",
              wrong: [
                ["False. It is 0.05.", "NPV.ROUND.WRONG-PLACE"],
                ["False. It is 0.04.", "NPV.ROUND.ALWAYS-DOWN"],
              ],
            },
            {
              claim:
                "Rounding to 1 significant figure can change the number of digits before the decimal point.",
              truth: "sometimes",
              right: "Sometimes. 960 → 1000 gains a digit, but 340 → 300 does not.",
              wrong: [
                ["Never. The size stays the same.", "NPV.ROUND.WRONG-PLACE"],
                ["Always. It adds a digit."],
              ],
            },
            {
              statement: "Leo rounds 3.96 to 1 decimal place and gets 3.10.",
              truth: false,
              right: "False. 3.96 rounds to 4.0 to 1 decimal place.",
              wrong: [
                ["True. 9 + 1 = 10.", "NPV.ROUND.WRONG-PLACE"],
                ["True. Round the 9 up to 10.", "NPV.ROUND.WRONG-PLACE"],
              ],
            },
          ],
        );
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === Number(`${p.i}.${p.d1}${p.d2 + 1}`);
    if (question.key.depth === 2) return numberAnswer(question) === p.i + 1;
    return true;
  },
});
