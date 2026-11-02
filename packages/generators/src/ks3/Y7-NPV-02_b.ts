/**
 * @statement Y7-NPV-02.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-NPV-02.b: Order decimals and fractions, including negatives
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

const FRACTIONS: [number, number][] = [
  [1, 4],
  [3, 4],
  [1, 5],
  [2, 5],
  [3, 5],
  [4, 5],
  [1, 8],
  [3, 8],
  [7, 20],
];

interface Params {
  p: number;
  k: number;
  f: number;
  shift: number;
}

const r = (v: number) => Number(v.toFixed(6));

export default defineGenerator<Params>({
  id: "Y7-NPV-02.b",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.DECIMAL.LONGER-BIGGER", "FR.DECIMAL.DIGITS"],

  params(rng) {
    const p = {
      p: rng.int(2, 8),
      k: rng.int(1, 9),
      f: rng.int(0, FRACTIONS.length - 1),
      shift: rng.pick([-0.05, 0.05, -0.1, 0.1]),
    };
    const [n, d] = FRACTIONS[p.f] ?? [1, 4];
    if (r(n / d + p.shift) <= 0 || r(n / d + p.shift) >= 1) reject("a decimal between 0 and 1");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const a = `-0.${p.p}`;
        const b = `-0.${p.p}${p.k}`;
        return A.choice({
          rng,
          question: ["Which is greater, ", A.math(a), " or ", A.math(b), "?"],
          correct: A.math(a),
          distractors: [
            {
              content: A.math(b),
              code: "NPV.DECIMAL.LONGER-BIGGER",
              feedback: `${b} is further below zero than ${a}, so it is smaller.`,
            },
            {
              content: "They are equal",
              feedback: `${b} has an extra ${p.k} hundredths below zero.`,
            },
          ],
          solution: [{ say: `${a} = −0.${p.p}0, which is closer to zero than ${b}.` }],
        });
      }
      case 2: {
        const [n, d] = FRACTIONS[p.f] ?? [1, 4];
        const dec = r(n / d + p.shift);
        const fracBigger = n / d > dec;
        const right = fracBigger ? A.math(`\\frac{${n}}{${d}}`) : A.math(String(dec));
        const wrong = fracBigger ? A.math(String(dec)) : A.math(`\\frac{${n}}{${d}}`);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "Which is larger, ",
            A.math(`\\frac{${n}}{${d}}`),
            " or ",
            A.math(String(dec)),
            "?",
          ],
          correct: right,
          distractors: [
            {
              content: wrong,
              code: "FR.DECIMAL.DIGITS",
              feedback: `Change the fraction to a decimal by dividing: ${n} ÷ ${d} = ${r(n / d)}.`,
            },
            {
              content: "They are equal",
              feedback: `${n}/${d} = ${r(n / d)}, which is not ${dec}.`,
            },
          ],
          solution: [{ say: "", math: `\\frac{${n}}{${d}} = ${r(n / d)}` }],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                "Rob says ",
                A.math("-\\frac{1}{2}"),
                " is less than ",
                A.math("-\\frac{1}{4}"),
                ".",
              ],
              truth: true,
              reasons: [
                {
                  text: "True. −½ = −0.5 is further below zero than −¼ = −0.25, so it is smaller.",
                  correct: true,
                },
                {
                  text: "False. A half is bigger than a quarter.",
                  code: "NPV.DECIMAL.LONGER-BIGGER",
                },
                { text: "False. They are the same distance from zero." },
              ],
              solution: [{ say: "For negative numbers, the one further from zero is smaller." }],
            }),
          [
            {
              statement: "Ben says $0.35$ is bigger than $0.4$ because it has more digits.",
              truth: false,
              right: "False. 0.4 = 0.40, and 40 hundredths is more than 35 hundredths.",
              wrong: [
                ["True. More digits make a bigger number.", "NPV.DECIMAL.LONGER-BIGGER"],
                ["True. 35 is bigger than 4.", "FR.DECIMAL.DIGITS"],
              ],
            },
            {
              claim: "A decimal with more decimal places is smaller.",
              truth: "sometimes",
              right:
                "Sometimes. 0.25 is smaller than 0.3, but 0.75 is bigger than 0.5. Compare the tenths first, then the hundredths.",
              wrong: [
                ["Always. More decimal places means smaller parts.", "FR.DECIMAL.DIGITS"],
                ["Never. More digits always make a bigger number.", "NPV.DECIMAL.LONGER-BIGGER"],
              ],
            },
            {
              statement: "Cara says $\\frac{3}{4}$ is bigger than $0.7$.",
              truth: true,
              right: "True. ¾ = 0.75, and 0.75 is bigger than 0.70.",
              wrong: [
                ["False. 0.7 has a 7, which is bigger than 3 and 4.", "FR.DECIMAL.DIGITS"],
                ["False. A fraction is always smaller than a decimal."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === `-0.${p.p}`;
    if (question.key.depth === 2) {
      const [n, d] = FRACTIONS[p.f] ?? [1, 4];
      const dec = r(n / d + p.shift);
      return chosenText(question) === (n / d > dec ? `\\frac{${n}}{${d}}` : String(dec));
    }
    return true;
  },
});
