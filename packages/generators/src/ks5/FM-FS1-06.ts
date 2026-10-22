/**
 * @statement FM-FS1-06
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-FS1-06: Use chi-squared tests for goodness of fit and for contingency tables
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { round } from "../shared/dist.ts";

interface Params {
  r: number;
  c: number;
  o: number;
  e: number;
}

const contribution = (o: number, e: number) => round((o - e) ** 2 / e, 3);

export default defineGenerator<Params>({
  id: "FM-FS1-06",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.CHI-SQUARED"],

  params(rng) {
    const p = {
      r: rng.int(2, 4),
      c: rng.int(2, 5),
      o: rng.int(8, 60),
      e: rng.int(10, 50) + rng.pick([0, 0.5]),
    };
    if (p.o === p.e || Math.abs(p.o - p.e) < 2)
      reject("a clear difference between observed and expected");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = (p.r - 1) * (p.c - 1);
        return A.standard({
          question: [
            `A chi-squared test for independence uses a contingency table with ${p.r} rows and ${p.c} columns. No cells are combined.`,
          ],
          ask: "How many degrees of freedom are there?",
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "STA.CHI-SQUARED",
              value: A.number(p.r * p.c - 1),
              feedback: "For a contingency table, ν = (r − 1)(c − 1).",
            },
          ]),
          solution: [{ say: "", math: `\\nu = (${p.r} - 1)(${p.c} - 1) = ${v}` }],
        });
      }
      case 2: {
        const v = contribution(p.o, p.e);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `In a chi-squared test, one cell has observed frequency ${p.o} and expected frequency ${p.e}.`,
              ],
              ask: "Find its contribution to the test statistic, to 3 decimal places.",
            },
          ],
          answer: A.number(v, { accuracy: { dp: 3 } }),
          wrong: wrongs(v, [
            {
              code: "STA.CHI-SQUARED",
              value: A.number(round((p.o - p.e) ** 2 / p.o, 3), { accuracy: { dp: 3 } }),
              feedback: "Divide by the expected frequency: (O − E)²/E.",
            },
          ]),
          solution: [{ say: "", math: `\\frac{(${p.o} - ${p.e})^2}{${p.e}} = ${v}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Sky carries out a chi-squared test where some expected frequencies are 2 and 3, and says the test is still valid.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. The chi-squared approximation needs every expected frequency to be at least 5, so small classes should be combined first (losing degrees of freedom).",
              correct: true,
            },
            {
              text: "True. Only the observed frequencies need to be at least 5.",
              code: "STA.CHI-SQUARED",
            },
            { text: "True. Any frequencies can be used.", code: "STA.CHI-SQUARED" },
          ],
          solution: [
            { say: "Combine adjacent classes until each expected frequency is 5 or more." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === (p.r - 1) * (p.c - 1);
    if (question.key.depth === 2) return numberAnswer(question) === contribution(p.o, p.e);
    return true;
  },
});
