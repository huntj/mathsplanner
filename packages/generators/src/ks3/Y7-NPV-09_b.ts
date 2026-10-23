/**
 * @statement Y7-NPV-09.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-NPV-09.b: Write error intervals using inequality notation
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  v: number;
  t: number;
}

export default defineGenerator<Params>({
  id: "Y7-NPV-09.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.BOUNDS.ENDS"],

  params(rng) {
    return { v: rng.int(3, 15), t: rng.int(2, 9) * 10 };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [`A pencil is ${p.v} cm long, to the nearest centimetre.`],
          ask: "Which of these could be its actual length?",
          correct: A.math(`${p.v - 1}.5 \\text{ cm}`),
          distractors: [
            {
              content: A.math(`${p.v}.5 \\text{ cm}`),
              code: "NPV.BOUNDS.ENDS",
              feedback: `${p.v}.5 cm would round up to ${p.v + 1} cm.`,
            },
            {
              content: A.math(`${p.v - 1}.4 \\text{ cm}`),
              code: "NPV.BOUNDS.ENDS",
              feedback: `${p.v - 1}.4 cm would round down to ${p.v - 1} cm.`,
            },
          ],
          solution: [{ say: "", math: `${p.v - 1}.5 \\le l < ${p.v}.5` }],
        });
      case 2: {
        const v = p.t + 4;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`A whole number x rounds to ${p.t} to the nearest 10.`],
              ask: "What is the largest value x could be?",
            },
            {
              question: [`A crowd is reported as ${p.t} people, to the nearest 10.`],
              ask: "What is the largest number of people there could have been?",
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "NPV.BOUNDS.ENDS",
              value: A.number(p.t + 5),
              feedback: `${p.t + 5} rounds up to ${p.t + 10}, so it is not included.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `${p.t - 5} \\le x < ${p.t + 5}, \\text{ so the largest whole number is } ${v}`,
            },
          ],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: [`A number that rounds to ${p.t} to the nearest 10 is less than ${p.t}.`],
          truth: "sometimes",
          reasons: [
            {
              text: `Sometimes. It can be anything from ${p.t - 5} up to (but not including) ${p.t + 5}: ${p.t - 3} is less, but ${p.t + 3} is more.`,
              correct: true,
            },
            { text: "Always. Rounding makes numbers bigger.", code: "NPV.BOUNDS.ENDS" },
            { text: "Never. Rounding makes numbers smaller.", code: "NPV.BOUNDS.ENDS" },
          ],
          solution: [{ say: "", math: `${p.t - 5} \\le x < ${p.t + 5}` }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === `${p.v - 1}.5 \\text{ cm}`;
    if (question.key.depth === 2) return numberAnswer(question) === p.t + 4;
    return true;
  },
});
