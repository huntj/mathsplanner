/**
 * @statement GF-R6
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-R6: Express a multiplicative relationship between two quantities as a ratio or a fraction
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  k: number;
  x: number;
  y: number;
}

const g = (a: number, b: number): number => (b === 0 ? a : g(b, a % b));

export default defineGenerator<Params>({
  id: "GF-R6",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.ORDER", "RAT.PART-WHOLE"],

  params(rng) {
    const x = rng.int(1, 8);
    const y = rng.int(2, 9);
    if (x === y || g(x, y) !== 1) reject("a ratio in its simplest form");
    return { k: rng.int(2, 7), x, y };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: `A tree is ${p.k} times as tall as a fence.`,
          ask: "What is the ratio of the height of the tree to the height of the fence?",
          correct: `${p.k} : 1`,
          distractors: [
            {
              content: `1 : ${p.k}`,
              code: "RAT.ORDER",
              feedback: "The tree comes first, and it is the taller.",
            },
            {
              content: `${p.k} : ${p.k + 1}`,
              code: "RAT.PART-WHOLE",
              feedback: "Compare the tree with the fence, not with both together.",
            },
          ],
          solution: [{ say: `For every 1 m of fence there are ${p.k} m of tree: ${p.k} : 1.` }],
        });
      case 2:
        return A.standard({
          question: ["The ratio a : b is ", A.math(`${p.x} : ${p.y}`), "."],
          ask: "Write a as a fraction of b.",
          answer: A.exact(frac(p.x, p.y)),
          wrong: [
            {
              code: "RAT.PART-WHOLE",
              value: A.exact(frac(p.x, p.x + p.y)),
              feedback: "a as a fraction of b is a ÷ b, not a ÷ (a + b).",
            },
          ],
          solution: [{ say: "", math: `\\frac{a}{b} = ${toLatex(frac(p.x, p.y))}` }],
        });
      default: {
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                "Red and blue beads are in the ratio ",
                A.math(`${p.x} : ${p.y}`),
                ". Tom says ",
                A.math(toLatex(frac(p.x, p.y))),
                " of the beads are red.",
              ],
              truth: false,
              reasons: [
                {
                  text: `False. For every ${p.x + p.y} beads, ${p.x} are red, so ${toLatex(frac(p.x, p.x + p.y)).replace(/\\frac\{(\d+)\}\{(\d+)\}/, "$1/$2")} are red. ${p.x}/${p.y} compares red with blue.`,
                  correct: true,
                },
                {
                  text: "True. The ratio and the fraction use the same numbers.",
                  code: "RAT.PART-WHOLE",
                },
                { text: `True. Red is ${p.x} out of ${p.y}.`, code: "RAT.PART-WHOLE" },
              ],
              solution: [
                {
                  say: "Part : part becomes a fraction of the whole by using the total of the parts as the denominator.",
                },
              ],
            }),
          [
            {
              statement:
                "Flour and sugar are mixed 3 : 1. Kim says there is 3 times as much flour as sugar.",
              truth: true,
              right: "True. For every 1 part sugar there are 3 parts flour.",
              wrong: [
                ["False. There is 2 more flour."],
                ["False. 3/4 is flour, so 0.75 times as much.", "RAT.PART-WHOLE"],
              ],
            },
            {
              claim: "The ratio a : b is the same as b : a.",
              truth: "sometimes",
              right: "Sometimes. Only when a = b; otherwise the order matters.",
              wrong: [
                ["Always. Order does not matter.", "RAT.ORDER"],
                ["Never. Even 2 : 2 changes."],
              ],
            },
            {
              statement:
                "Cats and dogs are in the ratio 2 : 5. Leo says there are more cats than dogs.",
              truth: false,
              right: "False. 2 parts cats and 5 parts dogs: more dogs.",
              wrong: [["True. Cats come first.", "RAT.ORDER"], ["True. 2 : 5 means cats win."]],
            },
          ],
        );
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard" && question.parts[0]?.answer.type === "choice")
      return chosenText(question) === `${p.k} : 1`;
    return true;
  },
});
