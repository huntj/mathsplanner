/**
 * @statement R-MEA-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the early years sub-statements
 */
// R-MEA-01.b: Compare weights
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

const THINGS = ["apples", "bricks", "books", "shoes"];

interface Params {
  thing: number;
  a: number;
  b: number;
}

export default defineGenerator<Params>({
  id: "R-MEA-01.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MEA.COMPARE.LOOKS"],

  params(rng) {
    const p = { thing: rng.int(0, THINGS.length - 1), a: rng.int(1, 6), b: rng.int(1, 6) };
    if (p.a === p.b) reject("different amounts");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const thing = THINGS[p.thing] ?? "apples";
    switch (depth) {
      case 1: {
        const heavier = p.a > p.b ? "The bag with " + p.a : "The bag with " + p.b;
        return A.choice({
          rng,
          question: [
            `One bag has ${p.a} ${thing} in it. Another bag has ${p.b} of the same ${thing}.`,
          ],
          ask: "Which bag is heavier?",
          correct: heavier,
          distractors: [
            {
              content: p.a > p.b ? "The bag with " + p.b : "The bag with " + p.a,
              code: "MEA.COMPARE.LOOKS",
              feedback: "More of the same things weigh more.",
            },
            { content: "They weigh the same", feedback: "One bag has more in it." },
          ],
          solution: [{ say: `${heavier} ${thing} is heavier, because it has more of them.` }],
        });
      }
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            `A balance is level. One side has ${p.a} cubes. The other side has a toy car.`,
          ],
          ask: "Which is true?",
          correct: `The car weighs the same as ${p.a} cubes`,
          distractors: [
            {
              content: `The car is heavier than ${p.a} cubes`,
              code: "MEA.COMPARE.LOOKS",
              feedback: "If the car were heavier, its side would go down.",
            },
            {
              content: `The car is lighter than ${p.a} cubes`,
              code: "MEA.COMPARE.LOOKS",
              feedback: "If the car were lighter, its side would go up.",
            },
          ],
          solution: [{ say: "A level balance means the two sides weigh the same." }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: "Mia says the side of a balance that goes up is the heavier side.",
          truth: false,
          reasons: [
            { text: "False. The heavier side goes down; the lighter side goes up.", correct: true },
            { text: "True. Heavy things rise.", code: "MEA.COMPARE.LOOKS" },
            { text: "True. Up means more.", code: "MEA.COMPARE.LOOKS" },
          ],
          solution: [{ say: "Heavier down, lighter up, level means the same." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return chosenText(question) === "The bag with " + Math.max(p.a, p.b);
    if (question.key.depth === 2)
      return chosenText(question) === `The car weighs the same as ${p.a} cubes`;
    return true;
  },
});
