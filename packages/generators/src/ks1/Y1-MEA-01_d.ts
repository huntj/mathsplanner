/**
 * @statement Y1-MEA-01.d
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y1-MEA-01.d: Compare and solve problems with time
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  names: [string, string];
}

export default defineGenerator<Params>({
  id: "Y1-MEA-01.d",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["AS.PROBLEM.KEYWORD", "MEA.COMPARE.LOOKS"],

  params(rng, numbers) {
    const top = numbers === "friendly" ? 10 : 20;
    const p = {
      a: rng.int(4, top),
      b: rng.int(2, top),
      names: rng.shuffle(["Amy", "Ben", "Cal", "Dev", "Eve"]).slice(0, 2) as [string, string],
    };
    if (p.a <= p.b) reject("a slower first runner");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const [x, y] = p.names;
    switch (depth) {
      case 1:
        return A.standard({
          question: `${x} runs across the playground in ${p.a} seconds. ${y} takes ${p.b} seconds.`,
          ask: `How many seconds longer does ${x} take?`,
          answer: A.number(p.a - p.b, { units: "seconds" }),
          wrong: wrongs(p.a - p.b, [
            {
              code: "AS.PROBLEM.KEYWORD",
              value: A.number(p.a + p.b, { units: "seconds" }),
              feedback: `"Longer" asks for the difference: ${p.a} − ${p.b}.`,
            },
          ]),
          solution: [{ say: `${p.a} − ${p.b} = ${p.a - p.b} seconds longer.` }],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `In a race, ${x} takes ${p.a} seconds and ${y} takes ${p.b} seconds.`,
          ask: "Who is quicker?",
          correct: y,
          distractors: [
            {
              content: x,
              code: "MEA.COMPARE.LOOKS",
              feedback: `${x} took more time. The quicker runner takes less time.`,
            },
            { content: "They are just as quick", feedback: "They took different times." },
          ],
          solution: [
            { say: `${p.b} seconds is less time than ${p.a} seconds, so ${y} is quicker.` },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `${x} takes ${p.a} seconds to tidy up. ${y} takes ${p.b} seconds. ${x} says, "I was quicker, because ${p.a} is bigger."`,
          truth: false,
          reasons: [
            {
              text: `False. Taking more seconds means taking longer, so ${y} was quicker.`,
              correct: true,
            },
            { text: "True. The bigger number always wins.", code: "MEA.COMPARE.LOOKS" },
            { text: "True. More seconds means faster.", code: "MEA.COMPARE.LOOKS" },
          ],
          solution: [{ say: "The quicker person takes less time." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.a - p.b;
    if (question.key.depth === 2) return chosenText(question) === p.names[1];
    return true;
  },
});
