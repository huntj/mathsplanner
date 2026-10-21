/**
 * @statement GF-N2
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-N2: Apply the four operations, including formal written methods, to integers, decimals and
// simple fractions (proper and improper) and mixed numbers, all both positive and negative
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** Mixed numbers w1 n1/d1 and w2 n2/d2. */
  m: [number, number, number, number, number, number];
  /** Decimals as integers with a number of places. */
  a: number;
  ap: number;
  b: number;
  bp: number;
  neg: [number, number];
  price: number;
  qty: number;
}

const mixed = (w: number, n: number, d: number) => `${w}\\frac{${n}}{${d}}`;

export default defineGenerator<Params>({
  id: "GF-N2",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: [
    "FR.MIXED.CONVERT",
    "NPV.DECIMAL.POINT-PLACE",
    "NPV.NEGATIVE.SIGN-RULE",
    "AS.MULTISTEP.ONE-STEP",
  ],

  params(rng) {
    const d1 = rng.pick([2, 3, 4, 5]);
    const d2 = rng.pick([2, 3, 4, 5]);
    const m: Params["m"] = [
      rng.int(1, 3),
      rng.int(1, d1 - 1),
      d1,
      rng.int(1, 2),
      rng.int(1, d2 - 1),
      d2,
    ];
    if (frac(m[1], d1).d !== BigInt(d1) || frac(m[4], d2).d !== BigInt(d2))
      reject("mixed numbers in their simplest form");
    const ap = rng.int(1, 2);
    const bp = rng.int(1, 2);
    const a = rng.int(2, 9);
    const b = rng.int(2, 9);
    if (ap + bp < 2) reject("a product with places to place");
    const neg: [number, number] = [-rng.int(3, 12) * rng.int(2, 6), rng.int(2, 6)];
    if (neg[0] % neg[1] !== 0) reject("an exact division");
    return { m, a, ap, b, bp, neg, price: rng.int(105, 495), qty: rng.int(3, 8) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const [w1, n1, d1, w2, n2, d2] = p.m;
        const x = frac(w1 * d1 + n1, d1);
        const y = frac(w2 * d2 + n2, d2);
        const right = x.mul(y);
        // Multiplying the whole numbers and the fractions separately.
        const slip = frac(w1 * w2).add(frac(n1 * n2, d1 * d2));
        return A.standard({
          question: [
            "Work out ",
            A.math(`${mixed(w1, n1, d1)} \\times ${mixed(w2, n2, d2)}`),
            ". Give your answer as a mixed number in its simplest form.",
          ],
          answer: A.exact(right, "mixed-number", { form: "mixed" }),
          wrong: slip.eq(right)
            ? []
            : [
                {
                  code: "FR.MIXED.CONVERT",
                  value: A.exact(slip, undefined, { form: "mixed" }),
                  feedback:
                    "Change both to improper fractions first; you cannot multiply the whole numbers and fractions separately.",
                },
              ],
          solution: [
            {
              say: "As improper fractions: ",
              math: `${toLatex(x)} \\times ${toLatex(y)} = ${toLatex(right)} = ${toLatex(right, { form: "mixed" })}`,
            },
          ],
        });
      }
      case 2: {
        const x = p.a / 10 ** p.ap;
        const y = p.b / 10 ** p.bp;
        const right = Number((x * y).toFixed(p.ap + p.bp));
        return A.standard({
          question: ["Work out ", A.math(`${x} \\times ${y}`), "."],
          answer: A.number(right),
          wrong: wrongs(right, [
            {
              code: "NPV.DECIMAL.POINT-PLACE",
              value: A.number(Number((right * 10).toFixed(4))),
              feedback: `There are ${p.ap + p.bp} decimal places in the question, so ${p.ap + p.bp} in the answer: ${p.a} × ${p.b} = ${p.a * p.b}.`,
            },
          ]),
          solution: [
            {
              say: `${p.a} × ${p.b} = ${p.a * p.b}, then move the point ${p.ap + p.bp} places: ${right}.`,
            },
          ],
        });
      }
      case 4: {
        const [n, d] = p.neg;
        const q = n / d;
        return A.trueOrFalseWhy({
          rng,
          statement: ["Mo says ", A.math(`${n} \\div ${-d} = ${q}`), "."],
          truth: false,
          reasons: [
            {
              text: `False. Negative ÷ negative is positive: ${n} ÷ (−${d}) = ${-q}.`,
              correct: true,
            },
            {
              text: "True. The answer takes the sign of the bigger number.",
              code: "NPV.NEGATIVE.SIGN-RULE",
            },
            {
              text: "True. Dividing always makes a number negative.",
              code: "NPV.NEGATIVE.SIGN-RULE",
            },
          ],
          solution: [{ say: `Signs the same → positive: ${-q}.` }],
        });
      }
      default: {
        const total = p.price * p.qty;
        const change = 5000 - total;
        return A.multiStepContext({
          context: `Tickets cost £${(p.price / 100).toFixed(2)} each. Asha buys ${p.qty} tickets and pays with a £50 note.`,
          parts: [
            {
              ask: "How much do the tickets cost altogether?",
              answer: A.number(total / 100, { units: "£" }),
              wrong: wrongs(total / 100, [
                {
                  code: "NPV.DECIMAL.POINT-PLACE",
                  value: A.number(total / 10, { units: "£" }),
                  feedback: "Check the size of the answer against an estimate.",
                },
              ]),
            },
            {
              ask: "How much change does she get?",
              answer: A.number(change / 100, { units: "£" }),
              wrong: signedWrongs(change / 100, [
                {
                  code: "AS.MULTISTEP.ONE-STEP",
                  value: A.number((5000 - p.price) / 100, { units: "£" }),
                  feedback: `Take off the cost of all ${p.qty} tickets.`,
                },
              ]),
            },
          ],
          solution: [
            { say: `£${(p.price / 100).toFixed(2)} × ${p.qty} = £${(total / 100).toFixed(2)}.` },
            { say: `£50 − £${(total / 100).toFixed(2)} = £${(change / 100).toFixed(2)}.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard" && question.parts[0]?.answer.type === "number")
      return Math.abs(numberAnswer(question) - (p.a / 10 ** p.ap) * (p.b / 10 ** p.bp)) < 1e-9;
    if (question.archetype === "multi-step-context")
      return (
        Math.abs(numberAnswer(question) * 100 - p.price * p.qty) < 1e-6 && p.price * p.qty < 5000
      );
    return true;
  },
});
