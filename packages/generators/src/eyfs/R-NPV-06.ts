/**
 * @statement R-NPV-06
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// R-NPV-06: Understand the 'one more than / one less than' relationship between consecutive numbers
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenFigure, countOf, numberAnswer, tenFrames } from "../shared/counting.ts";

interface Params {
  n: number;
  way: "more" | "less";
}

export default defineGenerator<Params>({
  id: "R-NPV-06",
  version: "1.0.0",
  depths: [1, 3, 4],
  misconceptions: ["NPV.SEQUENCE.BEFORE-AFTER"],

  params(rng, numbers) {
    return {
      n:
        numbers === "friendly"
          ? rng.int(2, 6)
          : numbers === "standard"
            ? rng.int(2, 9)
            : rng.int(5, 19),
      way: numbers === "friendly" ? "more" : rng.pick(["more", "less"] as const),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const answer = p.way === "more" ? p.n + 1 : p.n - 1;
    const flipped = p.way === "more" ? p.n - 1 : p.n + 1;
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Here are some counters.", A.figure(tenFrames(p.n))],
          ask: `What is one ${p.way} than ${p.n}?`,
          answer: A.number(answer),
          wrong: wrongs(answer, [
            {
              code: "NPV.SEQUENCE.BEFORE-AFTER",
              value: A.number(flipped),
              feedback: `That is one ${p.way === "more" ? "less" : "more"}. One ${p.way} ${p.way === "more" ? "adds" : "takes away"} a counter.`,
            },
          ]),
          solution: [
            {
              say: `One ${p.way} than ${p.n} is ${answer}: ${p.way === "more" ? "add" : "take away"} one counter.`,
            },
          ],
        });
      case 3:
        return A.chooseTheDiagram({
          rng,
          question: `Which ten frame shows one ${p.way} than ${p.n}?`,
          ask: "Choose the ten frame.",
          correct: tenFrames(answer, { hidden: true }),
          distractors: [
            {
              figure: tenFrames(flipped, { hidden: true }),
              code: "NPV.SEQUENCE.BEFORE-AFTER",
              feedback: `That shows one ${p.way === "more" ? "less" : "more"} than ${p.n}.`,
            },
            { figure: tenFrames(p.n, { hidden: true }), feedback: `That shows ${p.n} itself.` },
          ],
          solution: [{ say: `One ${p.way} than ${p.n} is ${answer}.` }],
        });
      default: {
        const right = rng.bool();
        const claimed = right ? answer : flipped;
        return A.trueOrFalseWhy({
          rng,
          statement: `Ravi says one ${p.way} than ${p.n} is ${claimed}.`,
          truth: right,
          reasons: right
            ? [
                {
                  text: `${answer} comes just ${p.way === "more" ? "after" : "before"} ${p.n} when we count.`,
                  correct: true,
                },
                {
                  text: `One ${p.way} means the number just ${p.way === "more" ? "before" : "after"}.`,
                  code: "NPV.SEQUENCE.BEFORE-AFTER",
                },
                { text: "You need a number line to tell." },
              ]
            : [
                {
                  text: `${claimed} is one ${p.way === "more" ? "less" : "more"}. One ${p.way} than ${p.n} is ${answer}.`,
                  correct: true,
                },
                {
                  text: `One ${p.way} means the number just ${p.way === "more" ? "before" : "after"}.`,
                  code: "NPV.SEQUENCE.BEFORE-AFTER",
                },
                { text: `Both ${p.n - 1} and ${p.n + 1} are one ${p.way} than ${p.n}.` },
              ],
          solution: [
            {
              say: `One more is the next number when counting; one less is the number before. One ${p.way} than ${p.n} is ${answer}.`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const answer = p.way === "more" ? p.n + 1 : p.n - 1;
    if (question.archetype === "standard")
      return numberAnswer(question) === countOf(question.diagrams[0]) + (p.way === "more" ? 1 : -1);
    if (question.archetype === "choose-the-diagram")
      return countOf(chosenFigure(question)) === answer;
    return answer >= 0;
  },
});
