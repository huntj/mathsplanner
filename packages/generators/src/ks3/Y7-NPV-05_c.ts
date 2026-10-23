/**
 * @statement Y7-NPV-05.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-NPV-05.c: Use reciprocals
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { exactAnswer, numberAnswer } from "../shared/counting.ts";

const DECIMALS: [string, number][] = [
  ["0.5", 2],
  ["0.25", 4],
  ["0.2", 5],
  ["0.125", 8],
  ["0.1", 10],
  ["0.05", 20],
];

interface Params {
  n: number;
  d: number;
}

export default defineGenerator<Params>({
  id: "Y7-NPV-05.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.RECIPROCAL.NEGATIVE"],

  params(rng) {
    return { n: rng.int(2, 12), d: rng.int(0, DECIMALS.length - 1) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: [`Write down the reciprocal of ${p.n}.`],
          answer: A.exact(frac(1, p.n)),
          wrong: [
            {
              code: "NPV.RECIPROCAL.NEGATIVE",
              value: A.exact(String(-p.n)),
              feedback: `The reciprocal of ${p.n} is 1 ÷ ${p.n}, not −${p.n}.`,
            },
          ],
          solution: [{ say: "", math: `1 \\div ${p.n} = ${toLatex(frac(1, p.n))}` }],
        });
      case 2: {
        const [dec, v] = DECIMALS[p.d] ?? ["0.5", 2];
        return A.variedForm({
          rng,
          forms: [{ question: [`Find the reciprocal of ${dec}.`] }],
          answer: A.number(v),
          wrong: signedWrongs(v, [
            {
              code: "NPV.RECIPROCAL.NEGATIVE",
              value: A.number(-Number(dec)),
              feedback: `Work out 1 ÷ ${dec}: how many ${dec}s make 1?`,
            },
          ]),
          solution: [{ say: "", math: `1 \\div ${dec} = ${v}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [`Ivy says that ${p.n} multiplied by its reciprocal always gives 1.`],
          truth: true,
          reasons: [
            {
              text: `True. ${p.n} × 1/${p.n} = ${p.n}/${p.n} = 1. Any non-zero number times its reciprocal is 1.`,
              correct: true,
            },
            { text: `False. ${p.n} × (−${p.n}) is negative.`, code: "NPV.RECIPROCAL.NEGATIVE" },
            { text: "False. It gives 0.", code: "NPV.RECIPROCAL.NEGATIVE" },
          ],
          solution: [{ say: "That is what makes it the reciprocal." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return exactAnswer(question) === toLatex(frac(1, p.n));
    if (question.key.depth === 2) return numberAnswer(question) === (DECIMALS[p.d]?.[1] ?? 2);
    return true;
  },
});
