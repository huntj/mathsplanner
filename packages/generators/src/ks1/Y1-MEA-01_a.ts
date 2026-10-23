/**
 * @statement Y1-MEA-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y1-MEA-01.a: Compare and solve problems with lengths and heights
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  names: [string, string, string];
}

export default defineGenerator<Params>({
  id: "Y1-MEA-01.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["AS.PROBLEM.KEYWORD", "MEA.SEQUENCE.ORDER"],

  params(rng, numbers) {
    const top = numbers === "friendly" ? 10 : 20;
    const p = {
      a: rng.int(4, top),
      b: rng.int(2, top),
      names: rng.shuffle(["Amy", "Ben", "Cal", "Dev", "Eve"]).slice(0, 3) as [
        string,
        string,
        string,
      ],
    };
    if (p.a <= p.b) reject("a taller first tower");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const [x, y, z] = p.names;
    switch (depth) {
      case 1:
        return A.standard({
          question: `${x} builds a tower ${p.a} cubes tall. ${y} builds a tower ${p.b} cubes tall.`,
          ask: `How many cubes taller is ${x}'s tower?`,
          answer: A.number(p.a - p.b),
          wrong: wrongs(p.a - p.b, [
            {
              code: "AS.PROBLEM.KEYWORD",
              value: A.number(p.a + p.b),
              feedback: `"Taller" asks for the difference: ${p.a} − ${p.b}.`,
            },
          ]),
          solution: [{ say: `Compare: ${p.a} − ${p.b} = ${p.a - p.b} cubes taller.` }],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `${x}'s ribbon is longer than ${y}'s. ${y}'s ribbon is longer than ${z}'s.`,
          ask: "Whose ribbon is the shortest?",
          correct: z,
          distractors: [
            {
              content: x,
              code: "MEA.SEQUENCE.ORDER",
              feedback: `${x}'s ribbon is the longest of the three.`,
            },
            { content: y, feedback: `${y}'s ribbon is longer than ${z}'s.` },
          ],
          solution: [
            { say: `From longest to shortest: ${x}, ${y}, ${z}. So ${z}'s is the shortest.` },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `${x} is taller than ${y}. ${z} is shorter than ${y}. ${z} says, "I am taller than ${x}."`,
          truth: false,
          reasons: [
            {
              text: `False. ${x} is taller than ${y}, and ${y} is taller than ${z}, so ${x} is taller than ${z}.`,
              correct: true,
            },
            {
              text: `True. ${z} was named last, so ${z} is the tallest.`,
              code: "MEA.SEQUENCE.ORDER",
            },
            { text: "We cannot tell without measuring them." },
          ],
          solution: [{ say: `From tallest to shortest: ${x}, ${y}, ${z}.` }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.a - p.b;
    if (question.key.depth === 2) return chosenText(question) === p.names[2];
    return true;
  },
});
