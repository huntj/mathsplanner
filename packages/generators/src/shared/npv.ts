// Number and place value families. The same skills come back each year with bigger numbers (the
// value of a digit, comparing, reading and writing numbers, counting in steps, n more or less,
// number lines, rounding, negative numbers, Roman numerals), so each is written once here and a
// statement's generator picks its own ranges. See docs/design.md: shared code, not copies.
import * as A from "@mathsplanner/archetypes";
import {
  reject,
  type Depth,
  type GeneratorDefinition,
  type Numbers,
  type QuestionDraft,
  type Rng,
} from "@mathsplanner/core";
import type { NumberLineSpec } from "@mathsplanner/diagrams";
import { wrongs } from "./angles.ts";
import {
  chosenFigure,
  chosenText,
  countOf,
  numberAnswer,
  numberWords,
  placeValue,
} from "./counting.ts";

export type Ranges = Record<Numbers, [number, number]>;

/** A whole number with thousands commas and a real minus sign, for text: "4,372", "−5". */
export const fmt = (n: number): string => (n < 0 ? `−${fmt(-n)}` : n.toLocaleString("en-GB"));
/** The same number for LaTeX: "4{,}372". */
export const tex = (n: number): string => fmt(n).replace(/,/g, "{,}").replace("−", "-");

const PLACE_NAMES = [
  "ones",
  "tens",
  "hundreds",
  "thousands",
  "ten thousands",
  "hundred thousands",
  "millions",
];
const ONE_PLACE = [
  "one",
  "ten",
  "hundred",
  "thousand",
  "ten thousand",
  "hundred thousand",
  "million",
];
const COLUMNS = ["O", "T", "H", "Th", "TTh", "HTh", "M"];

const digitsOf = (n: number) => String(n).split("").map(Number);
const digitCount = (n: number) => String(Math.abs(n)).length;
/** The digit in place k (0 is ones). */
const digitAt = (n: number, k: number) => Math.floor(n / 10 ** k) % 10;

/** "4000 + 300 + 70 + 2", leaving out zero places. */
export function expanded(n: number): string {
  const d = digitsOf(n);
  return d
    .map((v, i) => v * 10 ** (d.length - 1 - i))
    .filter((v) => v > 0)
    .map(fmt)
    .join(" + ");
}

/** A random number with `digits` digits, all different and none zero. */
function distinctDigits(rng: Rng, digits: number): number {
  const ds = rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], Math.min(digits, 9));
  return Number(ds.join(""));
}

// --- the value of each digit -------------------------------------------------------------------

export interface DigitParams {
  /** A number with all-different, non-zero digits. */
  n: number;
  /** The place asked about (0 is ones). */
  k: number;
  /** The same number with a middle digit replaced by 0, for the placeholder questions. */
  zeroed: number;
  claim: number;
}

/** Recognise the place value of each digit; `digits` is how many digits each setting uses. */
export function digitValue(
  id: string,
  digits: Record<Numbers, number>,
): GeneratorDefinition<DigitParams> {
  return {
    id,
    version: "1.0.0",
    depths: [1, 2, 3, 4],
    misconceptions: [
      "NPV.PLACE.FACE-VALUE",
      "NPV.PLACE.COLUMN-SHIFT",
      "NPV.PLACE.ZERO-PLACEHOLDER",
    ],

    params(rng, numbers) {
      const size = digits[numbers];
      const n = distinctDigits(rng, size);
      const middle = rng.int(1, Math.max(1, size - 2));
      const zeroed = size >= 3 ? n - digitAt(n, middle) * 10 ** middle : n;
      return {
        n,
        k: rng.int(numbers === "friendly" ? 0 : 1, size - 1),
        zeroed,
        claim: rng.int(0, 1),
      };
    },

    build(p, depth, rng): QuestionDraft {
      const d = digitAt(p.n, p.k);
      const value = d * 10 ** p.k;
      switch (depth) {
        case 1:
          return A.standard({
            question: ["Look at the number ", A.math(tex(p.n)), "."],
            ask: ["What is the value of the digit ", A.math(String(d)), "?"],
            answer: A.number(value),
            wrong: wrongs(value, [
              ...(p.k > 0
                ? [
                    {
                      code: "NPV.PLACE.FACE-VALUE",
                      value: A.number(d),
                      feedback: `The ${d} is in the ${PLACE_NAMES[p.k]} place, so it is worth ${fmt(value)}, not ${d}.`,
                    },
                  ]
                : []),
              {
                code: "NPV.PLACE.COLUMN-SHIFT",
                value: A.number(d * 10 ** (p.k + 1)),
                feedback: `Count the places from the right: the ${d} is in the ${PLACE_NAMES[p.k]} place.`,
              },
            ]),
            solution: [
              {
                say: `The ${d} is in the ${PLACE_NAMES[p.k]} place, so it is worth ${d} ${PLACE_NAMES[p.k]}: ${fmt(value)}.`,
              },
            ],
          });
        case 2: {
          const parts = digitsOf(p.zeroed)
            .map(
              (v, i, all) =>
                `${v} ${v === 1 ? ONE_PLACE[all.length - 1 - i] : PLACE_NAMES[all.length - 1 - i]}`,
            )
            .join(", ");
          const dropped = Number(String(p.zeroed).replace(/0/g, "")) || p.zeroed;
          return A.variedForm({
            rng,
            forms: [
              { question: `A number has ${parts}.`, ask: "Write the number in digits." },
              {
                question: [
                  "Partitioned, a number is ",
                  A.math(expanded(p.zeroed).replace(/,/g, "{,}")),
                  ".",
                ],
                ask: "What is the number?",
              },
              ...(digitCount(p.zeroed) <= 5
                ? [
                    {
                      question: [
                        "What number do the place-value counters show?",
                        A.figure(
                          placeValue(p.zeroed, {
                            columns: COLUMNS.slice(0, digitCount(p.zeroed)).reverse(),
                            hidden: true,
                          }),
                        ),
                      ],
                      ask: "Write the number.",
                    },
                  ]
                : []),
            ],
            answer: A.number(p.zeroed),
            wrong: wrongs(p.zeroed, [
              ...(dropped !== p.zeroed
                ? [
                    {
                      code: "NPV.PLACE.ZERO-PLACEHOLDER",
                      value: A.number(dropped),
                      feedback:
                        "An empty place needs a 0 to hold it, or the other digits move to the wrong places.",
                    },
                  ]
                : []),
            ]),
            solution: [
              {
                say: `${expanded(p.zeroed)} = ${fmt(p.zeroed)}.${dropped !== p.zeroed ? " The 0 holds the empty place." : ""}`,
              },
            ],
          });
        }
        case 3: {
          // Three numbers made of the same digits in different places.
          const ds = digitsOf(p.n);
          const perms = [ds, [...ds].reverse(), [...ds.slice(1), ds[0] ?? 0]].map((x) =>
            Number(x.join("")),
          );
          if (new Set(perms).size < 3) return reject("need three different numbers");
          return A.matchRepresentations({
            rng,
            question: "Match each number to its partitioned form.",
            pairs: perms.map(
              (m) =>
                [A.math(tex(m)), A.math(expanded(m).replace(/,/g, "{,}"))] as [
                  A.RichInput,
                  A.RichInput,
                ],
            ),
            solution: [
              {
                say: "The same digits make different numbers: each digit's value depends on its place.",
              },
            ],
          });
        }
        default: {
          if (p.claim === 0 && p.k > 0) {
            return A.trueOrFalseWhy({
              rng,
              statement: ["In ", A.math(tex(p.n)), `, the digit ${d} is worth ${d}.`],
              truth: false,
              reasons: [
                {
                  text: `It is in the ${PLACE_NAMES[p.k]} place, so it is worth ${fmt(value)}.`,
                  correct: true,
                },
                {
                  text: `A digit is always worth what it says: ${d}.`,
                  code: "NPV.PLACE.FACE-VALUE",
                },
                {
                  text: `It is worth ${fmt(value * 10)}, one place further left.`,
                  code: "NPV.PLACE.COLUMN-SHIFT",
                },
              ],
              solution: [
                { say: `${fmt(p.n)} = ${expanded(p.n)}; the ${d} is worth ${fmt(value)}.` },
              ],
            });
          }
          const place = Math.max(1, Math.min(p.k, digitCount(p.n) - 1));
          const how = Math.floor(p.n / 10 ** place);
          return A.trueOrFalseWhy({
            rng,
            statement: [
              "The number ",
              A.math(tex(p.n)),
              ` has ${fmt(how)} ${PLACE_NAMES[place]} altogether.`,
            ],
            truth: true,
            reasons: [
              {
                text: `Every place to the left counts too: ${fmt(how)} × ${fmt(10 ** place)} = ${fmt(how * 10 ** place)}, with ${fmt(p.n - how * 10 ** place)} left over.`,
                correct: true,
              },
              {
                text: `It has only ${digitAt(p.n, place)} ${PLACE_NAMES[place]}, the digit in that place.`,
                code: "NPV.PLACE.FACE-VALUE",
              },
              {
                text: `It has ${fmt(how * 10)} ${PLACE_NAMES[place]}.`,
                code: "NPV.PLACE.COLUMN-SHIFT",
              },
            ],
            solution: [
              {
                say: `${fmt(p.n)} ÷ ${fmt(10 ** place)} = ${fmt(how)} remainder ${fmt(p.n - how * 10 ** place)}.`,
              },
            ],
          });
        }
      }
    },

    verify(p, question) {
      if (question.archetype === "standard")
        return (
          numberAnswer(question) === Number(String(p.n)[String(p.n).length - 1 - p.k]) * 10 ** p.k
        );
      if (question.archetype === "varied-form") {
        const figure = question.diagrams[0];
        return numberAnswer(question) === p.zeroed && (!figure || countOf(figure) === p.zeroed);
      }
      return true;
    },
  };
}

// --- comparing and ordering ----------------------------------------------------------------------

export interface CompareParams {
  a: number;
  b: number;
  list: number[];
  /** Depth 4: fewer digits but a bigger first digit, against more digits. */
  trap: [number, number];
}

const sign = (a: number, b: number) => (a < b ? "<" : a > b ? ">" : "=");

export function compareNumbers(id: string, ranges: Ranges): GeneratorDefinition<CompareParams> {
  return {
    id,
    version: "1.0.0",
    depths: [1, 2, 4],
    misconceptions: ["NPV.COMPARE.SIGN-DIRECTION", "NPV.COMPARE.FIRST-DIGIT"],

    params(rng, numbers) {
      const [lo, hi] = ranges[numbers];
      const a = rng.int(lo, hi);
      // Close numbers that share their first digits are harder to compare.
      const keep = 10 ** Math.max(1, digitCount(a) - 2);
      const b =
        rng.int(0, 5) === 0
          ? a
          : Math.min(hi, Math.max(lo, Math.floor(a / keep) * keep + rng.int(0, keep - 1)));
      const list = Array.from({ length: 4 }, () => rng.int(lo, hi));
      if (new Set(list).size < 4) reject("repeated numbers");
      const size = digitCount(hi);
      const small = 10 ** (size - 1) - rng.int(1, 10 ** (size - 2) - 1);
      const big = 10 ** (size - 1) + rng.int(1, 10 ** (size - 2) - 1);
      if (big > hi * 10) reject("trap too big");
      return { a, b, list, trap: [small, big] };
    },

    build(p, depth, rng): QuestionDraft {
      switch (depth) {
        case 1: {
          const right = sign(p.a, p.b);
          const flipped = right === "<" ? ">" : right === ">" ? "<" : undefined;
          return A.choice({
            rng,
            question: [A.math(`${tex(p.a)} \\; \\square \\; ${tex(p.b)}`)],
            ask: "Which sign goes in the box?",
            correct: A.math(right),
            distractors: (["<", ">", "="] as const)
              .filter((s) => s !== right)
              .map((s) => ({
                content: A.math(s),
                ...(s === flipped
                  ? {
                      code: "NPV.COMPARE.SIGN-DIRECTION",
                      feedback: "The open side of the sign faces the bigger number.",
                    }
                  : { feedback: "Compare the digits from the left, place by place." }),
              })),
            solution: [
              {
                say: `Compare from the biggest place: ${fmt(p.a)} ${right === "<" ? "is less than" : right === ">" ? "is greater than" : "equals"} ${fmt(p.b)}.`,
              },
            ],
          });
        }
        case 2: {
          const up = [...p.list].sort((x, y) => x - y);
          const down = [...up].reverse();
          const byLast = [...p.list].sort((x, y) => (x % 10) - (y % 10) || x - y);
          const options = [byLast, down].filter((o) => o.join() !== up.join());
          return A.choice({
            rng,
            archetype: "varied-form",
            question: ["Here are four numbers: ", A.math(p.list.map(tex).join(",\\ ")), "."],
            ask: "Which list puts them in order, smallest first?",
            correct: up.map(fmt).join(", "),
            distractors: options
              .filter((o, i) => options.findIndex((x) => x.join() === o.join()) === i)
              .map((o) => ({
                content: o.map(fmt).join(", "),
                feedback:
                  o === down
                    ? "That is largest first."
                    : "Compare from the biggest place, not the last digit.",
              })),
            solution: [{ say: `Compare the biggest places first: ${up.map(fmt).join(", ")}.` }],
          });
        }
        default: {
          const [small, big] = p.trap;
          return A.trueOrFalseWhy({
            rng,
            statement: [
              A.math(`${tex(small)} > ${tex(big)}`),
              `, because ${String(small)[0]} is bigger than ${String(big)[0]}.`,
            ],
            truth: false,
            reasons: [
              {
                text: `${fmt(big)} has more digits, so it is bigger: ${fmt(small)} < ${fmt(big)}.`,
                correct: true,
              },
              {
                text: "The number with the bigger first digit is always bigger.",
                code: "NPV.COMPARE.FIRST-DIGIT",
              },
              {
                text: "The sign is the wrong way round, but the reason is right.",
                code: "NPV.COMPARE.SIGN-DIRECTION",
              },
            ],
            solution: [
              {
                say: `Count the digits first: ${fmt(small)} has ${digitCount(small)}, ${fmt(big)} has ${digitCount(big)}.`,
              },
            ],
          });
        }
      }
    },

    verify(p, question) {
      if (question.archetype === "standard") return chosenText(question) === sign(p.a, p.b);
      if (question.archetype === "varied-form")
        return (
          chosenText(question) ===
          [...p.list]
            .sort((x, y) => x - y)
            .map(fmt)
            .join(", ")
        );
      return p.trap[0] < p.trap[1];
    },
  };
}

// --- reading and writing numbers ---------------------------------------------------------------------

export interface WordsParams {
  n: number;
  set: number[];
}

/** How a number is written if each spoken part is written out in turn: 305 as "3005". */
const asSaid = (n: number) => {
  const parts: number[] = [];
  const th = Math.floor(n / 1000);
  const h = Math.floor((n % 1000) / 100);
  const r = n % 100;
  if (th) parts.push(th * 1000);
  if (h) parts.push(h * 100);
  if (r) parts.push(r);
  return Number(parts.map(String).join(""));
};

/** Read and write numbers in numerals and words, with a zero placeholder at standard and stretch. */
export function numbersInWords(id: string, ranges: Ranges): GeneratorDefinition<WordsParams> {
  return {
    id,
    version: "1.0.0",
    depths: [1, 2, 3],
    misconceptions: ["NPV.PLACE.WRITE-AS-SAID", "NPV.PLACE.ZERO-PLACEHOLDER"],

    params(rng, numbers) {
      const [lo, hi] = ranges[numbers];
      const n = rng.int(lo, hi);
      if (numbers !== "friendly" && !/0/.test(String(n).slice(1)))
        reject("want a zero placeholder");
      if (n % 100 === 0) reject("too round");
      const set = Array.from({ length: 3 }, () => rng.int(lo, hi));
      if (new Set(set).size < 3) reject("repeated numbers");
      return { n, set };
    },

    build(p, depth, rng): QuestionDraft {
      const dropped = Number(String(p.n).replace(/0/g, ""));
      const said = asSaid(p.n);
      switch (depth) {
        case 1: {
          const options = [
            ...(said !== p.n
              ? [
                  {
                    value: said,
                    code: "NPV.PLACE.WRITE-AS-SAID",
                    feedback:
                      "Each place gets one digit; you do not write the zeros of every part you say.",
                  },
                ]
              : []),
            ...(dropped !== p.n
              ? [
                  {
                    value: dropped,
                    code: "NPV.PLACE.ZERO-PLACEHOLDER",
                    feedback: "An empty place still needs a 0.",
                  },
                ]
              : []),
            { value: p.n + 10 ** Math.max(1, digitCount(p.n) - 2) },
            { value: p.n + 10 },
          ].filter(
            (o, i, all) => o.value !== p.n && all.findIndex((x) => x.value === o.value) === i,
          );
          return A.choice({
            rng,
            question: `Read the words: ${numberWords(p.n)}.`,
            ask: "Which number is it?",
            correct: A.math(tex(p.n)),
            distractors: options.slice(0, 3).map((o) => ({
              content: A.math(tex(o.value)),
              ...(o.code ? { code: o.code, feedback: o.feedback } : {}),
            })),
            solution: [{ say: `${numberWords(p.n)} is ${expanded(p.n)} = ${fmt(p.n)}.` }],
          });
        }
        case 2: {
          const others = [dropped, p.n + 10 ** Math.max(1, digitCount(p.n) - 2), p.n + 1].filter(
            (v, i, all) => v !== p.n && all.indexOf(v) === i,
          );
          return A.choice({
            rng,
            archetype: "reverse",
            question: ["Here is a number: ", A.math(tex(p.n)), "."],
            ask: "How do you write it in words?",
            correct: numberWords(p.n),
            distractors: others.slice(0, 3).map((v) => ({
              content: numberWords(v),
              ...(v === dropped
                ? {
                    code: "NPV.PLACE.ZERO-PLACEHOLDER",
                    feedback: "Look at each place, including the empty one with a 0.",
                  }
                : {}),
            })),
            solution: [{ say: `${fmt(p.n)} is written ${numberWords(p.n)}.` }],
          });
        }
        default:
          return A.matchRepresentations({
            rng,
            question: "Match each number to its words.",
            pairs: p.set.map((m) => [A.math(tex(m)), numberWords(m)] as [A.RichInput, A.RichInput]),
            solution: [
              { say: p.set.map((m) => `${fmt(m)} is ${numberWords(m)}`).join("; ") + "." },
            ],
          });
      }
    },

    verify(p, question) {
      if (question.archetype === "standard") return chosenText(question) === tex(p.n);
      if (question.archetype === "reverse") return chosenText(question) === numberWords(p.n);
      return new Set(p.set.map(numberWords)).size === 3;
    },
  };
}

// --- counting in steps ---------------------------------------------------------------------------------

export interface StepParams {
  step: number;
  k: number;
  /** Depth 4: the number claimed, and whether it is a multiple. */
  claimed: number;
}

export function countInSteps(
  id: string,
  steps: Record<Numbers, number[]>,
): GeneratorDefinition<StepParams> {
  return {
    id,
    version: "1.0.0",
    depths: [1, 2, 4],
    misconceptions: ["NPV.SEQUENCE.STEP-ONE"],

    params(rng, numbers) {
      const step = rng.pick(steps[numbers]);
      const k = rng.int(3, 9);
      const multiple = rng.bool();
      const m = rng.int(6, 15);
      const claimed = multiple ? step * m : step * m + rng.int(1, step - 1 || 1);
      if (!multiple && step === 1) reject("every number is a multiple of 1");
      return { step, k, claimed };
    },

    build(p, depth, rng): QuestionDraft {
      const seq = Array.from({ length: p.k }, (_, i) => i * p.step);
      const next = p.k * p.step;
      switch (depth) {
        case 1:
          return A.standard({
            question: [
              "Count in ",
              A.math(tex(p.step)),
              "s from 0: ",
              A.math(seq.map(tex).join(",\\ ")),
              ", …",
            ],
            ask: "What number comes next?",
            answer: A.number(next),
            wrong: wrongs(next, [
              {
                code: "NPV.SEQUENCE.STEP-ONE",
                value: A.number(next - p.step + 1),
                feedback: `Each number is ${fmt(p.step)} more than the one before.`,
              },
            ]),
            solution: [{ say: `${fmt(seq.at(-1) ?? 0)} + ${fmt(p.step)} = ${fmt(next)}.` }],
          });
        case 2: {
          const at = rng.int(2, 4);
          return A.missingValue({
            intro: `Count in ${fmt(p.step)}s. What number is missing?`,
            relation: [
              0,
              ",",
              p.step,
              ",",
              2 * p.step,
              ",",
              3 * p.step,
              ",",
              4 * p.step,
              ",",
              5 * p.step,
            ],
            hide: 2 * at,
            wrong: [
              {
                code: "NPV.SEQUENCE.STEP-ONE",
                value: A.number((at - 1) * p.step + 1),
                feedback: `Add ${fmt(p.step)} each time, not 1.`,
              },
            ],
            solution: [
              {
                say: `Add ${fmt(p.step)} each time: ${[0, 1, 2, 3, 4, 5].map((i) => fmt(i * p.step)).join(", ")}.`,
              },
            ],
          });
        }
        default: {
          const truth = p.claimed % p.step === 0;
          return A.trueOrFalseWhy({
            rng,
            statement: [
              "If you count in ",
              A.math(tex(p.step)),
              "s from 0, you will say ",
              A.math(tex(p.claimed)),
              ".",
            ],
            truth,
            reasons: truth
              ? [
                  {
                    text: `${fmt(p.claimed)} = ${fmt(p.claimed / p.step)} × ${fmt(p.step)}, so it is in the count.`,
                    correct: true,
                  },
                  { text: "Only numbers below 50 are said." },
                  { text: `You never say it, because it is not a multiple of ${fmt(p.step)}.` },
                ]
              : [
                  {
                    text: `${fmt(p.claimed)} is not a multiple of ${fmt(p.step)}: the count goes ${fmt(Math.floor(p.claimed / p.step) * p.step)}, ${fmt((Math.floor(p.claimed / p.step) + 1) * p.step)}.`,
                    correct: true,
                  },
                  {
                    text: "If you keep counting you say every number.",
                    code: "NPV.SEQUENCE.STEP-ONE",
                  },
                  { text: "Only if you start from 1." },
                ],
            solution: [
              { say: `Counting in ${fmt(p.step)}s from 0 says only multiples of ${fmt(p.step)}.` },
            ],
          });
        }
      }
    },

    verify(p, question) {
      if (question.archetype === "standard")
        return numberAnswer(question) % p.step === 0 && numberAnswer(question) === p.k * p.step;
      if (question.archetype === "missing-value") return numberAnswer(question) % p.step === 0;
      return true;
    },
  };
}

// --- n more or less ------------------------------------------------------------------------------------

export interface MoreLessParams {
  n: number;
  amount: number;
  way: "more" | "less";
  /** Depth 4: the claim is right, or changes the wrong place. */
  right: boolean;
}

export function moreOrLess(
  id: string,
  ranges: Ranges,
  amounts: Record<Numbers, number[]>,
): GeneratorDefinition<MoreLessParams> {
  return {
    id,
    version: "1.0.0",
    depths: [1, 2, 4],
    misconceptions: ["NPV.PLACE.TENS-ONES-MIXUP"],

    params(rng, numbers) {
      const [lo, hi] = ranges[numbers];
      const amount = rng.pick(amounts[numbers]);
      const n = rng.int(lo, hi);
      const way = rng.pick(["more", "less"] as const);
      if (way === "less" && n - amount < 0) reject("negative");
      // Stretch crosses a boundary: the digit in that place is 9 (more) or 0 (less).
      if (numbers === "stretch" && digitAt(n, Math.log10(amount)) !== (way === "more" ? 9 : 0))
        reject("want a boundary");
      return { n, amount, way, right: rng.bool() };
    },

    build(p, depth, rng): QuestionDraft {
      const d = p.way === "more" ? 1 : -1;
      const answer = p.n + d * p.amount;
      const shifted = [p.n + (d * p.amount) / 10, p.n + d * p.amount * 10].filter(
        (v) => Number.isInteger(v) && v >= 0,
      );
      const wrong = wrongs(
        answer,
        shifted.map((v) => ({
          code: "NPV.PLACE.TENS-ONES-MIXUP",
          value: A.number(v),
          feedback: `${fmt(p.amount)} ${p.way} changes the ${PLACE_NAMES[Math.log10(p.amount)]} digit.`,
        })),
      );
      switch (depth) {
        case 1:
          return A.standard({
            question: ["Think about ", A.math(tex(p.n)), "."],
            ask: ["What is ", A.math(tex(p.amount)), ` ${p.way} than `, A.math(tex(p.n)), "?"],
            answer: A.number(answer),
            wrong,
            solution: [
              {
                say: `${fmt(p.amount)} ${p.way} changes the ${PLACE_NAMES[Math.log10(p.amount)]}: ${fmt(p.n)} ${d > 0 ? "+" : "−"} ${fmt(p.amount)} = ${fmt(answer)}.`,
              },
            ],
          });
        case 2:
          return A.variedForm({
            rng,
            forms: [
              {
                question: [
                  "A number is ",
                  A.math(tex(p.amount)),
                  ` ${p.way} than `,
                  A.math(tex(p.n)),
                  ".",
                ],
                ask: "What is the number?",
              },
              {
                question: [A.math(`${tex(p.n)} ${d > 0 ? "+" : "-"} ${tex(p.amount)}`)],
                ask: "Work it out.",
              },
            ],
            answer: A.number(answer),
            wrong,
            solution: [
              { say: `${fmt(p.n)} ${d > 0 ? "+" : "−"} ${fmt(p.amount)} = ${fmt(answer)}.` },
            ],
          });
        default: {
          const claimed = p.right ? answer : (shifted[0] ?? answer + 1);
          return A.trueOrFalseWhy({
            rng,
            statement: [
              "Mo says ",
              A.math(tex(p.amount)),
              ` ${p.way} than `,
              A.math(tex(p.n)),
              " is ",
              A.math(tex(claimed)),
              ".",
            ],
            truth: claimed === answer,
            reasons:
              claimed === answer
                ? [
                    {
                      text: `Changing the ${PLACE_NAMES[Math.log10(p.amount)]} by one gives ${fmt(answer)}${digitAt(p.n, Math.log10(p.amount)) === (d > 0 ? 9 : 0) ? ", crossing into the next place" : ""}.`,
                      correct: true,
                    },
                    { text: "Only the last digit changes.", code: "NPV.PLACE.TENS-ONES-MIXUP" },
                    { text: "The number of digits must stay the same." },
                  ]
                : [
                    {
                      text: `That changes the wrong place. ${fmt(p.amount)} ${p.way} is ${fmt(answer)}.`,
                      correct: true,
                    },
                    {
                      text: `${fmt(p.amount)} ${p.way} changes the next place along.`,
                      code: "NPV.PLACE.TENS-ONES-MIXUP",
                    },
                    { text: "Both are right; they mean the same." },
                  ],
            solution: [
              { say: `${fmt(p.n)} ${d > 0 ? "+" : "−"} ${fmt(p.amount)} = ${fmt(answer)}.` },
            ],
          });
        }
      }
    },

    verify(p, question) {
      const answer = p.n + (p.way === "more" ? p.amount : -p.amount);
      if (question.archetype === "true-or-false-why") return answer >= 0;
      return numberAnswer(question) === answer;
    },
  };
}

// --- number lines -------------------------------------------------------------------------------------

export interface LineParams {
  n: number;
}

export interface LineScale {
  max: number;
  /** Labelled step. */
  major: number;
  /** Divisions between labels. */
  minor: number;
}

const arrowLine = (value: number, s: LineScale, marked = true): NumberLineSpec => ({
  type: "number-line",
  min: 0,
  max: s.max,
  step: marked ? s.major : s.max,
  ...(marked && s.minor > 1 ? { minor: s.minor } : {}),
  points: [{ value, style: "arrow" }],
  description: marked
    ? `A number line from 0 to ${fmt(s.max)}, labelled every ${fmt(s.major)}, with an arrow at a number.`
    : `A number line from 0 to ${fmt(s.max)} with no marks between the ends, and an arrow at a number.`,
});

const arrowAt = (spec: unknown) => (spec as NumberLineSpec | undefined)?.points?.[0]?.value;

export function numberLines(
  id: string,
  scales: Record<Numbers, LineScale>,
): GeneratorDefinition<LineParams> {
  const scaleFor = (n: number) =>
    Object.values(scales).find((s) => n <= s.max && n % (s.major / s.minor) === 0) ??
    scales.standard;
  return {
    id,
    version: "1.0.0",
    depths: [1, 2, 3],
    misconceptions: ["NPV.NUMBERLINE.COUNT-TICKS"],

    params(rng, numbers) {
      const s = scales[numbers];
      const tick = s.major / s.minor;
      const n = rng.int(1, s.max / tick - 1) * tick;
      if (n % s.major === 0) reject("labelled numbers are too easy");
      return { n };
    },

    build(p, depth, rng): QuestionDraft {
      const s = scaleFor(p.n);
      const tick = s.major / s.minor;
      const base = Math.floor(p.n / s.major) * s.major;
      switch (depth) {
        case 1:
          return A.standard({
            question: [
              `Look at the number line. Each small division is ${fmt(tick)}.`,
              A.figure(arrowLine(p.n, s)),
            ],
            ask: "What number is the arrow pointing to?",
            answer: A.number(p.n),
            wrong: wrongs(p.n, [
              {
                code: "NPV.NUMBERLINE.COUNT-TICKS",
                value: A.number(base + (p.n - base) / tick),
                feedback: `Each small division is worth ${fmt(tick)}, not 1.`,
              },
            ]),
            solution: [
              {
                say: `Start at ${fmt(base)} and count on ${(p.n - base) / tick} divisions of ${fmt(tick)}: ${fmt(p.n)}.`,
              },
            ],
          });
        case 2:
          return A.standard({
            question: [
              `This number line goes from 0 to ${fmt(s.max)}.`,
              A.figure(arrowLine(p.n, s, false)),
            ],
            ask: "Estimate the number the arrow is pointing to.",
            answer: A.number(p.n, { accuracy: { tolerance: s.max / 16 } }),
            solution: [
              {
                say: `Use halfway (${fmt(s.max / 2)}) and the ends to judge. The arrow is at ${fmt(p.n)}; anything close is a good estimate.`,
              },
            ],
          });
        default: {
          const others = [p.n + s.major, p.n - s.major, p.n + tick]
            .filter((m) => m > 0 && m < s.max && m !== p.n)
            .slice(0, 2);
          return A.chooseTheDiagram({
            rng,
            question: ["Which number line shows ", A.math(tex(p.n)), "?"],
            ask: "Choose the number line.",
            correct: arrowLine(p.n, s),
            distractors: others.map((m) => ({
              figure: arrowLine(m, s),
              feedback: `That arrow points to ${fmt(m)}.`,
            })),
            solution: [
              { say: `Find ${fmt(base)}, then count on in ${fmt(tick)}s to ${fmt(p.n)}.` },
            ],
          });
        }
      }
    },

    verify(p, question) {
      if (question.archetype === "choose-the-diagram")
        return arrowAt(chosenFigure(question)) === p.n;
      return numberAnswer(question) === arrowAt(question.diagrams[0]);
    },
  };
}

// --- rounding ------------------------------------------------------------------------------------------

export interface RoundParams {
  n: number;
  place: number;
  /** Depth 4: a number exactly halfway between multiples of `place`. */
  half: number;
}

const roundTo = (n: number, p: number) => Math.round(n / p) * p;

export function rounding(
  id: string,
  ranges: Ranges,
  places: Record<Numbers, number[]>,
): GeneratorDefinition<RoundParams> {
  return {
    id,
    version: "1.0.0",
    depths: [1, 2, 4],
    misconceptions: ["NPV.ROUND.ALWAYS-DOWN", "NPV.ROUND.HALFWAY", "NPV.ROUND.WRONG-PLACE"],

    params(rng, numbers) {
      const [lo, hi] = ranges[numbers];
      const place = rng.pick(places[numbers]);
      const n = rng.int(Math.max(lo, place + 1), hi);
      if (n % place === 0 || n % place === place / 2) reject("not a rounding question");
      // Round up about half the time, so rounding down every time does not pass.
      const half =
        rng.int(Math.max(1, Math.floor(lo / place)), Math.max(1, Math.floor(hi / place))) * place +
        place / 2;
      return { n, place, half };
    },

    build(p, depth, rng): QuestionDraft {
      const answer = roundTo(p.n, p.place);
      const down = Math.floor(p.n / p.place) * p.place;
      const up = down + p.place;
      const wrong = wrongs(answer, [
        ...(down !== answer
          ? [
              {
                code: "NPV.ROUND.ALWAYS-DOWN",
                value: A.number(down),
                feedback: `Look at the next digit: ${fmt(p.n)} is nearer ${fmt(up)}.`,
              },
            ]
          : []),
        ...(p.place >= 100 && roundTo(p.n, p.place / 10) !== answer
          ? [
              {
                code: "NPV.ROUND.WRONG-PLACE",
                value: A.number(roundTo(p.n, p.place / 10)),
                feedback: `That is to the nearest ${fmt(p.place / 10)}. Round to the nearest ${fmt(p.place)}.`,
              },
            ]
          : []),
      ]);
      switch (depth) {
        case 1:
          return A.standard({
            question: ["Round ", A.math(tex(p.n)), " to the nearest ", A.math(tex(p.place)), "."],
            answer: A.number(answer),
            wrong,
            solution: [
              {
                say: `${fmt(p.n)} is between ${fmt(down)} and ${fmt(up)}; it is nearer ${fmt(answer)}.`,
              },
            ],
          });
        case 2:
          return A.variedForm({
            rng,
            forms: [
              {
                question: [
                  "The arrow shows ",
                  A.math(tex(p.n)),
                  ".",
                  A.figure({
                    type: "number-line",
                    min: down,
                    max: up,
                    step: p.place / 10,
                    labels: "ends",
                    points: [{ value: p.n, style: "arrow", label: tex(p.n) }],
                  }),
                ],
                ask: ["Which multiple of ", A.math(tex(p.place)), " is it nearest to?"],
              },
              {
                question: [
                  "A crowd of ",
                  A.math(tex(p.n)),
                  " people is given to the nearest ",
                  A.math(tex(p.place)),
                  ".",
                ],
                ask: "What number is given?",
              },
            ],
            answer: A.number(answer),
            wrong,
            solution: [
              {
                say: `Halfway between ${fmt(down)} and ${fmt(up)} is ${fmt(down + p.place / 2)}; ${fmt(p.n)} is ${p.n > down + p.place / 2 ? "above" : "below"} it, so it rounds to ${fmt(answer)}.`,
              },
            ],
          });
        default: {
          const low = p.half - p.place / 2;
          return A.trueOrFalseWhy({
            rng,
            statement: [
              "Ben says ",
              A.math(tex(p.half)),
              " to the nearest ",
              A.math(tex(p.place)),
              " is ",
              A.math(tex(low)),
              ", because it is exactly in the middle.",
            ],
            truth: false,
            reasons: [
              {
                text: `A number exactly halfway rounds up: ${fmt(p.half)} rounds to ${fmt(low + p.place)}.`,
                correct: true,
              },
              { text: "Halfway numbers round down.", code: "NPV.ROUND.HALFWAY" },
              {
                text: "You always round down by cutting off digits.",
                code: "NPV.ROUND.ALWAYS-DOWN",
              },
            ],
            solution: [
              { say: `By convention, halfway rounds up: ${fmt(p.half)} → ${fmt(low + p.place)}.` },
            ],
          });
        }
      }
    },

    verify(p, question) {
      if (question.archetype === "true-or-false-why") return p.half % p.place === p.place / 2;
      return (
        numberAnswer(question) === Math.round(p.n / p.place) * p.place &&
        Math.abs(numberAnswer(question) - p.n) <= p.place / 2
      );
    },
  };
}

// --- negative numbers -------------------------------------------------------------------------------

export interface NegativeParams {
  /** Step for counting back. */
  step: number;
  /** Where counting back starts (positive). */
  start: number;
  /** A negative number to read or compare. */
  m: number;
  /** A second negative, for the comparing claim. */
  other: number;
}

export function negatives(
  id: string,
  ranges: Ranges,
  steps: Record<Numbers, number[]>,
): GeneratorDefinition<NegativeParams> {
  return {
    id,
    version: "1.0.0",
    depths: [1, 2, 3, 4],
    misconceptions: ["NPV.NEGATIVE.MIRROR", "NPV.NEGATIVE.ORDER"],

    params(rng, numbers) {
      const [lo, hi] = ranges[numbers];
      const step = rng.pick(steps[numbers]);
      const start = step * rng.int(2, 3);
      const m = -rng.int(1, Math.max(2, -lo));
      const other = -rng.int(1, Math.max(2, -lo));
      if (m === other || -m > hi * 2) reject("need two different negatives");
      return { step, start, m, other };
    },

    build(p, depth, rng): QuestionDraft {
      switch (depth) {
        case 1: {
          const shown = Array.from(
            { length: p.start / p.step + 1 },
            (_, i) => p.start - i * p.step,
          );
          const next = (shown.at(-1) ?? 0) - p.step;
          return A.standard({
            question: [
              "Count back in ",
              A.math(tex(p.step)),
              "s: ",
              A.math(shown.map(tex).join(",\\ ")),
              ", …",
            ],
            ask: "What number comes next?",
            answer: A.number(next),
            wrong: wrongs(next, [
              {
                code: "NPV.NEGATIVE.MIRROR",
                value: A.number(-next),
                feedback:
                  "Below zero the numbers are negative and keep getting smaller: −1, −2, −3, …",
              },
            ]),
            solution: [
              {
                say: `Past zero, keep counting back into the negatives: 0 − ${fmt(p.step)} = ${fmt(next)}.`,
              },
            ],
          });
        }
        case 2: {
          const span = Math.max(10, Math.ceil(-p.m / 5) * 5);
          return A.standard({
            question: [
              "Look at the number line.",
              A.figure({
                type: "number-line",
                min: -span,
                max: span,
                // Labels every 5 up to ±20, every 10 beyond, with a tick for every whole number.
                step: span > 20 ? 10 : span >= 20 ? 5 : 1,
                ...(span > 20 ? { minor: 10 } : span >= 20 ? { minor: 5 } : {}),
                labels:
                  span >= 20
                    ? "all"
                    : [
                        { value: -span, label: tex(-span) },
                        { value: 0, label: "0" },
                        { value: span, label: tex(span) },
                      ],
                points: [{ value: p.m, style: "arrow" }],
                description: "A number line through zero with an arrow at a number.",
              }),
            ],
            ask: "What number is the arrow pointing to?",
            answer: A.number(p.m),
            wrong: wrongs(p.m, [
              {
                code: "NPV.NEGATIVE.MIRROR",
                value: A.number(-p.m),
                feedback: "Numbers to the left of zero are negative.",
              },
            ]),
            solution: [
              {
                say: `The arrow is ${fmt(-p.m)} to the left of zero, so it points to ${fmt(p.m)}.`,
              },
            ],
          });
        }
        case 3: {
          const colder = Math.min(p.m, p.other);
          const warmer = Math.max(p.m, p.other);
          return A.choice({
            rng,
            archetype: "varied-form",
            question: [
              `At midnight it was ${fmt(p.m)}°C in one town and ${fmt(p.other)}°C in another.`,
            ],
            ask: "Which temperature is colder?",
            correct: `${fmt(colder)}°C`,
            distractors: [
              {
                content: `${fmt(warmer)}°C`,
                code: "NPV.NEGATIVE.ORDER",
                feedback:
                  "The further below zero, the colder: compare how far each is from zero, below it.",
              },
              { content: "They are the same temperature" },
            ],
            solution: [
              {
                say: `${fmt(colder)} is further below zero than ${fmt(warmer)}, so ${fmt(colder)}°C is colder.`,
              },
            ],
          });
        }
        default: {
          const lower = Math.min(p.m, p.other);
          const higher = Math.max(p.m, p.other);
          return A.trueOrFalseWhy({
            rng,
            statement: [
              A.math(`${tex(lower)} > ${tex(higher)}`),
              `, because ${fmt(-lower)} is bigger than ${fmt(-higher)}.`,
            ],
            truth: false,
            reasons: [
              {
                text: `${fmt(lower)} is further left on the number line, so it is smaller: ${fmt(lower)} < ${fmt(higher)}.`,
                correct: true,
              },
              {
                text: "With negative numbers, the bigger digit means the bigger number.",
                code: "NPV.NEGATIVE.ORDER",
              },
              { text: "Negative numbers cannot be compared." },
            ],
            solution: [
              {
                say: `On a number line ${fmt(lower)} is left of ${fmt(higher)}, so ${fmt(lower)} < ${fmt(higher)}.`,
              },
            ],
          });
        }
      }
    },

    verify(p, question) {
      if (question.archetype === "standard" && question.diagrams.length > 0)
        return numberAnswer(question) === arrowAt(question.diagrams[0]);
      // Counting back from start to 0, the next number is one step below zero.
      if (question.archetype === "standard")
        return numberAnswer(question) === -p.step && p.start % p.step === 0;
      if (question.archetype === "varied-form")
        return chosenText(question) === `${fmt(Math.min(p.m, p.other))}°C`;
      return p.m !== p.other;
    },
  };
}

// --- Roman numerals ------------------------------------------------------------------------------------

const ROMAN: [number, string][] = [
  [1000, "M"],
  [900, "CM"],
  [500, "D"],
  [400, "CD"],
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

export function toRoman(n: number): string {
  let left = n;
  let out = "";
  for (const [v, s] of ROMAN)
    while (left >= v) {
      out += s;
      left -= v;
    }
  return out;
}

const SYMBOL: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
/** Reading every symbol as added: the subtractive misconception. */
const addAll = (r: string) => [...r].reduce((s, c) => s + (SYMBOL[c] ?? 0), 0);
/** Writing 4 as IIII and 9 as VIIII: the same misconception the other way. */
const additive = (n: number) => {
  let left = n;
  let out = "";
  for (const [v, s] of [
    [1000, "M"],
    [500, "D"],
    [100, "C"],
    [50, "L"],
    [10, "X"],
    [5, "V"],
    [1, "I"],
  ] as [number, string][])
    while (left >= v) {
      out += s;
      left -= v;
    }
  return out;
};

export interface RomanParams {
  n: number;
  set: number[];
  claim: number;
}

export function romanNumerals(id: string, ranges: Ranges): GeneratorDefinition<RomanParams> {
  return {
    id,
    version: "1.0.0",
    depths: [1, 2, 3, 4],
    misconceptions: ["NPV.ROMAN.SUBTRACTIVE"],

    params(rng, numbers) {
      const [lo, hi] = ranges[numbers];
      const n = rng.int(lo, hi);
      if (numbers !== "friendly" && !/IV|IX|XL|XC|CD|CM/.test(toRoman(n)))
        reject("want a subtractive pair");
      const set = Array.from({ length: 3 }, () => rng.int(lo, hi));
      if (new Set(set).size < 3) reject("repeats");
      return { n, set, claim: rng.int(0, 1) };
    },

    build(p, depth, rng): QuestionDraft {
      const r = toRoman(p.n);
      switch (depth) {
        case 1: {
          const misread = addAll(r);
          const others = [misread, p.n + 10, p.n - 1].filter(
            (v, i, all) => v !== p.n && v > 0 && all.indexOf(v) === i,
          );
          return A.choice({
            rng,
            question: `What number is the Roman numeral ${r}?`,
            correct: A.math(tex(p.n)),
            distractors: others.map((v) => ({
              content: A.math(tex(v)),
              ...(v === misread
                ? {
                    code: "NPV.ROMAN.SUBTRACTIVE",
                    feedback:
                      "A smaller numeral before a bigger one is taken away: IV is 4, XC is 90.",
                  }
                : {}),
            })),
            solution: [
              {
                say: `${r} is ${fmt(p.n)}: read left to right, taking away a smaller numeral that comes before a bigger one.`,
              },
            ],
          });
        }
        case 2: {
          const wrongForm = additive(p.n);
          const others = [wrongForm, toRoman(p.n + 1), toRoman(p.n + 10)].filter(
            (v, i, all) => v !== r && all.indexOf(v) === i,
          );
          return A.choice({
            rng,
            archetype: "reverse",
            question: ["Write ", A.math(tex(p.n)), " in Roman numerals."],
            correct: r,
            distractors: others.map((v) => ({
              content: v,
              ...(v === wrongForm
                ? {
                    code: "NPV.ROMAN.SUBTRACTIVE",
                    feedback:
                      "Roman numerals never use four of the same symbol: 4 is IV and 9 is IX.",
                  }
                : {}),
            })),
            solution: [{ say: `${fmt(p.n)} = ${r}.` }],
          });
        }
        case 3:
          return A.matchRepresentations({
            rng,
            question: "Match each Roman numeral to its number.",
            pairs: p.set.map((m) => [toRoman(m), A.math(tex(m))] as [A.RichInput, A.RichInput]),
            solution: [{ say: p.set.map((m) => `${toRoman(m)} = ${m}`).join("; ") + "." }],
          });
        default: {
          const claims = [
            {
              statement: "Roman numerals have a symbol for zero.",
              truth: false,
              reasons: [
                {
                  text: "They have no zero and no place value; our system added both, which makes big numbers easier to write.",
                  correct: true,
                },
                { text: "Yes: O is the Roman numeral for zero." },
                { text: "Yes, otherwise they could not write 10.", code: "NPV.ROMAN.SUBTRACTIVE" },
              ],
            },
            {
              statement: `${toRoman(p.n)} and ${additive(p.n)} are both correct ways to write ${p.n}.`,
              truth: additive(p.n) === toRoman(p.n),
              reasons:
                additive(p.n) === toRoman(p.n)
                  ? [
                      { text: "They are the same numeral here.", correct: true },
                      { text: "Only the shorter one is correct." },
                      { text: "Neither: you must always subtract.", code: "NPV.ROMAN.SUBTRACTIVE" },
                    ]
                  : [
                      {
                        text: `Only ${toRoman(p.n)} is correct: the same symbol is never used four times in a row.`,
                        correct: true,
                      },
                      {
                        text: "Both are right because both add up to the number.",
                        code: "NPV.ROMAN.SUBTRACTIVE",
                      },
                      { text: `Only ${additive(p.n)} is correct, because it is longer.` },
                    ],
            },
          ];
          const c = claims[p.claim] ?? claims[0];
          return A.trueOrFalseWhy({
            rng,
            statement: c?.statement ?? "",
            truth: c?.truth ?? false,
            reasons: c?.reasons ?? [],
            solution: [{ say: c?.reasons[0]?.text ?? "" }],
          });
        }
      }
    },

    verify(p, question) {
      const value = (r: string) =>
        [...r].reduce(
          (s, c, i, all) =>
            (SYMBOL[c] ?? 0) < (SYMBOL[all[i + 1] ?? ""] ?? 0)
              ? s - (SYMBOL[c] ?? 0)
              : s + (SYMBOL[c] ?? 0),
          0,
        );
      if (question.archetype === "standard")
        return chosenText(question) === tex(p.n) && value(toRoman(p.n)) === p.n;
      if (question.archetype === "reverse") return value(chosenText(question)) === p.n;
      return p.set.every((m) => value(toRoman(m)) === m);
    },
  };
}

// --- mixing families -------------------------------------------------------------------------------

type AnyDefinition = GeneratorDefinition<unknown>;

/**
 * One generator from several families, each answering at its own depths: for statements that
 * name two skills, e.g. counting in steps and finding 10 more.
 */
export function mixFamilies(
  id: string,
  // Each family has its own parameter type; any definition will do here.
  byDepth: Partial<Record<Depth, { readonly id: string }>>,
): GeneratorDefinition<unknown[]> {
  const entries = Object.entries(byDepth).map(
    ([d, def]) => [Number(d) as Depth, def as unknown as AnyDefinition] as const,
  );
  const families = [...new Set(entries.map(([, def]) => def))];
  const familyAt = (depth: Depth) => entries.find(([d]) => d === depth)?.[1];
  return {
    id,
    version: "1.0.0",
    depths: entries.map(([d]) => d).sort(),
    misconceptions: [...new Set(families.flatMap((f) => f.misconceptions))],
    params: (rng, numbers) => families.map((f) => f.params(rng, numbers)),
    build(p, depth, rng) {
      const family = familyAt(depth);
      if (!family) return reject(`no family for depth ${depth}`);
      return family.build(p[families.indexOf(family)], depth, rng);
    },
    verify(p, question) {
      const family = familyAt(question.key.depth);
      return family?.verify ? family.verify(p[families.indexOf(family)], question) : true;
    },
  };
}

// --- problems ------------------------------------------------------------------------------------------

export interface ProblemParams {
  n: number;
  other: number;
  amount: number;
  place: number;
  context: { place: string; things: string };
}

const CONTEXTS = [
  { place: "stadium", things: "fans" },
  { place: "library", things: "books" },
  { place: "farm", things: "apples" },
  { place: "museum", things: "visitors" },
  { place: "factory", things: "bottles" },
];

/** Number and practical problems using place value, comparing and rounding together. */
export function numberProblems(
  id: string,
  ranges: Ranges,
  amounts: Record<Numbers, number[]>,
): GeneratorDefinition<ProblemParams> {
  return {
    id,
    version: "1.0.0",
    depths: [1, 2, 5],
    misconceptions: [
      "NPV.PLACE.TENS-ONES-MIXUP",
      "NPV.COMPARE.FIRST-DIGIT",
      "NPV.ROUND.ALWAYS-DOWN",
    ],

    params(rng, numbers) {
      const [lo, hi] = ranges[numbers];
      const amount = rng.pick(amounts[numbers]);
      const n = rng.int(lo, hi);
      const other = rng.int(lo, hi);
      const place = Math.max(10, amount);
      if (n === other || n - amount < 0 || n % place === 0)
        reject("need different, unrounded numbers");
      return { n, other, amount, place, context: rng.pick(CONTEXTS) };
    },

    build(p, depth, rng): QuestionDraft {
      const { place: where, things } = p.context;
      switch (depth) {
        case 1: {
          const answer = p.n + p.amount;
          return A.standard({
            question: `A ${where} has ${fmt(p.n)} ${things}. Then ${fmt(p.amount)} more ${things} arrive.`,
            ask: `How many ${things} are there now?`,
            answer: A.number(answer),
            wrong: wrongs(
              answer,
              [p.n + p.amount / 10, p.n + p.amount * 10].filter(Number.isInteger).map((v) => ({
                code: "NPV.PLACE.TENS-ONES-MIXUP",
                value: A.number(v),
                feedback: `Adding ${fmt(p.amount)} changes the ${PLACE_NAMES[Math.log10(p.amount)]} digit.`,
              })),
            ),
            solution: [{ say: `${fmt(p.n)} + ${fmt(p.amount)} = ${fmt(answer)}.` }],
          });
        }
        case 2: {
          const more = Math.max(p.n, p.other);
          return A.choice({
            rng,
            archetype: "varied-form",
            question: `On Saturday a ${where} had ${fmt(p.n)} ${things}. On Sunday it had ${fmt(p.other)}.`,
            ask: "Which day had more?",
            correct: more === p.n ? "Saturday" : "Sunday",
            distractors: [
              {
                content: more === p.n ? "Sunday" : "Saturday",
                code: "NPV.COMPARE.FIRST-DIGIT",
                feedback:
                  "Compare from the biggest place, checking how many digits each number has.",
              },
              { content: "They are the same" },
            ],
            solution: [{ say: `${fmt(more)} is greater than ${fmt(Math.min(p.n, p.other))}.` }],
          });
        }
        default: {
          const rounded = Math.round(p.n / p.place) * p.place;
          const less = p.n - p.amount;
          return A.multiStepContext({
            context: `A ${where} counts ${fmt(p.n)} ${things} one week.`,
            parts: [
              {
                ask: `A poster gives this number to the nearest ${fmt(p.place)}. What number does it show?`,
                answer: A.number(rounded),
                wrong: wrongs(rounded, [
                  {
                    code: "NPV.ROUND.ALWAYS-DOWN",
                    value: A.number(Math.floor(p.n / p.place) * p.place),
                    feedback: "Look at the next digit to decide whether to round up or down.",
                  },
                ]),
              },
              {
                ask: `The next week there are ${fmt(p.amount)} fewer. How many ${things} is that?`,
                answer: A.number(less),
                wrong: wrongs(less, [
                  {
                    code: "NPV.PLACE.TENS-ONES-MIXUP",
                    value: A.number(p.n - p.amount * 10),
                    feedback: `Taking away ${fmt(p.amount)} changes the ${PLACE_NAMES[Math.log10(p.amount)]} digit.`,
                  },
                ]),
              },
            ],
            solution: [
              { say: `${fmt(p.n)} to the nearest ${fmt(p.place)} is ${fmt(rounded)}.` },
              { say: `${fmt(p.n)} − ${fmt(p.amount)} = ${fmt(less)}.` },
            ],
          });
        }
      }
    },

    verify(p, question) {
      if (question.archetype === "multi-step-context")
        return (
          numberAnswer(question, 0) === Math.round(p.n / p.place) * p.place &&
          numberAnswer(question, 1) === p.n - p.amount
        );
      if (question.archetype === "standard") return numberAnswer(question) === p.n + p.amount;
      return chosenText(question) === (p.n > p.other ? "Saturday" : "Sunday");
    },
  };
}
