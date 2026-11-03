/**
 * @statement Y2-STA-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-STA-01.a: Interpret and construct tally charts
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { CountersSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { chosenFigure, numberAnswer, tally } from "../shared/counting.ts";
import { TOPICS } from "../shared/sta.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  topic: number;
  cat: number;
  n: number;
}

/** Counting each gate of five as 1. */
const gatesAsOne = (n: number) => Math.floor(n / 5) + (n % 5);

export default defineGenerator<Params>({
  id: "Y2-STA-01.a",
  version: "1.1.0",
  depths: [1, 3, 4],
  misconceptions: ["STA.SCALE.READ"],

  params(rng, numbers) {
    const n = rng.int(6, numbers === "friendly" ? 12 : 19);
    if (n % 5 === 0) reject("some single marks too");
    return { topic: rng.int(0, TOPICS.length - 1), cat: rng.int(0, 3), n };
  },

  build(p, depth, rng): QuestionDraft {
    const topic = TOPICS[p.topic] ?? TOPICS[0];
    const who = topic?.who ?? "children";
    const name = topic?.categories[p.cat] ?? "";
    const slip = gatesAsOne(p.n);
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            `A tally chart records how many ${who} chose ${name}.`,
            A.figure(tally(p.n, true)),
          ],
          ask: `How many ${who} chose ${name}?`,
          answer: A.number(p.n),
          wrong: wrongs(p.n, [
            {
              code: "STA.SCALE.READ",
              value: A.number(slip),
              feedback: "Each gate of five tally marks (four lines and one across) stands for 5.",
            },
          ]),
          solution: [
            {
              say: `Count the gates in 5s, then the single marks: ${Math.floor(p.n / 5)} × 5 + ${p.n % 5} = ${p.n}.`,
            },
          ],
        });
      case 3:
        return A.chooseTheDiagram({
          rng,
          question: [`${p.n} ${who} chose ${name}. Which tally shows ${p.n}?`],
          correct: tally(p.n, true),
          distractors: [
            {
              figure: tally(p.n + 5, true),
              feedback: "Count the gates in 5s: that tally has one gate too many.",
            },
            {
              figure: tally(p.n + 1, true),
              feedback: `Count the single marks: that tally shows ${p.n + 1}.`,
            },
          ],
          solution: [
            {
              say: `${p.n} is ${Math.floor(p.n / 5)} gate${p.n >= 10 ? "s" : ""} of 5 and ${p.n % 5} more.`,
            },
          ],
        });
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                A.figure(tally(p.n, true)),
                `Ben counts every group of marks as 1 and says this tally shows ${slip}.`,
              ],
              truth: false,
              reasons: [
                {
                  text: `False. Each gate of five marks stands for 5, so it shows ${p.n}.`,
                  correct: true,
                },
                { text: "True. Each group of marks is one vote.", code: "STA.SCALE.READ" },
                {
                  text: "True. The line across means you count the gate once.",
                  code: "STA.SCALE.READ",
                },
              ],
              solution: [{ say: `${Math.floor(p.n / 5)} × 5 + ${p.n % 5} = ${p.n}.` }],
            }),
          [
            {
              claim: "In tally marks, a gate (four lines with one across) stands for 5.",
              truth: "always",
              right: "Always. 4 lines and 1 across make 5.",
              wrong: [
                ["Never. It stands for 1.", "STA.SCALE.READ"],
                ["Sometimes. It depends who drew it."],
              ],
            },
            {
              statement: "Leo sees two gates and 3 more lines. He says the tally shows 13.",
              truth: true,
              right: "True. 5 + 5 + 3 = 13.",
              wrong: [["False. It shows 5.", "STA.SCALE.READ"], ["False. It shows 3."]],
            },
            {
              statement: "Kim sees one gate and 2 more lines. She says the tally shows 3.",
              truth: false,
              right: "False. A gate is 5, so 5 + 2 = 7.",
              wrong: [
                ["True. Count each group as 1.", "STA.SCALE.READ"],
                ["True. Count the gates and lines."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.n;
    if (question.key.depth === 3) {
      const f = chosenFigure(question) as CountersSpec | undefined;
      return f?.layout === "tally" && f.count === p.n;
    }
    return true;
  },
});
