/**
 * @statement GF-N9
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-N9: Calculate with and interpret standard form A × 10ⁿ, where 1 ≤ A < 10 and n is an integer
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

interface Params {
  a: number;
  m: number;
  b: number;
  n: number;
  small: number;
  places: number;
  claimBig: number;
  claimSmall: number;
}

const sf = (a: number, p: number) => `${a} \\times 10^{${p}}`;
/** a × 10^p normalised so 1 ≤ a < 10, with a kept to 2 decimal places. */
function normal(a: number, p: number): [number, number] {
  let x = a;
  let q = p;
  while (x >= 10) {
    x /= 10;
    q += 1;
  }
  while (x < 1) {
    x *= 10;
    q -= 1;
  }
  return [Math.round(x * 100) / 100, q];
}

export default defineGenerator<Params>({
  id: "GF-N9",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: [
    "NPV.STANDARD-FORM.INDEX-LAWS",
    "NPV.STANDARD-FORM.POWER",
    "NPV.STANDARD-FORM.COMPARE-FIRST",
  ],

  params(rng) {
    const a = rng.int(2, 9);
    const b = rng.int(2, 9);
    const m = rng.int(3, 8);
    const n = rng.int(2, 6);
    const small = rng.int(12, 98);
    if (small % 10 === 0) reject("two significant figures");
    const claimBig = rng.int(2, 9);
    const claimSmall = rng.int(2, 9);
    if (claimBig >= claimSmall) reject("a smaller first number on the larger power");
    return { a, m, b, n, small, places: rng.int(3, 6), claimBig, claimSmall };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const [x, q] = normal(p.a * p.b, p.m + p.n);
        const right = sf(x, q);
        return A.choice({
          rng,
          question: [
            "Work out ",
            A.math(`(${sf(p.a, p.m)}) \\times (${sf(p.b, p.n)})`),
            ". Give your answer in standard form.",
          ],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(sf(p.a * p.b, p.m + p.n)),
              ...(p.a * p.b >= 10 ? { code: "NPV.STANDARD-FORM.POWER" } : {}),
              feedback: "The first number must be at least 1 and less than 10.",
            },
            {
              content: A.math(sf(...normal(p.a * p.b, p.m * p.n))),
              code: "NPV.STANDARD-FORM.INDEX-LAWS",
              feedback: "Multiplying powers of 10: add the indices.",
            },
          ].filter(
            (d, i, all) =>
              JSON.stringify(d.content) !== JSON.stringify(A.math(right)) &&
              all.findIndex((e) => JSON.stringify(e.content) === JSON.stringify(d.content)) === i,
          ),
          solution: [
            {
              say: "Multiply the numbers and add the powers: ",
              math: `${p.a * p.b} \\times 10^{${p.m + p.n}} = ${right}`,
            },
          ],
        });
      }
      case 2: {
        const decimal = `0.${"0".repeat(p.places - 1)}${p.small}`;
        const right = sf(p.small / 10, -p.places);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["Write ", A.math(decimal), " in standard form."],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(sf(p.small / 10, -(p.places + 1))),
              code: "NPV.STANDARD-FORM.POWER",
              feedback: "Count how many places the point moves to give a number between 1 and 10.",
            },
            {
              content: A.math(sf(p.small / 10, p.places)),
              code: "NPV.STANDARD-FORM.POWER",
              feedback: "Numbers less than 1 have a negative power of 10.",
            },
            {
              content: A.math(sf(p.small, -(p.places + 1))),
              feedback: "The first number must be less than 10.",
            },
          ],
          solution: [
            {
              say: `Move the point ${p.places} places right to get ${p.small / 10}, so the power is −${p.places}: `,
              math: right,
            },
          ],
        });
      }
      case 4:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Ben says ",
            A.math(sf(p.claimSmall, 4)),
            " is bigger than ",
            A.math(sf(p.claimBig, 5)),
            ", because " + p.claimSmall + " is bigger than " + p.claimBig + ".",
          ],
          truth: false,
          reasons: [
            {
              text: `False. Compare the powers first: ${p.claimBig} × 10⁵ = ${(p.claimBig * 1e5).toLocaleString("en-GB")}, which is bigger than ${(p.claimSmall * 1e4).toLocaleString("en-GB")}.`,
              correct: true,
            },
            { text: "True. Compare the first numbers.", code: "NPV.STANDARD-FORM.COMPARE-FIRST" },
            {
              text: "True. The power does not change the size much.",
              code: "NPV.STANDARD-FORM.COMPARE-FIRST",
            },
          ],
          solution: [
            {
              say: "In standard form, a bigger power of 10 means a bigger number (when both are positive).",
            },
          ],
        });
      default: {
        const [x, q] = normal(p.a * p.b, p.m + p.n);
        return A.multiStepContext({
          context: [
            "A lorry carries ",
            A.math(sf(p.b, p.n)),
            " boxes. Each box holds ",
            A.math(sf(p.a, p.m)),
            " grains of rice.",
          ],
          parts: [
            {
              ask: "How many grains of rice does the lorry carry? Give your answer in standard form.",
              answer: A.exact(sf(x, q), "standard-form"),
              wrong: [
                {
                  code: "NPV.STANDARD-FORM.INDEX-LAWS",
                  value: A.exact(sf(...normal(p.a * p.b, p.m * p.n))),
                  feedback: "Add the powers of 10 when multiplying.",
                },
              ],
            },
            {
              ask: "How many grains is that in ordinary numbers, in millions? (1 million = 10⁶)",
              answer: A.number(Math.round(x * 10 ** (q - 6) * 1e6) / 1e6),
            },
          ],
          solution: [
            { say: "", math: `${sf(p.a, p.m)} \\times ${sf(p.b, p.n)} = ${sf(x, q)}` },
            { say: `${sf(x, q)} ÷ 10⁶ = ${Math.round(x * 10 ** (q - 6) * 1e6) / 1e6} million.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return chosenText(question) === sf(...normal(p.a * p.b, p.m + p.n));
    if (question.archetype === "varied-form")
      return chosenText(question) === sf(p.small / 10, -p.places);
    return true;
  },
});
