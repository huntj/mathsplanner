/**
 * @statement Y3-MEA-04.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-MEA-04.a: Tell the time on an analogue clock, including Roman numerals
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type GeneratorDefinition, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { mixFamilies, toRoman } from "../shared/npv.ts";
import parent from "./Y3-MEA-04.ts";

// Numerals that are easy to mix up with another, and the one they are mixed up with.
const PAIRS: [number, number][] = [
  [4, 6],
  [6, 4],
  [9, 11],
  [11, 9],
];

interface Params {
  pair: number;
}

const own: GeneratorDefinition<Params> = {
  id: "Y3-MEA-04.a",
  version: "1.0.0",
  depths: [2, 4],
  misconceptions: ["NPV.ROMAN.SUBTRACTIVE"],

  params(rng) {
    return { pair: rng.int(0, PAIRS.length - 1) };
  },

  build(p, depth, rng): QuestionDraft {
    const [n, swap] = PAIRS[p.pair] ?? [4, 6];
    if (depth === 2) {
      return A.choice({
        rng,
        archetype: "varied-form",
        question: [`A clock has Roman numerals instead of numbers.`],
        ask: `Which numeral is in the place of ${n}?`,
        correct: toRoman(n),
        distractors: [
          {
            content: toRoman(swap),
            code: "NPV.ROMAN.SUBTRACTIVE",
            feedback: "A smaller numeral before a bigger one is taken away; after it, it is added.",
          },
          { content: toRoman(n + 1), feedback: `${toRoman(n + 1)} is ${n + 1}.` },
        ],
        solution: [{ say: `${n} is written ${toRoman(n)}.` }],
      });
    }
    return A.trueOrFalseWhy({
      rng,
      statement: `On a Roman numeral clock, the hour hand points at ${toRoman(n)}. Sam says it is ${swap} o'clock.`,
      truth: false,
      reasons: [
        { text: `False. ${toRoman(n)} is ${n}, so it is ${n} o'clock.`, correct: true },
        { text: `True. ${toRoman(n)} means ${swap}.`, code: "NPV.ROMAN.SUBTRACTIVE" },
        { text: "True. The order of the letters does not matter.", code: "NPV.ROMAN.SUBTRACTIVE" },
      ],
      solution: [
        {
          say: "I before V or X takes 1 away: IV is 4, IX is 9. After, it adds: VI is 6, XI is 11.",
        },
      ],
    });
  },

  verify(p, question) {
    return question.key.depth !== 2 || chosenText(question) === toRoman(PAIRS[p.pair]?.[0] ?? 4);
  },
};

export default defineGenerator(
  mixFamilies("Y3-MEA-04.a", { 1: { ...parent.definition, id: "Y3-MEA-04.a" }, 2: own, 4: own }),
);
