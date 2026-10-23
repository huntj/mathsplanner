/**
 * @statement GH-P9.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GH-P9.b: Find conditional probabilities from tree diagrams
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, toLatex, type QuestionDraft } from "@mathsplanner/core";
import type { TreeSpec } from "@mathsplanner/diagrams";
import { exactAnswer } from "../shared/counting.ts";
import { fracTex } from "../shared/fr.ts";
import { txt } from "../shared/sta.ts";

export interface Params {
  r: number;
  b: number;
}

function tree(r: number, b: number): TreeSpec {
  const n = r + b;
  return {
    type: "probability",
    kind: "tree",
    branches: [
      {
        label: fracTex(r, n),
        outcome: txt("red"),
        children: [
          { label: fracTex(r - 1, n - 1), outcome: txt("red") },
          { label: fracTex(b, n - 1), outcome: txt("blue") },
        ],
      },
      {
        label: fracTex(b, n),
        outcome: txt("blue"),
        children: [
          { label: fracTex(r, n - 1), outcome: txt("red") },
          { label: fracTex(b - 1, n - 1), outcome: txt("blue") },
        ],
      },
    ],
    description: "A tree diagram for taking two counters from a bag without replacement.",
  };
}

export default defineGenerator<Params>({
  id: "GH-P9.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.TREE.REPLACEMENT", "PRO.CONDITIONAL.TOTAL"],

  params(rng) {
    return { r: rng.int(3, 8), b: rng.int(2, 7) };
  },

  build(p, depth, rng): QuestionDraft {
    const n = p.r + p.b;
    switch (depth) {
      case 1: {
        const v = frac(p.r - 1, n - 1);
        return A.standard({
          question: [
            `A bag has ${p.r} red and ${p.b} blue counters. Two are taken without replacement.`,
          ],
          ask: "Given that the first counter is red, find the probability that the second is red.",
          answer: A.exact(v),
          wrong: [
            {
              code: "PRO.TREE.REPLACEMENT",
              value: A.exact(frac(p.r, n)),
              feedback: `One red has gone: ${p.r - 1} reds are left out of ${n - 1}.`,
            },
          ],
          solution: [
            { say: "", math: `P(\\text{red second} \\mid \\text{red first}) = ${toLatex(v)}` },
          ],
        });
      }
      case 2: {
        const same = p.r * (p.r - 1) + p.b * (p.b - 1);
        const v = frac(p.r * (p.r - 1), same);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "The tree diagram shows two counters being taken from a bag.",
                A.figure(tree(p.r, p.b)),
              ],
              ask: "Given that the two counters are the same colour, find the probability that they are both red.",
            },
          ],
          answer: A.exact(v),
          wrong: [
            {
              code: "PRO.CONDITIONAL.TOTAL",
              value: A.exact(frac(p.r * (p.r - 1), n * (n - 1))),
              feedback: "That is P(both red). Divide by P(same colour), since you know they match.",
            },
          ],
          solution: [
            {
              say: "",
              math: `\\frac{P(RR)}{P(RR) + P(BB)} = \\frac{${p.r * (p.r - 1)}}{${same}} = ${toLatex(v)}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Ana says the probabilities on the second set of branches of a tree diagram are conditional probabilities.",
          ],
          truth: true,
          reasons: [
            {
              text: "True. Each second branch gives the probability of the second event, given what happened on the first branch.",
              correct: true,
            },
            {
              text: "False. They are the same as the first branches.",
              code: "PRO.TREE.REPLACEMENT",
            },
            {
              text: "False. Conditional probabilities need a two-way table.",
              code: "PRO.CONDITIONAL.TOTAL",
            },
          ],
          solution: [
            {
              say: "When the events are independent, the conditional probabilities just happen to equal the first ones.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    const n = p.r + p.b;
    if (question.key.depth === 1) return exactAnswer(question) === toLatex(frac(p.r - 1, n - 1));
    if (question.key.depth === 2)
      return (
        exactAnswer(question) === toLatex(frac(p.r * (p.r - 1), p.r * (p.r - 1) + p.b * (p.b - 1)))
      );
    return true;
  },
});
