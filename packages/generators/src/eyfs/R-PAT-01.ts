/**
 * @statement R-PAT-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// R-PAT-01: Explore and represent patterns within numbers up to 10, including evens and odds,
// double facts and how quantities can be distributed equally (ELG)
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer, objects, tenFrames } from "../shared/counting.ts";

interface Params {
  n: number;
  d: number;
  pairs: number[];
  share: number;
}

export default defineGenerator<Params>({
  id: "R-PAT-01",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["PAT.EVEN-ODD", "PAT.DOUBLE.ADD"],

  params(rng) {
    return {
      n: rng.int(2, 10),
      d: rng.int(2, 5),
      pairs: rng.shuffle([1, 2, 3, 4, 5]).slice(0, 3),
      share: rng.int(4, 10),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const even = p.n % 2 === 0;
        return A.choice({
          rng,
          question: [
            `Here are ${p.n} counters in a ten frame. Do they all make pairs?`,
            A.figure(tenFrames(p.n)),
          ],
          ask: `Is ${p.n} odd or even?`,
          correct: even ? "even" : "odd",
          distractors: [
            {
              content: even ? "odd" : "even",
              code: "PAT.EVEN-ODD",
              feedback: even
                ? "Every counter has a partner, so it is even."
                : "One counter has no partner, so it is odd.",
            },
          ],
          solution: [
            {
              say: even
                ? `${p.n} counters make ${p.n / 2} pairs with none left over: even.`
                : `${p.n} counters make ${(p.n - 1) / 2} pairs and one is left over: odd.`,
            },
          ],
        });
      }
      case 2:
        return A.standard({
          question: [
            `Double ${p.d}: two groups of ${p.d}.`,
            A.figure(objects(2 * p.d, { second: p.d, hidden: true })),
          ],
          ask: `What is double ${p.d}?`,
          answer: A.number(2 * p.d),
          wrong: wrongs(2 * p.d, [
            {
              code: "PAT.DOUBLE.ADD",
              value: A.number(p.d + 1),
              feedback: `Double means two lots of ${p.d}: ${p.d} + ${p.d}.`,
            },
            {
              code: "PAT.DOUBLE.ADD",
              value: A.number(p.d + 2),
              feedback: `Double means add ${p.d} to itself, not add 2.`,
            },
          ]),
          solution: [{ say: `${p.d} + ${p.d} = ${2 * p.d}.` }],
        });
      case 3:
        return A.matchRepresentations({
          rng,
          question: "Match each number to its double.",
          pairs: p.pairs.map((k) => [String(k), String(2 * k)] as [A.RichInput, A.RichInput]),
          solution: [{ say: "Double a number by adding it to itself." }],
        });
      default: {
        const even = p.share % 2 === 0;
        return A.trueOrFalseWhy({
          rng,
          statement: `Ali says ${p.share} grapes can be shared equally between 2 friends with none left over.`,
          truth: even,
          reasons: [
            {
              text: even
                ? `True. Each friend gets ${p.share / 2}, because ${p.share} is even.`
                : `False. Each friend gets ${(p.share - 1) / 2} and 1 is left over, because ${p.share} is odd.`,
              correct: true,
            },
            {
              text: `${even ? "False" : "True"}. Any number can be shared equally between 2.`,
              code: "PAT.EVEN-ODD",
            },
            {
              text: `${even ? "False" : "True"}. Big numbers are always even.`,
              code: "PAT.EVEN-ODD",
            },
          ],
          solution: [
            { say: "Even numbers share equally into 2 groups; odd numbers leave 1 over." },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard" && question.parts[0]?.answer.type === "number")
      return numberAnswer(question) === 2 * p.d;
    if (question.archetype === "standard")
      return chosenText(question) === (p.n % 2 === 0 ? "even" : "odd");
    return true;
  },
});
