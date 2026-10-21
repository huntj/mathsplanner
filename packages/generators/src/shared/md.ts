// Multiplication and division families. Times tables, written methods, mental methods, factors,
// primes and word problems come back each year with bigger numbers, so each is written once here and
// a statement's generator picks its own ranges. See docs/design.md: shared code, not copies.
import * as A from "@mathsplanner/archetypes";
import {
  reject,
  type GeneratorDefinition,
  type Numbers,
  type QuestionDraft,
  type Rng,
} from "@mathsplanner/core";
import type { CountersSpec } from "@mathsplanner/diagrams";
import { wrongs } from "./angles.ts";
import { chosenFigure, chosenText, numberAnswer } from "./counting.ts";
import { fmt, tex, type Ranges } from "./npv.ts";

const PLACES = ["ones", "tens", "hundreds", "thousands", "ten thousands"];
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const len = (n: number) => String(n).length;
const digitAt = (n: number, k: number) => Math.floor(n / 10 ** k) % 10;
const randomDigits = (rng: Rng, d: number) => rng.int(10 ** (d - 1), 10 ** d - 1);

/** An array of counters; `hidden` keeps its size out of the description. */
export const array = (rows: number, columns: number, hidden = false): CountersSpec => ({
  type: "counters",
  layout: "array",
  rows,
  columns,
  ...(hidden ? { description: "An array of counters." } : {}),
});

/** All the factors of n, smallest first. */
export function factorsOf(n: number): number[] {
  const small: number[] = [];
  const large: number[] = [];
  for (let k = 1; k * k <= n; k++) {
    if (n % k !== 0) continue;
    small.push(k);
    if (k * k !== n) large.unshift(n / k);
  }
  return [...small, ...large];
}

export const isPrime = (n: number) => n > 1 && factorsOf(n).length === 2;

// --- times tables --------------------------------------------------------------------------------------

export interface TablesParams {
  t: number;
  a: number;
  divide: boolean;
  /** Depth 3: an array of rows × columns. */
  rows: number;
  columns: number;
  claim: number;
}

/** Recall multiplication and division facts for the given tables. */
export function timesTables(
  id: string,
  tables: Record<Numbers, number[]>,
  most: Record<Numbers, number>,
): GeneratorDefinition<TablesParams> {
  return {
    id,
    version: "1.0.0",
    depths: [1, 2, 3, 4],
    misconceptions: ["MD.TABLES.NEIGHBOUR", "MD.MULTIPLY.ADDS", "MD.DIVIDE.ORDER"],

    params(rng, numbers) {
      const t = rng.pick(tables[numbers]);
      const a = rng.int(2, most[numbers]);
      const small = tables[numbers].filter((x) => x <= 10);
      const columns = rng.pick(small.length ? small : [2, 5, 10]);
      const rows = rng.int(2, 6);
      if (rows === columns) reject("a non-square array");
      return { t, a, divide: rng.bool(), rows, columns, claim: rng.int(0, 1) };
    },

    build(p, depth, rng): QuestionDraft {
      const c = p.a * p.t;
      const neighbours = (answer: number, fact: (k: number) => string) =>
        wrongs(
          answer,
          [answer - 1, answer + 1].map((k) => ({
            code: "MD.TABLES.NEIGHBOUR",
            value: A.number(k),
            feedback: `Check: ${fact(k)}.`,
          })),
        );
      switch (depth) {
        case 1:
          return p.divide
            ? A.standard({
                question: [A.math(`${c} \\div ${p.t}`)],
                ask: "Work it out.",
                answer: A.number(p.a),
                wrong: neighbours(p.a, (k) => `${k} × ${p.t} = ${k * p.t}, not ${c}`),
                solution: [{ say: `${p.a} × ${p.t} = ${c}, so ${c} ÷ ${p.t} = ${p.a}.` }],
              })
            : A.standard({
                question: [A.math(`${p.a} \\times ${p.t}`)],
                ask: "Work it out.",
                answer: A.number(c),
                wrong: wrongs(
                  c,
                  [c - p.t, c + p.t].map((v) => ({
                    code: "MD.TABLES.NEIGHBOUR",
                    value: A.number(v),
                    feedback: `${fmt(v)} is ${v / p.t} × ${p.t}. Count on in ${p.t}s from a fact you know.`,
                  })),
                ),
                solution: [{ say: `${p.a} lots of ${p.t}: ${p.a} × ${p.t} = ${c}.` }],
              });
        case 2:
          return p.divide
            ? A.missingValue({
                intro: "Find the missing number.",
                relation: [c, "\\div", p.t, "=", p.a],
                hide: 2,
                wrong: neighbours(
                  p.t,
                  (k) => `${c} ÷ ${k} is not ${p.a}, because ${p.a} × ${k} = ${p.a * k}`,
                ),
                solution: [{ say: `${p.a} × ${p.t} = ${c}, so ${c} ÷ ${p.t} = ${p.a}.` }],
              })
            : A.missingValue({
                intro: "Find the missing number.",
                relation: [p.a, "\\times", p.t, "=", c],
                hide: 0,
                wrong: neighbours(p.a, (k) => `${k} × ${p.t} = ${k * p.t}, not ${c}`),
                solution: [
                  {
                    say: `Count in ${p.t}s to ${c}: that is ${p.a} lots, so ${p.a} × ${p.t} = ${c}.`,
                  },
                ],
              });
        case 3:
          return A.chooseTheDiagram({
            rng,
            question: ["Which array shows ", A.math(`${p.rows} \\times ${p.columns}`), "?"],
            correct: array(p.rows, p.columns, true),
            distractors: [
              {
                figure: array(p.rows + 1, p.columns, true),
                feedback: `That array has ${p.rows + 1} rows.`,
              },
              // Arrays have at most 12 columns, so the "added" row only appears when it fits.
              p.rows + p.columns <= 12
                ? {
                    figure: array(1, p.rows + p.columns, true),
                    code: "MD.MULTIPLY.ADDS",
                    feedback: `That is ${p.rows} + ${p.columns} in a line. ${p.rows} × ${p.columns} is ${p.rows} rows of ${p.columns}.`,
                  }
                : {
                    figure: array(p.rows - 1, p.columns, true),
                    feedback: `That array has ${p.rows - 1} rows.`,
                  },
            ],
            solution: [{ say: `${p.rows} rows of ${p.columns} make ${p.rows * p.columns}.` }],
          });
        default:
          return p.claim === 0
            ? A.alwaysSometimesNever({
                rng,
                claim: `A number in the ${p.t} times table is even.`,
                truth: p.t % 2 === 0 ? "always" : "sometimes",
                reasons:
                  p.t % 2 === 0
                    ? [
                        {
                          text: `Always. ${p.t} is even, and any number of lots of an even number is even.`,
                          correct: true,
                        },
                        { text: `Sometimes. ${p.t} × 3 is odd.` },
                        { text: "Never. Times-table answers are always odd." },
                      ]
                    : [
                        {
                          text: `Sometimes. ${p.t} × 2 = ${2 * p.t} is even, but ${p.t} × 3 = ${3 * p.t} is odd.`,
                          correct: true,
                        },
                        { text: "Always. Every times table goes up in even steps." },
                        { text: `Never. ${p.t} is odd, so all its multiples are odd.` },
                      ],
                solution: [
                  {
                    say: `The ${p.t} times table: ${[1, 2, 3, 4].map((k) => k * p.t).join(", ")}, …`,
                  },
                ],
              })
            : A.trueOrFalseWhy({
                rng,
                statement: [
                  "Sam knows ",
                  A.math(`${c} \\div ${p.t} = ${p.a}`),
                  ". He says ",
                  A.math(`${p.t} \\div ${c} = ${p.a}`),
                  " too.",
                ],
                truth: false,
                reasons: [
                  {
                    text: `False. Division cannot be done in any order. ${p.t} shared into ${c} groups is less than 1 each.`,
                    correct: true,
                  },
                  {
                    text: "True. You can swap the numbers, like in multiplication.",
                    code: "MD.DIVIDE.ORDER",
                  },
                  { text: "True. Both use the same numbers." },
                ],
                solution: [
                  {
                    say: `Multiplication can be done in any order (${p.a} × ${p.t} = ${p.t} × ${p.a}), but division cannot.`,
                  },
                ],
              });
      }
    },

    verify(p, question) {
      if (question.archetype === "standard")
        return numberAnswer(question) === (p.divide ? p.a : p.a * p.t);
      if (question.archetype === "missing-value")
        return numberAnswer(question) === (p.divide ? p.t : p.a);
      if (question.archetype === "choose-the-diagram") {
        const f = chosenFigure(question) as CountersSpec | undefined;
        return f?.layout === "array" && f.rows === p.rows && f.columns === p.columns;
      }
      return true;
    },
  };
}

// --- written multiplication ----------------------------------------------------------------------------

export interface Worked {
  lines: string[];
  total: number;
  carries: number[];
}

/** a × m for a one-digit m, column by column. Columns in `forget` drop the carry into them. */
export function shortMultiply(
  a: number,
  m: number,
  forget: (column: number) => boolean = () => false,
): Worked {
  const lines: string[] = [];
  const carries: number[] = [];
  let carry = 0;
  let total = 0;
  for (let i = 0; i < len(a); i++) {
    const d = digitAt(a, i);
    const carried = forget(i) ? 0 : carry;
    const s = d * m + carried;
    const top = i === len(a) - 1;
    total += (top ? s : s % 10) * 10 ** i;
    carry = top ? 0 : Math.floor(s / 10);
    if (carry) carries.push(i);
    lines.push(
      `${cap(PLACES[i] ?? "")}: ${d} × ${m}${carried ? ` + ${carried}` : ""} = ${s}. ` +
        (top ? `Write ${s}.` : carry ? `Write ${s % 10} and carry ${carry}.` : `Write ${s}.`),
    );
  }
  return { lines, total, carries };
}

/** a × b for a two-digit b: the two partial products, then their sum. */
export function longMultiply(a: number, b: number, placeholder = true): Worked {
  const [ones, tens] = [b % 10, Math.floor(b / 10)];
  const first = a * ones;
  const second = placeholder ? a * tens * 10 : a * tens;
  return {
    lines: [
      `${fmt(a)} × ${ones} = ${fmt(first)}.`,
      placeholder
        ? `${fmt(a)} × ${tens * 10} = ${fmt(second)}.`
        : `${fmt(a)} × ${tens} = ${fmt(second)}.`,
      `${fmt(first)} + ${fmt(second)} = ${fmt(first + second)}.`,
    ],
    total: first + second,
    carries: [],
  };
}

export const timesLatex = (a: number, b: number) =>
  `\\begin{array}{r}${tex(a)}\\\\ \\times\\;${tex(b)}\\\\ \\hline\\end{array}`;

export interface WrittenParams {
  a: number;
  b: number;
}

/** Short and long multiplication. `digits` gives the digits in the two numbers. */
export function writtenMultiply(
  id: string,
  digits: Record<Numbers, [number, number]>,
  carries: Record<Numbers, number>,
): GeneratorDefinition<WrittenParams> {
  return {
    id,
    version: "1.0.0",
    depths: [1, 2, 4],
    misconceptions: ["MD.WRITTEN.NO-CARRY", "MD.LONG.PLACEHOLDER", "MD.PARTITION.MISSES-PARTS"],

    params(rng, numbers) {
      const [da, db] = digits[numbers];
      const a = randomDigits(rng, da);
      const b = db === 1 ? rng.int(2, 9) : randomDigits(rng, db);
      if (b % 10 === 0 || a % 10 === 0) reject("no zero ones digits");
      if (db === 1 && shortMultiply(a, b).carries.length < carries[numbers])
        reject("enough carrying");
      return { a, b };
    },

    build(p, depth, rng): QuestionDraft {
      const answer = p.a * p.b;
      const long = p.b >= 10;
      const worked = long ? longMultiply(p.a, p.b) : shortMultiply(p.a, p.b);
      const wrong = wrongs(answer, [
        long
          ? {
              code: "MD.LONG.PLACEHOLDER",
              value: A.number(longMultiply(p.a, p.b, false).total),
              feedback: `The ${Math.floor(p.b / 10)} in ${p.b} is worth ${Math.floor(p.b / 10) * 10}, so multiply by ${Math.floor(p.b / 10) * 10}, or put a zero in the ones first.`,
            }
          : {
              code: "MD.WRITTEN.NO-CARRY",
              value: A.number(shortMultiply(p.a, p.b, () => true).total),
              feedback: "Add the digit you carried to the next column.",
            },
        long && p.a < 100
          ? {
              code: "MD.PARTITION.MISSES-PARTS",
              value: A.number(
                Math.floor(p.a / 10) * 10 * Math.floor(p.b / 10) * 10 + (p.a % 10) * (p.b % 10),
              ),
              feedback:
                "Every part of one number must be multiplied by every part of the other: four multiplications, not two.",
            }
          : undefined,
      ]);
      const solution = [
        { say: "Set it out in columns:", math: timesLatex(p.a, p.b) },
        ...worked.lines.map((say) => ({ say })),
        { say: `So ${fmt(p.a)} × ${p.b} = ${fmt(answer)}.` },
      ];
      switch (depth) {
        case 1:
          return A.standard({
            question: ["Use a written method to work out", A.displayMath(timesLatex(p.a, p.b))],
            answer: A.number(answer),
            wrong,
            solution,
          });
        case 2:
          return A.variedForm({
            rng,
            forms: [
              {
                question: [
                  "Find the product of ",
                  A.math(tex(p.a)),
                  " and ",
                  A.math(tex(p.b)),
                  ".",
                ],
              },
              {
                question: `A box holds ${fmt(p.a)} pins. How many pins are there in ${p.b} boxes?`,
              },
              {
                question: ["What is ", A.math(tex(p.a)), " multiplied by ", A.math(tex(p.b)), "?"],
              },
            ],
            answer: A.number(answer),
            wrong,
            solution,
          });
        default: {
          if (long) {
            const slip = longMultiply(p.a, p.b, false);
            return A.spotTheMistake({
              question: [
                "Zoe works out ",
                A.math(`${tex(p.a)} \\times ${p.b}`),
                " by long multiplication.",
              ],
              lines: [...slip.lines, `So the answer is ${fmt(slip.total)}.`],
              mistake: 1,
              code: "MD.LONG.PLACEHOLDER",
              feedback: `In line 2 the ${Math.floor(p.b / 10)} is really ${Math.floor(p.b / 10) * 10}: ${fmt(p.a)} × ${Math.floor(p.b / 10) * 10} = ${fmt(p.a * Math.floor(p.b / 10) * 10)}. The answer is ${fmt(answer)}.`,
            });
          }
          const at = (worked.carries[0] ?? 0) + 1;
          const slip = shortMultiply(p.a, p.b, (i) => i === at);
          return A.spotTheMistake({
            question: ["Zoe works out ", A.math(`${tex(p.a)} \\times ${p.b}`), " in columns."],
            lines: [...slip.lines, `So the answer is ${fmt(slip.total)}.`],
            mistake: at,
            code: "MD.WRITTEN.NO-CARRY",
            feedback: `In the ${PLACES[at]} Zoe forgot to add the digit she carried. The answer is ${fmt(answer)}.`,
          });
        }
      }
    },

    verify(p, question) {
      if (question.archetype === "spot-the-mistake")
        return (p.b >= 10 ? longMultiply(p.a, p.b) : shortMultiply(p.a, p.b)).total === p.a * p.b;
      return numberAnswer(question) === p.a * p.b;
    },
  };
}

// --- division ------------------------------------------------------------------------------------------

/** n ÷ d digit by digit. With `drop`, the remainder from the first column that has one is lost. */
export function divideSteps(
  n: number,
  d: number,
  long: boolean,
  drop = -1,
): Worked & { remainder: number } {
  const lines: string[] = [];
  const digits = String(n).split("").map(Number);
  let carry = 0;
  let q = 0;
  digits.forEach((x, i) => {
    const cur = carry * 10 + x;
    const qd = Math.floor(cur / d);
    const rem = cur - qd * d;
    const last = i === digits.length - 1;
    q = q * 10 + qd;
    const dropped = i === drop;
    carry = dropped ? 0 : rem;
    if (q === 0 && !last && rem === cur) {
      lines.push(`${cur} ÷ ${d} = 0, so carry the ${cur} on to the next digit.`);
      return;
    }
    const head = long
      ? `${cur} ÷ ${d} = ${qd}. ${qd} × ${d} = ${qd * d}, and ${cur} − ${qd * d} = ${rem}.`
      : `${cur} ÷ ${d} = ${qd}${rem ? ` remainder ${rem}` : ""}.`;
    const tail = last
      ? ""
      : dropped || rem === 0
        ? " Move on to the next digit."
        : long
          ? ` Bring down the next digit.`
          : ` Carry the ${rem} to the next digit.`;
    lines.push(head + tail);
  });
  return { lines, total: q, carries: [], remainder: carry };
}

export interface DivisionParams {
  d: number;
  q: number;
  r: number;
  /** Depth 2: give the remainder as a fraction (long division) rather than "r". */
  fraction: boolean;
  /** Depth 5: round up (minibuses) or down (full boxes). */
  up: boolean;
}

/** Short or long division, with remainders interpreted at depths 2 and 5. */
export function division(
  id: string,
  divisors: Ranges,
  digits: Record<Numbers, number>,
  long: boolean,
): GeneratorDefinition<DivisionParams> {
  const name = long ? "long division" : "short division";
  return {
    id,
    version: "1.0.0",
    depths: [1, 2, 4, 5],
    misconceptions: [
      "MD.SHORT-DIV.DROPS-REMAINDER",
      "MD.REMAINDER.AS-DECIMAL",
      "MD.REMAINDER.CONTEXT",
    ],

    params(rng, numbers) {
      const [lo, hi] = divisors[numbers];
      const d = rng.int(lo, hi);
      const D = digits[numbers];
      const q = rng.int(Math.ceil(10 ** (D - 1) / d), Math.floor((10 ** D - d) / d));
      const r = rng.int(1, d - 1);
      if (d % 10 === 0) reject("no multiples of 10 as divisors");
      // Short division should carry at least once, or there is nothing to get wrong.
      if (!divideSteps(q * d, d, long).lines.some((l) => /Carry the|Bring down/.test(l)))
        reject("a carry");
      return { d, q, r, fraction: long && rng.bool(), up: rng.bool() };
    },

    build(p, depth, rng): QuestionDraft {
      const n = p.q * p.d;
      const nr = n + p.r;
      const worked = divideSteps(n, p.d, long);
      switch (depth) {
        case 1: {
          const first = worked.lines.findIndex((l) => /Carry the|Bring down/.test(l));
          const slip = divideSteps(n, p.d, long, first).total;
          return A.standard({
            question: ["Use ", name, " to work out ", A.math(`${tex(n)} \\div ${p.d}`), "."],
            answer: A.number(p.q),
            wrong: wrongs(p.q, [
              {
                code: "MD.SHORT-DIV.DROPS-REMAINDER",
                value: A.number(slip),
                feedback:
                  "When a digit does not divide exactly, carry the remainder on to the next digit.",
              },
            ]),
            solution: [
              ...worked.lines.map((say) => ({ say })),
              { say: `So ${fmt(n)} ÷ ${p.d} = ${fmt(p.q)}.` },
            ],
          });
        }
        case 2: {
          const rText = `${tex(p.q)}\\text{ r }${p.r}`;
          const fText = `${tex(p.q)}\\tfrac{${p.r}}{${p.d}}`;
          const decimal = `${tex(p.q)}.${p.r}`;
          return A.choice({
            rng,
            archetype: "varied-form",
            question: ["Work out ", A.math(`${tex(nr)} \\div ${p.d}`), "."],
            ask: p.fraction
              ? "Give the remainder as a fraction. Which is right?"
              : "Which is right?",
            correct: A.math(p.fraction ? fText : rText),
            distractors: [
              {
                content: A.math(decimal),
                code: "MD.REMAINDER.AS-DECIMAL",
                feedback: `A remainder of ${p.r} is not ${p.r} tenths. It is ${p.r} out of ${p.d}${p.fraction ? `, so write it as a fraction of ${p.d}` : ""}.`,
              },
              {
                content: A.math(
                  p.fraction
                    ? `${tex(p.q)}\\tfrac{${p.d}}{${p.r}}`
                    : `${tex(p.q)}\\text{ r }${p.r + p.d}`,
                ),
                feedback: p.fraction
                  ? "The remainder goes on top: it is a part of the divisor."
                  : `A remainder must be less than ${p.d}; otherwise another ${p.d} fits.`,
              },
              {
                content: A.math(
                  p.fraction
                    ? `${tex(p.q + 1)}\\tfrac{${p.r}}{${p.d}}`
                    : `${tex(p.q + 1)}\\text{ r }${p.r}`,
                ),
                feedback: `${fmt(p.q + 1)} × ${p.d} = ${fmt((p.q + 1) * p.d)}, which is more than ${fmt(nr)}.`,
              },
            ],
            solution: [
              { say: `${fmt(p.q)} × ${p.d} = ${fmt(n)}, and ${fmt(nr)} − ${fmt(n)} = ${p.r}.` },
              {
                say: p.fraction
                  ? `${p.r} left out of ${p.d} is ${p.r}/${p.d}:`
                  : "So the answer is",
                math: p.fraction ? fText : rText,
              },
            ],
          });
        }
        case 4: {
          const first = worked.lines.findIndex((l) => /Carry the|Bring down/.test(l));
          const slip = divideSteps(n, p.d, long, first);
          return A.spotTheMistake({
            question: ["Omar uses ", name, " to work out ", A.math(`${tex(n)} \\div ${p.d}`), "."],
            lines: [
              ...slip.lines,
              `So the answer is ${fmt(slip.total)}${slip.remainder ? ` remainder ${slip.remainder}` : ""}.`,
            ],
            mistake: first,
            code: "MD.SHORT-DIV.DROPS-REMAINDER",
            feedback: `Line ${first + 1} has a remainder, but Omar does not ${long ? "bring it down with the next digit" : "carry it to the next digit"}. The answer is ${fmt(p.q)}.`,
          });
        }
        default: {
          const answer = p.up ? p.q + 1 : p.q;
          const left = p.up ? (p.q + 1) * p.d - nr : p.r;
          return A.multiStepContext({
            context: p.up
              ? `${fmt(nr)} people are going on a trip. Each minibus holds ${p.d} people.`
              : `A factory packs ${fmt(nr)} eggs into boxes of ${p.d}.`,
            parts: [
              {
                ask: p.up ? "How many minibuses are needed?" : "How many boxes can be filled?",
                answer: A.number(answer),
                wrong: wrongs(answer, [
                  {
                    code: "MD.REMAINDER.CONTEXT",
                    value: A.number(p.up ? p.q : p.q + 1),
                    feedback: p.up
                      ? `${fmt(p.q)} minibuses leave ${p.r} people behind, so one more is needed.`
                      : `Only full boxes count: the ${p.r} eggs left over do not fill a box.`,
                  },
                ]),
              },
              {
                ask: p.up ? "How many empty seats are there?" : "How many eggs are left over?",
                answer: A.number(left),
              },
            ],
            solution: [
              { say: `${fmt(nr)} ÷ ${p.d} = ${fmt(p.q)} remainder ${p.r}.` },
              {
                say: p.up
                  ? `Everyone needs a seat, so ${fmt(answer)} minibuses, with ${fmt(answer * p.d)} − ${fmt(nr)} = ${left} empty seats.`
                  : `${fmt(p.q)} full boxes, and ${p.r} eggs left over.`,
              },
            ],
          });
        }
      }
    },

    verify(p, question) {
      const nr = p.q * p.d + p.r;
      if (question.archetype === "standard") return numberAnswer(question) * p.d === p.q * p.d;
      if (question.archetype === "varied-form") {
        const m = /^([\d{},]+)(?:\\text\{ r \}(\d+)|\\tfrac\{(\d+)\}\{(\d+)\})$/.exec(
          chosenText(question),
        );
        if (!m) return false;
        const whole = Number((m[1] ?? "").replace(/\{,\}/g, ""));
        const rem = Number(m[2] ?? m[3]);
        return (
          whole * p.d + rem === nr && rem < p.d && (m[4] === undefined || Number(m[4]) === p.d)
        );
      }
      if (question.archetype === "multi-step-context") {
        const k = numberAnswer(question, 0);
        return p.up ? k * p.d >= nr && (k - 1) * p.d < nr : k * p.d <= nr && (k + 1) * p.d > nr;
      }
      return divideSteps(p.q * p.d, p.d, long).total === p.q;
    },
  };
}

// --- mental methods ------------------------------------------------------------------------------------

/** "mixed" is x × y + z with round numbers, e.g. 300 × 4 + 250. */
export type MentalKind =
  "times-tens" | "divide-tens" | "zero-one" | "three" | "double-halve" | "mixed";

export interface MentalParams {
  kind: MentalKind;
  x: number;
  y: number;
  z: number;
  /** For zero-one: 0 is × 0, 1 is × 1, 2 is ÷ 1. */
  which: number;
  /** Depth 4: a claim about 10s, true or with a zero miscounted. */
  claimTrue: boolean;
  cx: number;
  cy: number;
}

/** Multiply and divide mentally using place value and known facts. */
export function mentalMD(
  id: string,
  kinds: Record<Numbers, MentalKind[]>,
  zeros: Record<Numbers, number>,
): GeneratorDefinition<MentalParams> {
  const answerOf = (p: MentalParams): number => {
    switch (p.kind) {
      case "times-tens":
      case "double-halve":
        return p.x * p.y;
      case "divide-tens":
        return p.x / p.y;
      case "zero-one":
        return p.which === 0 ? 0 : p.x;
      case "three":
        return p.x * p.y * p.z;
      case "mixed":
        return p.x * p.y + p.z;
    }
  };
  return {
    id,
    version: "1.0.0",
    depths: [1, 2, 4],
    misconceptions: ["MD.PLACE.ZEROS", "MD.ZERO-ONE.IDENTITY", "MD.MULTIPLY.ADDS"],

    params(rng, numbers) {
      const kind = rng.pick(kinds[numbers]);
      const most = zeros[numbers];
      const k1 = rng.int(0, most);
      const k2 = rng.int(kind === "times-tens" && k1 === 0 ? 1 : 0, Math.max(0, most - k1));
      const [d1, d2] = [rng.int(2, 9), rng.int(2, 9)];
      let [x, y, z] = [d1 * 10 ** k1, d2 * 10 ** k2, 1];
      if (kind === "divide-tens") [x, y] = [d1 * d2 * 10 ** Math.max(1, k1), d2];
      if (kind === "zero-one") [x, y] = [rng.int(12, 10 ** (most + 2) - 1), 1];
      if (kind === "three") {
        const [pa, pb] = rng.pick([
          [2, 5],
          [4, 25],
          [5, 4],
          [2, 50],
          [20, 5],
        ] as const);
        [x, y, z] = [rng.int(3, 19), pa, pb];
      }
      if (kind === "double-halve") [x, y] = [rng.pick([5, 25, 50]), rng.int(3, 24) * 2];
      if (kind === "mixed") [x, y, z] = [d1 * 10 ** Math.max(1, k1), d2, rng.int(1, 19) * 50];
      const [c1, c2] = [rng.int(2, 9) * 10, rng.int(2, 9) * 10 ** rng.int(1, Math.max(1, most))];
      if (kind === "times-tens" && x === y) reject("different numbers");
      return { kind, x, y, z, which: rng.int(0, 2), claimTrue: rng.bool(), cx: c1, cy: c2 };
    },

    build(p, depth, rng): QuestionDraft {
      const answer = answerOf(p);
      const latex =
        p.kind === "divide-tens"
          ? `${tex(p.x)} \\div ${p.y}`
          : p.kind === "three"
            ? `${p.x} \\times ${p.y} \\times ${p.z}`
            : p.kind === "mixed"
              ? `${tex(p.x)} \\times ${p.y} + ${tex(p.z)}`
              : p.kind === "zero-one"
                ? p.which === 2
                  ? `${tex(p.x)} \\div 1`
                  : `${tex(p.x)} \\times ${p.which}`
                : `${tex(p.x)} \\times ${tex(p.y)}`;
      const wrong = wrongs(answer, [
        ...(p.kind === "times-tens" || p.kind === "divide-tens"
          ? [answer / 10, answer * 10].filter(Number.isInteger).map((v) => ({
              code: "MD.PLACE.ZEROS",
              value: A.number(v),
              feedback:
                "Use the fact you know, then think about place value: how many tens or hundreds are there?",
            }))
          : []),
        ...(p.kind === "zero-one"
          ? [
              {
                code: "MD.ZERO-ONE.IDENTITY",
                value: A.number(p.which === 0 ? p.x : 1),
                feedback:
                  p.which === 0
                    ? "Zero lots of any number is 0."
                    : "Multiplying or dividing by 1 leaves the number the same.",
              },
            ]
          : []),
        ...(p.kind === "three"
          ? [
              {
                code: "MD.MULTIPLY.ADDS",
                value: A.number(p.x + p.y + p.z),
                feedback: "These are multiplied, not added.",
              },
            ]
          : []),
      ]);
      const how: Record<MentalKind, string> = {
        "times-tens": `${p.x / 10 ** Math.floor(Math.log10(p.x))} × ${p.y / 10 ** Math.floor(Math.log10(p.y))} = ${(p.x / 10 ** Math.floor(Math.log10(p.x))) * (p.y / 10 ** Math.floor(Math.log10(p.y)))}, then make it ${10 ** (Math.floor(Math.log10(p.x)) + Math.floor(Math.log10(p.y)))} times bigger: ${fmt(answer)}.`,
        "divide-tens": (() => {
          const k = String(answer).length - String(answer).replace(/0+$/, "").length;
          return `${p.x / 10 ** k} ÷ ${p.y} = ${answer / 10 ** k}, so ${fmt(p.x)} ÷ ${p.y} = ${fmt(answer)}.`;
        })(),
        "zero-one":
          p.which === 0
            ? `Zero lots of anything is 0.`
            : `Multiplying or dividing by 1 leaves ${fmt(p.x)} the same.`,
        three: `Multiply ${p.y} × ${p.z} = ${p.y * p.z} first, then ${p.x} × ${p.y * p.z} = ${fmt(answer)}.`,
        "double-halve": `Double ${p.x} and halve ${p.y}: ${p.x * 2} × ${p.y / 2} = ${fmt(answer)}.`,
        mixed: `Multiply first: ${fmt(p.x)} × ${p.y} = ${fmt(p.x * p.y)}. Then add: ${fmt(p.x * p.y)} + ${fmt(p.z)} = ${fmt(answer)}.`,
      };
      switch (depth) {
        case 1:
          return A.standard({
            question: [A.math(latex)],
            ask: "Work it out in your head.",
            answer: A.number(answer),
            wrong,
            solution: [{ say: how[p.kind] }],
          });
        case 2:
          return A.variedForm({
            rng,
            forms: [
              { question: ["What is ", A.math(latex), "?"] },
              p.kind === "divide-tens"
                ? {
                    question: `${fmt(p.x)} sweets are shared equally between ${p.y} jars.`,
                    ask: "How many sweets go in each jar?",
                  }
                : p.kind === "zero-one" && p.which === 2
                  ? {
                      question: `${fmt(p.x)} sweets are put into 1 jar.`,
                      ask: "How many sweets are in the jar?",
                    }
                  : { question: ["Find the product: ", A.math(latex), "."] },
            ],
            answer: A.number(answer),
            wrong,
            solution: [{ say: how[p.kind] }],
          });
        default: {
          const real = p.cx * p.cy;
          const said = p.claimTrue ? real : real / 10;
          return A.trueOrFalseWhy({
            rng,
            statement: [
              "Ivy says ",
              A.math(`${tex(p.cx)} \\times ${tex(p.cy)} = ${tex(said)}`),
              ".",
            ],
            truth: p.claimTrue,
            reasons: p.claimTrue
              ? [
                  {
                    text: `True. ${p.cx / 10} × ${p.cy / 10 ** Math.floor(Math.log10(p.cy))} = ${(p.cx / 10) * (p.cy / 10 ** Math.floor(Math.log10(p.cy)))}, and the answer is ${10 ** (1 + Math.floor(Math.log10(p.cy)))} times bigger.`,
                    correct: true,
                  },
                  {
                    text: "False. Count the zeros: there are fewer zeros in the answer.",
                    code: "MD.PLACE.ZEROS",
                  },
                  { text: "False. You must use the column method." },
                ]
              : [
                  {
                    text: `False. ${p.cx / 10} × ${p.cy / 10 ** Math.floor(Math.log10(p.cy))} = ${(p.cx / 10) * (p.cy / 10 ** Math.floor(Math.log10(p.cy)))}, and the answer is ${10 ** (1 + Math.floor(Math.log10(p.cy)))} times bigger: ${fmt(real)}.`,
                    correct: true,
                  },
                  {
                    text: "True. Count the zeros in the question and put the same number on the end.",
                    code: "MD.PLACE.ZEROS",
                  },
                  { text: "True. Multiplying makes numbers bigger, and it is bigger." },
                ],
            solution: [{ say: `${fmt(p.cx)} × ${fmt(p.cy)} = ${fmt(real)}.` }],
          });
        }
      }
    },

    verify(p, question) {
      if (question.archetype === "true-or-false-why") return true;
      return numberAnswer(question) === answerOf(p);
    },
  };
}

// --- factors and multiples -----------------------------------------------------------------------------

const RICH = [
  12, 18, 20, 24, 28, 30, 32, 36, 40, 42, 44, 45, 48, 50, 54, 56, 60, 63, 64, 66, 70, 72, 75, 80,
  84, 88, 90, 96, 100,
];

export interface FactorParams {
  n: number;
  a: number;
  /** Two numbers with a common factor g, for depth 1 when `common`. */
  x: number;
  y: number;
  multiple: boolean;
  claim: number;
}

/** Factors, factor pairs and multiples; with `common`, common factors and multiples too. */
export function factorsFamily(
  id: string,
  most: Record<Numbers, number>,
  common: boolean,
): GeneratorDefinition<FactorParams> {
  return {
    id,
    version: "1.0.0",
    depths: [1, 2, 4],
    misconceptions: ["MD.FACTOR.MISSES-PAIR", "MD.FACTOR.FACTOR-MULTIPLE"],

    params(rng, numbers) {
      const n = rng.pick(RICH.filter((k) => k <= most[numbers]));
      const middle = factorsOf(n).filter((k) => k > 1 && k < n);
      const a = rng.pick(middle);
      const g = rng.int(2, 6);
      const [x, y] = [g * rng.int(2, 7), g * rng.int(2, 7)];
      if (x % y === 0 || y % x === 0 || factorsOf(n).length < 6)
        reject("neither divides the other; plenty of factors");
      return { n, a, x, y, multiple: common && rng.bool(), claim: rng.int(0, common ? 2 : 1) };
    },

    build(p, depth, rng): QuestionDraft {
      const fs = factorsOf(p.n);
      switch (depth) {
        case 1: {
          if (common) {
            const hcf =
              factorsOf(p.x)
                .filter((k) => p.y % k === 0)
                .at(-1) ?? 1;
            const lcm = (p.x * p.y) / hcf;
            return p.multiple
              ? A.standard({
                  question: `Find the smallest number that is a multiple of both ${p.x} and ${p.y}.`,
                  answer: A.number(lcm),
                  wrong: wrongs(lcm, [
                    {
                      code: "MD.FACTOR.FACTOR-MULTIPLE",
                      value: A.number(hcf),
                      feedback: `${hcf} is a common factor. A common multiple is in both times tables.`,
                    },
                  ]),
                  solution: [
                    {
                      say: `Multiples of ${p.x}: ${[1, 2, 3, 4, 5].map((k) => k * p.x).join(", ")}, … The first one that is also a multiple of ${p.y} is ${lcm}.`,
                    },
                  ],
                })
              : A.standard({
                  question: `Find the biggest number that is a factor of both ${p.x} and ${p.y}.`,
                  answer: A.number(hcf),
                  wrong: wrongs(hcf, [
                    {
                      code: "MD.FACTOR.FACTOR-MULTIPLE",
                      value: A.number(lcm),
                      feedback: `${lcm} is a common multiple. A common factor divides into both numbers.`,
                    },
                  ]),
                  solution: [
                    {
                      say: `Factors of ${p.x}: ${factorsOf(p.x).join(", ")}. Factors of ${p.y}: ${factorsOf(p.y).join(", ")}. The biggest in both lists is ${hcf}.`,
                    },
                  ],
                });
          }
          const other = p.n / p.a;
          return A.missingValue({
            intro: `${p.a} and another number make a factor pair of ${p.n}.`,
            relation: [p.a, "\\times", other, "=", p.n],
            hide: 2,
            wrong: wrongs(other, [
              {
                code: "MD.FACTOR.FACTOR-MULTIPLE",
                value: A.number(p.n * p.a),
                feedback: `A factor pair multiplies to make ${p.n}, so the other factor is ${p.n} ÷ ${p.a}.`,
              },
            ]),
            solution: [{ say: `${p.n} ÷ ${p.a} = ${other}, so ${p.a} × ${other} = ${p.n}.` }],
          });
        }
        case 2: {
          const pairs = fs.length / 2;
          const midPair = [fs[1], fs[fs.length - 2]];
          return A.choice({
            rng,
            archetype: "varied-form",
            question: `Which list shows all the factors of ${p.n}?`,
            correct: fs.join(", "),
            distractors: [
              {
                content: fs.filter((k) => k !== 1 && k !== p.n).join(", "),
                code: "MD.FACTOR.MISSES-PAIR",
                feedback: `1 and ${p.n} are a factor pair too: 1 × ${p.n} = ${p.n}.`,
              },
              {
                content: fs.filter((k) => !midPair.includes(k)).join(", "),
                code: "MD.FACTOR.MISSES-PAIR",
                feedback: `${midPair[0]} × ${midPair[1]} = ${p.n}, so they are factors too.`,
              },
              {
                content: [1, 2, 3, 4].map((k) => k * p.n).join(", "),
                code: "MD.FACTOR.FACTOR-MULTIPLE",
                feedback: `Those are multiples of ${p.n}. Factors divide into ${p.n}.`,
              },
            ],
            solution: [
              {
                say: `Work in pairs: ${Array.from({ length: Math.ceil(pairs) }, (_, i) => `${fs[i]} × ${fs[fs.length - 1 - i]}`).join(", ")}.`,
              },
            ],
          });
        }
        default: {
          const g =
            factorsOf(p.x)
              .filter((k) => p.y % k === 0)
              .at(-1) ?? 1;
          if (p.claim === 2)
            return A.trueOrFalseWhy({
              rng,
              statement: [`${g} is a common factor of ${p.x} and ${p.y}.`],
              truth: true,
              reasons: [
                {
                  text: `True. ${p.x} = ${g} × ${p.x / g} and ${p.y} = ${g} × ${p.y / g}, so ${g} divides into both.`,
                  correct: true,
                },
                {
                  text: `False. ${g} is a common multiple of ${p.x} and ${p.y}.`,
                  code: "MD.FACTOR.FACTOR-MULTIPLE",
                },
                { text: "False. Only 1 can be a common factor." },
              ],
              solution: [{ say: `${p.x} ÷ ${g} = ${p.x / g} and ${p.y} ÷ ${g} = ${p.y / g}.` }],
            });
          return p.claim === 0
            ? A.alwaysSometimesNever({
                rng,
                claim: "A whole number has an even number of factors.",
                truth: "sometimes",
                reasons: [
                  {
                    text: "Sometimes. Factors come in pairs, but a square number like 36 has a pair that is the same (6 × 6), so it has an odd number of factors.",
                    correct: true,
                  },
                  {
                    text: "Always. Factors always come in pairs of different numbers.",
                    code: "MD.FACTOR.MISSES-PAIR",
                  },
                  { text: "Never. 1 is a factor on its own." },
                ],
                solution: [
                  {
                    say: `${p.n} has ${fs.length} factors: ${fs.join(", ")}. 36 has 9: 1, 2, 3, 4, 6, 9, 12, 18, 36.`,
                  },
                ],
              })
            : A.trueOrFalseWhy({
                rng,
                statement: [`${p.n * 2} is a factor of ${p.n}.`],
                truth: false,
                reasons: [
                  {
                    text: `False. ${p.n * 2} is a multiple of ${p.n}. A factor of ${p.n} divides into it, so it cannot be bigger than ${p.n}.`,
                    correct: true,
                  },
                  { text: `True. ${p.n} × 2 = ${p.n * 2}.`, code: "MD.FACTOR.FACTOR-MULTIPLE" },
                  { text: "True. Every even number is a factor." },
                ],
                solution: [{ say: `The factors of ${p.n} are ${fs.join(", ")}.` }],
              });
        }
      }
    },

    verify(p, question) {
      if (question.archetype === "varied-form")
        return chosenText(question) === factorsOf(p.n).join(", ");
      if (question.archetype === "missing-value") return numberAnswer(question) * p.a === p.n;
      if (question.archetype === "standard") {
        const v = numberAnswer(question);
        return p.multiple ? v % p.x === 0 && v % p.y === 0 : p.x % v === 0 && p.y % v === 0;
      }
      return true;
    },
  };
}

// --- primes --------------------------------------------------------------------------------------------

const ODD_COMPOSITES = [
  9, 15, 21, 25, 27, 33, 35, 39, 45, 49, 51, 55, 57, 63, 65, 69, 75, 77, 81, 85, 87, 91, 93, 95, 99,
];

export interface PrimeParams {
  prime: number;
  odd: number;
  even: number;
  /** Depth 2: a number to factorise into primes, or a prime to find the next one after. */
  n: number;
  claim: number;
}

/** Prime and composite numbers; with `factorise`, products of prime factors at depth 2. */
export function primesFamily(
  id: string,
  most: Record<Numbers, number>,
  factorise: boolean,
): GeneratorDefinition<PrimeParams> {
  const nextPrime = (n: number) => {
    let k = n + 1;
    while (!isPrime(k)) k++;
    return k;
  };
  const primeFactors = (n: number) => {
    const out: number[] = [];
    let m = n;
    for (let k = 2; m > 1; k++) {
      while (m % k === 0) {
        out.push(k);
        m /= k;
      }
    }
    return out;
  };
  return {
    id,
    version: "1.0.0",
    depths: [1, 2, 4],
    misconceptions: ["MD.PRIME.ODD", "MD.PRIME.ONE", "MD.FACTOR.FACTOR-MULTIPLE"],

    params(rng, numbers) {
      const top = most[numbers];
      const primes = Array.from({ length: top }, (_, i) => i + 1).filter(isPrime);
      const prime = rng.pick(primes.filter((k) => k > 2));
      const odd = rng.pick(ODD_COMPOSITES.filter((k) => k <= top));
      const even = rng.int(2, Math.floor(top / 2)) * 2;
      const n = factorise
        ? rng.pick(
            [
              12, 18, 20, 24, 28, 30, 36, 40, 42, 44, 45, 48, 50, 52, 54, 56, 60, 63, 66, 70, 72,
              75, 80, 84, 90,
            ].filter((k) => k <= Math.max(30, top)),
          )
        : rng.pick(primes.filter((k) => k > 2 && nextPrime(k) - k > 2));
      return { prime, odd, even, n, claim: rng.int(0, 2) };
    },

    build(p, depth, rng): QuestionDraft {
      switch (depth) {
        case 1:
          return A.choice({
            rng,
            question: "Which of these is a prime number?",
            correct: String(p.prime),
            distractors: [
              {
                content: String(p.odd),
                code: "MD.PRIME.ODD",
                feedback: `${p.odd} is odd, but ${factorsOf(p.odd)[1]} × ${p.odd / (factorsOf(p.odd)[1] ?? 1)} = ${p.odd}, so it is not prime.`,
              },
              {
                content: "1",
                code: "MD.PRIME.ONE",
                feedback: "A prime number has exactly two factors. 1 has only one.",
              },
              {
                content: String(p.even),
                feedback: `${p.even} is even, so 2 is a factor as well as 1 and ${p.even}.`,
              },
            ],
            solution: [
              { say: `${p.prime} has exactly two factors, 1 and ${p.prime}, so it is prime.` },
            ],
          });
        case 2: {
          if (!factorise) {
            const next = nextPrime(p.n);
            return A.standard({
              question: `${p.n} is a prime number.`,
              ask: `What is the next prime number after ${p.n}?`,
              answer: A.number(next),
              wrong: wrongs(next, [
                {
                  code: "MD.PRIME.ODD",
                  value: A.number(p.n + 2),
                  feedback: `${p.n + 2} is odd, but ${factorsOf(p.n + 2)[1]} is a factor of it, so it is not prime.`,
                },
              ]),
              solution: [
                {
                  say: `Check each number after ${p.n}: ${Array.from(
                    { length: next - p.n },
                    (_, i) => p.n + 1 + i,
                  )
                    .map((k) =>
                      isPrime(k)
                        ? `${k} is prime`
                        : `${k} = ${factorsOf(k)[1]} × ${k / (factorsOf(k)[1] ?? 1)}`,
                    )
                    .join("; ")}.`,
                },
              ],
            });
          }
          const pf = primeFactors(p.n);
          const [f0 = 1, f1 = 1] = pf;
          const right = pf.join(" \\times ");
          const merged = [f0 * f1, ...pf.slice(2)].join(" \\times ");
          return A.choice({
            rng,
            archetype: "varied-form",
            question: `Write ${p.n} as a product of prime factors.`,
            ask: "Which is right?",
            correct: A.math(right),
            distractors: [
              {
                content: A.math(merged),
                feedback: `${f0 * f1} is not prime: it is ${f0} × ${f1}.`,
              },
              {
                content: A.math(`1 \\times ${right}`),
                code: "MD.PRIME.ONE",
                feedback: "1 is not a prime number, so it is not a prime factor.",
              },
              {
                content: A.math([...pf.slice(0, -1), (pf.at(-1) ?? 1) + 2].join(" \\times ")),
                feedback: `Multiply it out: that does not make ${p.n}.`,
              },
            ],
            solution: [{ say: `Keep dividing by primes: ${p.n} = ${pf.join(" × ")}.` }],
          });
        }
        default: {
          if (p.claim === 0)
            return A.alwaysSometimesNever({
              rng,
              claim: "A prime number is odd.",
              truth: "sometimes",
              reasons: [
                {
                  text: "Sometimes. 2 is prime and even. Every other prime is odd.",
                  correct: true,
                },
                { text: "Always. Even numbers can always be divided by 2.", code: "MD.PRIME.ONE" },
                { text: "Never. Prime numbers are even." },
              ],
              solution: [
                {
                  say: "2 has exactly two factors, 1 and 2, so it is prime. Every other even number has 2 as a factor too.",
                },
              ],
            });
          if (p.claim === 1)
            return A.trueOrFalseWhy({
              rng,
              statement: [`${p.odd} is a prime number because it is odd.`],
              truth: false,
              reasons: [
                {
                  text: `False. ${p.odd} = ${factorsOf(p.odd)[1]} × ${p.odd / (factorsOf(p.odd)[1] ?? 1)}, so it has more than two factors.`,
                  correct: true,
                },
                { text: "True. Odd numbers cannot be divided exactly.", code: "MD.PRIME.ODD" },
                { text: "True. It is not in the 2 times table." },
              ],
              solution: [{ say: `The factors of ${p.odd} are ${factorsOf(p.odd).join(", ")}.` }],
            });
          return A.trueOrFalseWhy({
            rng,
            statement: ["1 is a prime number."],
            truth: false,
            reasons: [
              {
                text: "False. A prime has exactly two factors. 1 has only one factor, itself.",
                correct: true,
              },
              { text: "True. 1 can only be divided by 1 and itself.", code: "MD.PRIME.ONE" },
              { text: "True. It is the smallest number." },
            ],
            solution: [{ say: "The first prime numbers are 2, 3, 5, 7, 11, 13, 17 and 19." }],
          });
        }
      }
    },

    verify(p, question) {
      if (question.archetype === "standard" && question.parts[0]?.answer.type === "choice")
        return isPrime(Number(chosenText(question)));
      if (question.archetype === "standard") return numberAnswer(question) === nextPrime(p.n);
      if (question.archetype === "varied-form") {
        const fs = chosenText(question)
          .split("\\times")
          .map((s) => Number(s.trim()));
        return fs.every(isPrime) && fs.reduce((a, b) => a * b, 1) === p.n;
      }
      return true;
    },
  };
}

// --- word problems -------------------------------------------------------------------------------------

export type ProblemKind = "groups" | "scale" | "correspond" | "rate";

export interface ProblemParams {
  kind: ProblemKind;
  g: number;
  k: number;
  /** Depth 5: a packs of p and b packs of q. */
  a: number;
  b: number;
  pa: number;
  pb: number;
  context: number;
}

const PACKS = [
  { things: "stickers", packs: "packs" },
  { things: "pens", packs: "boxes" },
  { things: "cakes", packs: "trays" },
  { things: "seeds", packs: "packets" },
];

/** Word problems: one step at depth 1, scaling back at depth 2, multiply-and-combine at depth 5. */
export function mdProblems(
  id: string,
  groups: Ranges,
  sizes: Ranges,
  kinds: ProblemKind[],
): GeneratorDefinition<ProblemParams> {
  return {
    id,
    version: "1.0.0",
    depths: [1, 2, 5],
    misconceptions: ["MD.MULTIPLY.ADDS", "AS.PROBLEM.KEYWORD", "AS.MULTISTEP.ONE-STEP"],

    params(rng, numbers) {
      const [glo, ghi] = groups[numbers];
      const [klo, khi] = sizes[numbers];
      const p = {
        kind: rng.pick(kinds),
        g: rng.int(glo, ghi),
        k: rng.int(klo, khi),
        a: rng.int(glo, ghi),
        b: rng.int(glo, ghi),
        pa: rng.int(klo, khi),
        pb: rng.int(klo, khi),
        context: rng.int(0, PACKS.length - 1),
      };
      if (p.g === p.k || p.a * p.pa <= p.b * p.pb || p.pa === p.pb)
        reject("distinct numbers; first lot bigger");
      return p;
    },

    build(p, depth): QuestionDraft {
      const total = p.g * p.k;
      const adds = {
        code: "MD.MULTIPLY.ADDS",
        value: A.number(p.g + p.k),
        feedback: "This is about equal groups, so multiply.",
      };
      switch (depth) {
        case 1: {
          const story: Record<ProblemKind, [string, string]> = {
            groups: [
              `There are ${p.g} bags with ${p.k} marbles in each bag.`,
              "How many marbles are there altogether?",
            ],
            scale: [
              `A sunflower is ${p.k} cm tall. A tree is ${p.g} times as tall.`,
              "How tall is the tree, in centimetres?",
            ],
            correspond: [
              `A café has ${p.g} kinds of sandwich and ${p.k} kinds of drink.`,
              "How many different sandwich-and-drink meals can you choose?",
            ],
            rate: [
              `A machine fills ${p.k} bottles every minute.`,
              `How many bottles does it fill in ${p.g} minutes?`,
            ],
          };
          const [question, ask] = story[p.kind];
          return A.standard({
            question,
            ask,
            answer: A.number(total),
            wrong: wrongs(total, [adds]),
            solution: [{ say: `${p.g} × ${p.k} = ${fmt(total)}.` }],
          });
        }
        case 2:
          return A.reverse({
            question: `Ali has ${p.g} times as many stamps as Ben. Ali has ${fmt(total)} stamps.`,
            ask: "How many stamps does Ben have?",
            answer: A.number(p.k),
            wrong: wrongs(p.k, [
              {
                code: "AS.PROBLEM.KEYWORD",
                value: A.number(total * p.g),
                feedback: `Ali has more, so Ben has fewer: ${fmt(total)} ÷ ${p.g}.`,
              },
            ]),
            solution: [
              {
                say: `Ben's amount × ${p.g} = ${fmt(total)}, so Ben has ${fmt(total)} ÷ ${p.g} = ${p.k}.`,
              },
            ],
          });
        default: {
          const c = PACKS[p.context] ?? PACKS[0];
          if (!c) return reject("no context");
          const [x, y] = [p.a * p.pa, p.b * p.pb];
          return A.multiStepContext({
            context: `A shop has ${p.a} ${c.packs} of ${p.pa} ${c.things} and ${p.b} ${c.packs} of ${p.pb} ${c.things}.`,
            parts: [
              {
                ask: `How many ${c.things} are there altogether?`,
                answer: A.number(x + y),
                wrong: wrongs(x + y, [
                  {
                    code: "AS.MULTISTEP.ONE-STEP",
                    value: A.number(x),
                    feedback: `That is only the ${c.packs} of ${p.pa}. Add the ${c.packs} of ${p.pb} too.`,
                  },
                ]),
              },
              {
                ask: `How many more ${c.things} are in the ${c.packs} of ${p.pa} than in the ${c.packs} of ${p.pb}?`,
                answer: A.number(x - y),
              },
            ],
            solution: [
              { say: `${p.a} × ${p.pa} = ${fmt(x)} and ${p.b} × ${p.pb} = ${fmt(y)}.` },
              {
                say: `Altogether ${fmt(x)} + ${fmt(y)} = ${fmt(x + y)}; the difference is ${fmt(x)} − ${fmt(y)} = ${fmt(x - y)}.`,
              },
            ],
          });
        }
      }
    },

    verify(p, question) {
      if (question.archetype === "standard") return numberAnswer(question) === p.g * p.k;
      if (question.archetype === "reverse") return numberAnswer(question) * p.g === p.g * p.k;
      return (
        numberAnswer(question, 0) === p.a * p.pa + p.b * p.pb &&
        numberAnswer(question, 1) === p.a * p.pa - p.b * p.pb
      );
    },
  };
}
