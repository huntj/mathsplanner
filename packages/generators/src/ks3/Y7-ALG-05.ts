/**
 * @statement Y7-ALG-05
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y7-ALG-05: Generate terms of a sequence from a term-to-term or position-to-term rule
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** nth term a·n + b. */
  a: number;
  b: number;
  n: number;
  /** Term-to-term: start, × m then + c. */
  start: number;
  m: number;
  c: number;
}

const linear = (a: number, b: number) => `${a}n ${b < 0 ? "-" : "+"} ${Math.abs(b)}`;

export default defineGenerator<Params>({
  id: "Y7-ALG-05",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SEQUENCE.POSITION-RULE", "ALG.SOLVE.WRONG-INVERSE"],

  params(rng, numbers) {
    const a = rng.int(2, numbers === "friendly" ? 5 : 9);
    const b = rng.int(1, 12) * (numbers === "friendly" ? 1 : rng.pick([1, -1]));
    const n = rng.int(5, numbers === "stretch" ? 100 : 20);
    if (a + b <= 0 || a === Math.abs(b)) reject("positive terms; a ≠ |b|");
    return { a, b, n, start: rng.int(1, 6), m: rng.int(2, 3), c: rng.int(-3, 3) };
  },

  build(p, depth, rng): QuestionDraft {
    const rule = linear(p.a, p.b);
    const term = (k: number) => p.a * k + p.b;
    switch (depth) {
      case 1:
        return A.standard({
          question: ["The nth term of a sequence is ", A.math(rule), "."],
          ask: `Find the ${p.n}th term.`,
          answer: A.number(term(p.n)),
          wrong: wrongs(term(p.n), [
            {
              code: "ALG.SEQUENCE.POSITION-RULE",
              value: A.number(term(1) + p.n * p.a),
              feedback: `Put n = ${p.n} into the rule: ${p.a} × ${p.n} ${p.b < 0 ? "−" : "+"} ${Math.abs(p.b)}.`,
            },
          ]),
          solution: [
            { say: `${p.a} × ${p.n} ${p.b < 0 ? "−" : "+"} ${Math.abs(p.b)} = ${term(p.n)}.` },
          ],
        });
      case 2: {
        const target = term(p.n);
        return A.reverse({
          question: ["The nth term of a sequence is ", A.math(rule), "."],
          ask: `Which term is equal to ${target}?`,
          answer: A.number(p.n),
          wrong: wrongs(p.n, [
            {
              code: "ALG.SOLVE.WRONG-INVERSE",
              value: A.number((target + p.b) / p.a),
              feedback: `Solve ${rule} = ${target}: ${p.b < 0 ? "add" : "subtract"} ${Math.abs(p.b)}, then divide by ${p.a}.`,
            },
          ]),
          solution: [{ say: `${rule} = ${target}, so ${p.a}n = ${target - p.b} and n = ${p.n}.` }],
        });
      }
      default: {
        const shown = [1, 2, 3, 4].map(term).join(", ");
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Zac says the sequence with nth term ",
            A.math(rule),
            ` goes up by ${Math.abs(p.b)} each time.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. The terms are ${shown}, …: they go up by ${p.a}, the number multiplying n.`,
              correct: true,
            },
            {
              text: `True. The ${p.b < 0 ? "−" : "+"}${Math.abs(p.b)} tells you how much to add each time.`,
              code: "ALG.SEQUENCE.POSITION-RULE",
            },
            { text: "True. Sequences always go up by the last number in the rule." },
          ],
          solution: [{ say: `Each time n goes up by 1, ${p.a}n goes up by ${p.a}.` }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return numberAnswer(question) === p.a * p.n + p.b;
    if (question.archetype === "reverse") return numberAnswer(question) === p.n;
    return p.a !== Math.abs(p.b);
  },
});
