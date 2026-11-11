// Short builders for the screens of a split lesson, so a unit's lessons read as their content:
// each makes an ordinary screen of `types.ts`, with its tag. Right answers are listed first; the
// screens shuffle their options.
import type { Option, Picture, QuizQuestion, Screen, UnitLesson, Words } from "./types.ts";

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
  picture?: Picture,
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
  picture?: Picture,
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
  picture?: Picture,
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

/** An exit-check question: its prompt, right answer, other options and why. */
export type Q = [prompt: Words, answer: Words, others: Words[], why: Words, picture?: Picture];

const question = ([prompt, answer, others, why, picture]: Q): QuizQuestion => ({
  prompt,
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
