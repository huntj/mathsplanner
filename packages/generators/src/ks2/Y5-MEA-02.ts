/**
 * @statement Y5-MEA-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-MEA-02: Understand and use approximate equivalences between metric units and common imperial
// units such as inches, pounds and pints
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  kind: number;
  n: number;
  claimTrue: boolean;
}

// [imperial, metric, metric per imperial, fact as stated]
const KINDS: [string, string, number, string][] = [
  ["inches", "cm", 2.5, "1 inch is about 2.5 cm"],
  ["feet", "cm", 30, "1 foot is about 30 cm"],
  ["pounds", "kg", 0.5, "1 pound (lb) is about 0.5 kg"],
  ["pints", "ml", 570, "1 pint is about 570 ml"],
];
const r = (x: number) => Math.round(x * 100) / 100;

export default defineGenerator<Params>({
  id: "Y5-MEA-02",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MEA.CONVERT.APPROX"],

  params(rng, numbers) {
    return {
      kind: rng.int(0, KINDS.length - 1),
      n: rng.int(2, numbers === "friendly" ? 6 : 12) * 2,
      claimTrue: rng.bool(),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const [imp, met, per, fact] = (KINDS[p.kind] ?? KINDS[0]) as (typeof KINDS)[number];
    const metric = r(p.n * per);
    switch (depth) {
      case 1:
        return A.standard({
          question: `${fact}.`,
          ask: `About how many ${met} is ${p.n} ${imp}?`,
          answer: A.number(metric, { units: met }),
          wrong: wrongs(metric, [
            {
              code: "MEA.CONVERT.APPROX",
              value: A.number(r(p.n / per), { units: met }),
              feedback: `Each of the ${imp} is about ${per} ${met}, so multiply by ${per}.`,
            },
          ]),
          solution: [{ say: `${p.n} × ${per} = ${metric} ${met}.` }],
        });
      case 2:
        return A.reverse({
          question: `${fact}.`,
          ask: `About how many ${imp} is ${metric} ${met}?`,
          answer: A.number(p.n, { units: imp }),
          wrong: wrongs(p.n, [
            {
              code: "MEA.CONVERT.APPROX",
              value: A.number(r(metric * per), { units: imp }),
              feedback: `Find how many lots of ${per} ${met} make ${metric} ${met}: divide.`,
            },
          ]),
          solution: [{ say: `${metric} ÷ ${per} = ${p.n} ${imp}.` }],
        });
      default: {
        const said = p.claimTrue ? metric : r(p.n / per);
        return A.trueOrFalseWhy({
          rng,
          statement: `${fact}. Kofi says ${p.n} ${imp} is about ${said} ${met}.`,
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                { text: `True. ${p.n} × ${per} = ${metric}.`, correct: true },
                {
                  text: `False. Divide by ${per}: ${r(p.n / per)} ${met}.`,
                  code: "MEA.CONVERT.APPROX",
                },
                {
                  text: `False. ${imp[0]?.toUpperCase()}${imp.slice(1)} and ${met} are the same size.`,
                },
              ]
            : [
                {
                  text: `False. That divides by ${per}. Each of the ${imp} is about ${per} ${met}, so it is ${p.n} × ${per} = ${metric} ${met}.`,
                  correct: true,
                },
                {
                  text: `True. To change ${imp} to ${met}, divide by ${per}.`,
                  code: "MEA.CONVERT.APPROX",
                },
                {
                  text: "True. Imperial units are always bigger, so the number gets smaller.",
                  code: "MEA.CONVERT.APPROX",
                },
              ],
          solution: [{ say: `${p.n} × ${per} = ${metric} ${met}.` }],
        });
      }
    }
  },

  verify(p, question) {
    const [, , per] = (KINDS[p.kind] ?? KINDS[0]) as (typeof KINDS)[number];
    if (question.archetype === "standard")
      return Math.abs(numberAnswer(question) - p.n * per) < 1e-9;
    if (question.archetype === "reverse") return numberAnswer(question) === p.n;
    return true;
  },
});
