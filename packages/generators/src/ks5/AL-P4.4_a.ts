/**
 * @statement AL-P4.4.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P4.4.a: Find terms of arithmetic sequences
import * as A from "@mathsplanner/archetypes";
import {
  defineGenerator,
  reject,
  type GeneratorDefinition,
  type QuestionDraft,
} from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./AL-P4.4.ts";

interface Params {
  a: number;
  d: number;
  /** Depth 2: two known terms, the uth and vth. */
  u: number;
  v: number;
  n: number;
}

const term = (p: Params, k: number) => p.a + (k - 1) * p.d;

const own: GeneratorDefinition<Params> = {
  id: "AL-P4.4.a",
  version: "1.0.0",
  depths: [2, 4],
  misconceptions: ["ALG.SERIES.FORMULA"],

  params(rng) {
    const p = {
      a: rng.int(-10, 20),
      d: rng.int(-6, 9),
      u: rng.int(2, 5),
      v: rng.int(7, 12),
      n: rng.int(15, 40),
    };
    if (p.d === 0) reject("a changing sequence");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    if (depth === 2) {
      const ans = term(p, p.n);
      return A.standard({
        question: `The ${p.u}th term of an arithmetic sequence is ${term(p, p.u)} and the ${p.v}th term is ${term(p, p.v)}.`,
        ask: `Find the ${p.n}th term.`,
        answer: A.number(ans),
        wrong: signedWrongs(ans, [
          {
            code: "ALG.SERIES.FORMULA",
            value: A.number(p.a + p.n * p.d),
            feedback: "The nth term is a + (n − 1)d: the first term has had no differences added.",
          },
        ]),
        solution: [
          {
            say: `${p.v - p.u} differences take the term from ${term(p, p.u)} to ${term(p, p.v)}, so d = ${p.d} and a = ${p.a}.`,
          },
          {
            say: "",
            math: `u_{${p.n}} = ${p.a} + ${p.n - 1} \\times ${p.d < 0 ? `(${p.d})` : p.d} = ${ans}`,
          },
        ],
      });
    }
    return A.trueOrFalseWhy({
      rng,
      statement: `An arithmetic sequence has first term ${p.a} and common difference ${p.d}. Fay says its ${p.n}th term is ${p.a} + ${p.n} × ${p.d} = ${p.a + p.n * p.d}.`,
      truth: false,
      reasons: [
        {
          text: `False. The nth term is a + (n − 1)d, so it is ${p.a} + ${p.n - 1} × ${p.d} = ${term(p, p.n)}.`,
          correct: true,
        },
        { text: "True. The nth term is a + nd.", code: "ALG.SERIES.FORMULA" },
        {
          text: "True. Multiply the difference by the position and add the first term.",
          code: "ALG.SERIES.FORMULA",
        },
      ],
      solution: [{ say: "", math: `u_n = a + (n - 1)d` }],
    });
  },

  verify(p, question) {
    return question.key.depth !== 2 || numberAnswer(question) === term(p, p.n);
  },
};

export default defineGenerator(
  mixFamilies("AL-P4.4.a", { 1: { ...parent.definition, id: "AL-P4.4.a" }, 2: own, 4: own }),
);
