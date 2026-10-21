/**
 * @statement Y1-MEA-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y1-MEA-01: Compare, describe and solve practical problems for lengths, heights, mass, capacity
// and time
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  names: [string, string, string];
  /** Depth 5: cups in a full jug, and cups poured out then in. */
  full: number;
  out: number;
  back: number;
}

export default defineGenerator<Params>({
  id: "Y1-MEA-01",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: ["AS.PROBLEM.KEYWORD", "MEA.SEQUENCE.ORDER", "AS.MULTISTEP.ONE-STEP"],

  params(rng, numbers) {
    const top = numbers === "friendly" ? 10 : 20;
    const a = rng.int(4, top);
    const b = rng.int(2, top);
    if (a <= b) reject("a longer first pencil");
    const full = rng.int(numbers === "friendly" ? 6 : 8, numbers === "stretch" ? 20 : 12);
    const out = rng.int(2, full - 2);
    const back = rng.int(1, out - 1 || 1);
    if (back >= out) reject("pour back less than was poured out");
    return {
      a,
      b,
      names: rng.shuffle(["Amy", "Ben", "Cal", "Dev", "Eve"]).slice(0, 3) as [
        string,
        string,
        string,
      ],
      full,
      out,
      back,
    };
  },

  build(p, depth, rng): QuestionDraft {
    const [x, y, z] = p.names;
    switch (depth) {
      case 1:
        return A.standard({
          question: `A red pencil is ${p.a} cubes long. A blue pencil is ${p.b} cubes long.`,
          ask: "How many cubes longer is the red pencil?",
          answer: A.number(p.a - p.b),
          wrong: wrongs(p.a - p.b, [
            {
              code: "AS.PROBLEM.KEYWORD",
              value: A.number(p.a + p.b),
              feedback: `"Longer" asks for the difference: ${p.a} − ${p.b}.`,
            },
          ]),
          solution: [{ say: `Compare: ${p.a} − ${p.b} = ${p.a - p.b} cubes longer.` }],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `${x} is taller than ${y}. ${y} is taller than ${z}.`,
          ask: "Who is the shortest?",
          correct: z,
          distractors: [
            {
              content: x,
              code: "MEA.SEQUENCE.ORDER",
              feedback: `${x} is the tallest of the three.`,
            },
            { content: y, feedback: `${y} is taller than ${z}.` },
          ],
          solution: [
            { say: `In order of height: ${x}, then ${y}, then ${z}. So ${z} is the shortest.` },
          ],
        });
      case 4:
        return A.trueOrFalseWhy({
          rng,
          statement: `${x} is heavier than ${y}. ${y} is heavier than ${z}. ${z} says, "I am heavier than ${x}."`,
          truth: false,
          reasons: [
            {
              text: `False. ${x} is heavier than ${y}, and ${y} is heavier than ${z}, so ${x} is heavier than ${z}.`,
              correct: true,
            },
            { text: `True. ${z} is last, so ${z} is the heaviest.`, code: "MEA.SEQUENCE.ORDER" },
            { text: "We cannot tell without weighing them." },
          ],
          solution: [{ say: `From heaviest to lightest: ${x}, ${y}, ${z}.` }],
        });
      default: {
        const left = p.full - p.out;
        return A.multiStepContext({
          context: `A jug holds ${p.full} cups of water when it is full. ${x} pours out ${p.out} cups.`,
          parts: [
            {
              ask: "How many cups are left in the jug?",
              answer: A.number(left),
              wrong: wrongs(left, [
                {
                  code: "AS.PROBLEM.KEYWORD",
                  value: A.number(p.full + p.out),
                  feedback: "Pouring out takes water away.",
                },
              ]),
            },
            {
              ask: `${x} pours ${p.back} cups back in. How many more cups would fill the jug?`,
              answer: A.number(p.out - p.back),
              wrong: wrongs(p.out - p.back, [
                {
                  code: "AS.MULTISTEP.ONE-STEP",
                  value: A.number(left + p.back),
                  feedback: "That is how much is in the jug. How many more fill it up?",
                },
              ]),
            },
          ],
          solution: [
            { say: `${p.full} − ${p.out} = ${left} cups left.` },
            {
              say: `${left} + ${p.back} = ${left + p.back}, and ${p.full} − ${left + p.back} = ${p.out - p.back} more cups.`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return numberAnswer(question) === p.a - p.b;
    if (question.archetype === "varied-form") return chosenText(question) === p.names[2];
    if (question.archetype === "multi-step-context")
      return numberAnswer(question, 1) === p.out - p.back;
    return true;
  },
});
