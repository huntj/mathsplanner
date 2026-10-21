/**
 * @statement GF-P4
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-P4: Apply the property that the probabilities of an exhaustive set of outcomes sum to one;
// apply the property that the probabilities of an exhaustive set of mutually exclusive events sum to
// one
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { tableLatex } from "../shared/sta.ts";

interface Params {
  a: number;
  b: number;
  k: number;
  trials: number;
}

const dec = (h: number) => String(h / 100);

export default defineGenerator<Params>({
  id: "GF-P4",
  version: "1.0.0",
  depths: [1, 2, 5],
  misconceptions: ["PRO.COMPLEMENT", "PRO.EXPECTED.DIVIDE", "AS.MULTISTEP.ONE-STEP"],

  params(rng) {
    const a = rng.int(5, 30);
    const b = rng.int(5, 30);
    const k = rng.int(2, 4);
    const rest = 100 - a - b;
    if (rest <= 0 || rest % (k + 1) !== 0 || a === b) reject("a rest that splits into x and kx");
    return { a, b, k, trials: rng.pick([100, 200, 400, 500]) };
  },

  build(p, depth, rng): QuestionDraft {
    const rest = 100 - p.a - p.b;
    const x = rest / (p.k + 1);
    // tableLatex puts string cells in \text, so the algebra cells are spliced in as maths.
    const table = (cells: string[]) =>
      tableLatex(["colour", "red", "blue", "green", "yellow"], [["probability", "#"]]).replace(
        "\\text{#}",
        cells.join(" & "),
      );
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "A spinner lands on red, blue, green or yellow.",
            A.displayMath(table([dec(p.a), dec(p.b), "x", `${p.k}x`])),
          ],
          ask: "Work out the value of x.",
          answer: A.number(x / 100),
          wrong: wrongs(x / 100, [
            {
              code: "PRO.COMPLEMENT",
              value: A.number(rest / 100),
              feedback: `x + ${p.k}x = ${p.k + 1}x makes up the rest; divide by ${p.k + 1}.`,
            },
          ]),
          solution: [
            {
              say: `${dec(p.a)} + ${dec(p.b)} + ${p.k + 1}x = 1, so ${p.k + 1}x = ${rest / 100} and x = ${x / 100}.`,
            },
          ],
        });
      case 2: {
        const notRed = (100 - p.a) / 100;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "A spinner lands on red, blue, green or yellow.",
                A.displayMath(table([dec(p.a), dec(p.b), "x", `${p.k}x`])),
              ],
              ask: "What is the probability that it does not land on red?",
            },
          ],
          answer: A.number(notRed),
          wrong: wrongs(notRed, [
            {
              code: "PRO.COMPLEMENT",
              value: A.number(p.b / 100),
              feedback: "Not red means any of the other three colours: 1 − P(red).",
            },
          ]),
          solution: [{ say: `1 − ${dec(p.a)} = ${notRed}.` }],
        });
      }
      default: {
        const yellow = (p.k * x) / 100;
        return A.multiStepContext({
          context: [
            "A spinner lands on red, blue, green or yellow.",
            A.displayMath(table([dec(p.a), dec(p.b), "x", `${p.k}x`])),
          ],
          parts: [
            {
              ask: "Work out the probability of yellow.",
              answer: A.number(yellow),
              wrong: wrongs(yellow, [
                {
                  code: "AS.MULTISTEP.ONE-STEP",
                  value: A.number(x / 100),
                  feedback: `That is x. Yellow is ${p.k}x.`,
                },
              ]),
            },
            {
              ask: `The spinner is spun ${p.trials} times. How many times would you expect yellow?`,
              answer: A.number(Math.round(yellow * p.trials * 100) / 100),
              wrong: wrongs(Math.round(yellow * p.trials * 100) / 100, [
                {
                  code: "PRO.EXPECTED.DIVIDE",
                  value: A.number(Math.round((p.trials / yellow) * 100) / 100),
                  feedback: "Multiply the probability by the number of spins.",
                },
              ]),
            },
          ],
          solution: [
            { say: `x = ${x / 100}, so yellow = ${p.k}x = ${yellow}.` },
            { say: `${yellow} × ${p.trials} = ${Math.round(yellow * p.trials * 100) / 100}.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const x = (100 - p.a - p.b) / (p.k + 1);
    if (question.archetype === "multi-step-context")
      return Math.abs(numberAnswer(question) - (p.k * x) / 100) < 1e-9;
    const n = numberAnswer(question);
    return Math.abs(n - x / 100) < 1e-9 || Math.abs(n - (100 - p.a) / 100) < 1e-9;
  },
});
