/**
 * @statement Y1-MD-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y1-MD-01: Solve one-step multiplication and division problems using objects, pictorial
// representations and arrays
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { CountersSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { chosenFigure, numberAnswer, objects } from "../shared/counting.ts";
import { array } from "../shared/md.ts";

interface Params {
  rows: number;
  columns: number;
  /** Depth 2: `groups` groups of `each`, shared or grouped. */
  groups: number;
  each: number;
  share: boolean;
}

export default defineGenerator<Params>({
  id: "Y1-MD-01",
  version: "1.0.0",
  depths: [1, 2, 3],
  misconceptions: ["MD.MULTIPLY.ADDS"],

  params(rng, numbers) {
    const sizes =
      numbers === "friendly" ? [2, 5] : numbers === "standard" ? [2, 5, 10] : [2, 3, 4, 5, 10];
    const rows = rng.int(2, numbers === "friendly" ? 4 : 5);
    const columns = rng.pick(sizes);
    const groups = rng.int(2, numbers === "friendly" ? 3 : 5);
    const each = rng.pick(sizes.filter((s) => s <= 5));
    if (rows === columns || groups === each) reject("different numbers");
    return { rows, columns, groups, each, share: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const total = p.rows * p.columns;
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            `There are ${p.rows} rows with ${p.columns} counters in each row.`,
            A.figure(array(p.rows, p.columns)),
          ],
          ask: "How many counters are there altogether?",
          answer: A.number(total),
          wrong: wrongs(total, [
            {
              code: "MD.MULTIPLY.ADDS",
              value: A.number(p.rows + p.columns),
              feedback: `There are ${p.rows} rows of ${p.columns}, not ${p.rows} and ${p.columns}. Count in ${p.columns}s.`,
            },
          ]),
          solution: [
            {
              say: `Count in ${p.columns}s, once for each row: ${Array.from({ length: p.rows }, (_, i) => (i + 1) * p.columns).join(", ")}.`,
            },
          ],
        });
      case 2: {
        const n = p.groups * p.each;
        return A.variedForm({
          rng,
          forms: p.share
            ? [
                {
                  question: [
                    `${n} sweets are shared equally between ${p.groups} children.`,
                    A.figure(objects(n, { shape: "circle" })),
                  ],
                  ask: "How many sweets does each child get?",
                },
                {
                  question: `Share ${n} apples equally into ${p.groups} bowls.`,
                  ask: "How many apples go in each bowl?",
                },
              ]
            : [
                {
                  question: `${n} children stand in groups of ${p.each}.`,
                  ask: "How many groups are there?",
                },
                {
                  question: [
                    `${n} eggs are put into boxes of ${p.each}.`,
                    A.figure(objects(n, { shape: "circle" })),
                  ],
                  ask: "How many boxes are filled?",
                },
              ],
          answer: A.number(p.share ? p.each : p.groups),
          solution: [
            {
              say: p.share
                ? `Give one at a time to each of the ${p.groups} until all ${n} are gone: each gets ${p.each}.`
                : `Count out groups of ${p.each} until all ${n} are used: there are ${p.groups} groups.`,
            },
          ],
        });
      }
      default:
        return A.chooseTheDiagram({
          rng,
          question: `Which array shows ${p.rows} rows of ${p.columns}?`,
          correct: array(p.rows, p.columns, true),
          distractors: [
            {
              figure: array(p.rows, p.columns + 1, true),
              feedback: `Those rows have ${p.columns + 1} in them.`,
            },
            ...(p.rows + p.columns <= 12
              ? [
                  {
                    figure: array(1, p.rows + p.columns, true),
                    code: "MD.MULTIPLY.ADDS",
                    feedback: `That is ${p.rows} and ${p.columns} put together: ${p.rows + p.columns}.`,
                  },
                ]
              : [
                  {
                    figure: array(p.rows + 1, p.columns, true),
                    feedback: `That array has ${p.rows + 1} rows.`,
                  },
                ]),
          ],
          solution: [{ say: `${p.rows} rows with ${p.columns} in each make ${total}.` }],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "choose-the-diagram") {
      const f = chosenFigure(question) as CountersSpec | undefined;
      return f?.layout === "array" && f.rows === p.rows && f.columns === p.columns;
    }
    if (question.archetype === "standard") return numberAnswer(question) === p.rows * p.columns;
    return numberAnswer(question) === (p.share ? p.each : p.groups);
  },
});
