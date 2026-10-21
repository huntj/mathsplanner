/**
 * @statement Y6-ALG-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-ALG-03: Express missing number problems algebraically
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  times: number;
  add: number;
  n: number;
  claimTrue: boolean;
}

export default defineGenerator<Params>({
  id: "Y6-ALG-03",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SOLVE.WRONG-INVERSE", "NPV.ORDER.LEFT-TO-RIGHT"],

  params(rng, numbers) {
    const times = rng.int(2, numbers === "friendly" ? 5 : 9);
    const add = rng.int(1, numbers === "stretch" ? 30 : 12);
    const n = rng.int(2, numbers === "stretch" ? 20 : 10);
    if (times === add || times === n) reject("different numbers");
    return { times, add, n, claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const total = p.times * p.n + p.add;
    const story = `I think of a number, n. I multiply it by ${p.times} and then add ${p.add}. The answer is ${total}.`;
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: story,
          ask: "Which equation shows this?",
          correct: A.math(`${p.times}n + ${p.add} = ${total}`),
          distractors: [
            {
              content: A.math(`${p.times}(n + ${p.add}) = ${total}`),
              code: "NPV.ORDER.LEFT-TO-RIGHT",
              feedback: `The number is multiplied first, then ${p.add} is added: ${p.times}n + ${p.add}.`,
            },
            {
              content: A.math(`n + ${p.times} + ${p.add} = ${total}`),
              feedback: `"Multiply by ${p.times}" is ${p.times}n, not n + ${p.times}.`,
            },
            {
              content: A.math(`${p.add}n + ${p.times} = ${total}`),
              feedback: `n is multiplied by ${p.times}, and ${p.add} is added.`,
            },
          ],
          solution: [
            {
              say: `n × ${p.times} is ${p.times}n; then add ${p.add}: ${p.times}n + ${p.add} = ${total}.`,
            },
          ],
        });
      case 2:
        return A.standard({
          question: ["Solve ", A.math(`${p.times}n + ${p.add} = ${total}`), "."],
          ask: ["Find n."],
          answer: A.number(p.n),
          wrong: wrongs(p.n, [
            {
              code: "ALG.SOLVE.WRONG-INVERSE",
              value: A.number((total + p.add) / p.times),
              feedback: `Undo adding ${p.add} by subtracting ${p.add}, then undo × ${p.times} by dividing.`,
            },
          ]),
          solution: [
            {
              say: `${total} − ${p.add} = ${total - p.add}, then ${total - p.add} ÷ ${p.times} = ${p.n}.`,
            },
          ],
        });
      default: {
        const said = p.claimTrue ? p.n : (total - p.add) * p.times;
        return A.trueOrFalseWhy({
          rng,
          statement: [`${story} Leo says n = ${said}.`],
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                { text: `True. ${p.times} × ${p.n} + ${p.add} = ${total}.`, correct: true },
                {
                  text: `False. Multiply ${total - p.add} by ${p.times} to undo it.`,
                  code: "ALG.SOLVE.WRONG-INVERSE",
                },
                { text: "False. There is no way to find n." },
              ]
            : [
                {
                  text: `False. Undo × ${p.times} by dividing, not multiplying: (${total} − ${p.add}) ÷ ${p.times} = ${p.n}.`,
                  correct: true,
                },
                {
                  text: `True. Take away ${p.add} and multiply by ${p.times}.`,
                  code: "ALG.SOLVE.WRONG-INVERSE",
                },
                { text: "True. n must be bigger than the answer." },
              ],
          solution: [{ say: `Check: ${p.times} × ${p.n} + ${p.add} = ${total}.` }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard" && question.parts[0]?.answer.type === "choice")
      return chosenText(question) === `${p.times}n + ${p.add} = ${p.times * p.n + p.add}`;
    if (question.archetype === "standard") return numberAnswer(question) === p.n;
    return true;
  },
});
