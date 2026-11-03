/**
 * @statement GF-P6.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-P6.a: Enumerate using tables and grids
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { exactAnswer, numberAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  dice: number;
  spinner: number;
  total: number;
}

const ways = (s: number) => 6 - Math.abs(s - 7);

export default defineGenerator<Params>({
  id: "GF-P6.a",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.ENUMERATE", "PRO.SAMPLE-SPACE.EQUAL-TOTALS"],

  params(rng) {
    const p = { dice: rng.pick([4, 6, 8, 10]), spinner: rng.int(3, 7), total: rng.int(3, 11) };
    if (p.dice === p.spinner) reject("two different-sized sample spaces");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = p.dice * p.spinner;
        return A.standard({
          question: [
            `A fair ${p.dice}-sided dice is rolled and a fair spinner with ${p.spinner} equal sections is spun. The results are shown in a sample space grid.`,
          ],
          ask: "How many outcomes are in the grid?",
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "PRO.ENUMERATE",
              value: A.number(p.dice + p.spinner),
              feedback: `Each of the ${p.dice} dice scores goes with each of the ${p.spinner} spinner results: multiply.`,
            },
          ]),
          solution: [{ say: "", math: `${p.dice} \\times ${p.spinner} = ${v}` }],
        });
      }
      case 2: {
        const v = frac(ways(p.total), 36);
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["Two fair six-sided dice are rolled and their scores added."],
              ask: `Find the probability that the total is ${p.total}.`,
            },
            {
              question: [
                "Zak rolls two ordinary dice and adds the scores. He draws a sample space grid.",
              ],
              ask: `What is the probability of a total of ${p.total}?`,
            },
          ],
          answer: A.exact(v),
          wrong: [
            {
              code: "PRO.SAMPLE-SPACE.EQUAL-TOTALS",
              value: A.exact(frac(1, 11)),
              feedback: "The 11 totals are not equally likely. Count the cells in the 6 by 6 grid.",
            },
          ],
          solution: [
            { say: `${ways(p.total)} of the 36 cells give ${p.total}: `, math: toLatex(v) },
          ],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                "Mia says a total of 2 and a total of 7 are equally likely when two dice are rolled.",
              ],
              truth: false,
              reasons: [
                {
                  text: "False. Only 1 + 1 makes 2, but six pairs make 7, so P(7) = 6/36 and P(2) = 1/36.",
                  correct: true,
                },
                {
                  text: "True. Each total is one of the 11 possible outcomes.",
                  code: "PRO.SAMPLE-SPACE.EQUAL-TOTALS",
                },
                {
                  text: "True. Dice are fair, so every total is equally likely.",
                  code: "PRO.SAMPLE-SPACE.EQUAL-TOTALS",
                },
              ],
              solution: [{ say: "A sample space grid shows all 36 equally likely outcomes." }],
            }),
          [
            {
              statement: "Two dice are rolled. Ana says a total of 7 is the most likely total.",
              truth: true,
              right: "True. 7 can be made 6 ways out of 36.",
              wrong: [
                ["False. All totals are equally likely.", "PRO.SAMPLE-SPACE.EQUAL-TOTALS"],
                ["False. 12 is most likely."],
              ],
            },
            {
              claim: "A sample space diagram for two dice has 36 equally likely outcomes.",
              truth: "always",
              right: "Always. 6 outcomes for each dice: 6 × 6.",
              wrong: [
                ["Never. It has 12.", "PRO.ENUMERATE"],
                ["Sometimes. Only if the dice are fair and the same colour."],
              ],
            },
            {
              statement: "Two dice are rolled. Gus says P(total of 3) is $\\frac{1}{11}$.",
              truth: false,
              right: "False. A total of 3 comes from (1, 2) and (2, 1): 2/36 = 1/18.",
              wrong: [
                ["True. There are 11 possible totals.", "PRO.SAMPLE-SPACE.EQUAL-TOTALS"],
                ["True. Each total is equally likely.", "PRO.SAMPLE-SPACE.EQUAL-TOTALS"],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.dice * p.spinner;
    if (question.key.depth === 2) return exactAnswer(question) === toLatex(frac(ways(p.total), 36));
    return true;
  },
});
