/**
 * @statement Y6-FR-09
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-FR-09: Use written division methods in cases where the answer has up to two decimal places
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  n: number;
  d: number;
}

/** n ÷ d when the answer stops within two decimal places. */
const quotient = (n: number, d: number) => Number(((n * 100) / d / 100).toFixed(2));

export default defineGenerator<Params>({
  id: "Y6-FR-09",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MD.REMAINDER.AS-DECIMAL"],

  params(rng, numbers) {
    const d = rng.pick(
      numbers === "friendly" ? [2, 4, 5] : numbers === "standard" ? [4, 5, 8] : [8, 16, 20, 25],
    );
    const n = rng.int(d + 1, numbers === "stretch" ? 999 : 99);
    if (n % d === 0 || (n * 100) % d !== 0) reject("an answer with one or two decimal places");
    if (n % d >= 10) reject("a remainder that could be misread as tenths");
    return { n, d };
  },

  build(p, depth, rng): QuestionDraft {
    const answer = quotient(p.n, p.d);
    const q = Math.floor(p.n / p.d);
    const r = p.n % p.d;
    const slip = Number(`${q}.${r}`);
    const how = `${p.n} ÷ ${p.d} = ${q} remainder ${r}. Carry on past the point: ${r} is ${r * 10} tenths, and ${r * 10} ÷ ${p.d} = ${Math.floor((r * 10) / p.d)}${(r * 10) % p.d ? ` remainder ${(r * 10) % p.d}, then ${((r * 10) % p.d) * 10} hundredths ÷ ${p.d} = ${(((r * 10) % p.d) * 10) / p.d}` : ""}. So ${p.n} ÷ ${p.d} = ${answer}.`;
    const wrong = wrongs(answer, [
      slip !== answer
        ? {
            code: "MD.REMAINDER.AS-DECIMAL",
            value: A.number(slip),
            feedback: `A remainder of ${r} is not ${r} tenths. Divide it too: ${r} ÷ ${p.d} = ${(answer - q).toFixed(2).replace(/0$/, "")}.`,
          }
        : undefined,
    ]);
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "Use written division to work out ",
            A.math(`${p.n} \\div ${p.d}`),
            ". Give your answer as a decimal.",
          ],
          answer: A.number(answer),
          wrong,
          solution: [{ say: how }],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: `£${p.n} is shared equally between ${p.d} people.`,
              ask: "How much does each person get, in pounds?",
            },
            {
              question: `A rope ${p.n} m long is cut into ${p.d} equal pieces.`,
              ask: "How long is each piece, in metres?",
            },
          ],
          answer: A.number(answer),
          wrong,
          solution: [{ say: how }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Leo says ",
            A.math(`${p.n} \\div ${p.d} = ${slip}`),
            `, because the answer is ${q} remainder ${r}.`,
          ],
          truth: slip === answer,
          reasons: [
            {
              text: `False. The remainder ${r} must be divided by ${p.d} too. ${how}`,
              correct: true,
            },
            {
              text: "True. The remainder goes after the decimal point.",
              code: "MD.REMAINDER.AS-DECIMAL",
            },
            { text: "True. Remainders are always tenths." },
          ],
          solution: [{ say: how }],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "true-or-false-why")
      return Number(`${Math.floor(p.n / p.d)}.${p.n % p.d}`) !== p.n / p.d;
    return Math.abs(numberAnswer(question) - p.n / p.d) < 1e-9;
  },
});
