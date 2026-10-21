// Fractions and decimals families. Naming fractions, fractions of amounts, counting in tenths,
// equivalents, adding and subtracting, comparing, decimal equivalents and rounding come back each
// year, so each is written once here and a statement's generator picks its own ranges.
import * as A from "@mathsplanner/archetypes";
import {
  frac,
  reject,
  type GeneratorDefinition,
  type Numbers,
  type QuestionDraft,
  type Rational,
  type Rng,
  toLatex,
} from "@mathsplanner/core";
import type { BarModelSpec, NumberLineSpec } from "@mathsplanner/diagrams";
import { wrongs } from "./angles.ts";
import { chosenFigure, chosenText, numberAnswer } from "./counting.ts";

export type Pair = [number, number];

export const gcdOf = (a: number, b: number): number => (b ? gcdOf(b, a % b) : Math.abs(a));

export const fracTex = (n: number, d: number) => `\\frac{${n}}{${d}}`;
/** A Rational as LaTeX, e.g. \frac{3}{4} or 2. */
export const ratTex = (r: Rational) => toLatex(r);
/** A fraction for prose: 3/4. */
export const slash = (n: number, d: number) => `${n}/${d}`;

const WORDS: Record<string, string> = {
  "1/2": "a half",
  "1/3": "a third",
  "2/3": "two thirds",
  "1/4": "a quarter",
  "2/4": "two quarters",
  "3/4": "three quarters",
};
export const fractionWords = (n: number, d: number) => WORDS[slash(n, d)] ?? slash(n, d);

/** A bar in d parts with the first n shaded; `unequal` makes the parts different sizes. */
export function fractionBar(n: number, d: number, unequal = false): BarModelSpec {
  return {
    type: "bar-model",
    bars: [
      {
        parts: Array.from({ length: d }, (_, i) => ({
          size: unequal ? (i % 2 === 0 ? 1 : 2) : 1,
          shaded: i < n,
        })),
      },
    ],
  };
}

/** Reads back how many parts a fraction bar has, how many are shaded, and whether they are equal. */
export function readBar(spec: unknown): { parts: number; shaded: number; equal: boolean } {
  const bar = (spec as BarModelSpec | undefined)?.bars?.[0];
  const parts = bar?.parts ?? [];
  return {
    parts: parts.length,
    shaded: parts.filter((p) => p.shaded).length,
    equal: parts.every((p) => p.size === parts[0]?.size),
  };
}

/** A number line from `from` to `to` split into `minor` parts per whole, with an arrow at `at`. */
export function fractionLine(at: number, minor: number, from = 0, to = 1): NumberLineSpec {
  return {
    type: "number-line",
    min: from,
    max: to,
    step: 1,
    minor,
    labels: Array.from({ length: to - from + 1 }, (_, i) => ({
      value: from + i,
      label: String(from + i),
    })),
    points: [{ value: at, label: "?", style: "arrow" }],
  };
}

const coprimeNumerator = (rng: Rng, d: number) => {
  const options = Array.from({ length: d - 1 }, (_, i) => i + 1).filter((n) => gcdOf(n, d) === 1);
  return rng.pick(options.length ? options : [1]);
};

// --- naming fractions ----------------------------------------------------------------------------------

export interface NamedParams {
  n: number;
  d: number;
  /** Depth 2: an amount that d divides. */
  amount: number;
  claimTrue: boolean;
}

/** Recognise and name fractions of shapes and amounts: halves, thirds, quarters. */
export function namedFraction(
  id: string,
  pool: Record<Numbers, Pair[]>,
  most: Record<Numbers, number>,
): GeneratorDefinition<NamedParams> {
  return {
    id,
    version: "1.0.0",
    depths: [1, 2, 3, 4],
    misconceptions: ["FR.NAME.SHADED-UNSHADED", "FR.PARTS.UNEQUAL", "FR.OF-AMOUNT.UNIT-ONLY"],

    params(rng, numbers) {
      const [n, d] = rng.pick(pool[numbers]);
      return { n, d, amount: d * rng.int(2, most[numbers]), claimTrue: rng.bool() };
    },

    build(p, depth, rng): QuestionDraft {
      const words = fractionWords(p.n, p.d);
      switch (depth) {
        case 1: {
          const options = [
            {
              content: A.math(fracTex(p.n, p.d - p.n)),
              code: "FR.NAME.SHADED-UNSHADED",
              feedback: `Count all the parts: there are ${p.d}, and ${p.n} ${p.n === 1 ? "is" : "are"} shaded.`,
              key: `${p.n}/${p.d - p.n}`,
            },
            {
              content: A.math(fracTex(p.d, p.n)),
              feedback: "The number of shaded parts goes on top.",
              key: `${p.d}/${p.n}`,
            },
            {
              content: A.math(fracTex(p.n, p.d + 1)),
              feedback: `Count the parts again: there are ${p.d}.`,
              key: `${p.n}/${p.d + 1}`,
            },
          ].filter(
            (o, i, all) =>
              o.key !== slash(p.n, p.d) &&
              all.findIndex((x) => x.key === o.key) === i &&
              !(p.d - p.n === p.n && o.key === `${p.n}/${p.n}`),
          );
          return A.choice({
            rng,
            question: ["What fraction of the bar is shaded?", A.figure(fractionBar(p.n, p.d))],
            correct: A.math(fracTex(p.n, p.d)),
            distractors: options.map(({ content, code, feedback }) => ({
              content,
              feedback,
              ...(code ? { code } : {}),
            })),
            solution: [
              {
                say: `There are ${p.d} equal parts and ${p.n} ${p.n === 1 ? "is" : "are"} shaded, so ${words} is shaded: ${slash(p.n, p.d)}.`,
              },
            ],
          });
        }
        case 2: {
          const answer = (p.amount / p.d) * p.n;
          return A.variedForm({
            rng,
            forms: [
              { question: [`Find ${words} of ${p.amount}.`] },
              {
                question: [`There are ${p.amount} sweets. You eat ${words} of them.`],
                ask: "How many sweets do you eat?",
              },
            ],
            answer: A.number(answer),
            wrong: wrongs(answer, [
              p.n > 1
                ? {
                    code: "FR.OF-AMOUNT.UNIT-ONLY",
                    value: A.number(p.amount / p.d),
                    feedback: `That is one part. ${words} is ${p.n} parts.`,
                  }
                : undefined,
            ]),
            solution: [
              {
                say: `Split ${p.amount} into ${p.d} equal groups of ${p.amount / p.d}${p.n > 1 ? `, then take ${p.n} groups: ${answer}` : ""}.`,
              },
            ],
          });
        }
        case 3:
          return A.chooseTheDiagram({
            rng,
            question: ["Which bar has ", A.math(fracTex(p.n, p.d)), " shaded?"],
            correct: fractionBar(p.n, p.d),
            distractors: [
              {
                figure: fractionBar(p.n, p.d, true),
                code: "FR.PARTS.UNEQUAL",
                feedback: "The parts must be equal.",
              },
              {
                figure: fractionBar(p.n, p.d + 1),
                feedback: `That bar has ${p.d + 1} parts, not ${p.d}.`,
              },
            ],
            solution: [{ say: `${p.d} equal parts with ${p.n} shaded.` }],
          });
        default:
          return A.trueOrFalseWhy({
            rng,
            statement: [
              `Ava says the bar is split into ${p.d === 2 ? "halves" : p.d === 3 ? "thirds" : "quarters"}.`,
              A.figure(fractionBar(0, p.d, !p.claimTrue)),
            ],
            truth: p.claimTrue,
            reasons: p.claimTrue
              ? [
                  {
                    text: `True. There are ${p.d} parts and they are all the same size.`,
                    correct: true,
                  },
                  { text: "False. The parts need to be different sizes." },
                  { text: `False. You need more than ${p.d} parts.` },
                ]
              : [
                  {
                    text: `False. There are ${p.d} parts, but they are not the same size.`,
                    correct: true,
                  },
                  {
                    text: `True. There are ${p.d} parts, so they are ${p.d === 2 ? "halves" : p.d === 3 ? "thirds" : "quarters"}.`,
                    code: "FR.PARTS.UNEQUAL",
                  },
                  { text: "True. Any bar can be split like that." },
                ],
            solution: [
              {
                say: `${p.d === 2 ? "Halves" : p.d === 3 ? "Thirds" : "Quarters"} are ${p.d} equal parts.`,
              },
            ],
          });
      }
    },

    verify(p, question) {
      if (question.archetype === "standard") return chosenText(question) === fracTex(p.n, p.d);
      if (question.archetype === "varied-form")
        return numberAnswer(question) * p.d === p.amount * p.n;
      if (question.archetype === "choose-the-diagram") {
        const b = readBar(chosenFigure(question));
        return b.equal && b.parts === p.d && b.shaded === p.n;
      }
      return readBar(question.diagrams[0]).equal === p.claimTrue;
    },
  };
}

// --- fractions of amounts ------------------------------------------------------------------------------

export interface AmountParams {
  n: number;
  d: number;
  /** The amount is k × d. */
  k: number;
}

/** Fractions of amounts, finding the whole from a part, and two-step problems. */
export function fractionOfAmount(
  id: string,
  dens: Record<Numbers, number[]>,
  nonUnit: Record<Numbers, boolean>,
  most: Record<Numbers, number>,
): GeneratorDefinition<AmountParams> {
  return {
    id,
    version: "1.0.0",
    depths: [1, 2, 5],
    misconceptions: [
      "FR.OF-AMOUNT.UNIT-ONLY",
      "FR.OF-AMOUNT.DIVIDES-BY-NUMERATOR",
      "AS.MULTISTEP.ONE-STEP",
    ],

    params(rng, numbers) {
      const d = rng.pick(dens[numbers]);
      const n = nonUnit[numbers] ? coprimeNumerator(rng, d) : 1;
      const k = rng.int(2, most[numbers]);
      return { n, d, k };
    },

    build(p, depth): QuestionDraft {
      const amount = p.k * p.d;
      const part = p.k * p.n;
      const f = A.math(fracTex(p.n, p.d));
      const steps = `${amount} ÷ ${p.d} = ${p.k}${p.n > 1 ? `, then ${p.k} × ${p.n} = ${part}` : ""}`;
      switch (depth) {
        case 1:
          return A.standard({
            question: ["Find ", f, ` of ${amount}.`],
            answer: A.number(part),
            wrong: wrongs(part, [
              p.n > 1
                ? {
                    code: "FR.OF-AMOUNT.UNIT-ONLY",
                    value: A.number(p.k),
                    feedback: `${amount} ÷ ${p.d} gives one ${p.d === 2 ? "half" : "part"}. You need ${p.n} parts.`,
                  }
                : undefined,
              p.n > 1 && amount % p.n === 0
                ? {
                    code: "FR.OF-AMOUNT.DIVIDES-BY-NUMERATOR",
                    value: A.number(amount / p.n),
                    feedback: `The denominator, ${p.d}, tells you how many equal parts to split ${amount} into.`,
                  }
                : undefined,
            ]),
            solution: [
              { say: `Divide by the denominator and multiply by the numerator: ${steps}.` },
            ],
          });
        case 2:
          return A.reverse({
            question: [
              f,
              ` of a number is ${part}.`,
              A.figure({
                type: "bar-model",
                bars: [
                  {
                    parts: Array.from({ length: p.d }, (_, i) => ({
                      size: 1,
                      shaded: i < p.n,
                      ...(i === 0 && p.n === 1 ? { label: String(part) } : {}),
                    })),
                  },
                ],
                braces: [
                  ...(p.n > 1
                    ? [
                        {
                          bar: 0,
                          from: 0,
                          to: p.n - 1,
                          label: String(part),
                          side: "above" as const,
                        },
                      ]
                    : []),
                  { bar: 0, from: 0, to: p.d - 1, label: "?", side: "below" as const },
                ],
              }),
            ],
            ask: "What is the number?",
            answer: A.number(amount),
            wrong: wrongs(amount, [
              p.n > 1
                ? {
                    code: "FR.OF-AMOUNT.UNIT-ONLY",
                    value: A.number(part * p.d),
                    feedback: `${part} is ${p.n} parts, so one part is ${part} ÷ ${p.n} = ${p.k}.`,
                  }
                : undefined,
            ]),
            solution: [
              {
                say: `${p.n > 1 ? `${p.n} parts are ${part}, so one part is ${p.k}. ` : `One part is ${part}. `}There are ${p.d} parts: ${p.k} × ${p.d} = ${amount}.`,
              },
            ],
          });
        default:
          return A.multiStepContext({
            context: ["A class has ", String(amount), " children. ", f, " of them walk to school."],
            parts: [
              {
                ask: "How many children walk to school?",
                answer: A.number(part),
                wrong: wrongs(part, [
                  p.n > 1
                    ? {
                        code: "FR.OF-AMOUNT.UNIT-ONLY",
                        value: A.number(p.k),
                        feedback: `That is ${slash(1, p.d)}. Multiply by ${p.n}.`,
                      }
                    : undefined,
                ]),
              },
              {
                ask: "How many children do not walk to school?",
                answer: A.number(amount - part),
                wrong: wrongs(amount - part, [
                  {
                    code: "AS.MULTISTEP.ONE-STEP",
                    value: A.number(part),
                    feedback: "That is how many walk. Take it away from the whole class.",
                  },
                ]),
              },
            ],
            solution: [
              { say: `${steps}, so ${part} walk.` },
              { say: `${amount} − ${part} = ${amount - part} do not.` },
            ],
          });
      }
    },

    verify(p, question) {
      if (question.archetype === "reverse") return numberAnswer(question) === p.k * p.d;
      if (question.archetype === "multi-step-context")
        return numberAnswer(question, 0) + numberAnswer(question, 1) === p.k * p.d;
      return numberAnswer(question) * p.d === p.k * p.d * p.n;
    },
  };
}

// --- counting in tenths and hundredths -----------------------------------------------------------------

export interface CountParams {
  /** Start, in steps of 1/den. */
  start: number;
  up: boolean;
  /** Depth 2: the arrow, in steps of 1/den, on a line from `whole` to `whole` + 1. */
  at: number;
  whole: number;
  asFractions: boolean;
}

/** Count up and down in tenths (den 10) or hundredths (den 100). */
export function countParts(
  id: string,
  den: 10 | 100,
  fractions: Record<Numbers, boolean>,
): GeneratorDefinition<CountParams> {
  const dp = den === 10 ? 1 : 2;
  const show = (k: number) => (k / den).toFixed(dp);
  return {
    id,
    version: "1.0.0",
    depths: [1, 2, 4],
    misconceptions: ["FR.COUNT.POINT-TEN", "NPV.NUMBERLINE.COUNT-TICKS"],

    params(rng, numbers) {
      const up = rng.bool();
      // Half the time the count crosses a whole number, where 0.9 → 1.0 is the trap.
      const cross = rng.bool();
      const whole = rng.int(0, numbers === "stretch" ? 4 : 1);
      const start = cross
        ? whole * den + (up ? den - 3 : den + 3)
        : whole * den + rng.int(1, den - 5);
      const at = rng.int(1, den - 1);
      if (den === 100 && at % 10 === 0) reject("a hundredth that is not also a tenth");
      if (start < 3) reject("stay above zero");
      return {
        start,
        up,
        at,
        whole,
        asFractions: fractions[numbers] && den === 10 && whole === 0 && !cross && rng.bool(),
      };
    },

    build(p, depth, rng): QuestionDraft {
      const step = p.up ? 1 : -1;
      const seq = [0, 1, 2].map((i) => p.start + i * step);
      const next = p.start + 3 * step;
      const wordStep = den === 10 ? "tenths" : "hundredths";
      switch (depth) {
        case 1: {
          if (p.asFractions)
            return A.standard({
              question: [
                `Count ${p.up ? "on" : "back"} in tenths: `,
                A.math(seq.map((k) => fracTex(k, 10)).join(",\\ ")),
                ", …",
              ],
              ask: "What comes next?",
              answer: A.exact(frac(next, 10)),
              solution: [
                {
                  say: `Each step ${p.up ? "adds" : "takes away"} one tenth, so the next is ${next}/10.`,
                },
              ],
            });
          const crossed = Math.floor(next / den) !== Math.floor((next - step) / den);
          const slip =
            p.up && crossed ? Number(`${Math.floor((next - 1) / den)}.${den}`) : undefined;
          return A.standard({
            question: [
              `Count ${p.up ? "on" : "back"} in ${wordStep}: `,
              A.math(seq.map(show).join(",\\ ")),
              ", …",
            ],
            ask: "What comes next?",
            answer: A.number(next / den),
            wrong: wrongs(next / den, [
              slip !== undefined && slip !== next / den
                ? {
                    code: "FR.COUNT.POINT-TEN",
                    value: A.number(slip),
                    feedback: `${den} ${wordStep} make 1 whole, so after ${show(next - 1)} comes ${show(next)}.`,
                  }
                : undefined,
            ]),
            solution: [
              {
                say: `Each step ${p.up ? "adds" : "takes away"} ${den === 10 ? "0.1" : "0.01"}: ${show(seq[2] ?? 0)} ${p.up ? "+" : "−"} ${den === 10 ? "0.1" : "0.01"} = ${show(next)}.`,
              },
            ],
          });
        }
        case 2: {
          // A hundredths line runs between two tenths, split into ten.
          const [from, minor, value] =
            den === 10
              ? [p.whole, 10, p.whole + p.at / 10]
              : [Math.floor(p.at / 10) / 10, 10, p.at / 100];
          const line: NumberLineSpec =
            den === 10
              ? fractionLine(value, minor, p.whole, p.whole + 1)
              : {
                  type: "number-line",
                  min: from,
                  max: Math.round((from + 0.1) * 10) / 10,
                  step: 0.1,
                  minor: 10,
                  labels: [
                    { value: from, label: from.toFixed(1) },
                    { value: Math.round((from + 0.1) * 10) / 10, label: (from + 0.1).toFixed(1) },
                  ],
                  points: [{ value, label: "?", style: "arrow" }],
                };
          return A.variedForm({
            rng,
            forms: [
              { question: ["What number is the arrow pointing to?", A.figure(line)] },
              { question: ["Write the number the arrow points to as a decimal.", A.figure(line)] },
            ],
            answer: A.number(Number(value.toFixed(dp))),
            wrong: wrongs(Number(value.toFixed(dp)), [
              {
                code: "NPV.NUMBERLINE.COUNT-TICKS",
                value: A.number(
                  Number(
                    (den === 10 ? from + p.at / 100 : from + (p.at % 10) / 10).toFixed(dp + 1),
                  ),
                ),
                feedback: `The line is split into 10 equal steps, so each step is ${den === 10 ? "0.1" : "0.01"}.`,
              },
            ]),
            solution: [
              {
                say: `Each small step is ${den === 10 ? "one tenth, 0.1" : "one hundredth, 0.01"}. Count on from ${den === 10 ? p.whole : from.toFixed(1)}: ${value.toFixed(dp)}.`,
              },
            ],
          });
        }
        default: {
          const before = den === 10 ? `${p.whole}.9` : `${p.whole}.99`;
          const wrong = den === 10 ? `${p.whole}.10` : `${p.whole}.100`;
          return A.trueOrFalseWhy({
            rng,
            statement: [
              `Raj counts in ${wordStep}. He says the number after `,
              A.math(before),
              " is ",
              A.math(wrong),
              ".",
            ],
            truth: false,
            reasons: [
              {
                text: `False. ${before} + ${den === 10 ? "0.1" : "0.01"} = ${p.whole + 1}. ${den} ${wordStep} make a whole.`,
                correct: true,
              },
              {
                text: `True. After 9 comes 10, so after ${before} comes ${wrong}.`,
                code: "FR.COUNT.POINT-TEN",
              },
              { text: `True. Decimals never get to the next whole number.` },
            ],
            solution: [
              {
                say: `${wrong} is the same as ${(p.whole + 0.1).toFixed(1)}, which is smaller than ${before}. The next number is ${(p.whole + 1).toFixed(dp)}.`,
              },
            ],
          });
        }
      }
    },

    verify(p, question) {
      if (question.archetype === "standard" && question.parts[0]?.answer.type === "exact")
        return true;
      if (question.archetype === "standard")
        return Math.abs(numberAnswer(question) - (p.start + 3 * (p.up ? 1 : -1)) / den) < 1e-9;
      if (question.archetype === "varied-form") {
        const v = den === 10 ? p.whole + p.at / 10 : p.at / 100;
        return Math.abs(numberAnswer(question) - v) < 1e-9;
      }
      return true;
    },
  };
}

// --- equivalent fractions ------------------------------------------------------------------------------

export interface EquivParams {
  n: number;
  d: number;
  k: number;
  claimTrue: boolean;
}

/** Equivalent fractions by multiplying or dividing top and bottom, shown with bars. */
export function equivalents(
  id: string,
  dens: Record<Numbers, number[]>,
  most: Record<Numbers, number>,
): GeneratorDefinition<EquivParams> {
  return {
    id,
    version: "1.0.0",
    depths: [1, 3, 4],
    misconceptions: ["FR.EQUIV.ADD-SAME"],

    params(rng, numbers) {
      const d = rng.pick(dens[numbers]);
      return {
        n: coprimeNumerator(rng, d),
        d,
        k: rng.int(2, most[numbers]),
        claimTrue: rng.bool(),
      };
    },

    build(p, depth, rng): QuestionDraft {
      const [N, D] = [p.n * p.k, p.d * p.k];
      const added = p.n + (D - p.d);
      switch (depth) {
        case 1:
          return A.standard({
            question: [
              "Find the missing number: ",
              A.math(`${fracTex(p.n, p.d)} = \\frac{\\square}{${D}}`),
            ],
            answer: A.number(N),
            wrong: wrongs(N, [
              {
                code: "FR.EQUIV.ADD-SAME",
                value: A.number(added),
                feedback: `${p.d} × ${p.k} = ${D}, so multiply the numerator by ${p.k} too. Adding the same amount does not keep the fraction the same.`,
              },
            ]),
            solution: [
              {
                say: `${p.d} × ${p.k} = ${D}, so ${p.n} × ${p.k} = ${N}: ${slash(p.n, p.d)} = ${slash(N, D)}.`,
              },
            ],
          });
        case 3:
          return A.chooseTheDiagram({
            rng,
            question: [
              "Which bar shows a fraction equal to ",
              A.math(fracTex(p.n, p.d)),
              "?",
              A.figure(fractionBar(p.n, p.d)),
            ],
            correct: fractionBar(N, D),
            distractors: [
              ...(added < D
                ? [
                    {
                      figure: fractionBar(added, D),
                      code: "FR.EQUIV.ADD-SAME",
                      feedback: `That shows ${slash(added, D)}: adding to the top does not keep the fraction the same.`,
                    },
                  ]
                : []),
              {
                figure: fractionBar(p.n, D),
                feedback: `That shows ${slash(p.n, D)}, which is smaller.`,
              },
              ...(N + 1 < D
                ? [
                    {
                      figure: fractionBar(N + 1, D),
                      feedback: `That shows ${slash(N + 1, D)}, which is a little bigger.`,
                    },
                  ]
                : []),
            ].slice(0, 3),
            solution: [
              {
                say: `Split each part into ${p.k}: ${slash(p.n, p.d)} = ${slash(N, D)}, the same amount shaded.`,
              },
            ],
          });
        default: {
          const shown = p.claimTrue
            ? `${fracTex(p.n, p.d)} = ${fracTex(N, D)}`
            : `${fracTex(p.n, p.d)} = ${fracTex(p.n + p.k, p.d + p.k)}`;
          return A.trueOrFalseWhy({
            rng,
            statement: [
              "Zac says ",
              A.math(shown),
              p.claimTrue
                ? `, because he multiplied the top and bottom by ${p.k}.`
                : `, because he added ${p.k} to the top and bottom.`,
            ],
            truth: p.claimTrue,
            reasons: p.claimTrue
              ? [
                  {
                    text: `True. Multiplying the top and bottom by the same number splits every part into ${p.k}, so the amount stays the same.`,
                    correct: true,
                  },
                  { text: "False. The numbers are bigger, so the fraction is bigger." },
                  { text: "False. You must add, not multiply.", code: "FR.EQUIV.ADD-SAME" },
                ]
              : [
                  {
                    text: `False. ${slash(p.n, p.d)} and ${slash(p.n + p.k, p.d + p.k)} are different amounts. Multiply, not add: ${slash(p.n, p.d)} = ${slash(N, D)}.`,
                    correct: true,
                  },
                  {
                    text: "True. Doing the same thing to the top and bottom keeps it equal.",
                    code: "FR.EQUIV.ADD-SAME",
                  },
                  { text: "True. Both fractions are less than 1." },
                ],
            solution: [
              {
                say: `Equivalent fractions multiply (or divide) the numerator and denominator by the same number.`,
              },
            ],
          });
        }
      }
    },

    verify(p, question) {
      if (question.archetype === "standard")
        return numberAnswer(question) * p.d === p.n * p.d * p.k;
      if (question.archetype === "choose-the-diagram") {
        const b = readBar(chosenFigure(question));
        return frac(b.shaded, b.parts).eq(frac(p.n, p.d));
      }
      return true;
    },
  };
}

// --- adding and subtracting ----------------------------------------------------------------------------

export type AddMode = "same" | "related" | "different" | "mixed";

export interface AddParams {
  mode: AddMode;
  add: boolean;
  a: Pair;
  b: Pair;
  /** Whole parts, for mixed numbers. */
  wa: number;
  wb: number;
}

const mixedTex = (w: number, n: number, d: number) => (w ? `${w}${fracTex(n, d)}` : fracTex(n, d));

/** Add and subtract fractions: same denominators, related ones, different ones, or mixed numbers. */
export function addFractions(
  id: string,
  mode: AddMode,
  dens: Record<Numbers, number[]>,
  withinOne: boolean,
  form?: "simplest",
): GeneratorDefinition<AddParams> {
  const value = (p: AddParams) => {
    const x = frac(p.wa * p.a[1] + p.a[0], p.a[1]);
    const y = frac(p.wb * p.b[1] + p.b[0], p.b[1]);
    return p.add ? x.add(y) : x.sub(y);
  };
  return {
    id,
    version: "1.0.0",
    depths: [1, 2, 4],
    misconceptions: ["FR.ADD.TOPS-AND-BOTTOMS"],

    params(rng, numbers) {
      const d1 = rng.pick(dens[numbers]);
      const d2 =
        mode === "same"
          ? d1
          : mode === "related"
            ? d1 * rng.int(2, 3)
            : rng.pick(dens[numbers].filter((x) => x !== d1));
      const p: AddParams = {
        mode,
        add: rng.bool(),
        a: [rng.int(1, d1 - 1), d1],
        b: [rng.int(1, d2 - 1), d2],
        wa: mode === "mixed" ? rng.int(1, 4) : 0,
        wb: mode === "mixed" ? rng.int(1, 3) : 0,
      };
      if (d2 === undefined || (mode === "different" && (d2 % d1 === 0 || d1 % d2 === 0)))
        reject("unrelated denominators");
      if (mode !== "same" && (gcdOf(p.a[0], d1) !== 1 || gcdOf(p.b[0], d2) !== 1))
        reject("fractions in simplest form");
      const v = value(p);
      if (v.sign() <= 0) reject("a positive answer");
      if (withinOne && v.gt(1)) reject("within one whole");
      if (mode === "same" && p.a[0] === p.b[0]) reject("different numerators");
      return p;
    },

    build(p, depth, rng): QuestionDraft {
      const v = value(p);
      const sign = p.add ? "+" : "-";
      const [an, ad] = p.a;
      const [bn, bd] = p.b;
      const latex = `${mixedTex(p.wa, an, ad)} ${sign} ${mixedTex(p.wb, bn, bd)}`;
      const tops = p.add ? an + bn : an - bn;
      const slip = p.mode === "mixed" ? undefined : tops > 0 ? frac(tops, ad + bd) : undefined;
      const wrong =
        slip && !slip.eq(v)
          ? [
              {
                code: "FR.ADD.TOPS-AND-BOTTOMS",
                value: A.exact(fracTex(tops, ad + bd)),
                feedback:
                  p.mode === "same"
                    ? `The denominator tells you the size of the parts. ${p.add ? "Adding" : "Taking away"} ${slash(bn, bd)} does not change the size, so keep ${ad}.`
                    : "Write both fractions with the same denominator first, then add or subtract the numerators only.",
              },
            ]
          : [];
      const common = (ad * bd) / gcdOf(ad, bd);
      const steps =
        p.mode === "same"
          ? `Keep the denominator and ${p.add ? "add" : "subtract"} the numerators: ${an} ${p.add ? "+" : "−"} ${bn} = ${tops}, so ${slash(tops, ad)}.`
          : `Use the common denominator ${common}: ${slash(an * (common / ad) + p.wa * common, common)} ${p.add ? "+" : "−"} ${slash(bn * (common / bd) + p.wb * common, common)} = ${v.toString()}.`;
      const answer = A.exact(v, form);
      switch (depth) {
        case 1:
          return A.standard({
            question: [A.math(latex)],
            ask: form ? "Work it out. Give your answer in its simplest form." : "Work it out.",
            answer,
            wrong,
            solution: [{ say: steps, math: `${latex} = ${ratTex(v)}` }],
          });
        case 2:
          return A.variedForm({
            rng,
            forms: p.add
              ? [
                  {
                    question: [
                      "Mia drinks ",
                      A.math(mixedTex(p.wa, an, ad)),
                      " litres of water in the morning and ",
                      A.math(mixedTex(p.wb, bn, bd)),
                      " litres in the afternoon.",
                    ],
                    ask: "How much does she drink altogether, in litres?",
                  },
                  {
                    question: [
                      "Find the total of ",
                      A.math(mixedTex(p.wa, an, ad)),
                      " and ",
                      A.math(mixedTex(p.wb, bn, bd)),
                      ".",
                    ],
                  },
                ]
              : [
                  {
                    question: [
                      "A ribbon is ",
                      A.math(mixedTex(p.wa, an, ad)),
                      " m long. ",
                      A.math(mixedTex(p.wb, bn, bd)),
                      " m is cut off.",
                    ],
                    ask: "How long is the ribbon now, in metres?",
                  },
                  {
                    question: [
                      "Find the difference between ",
                      A.math(mixedTex(p.wa, an, ad)),
                      " and ",
                      A.math(mixedTex(p.wb, bn, bd)),
                      ".",
                    ],
                  },
                ],
            answer,
            wrong,
            solution: [{ say: steps, math: `${latex} = ${ratTex(v)}` }],
          });
        default: {
          if (p.mode === "same" || !slip) {
            const bad = fracTex(Math.abs(tops), ad + bd);
            return A.spotTheMistake({
              question: ["Sam works out ", A.math(latex), "."],
              lines: [
                [A.math(`${latex} = \\frac{${an} ${sign} ${bn}}{${ad} + ${bd}}`)],
                [A.math(`= ${bad}`)],
              ],
              mistake: 0,
              code: "FR.ADD.TOPS-AND-BOTTOMS",
              feedback: `Line 1 adds the denominators. ${p.mode === "same" ? "Keep the denominator" : "Use a common denominator"} and ${p.add ? "add" : "subtract"} only the numerators: ${v.toString()}.`,
            });
          }
          return A.spotTheMistake({
            question: ["Sam works out ", A.math(latex), "."],
            lines: [
              [
                A.math(
                  `= ${fracTex(an * (common / ad), common)} ${sign} ${fracTex(bn * (common / bd), common)}`,
                ),
              ],
              [
                A.math(
                  `= ${fracTex(Math.abs(an * (common / ad) + (p.add ? 1 : -1) * bn * (common / bd)), common + common)}`,
                ),
              ],
            ],
            mistake: 1,
            code: "FR.ADD.TOPS-AND-BOTTOMS",
            feedback: `Line 2 ${p.add ? "adds" : "subtracts"} the denominators too. With a common denominator, only the numerators change: ${v.toString()}.`,
          });
        }
      }
    },

    verify(p, question) {
      if (question.archetype === "spot-the-mistake") return value(p).sign() > 0;
      const a = question.parts[0]?.answer;
      return a?.type === "exact" && String(a.value) === ratTex(value(p));
    },
  };
}

// --- comparing fractions -------------------------------------------------------------------------------

export type CompareMode = "unit-same" | "multiples" | "any";

export interface CompareParams {
  /** Three fractions with different values. */
  three: Pair[];
  /** A pair where the bigger numerator is the smaller fraction (or, for unit fractions, the bigger denominator). */
  trap: [Pair, Pair];
}

/** Compare and order fractions. */
export function compareFractions(
  id: string,
  mode: CompareMode,
  dens: Record<Numbers, number[]>,
): GeneratorDefinition<CompareParams> {
  const val = ([n, d]: Pair) => frac(n, d);
  const pickPair = (rng: Rng, numbers: Numbers, base?: number): Pair => {
    if (mode === "unit-same")
      return base ? [rng.int(1, base - 1), base] : [1, rng.pick(dens[numbers])];
    const d = mode === "multiples" && base ? base * rng.int(1, 3) : rng.pick(dens[numbers]);
    const top = mode === "any" ? Math.floor(d * 1.8) : d - 1;
    return [rng.int(1, top), d];
  };
  return {
    id,
    version: "1.0.0",
    depths: [1, 2, 4],
    misconceptions: ["FR.UNIT.BIGGER-DENOMINATOR", "FR.COMPARE.NUMERATOR-ONLY"],

    params(rng, numbers) {
      const sameDen = mode === "unit-same" && rng.bool() ? rng.pick(dens[numbers]) : undefined;
      const base = mode === "multiples" ? rng.pick(dens[numbers]) : sameDen;
      const three = [
        pickPair(rng, numbers, base),
        pickPair(rng, numbers, base),
        pickPair(rng, numbers, base),
      ];
      const vals = three.map(val);
      if (vals.some((v, i) => vals.some((w, j) => i < j && v.eq(w))))
        reject("three different values");
      if (three.some(([n, d]) => gcdOf(n, d) !== 1 && mode !== "unit-same"))
        reject("simplest form");
      const [x, y] = [pickPair(rng, numbers), pickPair(rng, numbers)];
      const trap: [Pair, Pair] =
        mode === "unit-same"
          ? [
              [1, Math.max(x[1], y[1])],
              [1, Math.min(x[1], y[1])],
            ]
          : [x, y];
      if (mode === "unit-same" ? x[1] === y[1] : !(x[0] > y[0] && val(x).lt(val(y))))
        reject("a real trap");
      return { three, trap };
    },

    build(p, depth, rng): QuestionDraft {
      const [f, g]: [Pair, Pair] = [p.three[0] ?? [1, 2], p.three[1] ?? [1, 3]];
      const tex = ([n, d]: Pair) => A.math(fracTex(n, d));
      const bigger = val(f).gt(val(g)) ? f : g;
      const smaller = bigger === f ? g : f;
      const trapCode = (big: Pair, small: Pair) =>
        small[0] === 1 && big[0] === 1 && small[1] > big[1]
          ? "FR.UNIT.BIGGER-DENOMINATOR"
          : small[0] > big[0] && small[1] !== big[1]
            ? "FR.COMPARE.NUMERATOR-ONLY"
            : undefined;
      const why = (big: Pair, small: Pair) =>
        big[1] === small[1]
          ? `They have the same denominator, so compare the numerators: ${big[0]} > ${small[0]}.`
          : big[0] === 1 && small[0] === 1
            ? `Splitting into ${big[1]} parts makes bigger parts than splitting into ${small[1]}.`
            : `With a common denominator: ${slash(big[0] * small[1], big[1] * small[1])} > ${slash(small[0] * big[1], big[1] * small[1])}.`;
      switch (depth) {
        case 1: {
          const code = trapCode(bigger, smaller);
          return A.choice({
            rng,
            question: ["Which is bigger, ", tex(f), " or ", tex(g), "?"],
            correct: tex(bigger),
            distractors: [
              { content: tex(smaller), ...(code ? { code } : {}), feedback: why(bigger, smaller) },
              { content: "They are the same size", feedback: why(bigger, smaller) },
            ],
            solution: [{ say: why(bigger, smaller) }],
          });
        }
        case 2: {
          const sorted = [...p.three].sort((x, y) => val(x).cmp(val(y)));
          const byDen = [...p.three].sort((x, y) => x[1] - y[1] || x[0] - y[0]);
          const byNum = [...p.three].sort((x, y) => x[0] - y[0] || x[1] - y[1]);
          const list = (xs: Pair[]) => A.math(xs.map(([n, d]) => fracTex(n, d)).join(",\\ "));
          const key = (xs: Pair[]) => xs.map((x) => slash(...x)).join(",");
          const options = [
            { xs: [...sorted].reverse(), feedback: "That is largest first." },
            {
              xs: mode === "unit-same" ? byDen : byNum,
              code:
                mode === "unit-same" ? "FR.UNIT.BIGGER-DENOMINATOR" : "FR.COMPARE.NUMERATOR-ONLY",
              feedback:
                mode === "unit-same"
                  ? "A bigger denominator means smaller parts."
                  : "Compare the sizes, not just the numerators.",
            },
            {
              xs: [sorted[1], sorted[0], sorted[2]].filter((x): x is Pair => x !== undefined),
              feedback: "Check the first two again.",
            },
          ].filter(
            (o, i, all) =>
              key(o.xs) !== key(sorted) && all.findIndex((x) => key(x.xs) === key(o.xs)) === i,
          );
          return A.choice({
            rng,
            archetype: "varied-form",
            question: "Which list is in order, smallest first?",
            correct: list(sorted),
            distractors: options.map((o) => ({
              content: list(o.xs),
              feedback: o.feedback,
              ...(o.code ? { code: o.code } : {}),
            })),
            solution: [{ say: `In order: ${sorted.map((x) => slash(...x)).join(", ")}.` }],
          });
        }
        default: {
          const [big, small] = val(p.trap[0]).gt(val(p.trap[1]))
            ? [p.trap[0], p.trap[1]]
            : [p.trap[1], p.trap[0]];
          const unit = mode === "unit-same";
          return A.trueOrFalseWhy({
            rng,
            statement: [
              "Jo says ",
              A.math(`${fracTex(small[0], small[1])} > ${fracTex(big[0], big[1])}`),
              unit
                ? `, because ${small[1]} is bigger than ${big[1]}.`
                : `, because ${small[0]} is bigger than ${big[0]}.`,
            ],
            truth: false,
            reasons: [
              { text: `False. ${why(big, small)}`, correct: true },
              unit
                ? {
                    text: "True. The bigger the denominator, the bigger the fraction.",
                    code: "FR.UNIT.BIGGER-DENOMINATOR",
                  }
                : {
                    text: "True. The bigger numerator means the bigger fraction.",
                    code: "FR.COMPARE.NUMERATOR-ONLY",
                  },
              { text: "True. You cannot compare fractions with different denominators." },
            ],
            solution: [{ say: why(big, small) }],
          });
        }
      }
    },

    verify(p, question) {
      const text = chosenText(question);
      const read = (t: string) =>
        [...t.matchAll(/\\frac\{(\d+)\}\{(\d+)\}/g)].map((m) => frac(Number(m[1]), Number(m[2])));
      if (question.archetype === "standard") {
        const [f, g] = p.three;
        const [c] = read(text);
        return !!c && !!f && !!g && c.eq(val(f).gt(val(g)) ? val(f) : val(g));
      }
      if (question.archetype === "varied-form") {
        const vs = read(text);
        return vs.length === 3 && vs.every((v, i) => i === 0 || (vs[i - 1] ?? v).lt(v));
      }
      return true;
    },
  };
}

// --- fractions and decimals ----------------------------------------------------------------------------

export interface DecimalParams {
  n: number;
  d: number;
  /** Depth 3: three more fractions to match. */
  set: Pair[];
  claimTrue: boolean;
}

const decimalOf = (n: number, d: number) => Number(frac(n, d).toDecimalString());
const powerOf10 = (d: number) => /^10*$/.test(String(d));

/** Write fractions as decimals and decimals as fractions. With `reduced`, numerators share no factor with d. */
export function fractionDecimal(
  id: string,
  dens: Record<Numbers, number[]>,
  reduced: boolean,
): GeneratorDefinition<DecimalParams> {
  const pick = (rng: Rng, numbers: Numbers): Pair => {
    const d = rng.pick(dens[numbers]);
    const n = reduced ? coprimeNumerator(rng, d) : rng.int(1, d - 1);
    return [n, d];
  };
  return {
    id,
    version: "1.0.0",
    depths: [1, 2, 3, 4],
    misconceptions: ["FR.DECIMAL.PLACE", "FR.DECIMAL.DIGITS"],

    params(rng, numbers) {
      const [n, d] = pick(rng, numbers);
      const set = [pick(rng, numbers), pick(rng, numbers), pick(rng, numbers)];
      if (!reduced && (n % 10 === 0 || set.some(([a]) => a % 10 === 0)))
        reject("no trailing zeros");
      if (new Set(set.map(([a, b]) => decimalOf(a, b))).size < 3)
        reject("three different decimals");
      return { n, d, set, claimTrue: rng.bool() };
    },

    build(p, depth, rng): QuestionDraft {
      const x = decimalOf(p.n, p.d);
      const xs = frac(p.n, p.d).toDecimalString();
      const place = powerOf10(p.d);
      // 7/100 → 0.7, or 7/10 → 0.07: the digits in the wrong place.
      const shifted = p.d === 10 ? p.n / 100 : p.n < p.d / 10 ? p.n / (p.d / 10) : undefined;
      const digits = place ? undefined : Number(`0.${p.n}${p.d}`);
      const toDecimal = place
        ? `${p.n} ${p.d === 10 ? "tenths" : p.d === 100 ? "hundredths" : "thousandths"} is ${xs}.`
        : `${slash(p.n, p.d)} = ${p.n} ÷ ${p.d} = ${xs}${p.d < 10 || 1000 % p.d === 0 ? ` (${slash(p.n * (1000 / p.d), 1000)})` : ""}.`;
      switch (depth) {
        case 1:
          return A.standard({
            question: ["Write ", A.math(fracTex(p.n, p.d)), " as a decimal."],
            answer: A.number(x),
            wrong: wrongs(x, [
              shifted !== undefined
                ? {
                    code: "FR.DECIMAL.PLACE",
                    value: A.number(shifted),
                    feedback:
                      "Check the place: tenths are one place after the point, hundredths two, thousandths three.",
                  }
                : undefined,
              digits !== undefined
                ? {
                    code: "FR.DECIMAL.DIGITS",
                    value: A.number(digits),
                    feedback: `A fraction is a division: ${p.n} ÷ ${p.d}. Its digits do not just go after the point.`,
                  }
                : undefined,
            ]),
            solution: [{ say: toDecimal }],
          });
        case 2: {
          const digitsBack = /^0\.(\d)(\d)$/.exec(xs);
          const back =
            digitsBack && digitsBack[2] !== "0"
              ? frac(Number(digitsBack[1]), Number(digitsBack[2]))
              : undefined;
          return A.reverse({
            question: ["Write ", A.math(xs), " as a fraction."],
            answer: A.exact(frac(p.n, p.d)),
            wrong: [
              ...(back && !back.eq(frac(p.n, p.d))
                ? [
                    {
                      code: "FR.DECIMAL.DIGITS",
                      value: A.exact(ratTex(back)),
                      feedback: `${xs} is ${xs.slice(2)} hundredths, not ${slash(Number(digitsBack?.[1]), Number(digitsBack?.[2]))}.`,
                    },
                  ]
                : []),
            ],
            solution: [
              {
                say: `${xs} = ${slash(Number(xs.slice(2)), 10 ** (xs.length - 2))}${reduced ? `, which simplifies to ${slash(p.n, p.d)}` : ""}.`,
              },
            ],
          });
        }
        case 3:
          return A.matchRepresentations({
            rng,
            question: "Match each fraction to its decimal.",
            pairs: p.set.map(
              ([a, b]) =>
                [A.math(fracTex(a, b)), A.math(frac(a, b).toDecimalString())] as [
                  A.RichInput,
                  A.RichInput,
                ],
            ),
            solution: p.set.map(([a, b]) => ({
              say: `${slash(a, b)} = ${frac(a, b).toDecimalString()}.`,
            })),
          });
        default: {
          const wrongValue = place ? (shifted ?? x * 10) : (digits ?? x * 10);
          const shown = p.claimTrue ? xs : String(wrongValue);
          return A.trueOrFalseWhy({
            rng,
            statement: [A.math(`${fracTex(p.n, p.d)} = ${shown}`)],
            truth: p.claimTrue,
            reasons: p.claimTrue
              ? [
                  { text: `True. ${toDecimal}`, correct: true },
                  place
                    ? {
                        text: `False. The ${p.n} should go straight after the point.`,
                        code: "FR.DECIMAL.PLACE",
                      }
                    : {
                        text: "False. The decimal should use the same digits as the fraction.",
                        code: "FR.DECIMAL.DIGITS",
                      },
                  { text: "False. Fractions cannot be written as decimals." },
                ]
              : [
                  { text: `False. ${toDecimal}`, correct: true },
                  place
                    ? {
                        text: `True. The ${p.n} goes straight after the point.`,
                        code: "FR.DECIMAL.PLACE",
                      }
                    : {
                        text: "True. Write the numerator and denominator after the point.",
                        code: "FR.DECIMAL.DIGITS",
                      },
                  { text: "True. Fractions and decimals always use the same digits." },
                ],
            solution: [{ say: toDecimal }],
          });
        }
      }
    },

    verify(p, question) {
      if (question.archetype === "standard")
        return Math.abs(numberAnswer(question) - p.n / p.d) < 1e-12;
      if (question.archetype === "reverse") {
        const a = question.parts[0]?.answer;
        return a?.type === "exact" && String(a.value) === ratTex(frac(p.n, p.d));
      }
      return true;
    },
  };
}

// --- rounding decimals ---------------------------------------------------------------------------------

export interface RoundParams {
  /** The number is m / 10^dp. */
  m: number;
  dp: number;
  to: number;
  claim: number;
}

/** Round decimals to the nearest whole number or to one decimal place. */
export function roundDecimals(
  id: string,
  options: Record<Numbers, [number, number][]>,
  most: Record<Numbers, number>,
): GeneratorDefinition<RoundParams> {
  const roundAt = (m: number, dp: number, to: number, f = Math.round) =>
    f(m / 10 ** (dp - to)) / 10 ** to;
  return {
    id,
    version: "1.0.0",
    depths: [1, 2, 4],
    misconceptions: ["NPV.ROUND.ALWAYS-DOWN", "NPV.ROUND.WRONG-PLACE", "NPV.ROUND.HALFWAY"],

    params(rng, numbers) {
      const [dp, to] = rng.pick(options[numbers]);
      const m = rng.int(10 ** dp, most[numbers] * 10 ** dp);
      const next = Math.floor(m / 10 ** (dp - to - 1)) % 10;
      if (next === 5 || m % 10 === 0) reject("not halfway, and every place used");
      if (roundAt(m, dp, to) === roundAt(m, dp, to, Math.floor) && rng.bool(0.6))
        reject("round up more often");
      return { m, dp, to, claim: rng.int(0, dp === 2 && to === 0 ? 1 : 0) };
    },

    build(p, depth, rng): QuestionDraft {
      const x = p.m / 10 ** p.dp;
      const xs = x.toFixed(p.dp);
      const answer = roundAt(p.m, p.dp, p.to);
      const down = roundAt(p.m, p.dp, p.to, Math.floor);
      const other = p.dp === 2 ? roundAt(p.m, p.dp, 1 - p.to) : undefined;
      const target = p.to === 0 ? "the nearest whole number" : "one decimal place";
      const next = Math.floor(p.m / 10 ** (p.dp - p.to - 1)) % 10;
      const why = `Look at the ${p.to === 0 ? "tenths" : "hundredths"} digit, ${next}: it is ${next >= 5 ? "5 or more, so round up" : "less than 5, so round down"}. ${xs} ≈ ${answer.toFixed(p.to)}.`;
      const wrong = wrongs(answer, [
        down !== answer
          ? {
              code: "NPV.ROUND.ALWAYS-DOWN",
              value: A.number(down),
              feedback: "Look at the next digit to decide whether to round up or down.",
            }
          : undefined,
        other !== undefined && other !== answer
          ? {
              code: "NPV.ROUND.WRONG-PLACE",
              value: A.number(other),
              feedback: `Round to ${target}.`,
            }
          : undefined,
      ]);
      switch (depth) {
        case 1:
          return A.standard({
            question: ["Round ", A.math(xs), ` to ${target}.`],
            answer: A.number(answer),
            wrong,
            solution: [{ say: why }],
          });
        case 2:
          return A.variedForm({
            rng,
            forms: [
              {
                question: `A parcel weighs ${xs} kg.`,
                ask: `What is its mass to ${p.to === 0 ? "the nearest kilogram" : "one decimal place"}?`,
              },
              {
                question: `A runner takes ${xs} seconds.`,
                ask: `What is the time to ${p.to === 0 ? "the nearest second" : "one decimal place"}?`,
              },
            ],
            answer: A.number(answer),
            wrong,
            solution: [{ say: why }],
          });
        default: {
          if (p.claim === 1) {
            // Rounding twice: 2.47 → 2.5 → 3 is wrong.
            const w = Math.floor(x);
            const twice = `${w}.4${rng.int(5, 9)}`;
            return A.trueOrFalseWhy({
              rng,
              statement: [
                "Ben rounds ",
                A.math(twice),
                ` to one decimal place, getting ${w}.5, and then rounds that to get ${w + 1}. He says ${twice} to the nearest whole number is ${w + 1}.`,
              ],
              truth: false,
              reasons: [
                {
                  text: `False. Round in one step: the tenths digit of ${twice} is 4, so it rounds down to ${w}.`,
                  correct: true,
                },
                { text: "True. Rounding in steps gives a more accurate answer." },
                {
                  text: `True. ${twice} is more than ${w}.4, so it rounds up.`,
                  code: "NPV.ROUND.WRONG-PLACE",
                },
              ],
              solution: [
                {
                  say: `${twice} is between ${w} and ${w + 1}, and less than ${w}.5, so it is nearer ${w}.`,
                },
              ],
            });
          }
          const w = Math.floor(x);
          return A.trueOrFalseWhy({
            rng,
            statement: [
              "Ella says ",
              A.math(`${w}.5`),
              ` rounded to the nearest whole number is ${w}, because it is exactly halfway.`,
            ],
            truth: false,
            reasons: [
              {
                text: `False. A number exactly halfway rounds up, so ${w}.5 rounds to ${w + 1}.`,
                correct: true,
              },
              { text: "True. Halfway numbers round down.", code: "NPV.ROUND.HALFWAY" },
              { text: "True. You always round down to the whole number in front." },
            ],
            solution: [{ say: `The convention is that 5 rounds up: ${w}.5 ≈ ${w + 1}.` }],
          });
        }
      }
    },

    verify(p, question) {
      if (question.archetype === "true-or-false-why") return true;
      const x = p.m / 10 ** p.dp;
      return Math.abs(numberAnswer(question) - x) <= 0.5 * 10 ** -p.to + 1e-9;
    },
  };
}

// --- comparing decimals --------------------------------------------------------------------------------

export interface DecimalCompareParams {
  /** Three decimals as strings. With `trap`, a shorter one is bigger than a longer one. */
  three: string[];
  trapShort: string;
  trapLong: string;
}

/** Compare and order decimals. `mixed` lets the decimals have different numbers of places. */
export function compareDecimals(
  id: string,
  places: Record<Numbers, number>,
  mixed: boolean,
): GeneratorDefinition<DecimalCompareParams> {
  return {
    id,
    version: "1.0.0",
    depths: [1, 2, 4],
    misconceptions: ["NPV.DECIMAL.LONGER-BIGGER", "NPV.COMPARE.ONES-FIRST"],

    params(rng, numbers) {
      const dp = places[numbers];
      const whole = rng.int(0, 9);
      const make = (k: number) => `${whole}.${String(rng.int(1, 10 ** k - 1)).padStart(k, "0")}`;
      const three = [0, 1, 2]
        .map(() => make(mixed ? rng.int(1, dp) : dp))
        .filter((s) => !s.endsWith("0"));
      if (three.length < 3 || new Set(three.map(Number)).size < 3)
        reject("three different decimals");
      // Mixed lengths: a shorter decimal that is bigger (5.8 and 5.69). Same length: a bigger last
      // digit on the smaller number (5.47 and 5.52).
      const tenth = rng.int(2, 9);
      const short = mixed ? `${whole}.${tenth}` : `${whole}.${tenth}${rng.int(1, 5)}`;
      const long = mixed
        ? `${whole}.${rng.int(1, tenth - 1)}${rng.int(1, 9)}${dp === 3 ? rng.int(1, 9) : ""}`
        : `${whole}.${rng.int(1, tenth - 1)}${rng.int(6, 9)}`;
      return { three, trapShort: short, trapLong: long };
    },

    build(p, depth, rng): QuestionDraft {
      const [a = "0.1", b = "0.2"] = p.three;
      const [big, small] = Number(a) > Number(b) ? [a, b] : [b, a];
      const firstDiff = (x: string, y: string) => {
        const [xp, yp] = [x.split(".")[1] ?? "", y.split(".")[1] ?? ""];
        const k = [...xp.padEnd(3, "0")].findIndex((c, i) => c !== (yp.padEnd(3, "0")[i] ?? "0"));
        return ["tenths", "hundredths", "thousandths"][k] ?? "tenths";
      };
      const why = (x: string, y: string) =>
        `Compare from the left, place by place: the first difference is in the ${firstDiff(x, y)}, and ${x} has more there.`;
      const trapCode = (x: string, y: string) =>
        y.length > x.length && Number(y) < Number(x) ? "NPV.DECIMAL.LONGER-BIGGER" : undefined;
      switch (depth) {
        case 1: {
          const code = trapCode(big, small);
          return A.choice({
            rng,
            question: ["Which is bigger, ", A.math(a), " or ", A.math(b), "?"],
            correct: A.math(big),
            distractors: [
              { content: A.math(small), ...(code ? { code } : {}), feedback: why(big, small) },
              { content: "They are the same", feedback: why(big, small) },
            ],
            solution: [{ say: why(big, small) }],
          });
        }
        case 2: {
          const sorted = [...p.three].sort((x, y) => Number(x) - Number(y));
          const byLength = [...p.three].sort(
            (x, y) => x.length - y.length || Number(x) - Number(y),
          );
          const list = (xs: string[]) => A.math(xs.join(",\\ "));
          const options = [
            { xs: [...sorted].reverse(), feedback: "That is largest first." },
            {
              xs: byLength,
              code: "NPV.DECIMAL.LONGER-BIGGER",
              feedback: "More digits does not mean bigger. Compare from the left.",
            },
            {
              xs: [sorted[1] ?? "", sorted[0] ?? "", sorted[2] ?? ""],
              feedback: "Check the first two again.",
            },
          ].filter(
            (o, i, all) =>
              o.xs.join() !== sorted.join() &&
              all.findIndex((x) => x.xs.join() === o.xs.join()) === i,
          );
          return A.choice({
            rng,
            archetype: "varied-form",
            question: "Which list is in order, smallest first?",
            correct: list(sorted),
            distractors: options.map((o) => ({
              content: list(o.xs),
              feedback: o.feedback,
              ...(o.code ? { code: o.code } : {}),
            })),
            solution: [
              {
                say: `Line up the decimal points and compare from the left: ${sorted.join(", ")}.`,
              },
            ],
          });
        }
        default:
          return A.trueOrFalseWhy({
            rng,
            statement: [
              "Kim says ",
              A.math(`${p.trapLong} > ${p.trapShort}`),
              mixed
                ? `, because ${p.trapLong.split(".")[1]} is bigger than ${p.trapShort.split(".")[1]}.`
                : `, because ${p.trapLong.at(-1)} is bigger than ${p.trapShort.at(-1)}.`,
            ],
            truth: false,
            reasons: [
              {
                text: `False. Compare the tenths first: ${p.trapShort.split(".")[1]?.[0]} tenths is more than ${p.trapLong.split(".")[1]?.[0]} tenths, so ${p.trapShort} is bigger.`,
                correct: true,
              },
              mixed
                ? {
                    text: "True. The number with more digits after the point is bigger.",
                    code: "NPV.DECIMAL.LONGER-BIGGER",
                  }
                : {
                    text: "True. Compare the last digits, the hundredths.",
                    code: "NPV.COMPARE.ONES-FIRST",
                  },
              { text: "True. They have the same whole number, so compare the last digits." },
            ],
            solution: [
              {
                say: `Write them with the same number of places: ${p.trapShort.padEnd(p.trapLong.length, "0")} and ${p.trapLong}.`,
              },
            ],
          });
      }
    },

    verify(p, question) {
      const text = chosenText(question);
      if (question.archetype === "standard")
        return Number(text) === Math.max(...p.three.slice(0, 2).map(Number));
      if (question.archetype === "varied-form") {
        const vs = text.split(",\\ ").map(Number);
        return vs.every((v, i) => i === 0 || (vs[i - 1] ?? v) < v);
      }
      return Number(p.trapShort) > Number(p.trapLong);
    },
  };
}
