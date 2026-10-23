/**
 * @statement Y1-MD-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y1-MD-01.a: Solve multiplication problems with equal groups and arrays
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { CountersSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { chosenFigure, numberAnswer } from "../shared/counting.ts";
import { array } from "../shared/md.ts";

interface Params {
  rows: number;
  columns: number;
  context: number;
}

const CONTEXTS = [
  { group: "bag", things: "sweets" },
  { group: "vase", things: "flowers" },
  { group: "box", things: "pencils" },
  { group: "plate", things: "biscuits" },
];

export default defineGenerator<Params>({
  id: "Y1-MD-01.a",
  version: "1.0.0",
  depths: [1, 2, 3],
  misconceptions: ["MD.MULTIPLY.ADDS"],

  params(rng, numbers) {
    const sizes =
      numbers === "friendly" ? [2, 5] : numbers === "standard" ? [2, 5, 10] : [2, 3, 4, 5, 10];
    const rows = rng.int(2, numbers === "friendly" ? 4 : 5);
    const columns = rng.pick(sizes);
    if (rows === columns) reject("different numbers");
    return { rows, columns, context: rng.int(0, CONTEXTS.length - 1) };
  },

  build(p, depth, rng): QuestionDraft {
    const total = p.rows * p.columns;
    const adds = {
      code: "MD.MULTIPLY.ADDS",
      value: A.number(p.rows + p.columns),
      feedback: `There are ${p.rows} lots of ${p.columns}, not ${p.rows} and ${p.columns}. Count in ${p.columns}s.`,
    };
    const counting = Array.from({ length: p.rows }, (_, i) => (i + 1) * p.columns).join(", ");
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            `There are ${p.rows} rows with ${p.columns} counters in each row.`,
            A.figure(array(p.rows, p.columns)),
          ],
          ask: "How many counters are there altogether?",
          answer: A.number(total),
          wrong: wrongs(total, [adds]),
          solution: [{ say: `Count in ${p.columns}s, once for each row: ${counting}.` }],
        });
      case 2: {
        const c = CONTEXTS[p.context] ?? CONTEXTS[0] ?? { group: "", things: "" };
        return A.variedForm({
          rng,
          forms: [
            {
              question: `There are ${p.rows} ${c.group}s. Each ${c.group} has ${p.columns} ${c.things}.`,
              ask: `How many ${c.things} are there altogether?`,
            },
            {
              question: `${p.rows} children each have ${p.columns} stickers.`,
              ask: "How many stickers do they have altogether?",
            },
          ],
          answer: A.number(total),
          wrong: wrongs(total, [adds]),
          solution: [
            { say: `${p.rows} equal groups of ${p.columns}: ${counting}. That is ${total}.` },
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
    if (question.key.depth === 3) {
      const f = chosenFigure(question) as CountersSpec | undefined;
      return f?.layout === "array" && f.rows === p.rows && f.columns === p.columns;
    }
    return numberAnswer(question) === p.rows * p.columns;
  },
});
