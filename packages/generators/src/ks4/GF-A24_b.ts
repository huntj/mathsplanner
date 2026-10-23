/**
 * @statement GF-A24.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-A24.b: Recognise arithmetic and simple geometric sequences
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

const TYPES = ["Arithmetic", "Geometric", "Neither"];

interface Params {
  type: number;
  a: number;
  d: number;
  r: number;
}

const terms = (p: Params) =>
  [0, 1, 2, 3].map((k) =>
    p.type === 0 ? p.a + k * p.d : p.type === 1 ? p.a * p.r ** k : p.a + k * k,
  );

export default defineGenerator<Params>({
  id: "GF-A24.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SEQUENCE.TYPE", "ALG.SEQUENCE.GEOMETRIC-ADD"],

  params(rng) {
    return { type: rng.int(0, 2), a: rng.int(1, 6), d: rng.int(2, 9), r: rng.int(2, 4) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = TYPES[p.type] as string;
        return A.choice({
          rng,
          question: [`What type of sequence is ${terms(p).join(", ")}, …?`],
          correct: right,
          distractors: TYPES.filter((t) => t !== right).map((t) => ({
            content: t,
            code: "ALG.SEQUENCE.TYPE",
            feedback:
              "Arithmetic: the same difference each time. Geometric: the same multiplier each time.",
          })),
          solution: [
            {
              say:
                p.type === 0
                  ? `It goes up by ${p.d} each time.`
                  : p.type === 1
                    ? `Each term is ${p.r} times the one before.`
                    : "The differences change and there is no common multiplier.",
            },
          ],
        });
      }
      case 2: {
        const t = [0, 1, 2, 3].map((k) => p.a * p.r ** k);
        const v = p.a * p.r ** 4;
        return A.variedForm({
          rng,
          forms: [
            { question: [`Find the next term of the geometric sequence ${t.join(", ")}, …`] },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "ALG.SEQUENCE.GEOMETRIC-ADD",
              value: A.number((t[3] ?? 0) + ((t[3] ?? 0) - (t[2] ?? 0))),
              feedback: `Multiply by ${p.r} each time; do not add the last difference.`,
            },
          ]),
          solution: [{ say: `${t[3]} × ${p.r} = ${v}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Fay says ${[0, 1, 2, 3].map((k) => p.a * 2 ** k).join(", ")}, … is an arithmetic sequence because it goes up each time.`,
          ],
          truth: false,
          reasons: [
            {
              text: "False. The differences are not equal; each term is double the one before, so it is geometric.",
              correct: true,
            },
            { text: "True. Any increasing sequence is arithmetic.", code: "ALG.SEQUENCE.TYPE" },
            {
              text: "True. It goes up by the same amount each time.",
              code: "ALG.SEQUENCE.GEOMETRIC-ADD",
            },
          ],
          solution: [{ say: "Check the differences: they double too." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === TYPES[p.type];
    if (question.key.depth === 2) return numberAnswer(question) === p.a * p.r ** 4;
    return true;
  },
});
