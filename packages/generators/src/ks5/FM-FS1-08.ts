/**
 * @statement FM-FS1-08
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-FS1-08: Judge the quality of tests: Type I and Type II errors, size and power
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { binomialCdf, round } from "../shared/dist.ts";

const ERRORS = [
  "Rejecting H₀ when H₀ is true",
  "Not rejecting H₀ when H₀ is false",
  "Rejecting H₀ when H₀ is false",
];

interface Params {
  type: number;
  n: number;
  p0: number;
  p1: number;
  c: number;
}

const r4 = (v: number) => round(v, 4);
const upper = (n: number, p: number, c: number) => r4(1 - binomialCdf(n, p, c - 1));

export default defineGenerator<Params>({
  id: "FM-FS1-08",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.ERRORS"],

  params(rng) {
    const n = rng.int(10, 20);
    const p0 = rng.pick([0.2, 0.25, 0.3]);
    const p = {
      type: rng.int(0, 1),
      n,
      p0,
      p1: p0 + rng.pick([0.2, 0.25, 0.3]),
      c: Math.ceil(n * p0) + rng.int(2, 4),
    };
    if (p.c > n || upper(n, p0, p.c) < 0.001) reject("a critical region with a visible size");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = ERRORS[p.type] as string;
        return A.choice({
          rng,
          question: [`What is a Type ${p.type === 0 ? "I" : "II"} error?`],
          correct: right,
          distractors: ERRORS.filter((e) => e !== right).map((e, i) => ({
            content: e,
            code: "STA.ERRORS",
            feedback:
              i === 0 && e === ERRORS[1 - p.type]
                ? `That is a Type ${p.type === 0 ? "II" : "I"} error.`
                : "That is a correct decision, not an error.",
          })),
          solution: [{ say: "Type I: rejecting a true H₀. Type II: not rejecting a false H₀." }],
        });
      }
      case 2: {
        const size = upper(p.n, p.p0, p.c);
        const power = upper(p.n, p.p1, p.c);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `X ~ B(${p.n}, p). A test of H₀: p = ${p.p0} against H₁: p > ${p.p0} has critical region X ≥ ${p.c}. In fact, p = ${round(p.p1, 2)}.`,
              ],
              ask: "Find the size of the test, to 4 decimal places.",
            },
          ],
          answer: A.number(size, { accuracy: { dp: 4 } }),
          wrong: wrongs(size, [
            {
              code: "STA.ERRORS",
              value: A.number(power, { accuracy: { dp: 4 } }),
              feedback: `That is the power. The size is P(reject H₀ | H₀ true), using p = ${p.p0}.`,
            },
          ]),
          solution: [{ say: "", math: `P(X \\ge ${p.c} \\mid p = ${p.p0}) = ${size}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Uri says that lowering the significance level from 5% to 1% reduces the chances of both Type I and Type II errors.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. A smaller critical region makes a Type I error less likely but a Type II error more likely; only a bigger sample can reduce both.",
              correct: true,
            },
            {
              text: "True. A stricter test makes fewer mistakes of every kind.",
              code: "STA.ERRORS",
            },
            {
              text: "True. The significance level is the probability of any error.",
              code: "STA.ERRORS",
            },
          ],
          solution: [{ say: "The significance level is the probability of a Type I error only." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === ERRORS[p.type];
    if (question.key.depth === 2) return numberAnswer(question) === upper(p.n, p.p0, p.c);
    return true;
  },
});
