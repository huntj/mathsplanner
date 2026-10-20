/**
 * @statement Y7-NPV-10
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y7-NPV-10: Use a calculator and other technologies to calculate results accurately and then
// interpret them appropriately
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  /** Depth 1: (a + b) ÷ (c × d), with a and b to 2 dp and d to 1 dp, stored as whole hundredths and tenths. */
  a: number;
  b: number;
  c: number;
  d: number;
  /** Depth 2: each share in pence, a multiple of 10p, and how many share. */
  share: number;
  people: number;
  /** Depths 4 and 5: whether the answer rounds up (coaches) or down (full boxes). */
  up: boolean;
  total: number;
  size: number;
}

const to2dp = (x: number) => Number(x.toFixed(2));
const display = (x: number) => String(Number(x.toPrecision(10)));

function calculation(p: Params) {
  const [a, b, d] = [p.a / 100, p.b / 100, p.d / 10];
  return { a, b, d, value: (a + b) / (p.c * d), typed: a + (b / p.c) * d };
}

function grouping(p: Params) {
  const shown = display(p.total / p.size);
  const answer = p.up ? Math.ceil(p.total / p.size) : Math.floor(p.total / p.size);
  const other = p.up ? Math.floor(p.total / p.size) : Math.ceil(p.total / p.size);
  const left = p.up ? answer * p.size - p.total : p.total - answer * p.size;
  return { shown, answer, other, left };
}

const story = (p: Params) =>
  p.up
    ? {
        setup: `${p.total} people are going on a trip. Each coach holds ${p.size} people.`,
        sum: `${p.total} ÷ ${p.size}`,
        ask: "How many coaches are needed?",
        leftAsk: "How many empty seats will there be?",
        unit: "coaches",
      }
    : {
        setup: `A farm has ${p.total} eggs to pack into boxes of ${p.size}.`,
        sum: `${p.total} ÷ ${p.size}`,
        ask: "How many full boxes can be packed?",
        leftAsk: "How many eggs are left over?",
        unit: "full boxes",
      };

export default defineGenerator<Params>({
  id: "Y7-NPV-10",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: ["NPV.CALC.MONEY", "NPV.CALC.ROUND-CONTEXT", "NPV.ORDER.LEFT-TO-RIGHT"],

  params(rng, numbers) {
    const p: Params = {
      a: rng.int(110, 990),
      b: rng.int(110, 990),
      c: rng.int(2, numbers === "friendly" ? 5 : 9),
      d: rng.int(12, 49),
      share: rng.int(11, 99) * 10,
      people: rng.int(3, numbers === "stretch" ? 12 : 6),
      up: rng.bool(),
      total: rng.int(numbers === "friendly" ? 40 : 100, numbers === "stretch" ? 999 : 300),
      size: rng.pick(numbers === "friendly" ? [6, 10, 12] : [6, 12, 16, 24, 30, 45, 52]),
    };
    if (p.share % 100 === 0) reject("the share must show as one decimal place");
    if (p.total % p.size === 0 || p.total < 2 * p.size)
      reject("the division must leave a remainder");
    const { value, typed } = calculation(p);
    const frac = (value * 100) % 1;
    if (Math.abs(frac - 0.5) < 0.02 || to2dp(value) === to2dp(typed) || value < 0.01)
      reject("a clear 2 dp answer that brackets change");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const { a, b, d, value, typed } = calculation(p);
        const answer = to2dp(value);
        const latex = `\\frac{${a.toFixed(2)} + ${b.toFixed(2)}}{${p.c} \\times ${d.toFixed(1)}}`;
        return A.standard({
          calculator: true,
          question: ["Use a calculator to work out ", A.math(latex), "."],
          ask: "Give your answer to 2 decimal places.",
          answer: A.number(answer),
          wrong: wrongs(answer, [
            {
              code: "NPV.ORDER.LEFT-TO-RIGHT",
              value: A.number(to2dp(typed)),
              feedback:
                "Put brackets round the top and the bottom of the fraction when you type it in, or use the fraction key.",
            },
          ]),
          solution: [
            {
              say: "Type it with brackets:",
              math: `(${a.toFixed(2)} + ${b.toFixed(2)}) \\div (${p.c} \\times ${d.toFixed(1)})`,
            },
            {
              say: `The calculator shows ${display(value)}, which is ${answer.toFixed(2)} to 2 decimal places.`,
            },
          ],
        });
      }
      case 2: {
        const pounds = p.share / 100;
        const bill = ((p.share * p.people) / 100).toFixed(2);
        const [whole, tenths] = [Math.floor(pounds), (p.share % 100) / 10];
        return A.choice({
          rng,
          archetype: "varied-form",
          calculator: true,
          question: [
            `${p.people} friends share a bill of £${bill} equally. The calculator shows `,
            A.math(display(pounds)),
            ".",
          ],
          ask: "How much does each friend pay?",
          correct: `£${pounds.toFixed(2)}`,
          distractors: [
            {
              content: `£${whole}.0${tenths}`,
              code: "NPV.CALC.MONEY",
              feedback: `${display(pounds)} means ${tenths} tenths of a pound, which is ${tenths}0p, so £${pounds.toFixed(2)}.`,
            },
            {
              content: `${Math.round(pounds * 10)}p`,
              feedback: "The calculator shows pounds, not pence.",
            },
            {
              content: `£${(pounds * 10).toFixed(2)}`,
              feedback: `Check: ${p.people} × £${(pounds * 10).toFixed(2)} is much more than the bill.`,
            },
          ],
          solution: [
            {
              say: `${display(pounds)} pounds is £${pounds.toFixed(2)}: in money we always write two decimal places.`,
            },
          ],
        });
      }
      case 4: {
        const s = story(p);
        const g = grouping(p);
        return A.trueOrFalseWhy({
          rng,
          calculator: true,
          statement: [
            `${s.setup} For ${s.sum} the calculator shows `,
            A.math(g.shown),
            `. Jo says the answer is ${Math.round(p.total / p.size)} ${s.unit}.`,
          ],
          truth: Math.round(p.total / p.size) === g.answer,
          reasons:
            Math.round(p.total / p.size) === g.answer
              ? [
                  {
                    text: p.up
                      ? `True. ${g.other} coaches would leave people behind, so round up.`
                      : "True. Only whole boxes count, so round down.",
                    correct: true,
                  },
                  {
                    text: "False: you must always round to the nearest whole number.",
                    code: "NPV.CALC.ROUND-CONTEXT",
                  },
                  { text: `False: write the full answer, ${g.shown}.` },
                ]
              : [
                  {
                    text: p.up
                      ? `False. ${Math.round(p.total / p.size)} coaches would leave people behind, so ${g.answer} are needed.`
                      : `False. Only ${g.answer} boxes can be filled; there are not enough eggs for another.`,
                    correct: true,
                  },
                  {
                    text: "True: round to the nearest whole number.",
                    code: "NPV.CALC.ROUND-CONTEXT",
                  },
                  { text: `False: write the full answer, ${g.shown}.` },
                ],
          solution: [
            {
              say: `${s.sum} = ${g.shown}. ${p.up ? "Everyone needs a seat, so round up" : "Only full boxes count, so round down"}: ${g.answer} ${s.unit}.`,
            },
          ],
        });
      }
      default: {
        const s = story(p);
        const g = grouping(p);
        return A.multiStepContext({
          calculator: true,
          context: [`${s.setup} For ${s.sum} the calculator shows `, A.math(g.shown), "."],
          parts: [
            {
              ask: s.ask,
              answer: A.number(g.answer),
              wrong: [
                {
                  code: "NPV.CALC.ROUND-CONTEXT",
                  value: A.number(g.other),
                  feedback: p.up
                    ? "Everyone needs a seat, so round up even though the decimal is small."
                    : "A box that is not full does not count, so round down.",
                },
              ],
            },
            { ask: s.leftAsk, answer: A.number(g.left) },
          ],
          solution: [
            { say: `${p.up ? "Round up" : "Round down"} in this context: ${g.answer} ${s.unit}.` },
            {
              say: p.up
                ? `${g.answer} × ${p.size} = ${g.answer * p.size} seats, and ${g.answer * p.size} − ${p.total} = ${g.left}.`
                : `${g.answer} × ${p.size} = ${g.answer * p.size} eggs, and ${p.total} − ${g.answer * p.size} = ${g.left}.`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return (
        Math.abs(numberAnswer(question) - (p.a / 100 + p.b / 100) / (p.c * (p.d / 10))) < 0.005
      );
    if (question.archetype === "varied-form")
      return chosenText(question) === `£${(p.share / 100).toFixed(2)}`;
    if (question.archetype === "multi-step-context") {
      const n = numberAnswer(question);
      const left = numberAnswer(question, 1);
      return p.up
        ? n * p.size >= p.total && (n - 1) * p.size < p.total && left === n * p.size - p.total
        : n * p.size <= p.total && (n + 1) * p.size > p.total && left === p.total - n * p.size;
    }
    return true;
  },
});
