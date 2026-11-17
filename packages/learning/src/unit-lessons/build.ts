// Short builders for the screens of a split lesson, so a unit's lessons read as their content:
// each makes an ordinary screen of `types.ts`, with its tag. Right answers are listed first; the
// screens shuffle their options.
import type { Ask, Option, Picture, QuizQuestion, Screen, UnitLesson, Words } from "./types.ts";

/** A wrong option, or a common wrong typed answer, and the nudge for it. */
export type Wrong = [text: Words, feedback: Words];

/** Words or a picture to show with a screen. */
export interface Extra {
  text?: Words;
  picture?: Picture;
}

const extra = (e: Extra = {}) => ({
  ...(e.text !== undefined ? { text: e.text } : {}),
  ...(e.picture ? { picture: e.picture } : {}),
});

const options = (right: Words, why: Words, wrongs: readonly Wrong[]): Option[] => [
  { text: right, correct: true, feedback: why },
  ...wrongs.map(([text, feedback]) => ({ text, feedback })),
];

/** The opening screen: a real problem the pupil can't solve yet. */
export const problem = (title: Words, text: Words[], picture?: Picture): Screen => ({
  kind: "explain",
  tag: "The problem",
  title,
  text,
  ...(picture ? { picture } : {}),
});

/** Words to read, with a picture. */
export const explain = (tag: string, title: Words, text: Words[], picture?: Picture): Screen => ({
  kind: "explain",
  tag,
  title,
  text,
  ...(picture ? { picture } : {}),
});

/** Pick one answer. */
export const choose = (
  tag: string,
  title: Words,
  right: Words,
  why: Words,
  wrongs: readonly Wrong[],
  e?: Extra,
): Screen => ({ kind: "choice", tag, title, ...extra(e), options: options(right, why, wrongs) });

/** Type an answer. */
export const typed = (
  tag: string,
  title: Words,
  answers: string | string[],
  hint: Words,
  done: Words,
  e: Extra & { unit?: string; wrong?: readonly Wrong[] } = {},
): Screen => ({
  kind: "answer",
  tag,
  title,
  ...extra(e),
  answers: typeof answers === "string" ? [answers] : answers,
  ...(e.unit ? { unit: e.unit } : {}),
  ...(e.wrong ? { wrong: e.wrong.map(([answer, feedback]) => ({ answer, feedback })) } : {}),
  hint,
  done,
});

/** A worked example, revealed a line at a time: each line and why it is done. */
export const worked = (
  title: Words,
  question: Words,
  lines: [line: Words, why: Words][],
  done: Words,
  picture?: Picture | undefined,
): Screen => ({
  kind: "worked",
  tag: "Worked example",
  title,
  ...(picture ? { picture } : {}),
  problem: question,
  steps: lines.map(([line, why]) => ({ line, why })),
  done,
});

/** One step: its question, the right choice, a wrong one and its nudge, and the working it adds. */
export type Stage = [prompt: Words, right: Words, wrong: Wrong, then: Words];

/** Work something out a step at a time. */
export const steps = (
  tag: string,
  title: Words,
  start: Words,
  stages: Stage[],
  done: Words,
  picture?: Picture | undefined,
): Screen => ({
  kind: "steps",
  tag,
  title,
  ...(picture ? { picture } : {}),
  start,
  stages: stages.map(([prompt, right, wrong, then]) => ({
    prompt,
    options: options(right, "", [wrong]),
    then,
  })),
  done,
});

/** Spot the wrong line in someone's working. */
export const mistake = (
  text: Words,
  lines: Words[],
  wrong: number,
  why: Words,
  picture?: Picture | undefined,
): Screen => ({
  kind: "mistake",
  tag: "Spot the mistake",
  title: "Where did it go wrong?",
  text,
  ...(picture ? { picture } : {}),
  lines,
  wrong,
  why,
});

/**
 * An exit-check question: its prompt, right answer, other options and why, and (for a lesson
 * with a variation map) the part of the relationship it asks for.
 */
export type Q = [
  prompt: Words,
  answer: Words,
  others: Words[],
  why: Words,
  picture?: Picture | undefined,
  asks?: string,
];

const question = ([prompt, answer, others, why, picture, asks]: Q): QuizQuestion => ({
  prompt,
  ...(asks ? { asks } : {}),
  ...(picture ? { picture } : {}),
  options: [answer, ...others],
  answers: [answer],
  why,
});

/** The exit check: each question with the one like it that comes back after a wrong answer. */
export const quiz = (pairs: [Q, Q][]): Screen => ({
  kind: "quiz",
  tag: "Exit check",
  title: "Check you've got it",
  questions: pairs.map(([q, retry]) => ({ ...question(q), retry: question(retry) })),
});

/** A lesson in a unit, just before one of its skills. */
export const lesson = (
  unit: string,
  slug: string,
  before: string,
  title: Words,
  summary: Words,
  screens: Screen[],
): UnitLesson => ({ unit, id: `${unit}/${slug}`, before, title, summary, screens });

// The learning stage with variation (docs/proposals/lesson-variation.md).

/** The method card: two to four short steps, worded the same wherever the method appears. */
export const methodCard = (title: Words, method: Words[], picture?: Picture): Screen => ({
  kind: "explain",
  tag: "Method",
  title,
  text: method,
  numbered: true,
  ...(picture ? { picture } : {}),
});

/** A prediction to make before answering: the question, the right expectation and why, and others. */
export type Expect = [question: Words, right: Words, why: Words, wrongs: readonly Wrong[]];

/** What else a short question can carry. */
export interface AskExtra {
  /** What changed from the question before. */
  changed?: Words;
  /** Reflect, expect, check: a prediction first. */
  expect?: Expect;
  /** The part of the relationship it asks for. */
  asks?: string;
  /** Answers to choose from (besides the right one), instead of typing. */
  others?: Words[];
  unit?: string;
  picture?: Picture;
}

/** One short question for a set or a pair: prompt, accepted answers, a nudge, and why. */
export const ask = (
  prompt: Words,
  answers: string | string[],
  hint: Words,
  why: Words,
  e: AskExtra = {},
): Ask => {
  const accepted = typeof answers === "string" ? [answers] : answers;
  return {
    prompt,
    ...(e.picture ? { picture: e.picture } : {}),
    ...(e.changed ? { changed: e.changed } : {}),
    ...(e.expect
      ? {
          expect: {
            question: e.expect[0],
            options: options(e.expect[1], e.expect[2], e.expect[3]),
          },
        }
      : {}),
    ...(e.asks ? { asks: e.asks } : {}),
    answers: accepted,
    ...(e.others ? { options: [accepted[0] ?? "", ...e.others] } : {}),
    ...(e.unit ? { unit: e.unit } : {}),
    hint,
    why,
  };
};

/** A worked example with a question just like it underneath. */
export const pair = (
  title: Words,
  example: { problem: Words; lines: [line: Words, why: Words][]; picture?: Picture },
  question: Ask,
  done: Words,
  text?: Words,
): Screen => ({
  kind: "pair",
  tag: "Example and try",
  title,
  ...(text !== undefined ? { text } : {}),
  example: {
    problem: example.problem,
    ...(example.picture ? { picture: example.picture } : {}),
    steps: example.lines.map(([line, why]) => ({ line, why })),
  },
  question,
  done,
});

/** A faded example: the first steps shown done, then the pupil does the rest a step at a time. */
export const fade = (
  title: Words,
  start: Words,
  given: Words[],
  stages: Stage[],
  done: Words,
  picture?: Picture | undefined,
): Screen => ({
  kind: "steps",
  tag: "Finish it",
  title,
  ...(picture ? { picture } : {}),
  start,
  stages: [
    ...given.map((then) => ({
      prompt: "",
      options: [{ text: then, correct: true as const, feedback: "" }],
      then,
      given: true as const,
    })),
    ...stages.map(([prompt, right, wrong, then]) => ({
      prompt,
      options: options(right, "", [wrong]),
      then,
    })),
  ],
  done,
});

/** Several short questions on one screen: one thing changed each time, or the unknown moved. */
export const questionSet = (
  tag: string,
  title: Words,
  items: Ask[],
  done: Words,
  e?: Extra,
): Screen => ({ kind: "set", tag, title, ...extra(e), items, done });
