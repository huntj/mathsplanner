/**
 * @statement Y7-NPV-03.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-NPV-03.b: Calculate with decimals
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  m: number;
  k: number;
}

const r = (v: number) => Number(v.toFixed(6));

export default defineGenerator<Params>({
  id: "Y7-NPV-03.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.DECIMAL.POINT-PLACE", "FR.MULTIPLY.ALWAYS-BIGGER"],

  params(rng) {
    const p = {
      a: rng.int(1, 9),
      b: rng.int(1, 9),
      c: rng.int(1, 9),
      d: rng.int(1, 9),
      e: rng.int(1, 9),
      m: rng.int(12, 49),
      k: rng.int(3, 9),
    };
    if (p.m % 10 === 0) reject("a decimal with a non-zero tenths digit");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const x = Number(`${p.a}.${p.b}`);
        const y = Number(`${p.c}.${p.d}${p.e}`);
        const v = r(x + y);
        return A.standard({
          question: ["Work out ", A.math(`${x} + ${y}`), "."],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "NPV.DECIMAL.POINT-PLACE",
              value: A.number(r(Number(`${p.a}.0${p.b}`) + y)),
              feedback: `Line up the decimal points: ${x} is ${p.a}.${p.b}0.`,
            },
          ]),
          solution: [{ say: "", math: `${p.a}.${p.b}0 + ${y} = ${v}` }],
        });
      }
      case 2: {
        const x = p.m / 10;
        const v = r(x * p.k);
        return A.variedForm({
          rng,
          forms: [
            { question: ["Work out ", A.math(`${x} \\times ${p.k}`), "."] },
            {
              question: [`A ribbon is ${x} m long. Ola buys ${p.k} of them.`],
              ask: "What is the total length, in m?",
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "NPV.DECIMAL.POINT-PLACE",
              value: A.number(p.m * p.k),
              feedback: `Work out ${p.m} × ${p.k} = ${p.m * p.k}, then put back the one decimal place.`,
            },
            {
              code: "NPV.DECIMAL.POINT-PLACE",
              value: A.number(r((p.m * p.k) / 100)),
              feedback: `${x} has one decimal place, so the answer has one decimal place.`,
            },
          ]),
          solution: [{ say: "", math: `${p.m} \\times ${p.k} = ${p.m * p.k} \\Rightarrow ${v}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Lou says ",
            A.math(`${p.a}.5 \\div 0.5`),
            ` must be smaller than ${p.a}.5, because dividing makes numbers smaller.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. Dividing by a number less than 1 makes it bigger: ${p.a}.5 ÷ 0.5 = ${r((p.a + 0.5) * 2)}, the number of halves in ${p.a}.5.`,
              correct: true,
            },
            {
              text: "True. Division always gives a smaller answer.",
              code: "FR.MULTIPLY.ALWAYS-BIGGER",
            },
            { text: `True. It is ${r((p.a + 0.5) / 2)}.`, code: "NPV.DECIMAL.POINT-PLACE" },
          ],
          solution: [{ say: "Ask: how many 0.5s fit into the number?" }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === r(Number(`${p.a}.${p.b}`) + Number(`${p.c}.${p.d}${p.e}`));
    if (question.key.depth === 2) return numberAnswer(question) === r((p.m / 10) * p.k);
    return true;
  },
});
