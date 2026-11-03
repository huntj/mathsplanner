/**
 * @statement Y8-NPV-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y8-NPV-01.b: Compare and order numbers in standard form
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  m: number[];
  e: number[];
  a: number;
  k: number;
  x: number;
  y: number;
}

const sf = (m: number, e: number) => `${m} \\times 10^{${e}}`;

export default defineGenerator<Params>({
  id: "Y8-NPV-01.b",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.STANDARD-FORM.COMPARE-FIRST"],

  params(rng) {
    const m = [rng.int(11, 99) / 10, rng.int(11, 99) / 10, rng.int(11, 99) / 10];
    const e = [rng.int(2, 8), rng.int(2, 8), rng.int(2, 8)];
    const p = { m, e, a: rng.int(1, 4), k: rng.int(2, 4), x: rng.int(2, 6), y: rng.int(1, 4) };
    if (new Set(e).size < 3) reject("three different powers");
    const big = e.indexOf(Math.max(...e));
    if (m.indexOf(Math.max(...m)) === big)
      reject("a largest number whose first part is not the largest");
    if (p.x <= p.y) reject("a bigger power first");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const big = p.e.indexOf(Math.max(...p.e));
        const first = p.m.indexOf(Math.max(...p.m));
        return A.choice({
          rng,
          question: ["Which of these numbers is the largest?"],
          correct: A.math(sf(p.m[big] ?? 1, p.e[big] ?? 1)),
          distractors: [0, 1, 2]
            .filter((i) => i !== big)
            .map((i) => ({
              content: A.math(sf(p.m[i] ?? 1, p.e[i] ?? 1)),
              ...(i === first ? { code: "NPV.STANDARD-FORM.COMPARE-FIRST" } : {}),
              feedback: "Compare the powers of 10 first: the biggest power wins.",
            })),
          solution: [{ say: `10^${p.e[big]} is the biggest power of 10.` }],
        });
      }
      case 2: {
        const big = p.a * p.k;
        const v = p.k * 10 ** (p.x - p.y);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "How many times bigger is ",
                A.math(sf(big, p.x)),
                " than ",
                A.math(sf(p.a, p.y)),
                "?",
              ],
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "NPV.STANDARD-FORM.COMPARE-FIRST",
              value: A.number(p.k),
              feedback: `The powers of 10 differ too: 10^${p.x} is 10^${p.x - p.y} times 10^${p.y}.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\frac{${big}}{${p.a}} \\times 10^{${p.x} - ${p.y}} = ${p.k} \\times 10^{${p.x - p.y}} = ${v}`,
            },
          ],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.alwaysSometimesNever({
              rng,
              claim: [
                "Of two positive numbers in standard form, the one with the bigger power of 10 is bigger.",
              ],
              truth: "always",
              reasons: [
                {
                  text: "Always. The first parts are between 1 and 10, so even 9.9 × 10^4 is less than 1 × 10^5.",
                  correct: true,
                },
                {
                  text: "Sometimes. It depends on the first numbers too.",
                  code: "NPV.STANDARD-FORM.COMPARE-FIRST",
                },
                {
                  text: "Never. Compare the first numbers instead.",
                  code: "NPV.STANDARD-FORM.COMPARE-FIRST",
                },
              ],
              solution: [{ say: "Only when the powers match do you compare the first parts." }],
            }),
          [
            {
              statement:
                "Leo says $9.8 \\times 10^{4}$ is bigger than $1.2 \\times 10^{5}$, because 9.8 is bigger than 1.2.",
              truth: false,
              right:
                "False. 9.8 × 10⁴ = 98 000 and 1.2 × 10⁵ = 120 000. Compare the powers of 10 first.",
              wrong: [
                ["True. Compare the first numbers.", "NPV.STANDARD-FORM.COMPARE-FIRST"],
                ["True. 9.8 has more digits than 1.2."],
              ],
            },
            {
              statement: "Mia says $3.5 \\times 10^{-2}$ is bigger than $8 \\times 10^{-3}$.",
              truth: true,
              right:
                "True. 3.5 × 10^−2 = 0.035 and 8 × 10^−3 = 0.008, as −2 is a bigger power than −3.",
              wrong: [
                ["False. 8 is bigger than 3.5.", "NPV.STANDARD-FORM.COMPARE-FIRST"],
                ["False. 10^−3 is bigger than 10^−2, because 3 is bigger than 2."],
              ],
            },
            {
              claim: "Two numbers in standard form with the same first number are equal.",
              truth: "sometimes",
              right:
                "Sometimes. Only when the powers of 10 match too: 3 × 10² = 300 but 3 × 10³ = 3000.",
              wrong: [
                ["Always. The first number decides the size.", "NPV.STANDARD-FORM.COMPARE-FIRST"],
                ["Never. Two numbers in standard form are never equal."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    const big = p.e.indexOf(Math.max(...p.e));
    if (question.key.depth === 1) return chosenText(question) === sf(p.m[big] ?? 1, p.e[big] ?? 1);
    if (question.key.depth === 2) return numberAnswer(question) === p.k * 10 ** (p.x - p.y);
    return true;
  },
});
