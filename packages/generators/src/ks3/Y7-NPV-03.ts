/**
 * @statement Y7-NPV-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y7-NPV-03: Use the four operations, including formal written methods, with integers, decimals,
// proper and improper fractions, and mixed numbers, all both positive and negative
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

type Kind = "subtract-negative" | "multiply-negative" | "decimal-times" | "fraction-add";

interface Params {
  kind: Kind;
  a: number;
  b: number;
  /** Fractions a/b + c/d. */
  f: [number, number, number, number];
  /** Money: price in pence and how many, and the note paid with. */
  price: number;
  count: number;
  note: number;
  mistake: number;
}

const fracTex = (n: number, d: number) => `\\frac{${n}}{${d}}`;

export default defineGenerator<Params>({
  id: "Y7-NPV-03",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: [
    "NPV.NEGATIVE.SUBTRACT-NEGATIVE",
    "NPV.NEGATIVE.SIGN-RULE",
    "NPV.DECIMAL.POINT-PLACE",
    "FR.ADD.TOPS-AND-BOTTOMS",
  ],

  params(rng, numbers) {
    const kinds: Kind[] =
      numbers === "friendly"
        ? ["subtract-negative", "decimal-times"]
        : ["subtract-negative", "multiply-negative", "decimal-times", "fraction-add"];
    const b1 = rng.int(2, 6);
    const b2 = rng.int(2, 6);
    if (b1 === b2) reject("different denominators");
    const f: [number, number, number, number] = [rng.int(1, b1 - 1), b1, rng.int(1, b2 - 1), b2];
    const price = rng.int(115, 495);
    const count = rng.int(2, 6);
    const note = price * count < 1000 ? 10 : 20;
    if (price * count >= 2000 || price % 5 !== 0) reject("money must be in 5p and under £20");
    return {
      kind: rng.pick(kinds),
      a: rng.int(2, numbers === "stretch" ? 25 : 12),
      b: rng.int(2, numbers === "stretch" ? 25 : 12),
      f,
      price,
      count,
      note,
      mistake: rng.int(0, 1),
    };
  },

  build(p, depth): QuestionDraft {
    const [n1, d1, n2, d2] = p.f;
    const fracSum = frac(n1, d1).add(frac(n2, d2));
    switch (depth) {
      case 1:
        switch (p.kind) {
          case "subtract-negative":
            return A.standard({
              question: [A.math(`${p.a} - (-${p.b})`)],
              ask: "Work it out.",
              answer: A.number(p.a + p.b),
              wrong: wrongs(p.a + p.b, [
                {
                  code: "NPV.NEGATIVE.SUBTRACT-NEGATIVE",
                  value: A.number(p.a - p.b),
                  feedback: "Subtracting a negative is the same as adding: a − (−b) = a + b.",
                },
              ]),
              solution: [
                {
                  say: "Subtracting a negative number is the same as adding it:",
                  math: `${p.a} - (-${p.b}) = ${p.a} + ${p.b} = ${p.a + p.b}`,
                },
              ],
            });
          case "multiply-negative": {
            const answer = -p.a * p.b;
            return A.standard({
              question: [A.math(`-${p.a} \\times ${p.b}`)],
              ask: "Work it out.",
              answer: A.number(answer),
              wrong: wrongs(answer, [
                {
                  code: "NPV.NEGATIVE.SIGN-RULE",
                  value: A.number(-answer),
                  feedback: "A negative times a positive is negative.",
                },
              ]),
              solution: [
                {
                  say: "Negative × positive = negative:",
                  math: `-${p.a} \\times ${p.b} = ${answer}`,
                },
              ],
            });
          }
          case "decimal-times": {
            const x = frac(p.a * 10 + 3, 10);
            const answer = x.mul(p.b);
            const value = Number(answer.toDecimalString());
            return A.standard({
              question: [A.math(`${x.toDecimalString()} \\times ${p.b}`)],
              ask: "Work it out.",
              answer: A.number(value),
              wrong: wrongs(value, [
                {
                  code: "NPV.DECIMAL.POINT-PLACE",
                  value: A.number(value * 10),
                  feedback: `${x.toDecimalString()} has one decimal place, so the answer has one decimal place too.`,
                },
                {
                  code: "NPV.DECIMAL.POINT-PLACE",
                  value: A.number(Number((value / 10).toFixed(2))),
                  feedback:
                    "Estimate first: the answer should be close to " +
                    Math.round(x.toNumber()) * p.b +
                    ".",
                },
              ]),
              solution: [
                {
                  say: `Work out ${p.a * 10 + 3} × ${p.b} = ${(p.a * 10 + 3) * p.b}, then put back one decimal place:`,
                  math: `${x.toDecimalString()} \\times ${p.b} = ${answer.toDecimalString()}`,
                },
              ],
            });
          }
          default:
            return A.standard({
              question: [A.math(`${fracTex(n1, d1)} + ${fracTex(n2, d2)}`)],
              ask: "Work it out. Give your answer in its simplest form.",
              answer: A.exact(fracSum, "simplest"),
              wrong: [
                {
                  code: "FR.ADD.TOPS-AND-BOTTOMS",
                  value: A.exact(fracTex(n1 + n2, d1 + d2)),
                  feedback:
                    "Change both fractions to the same denominator first, then add the numerators only.",
                },
              ],
              solution: [
                {
                  say: "Use a common denominator, then add the numerators:",
                  math: `${fracTex(n1 * d2, d1 * d2)} + ${fracTex(n2 * d1, d1 * d2)} = ${toLatex(fracSum)}`,
                },
              ],
            });
        }
      case 2:
        return A.missingValue({
          intro: "Find the missing number.",
          relation: [p.a, "-", "(", -p.b, ")", "=", p.a + p.b],
          hide: 3,
          wrong: [
            {
              code: "NPV.NEGATIVE.SUBTRACT-NEGATIVE",
              value: A.number(p.b),
              feedback: `Taking away ${p.b} would give ${p.a - p.b}. To get ${p.a + p.b} you must take away a negative.`,
            },
          ],
          solution: [
            {
              say: `${p.a} − (−${p.b}) = ${p.a} + ${p.b} = ${p.a + p.b}, so the missing number is −${p.b}.`,
            },
          ],
        });
      case 4: {
        if (p.mistake === 0) {
          const lcd = d1 * d2;
          return A.spotTheMistake({
            question: "Sam adds two fractions.",
            lines: [
              [A.math(`${fracTex(n1, d1)} + ${fracTex(n2, d2)}`)],
              [A.math(`= ${fracTex(n1 * d2, lcd)} + ${fracTex(n2 * d1, lcd)}`)],
              [A.math(`= ${fracTex(n1 * d2 + n2 * d1, lcd + lcd)}`)],
            ],
            mistake: 2,
            code: "FR.ADD.TOPS-AND-BOTTOMS",
            feedback: `Line 3 adds the denominators too. With a common denominator, add only the numerators: ${toLatex(frac(n1 * d2 + n2 * d1, lcd))}.`,
          });
        }
        const x = frac(p.a * 10 + 3, 10);
        const whole = (p.a * 10 + 3) * p.b;
        return A.spotTheMistake({
          question: ["Mia works out ", A.math(`${x.toDecimalString()} \\times ${p.b}`), "."],
          lines: [
            [A.math(`${p.a * 10 + 3} \\times ${p.b} = ${whole}`)],
            [`${x.toDecimalString()} has one decimal place.`],
            [
              A.math(
                `\\text{so } ${x.toDecimalString()} \\times ${p.b} = ${(whole / 100).toFixed(2)}`,
              ),
            ],
          ],
          mistake: 2,
          code: "NPV.DECIMAL.POINT-PLACE",
          feedback: `One decimal place in the question means one in the answer: ${(whole / 10).toFixed(1)}.`,
        });
      }
      default: {
        const cost = p.price * p.count;
        const change = p.note * 100 - cost;
        const pounds = (pence: number) => (pence / 100).toFixed(2);
        return A.multiStepContext({
          context: `Ella buys ${p.count} books at £${pounds(p.price)} each. She pays with a £${p.note} note.`,
          parts: [
            {
              ask: "How much do the books cost altogether, in pounds?",
              answer: A.number(cost / 100),
              wrong: wrongs(cost / 100, [
                {
                  code: "NPV.DECIMAL.POINT-PLACE",
                  value: A.number(cost / 10),
                  feedback: "Estimate first to check where the decimal point goes.",
                },
              ]),
            },
            { ask: "How much change does she get, in pounds?", answer: A.number(change / 100) },
          ],
          solution: [
            { say: `${p.count} × £${pounds(p.price)} = £${pounds(cost)}.` },
            { say: `£${p.note}.00 − £${pounds(cost)} = £${pounds(change)}.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "multi-step-context")
      return Math.abs(numberAnswer(question, 0) * 100 - p.price * p.count) < 1e-6;
    if (question.archetype === "missing-value") return numberAnswer(question) === -p.b;
    if (question.archetype === "spot-the-mistake") return true;
    const a = question.parts[0]?.answer;
    if (a?.type === "exact") {
      const [n1, d1, n2, d2] = p.f;
      return a.value === toLatex(frac(n1 * d2 + n2 * d1, d1 * d2));
    }
    const expected = {
      "subtract-negative": p.a + p.b,
      "multiply-negative": -p.a * p.b,
      "decimal-times": ((p.a * 10 + 3) * p.b) / 10,
      "fraction-add": Number.NaN,
    }[p.kind];
    return Math.abs(numberAnswer(question) - expected) < 1e-9;
  },
});
