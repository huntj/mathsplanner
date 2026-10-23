/**
 * @statement N-MEA-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the early years sub-statements
 */
// N-MEA-01.b: Compare objects by weight
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

// [heavier, lighter] pairs where the heavier thing is clearly heavier.
const PAIRS: [string, string][] = [
  ["an elephant", "a mouse"],
  ["a bag of shopping", "a feather"],
  ["a big bag of potatoes", "an apple"],
  ["a brick", "a sock"],
];
// [heavier but small, lighter but big] pairs.
const SURPRISE: [string, string][] = [
  ["a small stone", "a big balloon"],
  ["a tin of beans", "a big pillow"],
  ["a little metal key", "a large feather"],
];

interface Params {
  pair: number;
  s: number;
}

export default defineGenerator<Params>({
  id: "N-MEA-01.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MEA.COMPARE.LOOKS"],

  params(rng) {
    return { pair: rng.int(0, PAIRS.length - 1), s: rng.int(0, SURPRISE.length - 1) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const [heavy, light] = PAIRS[p.pair] ?? PAIRS[0] ?? ["", ""];
        return A.choice({
          rng,
          question: [`Which is heavier: ${light} or ${heavy}?`],
          correct: heavy,
          distractors: [
            {
              content: light,
              feedback: `Imagine holding them. ${heavy[0]?.toUpperCase()}${heavy.slice(1)} would feel heavier.`,
            },
            {
              content: "They weigh the same",
              feedback: "One of them would be much harder to lift.",
            },
          ],
          solution: [{ say: `${heavy[0]?.toUpperCase()}${heavy.slice(1)} is heavier.` }],
        });
      }
      case 2: {
        const [heavy, light] = SURPRISE[p.s] ?? SURPRISE[0] ?? ["", ""];
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            `A balance has ${heavy} on one side and ${light} on the other. The side with ${heavy.replace(/^an? /, "the ")} goes down.`,
          ],
          ask: "Which is heavier?",
          correct: heavy,
          distractors: [
            {
              content: light,
              code: "MEA.COMPARE.LOOKS",
              feedback:
                "Bigger does not always mean heavier. The heavier side of a balance goes down.",
            },
            {
              content: "They weigh the same",
              feedback: "If they weighed the same, the balance would be level.",
            },
          ],
          solution: [{ say: "The side that goes down is heavier." }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: "Ella says that bigger things are always heavier than smaller things.",
          truth: false,
          reasons: [
            {
              text: "False. A big balloon is lighter than a small stone. You need to hold them or use a balance.",
              correct: true,
            },
            { text: "True. Big things have more in them.", code: "MEA.COMPARE.LOOKS" },
            { text: "True. You can tell which is heavier by looking.", code: "MEA.COMPARE.LOOKS" },
          ],
          solution: [{ say: "Weigh things to compare them, not just look." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === PAIRS[p.pair]?.[0];
    if (question.key.depth === 2) return chosenText(question) === SURPRISE[p.s]?.[0];
    return true;
  },
});
