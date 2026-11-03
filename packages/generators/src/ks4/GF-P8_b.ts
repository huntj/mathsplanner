/**
 * @statement GF-P8.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-P8.b: Calculate probabilities of dependent combined events
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { exactAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  r: number;
  b: number;
}

export default defineGenerator<Params>({
  id: "GF-P8.b",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.TREE.REPLACEMENT"],

  params(rng) {
    return { r: rng.int(3, 9), b: rng.int(2, 8) };
  },

  build(p, depth, rng): QuestionDraft {
    const n = p.r + p.b;
    const f = (a: number, c: number) => `\\frac{${a}}{${c}}`;
    switch (depth) {
      case 1: {
        const v = frac(p.r * (p.r - 1), n * (n - 1));
        return A.standard({
          question: [
            `A bag has ${p.r} red and ${p.b} blue counters. Two are taken at random, without replacement.`,
          ],
          ask: "Find the probability that both are red.",
          answer: A.exact(v),
          wrong: [
            {
              code: "PRO.TREE.REPLACEMENT",
              value: A.exact(frac(p.r * p.r, n * n)),
              feedback: `After a red is taken there are ${p.r - 1} reds left out of ${n - 1}.`,
            },
          ],
          solution: [
            { say: "", math: `${f(p.r, n)} \\times ${f(p.r - 1, n - 1)} = ${toLatex(v)}` },
          ],
        });
      }
      case 2: {
        const v = frac(2 * p.r * p.b, n * (n - 1));
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `A bag has ${p.r} red and ${p.b} blue counters. Two are taken at random, without replacement.`,
              ],
              ask: "Find the probability that they are different colours.",
            },
            {
              question: [
                `A drawer holds ${p.r} black socks and ${p.b} white socks. Two socks are taken at random.`,
              ],
              ask: "Find the probability that they do not match.",
            },
          ],
          answer: A.exact(v),
          wrong: [
            {
              code: "PRO.TREE.REPLACEMENT",
              value: A.exact(frac(2 * p.r * p.b, n * n)),
              feedback: `The second item comes from ${n - 1}, not ${n}.`,
            },
          ],
          solution: [
            {
              say: "Two paths: first one colour then the other, or the other way round: ",
              math: `2 \\times ${f(p.r, n)} \\times ${f(p.b, n - 1)} = ${toLatex(v)}`,
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
                "When the first counter is not replaced, the second branches of the tree have the same probabilities as the first.",
              ],
              truth: "never",
              reasons: [
                {
                  text: `Never. Taking one counter changes what is left: there are ${n - 1} counters for the second pick, not ${n}.`,
                  correct: true,
                },
                { text: "Always. The bag is the same bag.", code: "PRO.TREE.REPLACEMENT" },
                {
                  text: "Sometimes. Only if the first counter was red.",
                  code: "PRO.TREE.REPLACEMENT",
                },
              ],
              solution: [{ say: "Without replacement, the events are dependent." }],
            }),
          [
            {
              statement:
                "A bag has 3 red and 2 blue. One is taken and not replaced. Bea says P(red then red) is $\\frac{3}{5} \\times \\frac{2}{4}$.",
              truth: true,
              right: "True. After one red goes, 2 reds remain of 4.",
              wrong: [
                ["False. It is 3/5 × 3/5.", "PRO.TREE.REPLACEMENT"],
                ["False. It is 3/5 + 2/4.", "PRO.TREE.REPLACEMENT"],
              ],
            },
            {
              claim: "With replacement, the probabilities on the second branches match the first.",
              truth: "always",
              right: "Always. The bag is the same for the second pick.",
              wrong: [
                ["Never. They change.", "PRO.TREE.REPLACEMENT"],
                ["Sometimes. Only for even numbers of counters."],
              ],
            },
            {
              statement:
                "A bag has 4 green and 6 yellow. Without replacement, Kim says P(green second, after green first) is $\\frac{4}{10}$.",
              truth: false,
              right: "False. One green has gone: 3 green of 9 left, so 3/9.",
              wrong: [
                ["True. The bag starts with 4 of 10.", "PRO.TREE.REPLACEMENT"],
                ["True. Probabilities stay the same.", "PRO.TREE.REPLACEMENT"],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    const n = p.r + p.b;
    if (question.key.depth === 1)
      return exactAnswer(question) === toLatex(frac(p.r * (p.r - 1), n * (n - 1)));
    if (question.key.depth === 2)
      return exactAnswer(question) === toLatex(frac(2 * p.r * p.b, n * (n - 1)));
    return true;
  },
});
