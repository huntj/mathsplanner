/**
 * @statement CM-P2
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// CM-P2: Enumerate sets and combinations systematically using tree diagrams
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  n: number;
  s: number;
  m: number;
  d: number;
}

export default defineGenerator<Params>({
  id: "CM-P2",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.ENUMERATE", "PRO.SAMPLE-SPACE.EQUAL-TOTALS"],

  params(rng) {
    return { n: rng.int(4, 9), s: rng.int(2, 5), m: rng.int(3, 6), d: rng.int(2, 4) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = (p.n * (p.n - 1)) / 2;
        return A.standard({
          question: [`A team of 2 is chosen from ${p.n} people. The order does not matter.`],
          ask: "How many different teams are possible?",
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "PRO.ENUMERATE",
              value: A.number(p.n * (p.n - 1)),
              feedback:
                "Listing first choice then second counts each pair twice (AB and BA): halve it.",
            },
          ]),
          solution: [{ say: "", math: `\\frac{${p.n} \\times ${p.n - 1}}{2} = ${v}` }],
        });
      }
      case 2: {
        const v = p.s * p.m * p.d;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`A menu has ${p.s} starters, ${p.m} main courses and ${p.d} desserts.`],
              ask: "How many different three-course meals are possible?",
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "PRO.ENUMERATE",
              value: A.number(p.s + p.m + p.d),
              feedback: "Each starter can go with each main and each dessert: multiply.",
            },
          ]),
          solution: [{ say: "", math: `${p.s} \\times ${p.m} \\times ${p.d} = ${v}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Sid rolls two fair dice and adds the scores. He says a total of 7 is just as likely as a total of 2, because each is one possible total.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. Listing the 36 equally likely outcomes, 7 comes from 6 of them (1+6, 2+5, …, 6+1) but 2 only from 1+1.",
              correct: true,
            },
            {
              text: "True. Every total from 2 to 12 is equally likely.",
              code: "PRO.SAMPLE-SPACE.EQUAL-TOTALS",
            },
            {
              text: "True. Each die is fair, so each total is fair.",
              code: "PRO.SAMPLE-SPACE.EQUAL-TOTALS",
            },
          ],
          solution: [{ say: "P(7) = 6/36 = 1/6, but P(2) = 1/36." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === (p.n * (p.n - 1)) / 2;
    if (question.key.depth === 2) return numberAnswer(question) === p.s * p.m * p.d;
    return true;
  },
});
