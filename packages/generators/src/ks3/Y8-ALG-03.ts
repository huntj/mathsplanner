/**
 * @statement Y8-ALG-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y8-ALG-03: Model situations or procedures by translating them into algebraic expressions or
// formulae and by using graphs
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  fixed: number;
  rate: number;
  /** Rectangle length x + k by width x. */
  k: number;
  claimTrue: boolean;
}

export default defineGenerator<Params>({
  id: "Y8-ALG-03",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.LINE.M-C", "ALG.LIKE-TERMS.UNLIKE"],

  params(rng, numbers) {
    const fixed = rng.int(2, numbers === "friendly" ? 5 : 12);
    const rate = rng.int(2, numbers === "friendly" ? 4 : 9);
    if (fixed === rate) reject("different numbers");
    return { fixed, rate, k: rng.int(1, 9), claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: `A taxi charges a fixed £${p.fixed} plus £${p.rate} for every mile.`,
          ask: "Which formula gives the cost C, in pounds, for m miles?",
          correct: A.math(`C = ${p.fixed} + ${p.rate}m`),
          distractors: [
            {
              content: A.math(`C = ${p.rate} + ${p.fixed}m`),
              code: "ALG.LINE.M-C",
              feedback: `£${p.rate} is charged for each mile, so it multiplies m. £${p.fixed} is fixed.`,
            },
            {
              content: A.math(`C = ${p.fixed + p.rate}m`),
              code: "ALG.LIKE-TERMS.UNLIKE",
              feedback: `The £${p.fixed} is paid once, not for every mile.`,
            },
            {
              content: A.math(`C = ${p.fixed}m + ${p.rate}m`),
              feedback: "Only the cost per mile depends on m.",
            },
          ],
          solution: [
            {
              say: `Fixed charge plus ${p.rate} for each of m miles: C = ${p.fixed} + ${p.rate}m.`,
            },
          ],
        });
      case 2:
        return A.standard({
          question: [
            "A rectangle has length ",
            A.math(`x + ${p.k}`),
            " cm and width ",
            A.math("x"),
            " cm.",
          ],
          ask: "Write a simplified expression for its perimeter, in centimetres.",
          answer: A.exact(`4x + ${2 * p.k}`),
          wrong: [
            {
              code: "ALG.LIKE-TERMS.UNLIKE",
              value: A.exact(`${4 + 2 * p.k}x`),
              feedback: `The ${2 * p.k} is a number and the 4x is an x term: they are not like terms.`,
            },
          ],
          solution: [
            { say: `Perimeter = 2 × length + 2 × width = 2(x + ${p.k}) + 2x = 4x + ${2 * p.k}.` },
          ],
        });
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                "The cost of a taxi is ",
                A.math(`C = ${p.fixed} + ${p.rate}m`),
                `. Ada says the graph of C against m is a straight line that crosses the C axis at ${p.claimTrue ? p.fixed : p.rate}.`,
              ],
              truth: p.claimTrue,
              reasons: p.claimTrue
                ? [
                    {
                      text: `True. When m = 0, C = ${p.fixed}: the fixed charge is the intercept. The cost rises by ${p.rate} for each mile, so the graph is a straight line.`,
                      correct: true,
                    },
                    {
                      text: `False. It crosses at ${p.rate}, the number in front of m.`,
                      code: "ALG.LINE.M-C",
                    },
                    { text: "False. Cost graphs are always curves." },
                  ]
                : [
                    {
                      text: `False. When m = 0, C = ${p.fixed}, so it crosses at ${p.fixed}. ${p.rate} is the gradient: the cost per mile.`,
                      correct: true,
                    },
                    {
                      text: `True. The number in front of m is where the line starts.`,
                      code: "ALG.LINE.M-C",
                    },
                    { text: "True. Every line crosses at the biggest number in its formula." },
                  ],
              solution: [
                { say: `C = ${p.fixed} + ${p.rate}m: intercept ${p.fixed}, gradient ${p.rate}.` },
              ],
            }),
          [
            {
              statement:
                "Pens cost £p each and a pad costs £3. Ali says 4 pens and a pad cost $4p + 3$ pounds.",
              truth: true,
              right: "True. 4 pens cost 4p pounds, and the pad adds 3.",
              wrong: [
                ["False. It is 7p, collecting 4p and 3.", "ALG.LIKE-TERMS.UNLIKE"],
                ["False. It is 4(p + 3)."],
              ],
            },
            {
              statement:
                "A gym charges a £20 joining fee and then £15 a month. Zara writes the cost for m months as $C = 20m + 15$.",
              truth: false,
              right: "False. The £15 is paid every month, so it goes with m: C = 15m + 20.",
              wrong: [
                ["True. The bigger number goes with m.", "ALG.LINE.M-C"],
                ["True. The order of the numbers does not matter."],
              ],
            },
            {
              claim: "When n is a whole number, $2n + 1$ is odd.",
              truth: "always",
              right: "Always. 2n is even, and one more than an even number is odd.",
              wrong: [["Sometimes. Only when n is odd."], ["Never. The 2 makes it even."]],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.archetype === "standard" && question.parts[0]?.answer.type === "choice")
      return chosenText(question) === `C = ${p.fixed} + ${p.rate}m`;
    const a = question.parts[0]?.answer;
    if (a?.type === "exact") return a.value === `4x + ${2 * p.k}`;
    return true;
  },
});
