/**
 * @statement N-PAT-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// N-PAT-02: Extend and create ABAB patterns, e.g. stick, leaf, stick, leaf
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { itemName, nextGuesses, pickUnit, repeat, row, type Item } from "../shared/pat.ts";

interface Params {
  length: number;
  gap: number;
  words: number;
  unit: Item[];
}

const WORDS: [string, string][] = [
  ["stick", "leaf"],
  ["clap", "stamp"],
  ["apple", "banana"],
  ["boy", "girl"],
];

export default defineGenerator<Params>({
  id: "N-PAT-02",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PAT.REPEAT.UNIT"],

  params(rng) {
    return {
      length: rng.int(4, 7),
      gap: rng.int(1, 4),
      words: rng.int(0, WORDS.length - 1),
      unit: pickUnit(rng, "AB"),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const unit = p.unit;
    switch (depth) {
      case 1: {
        const items = repeat(unit, p.length);
        const right = unit[p.length % 2] as Item;
        return A.choice({
          rng,
          question: [
            "Look at the pattern.",
            A.figure(row([...items, null], "A repeating pattern of shapes with a gap at the end.")),
          ],
          ask: "What comes next?",
          correct: itemName(right),
          distractors: nextGuesses(unit, p.length).map((g) => ({
            content: itemName(g),
            code: "PAT.REPEAT.UNIT",
            feedback: `The pattern goes ${unit.map(itemName).join(", ")}, again and again.`,
          })),
          solution: [
            {
              say: `After a ${itemName(unit[(p.length - 1) % 2] as Item)} comes a ${itemName(right)}.`,
            },
          ],
        });
      }
      case 2: {
        const items = repeat(unit, 6).map((it, i) => (i === p.gap ? null : it));
        const right = unit[p.gap % 2] as Item;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "One shape is missing from the pattern.",
            A.figure(row(items, "A repeating pattern of shapes with one gap.")),
          ],
          ask: "What goes in the gap?",
          correct: itemName(right),
          distractors: [
            {
              content: itemName(unit[(p.gap + 1) % 2] as Item),
              code: "PAT.REPEAT.UNIT",
              feedback: "Look at the shapes either side of the gap. The pattern takes turns.",
            },
          ],
          solution: [{ say: `The shapes take turns, so the gap is a ${itemName(right)}.` }],
        });
      }
      default: {
        const [a, b] = WORDS[p.words] as (typeof WORDS)[number];
        return A.trueOrFalseWhy({
          rng,
          statement: `Jo makes a pattern: ${a}, ${b}, ${a}, ${b}, ${a}. Jo says ${a} comes next.`,
          truth: false,
          reasons: [
            { text: `False. The pattern takes turns, so after ${a} comes ${b}.`, correct: true },
            { text: `True. The last one was ${a}, so ${a} comes again.`, code: "PAT.REPEAT.UNIT" },
            { text: "True. You can put anything next." },
          ],
          solution: [{ say: `${a}, ${b}, ${a}, ${b}, ${a}, ${b}.` }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return chosenText(question) === itemName(p.unit[p.length % 2] as Item);
    if (question.archetype === "varied-form")
      return chosenText(question) === itemName(p.unit[p.gap % 2] as Item);
    return true;
  },
});
