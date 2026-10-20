/**
 * @statement Y1-NPV-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y1-NPV-03: Given a number, identify one more and one less
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenFigure, countOf, numberAnswer, placeValue } from "../shared/counting.ts";

interface Params {
  n: number;
  way: "more" | "less";
  right: boolean;
}

export default defineGenerator<Params>({
  id: "Y1-NPV-03",
  version: "1.0.0",
  depths: [1, 3, 4],
  misconceptions: ["NPV.SEQUENCE.BEFORE-AFTER", "NPV.PLACE.TENS-ONES-MIXUP"],

  params(rng, numbers) {
    const n =
      numbers === "friendly"
        ? rng.int(11, 30)
        : numbers === "standard"
          ? rng.int(11, 89)
          : rng.pick([19, 29, 39, 49, 59, 69, 79, 89, 20, 30, 40, 50, 60, 70, 80, 90]);
    return { n, way: rng.pick(["more", "less"] as const), right: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const d = p.way === "more" ? 1 : -1;
    const answer = p.n + d;
    switch (depth) {
      case 1:
        return A.standard({
          question: `Think about the number ${p.n}.`,
          ask: `What is one ${p.way} than ${p.n}?`,
          answer: A.number(answer),
          wrong: wrongs(answer, [
            {
              code: "NPV.SEQUENCE.BEFORE-AFTER",
              value: A.number(p.n - d),
              feedback: `That is one ${p.way === "more" ? "less" : "more"}.`,
            },
            {
              code: "NPV.PLACE.TENS-ONES-MIXUP",
              value: A.number(p.n + 10 * d),
              feedback: "That changes the tens. One more or less changes the ones.",
            },
          ]),
          solution: [{ say: `One ${p.way} than ${p.n} is ${answer}.` }],
        });
      case 3:
        return A.chooseTheDiagram({
          rng,
          question: `Which picture shows one ${p.way} than ${p.n}?`,
          ask: "Choose the picture.",
          correct: placeValue(answer, { style: "blocks", hidden: true }),
          distractors: [
            {
              figure: placeValue(p.n - d, { style: "blocks", hidden: true }),
              code: "NPV.SEQUENCE.BEFORE-AFTER",
              feedback: `That shows one ${p.way === "more" ? "less" : "more"}.`,
            },
            ...(p.n + 10 * d > 0 && p.n + 10 * d < 100
              ? [
                  {
                    figure: placeValue(p.n + 10 * d, { style: "blocks", hidden: true }),
                    code: "NPV.PLACE.TENS-ONES-MIXUP",
                    feedback: `That shows ten ${p.way}.`,
                  },
                ]
              : []),
          ],
          solution: [
            {
              say: `One ${p.way} than ${p.n} is ${answer}: ${p.way === "more" ? "add" : "take away"} one cube${answer % 10 === (p.way === "more" ? 0 : 9) ? ", which crosses a ten" : ""}.`,
            },
          ],
        });
      default: {
        const claimed = p.right ? answer : p.n + 10 * d;
        return A.trueOrFalseWhy({
          rng,
          statement: `Leo says one ${p.way} than ${p.n} is ${claimed}.`,
          truth: p.right,
          reasons: p.right
            ? [
                {
                  text: `${answer} is the number just ${p.way === "more" ? "after" : "before"} ${p.n} when we count.`,
                  correct: true,
                },
                { text: `One ${p.way} changes the tens digit.`, code: "NPV.PLACE.TENS-ONES-MIXUP" },
                {
                  text: `One ${p.way} means the number just ${p.way === "more" ? "before" : "after"}.`,
                  code: "NPV.SEQUENCE.BEFORE-AFTER",
                },
              ]
            : [
                {
                  text: `${claimed} is ten ${p.way}. One ${p.way} than ${p.n} is ${answer}.`,
                  correct: true,
                },
                { text: `One ${p.way} changes the tens digit.`, code: "NPV.PLACE.TENS-ONES-MIXUP" },
                { text: "Both are right; one and ten mean the same here." },
              ],
          solution: [{ say: `One ${p.way} changes the number by 1: ${p.n} → ${answer}.` }],
        });
      }
    }
  },

  verify(p, question) {
    const answer = p.n + (p.way === "more" ? 1 : -1);
    if (question.archetype === "standard") return numberAnswer(question) === answer;
    if (question.archetype === "choose-the-diagram")
      return countOf(chosenFigure(question)) === answer;
    return answer > 0;
  },
});
