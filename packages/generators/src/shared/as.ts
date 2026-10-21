// Addition and subtraction families. Column methods, mental strategies, missing numbers, estimating
// and checking, and word problems come back each year with bigger numbers, so each is written once
// here and a statement's generator picks its own ranges. See docs/design.md: shared code, not copies.
import * as A from "@mathsplanner/archetypes";
import {
  reject,
  type GeneratorDefinition,
  type Numbers,
  type QuestionDraft,
} from "@mathsplanner/core";
import type { BarModelSpec, NumberLineSpec } from "@mathsplanner/diagrams";
import { wrongs } from "./angles.ts";
import { chosenText, numberAnswer } from "./counting.ts";
import { fmt, tex, type Ranges } from "./npv.ts";

const PLACES = ["ones", "tens", "hundreds", "thousands", "ten thousands", "hundred thousands"];
const ONE_PLACE = ["one", "ten", "hundred", "thousand", "ten thousand", "hundred thousand"];
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const len = (n: number) => String(n).length;
/** The digit in place k (0 is ones). */
const digitAt = (n: number, k: number) => Math.floor(n / 10 ** k) % 10;
const randomDigits = (rng: { int(a: number, b: number): number }, d: number) =>
  rng.int(10 ** (d - 1), 10 ** d - 1);
const roundTo = (n: number, place: number) => Math.round(n / place) * place;

/** A part-whole bar: the whole across the top, two parts below, any of them "?". */
export function partWholeBar(
  whole: string,
  parts: [number, number],
  labels: [string, string],
): BarModelSpec {
  return {
    type: "bar-model",
    bars: [{ parts: parts.map((size, i) => ({ size, label: labels[i] ?? "" })) }],
    braces: [{ bar: 0, from: 0, to: 1, label: whole }],
  };
}

// --- column methods ------------------------------------------------------------------------------------

export interface Worked {
  lines: string[];
  total: number;
  /** Columns that carried or exchanged, in order. */
  steps: number[];
}

/**
 * Column addition, line by line. Columns in `forget` drop the ten carried into them, which is
 * how the AS.COLUMN.NO-CARRY slip is worked through.
 */
export function addColumns(
  a: number,
  b: number,
  forget: (column: number) => boolean = () => false,
): Worked {
  const n = Math.max(len(a), len(b));
  const lines: string[] = [];
  const steps: number[] = [];
  let carry = 0;
  let total = 0;
  for (let i = 0; i < n; i++) {
    const x = i < len(a) ? digitAt(a, i) : undefined;
    const y = i < len(b) ? digitAt(b, i) : undefined;
    const carried = forget(i) ? 0 : carry;
    const terms = [x, y, carried || undefined].filter((t): t is number => t !== undefined);
    const s = terms.reduce((sum, t) => sum + t, 0);
    const top = i === n - 1;
    total += (top ? s : s % 10) * 10 ** i;
    carry = !top && s >= 10 ? 1 : 0;
    if (carry) steps.push(i);
    const place = cap(PLACES[i] ?? "");
    lines.push(
      terms.length === 1
        ? `${place}: bring down the ${s}.`
        : `${place}: ${terms.join(" + ")} = ${s}. ` +
            (carry ? `Write ${s % 10} and carry 1 into the ${PLACES[i + 1]}.` : `Write ${s}.`),
    );
  }
  return { lines, total, steps };
}

/**
 * Column subtraction with exchanging, line by line. Columns in `slip` take the smaller digit from
 * the larger instead of exchanging (AS.COLUMN.SMALLER-FROM-LARGER). Every digit of `a` must be
 * non-zero, so no exchange has to cross a zero.
 */
export function subtractColumns(
  a: number,
  b: number,
  slip: (column: number) => boolean = () => false,
): Worked {
  const lines: string[] = [];
  const steps: number[] = [];
  let borrow = 0;
  let total = 0;
  for (let i = 0; i < len(a); i++) {
    const x = digitAt(a, i);
    const y = i < len(b) ? digitAt(b, i) : undefined;
    const top = x - borrow;
    const place = cap(PLACES[i] ?? "");
    const now = borrow ? `the ${x} is now ${top}. ` : "";
    let d: number;
    let line: string;
    if (y === undefined) {
      d = top;
      borrow = 0;
      line = `${place}: ${now}bring down the ${top}.`;
    } else if (top < y && slip(i)) {
      d = y - top;
      borrow = 0;
      line = `${place}: ${now}${y} − ${top} = ${d}. Write ${d}.`;
    } else if (top < y) {
      d = top + 10 - y;
      borrow = 1;
      steps.push(i);
      line = `${place}: ${now}exchange 1 ${ONE_PLACE[i + 1]} for 10 ${PLACES[i]}. ${top + 10} − ${y} = ${d}. Write ${d}.`;
    } else {
      d = top - y;
      borrow = 0;
      line = `${place}: ${now}${top} − ${y} = ${d}. Write ${d}.`;
    }
    total += d * 10 ** i;
    lines.push(
      line
        .replace(/: the/, ": The")
        .replace(/: exchange/, ": Exchange")
        .replace(/: bring/, ": Bring"),
    );
  }
  return { lines, total, steps };
}

/** a and b set out in columns, ready to work. */
export const columnLatex = (a: number, b: number, op: "+" | "-") =>
  `\\begin{array}{r}${tex(a)}\\\\ ${op}\\;${tex(b)}\\\\ \\hline\\end{array}`;

export interface ColumnParams {
  op: "add" | "subtract";
  a: number;
  b: number;
}

/**
 * Formal written column addition and subtraction. `digits` gives how many digits the two numbers
 * have; `exchanges` the fewest carries or exchanges a question needs.
 */
export function columnMethod(
  id: string,
  digits: Record<Numbers, [number, number]>,
  exchanges: Record<Numbers, number>,
): GeneratorDefinition<ColumnParams> {
  const work = (p: ColumnParams) =>
    p.op === "add" ? addColumns(p.a, p.b) : subtractColumns(p.a, p.b);
  return {
    id,
    version: "1.0.0",
    depths: [1, 2, 4],
    misconceptions: ["AS.COLUMN.NO-CARRY", "AS.COLUMN.SMALLER-FROM-LARGER", "AS.COLUMN.MISALIGNED"],

    params(rng, numbers) {
      const [da, db] = digits[numbers];
      const op = rng.pick(["add", "subtract"] as const);
      const a = randomDigits(rng, da);
      const b = randomDigits(rng, db);
      const p = { op, a, b };
      if (op === "subtract" && (b >= a || String(a).includes("0")))
        reject("a must be bigger, with no zero digits");
      const steps = work(p).steps.length;
      if (steps < exchanges[numbers] || steps > exchanges[numbers] + 2)
        reject("the right number of exchanges");
      return p;
    },

    build(p, depth, rng): QuestionDraft {
      const add = p.op === "add";
      const answer = add ? p.a + p.b : p.a - p.b;
      const shift = 10 ** (len(p.a) - len(p.b));
      const sign = add ? "+" : "-";
      const misaligned = add ? p.a + p.b * shift : p.a - p.b * shift;
      const slipped = add
        ? addColumns(p.a, p.b, () => true).total
        : subtractColumns(p.a, p.b, () => true).total;
      const wrong = wrongs(answer, [
        add
          ? {
              code: "AS.COLUMN.NO-CARRY",
              value: A.number(slipped),
              feedback:
                "When a column adds up to 10 or more, carry the ten into the next column and add it on.",
            }
          : {
              code: "AS.COLUMN.SMALLER-FROM-LARGER",
              value: A.number(slipped),
              feedback:
                "When the top digit is smaller, exchange from the next column. Do not take the top digit from the bottom one.",
            },
        shift > 1
          ? {
              code: "AS.COLUMN.MISALIGNED",
              value: A.number(misaligned),
              feedback: "Line the numbers up from the right, ones under ones.",
            }
          : undefined,
      ]);
      const worked = work(p);
      const solution = [
        {
          say: "Line the digits up by place value and work from the ones:",
          math: columnLatex(p.a, p.b, sign),
        },
        ...worked.lines.map((say) => ({ say })),
        { say: `So ${fmt(p.a)} ${add ? "+" : "−"} ${fmt(p.b)} = ${fmt(answer)}.` },
      ];
      switch (depth) {
        case 1:
          return A.standard({
            question: [
              "Use the column method to work out",
              A.displayMath(columnLatex(p.a, p.b, sign)),
            ],
            answer: A.number(answer),
            wrong,
            solution,
          });
        case 2: {
          const [x, y] = [A.math(tex(p.a)), A.math(tex(p.b))];
          return A.variedForm({
            rng,
            forms: add
              ? [
                  { question: ["Find the sum of ", x, " and ", y, "."] },
                  { question: ["What is ", y, " more than ", x, "?"] },
                  { question: ["Add ", x, " and ", y, "."] },
                ]
              : [
                  { question: ["Find the difference between ", x, " and ", y, "."] },
                  { question: ["What is ", y, " less than ", x, "?"] },
                  { question: ["Take ", y, " away from ", x, "."] },
                ],
            answer: A.number(answer),
            wrong,
            solution,
          });
        }
        default: {
          const first = worked.steps[0] ?? 0;
          const slip = add
            ? addColumns(p.a, p.b, (i) => i === first + 1)
            : subtractColumns(p.a, p.b, (i) => i === first);
          const at = add ? first + 1 : first;
          return A.spotTheMistake({
            question: [
              "Ravi works out ",
              A.math(`${tex(p.a)} ${sign} ${tex(p.b)}`),
              " in columns.",
            ],
            lines: [...slip.lines, `So the answer is ${fmt(slip.total)}.`],
            mistake: at,
            code: add ? "AS.COLUMN.NO-CARRY" : "AS.COLUMN.SMALLER-FROM-LARGER",
            feedback: add
              ? `In the ${PLACES[at]} Ravi forgot the 1 he carried. The answer is ${fmt(answer)}.`
              : `In the ${PLACES[at]} the top digit is smaller, so Ravi should exchange, not take ${digitAt(p.a, at)} from ${digitAt(p.b, at)}. The answer is ${fmt(answer)}.`,
          });
        }
      }
    },

    verify(p, question) {
      if (question.archetype === "spot-the-mistake")
        return work(p).total === (p.op === "add" ? p.a + p.b : p.a - p.b);
      return numberAnswer(question) === (p.op === "add" ? p.a + p.b : p.a - p.b);
    },
  };
}

// --- mental methods ------------------------------------------------------------------------------------

/** Add or take a multiple of a place, e.g. 346 + 30; or two 2-digit numbers; or three 1-digit ones. */
export type MentalKind = { kind: "place"; place: number } | { kind: "pair" } | { kind: "three" };

export interface MentalParams {
  kind: MentalKind;
  add: boolean;
  n: number;
  amount: number;
  three: [number, number, number];
  /** Depth 4: n + (place − 1) by adding place and adjusting by 1. */
  near: number;
  nearPlace: number;
  claimTrue: boolean;
}

const lineFor = (from: number, jumps: [number, string][], marked: number): NumberLineSpec => {
  const stops = jumps.reduce<number[]>((s, [by]) => [...s, (s.at(-1) ?? from) + by], [from]);
  const [lo, hi] = [Math.min(...stops), Math.max(...stops)];
  return {
    type: "number-line",
    min: lo,
    max: hi,
    step: hi - lo,
    labels: [{ value: from, label: tex(from) }],
    // Later jumps go below the line, clear of the arrow.
    jumps: jumps.map(([, label], i) => ({
      from: stops[i] ?? from,
      to: stops[i + 1] ?? from,
      label,
      side: i === 0 ? "above" : "below",
    })),
    points: [{ value: marked, label: "?", style: "arrow" }],
  };
};

/** Mental addition and subtraction, with number-line jumps and the "add 10, take 1" strategy. */
export function mental(
  id: string,
  ranges: Ranges,
  kinds: Record<Numbers, MentalKind[]>,
  nearPlace: number,
): GeneratorDefinition<MentalParams> {
  const value = (p: MentalParams) =>
    p.kind.kind === "three"
      ? p.three[0] + p.three[1] + p.three[2]
      : p.add
        ? p.n + p.amount
        : p.n - p.amount;
  return {
    id,
    version: "1.0.0",
    depths: [1, 2, 4],
    misconceptions: [
      "NPV.PLACE.TENS-ONES-MIXUP",
      "AS.COLUMN.NO-CARRY",
      "AS.COLUMN.SMALLER-FROM-LARGER",
    ],

    params(rng, numbers) {
      const [lo, hi] = ranges[numbers];
      const kind = rng.pick(kinds[numbers]);
      const add = rng.bool();
      const n = kind.kind === "pair" ? rng.int(21, 99) : rng.int(lo, hi);
      const amount =
        kind.kind === "place"
          ? rng.int(1, 9) * kind.place
          : kind.kind === "pair"
            ? rng.int(11, 89)
            : 0;
      if (kind.kind !== "three" && (n % 10 === 0 || (!add && amount >= n)))
        reject("a positive answer from an untidy start");
      if (kind.kind === "pair" && (add ? (n % 10) + (amount % 10) < 10 : n % 10 >= amount % 10))
        reject("pairs that cross a ten");
      const three: [number, number, number] = [rng.int(2, 9), rng.int(2, 9), rng.int(2, 9)];
      const near = rng.int(Math.max(lo, nearPlace + 1), Math.max(hi, nearPlace * 3));
      return { kind, add, n, amount, three, near, nearPlace, claimTrue: rng.bool() };
    },

    build(p, depth, rng): QuestionDraft {
      const answer = value(p);
      const sign = p.add ? "+" : "-";
      const word = p.add ? "+" : "−";
      if (depth === 4) {
        const m = p.nearPlace - 1;
        const result = p.add ? p.near + m : p.near - m;
        const [first, adjust] = p.add
          ? ["add", p.claimTrue ? "take away" : "add"]
          : ["take away", p.claimTrue ? "add" : "take away"];
        const how = `${first} ${fmt(p.nearPlace)} and then ${adjust} 1`;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Zara works out `,
            A.math(`${tex(p.near)} ${sign} ${tex(m)}`),
            ` like this: "${cap(how)}."`,
          ],
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: `True. ${fmt(m)} is 1 less than ${fmt(p.nearPlace)}, so ${p.add ? "adding" : "taking away"} ${fmt(p.nearPlace)} ${p.add ? "adds" : "takes away"} 1 too many. ${cap(adjust)} 1 to put it right: ${fmt(result)}.`,
                  correct: true,
                },
                {
                  text: `False. She should ${first} ${fmt(p.nearPlace)} and then ${adjust === "add" ? "take away" : "add"} 1.`,
                },
                { text: "False. You can only work it out in columns." },
              ]
            : [
                {
                  text: `False. ${p.add ? "Adding" : "Taking away"} ${fmt(p.nearPlace)} ${p.add ? "adds" : "takes away"} 1 too many, so she must ${adjust === "add" ? "take away" : "add"} 1, not ${adjust} 1. The answer is ${fmt(result)}.`,
                  correct: true,
                },
                {
                  text: `True. ${fmt(m)} and ${fmt(p.nearPlace)} are nearly the same, so she ${adjust === "add" ? "adds" : "takes away"} the 1 as well.`,
                },
                { text: "False. You can only work it out in columns." },
              ],
          solution: [
            {
              say: `${fmt(p.near)} ${word} ${fmt(p.nearPlace)} = ${fmt(p.add ? p.near + p.nearPlace : p.near - p.nearPlace)}, then ${p.add ? "take away" : "add"} 1: ${fmt(result)}.`,
            },
          ],
        });
      }
      if (p.kind.kind === "three") {
        const [x, y, z] = p.three;
        const latex = `${x} + ${y} + ${z}`;
        const ten = x + y === 10 || x + z === 10 || y + z === 10;
        return depth === 1
          ? A.standard({
              question: [A.math(latex)],
              ask: "Work it out.",
              answer: A.number(answer),
              solution: [
                {
                  say: ten
                    ? "Look for two numbers that make 10 and add those first."
                    : `${x} + ${y} = ${x + y}, then ${x + y} + ${z} = ${answer}.`,
                },
              ],
            })
          : A.variedForm({
              rng,
              forms: [
                {
                  question: `Amy scores ${x}, ${y} and ${z} in three games.`,
                  ask: "What is her total score?",
                },
                {
                  question: `There are ${x} red, ${y} blue and ${z} green pens.`,
                  ask: "How many pens are there altogether?",
                },
              ],
              answer: A.number(answer),
              solution: [{ say: `${x} + ${y} + ${z} = ${answer}. You can add them in any order.` }],
            });
      }
      const place = p.kind.kind === "place" ? p.kind.place : 1;
      const digit = p.kind.kind === "place" ? p.amount / place : 0;
      const wrong = wrongs(answer, [
        ...(p.kind.kind === "place"
          ? [place * 10, place / 10]
              .filter((q) => Number.isInteger(q) && q >= 1)
              .map((q) => ({
                code: "NPV.PLACE.TENS-ONES-MIXUP",
                value: A.number(p.add ? p.n + digit * q : p.n - digit * q),
                feedback: `${fmt(p.amount)} is ${digit} ${digit === 1 ? ONE_PLACE[Math.log10(place)] : PLACES[Math.log10(place)]}, so it changes the ${PLACES[Math.log10(place)]} digit.`,
              }))
          : p.add
            ? [
                {
                  code: "AS.COLUMN.NO-CARRY",
                  value: A.number(answer - 10),
                  feedback: `The ones make more than 10: ${p.n % 10} + ${p.amount % 10} = ${(p.n % 10) + (p.amount % 10)}. Add the extra ten.`,
                },
              ]
            : [
                {
                  code: "AS.COLUMN.SMALLER-FROM-LARGER",
                  value: A.number(
                    Math.floor(p.n / 10) * 10 -
                      Math.floor(p.amount / 10) * 10 +
                      Math.abs((p.n % 10) - (p.amount % 10)),
                  ),
                  feedback: `You cannot take ${p.amount % 10} from ${p.n % 10}, so take ${Math.floor(p.amount / 10) * 10} first and then ${p.amount % 10}, crossing a ten.`,
                },
              ]),
      ]);
      const steps =
        p.kind.kind === "pair"
          ? `${fmt(p.n)} ${word} ${Math.floor(p.amount / 10) * 10} = ${fmt(p.add ? p.n + Math.floor(p.amount / 10) * 10 : p.n - Math.floor(p.amount / 10) * 10)}, then ${word} ${p.amount % 10} = ${fmt(answer)}.`
          : `${fmt(p.amount)} is ${digit} ${digit === 1 ? ONE_PLACE[Math.log10(place)] : PLACES[Math.log10(place)]}, so count ${p.add ? "on" : "back"} ${digit} ${digit === 1 ? ONE_PLACE[Math.log10(place)] : PLACES[Math.log10(place)]} from ${fmt(p.n)}: ${fmt(answer)}.`;
      const latex = `${tex(p.n)} ${sign} ${tex(p.amount)}`;
      if (depth === 1)
        return A.standard({
          question: [A.math(latex)],
          ask: "Work it out in your head.",
          answer: A.number(answer),
          wrong,
          solution: [{ say: steps }],
        });
      const jump: [number, string][] =
        p.kind.kind === "pair"
          ? [
              [
                (p.add ? 1 : -1) * Math.floor(p.amount / 10) * 10,
                `${sign}${Math.floor(p.amount / 10) * 10}`,
              ],
              [(p.add ? 1 : -1) * (p.amount % 10), `${sign}${p.amount % 10}`],
            ]
          : [[(p.add ? 1 : -1) * p.amount, `${sign}${tex(p.amount)}`]];
      return A.variedForm({
        rng,
        forms: [
          {
            question: [
              `Tom works out `,
              A.math(latex),
              ` on a number line.`,
              A.figure(lineFor(p.n, jump, answer)),
            ],
            ask: "What number does he land on?",
          },
          {
            question: p.add
              ? ["What is ", A.math(tex(p.amount)), " more than ", A.math(tex(p.n)), "?"]
              : ["What is ", A.math(tex(p.amount)), " less than ", A.math(tex(p.n)), "?"],
          },
        ],
        answer: A.number(answer),
        wrong,
        solution: [{ say: steps }],
      });
    },

    verify(p, question) {
      if (question.archetype === "true-or-false-why") return p.near > p.nearPlace;
      const expected =
        p.kind.kind === "three"
          ? p.three.reduce((s, x) => s + x, 0)
          : p.add
            ? p.n + p.amount
            : p.n - p.amount;
      return numberAnswer(question) === expected;
    },
  };
}

// --- missing numbers -----------------------------------------------------------------------------------

export interface MissingParams {
  a: number;
  b: number;
  /** Which missing-number layout depth 2 uses. */
  form: number;
  /** Form 5: a + b = ? + e. */
  e: number;
  claimTrue: boolean;
}

/** Missing-number problems solved with the inverse operation. `forms` limits the layouts used. */
export function missingNumbers(
  id: string,
  ranges: Ranges,
  forms: number[] = [0, 1, 2, 3, 4, 5],
): GeneratorDefinition<MissingParams> {
  const expected = (p: MissingParams) => {
    const c = p.a + p.b;
    return [p.a, p.b, c, p.b, c, c - p.e][p.form] ?? Number.NaN;
  };
  return {
    id,
    version: "1.0.0",
    depths: [1, 2, 4],
    misconceptions: ["AS.INVERSE.SAME-OPERATION", "AS.EQUALS.ANSWER-NEXT"],

    params(rng, numbers) {
      const [lo, hi] = ranges[numbers];
      const a = rng.int(lo, hi);
      const b = rng.int(lo, hi);
      const e = rng.int(1, a + b - 1);
      if (a === b || e === a || e === b) reject("different numbers");
      return { a, b, form: rng.pick(forms), e, claimTrue: rng.bool() };
    },

    build(p, depth, rng): QuestionDraft {
      const c = p.a + p.b;
      switch (depth) {
        case 1:
          return A.standard({
            question: [
              `${fmt(c)} is split into two parts. One part is ${fmt(p.a)}.`,
              A.figure(partWholeBar(tex(c), [p.a, p.b], [tex(p.a), "?"])),
            ],
            ask: "What is the other part?",
            answer: A.number(p.b),
            wrong: wrongs(p.b, [
              {
                code: "AS.INVERSE.SAME-OPERATION",
                value: A.number(c + p.a),
                feedback: `${fmt(c)} is the whole, so the missing part is ${fmt(c)} − ${fmt(p.a)}.`,
              },
            ]),
            solution: [
              {
                say: `Take the part you know from the whole: ${fmt(c)} − ${fmt(p.a)} = ${fmt(p.b)}.`,
              },
            ],
          });
        case 2: {
          const layouts: {
            relation: (number | string)[];
            hide: number;
            wrong?: A.Wrong;
            how: string;
          }[] = [
            {
              relation: [p.a, "+", p.b, "=", c],
              hide: 0,
              wrong: {
                code: "AS.INVERSE.SAME-OPERATION",
                value: A.number(c + p.b),
                feedback: `Undo adding ${fmt(p.b)} by taking it away: ${fmt(c)} − ${fmt(p.b)}.`,
              },
              how: `${fmt(c)} − ${fmt(p.b)} = ${fmt(p.a)}`,
            },
            {
              relation: [p.a, "+", p.b, "=", c],
              hide: 2,
              wrong: {
                code: "AS.INVERSE.SAME-OPERATION",
                value: A.number(c + p.a),
                feedback: `Undo adding ${fmt(p.a)} by taking it away: ${fmt(c)} − ${fmt(p.a)}.`,
              },
              how: `${fmt(c)} − ${fmt(p.a)} = ${fmt(p.b)}`,
            },
            {
              relation: [c, "-", p.b, "=", p.a],
              hide: 0,
              wrong: {
                code: "AS.INVERSE.SAME-OPERATION",
                value: A.number(p.a - p.b),
                feedback: `Undo taking away ${fmt(p.b)} by adding it back: ${fmt(p.a)} + ${fmt(p.b)}.`,
              },
              how: `${fmt(p.a)} + ${fmt(p.b)} = ${fmt(c)}`,
            },
            {
              relation: [c, "-", p.b, "=", p.a],
              hide: 2,
              wrong: {
                code: "AS.INVERSE.SAME-OPERATION",
                value: A.number(c + p.a),
                feedback: `The missing number is how much to take from ${fmt(c)} to leave ${fmt(p.a)}: ${fmt(c)} − ${fmt(p.a)}.`,
              },
              how: `${fmt(c)} − ${fmt(p.a)} = ${fmt(p.b)}`,
            },
            {
              relation: [p.a, "=", c, "-", p.b],
              hide: 2,
              wrong: {
                code: "AS.EQUALS.ANSWER-NEXT",
                value: A.number(Math.abs(p.a - p.b)),
                feedback: `= means "is the same as". The missing number take away ${fmt(p.b)} is the same as ${fmt(p.a)}, so it is ${fmt(p.a)} + ${fmt(p.b)}.`,
              },
              how: `${fmt(p.a)} + ${fmt(p.b)} = ${fmt(c)}`,
            },
            {
              relation: [p.a, "+", p.b, "=", c - p.e, "+", p.e],
              hide: 4,
              wrong: {
                code: "AS.EQUALS.ANSWER-NEXT",
                value: A.number(c),
                feedback: `= means both sides are the same. ${fmt(p.a)} + ${fmt(p.b)} = ${fmt(c)}, so the missing number + ${fmt(p.e)} must make ${fmt(c)}.`,
              },
              how: `${fmt(c)} − ${fmt(p.e)} = ${fmt(c - p.e)}`,
            },
          ];
          const l = layouts[p.form] ?? layouts[0];
          if (!l) return reject("no layout");
          const answer = expected(p);
          return A.missingValue({
            intro: "Find the missing number.",
            relation: l.relation,
            hide: l.hide,
            wrong: l.wrong ? wrongs(answer, [l.wrong]) : [],
            solution: [{ say: `Use the inverse: ${l.how}.` }],
          });
        }
        default:
          return A.trueOrFalseWhy({
            rng,
            statement: p.claimTrue
              ? [
                  "To check that ",
                  A.math(`${tex(c)} - ${tex(p.b)} = ${tex(p.a)}`),
                  ", Sam works out ",
                  A.math(`${tex(p.a)} + ${tex(p.b)}`),
                  ".",
                ]
              : [
                  "To find the missing number in ",
                  A.math(`\\square - ${tex(p.b)} = ${tex(p.a)}`),
                  ", Sam works out ",
                  A.math(`${tex(p.a)} - ${tex(p.b)}`),
                  ".",
                ],
            truth: p.claimTrue,
            reasons: p.claimTrue
              ? [
                  {
                    text: `True. Addition undoes subtraction: if ${fmt(p.a)} + ${fmt(p.b)} = ${fmt(c)}, the subtraction was right.`,
                    correct: true,
                  },
                  {
                    text: "False. Check a subtraction by doing the subtraction again.",
                    code: "AS.INVERSE.SAME-OPERATION",
                  },
                  { text: "False. You can only check with a calculator." },
                ]
              : [
                  {
                    text: `False. Undo taking away ${fmt(p.b)} by adding it back: ${fmt(p.a)} + ${fmt(p.b)} = ${fmt(c)}.`,
                    correct: true,
                  },
                  {
                    text: "True. Use the same operation as the question.",
                    code: "AS.INVERSE.SAME-OPERATION",
                  },
                  { text: `True. The missing number must be smaller than ${fmt(p.a)}.` },
                ],
            solution: [
              {
                say: `${fmt(c)} − ${fmt(p.b)} = ${fmt(p.a)} and ${fmt(p.a)} + ${fmt(p.b)} = ${fmt(c)} are a fact family: each undoes the other.`,
              },
            ],
          });
      }
    },

    verify(p, question) {
      if (question.archetype === "standard") return numberAnswer(question) + p.a === p.a + p.b;
      if (question.archetype === "missing-value") return numberAnswer(question) === expected(p);
      return true;
    },
  };
}

// --- estimating and checking ---------------------------------------------------------------------------

export interface CheckParams {
  add: boolean;
  a: number;
  b: number;
  place: number;
  /** Depth 4: whether Leo's answer is right. */
  right: boolean;
}

/** Estimating by rounding, and checking with the inverse operation. */
export function checking(
  id: string,
  ranges: Ranges,
  places: Record<Numbers, number[]>,
): GeneratorDefinition<CheckParams> {
  const exact = (p: CheckParams) => (p.add ? p.a + p.b : p.a - p.b);
  const estimate = (p: CheckParams) =>
    p.add
      ? roundTo(p.a, p.place) + roundTo(p.b, p.place)
      : roundTo(p.a, p.place) - roundTo(p.b, p.place);
  return {
    id,
    version: "1.0.0",
    depths: [1, 2, 4],
    misconceptions: ["NPV.ROUND.ALWAYS-DOWN", "AS.INVERSE.SAME-OPERATION"],

    params(rng, numbers) {
      const [lo, hi] = ranges[numbers];
      const place = rng.pick(places[numbers]);
      const [a, b] = [rng.int(lo, hi), rng.int(Math.max(place, Math.floor(lo / 3)), hi)];
      const add = rng.bool();
      if (!add && b >= a - place) reject("a clear positive difference");
      for (const n of [a, b])
        if (n % place === 0 || n % place === place / 2 || n < place)
          reject("numbers that need rounding");
      return { add, a, b, place, right: rng.bool() };
    },

    build(p, depth, rng): QuestionDraft {
      const c = exact(p);
      const e = estimate(p);
      const sign = p.add ? "+" : "-";
      const word = p.add ? "+" : "−";
      const [ra, rb] = [roundTo(p.a, p.place), roundTo(p.b, p.place)];
      const rounding = `${fmt(p.a)} ≈ ${fmt(ra)} and ${fmt(p.b)} ≈ ${fmt(rb)}, so ${fmt(ra)} ${word} ${fmt(rb)} = ${fmt(e)}.`;
      switch (depth) {
        case 1: {
          const down = p.add
            ? Math.floor(p.a / p.place) * p.place + Math.floor(p.b / p.place) * p.place
            : Math.floor(p.a / p.place) * p.place - Math.floor(p.b / p.place) * p.place;
          return A.standard({
            question: [
              "Estimate ",
              A.math(`${tex(p.a)} ${sign} ${tex(p.b)}`),
              ` by rounding each number to the nearest ${fmt(p.place)}.`,
            ],
            answer: A.number(e),
            wrong: wrongs(e, [
              {
                code: "NPV.ROUND.ALWAYS-DOWN",
                value: A.number(down),
                feedback: `Round each number to the nearest ${fmt(p.place)}: look at the next digit to decide whether to round up.`,
              },
            ]),
            solution: [{ say: rounding }],
          });
        }
        case 2:
          return A.choice({
            rng,
            archetype: "varied-form",
            question: [
              "Kim works out ",
              A.math(`${tex(p.a)} ${sign} ${tex(p.b)} = ${tex(c)}`),
              ".",
            ],
            ask: "Which calculation checks her answer?",
            correct: A.math(p.add ? `${tex(c)} - ${tex(p.b)}` : `${tex(c)} + ${tex(p.b)}`),
            distractors: p.add
              ? [
                  {
                    content: A.math(`${tex(c)} + ${tex(p.b)}`),
                    code: "AS.INVERSE.SAME-OPERATION",
                    feedback: `Check an addition with the inverse, a subtraction: ${fmt(c)} − ${fmt(p.b)} should give ${fmt(p.a)}.`,
                  },
                  {
                    content: A.math(`${tex(p.a)} - ${tex(p.b)}`),
                    feedback:
                      "That is a different calculation. Start from Kim's answer and undo the addition.",
                  },
                ]
              : [
                  {
                    content: A.math(`${tex(c)} - ${tex(p.b)}`),
                    code: "AS.INVERSE.SAME-OPERATION",
                    feedback: `Check a subtraction with the inverse, an addition: ${fmt(c)} + ${fmt(p.b)} should give ${fmt(p.a)}.`,
                  },
                  {
                    content: A.math(`${tex(p.a)} + ${tex(p.b)}`),
                    feedback:
                      "That is a different calculation. Start from Kim's answer and undo the subtraction.",
                  },
                ],
            solution: [
              {
                say: p.add
                  ? `If ${fmt(p.a)} + ${fmt(p.b)} = ${fmt(c)}, then ${fmt(c)} − ${fmt(p.b)} = ${fmt(p.a)}.`
                  : `If ${fmt(p.a)} − ${fmt(p.b)} = ${fmt(c)}, then ${fmt(c)} + ${fmt(p.b)} = ${fmt(p.a)}.`,
              },
            ],
          });
        default: {
          // A slip worth ten of the rounding place, which an estimate shows up.
          const leo = p.right ? c : c + 10 * p.place;
          return A.trueOrFalseWhy({
            rng,
            statement: [
              "Leo works out ",
              A.math(`${tex(p.a)} ${sign} ${tex(p.b)}`),
              ` and gets ${fmt(leo)}. Mia rounds to the nearest ${fmt(p.place)} and says Leo must have made a mistake.`,
            ],
            truth: !p.right,
            reasons: p.right
              ? [
                  {
                    text: `False. The estimate is ${fmt(e)}, which is close to ${fmt(leo)}, so Leo's answer is sensible. The inverse shows it is right.`,
                    correct: true,
                  },
                  {
                    text: "True. An answer is only right if it is exactly the same as the estimate.",
                  },
                  { text: "True. Rounding always shows the exact answer." },
                ]
              : [
                  {
                    text: `True. The estimate is ${fmt(e)}, but ${fmt(leo)} is a long way from it, so Leo has made a mistake.`,
                    correct: true,
                  },
                  { text: "False. Estimates are never close enough to spot a mistake." },
                  {
                    text: "False. The answer must be right because it has the same number of digits.",
                  },
                ],
            solution: [{ say: rounding }, { say: `The exact answer is ${fmt(c)}.` }],
          });
        }
      }
    },

    verify(p, question) {
      if (question.archetype === "standard") return numberAnswer(question) === estimate(p);
      if (question.archetype === "varied-form") {
        const [x, y] = chosenText(question)
          .replace(/\{,\}/g, "")
          .split(/[+-]/)
          .map((s) => Number(s.trim()));
        const c = exact(p);
        return x === c && y === p.b;
      }
      return true;
    },
  };
}

// --- word problems -------------------------------------------------------------------------------------

export interface ProblemParams {
  a: number;
  b: number;
  d: number;
  e: number;
  add: boolean;
  context: number;
}

const CONTEXTS = [
  { who: "Sam", things: "stickers", other: "Ali" },
  { who: "Ella", things: "marbles", other: "Ben" },
  { who: "A baker", things: "buns", other: "a café" },
  { who: "A farmer", things: "eggs", other: "a neighbour" },
  { who: "A school library", things: "books", other: "the town library" },
  { who: "A garden centre", things: "plants", other: "a shop" },
];

/**
 * Word problems: one step at depth 1, comparison (where "more" means subtract) at depth 2, and two or
 * three steps at depth 5.
 */
export function problems(
  id: string,
  starts: Ranges,
  amounts: Ranges,
  steps: 2 | 3,
): GeneratorDefinition<ProblemParams> {
  const final = (p: ProblemParams) => p.a - p.b + p.d - (steps === 3 ? p.e : 0);
  return {
    id,
    version: "1.0.0",
    depths: [1, 2, 5],
    misconceptions: ["AS.PROBLEM.KEYWORD", "AS.MULTISTEP.ONE-STEP"],

    params(rng, numbers) {
      const [lo, hi] = starts[numbers];
      const [alo, ahi] = amounts[numbers];
      const p = {
        a: rng.int(lo, hi),
        b: rng.int(alo, ahi),
        d: rng.int(alo, ahi),
        e: rng.int(alo, ahi),
        add: rng.bool(),
        context: rng.int(0, CONTEXTS.length - 1),
      };
      if (p.b >= p.a || p.b === p.d || final(p) <= 0 || final(p) === p.a)
        reject("sensible changes");
      return p;
    },

    build(p, depth): QuestionDraft {
      const c = CONTEXTS[p.context] ?? CONTEXTS[0];
      if (!c) return reject("no context");
      const owner = c.who.startsWith("A ") ? `the ${c.who.slice(2)}` : c.who;
      const Owner = cap(owner);
      switch (depth) {
        case 1: {
          const answer = p.add ? p.a + p.b : p.a - p.b;
          return A.standard({
            question: p.add
              ? `${c.who} has ${fmt(p.a)} ${c.things}, then gets ${fmt(p.b)} more.`
              : `${c.who} has ${fmt(p.a)} ${c.things} and gives away ${fmt(p.b)}.`,
            ask: p.add
              ? `How many ${c.things} does ${owner} have now?`
              : `How many ${c.things} are left?`,
            answer: A.number(answer),
            wrong: wrongs(answer, [
              p.add
                ? undefined
                : {
                    code: "AS.PROBLEM.KEYWORD",
                    value: A.number(p.a + p.b),
                    feedback: `Giving away makes fewer, so take ${fmt(p.b)} away.`,
                  },
            ]),
            solution: [{ say: `${fmt(p.a)} ${p.add ? "+" : "−"} ${fmt(p.b)} = ${fmt(answer)}.` }],
          });
        }
        case 2: {
          // "More" in the question, but the answer needs a subtraction (or "fewer" and an addition).
          const answer = p.add ? p.a - p.b : p.a + p.b;
          return A.reverse({
            question: p.add
              ? `${c.who} has ${fmt(p.a)} ${c.things}. That is ${fmt(p.b)} more than ${c.other} has.`
              : `${c.who} has ${fmt(p.a)} ${c.things}. That is ${fmt(p.b)} fewer than ${c.other} has.`,
            ask: `How many ${c.things} does ${c.other} have?`,
            answer: A.number(answer),
            wrong: wrongs(answer, [
              {
                code: "AS.PROBLEM.KEYWORD",
                value: A.number(p.add ? p.a + p.b : p.a - p.b),
                feedback: p.add
                  ? `${Owner} has more, so ${c.other} has fewer: ${fmt(p.a)} − ${fmt(p.b)}.`
                  : `${Owner} has fewer, so ${c.other} has more: ${fmt(p.a)} + ${fmt(p.b)}.`,
              },
            ]),
            solution: [
              {
                say: p.add
                  ? `${c.other} has ${fmt(p.b)} fewer than ${owner}: ${fmt(p.a)} − ${fmt(p.b)} = ${fmt(answer)}.`
                  : `${c.other} has ${fmt(p.b)} more than ${owner}: ${fmt(p.a)} + ${fmt(p.b)} = ${fmt(answer)}.`,
              },
            ],
          });
        }
        default: {
          const end = final(p);
          const change = end - p.a;
          const story =
            `${c.who} has ${fmt(p.a)} ${c.things}. ${Owner} gives away ${fmt(p.b)}, then gets ${fmt(p.d)} more` +
            (steps === 3 ? `, then gives away another ${fmt(p.e)}.` : ".");
          return A.multiStepContext({
            context: story,
            parts: [
              {
                ask: `How many ${c.things} does ${owner} have at the end?`,
                answer: A.number(end),
                wrong: wrongs(end, [
                  {
                    code: "AS.MULTISTEP.ONE-STEP",
                    value: A.number(p.a - p.b),
                    feedback:
                      "That is after the first step. Keep going until every change is used.",
                  },
                ]),
              },
              {
                ask: `How many ${change > 0 ? "more" : "fewer"} ${c.things} is that than at the start?`,
                answer: A.number(Math.abs(change)),
                wrong: wrongs(Math.abs(change), [
                  {
                    code: "AS.PROBLEM.KEYWORD",
                    value: A.number(end + p.a),
                    feedback: `"How many ${change > 0 ? "more" : "fewer"}" asks for the difference: ${fmt(Math.max(end, p.a))} − ${fmt(Math.min(end, p.a))}.`,
                  },
                ]),
              },
            ],
            solution: [
              {
                say: `${fmt(p.a)} − ${fmt(p.b)} = ${fmt(p.a - p.b)}, then + ${fmt(p.d)} = ${fmt(p.a - p.b + p.d)}${steps === 3 ? `, then − ${fmt(p.e)} = ${fmt(end)}` : ""}.`,
              },
              {
                say: `The difference between ${fmt(end)} and ${fmt(p.a)} is ${fmt(Math.abs(change))}.`,
              },
            ],
          });
        }
      }
    },

    verify(p, question) {
      if (question.archetype === "multi-step-context")
        return (
          numberAnswer(question, 0) === final(p) &&
          numberAnswer(question, 1) === Math.abs(final(p) - p.a)
        );
      if (question.archetype === "reverse")
        return numberAnswer(question) === (p.add ? p.a - p.b : p.a + p.b);
      return numberAnswer(question) === (p.add ? p.a + p.b : p.a - p.b);
    },
  };
}
