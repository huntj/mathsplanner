/**
 * @statement N-MEA-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// N-MEA-02: Begin to describe a sequence of events, real or fictional, using words such as 'first'
// and 'then'
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

interface Params {
  story: number;
  ask: "first" | "then" | "last";
  claim: [number, number];
}

const STORIES: { who: string; steps: [string, string, string]; me: [string, string, string] }[] = [
  {
    who: "Ali",
    steps: ["puts on socks", "puts on shoes", "goes outside"],
    me: ["put on my socks", "put on my shoes", "go outside"],
  },
  {
    who: "Mia",
    steps: ["plants a seed", "waters it", "watches it grow"],
    me: ["plant a seed", "water it", "watch it grow"],
  },
  {
    who: "Sam",
    steps: ["washes hands", "eats lunch", "goes out to play"],
    me: ["wash my hands", "eat my lunch", "go out to play"],
  },
  {
    who: "Zoe",
    steps: ["gets into bed", "listens to a story", "falls asleep"],
    me: ["get into bed", "listen to a story", "fall asleep"],
  },
  {
    who: "Ben",
    steps: ["mixes the cake", "bakes the cake", "eats the cake"],
    me: ["mix the cake", "bake the cake", "eat the cake"],
  },
];

export default defineGenerator<Params>({
  id: "N-MEA-02",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MEA.SEQUENCE.ORDER"],

  params(rng) {
    const pair = rng.shuffle([0, 1, 2]).slice(0, 2) as [number, number];
    return {
      story: rng.int(0, STORIES.length - 1),
      ask: rng.pick(["first", "then", "last"] as const),
      claim: pair,
    };
  },

  build(p, depth, rng): QuestionDraft {
    const s = (STORIES[p.story] ?? STORIES[0]) as (typeof STORIES)[number];
    const [a, b, c] = s.steps;
    const order = rng.shuffle([0, 1, 2]);
    const told = `${s.who} ${order.map((i) => s.steps[i]).join(", ")}.`;
    switch (depth) {
      case 1: {
        const k = p.ask === "first" ? 0 : p.ask === "then" ? 1 : 2;
        const correct = s.steps[k] ?? "";
        return A.choice({
          rng,
          question: `First ${s.who} ${a}. Then ${s.who} ${b}. Last of all, ${s.who} ${c}.`,
          ask: `What does ${s.who} do ${p.ask === "then" ? "second" : p.ask}?`,
          correct,
          distractors: s.steps
            .filter((_, i) => i !== k)
            .map((t) => ({
              content: t,
              code: "MEA.SEQUENCE.ORDER",
              feedback: `Listen for the order: first, then, last. ${s.who} ${t} at a different time.`,
            })),
          solution: [{ say: `First ${a}, then ${b}, last ${c}.` }],
        });
      }
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `These are mixed up: ${told}`,
          ask: "What must happen first?",
          correct: a,
          distractors: [b, c].map((t) => ({
            content: t,
            code: "MEA.SEQUENCE.ORDER",
            feedback: `Think about what has to happen before ${s.who} ${t}.`,
          })),
          solution: [{ say: `It has to go: first ${a}, then ${b}, then ${c}.` }],
        });
      default: {
        const [i, j] = p.claim;
        const before = s.steps[i] ?? "";
        const after = s.steps[j] ?? "";
        const truth = i < j;
        return A.trueOrFalseWhy({
          rng,
          statement: `${s.who} says: "First I ${s.me[i] ?? ""}, then I ${s.me[j] ?? ""}."`,
          truth,
          reasons: truth
            ? [
                { text: `True. ${s.who} ${before} before ${s.who} ${after}.`, correct: true },
                { text: "False. The order does not matter.", code: "MEA.SEQUENCE.ORDER" },
                { text: `False. ${s.who} ${after} first.`, code: "MEA.SEQUENCE.ORDER" },
              ]
            : [
                { text: `False. ${s.who} ${after} first, then ${s.who} ${before}.`, correct: true },
                { text: "True. You can do things in any order.", code: "MEA.SEQUENCE.ORDER" },
                { text: `True. ${s.who} ${before} first.`, code: "MEA.SEQUENCE.ORDER" },
              ],
          solution: [{ say: `First ${a}, then ${b}, last ${c}.` }],
        });
      }
    }
  },

  verify(p, question) {
    const s = (STORIES[p.story] ?? STORIES[0]) as (typeof STORIES)[number];
    if (question.archetype === "standard")
      return chosenText(question) === s.steps[p.ask === "first" ? 0 : p.ask === "then" ? 1 : 2];
    if (question.archetype === "varied-form") return chosenText(question) === s.steps[0];
    return true;
  },
});
