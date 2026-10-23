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

interface Params {
  a: number;
  b: number;
  subtract: boolean;
}

export default defineGenerator<Params>({
  id: "Y2-AS-01.a",
  version: "1.0.0",
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
        return A.trueOrFalseWhy({
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
            { text: `False. She needs to add: ${c} + ${p.b}.`, code: "AS.INVERSE.SAME-OPERATION" },
            { text: "False. An addition fact cannot tell you a subtraction fact." },
          ],
          solution: [
            { say: "Addition and subtraction facts come in families: the same three numbers." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === (p.subtract ? p.a : p.a + p.b);
    if (question.key.depth === 2) return numberAnswer(question) === p.b;
    return true;
  },
});
