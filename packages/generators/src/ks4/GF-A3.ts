/**
 * @statement GF-A3
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-A3: Understand and use the concepts and vocabulary of expressions, equations, formulae,
// identities, inequalities, terms and factors
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

interface Params {
  item: number;
  pairs: number[];
  claim: number;
}

const WORDS = ["expression", "equation", "formula", "identity", "inequality"] as const;
const ITEMS: [string, (typeof WORDS)[number]][] = [
  ["3x + 2y - 5", "expression"],
  ["4x - 7 = 13", "equation"],
  ["A = \\pi r^2", "formula"],
  ["2(x + 3) \\equiv 2x + 6", "identity"],
  ["5x + 1 > 11", "inequality"],
  ["v = u + at", "formula"],
  ["x^2 - 9 = 0", "equation"],
  ["a + a \\equiv 2a", "identity"],
];
const CLAIMS: { text: string; truth: boolean; why: string }[] = [
  {
    text: "In 5x² − 3x + 2, the terms are 5x², −3x and 2.",
    truth: true,
    why: "Terms are separated by + and − signs, and each keeps the sign in front of it.",
  },
  {
    text: "3 and x are both factors of 3x.",
    truth: true,
    why: "3x = 3 × x, so 3 and x both divide it exactly.",
  },
  {
    text: "An equation and an identity are the same thing.",
    truth: false,
    why: "An equation is true for particular values; an identity is true for every value.",
  },
];

export default defineGenerator<Params>({
  id: "GF-A3",
  version: "1.0.0",
  depths: [1, 3, 4],
  misconceptions: ["ALG.VOCAB", "ALG.EQUATION.IDENTITY"],

  params(rng) {
    return {
      item: rng.int(0, ITEMS.length - 1),
      pairs: rng.shuffle([0, 1, 2, 3, 4]).slice(0, 4),
      claim: rng.int(0, CLAIMS.length - 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const [latex, word] = ITEMS[p.item] as (typeof ITEMS)[number];
        return A.choice({
          rng,
          question: [A.math(latex)],
          ask: "Which word describes this?",
          correct: word,
          distractors: WORDS.filter((w) => w !== word)
            .slice(0, 3)
            .map((w) => ({
              content: w,
              code: w === "identity" || word === "identity" ? "ALG.EQUATION.IDENTITY" : "ALG.VOCAB",
              feedback:
                "An expression has no = sign; an equation is true for some values; a formula links quantities; an identity (≡) is always true; an inequality uses < or >.",
            })),
          solution: [
            {
              say: `It is ${word === "expression" || word === "equation" || word === "identity" || word === "inequality" ? "an" : "a"} ${word}.`,
            },
          ],
        });
      }
      case 3:
        return A.matchRepresentations({
          rng,
          question: "Match each one to the word that describes it.",
          pairs: p.pairs.map((i) => {
            const [latex, word] = ITEMS[i] as (typeof ITEMS)[number];
            return [A.math(latex), word] as [A.RichInput, A.RichInput];
          }),
          solution: [
            {
              say: "Look for =, ≡, < or >, and whether the letters stand for quantities in a rule.",
            },
          ],
        });
      default: {
        const c = CLAIMS[p.claim] as (typeof CLAIMS)[number];
        return A.trueOrFalseWhy({
          rng,
          statement: `Raj says: "${c.text}"`,
          truth: c.truth,
          reasons: [
            { text: `${c.truth ? "True" : "False"}. ${c.why}`, correct: true },
            {
              text: `${c.truth ? "False" : "True"}. These words all mean the same.`,
              code: "ALG.VOCAB",
            },
            {
              text: `${c.truth ? "False" : "True"}. An identity is any equation with letters in it.`,
              code: "ALG.EQUATION.IDENTITY",
            },
          ],
          solution: [{ say: "Terms are added or subtracted; factors multiply." }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return chosenText(question) === (ITEMS[p.item] as (typeof ITEMS)[number])[1];
    return true;
  },
});
