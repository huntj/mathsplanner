/**
 * @statement Y3-MD-02.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-MD-02.a: Write multiplication and division statements from known facts
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  a: number;
  b: number;
  tens: boolean;
}

export default defineGenerator<Params>({
  id: "Y3-MD-02.a",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["MD.DIVIDE.ORDER", "MD.PLACE.ZEROS"],

  params(rng, numbers) {
    const a = rng.pick(numbers === "friendly" ? [2, 5, 10] : [3, 4, 8]);
    const b = rng.int(3, numbers === "stretch" ? 12 : 9);
    if (a === b) reject("two different factors");
    return { a, b, tens: numbers !== "friendly" && rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const c = p.a * p.b;
    const fact = A.math(`${p.a} \\times ${p.b} = ${c}`);
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: ["You know that ", fact, "."],
          ask: "Which division fact is also true?",
          correct: A.math(`${c} \\div ${p.a} = ${p.b}`),
          distractors: [
            {
              content: A.math(`${p.a} \\div ${c} = ${p.b}`),
              code: "MD.DIVIDE.ORDER",
              feedback: `Start with the biggest number, the product ${c}, and divide it.`,
            },
            {
              content: A.math(`${c} \\div ${p.b} = ${p.b}`),
              feedback: `${c} shared into ${p.b} groups gives ${p.a} in each, not ${p.b}.`,
            },
          ],
          solution: [
            {
              say: `${c} ÷ ${p.a} = ${p.b} and ${c} ÷ ${p.b} = ${p.a} belong to the same family as ${p.a} × ${p.b} = ${c}.`,
            },
          ],
        });
      case 2: {
        const answer = p.tens ? 10 * c : c;
        return A.standard({
          question: ["You know that ", fact, "."],
          ask: [
            "Use it to work out ",
            A.math(p.tens ? `${p.a} \\times ${10 * p.b}` : `${p.b} \\times ${p.a}`),
            ".",
          ],
          answer: A.number(answer),
          wrong: wrongs(answer, [
            p.tens
              ? {
                  code: "MD.PLACE.ZEROS",
                  value: A.number(c),
                  feedback: `${10 * p.b} is ten times ${p.b}, so the answer is ten times ${c}.`,
                }
              : {
                  code: "MD.DIVIDE.ORDER",
                  value: A.number(p.a),
                  feedback: "Multiplying in either order gives the same answer.",
                },
          ]),
          solution: [
            {
              say: p.tens
                ? `${p.a} × ${10 * p.b} = ${p.a} × ${p.b} × 10 = ${10 * c}.`
                : `${p.b} × ${p.a} = ${p.a} × ${p.b} = ${c}.`,
            },
          ],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                "Ellie knows ",
                fact,
                ". She says that means ",
                A.math(`${p.b} \\div ${c} = ${p.a}`),
                ".",
              ],
              truth: false,
              reasons: [
                { text: `False. You divide the product: ${c} ÷ ${p.b} = ${p.a}.`, correct: true },
                {
                  text: "True. Division can be done in either order, like multiplication.",
                  code: "MD.DIVIDE.ORDER",
                },
                {
                  text: "True. The three numbers are the same, so it must be right.",
                  code: "MD.DIVIDE.ORDER",
                },
              ],
              solution: [
                {
                  say: `The fact family is ${p.a} × ${p.b} = ${c}, ${p.b} × ${p.a} = ${c}, ${c} ÷ ${p.a} = ${p.b} and ${c} ÷ ${p.b} = ${p.a}.`,
                },
              ],
            }),
          [
            {
              statement: "Dan knows 4 × 5 = 20. He says that means 20 ÷ 5 = 4.",
              truth: true,
              right:
                "True. Multiplying and dividing are opposites: 20 shared into 5s makes 4 groups.",
              wrong: [
                ["False. 20 ÷ 5 = 20.", "MD.DIVIDE.ORDER"],
                ["False. It means 5 ÷ 20 = 4.", "MD.DIVIDE.ORDER"],
              ],
            },
            {
              claim: "If you know 6 × 3 = 18, you also know 18 ÷ 3 = 6.",
              truth: "always",
              right: "Always. Each times fact gives two divide facts: 18 ÷ 3 = 6 and 18 ÷ 6 = 3.",
              wrong: [
                ["Never. You must work it out again.", "MD.DIVIDE.ORDER"],
                ["Sometimes. Only for the 3 times table."],
              ],
            },
            {
              statement: "Mia knows 3 × 4 = 12. She says 3 × 40 = 1200.",
              truth: false,
              right: "False. 40 is ten times 4, so the answer is ten times 12: 120.",
              wrong: [
                ["True. Add two zeros.", "MD.PLACE.ZEROS"],
                ["True. Big numbers make big answers."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return chosenText(question).includes(`${p.a * p.b} \\div ${p.a} = ${p.b}`);
    if (question.key.depth === 2) return numberAnswer(question) === p.a * p.b * (p.tens ? 10 : 1);
    return true;
  },
});
