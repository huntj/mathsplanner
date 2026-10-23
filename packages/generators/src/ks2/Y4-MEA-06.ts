/**
 * @statement Y4-MEA-06
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-MEA-06: Solve problems involving converting from hours to minutes; minutes to seconds; years to
// months; weeks to days
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

export interface Params {
  kind: number;
  big: number;
  small: number;
  film: number;
}

// [big unit, small unit, how many small in one big]
const KINDS: [string, string, number][] = [
  ["hours", "minutes", 60],
  ["minutes", "seconds", 60],
  ["years", "months", 12],
  ["weeks", "days", 7],
];

export default defineGenerator<Params>({
  id: "Y4-MEA-06",
  version: "1.0.0",
  depths: [1, 2, 5],
  misconceptions: ["MEA.TIME.DECIMAL", "MEA.TIME.FACTS"],

  params(rng, numbers) {
    const kind = rng.int(0, KINDS.length - 1);
    const per = ((KINDS[kind] ?? KINDS[0]) as (typeof KINDS)[number])[2];
    return {
      kind,
      big: rng.int(2, numbers === "friendly" ? 4 : 9),
      small: rng.int(1, per - 1),
      film: rng.int(7, 14) * 10 + rng.int(1, 9),
    };
  },

  build(p, depth): QuestionDraft {
    const [big, small, per] = (KINDS[p.kind] ?? KINDS[0]) as (typeof KINDS)[number];
    const total = p.big * per + p.small;
    switch (depth) {
      case 1:
        return A.standard({
          question: `How many ${small} are there in ${p.big} ${big} and ${p.small} ${small}?`,
          answer: A.number(total, { units: small }),
          wrong: wrongs(total, [
            {
              code: "MEA.TIME.DECIMAL",
              value: A.number(p.big * 100 + p.small, { units: small }),
              feedback: `There are ${per} ${small} in each of the ${big}, not 100.`,
            },
            {
              code: "MEA.TIME.FACTS",
              value: A.number(p.big * (per === 7 ? 5 : per === 12 ? 10 : 100) + p.small, {
                units: small,
              }),
              feedback: `1 ${big.replace(/s$/, "")} = ${per} ${small}.`,
            },
          ]),
          solution: [
            {
              say: `${p.big} × ${per} = ${p.big * per}, and ${p.big * per} + ${p.small} = ${total} ${small}.`,
            },
          ],
        });
      case 2:
        return A.reverse({
          question: `How many ${big} are there in ${p.big * per} ${small}?`,
          answer: A.number(p.big, { units: big }),
          wrong: wrongs(p.big, [
            {
              code: "MEA.TIME.DECIMAL",
              value: A.number((p.big * per) / 100, { units: big }),
              feedback: `Each of the ${big} is ${per} ${small}, not 100.`,
            },
          ]),
          solution: [{ say: `${p.big * per} ÷ ${per} = ${p.big} ${big}.` }],
        });
      default: {
        const h = Math.floor(p.film / 60);
        const m = p.film % 60;
        return A.multiStepContext({
          context: `A film lasts ${p.film} minutes. It starts at 6:00 pm.`,
          parts: [
            {
              ask: "How many whole hours long is the film?",
              answer: A.number(h),
              wrong: wrongs(h, [
                {
                  code: "MEA.TIME.DECIMAL",
                  value: A.number(Math.floor(p.film / 100)),
                  feedback: "There are 60 minutes in an hour.",
                },
              ]),
            },
            {
              ask: "How many more minutes after the whole hours?",
              answer: A.number(m),
              wrong: wrongs(m, [
                {
                  code: "MEA.TIME.DECIMAL",
                  value: A.number(p.film % 100),
                  feedback: "Take away 60 for each hour.",
                },
              ]),
            },
          ],
          solution: [
            {
              say: `${h} × 60 = ${h * 60}, and ${p.film} − ${h * 60} = ${m}. The film is ${h} hour${h === 1 ? "" : "s"} and ${m} minutes, so it ends at ${6 + h}:${String(m).padStart(2, "0")} pm.`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const [, , per] = (KINDS[p.kind] ?? KINDS[0]) as (typeof KINDS)[number];
    if (question.archetype === "standard") return numberAnswer(question) === p.big * per + p.small;
    if (question.archetype === "reverse") return numberAnswer(question) === p.big;
    return numberAnswer(question) * 60 + numberAnswer(question, 1) === p.film;
  },
});
