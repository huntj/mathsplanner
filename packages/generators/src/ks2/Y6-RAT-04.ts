/**
 * @statement Y6-RAT-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-RAT-04: Solve problems involving unequal sharing and grouping using knowledge of fractions and
// multiples
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { BarModelSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** For every a red there are b blue; k groups. */
  a: number;
  b: number;
  k: number;
}

const bars = (a: number, b: number, label: string): BarModelSpec => ({
  type: "bar-model",
  bars: [
    { label: "\\text{red}", parts: Array.from({ length: a }, () => ({ size: 1, label: "" })) },
    { label: "\\text{blue}", parts: Array.from({ length: b }, () => ({ size: 1, label: "" })) },
  ],
  braces: [{ bar: 1, from: 0, to: b - 1, label, side: "below" }],
});

export default defineGenerator<Params>({
  id: "Y6-RAT-04",
  version: "1.0.0",
  depths: [1, 2, 5],
  misconceptions: ["RAT.SHARE.WRONG-TOTAL", "AS.MULTISTEP.ONE-STEP"],

  params(rng, numbers) {
    const a = rng.int(1, numbers === "friendly" ? 3 : 5);
    const b = rng.int(2, numbers === "friendly" ? 4 : 7);
    const k = rng.int(2, numbers === "stretch" ? 12 : 6);
    if (a === b) reject("unequal sharing");
    return { a, b, k };
  },

  build(p, depth): QuestionDraft {
    const total = (p.a + p.b) * p.k;
    const [red, blue] = [p.a * p.k, p.b * p.k];
    const how = `Each group of ${p.a} red and ${p.b} blue has ${p.a + p.b} beads. ${total} ÷ ${p.a + p.b} = ${p.k} groups, so there are ${p.a} × ${p.k} = ${red} red and ${p.b} × ${p.k} = ${blue} blue.`;
    switch (depth) {
      case 1:
        return A.standard({
          question: `A necklace has ${total} beads. For every ${p.a} red bead${p.a === 1 ? "" : "s"} there are ${p.b} blue beads.`,
          ask: "How many red beads are there?",
          answer: A.number(red),
          wrong: wrongs(red, [
            total % p.a === 0 && p.a > 1
              ? {
                  code: "RAT.SHARE.WRONG-TOTAL",
                  value: A.number(total / p.a),
                  feedback: `Each group has ${p.a + p.b} beads, so divide by ${p.a + p.b}, not ${p.a}.`,
                }
              : {
                  code: "RAT.SHARE.WRONG-TOTAL",
                  value: A.number(total / 2),
                  feedback: `The beads are not shared equally: each group has ${p.a} red and ${p.b} blue.`,
                },
          ]),
          solution: [{ say: how }],
        });
      case 2:
        return A.reverse({
          question: [
            `For every ${p.a} red bead${p.a === 1 ? "" : "s"} on a necklace there are ${p.b} blue beads. There are ${blue} blue beads.`,
            A.figure(bars(p.a, p.b, String(blue))),
          ],
          ask: "How many beads are there altogether?",
          answer: A.number(total),
          wrong: wrongs(total, [
            {
              code: "AS.MULTISTEP.ONE-STEP",
              value: A.number(red),
              feedback: "That is the red beads. Add the blue beads too.",
            },
          ]),
          solution: [
            {
              say: `${blue} ÷ ${p.b} = ${p.k}, so there are ${p.k} groups. Red: ${p.a} × ${p.k} = ${red}. Altogether ${red} + ${blue} = ${total}.`,
            },
          ],
        });
      default:
        return A.multiStepContext({
          context: `A bag has ${total} sweets. For every ${p.a} lemon sweet${p.a === 1 ? "" : "s"} there are ${p.b} orange sweets.`,
          parts: [
            {
              ask: "How many orange sweets are there?",
              answer: A.number(blue),
              wrong: wrongs(blue, [
                {
                  code: "RAT.SHARE.WRONG-TOTAL",
                  value: A.number(total / 2),
                  feedback: `Divide into groups of ${p.a + p.b}, not into two equal halves.`,
                },
              ]),
            },
            {
              ask: "How many more orange sweets than lemon sweets are there?",
              answer: A.number(blue - red),
              wrong: wrongs(blue - red, [
                {
                  code: "AS.MULTISTEP.ONE-STEP",
                  value: A.number(blue),
                  feedback: "Find the lemon sweets too, then the difference.",
                },
              ]),
            },
          ],
          solution: [
            {
              say: how
                .replace(/red/g, "lemon")
                .replace(/blue/g, "orange")
                .replace("beads", "sweets"),
            },
            { say: `${blue} − ${red} = ${blue - red}.` },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return numberAnswer(question) === p.a * p.k;
    if (question.archetype === "reverse") return numberAnswer(question) === (p.a + p.b) * p.k;
    return (
      numberAnswer(question, 0) === p.b * p.k && numberAnswer(question, 1) === (p.b - p.a) * p.k
    );
  },
});
