/**
 * @statement Y1-MEA-01.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y1-MEA-01.c: Compare and solve problems with capacity
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  full: number;
  out: number;
  back: number;
  name: string;
}

export default defineGenerator<Params>({
  id: "Y1-MEA-01.c",
  version: "1.0.0",
  depths: [1, 2, 5],
  misconceptions: ["AS.PROBLEM.KEYWORD", "MEA.COMPARE.LOOKS", "AS.MULTISTEP.ONE-STEP"],

  params(rng, numbers) {
    const top = numbers === "friendly" ? 10 : 20;
    const full = rng.int(numbers === "friendly" ? 6 : 8, numbers === "stretch" ? 20 : 12);
    const out = rng.int(3, full - 2);
    const p = {
      a: rng.int(4, top),
      b: rng.int(2, top),
      full,
      out,
      back: rng.int(1, out - 1),
      name: rng.pick(["Amy", "Ben", "Cal", "Dev"]),
    };
    if (p.a <= p.b) reject("a bigger first jug");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: `A jug fills ${p.a} cups. A bottle fills ${p.b} cups.`,
          ask: "How many more cups does the jug fill?",
          answer: A.number(p.a - p.b),
          wrong: wrongs(p.a - p.b, [
            {
              code: "AS.PROBLEM.KEYWORD",
              value: A.number(p.a + p.b),
              feedback: `"More" here asks for the difference: ${p.a} − ${p.b}.`,
            },
          ]),
          solution: [{ say: `${p.a} − ${p.b} = ${p.a - p.b} more cups.` }],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `A tall thin vase fills ${p.b} cups. A short wide bowl fills ${p.a} cups.`,
          ask: "Which holds more?",
          correct: "The bowl",
          distractors: [
            {
              content: "The vase",
              code: "MEA.COMPARE.LOOKS",
              feedback: `Taller does not always mean it holds more. The bowl fills ${p.a} cups and the vase only ${p.b}.`,
            },
            { content: "They hold the same", feedback: "They fill different numbers of cups." },
          ],
          solution: [{ say: `${p.a} cups is more than ${p.b} cups, so the bowl holds more.` }],
        });
      default: {
        const left = p.full - p.out;
        return A.multiStepContext({
          context: `A jug holds ${p.full} cups of water when it is full. ${p.name} pours out ${p.out} cups.`,
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
              ask: `${p.name} pours ${p.back} cups back in. How many more cups would fill the jug?`,
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
    if (question.key.depth === 1) return numberAnswer(question) === p.a - p.b;
    if (question.key.depth === 2) return chosenText(question) === "The bowl";
    return numberAnswer(question, 1) === p.out - p.back;
  },
});
