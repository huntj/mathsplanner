/**
 * @statement Y7-RAT-01.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-RAT-01.c: Convert units of time
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  h: number;
  m: number;
  q: number;
}

export default defineGenerator<Params>({
  id: "Y7-RAT-01.c",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["MEA.TIME.DECIMAL"],

  params(rng) {
    return { h: rng.int(1, 5), m: rng.int(5, 55), q: rng.pick([25, 5, 75]) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = 60 * p.h + p.m;
        return A.standard({
          question: [`A film lasts ${p.h} hour${p.h === 1 ? "" : "s"} ${p.m} minutes.`],
          ask: "How many minutes is that?",
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "MEA.TIME.DECIMAL",
              value: A.number(100 * p.h + p.m),
              feedback: "There are 60 minutes in an hour, not 100.",
            },
          ]),
          solution: [{ say: "", math: `${p.h} \\times 60 + ${p.m} = ${v}` }],
        });
      }
      case 2: {
        const frac = p.q / 100;
        const v = 60 * p.h + 60 * frac;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`A journey takes ${p.h}.${p.q} hours.`],
              ask: "How many minutes is that?",
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "MEA.TIME.DECIMAL",
              value: A.number(60 * p.h + p.q),
              feedback: `0.${p.q} of an hour is 0.${p.q} × 60 = ${60 * frac} minutes, not ${p.q}.`,
            },
          ]),
          solution: [{ say: "", math: `${p.h}.${p.q} \\times 60 = ${v}` }],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: ["Joe says 1.5 hours is 1 hour 50 minutes."],
              truth: false,
              reasons: [
                {
                  text: "False. 0.5 of an hour is half of 60 minutes, which is 30 minutes: 1.5 hours = 1 hour 30 minutes.",
                  correct: true,
                },
                {
                  text: "True. The digits after the point are the minutes.",
                  code: "MEA.TIME.DECIMAL",
                },
                { text: "True. An hour has 100 minutes.", code: "MEA.TIME.DECIMAL" },
              ],
              solution: [{ say: "Multiply the decimal part of an hour by 60." }],
            }),
          [
            {
              statement: "Una says 2.25 hours is 2 hours 15 minutes.",
              truth: true,
              right: "True. 0.25 of an hour is a quarter of 60 minutes, which is 15 minutes.",
              wrong: [
                [
                  "False. It is 2 hours 25 minutes: the digits after the point are the minutes.",
                  "MEA.TIME.DECIMAL",
                ],
                ["False. An hour has 100 minutes.", "MEA.TIME.DECIMAL"],
              ],
            },
            {
              statement: `Vic says ${p.h} hours ${p.m} minutes is ${p.h}.${p.m} hours.`,
              truth: false,
              right: `False. ${p.m} minutes is ${p.m}/60 of an hour, not ${p.m}/100.`,
              wrong: [
                ["True. The minutes go after the decimal point.", "MEA.TIME.DECIMAL"],
                ["True. Time is written like money.", "MEA.TIME.DECIMAL"],
              ],
            },
            {
              claim:
                "A number of hours with one decimal place, such as 1.7 hours, is a whole number of minutes.",
              truth: "always",
              right:
                "Always. Each tenth of an hour is 6 minutes, so 1.7 hours = 1 hour 42 minutes.",
              wrong: [
                ["Never. Decimal hours never come to whole minutes.", "MEA.TIME.DECIMAL"],
                ["Sometimes. Only for 0.5 hours.", "MEA.TIME.DECIMAL"],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === 60 * p.h + p.m;
    if (question.key.depth === 2) return numberAnswer(question) === 60 * p.h + (60 * p.q) / 100;
    return true;
  },
});
