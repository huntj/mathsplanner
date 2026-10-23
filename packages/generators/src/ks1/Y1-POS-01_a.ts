/**
 * @statement Y1-POS-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y1-POS-01.a: Describe position and direction
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

const OPPOSITE: Record<string, string> = {
  above: "below",
  below: "above",
  "in front of": "behind",
  behind: "in front of",
  "to the left of": "to the right of",
  "to the right of": "to the left of",
};
const WORDS = Object.keys(OPPOSITE);
const ROW = ["apple", "ball", "car", "drum", "egg"];

interface Params {
  word: number;
  /** Depth 2: which toy in the row, and whether to ask left or right. */
  at: number;
  right: boolean;
}

export default defineGenerator<Params>({
  id: "Y1-POS-01.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["POS.WORDS.OPPOSITE"],

  params(rng) {
    return { word: rng.int(0, WORDS.length - 1), at: rng.int(1, 3), right: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const word = WORDS[p.word] ?? "above";
        const opp = OPPOSITE[word] ?? "below";
        return A.choice({
          rng,
          question: [`The cat is ${word} the dog.`],
          ask: "Where is the dog?",
          correct: `${opp[0]?.toUpperCase()}${opp.slice(1)} the cat`,
          distractors: [
            {
              content: `${word[0]?.toUpperCase()}${word.slice(1)} the cat`,
              code: "POS.WORDS.OPPOSITE",
              feedback: `If the cat is ${word} the dog, the dog is the other way round: ${opp} the cat.`,
            },
            { content: "Next to the cat", feedback: `The cat is ${word} the dog, not beside it.` },
          ],
          solution: [{ say: `The cat is ${word} the dog, so the dog is ${opp} the cat.` }],
        });
      }
      case 2: {
        const side = p.right ? "right" : "left";
        const answer = ROW[p.at + (p.right ? 1 : -1)] ?? "";
        const wrong = ROW[p.at + (p.right ? -1 : 1)] ?? "";
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [`Toys are in a row on a shelf. From left to right: ${ROW.join(", ")}.`],
          ask: `Which toy is just to the ${side} of the ${ROW[p.at]}?`,
          correct: `The ${answer}`,
          distractors: [
            {
              content: `The ${wrong}`,
              code: "POS.WORDS.OPPOSITE",
              feedback: `The ${wrong} is on the other side. The ${side} side is the way the list goes ${p.right ? "on" : "back"}.`,
            },
            ...ROW.filter((t) => t !== answer && t !== wrong && t !== ROW[p.at])
              .slice(0, 1)
              .map((t) => ({
                content: `The ${t}`,
                feedback: `The ${t} is not next to the ${ROW[p.at]}.`,
              })),
          ],
          solution: [
            {
              say: `Reading left to right, the ${answer} is just to the ${side} of the ${ROW[p.at]}.`,
            },
          ],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["If a cup is to the left of a plate, then the plate is to the right of the cup."],
          truth: "always",
          reasons: [
            {
              text: "Always. Swapping which object you describe swaps left and right.",
              correct: true,
            },
            { text: "Never. The plate must be to the left too.", code: "POS.WORDS.OPPOSITE" },
            { text: "Sometimes. It depends how big the plate is." },
          ],
          solution: [
            {
              say: "Left of and right of are opposites: describe the other object and the word swaps.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) {
      const opp = OPPOSITE[WORDS[p.word] ?? ""] ?? "";
      return chosenText(question).toLowerCase() === `${opp} the cat`;
    }
    if (question.key.depth === 2)
      return chosenText(question) === `The ${ROW[p.at + (p.right ? 1 : -1)]}`;
    return true;
  },
});
