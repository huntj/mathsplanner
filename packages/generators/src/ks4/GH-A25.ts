/**
 * @statement GH-A25
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GH-A25: Find the nth term of quadratic sequences
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { poly } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** an² + bn + c. */
  a: number;
  b: number;
  c: number;
}

const u = (p: Params, n: number) => p.a * n * n + p.b * n + p.c;
const terms = (p: Params, k: number) => Array.from({ length: k }, (_, i) => u(p, i + 1));

/** The nth term found by someone who takes the whole second difference as the n² coefficient. */
function halfSlip(p: Params): string {
  const a2 = 2 * p.a;
  const r1 = u(p, 1) - a2;
  const r2 = u(p, 2) - 4 * a2;
  const b = r2 - r1;
  return poly([a2, b, r1 - b], "n");
}

export default defineGenerator<Params>({
  id: "GH-A25",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SEQUENCE.QUADRATIC-HALF", "ALG.SEQUENCE.TYPE"],

  params(rng) {
    const p = { a: rng.int(1, 3), b: rng.int(-5, 5), c: rng.int(-6, 6) };
    if (p.b === 0 || p.c === 0) reject("three terms in the nth term");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const seq = terms(p, 5).join(", ");
    switch (depth) {
      case 1:
        return A.standard({
          question: `Here are the first five terms of a quadratic sequence: ${seq}.`,
          ask: "Find an expression for the nth term.",
          answer: A.exact(poly([p.a, p.b, p.c], "n"), "expanded"),
          wrong: [
            {
              code: "ALG.SEQUENCE.QUADRATIC-HALF",
              value: A.exact(halfSlip(p)),
              feedback: `The second difference is ${2 * p.a}, so the coefficient of n² is half of it: ${p.a}.`,
            },
          ],
          solution: [
            {
              say: `Second difference ${2 * p.a}, so the sequence starts ${p.a === 1 ? "" : p.a}n².`,
            },
            {
              say: `Subtract ${p.a === 1 ? "" : p.a}n² to leave ${[1, 2, 3].map((n) => u(p, n) - p.a * n * n).join(", ")}, …, which is ${poly([p.b, p.c], "n")}.`,
            },
            { say: "", math: poly([p.a, p.b, p.c], "n") },
          ],
        });
      case 2: {
        const t = terms(p, 5);
        const last = (t[4] ?? 0) - (t[3] ?? 0);
        return A.variedForm({
          rng,
          forms: [
            { question: `A quadratic sequence begins ${seq}.`, ask: "Work out the 6th term." },
            {
              question: `The first five terms of a sequence with a constant second difference are ${seq}.`,
              ask: "What is the next term?",
            },
          ],
          answer: A.number(u(p, 6)),
          wrong: [
            {
              code: "ALG.SEQUENCE.TYPE",
              value: A.number((t[4] ?? 0) + last),
              feedback: `The differences go up by ${2 * p.a} each time, so the next difference is ${last + 2 * p.a}.`,
            },
          ],
          solution: [
            {
              say: `The next difference is ${last} + ${2 * p.a} = ${last + 2 * p.a}, so the 6th term is ${t[4]} + ${last + 2 * p.a} = ${u(p, 6)}.`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `The sequence ${seq} has a second difference of ${2 * p.a}. Lily says its nth term begins ${2 * p.a}n².`,
          truth: false,
          reasons: [
            {
              text: `False. an² has a second difference of 2a, so a = ${2 * p.a} ÷ 2 = ${p.a}.`,
              correct: true,
            },
            {
              text: "True. The second difference is the coefficient of n².",
              code: "ALG.SEQUENCE.QUADRATIC-HALF",
            },
            {
              text: "False. The first difference gives the coefficient of n².",
              code: "ALG.SEQUENCE.TYPE",
            },
          ],
          solution: [
            {
              say: `n² gives 1, 4, 9, 16, … with second difference 2, so halve the second difference.`,
            },
          ],
        });
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (question.key.depth === 1)
      return a?.type === "exact" && a.value === poly([p.a, p.b, p.c], "n");
    if (question.key.depth === 2) return numberAnswer(question) === u(p, 6);
    return true;
  },
});
