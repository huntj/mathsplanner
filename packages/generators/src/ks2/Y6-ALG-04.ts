/**
 * @statement Y6-ALG-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-ALG-04: Find pairs of numbers that satisfy an equation with two unknowns
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** p·a + q·b = total, with a = a0 a known solution. */
  pa: number;
  qb: number;
  a0: number;
  b0: number;
  /** Depth 2: a + b = sum. */
  sum: number;
}

export default defineGenerator<Params>({
  id: "Y6-ALG-04",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SOLVE.WRONG-INVERSE"],

  params(rng, numbers) {
    const pa = rng.int(2, numbers === "friendly" ? 3 : 6);
    const qb = rng.int(1, numbers === "friendly" ? 2 : 5);
    const a0 = rng.int(1, 9);
    const b0 = rng.int(1, 9);
    if (pa === qb) reject("different coefficients");
    return { pa, qb, a0, b0, sum: rng.int(6, numbers === "stretch" ? 30 : 15) };
  },

  build(p, depth, rng): QuestionDraft {
    const total = p.pa * p.a0 + p.qb * p.b0;
    const eq = `${p.pa}a + ${p.qb === 1 ? "" : p.qb}b = ${total}`;
    switch (depth) {
      case 1:
        return A.standard({
          question: ["a and b are whole numbers and ", A.math(eq), "."],
          ask: ["Find b when ", A.math(`a = ${p.a0}`), "."],
          answer: A.number(p.b0),
          wrong: wrongs(p.b0, [
            {
              code: "ALG.SOLVE.WRONG-INVERSE",
              value: A.number((total + p.pa * p.a0) / p.qb),
              feedback: `Subtract ${p.pa} × ${p.a0} = ${p.pa * p.a0} from ${total}, then ${p.qb === 1 ? "that is b" : `divide by ${p.qb}`}.`,
            },
          ]),
          solution: [
            {
              say: `${p.pa} × ${p.a0} = ${p.pa * p.a0}, so ${p.qb === 1 ? "b" : `${p.qb}b`} = ${total} − ${p.pa * p.a0} = ${total - p.pa * p.a0}${p.qb === 1 ? "" : `, and b = ${p.b0}`}.`,
            },
          ],
        });
      case 2:
        return A.standard({
          question: ["a and b are positive whole numbers and ", A.math(`a + b = ${p.sum}`), "."],
          ask: "How many different pairs of values (a, b) are there?",
          answer: A.number(p.sum - 1),
          wrong: wrongs(p.sum - 1, [
            {
              code: "ALG.SOLVE.WRONG-INVERSE",
              value: A.number(Math.floor(p.sum / 2)),
              feedback: `(1, ${p.sum - 1}) and (${p.sum - 1}, 1) are different pairs: a can be anything from 1 to ${p.sum - 1}.`,
            },
          ]),
          solution: [
            {
              say: `a can be 1, 2, …, ${p.sum - 1}, and each gives one value of b, so there are ${p.sum - 1} pairs.`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Rory says ",
            A.math(eq),
            " has only one pair of answers, ",
            A.math(`a = ${p.a0},\\ b = ${p.b0}`),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: `False. Other pairs work too, for example a = ${p.a0 + p.qb}, b = ${p.b0 - p.pa}: ${p.pa} × ${p.a0 + p.qb} + ${p.qb} × ${p.b0 - p.pa} = ${total}. An equation with two unknowns usually has many solutions.`,
              correct: true,
            },
            {
              text: "True. Every equation has exactly one answer.",
              code: "ALG.SOLVE.WRONG-INVERSE",
            },
            { text: "True. a and b must be equal." },
          ],
          solution: [{ say: `Choose a value for a, then find b. Each choice gives a pair.` }],
        });
    }
  },

  verify(p, question) {
    if (question.archetype !== "standard") return true;
    return question.key.depth === 1
      ? numberAnswer(question) === p.b0
      : numberAnswer(question) === p.sum - 1;
  },
});
