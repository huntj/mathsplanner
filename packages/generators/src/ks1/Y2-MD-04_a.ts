/**
 * @statement Y2-MD-04.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-MD-04.a: Solve multiplication and division with arrays and repeated addition
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { CountersSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { chosenFigure, chosenText, numberAnswer } from "../shared/counting.ts";
import { array } from "../shared/md.ts";

interface Params {
  rows: number;
  columns: number;
}

const repeated = (times: number, n: number) => Array.from({ length: times }, () => n).join(" + ");

export default defineGenerator<Params>({
  id: "Y2-MD-04.a",
  version: "1.0.0",
  depths: [1, 2, 3],
  misconceptions: ["MD.MULTIPLY.ADDS", "MD.SHARE.GROUPS"],

  params(rng, numbers) {
    const columns = rng.pick(
      numbers === "friendly" ? [2, 5] : numbers === "standard" ? [2, 5, 10] : [2, 3, 4, 5, 10],
    );
    const rows = rng.int(2, numbers === "friendly" ? 4 : 5);
    if (rows === columns) reject("different numbers");
    return { rows, columns };
  },

  build(p, depth, rng): QuestionDraft {
    const total = p.rows * p.columns;
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: ["Look at the array.", A.figure(array(p.rows, p.columns))],
          ask: "Which addition matches the array?",
          correct: A.math(repeated(p.rows, p.columns)),
          distractors: [
            {
              content: A.math(`${p.rows} + ${p.columns}`),
              code: "MD.MULTIPLY.ADDS",
              feedback: `There are ${p.rows} rows, each with ${p.columns}: add ${p.columns} once for each row.`,
            },
            {
              content: A.math(repeated(p.rows + 1, p.columns)),
              feedback: `Count the rows: there are ${p.rows}.`,
            },
          ],
          solution: [
            {
              say: "",
              math: `${repeated(p.rows, p.columns)} = ${p.rows} \\times ${p.columns} = ${total}`,
            },
          ],
        });
      case 2:
        return A.standard({
          question: [
            `${total} counters are put in rows of ${p.columns}.`,
            A.figure(array(p.rows, p.columns, true)),
          ],
          ask: "How many rows are there?",
          answer: A.number(p.rows),
          wrong: wrongs(p.rows, [
            {
              code: "MD.SHARE.GROUPS",
              value: A.number(p.columns),
              feedback: `${p.columns} is how many are in each row. Count how many rows of ${p.columns} make ${total}.`,
            },
          ]),
          solution: [{ say: "", math: `${total} \\div ${p.columns} = ${p.rows}` }],
        });
      default:
        return A.chooseTheDiagram({
          rng,
          question: [
            "Which array shows ",
            A.math(`${p.rows} \\times ${p.columns} = ${total}`),
            "?",
          ],
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
                    feedback: `That is ${p.rows} + ${p.columns}, not ${p.rows} lots of ${p.columns}.`,
                  },
                ]
              : [
                  {
                    figure: array(p.rows + 1, p.columns, true),
                    feedback: `That array has ${p.rows + 1} rows.`,
                  },
                ]),
          ],
          solution: [{ say: `${p.rows} rows of ${p.columns} make ${total}.` }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question).includes(repeated(p.rows, p.columns));
    if (question.key.depth === 2) return numberAnswer(question) === p.rows;
    const f = chosenFigure(question) as CountersSpec | undefined;
    return f?.layout === "array" && f.rows === p.rows && f.columns === p.columns;
  },
});
