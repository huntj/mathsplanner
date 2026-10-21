/**
 * @statement Y8-PRO-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y8-PRO-01: Understand that the probabilities of all possible outcomes sum to 1 and use this to find
// missing probabilities
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** Known probabilities of A and B, in hundredths; C and D share the rest as x and k·x. */
  a: number;
  b: number;
  k: number;
  trials: number;
}

const dec = (h: number) => String(h / 100);
const table = (cells: string[]) =>
  `\\begin{array}{|c|c|c|c|c|}\\hline \\text{outcome} & A & B & C & D \\\\ \\hline \\text{probability} & ${cells.join(" & ")} \\\\ \\hline\\end{array}`;

export default defineGenerator<Params>({
  id: "Y8-PRO-01",
  version: "1.0.0",
  depths: [1, 2, 5],
  misconceptions: ["PRO.COMPLEMENT", "AS.MULTISTEP.ONE-STEP"],

  params(rng, numbers) {
    const a = rng.int(5, 30);
    const b = rng.int(5, 30);
    const k = rng.int(2, numbers === "friendly" ? 2 : 4);
    const rest = 100 - a - b;
    if (rest % (k + 1) !== 0 || rest % 2 !== 0 || rest <= 0 || a === b)
      reject("a rest that splits into x and kx, and into halves");
    return { a, b, k, trials: rng.pick([100, 200, 300, 400, 500]) };
  },

  build(p, depth): QuestionDraft {
    const rest = 100 - p.a - p.b;
    const x = rest / (p.k + 1);
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "The table shows some probabilities for a spinner. C and D are equally likely.",
            A.displayMath(table([dec(p.a), dec(p.b), "x", "x"])),
          ],
          ask: "Find x.",
          answer: A.number(rest / 200),
          wrong: wrongs(rest / 200, [
            {
              code: "PRO.COMPLEMENT",
              value: A.number(rest / 100),
              feedback: "That is C and D together. They share it equally.",
            },
          ]),
          solution: [
            {
              say: `${dec(p.a)} + ${dec(p.b)} + 2x = 1, so 2x = ${dec(rest)} and x = ${rest / 200}.`,
            },
          ],
        });
      case 2:
        return A.standard({
          question: [
            "The table shows some probabilities for a spinner. D is ",
            String(p.k),
            " times as likely as C.",
            A.displayMath(table([dec(p.a), dec(p.b), "x", `${p.k}x`])),
          ],
          ask: "Find the probability of D.",
          answer: A.number((p.k * x) / 100),
          wrong: wrongs((p.k * x) / 100, [
            {
              code: "AS.MULTISTEP.ONE-STEP",
              value: A.number(x / 100),
              feedback: `That is x, the probability of C. D is ${p.k}x.`,
            },
          ]),
          solution: [
            {
              say: `${dec(p.a)} + ${dec(p.b)} + ${p.k + 1}x = 1, so ${p.k + 1}x = ${dec(rest)}, x = ${dec(x)}, and D = ${p.k}x = ${dec(p.k * x)}.`,
            },
          ],
        });
      default: {
        const pd = (p.k * x) / 100;
        return A.multiStepContext({
          context: [
            "The table shows the probabilities for a spinner. D is ",
            String(p.k),
            " times as likely as C.",
            A.displayMath(table([dec(p.a), dec(p.b), "x", `${p.k}x`])),
          ],
          parts: [
            { ask: "Find the probability of D.", answer: A.number(pd) },
            {
              ask: `The spinner is spun ${p.trials} times. About how many times would you expect it to land on D?`,
              answer: A.number(pd * p.trials),
              wrong: wrongs(pd * p.trials, [
                {
                  code: "AS.MULTISTEP.ONE-STEP",
                  value: A.number((x / 100) * p.trials),
                  feedback: "Use the probability of D, not of C.",
                },
              ]),
            },
          ],
          solution: [
            { say: `x = ${dec(x)}, so P(D) = ${dec(p.k * x)}.` },
            { say: `Expected number = ${dec(p.k * x)} × ${p.trials} = ${pd * p.trials}.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const x = (100 - p.a - p.b) / (p.k + 1);
    if (question.archetype === "multi-step-context")
      return Math.abs(numberAnswer(question, 1) - ((p.k * x) / 100) * p.trials) < 1e-9;
    return (
      Math.abs(
        numberAnswer(question) -
          (question.key.depth === 1 ? (100 - p.a - p.b) / 200 : (p.k * x) / 100),
      ) < 1e-9
    );
  },
});
