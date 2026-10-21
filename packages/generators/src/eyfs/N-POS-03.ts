/**
 * @statement N-POS-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// N-POS-03: Describe a familiar route and discuss routes and locations using words like 'in front
// of' and 'behind'
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

interface Params {
  names: [string, string, string];
  ask: "front" | "back" | "behind";
  route: number;
  claimTrue: boolean;
}

const ROUTES: [string, string, string][] = [
  ["the gate", "the big tree", "the slide"],
  ["the classroom door", "the coat pegs", "the sand pit"],
  ["the front door", "the shop", "the park"],
];

export default defineGenerator<Params>({
  id: "N-POS-03",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["POS.WORDS.OPPOSITE", "MEA.SEQUENCE.ORDER"],

  params(rng) {
    return {
      names: rng.shuffle(["Ava", "Ben", "Cal", "Dee", "Eli"]).slice(0, 3) as [
        string,
        string,
        string,
      ],
      ask: rng.pick(["front", "back", "behind"] as const),
      route: rng.int(0, ROUTES.length - 1),
      claimTrue: rng.bool(),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const [a, b, c] = p.names;
    const line = `Three children are in a line. ${a} is at the front, ${b} is behind ${a}, and ${c} is behind ${b}.`;
    switch (depth) {
      case 1: {
        const right = p.ask === "front" ? a : p.ask === "back" ? c : c;
        const ask =
          p.ask === "front"
            ? "Who is at the front?"
            : p.ask === "back"
              ? "Who is at the back?"
              : `Who is behind ${b}?`;
        return A.choice({
          rng,
          question: line,
          ask,
          correct: right,
          distractors: p.names
            .filter((n) => n !== right)
            .map((n) => ({
              content: n,
              ...(n === (p.ask === "front" ? c : a) ? { code: "POS.WORDS.OPPOSITE" } : {}),
              feedback: "The front of the line is where it starts; behind means further back.",
            })),
          solution: [{ say: `From the front: ${a}, ${b}, ${c}.` }],
        });
      }
      case 2: {
        const [first, middle, last] = ROUTES[p.route] as (typeof ROUTES)[number];
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `Kim walks to ${last}. She goes out of ${first}, past ${middle}, and then to ${last}.`,
          ask: `What does Kim pass before she gets to ${last}?`,
          correct: middle,
          distractors: [
            {
              content: last,
              code: "MEA.SEQUENCE.ORDER",
              feedback: `${last[0]?.toUpperCase()}${last.slice(1)} is where she ends up.`,
            },
          ],
          solution: [{ say: `First ${first}, then ${middle}, then ${last}.` }],
        });
      }
      default: {
        const said = p.claimTrue ? `${a} is in front of ${c}` : `${c} is in front of ${a}`;
        return A.trueOrFalseWhy({
          rng,
          statement: `${line} Zoe says ${said}.`,
          truth: p.claimTrue,
          reasons: [
            {
              text: `${p.claimTrue ? "True" : "False"}. ${a} is at the front, so ${a} is in front of ${c}.`,
              correct: true,
            },
            {
              text: `${p.claimTrue ? "False" : "True"}. In front of and behind mean the same thing.`,
              code: "POS.WORDS.OPPOSITE",
            },
            {
              text: `${p.claimTrue ? "False" : "True"}. The last person is in front.`,
              code: "POS.WORDS.OPPOSITE",
            },
          ],
          solution: [{ say: `Front to back: ${a}, ${b}, ${c}.` }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return chosenText(question) === (p.ask === "front" ? p.names[0] : p.names[2]);
    if (question.archetype === "varied-form")
      return chosenText(question) === (ROUTES[p.route] as (typeof ROUTES)[number])[1];
    return true;
  },
});
