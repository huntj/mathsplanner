/**
 * @statement Y1-AS-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y1-AS-03: Add and subtract one-digit and two-digit numbers to 20, including zero
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { NumberLineSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

export interface Params {
  a: number;
  b: number;
  add: boolean;
}

const count = (from: number, to: number) => {
  const step = to >= from ? 1 : -1;
  return Array.from({ length: Math.abs(to - from) + 1 }, (_, i) => from + i * step);
};

export default defineGenerator<Params>({
  id: "Y1-AS-03",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["AS.COUNT-ON.INCLUDES-START"],

  params(rng, numbers) {
    const a = rng.int(numbers === "friendly" ? 2 : 5, numbers === "friendly" ? 10 : 19);
    const b = rng.bool(0.15) ? 0 : rng.int(2, numbers === "stretch" ? 9 : 5);
    const add = rng.bool();
    if (add ? a + b > 20 : b > a) reject("answers from 0 to 20");
    return { a, b, add };
  },

  build(p, depth, rng): QuestionDraft {
    const answer = p.add ? p.a + p.b : p.a - p.b;
    const sign = p.add ? "+" : "-";
    const word = p.add ? "+" : "−";
    const slip = p.add ? answer - 1 : answer + 1;
    const wrong = wrongs(answer, [
      p.b > 0
        ? {
            code: "AS.COUNT-ON.INCLUDES-START",
            value: A.number(slip),
            feedback: `Start at ${p.a} and count ${p.add ? "on" : "back"} ${p.b}, not counting ${p.a} itself.`,
          }
        : undefined,
    ]);
    const solution = [
      p.b === 0
        ? {
            say: `${p.add ? "Adding" : "Taking away"} 0 leaves the number the same: ${p.a} ${word} 0 = ${p.a}.`,
          }
        : {
            say: `Start at ${p.a} and count ${p.add ? "on" : "back"} ${p.b}: ${count(p.a, answer).slice(1).join(", ")}. So ${p.a} ${word} ${p.b} = ${answer}.`,
          },
    ];
    switch (depth) {
      case 1:
        return A.standard({
          question: [A.math(`${p.a} ${sign} ${p.b}`)],
          ask: "Work it out.",
          answer: A.number(answer),
          wrong,
          solution,
        });
      case 2: {
        const line: NumberLineSpec = {
          type: "number-line",
          min: 0,
          max: 20,
          step: 1,
          labels: [0, 5, 10, 15, 20].map((v) => ({ value: v, label: String(v) })),
          points: [{ value: p.a, label: String(p.a) }],
          ...(p.b > 0
            ? {
                jumps: count(p.a, answer)
                  .slice(1)
                  .map((to) => ({ from: to - (p.add ? 1 : -1), to })),
              }
            : {}),
        };
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `Jo works out `,
                A.math(`${p.a} ${sign} ${p.b}`),
                ` on a number line.`,
                A.figure(line),
              ],
              ask: "Where does she land?",
            },
            {
              question: p.add
                ? `What is ${p.b} more than ${p.a}?`
                : `What is ${p.b} less than ${p.a}?`,
            },
          ],
          answer: A.number(answer),
          wrong,
          solution,
        });
      }
      default: {
        if (p.b === 0) {
          return A.trueOrFalseWhy({
            rng,
            statement: ["Max says ", A.math(`${p.a} ${sign} 0 = 0`), "."],
            truth: false,
            reasons: [
              {
                text: `False. ${p.add ? "Adding" : "Taking away"} nothing leaves ${p.a}, so the answer is ${p.a}.`,
                correct: true,
              },
              { text: "True. Any sum with a 0 in it is 0." },
              { text: `True. 0 is the smallest number, so the answer is 0.` },
            ],
            solution,
          });
        }
        const said = count(p.a, slip);
        return A.spotTheMistake({
          question: ["Ben counts to work out ", A.math(`${p.a} ${sign} ${p.b}`), "."],
          lines: [
            `Start at ${p.a}.`,
            `Count ${p.add ? "on" : "back"} ${p.b}: ${said.join(", ")}.`,
            `So ${p.a} ${word} ${p.b} = ${slip}.`,
          ],
          mistake: 1,
          code: "AS.COUNT-ON.INCLUDES-START",
          feedback: `Ben said ${p.a} as one of his counts. Start counting from the next number: ${count(p.a, answer).slice(1).join(", ")}. The answer is ${answer}.`,
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard" || question.archetype === "varied-form")
      return numberAnswer(question) === (p.add ? p.a + p.b : p.a - p.b);
    return true;
  },
});
