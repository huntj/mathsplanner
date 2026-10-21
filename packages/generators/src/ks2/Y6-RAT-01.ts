/**
 * @statement Y6-RAT-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-RAT-01: Solve problems involving the relative sizes of two quantities where missing values can be
// found by using integer multiplication and division facts
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** A recipe for `people` uses `amount`; scale by `k`. */
  people: number;
  amount: number;
  k: number;
  claimTrue: boolean;
}

const RECIPES = [
  { thing: "eggs", unit: "" },
  { thing: "flour", unit: " g" },
  { thing: "milk", unit: " ml" },
];

export default defineGenerator<Params>({
  id: "Y6-RAT-01",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.ADDITIVE"],

  params(rng, numbers) {
    const people = rng.int(2, 6);
    const amount = rng.int(2, 9) * (numbers === "friendly" ? 1 : rng.pick([1, 10, 25]));
    const k = rng.int(2, numbers === "stretch" ? 8 : 5);
    if (people === amount) reject("different numbers");
    return { people, amount, k, claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const r = RECIPES[(p.amount + p.people) % RECIPES.length] ?? RECIPES[0];
    if (!r) return reject("no recipe");
    const [more, scaled] = [p.people * p.k, p.amount * p.k];
    const added = p.amount + (more - p.people);
    const of = (n: number) => (r.unit ? `${n}${r.unit} of ${r.thing}` : `${n} ${r.thing}`);
    const how = `${more} people is ${p.k} times as many as ${p.people}, so use ${p.k} times as much: ${p.amount} × ${p.k} = ${scaled}.`;
    switch (depth) {
      case 1:
        return A.standard({
          question: `A recipe for ${p.people} people uses ${of(p.amount)}.`,
          ask: `How much ${r.unit ? r.thing : `many ${r.thing}`} is needed for ${more} people?`,
          answer: A.number(scaled),
          wrong: wrongs(scaled, [
            {
              code: "RAT.ADDITIVE",
              value: A.number(added),
              feedback: `The number of people is multiplied by ${p.k}, so the ${r.thing} must be too. Adding the same amount does not keep the recipe in proportion.`,
            },
          ]),
          solution: [{ say: how }],
        });
      case 2:
        return A.reverse({
          question: `A recipe for ${p.people} people uses ${of(p.amount)}. Sam uses ${of(scaled)}.`,
          ask: "How many people is Sam cooking for?",
          answer: A.number(more),
          wrong: wrongs(more, [
            {
              code: "RAT.ADDITIVE",
              value: A.number(p.people + (scaled - p.amount)),
              feedback: `${scaled} is ${p.k} times ${p.amount}, so the number of people is ${p.k} times ${p.people}.`,
            },
          ]),
          solution: [
            { say: `${scaled} ÷ ${p.amount} = ${p.k}, so ${p.people} × ${p.k} = ${more} people.` },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `A recipe for ${p.people} people uses ${of(p.amount)}. Jay says that for ${more} people you need ${of(p.claimTrue ? scaled : added)}.`,
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                { text: `True. ${how}`, correct: true },
                {
                  text: `False. There are ${more - p.people} more people, so add ${more - p.people}.`,
                  code: "RAT.ADDITIVE",
                },
                { text: "False. The recipe stays the same for any number of people." },
              ]
            : [
                { text: `False. ${how}`, correct: true },
                {
                  text: `True. There are ${more - p.people} more people, so add ${more - p.people}.`,
                  code: "RAT.ADDITIVE",
                },
                { text: "True. More people always means more, so it must be right." },
              ],
          solution: [{ say: how }],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return numberAnswer(question) * p.people === p.amount * p.people * p.k;
    if (question.archetype === "reverse") return numberAnswer(question) === p.people * p.k;
    return true;
  },
});
