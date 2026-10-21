/**
 * @statement GF-N5
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-N5: Apply systematic listing strategies
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  starters: number;
  mains: number;
  desserts: number;
  letters: number;
  people: number;
  claimOrdered: boolean;
}

const fact = (n: number): number => (n <= 1 ? 1 : n * fact(n - 1));
const pairs = (n: number) => (n * (n - 1)) / 2;

export default defineGenerator<Params>({
  id: "GF-N5",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.LISTING.INCOMPLETE", "MD.MULTIPLY.ADDS"],

  params(rng, numbers) {
    return {
      starters: rng.int(2, 4),
      mains: rng.int(3, numbers === "friendly" ? 4 : 6),
      desserts: rng.int(2, 4),
      letters: rng.int(3, numbers === "friendly" ? 3 : 4),
      people: rng.int(4, 6),
      claimOrdered: rng.bool(),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const n = p.starters * p.mains * p.desserts;
        return A.standard({
          question: `A café menu has ${p.starters} starters, ${p.mains} main courses and ${p.desserts} desserts. A meal is one starter, one main and one dessert.`,
          ask: "How many different meals are possible?",
          answer: A.number(n),
          wrong: wrongs(n, [
            {
              code: "MD.MULTIPLY.ADDS",
              value: A.number(p.starters + p.mains + p.desserts),
              feedback: `Each of the ${p.starters} starters can go with every main, and each of those with every dessert: multiply.`,
            },
          ]),
          solution: [{ say: `${p.starters} × ${p.mains} × ${p.desserts} = ${n} meals.` }],
        });
      }
      case 2: {
        const letters = "ABCD".slice(0, p.letters).split("");
        const n = fact(p.letters);
        return A.standard({
          question: `The letters ${letters.join(", ")} are arranged in a row, using each letter once.`,
          ask: "How many different arrangements are there?",
          answer: A.number(n),
          wrong: wrongs(n, [
            {
              code: "NPV.LISTING.INCOMPLETE",
              value: A.number(p.letters),
              feedback:
                "List them systematically: fix the first letter, then list the orders of the rest.",
            },
            {
              code: "NPV.LISTING.INCOMPLETE",
              value: A.number(p.letters * (p.letters - 1)),
              feedback:
                "After choosing the first two letters there are still choices for the rest.",
            },
          ]),
          solution: [
            {
              say: `${letters[0]} first gives ${fact(p.letters - 1)} orders of the others; there are ${p.letters} choices of first letter: ${p.letters} × ${fact(p.letters - 1)} = ${n}.`,
            },
          ],
        });
      }
      default: {
        const right = pairs(p.people);
        const said = p.claimOrdered ? p.people * (p.people - 1) : right;
        return A.trueOrFalseWhy({
          rng,
          statement: `${p.people} friends each shake hands once with every other friend. Kit says there are ${said} handshakes.`,
          truth: !p.claimOrdered,
          reasons: p.claimOrdered
            ? [
                {
                  text: `False. That counts each handshake twice (A with B and B with A). There are ${said} ÷ 2 = ${right}.`,
                  correct: true,
                },
                {
                  text: `True. Each of the ${p.people} people shakes ${p.people - 1} hands.`,
                  code: "NPV.LISTING.INCOMPLETE",
                },
                {
                  text: `True. ${p.people} × ${p.people - 1} counts every pair.`,
                  code: "NPV.LISTING.INCOMPLETE",
                },
              ]
            : [
                {
                  text: `True. Listing systematically: the first person shakes ${p.people - 1} hands, the next ${p.people - 2} new ones, and so on: ${Array.from({ length: p.people - 1 }, (_, i) => p.people - 1 - i).join(" + ")} = ${right}.`,
                  correct: true,
                },
                {
                  text: `False. There are ${p.people * (p.people - 1)}, because each person shakes ${p.people - 1} hands.`,
                  code: "NPV.LISTING.INCOMPLETE",
                },
                { text: `False. There are ${p.people}, one each.`, code: "NPV.LISTING.INCOMPLETE" },
              ],
          solution: [
            {
              say: `${Array.from({ length: p.people - 1 }, (_, i) => p.people - 1 - i).join(" + ")} = ${right} handshakes.`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype !== "standard") return true;
    const n = numberAnswer(question);
    return n === p.starters * p.mains * p.desserts || n === fact(p.letters);
  },
});
