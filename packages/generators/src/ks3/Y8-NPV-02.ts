/**
 * @statement Y8-NPV-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y8-NPV-02: Appreciate the infinite nature of the sets of integers, real and rational numbers
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, gcd, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  /** Decimals lo and lo + 10^-places, as whole numbers of 10^-places. */
  lo: number;
  places: number;
  /** Fractions a/n and (a + 1)/n, with n prime so both are in simplest form. */
  a: number;
  n: number;
  claim: number;
}

const dec = (k: number, places: number) =>
  (k / 10 ** places).toFixed(places).replace(/0+$/, "").replace(/\.$/, "");
const fracTex = (a: number, n: number) => `\\frac{${a}}{${n}}`;
/** a/n in its simplest form. */
const simplest = (a: number, n: number) => {
  const g = Number(gcd(BigInt(a), BigInt(n)));
  return fracTex(a / g, n / g);
};

export default defineGenerator<Params>({
  id: "Y8-NPV-02",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.INFINITE.NOTHING-BETWEEN"],

  params(rng, numbers) {
    const places = numbers === "friendly" ? 1 : numbers === "standard" ? 2 : 3;
    const lo = rng.int(10 ** (places - 1) + 1, 10 ** places - 2);
    if (lo % 10 === 0 && places > 1) reject("the smaller decimal should use every place");
    const n = rng.pick(
      numbers === "friendly" ? [5, 7] : numbers === "standard" ? [5, 7, 11] : [7, 11, 13],
    );
    // a + 2 < n keeps the "bigger" distractor a proper fraction.
    return { lo, places, a: rng.int(1, n - 3), n, claim: rng.int(0, 2) };
  },

  build(p, depth, rng): QuestionDraft {
    const [x, y] = [dec(p.lo, p.places), dec(p.lo + 1, p.places)];
    const mid = dec(10 * p.lo + 5, p.places + 1);
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "Write down the number exactly halfway between ",
            A.math(x),
            " and ",
            A.math(y),
            ".",
          ],
          answer: A.number(Number(mid)),
          solution: [
            {
              say: `Write both with one more decimal place: ${dec(10 * p.lo, p.places + 1).padEnd(p.places + 3, "0")} and ${dec(10 * p.lo + 10, p.places + 1).padEnd(p.places + 3, "0")}.`,
            },
            {
              say: `Halfway between them is ${mid}. There is always another number between two different decimals.`,
            },
          ],
        });
      case 2: {
        const [a, b] = [fracTex(p.a, p.n), fracTex(p.a + 1, p.n)];
        const between = simplest(2 * p.a + 1, 2 * p.n);
        const smaller = simplest(p.a, p.n + 1);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["Which of these is between ", A.math(a), " and ", A.math(b), "?"],
          correct: A.math(between),
          distractors: [
            {
              content: "There is no number between them.",
              code: "NPV.INFINITE.NOTHING-BETWEEN",
              feedback: [
                "Write them as ",
                A.math(fracTex(2 * p.a, 2 * p.n)),
                " and ",
                A.math(fracTex(2 * p.a + 2, 2 * p.n)),
                ": ",
                A.math(between),
                " is between them.",
              ],
            },
            {
              content: A.math(smaller),
              feedback: [A.math(smaller), " is smaller than ", A.math(a), "."],
            },
            {
              content: A.math(fracTex(p.a + 2, p.n)),
              feedback: [A.math(fracTex(p.a + 2, p.n)), " is bigger than ", A.math(b), "."],
            },
          ],
          solution: [
            {
              say: "Double the numerators and denominators:",
              math: `${a} = ${fracTex(2 * p.a, 2 * p.n)}, \\quad ${b} = ${fracTex(2 * p.a + 2, 2 * p.n)}`,
            },
            { say: "So", math: `${between}\\text{ is between them.}` },
          ],
        });
      }
      default: {
        const claims = [
          {
            statement: ["There are no numbers between ", A.math(x), " and ", A.math(y), "."],
            truth: false,
            reasons: [
              {
                text: `False. ${mid} is between them, and so are infinitely many more.`,
                correct: true,
              },
              {
                text: `True: ${y} comes straight after ${x}.`,
                code: "NPV.INFINITE.NOTHING-BETWEEN",
              },
              { text: "True: only whole numbers can go between decimals." },
            ],
          },
          {
            statement: "There is a largest whole number.",
            truth: false,
            reasons: [
              {
                text: "False. Whatever number you choose, adding 1 makes a bigger one.",
                correct: true,
              },
              { text: "True: a number with a hundred digits is as big as numbers go." },
              { text: "True: eventually you run out of digits." },
            ],
          },
          {
            statement: [
              "There are infinitely many fractions between ",
              A.math(fracTex(p.a, p.n)),
              " and ",
              A.math(fracTex(p.a + 1, p.n)),
              ".",
            ],
            truth: true,
            reasons: [
              {
                text: "True. Halfway between any two fractions is another fraction, and you can keep halving for ever.",
                correct: true,
              },
              {
                text: "False: they are next to each other, so there is nothing between them.",
                code: "NPV.INFINITE.NOTHING-BETWEEN",
              },
              { text: "False: there are only a few, with denominators up to 100." },
            ],
          },
        ];
        const c = claims[p.claim] ?? claims[0];
        if (!c) return reject("no claim");
        return A.trueOrFalseWhy({
          rng,
          statement: c.statement,
          truth: c.truth,
          reasons: c.reasons,
          solution: [{ say: c.reasons[0]?.text ?? "" }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") {
      const v = numberAnswer(question);
      return Math.abs(v - (p.lo + 0.5) / 10 ** p.places) < 1e-12;
    }
    if (question.archetype === "varied-form") {
      const m = /^\\frac\{(\d+)\}\{(\d+)\}$/.exec(chosenText(question));
      if (!m) return false;
      const v = Number(m[1]) / Number(m[2]);
      return v > p.a / p.n && v < (p.a + 1) / p.n;
    }
    return true;
  },
});
