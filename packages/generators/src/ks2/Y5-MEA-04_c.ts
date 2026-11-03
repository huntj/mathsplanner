/**
 * @statement Y5-MEA-04.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-MEA-04.c: Estimate the area of irregular shapes
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

const THINGS = ["a leaf", "a puddle", "a handprint", "a pond on a map", "an island on a map"];

interface Params {
  whole: number;
  /** Squares that are about half covered, or more than half covered. */
  half: number;
  thing: number;
}

export default defineGenerator<Params>({
  id: "Y5-MEA-04.c",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: [],

  params(rng, numbers) {
    const p = {
      whole: rng.int(numbers === "friendly" ? 6 : 12, numbers === "friendly" ? 15 : 40),
      half: 2 * rng.int(2, numbers === "friendly" ? 4 : 8),
      thing: rng.int(0, THINGS.length - 1),
    };
    if (p.half >= p.whole) reject("more whole squares than half squares");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const thing = THINGS[p.thing] ?? "a leaf";
    const estimate = p.whole + p.half / 2;
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [
            `${thing[0]?.toUpperCase()}${thing.slice(1)} is drawn on a centimetre-squared grid. It covers ${p.whole} whole squares and about ${p.half} half squares.`,
          ],
          ask: "What is the best estimate for its area?",
          correct: `${estimate} cm²`,
          distractors: [
            {
              content: `${p.whole + p.half} cm²`,
              feedback: "Two half squares make about one whole square.",
            },
            { content: `${p.whole} cm²`, feedback: "The half squares are part of the shape too." },
            { content: `${p.half} cm²`, feedback: "Count the whole squares as well." },
          ],
          solution: [
            {
              say: `${p.whole} whole squares, and ${p.half} halves make about ${p.half / 2} more: about ${estimate} cm².`,
            },
          ],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            `Jo counts the squares that are more than half covered by ${thing} and ignores the ones that are less than half covered. She counts ${estimate}.`,
          ],
          ask: "Which is true?",
          correct: `The area is about ${estimate} cm²`,
          distractors: [
            {
              content: `The area is exactly ${estimate} cm²`,
              feedback: "Counting part squares this way gives an estimate, not an exact answer.",
            },
            {
              content: `The area is about ${2 * estimate} cm²`,
              feedback: "Each square counted is 1 cm².",
            },
          ],
          solution: [
            {
              say: "Counting more-than-half squares as whole squares and ignoring the rest gives a good estimate.",
            },
          ],
        });
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: `Tom counts every square that ${thing} touches, even a tiny corner, and says that gives a good estimate of its area.`,
              truth: false,
              reasons: [
                {
                  text: "False. Counting tiny bits as whole squares makes the estimate too big. Count squares more than half covered.",
                  correct: true,
                },
                { text: "True. Every square it touches is part of the area." },
                { text: "True. Over-counting does not matter for an estimate." },
              ],
              solution: [
                {
                  say: "Count whole squares, then count squares more than half covered, and ignore the rest.",
                },
              ],
            }),
          [
            {
              statement:
                "To estimate a leaf's area on squared paper, Mia counts whole squares and adds about half the part squares.",
              truth: true,
              right:
                "True. Part squares are roughly half full on average, so this gives a good estimate.",
              wrong: [
                ["False. Count only whole squares."],
                ["False. Count every square the leaf touches."],
              ],
            },
            {
              claim: "An estimate of an irregular shape's area is exact.",
              truth: "never",
              right:
                "Never quite. Counting squares gives an estimate; the curved edges make an exact count impossible.",
              wrong: [
                ["Always. Counting squares is exact."],
                ["Sometimes. When the squares are big."],
              ],
            },
            {
              claim: "Using smaller squares gives a better estimate of an irregular area.",
              truth: "always",
              right:
                "Always, if counted carefully. Smaller squares fit the curved edge more closely.",
              wrong: [
                ["Never. Big squares are more accurate."],
                ["Sometimes. Only for round shapes."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === `${p.whole + p.half / 2} cm²`;
    return true;
  },
});
