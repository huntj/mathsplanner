/**
 * @statement Y2-AS-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-AS-01.a: Recall addition and subtraction facts to 20
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  a: number;
  b: number;
  subtract: boolean;
}

export default defineGenerator<Params>({
  id: "Y2-AS-01.a",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: [
    "AS.COUNT-ON.INCLUDES-START",
    "NPV.COMPOSITION.ADD-NOT-PART",
    "AS.INVERSE.SAME-OPERATION",
  ],

  params(rng, numbers) {
    const a = rng.int(numbers === "friendly" ? 2 : 4, 9);
    const b = rng.int(numbers === "friendly" ? 2 : 3, 9);
    if (numbers !== "friendly" && a + b <= 10) reject("facts that cross ten");
    if (numbers === "friendly" && a + b > 10) reject("facts to 10");
    return { a, b, subtract: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const c = p.a + p.b;
    switch (depth) {
      case 1: {
        const answer = p.subtract ? p.a : c;
        return A.standard({
          question: [A.math(p.subtract ? `${c} - ${p.b}` : `${p.a} + ${p.b}`)],
          ask: "Work it out.",
          answer: A.number(answer),
          wrong: wrongs(answer, [
            {
              code: "AS.COUNT-ON.INCLUDES-START",
              value: A.number(p.subtract ? answer + 1 : answer - 1),
              feedback: `Count ${p.subtract ? "back" : "on"} from the next number, not the one you start on.`,
            },
          ]),
          solution: [
            { say: "", math: p.subtract ? `${c} - ${p.b} = ${p.a}` : `${p.a} + ${p.b} = ${c}` },
          ],
        });
      }
      case 2:
        return A.missingValue({
          intro: "Find the missing number.",
          relation: p.subtract ? [c, "-", p.b, "=", p.a] : [p.a, "+", p.b, "=", c],
          hide: 2,
          wrong: wrongs(p.b, [
            {
              code: "NPV.COMPOSITION.ADD-NOT-PART",
              value: A.number(c + p.a),
              feedback: p.subtract
                ? `Taking it away from ${c} leaves ${p.a}, so it is less than ${c}.`
                : `${p.a} and the missing number make ${c}, so it is less than ${c}.`,
            },
          ]),
          solution: [{ say: "", math: `${p.a} + ${p.b} = ${c}` }],
        });
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                "Mia knows ",
                A.math(`${p.a} + ${p.b} = ${c}`),
                ". She says that means ",
                A.math(`${c} - ${p.b} = ${p.a}`),
                ".",
              ],
              truth: true,
              reasons: [
                {
                  text: `True. ${p.a} and ${p.b} are the two parts of ${c}, so taking one part away leaves the other.`,
                  correct: true,
                },
                {
                  text: `False. She needs to add: ${c} + ${p.b}.`,
                  code: "AS.INVERSE.SAME-OPERATION",
                },
                { text: "False. An addition fact cannot tell you a subtraction fact." },
              ],
              solution: [
                { say: "Addition and subtraction facts come in families: the same three numbers." },
              ],
            }),
          [
            {
              statement: "Sam says 7 + 6 = 13.",
              truth: true,
              right: "True. 7 + 3 = 10, and 3 more makes 13.",
              wrong: [
                ["False. It is 12, counting 7 again.", "AS.COUNT-ON.INCLUDES-START"],
                ["False. It is 76.", "NPV.COMPOSITION.ADD-NOT-PART"],
              ],
            },
            {
              claim: "If 5 + 4 = 9, then 9 − 4 = 5.",
              truth: "always",
              right: "Always. Taking away undoes adding.",
              wrong: [
                ["Never. You need to add again.", "AS.INVERSE.SAME-OPERATION"],
                ["Sometimes. Only for small numbers."],
              ],
            },
            {
              statement: "Pia says 15 − 8 = 8.",
              truth: false,
              right: "False. 8 + 7 = 15, so 15 − 8 = 7.",
              wrong: [
                ["True. Count back 8 from 15: 15, 14 … 8.", "AS.COUNT-ON.INCLUDES-START"],
                ["True. 8 is half of 15."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === (p.subtract ? p.a : p.a + p.b);
    if (question.key.depth === 2) return numberAnswer(question) === p.b;
    return true;
  },
});
