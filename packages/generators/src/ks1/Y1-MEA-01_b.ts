/**
 * @statement Y1-MEA-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y1-MEA-01.b: Compare and solve problems with mass
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

const ITEMS = ["apple", "toy car", "shoe", "book", "orange"];

interface Params {
  a: number;
  b: number;
  items: [string, string, string];
}

export default defineGenerator<Params>({
  id: "Y1-MEA-01.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["AS.PROBLEM.KEYWORD", "MEA.SEQUENCE.ORDER", "MEA.COMPARE.LOOKS"],

  params(rng, numbers) {
    const top = numbers === "friendly" ? 10 : 20;
    const p = {
      a: rng.int(4, top),
      b: rng.int(2, top),
      items: rng.shuffle([...ITEMS]).slice(0, 3) as [string, string, string],
    };
    if (p.a <= p.b) reject("a heavier first object");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const [x, y, z] = p.items;
    switch (depth) {
      case 1:
        return A.standard({
          question: `A ${x} balances ${p.a} cubes. A ${y} balances ${p.b} cubes.`,
          ask: `How many cubes heavier is the ${x}?`,
          answer: A.number(p.a - p.b),
          wrong: wrongs(p.a - p.b, [
            {
              code: "AS.PROBLEM.KEYWORD",
              value: A.number(p.a + p.b),
              feedback: `"Heavier" asks for the difference: ${p.a} − ${p.b}.`,
            },
          ]),
          solution: [
            { say: `${p.a} − ${p.b} = ${p.a - p.b}, so the ${x} is ${p.a - p.b} cubes heavier.` },
          ],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `The ${x} is heavier than the ${y}. The ${y} is heavier than the ${z}.`,
          ask: "Which is the lightest?",
          correct: `The ${z}`,
          distractors: [
            {
              content: `The ${x}`,
              code: "MEA.SEQUENCE.ORDER",
              feedback: `The ${x} is the heaviest of the three.`,
            },
            { content: `The ${y}`, feedback: `The ${y} is heavier than the ${z}.` },
          ],
          solution: [{ say: `From heaviest to lightest: ${x}, ${y}, ${z}.` }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `On a balance, the side with the ${x} goes down and the side with the ${y} goes up. Raj says the ${y} is heavier because it is higher.`,
          truth: false,
          reasons: [
            { text: `False. The heavier side goes down, so the ${x} is heavier.`, correct: true },
            { text: "True. The higher side is always heavier.", code: "MEA.COMPARE.LOOKS" },
            { text: `True. The ${y} is bigger.`, code: "MEA.COMPARE.LOOKS" },
          ],
          solution: [{ say: "On a balance the heavier side goes down." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.a - p.b;
    if (question.key.depth === 2) return chosenText(question) === `The ${p.items[2]}`;
    return true;
  },
});
