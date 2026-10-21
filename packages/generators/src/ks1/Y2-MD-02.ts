/**
 * @statement Y2-MD-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y2-MD-02: Calculate and write mathematical statements for multiplication and division using ×, ÷
// and =
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { array } from "../shared/md.ts";

interface Params {
  rows: number;
  columns: number;
  /** Depth 2: hide the divisor (2) or the answer (4) of a division. */
  hide: 2 | 4;
}

export default defineGenerator<Params>({
  id: "Y2-MD-02",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MD.MULTIPLY.ADDS", "MD.DIVIDE.ORDER"],

  params(rng, numbers) {
    const columns = rng.pick(numbers === "friendly" ? [2, 10] : [2, 5, 10]);
    const rows = rng.int(2, numbers === "stretch" ? 12 : 6);
    if (rows === columns) reject("a non-square array");
    return { rows, columns, hide: rng.pick([2, 4] as const) };
  },

  build(p, depth, rng): QuestionDraft {
    const n = p.rows * p.columns;
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [
            `${p.rows} rows of ${p.columns} counters.`,
            A.figure(array(p.rows, p.columns)),
          ],
          ask: "Which number sentence matches the array?",
          correct: A.math(`${p.rows} \\times ${p.columns} = ${n}`),
          distractors: [
            {
              content: A.math(`${p.rows} + ${p.columns} = ${p.rows + p.columns}`),
              code: "MD.MULTIPLY.ADDS",
              feedback: `There are ${p.rows} rows of ${p.columns}, so multiply.`,
            },
            {
              content: A.math(`${n} \\div ${p.rows} = ${p.rows}`),
              feedback: `${n} shared into ${p.rows} rows gives ${p.columns} in each row, not ${p.rows}.`,
            },
            {
              content: A.math(`${p.columns} \\div ${n} = ${p.rows}`),
              code: "MD.DIVIDE.ORDER",
              feedback: `Division starts with the total: ${n} ÷ ${p.columns} = ${p.rows}.`,
            },
          ],
          solution: [{ say: `${p.rows} rows of ${p.columns} is ${p.rows} × ${p.columns} = ${n}.` }],
        });
      case 2:
        return A.missingValue({
          intro: [
            `The array has ${n} counters in ${p.rows} rows.`,
            A.figure(array(p.rows, p.columns)),
          ],
          relation: [n, "\\div", p.rows, "=", p.columns],
          hide: p.hide,
          wrong:
            p.hide === 4
              ? wrongs(p.columns, [
                  {
                    code: "MD.MULTIPLY.ADDS",
                    value: A.number(n + p.rows),
                    feedback: "Dividing shares the counters out, so the answer is smaller.",
                  },
                ])
              : [],
          solution: [
            {
              say: `${n} counters in ${p.rows} rows is ${p.columns} in each row: ${n} ÷ ${p.rows} = ${p.columns}.`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Mo writes ",
            A.math(`${p.columns} \\div ${n} = ${p.rows}`),
            ` for ${n} counters in rows of ${p.columns}.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. Division starts with the total: ${n} ÷ ${p.columns} = ${p.rows}.`,
              correct: true,
            },
            {
              text: "True. You can write division in any order, like multiplication.",
              code: "MD.DIVIDE.ORDER",
            },
            { text: "True. It uses the right three numbers." },
          ],
          solution: [
            {
              say: `${p.rows} × ${p.columns} = ${n}, ${p.columns} × ${p.rows} = ${n}, ${n} ÷ ${p.columns} = ${p.rows} and ${n} ÷ ${p.rows} = ${p.columns}.`,
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return chosenText(question) === `${p.rows} \\times ${p.columns} = ${p.rows * p.columns}`;
    if (question.archetype === "missing-value")
      return numberAnswer(question) === (p.hide === 2 ? p.rows : p.columns);
    return true;
  },
});
