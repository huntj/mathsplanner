/**
 * @statement CM-P3
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// CM-P3: Calculate probabilities of independent and dependent combined events, with and without
// replacement, using tree and Venn diagrams and the sum and product laws
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { exactAnswer } from "../shared/counting.ts";

export interface Params {
  r: number;
  b: number;
}

const both = (p: Params) => toLatex(frac(p.r * (p.r - 1), (p.r + p.b) * (p.r + p.b - 1)));
const mixed = (p: Params) => toLatex(frac(2 * p.r * p.b, (p.r + p.b) * (p.r + p.b - 1)));

export default defineGenerator<Params>({
  id: "CM-P3",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.TREE.REPLACEMENT", "PRO.ENUMERATE", "PRO.TREE.ADD-ALONG"],

  params(rng) {
    return { r: rng.int(3, 8), b: rng.int(2, 7) };
  },

  build(p, depth, rng): QuestionDraft {
    const n = p.r + p.b;
    const intro = `A bag holds ${p.r} red counters and ${p.b} blue counters. Two counters are taken at random, without replacement.`;
    switch (depth) {
      case 1:
        return A.standard({
          question: [intro],
          ask: "Find the probability that both counters are red.",
          answer: A.exact(both(p)),
          wrong: [
            {
              code: "PRO.TREE.REPLACEMENT",
              value: A.exact(toLatex(frac(p.r * p.r, n * n))),
              feedback: `After one red is taken, ${p.r - 1} reds are left out of ${n - 1}.`,
            },
          ],
          solution: [
            {
              say: "",
              math: `\\frac{${p.r}}{${n}} \\times \\frac{${p.r - 1}}{${n - 1}} = ${both(p)}`,
            },
          ],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: [intro],
              ask: "Find the probability that the counters are different colours.",
            },
          ],
          answer: A.exact(mixed(p)),
          wrong: [
            {
              code: "PRO.ENUMERATE",
              value: A.exact(toLatex(frac(p.r * p.b, n * (n - 1)))),
              feedback: "Red then blue, or blue then red: add both branches.",
            },
          ],
          solution: [
            {
              say: "",
              math: `\\frac{${p.r}}{${n}} \\times \\frac{${p.b}}{${n - 1}} + \\frac{${p.b}}{${n}} \\times \\frac{${p.r}}{${n - 1}} = ${mixed(p)}`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Tess says the probability of red then blue is ${p.r}/${n} + ${p.b}/${n - 1}, adding along the branches.`,
          ],
          truth: false,
          reasons: [
            {
              text: "False. To find the probability of one event and then another, multiply along the branches. Add only when combining different paths.",
              correct: true,
            },
            {
              text: "True. You add probabilities along a tree diagram.",
              code: "PRO.TREE.ADD-ALONG",
            },
            { text: "True. 'And' means add.", code: "PRO.TREE.ADD-ALONG" },
          ],
          solution: [{ say: `P(red then blue) = ${p.r}/${n} × ${p.b}/${n - 1}.` }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return exactAnswer(question) === both(p);
    if (question.key.depth === 2) return exactAnswer(question) === mixed(p);
    return true;
  },
});
