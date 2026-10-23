/**
 * @statement AL-S1.1
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-S1.1: Understand populations, samples and census; use and critique simple random, stratified,
// systematic, quota and opportunity sampling
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

const METHODS = [
  {
    name: "systematic sampling",
    text: (n: number) =>
      `numbering all the members in a list and choosing every ${n}th one, starting from a random point`,
  },
  {
    name: "stratified sampling",
    text: () =>
      "splitting the population into age groups and taking a random sample from each group, in proportion to its size",
  },
  {
    name: "quota sampling",
    text: (n: number) =>
      `stopping people in the street until ${n} men and ${n} women have been asked`,
  },
  { name: "opportunity sampling", text: () => "asking the first people who happen to walk past" },
] as const;

export interface Params {
  groups: [number, number, number];
  n: number;
  method: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "AL-S1.1",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.SAMPLING.METHOD", "STA.SAMPLE.BIAS"],

  params(rng) {
    const groups: [number, number, number] = [
      20 * rng.int(3, 15),
      20 * rng.int(3, 15),
      20 * rng.int(3, 15),
    ];
    const total = groups[0] + groups[1] + groups[2];
    const n = rng.pick([20, 40, 50]);
    if ((groups[0] * n) % total !== 0 || groups[0] === groups[1]) reject("a whole-number stratum");
    return { groups, n, method: rng.int(0, METHODS.length - 1), k: rng.int(5, 20) };
  },

  build(p, depth, rng): QuestionDraft {
    const total = p.groups[0] + p.groups[1] + p.groups[2];
    switch (depth) {
      case 1: {
        const take = (p.groups[0] * p.n) / total;
        return A.standard({
          question: `A school has ${p.groups[0]} pupils in Year 12, ${p.groups[1]} in Year 13 and ${p.groups[2]} staff. A stratified sample of ${p.n} people is taken.`,
          ask: "How many Year 12 pupils should be in the sample?",
          answer: A.number(take),
          wrong: wrongs(take, [
            {
              code: "STA.SAMPLING.METHOD",
              value: A.number(Math.round((p.n / 3) * 100) / 100),
              feedback:
                "Stratified samples are in proportion to the size of each group, not equal.",
            },
          ]),
          solution: [{ say: `${p.groups[0]} ÷ ${total} × ${p.n} = ${take}.` }],
        });
      }
      case 2: {
        const m = METHODS[p.method] ?? (METHODS[0] as (typeof METHODS)[number]);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `A researcher chooses a sample by ${m.text(p.k)}.`,
          ask: "Which sampling method is this?",
          correct: m.name[0]?.toUpperCase() + m.name.slice(1),
          distractors: METHODS.filter((x) => x.name !== m.name).map((x) => ({
            content: x.name[0]?.toUpperCase() + x.name.slice(1),
            code: "STA.SAMPLING.METHOD",
            feedback: `Compare with the definition of ${m.name}.`,
          })),
          solution: [{ say: `This is ${m.name}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement:
            "Ali says an opportunity sample is a random sample, because the people are not chosen on purpose.",
          truth: false,
          reasons: [
            {
              text: "False. In a random sample every member of the population has a known, equal chance of selection; an opportunity sample only includes people who are available, which can cause bias.",
              correct: true,
            },
            {
              text: "True. Nobody chooses who is in it, so it is random.",
              code: "STA.SAMPLING.METHOD",
            },
            { text: "True. Any sample can represent the population.", code: "STA.SAMPLE.BIAS" },
          ],
          solution: [{ say: "Opportunity sampling is quick and cheap but not random." }],
        });
    }
  },

  verify(p, question) {
    const total = p.groups[0] + p.groups[1] + p.groups[2];
    if (question.key.depth === 1) return numberAnswer(question) === (p.groups[0] * p.n) / total;
    if (question.key.depth === 2)
      return chosenText(question).toLowerCase() === (METHODS[p.method] ?? METHODS[0]).name;
    return true;
  },
});
