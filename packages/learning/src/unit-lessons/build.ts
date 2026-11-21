// Short builders for the screens of a split lesson, so a unit's lessons read as their content:
// each makes an ordinary screen of `types.ts`, with its tag. Right answers are listed first; the
// screens shuffle their options.
import type {
  Ask,
  DrawingPic,
  Explore,
  Option,
  Picture,
  QuizQuestion,
  Screen,
  UnitLesson,
  Variation,
  Words,
  WorkingLine,
} from "./types.ts";

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
export const explain = (
  tag: string,
  title: Words,
  text: Words[],
  picture?: Picture,
  /** An explainer, in Dot's bubble under the text. */
  bubble?: Words,
): Screen => ({
  kind: "explain",
  tag,
  title,
  text,
  ...(picture ? { picture } : {}),
  ...(bubble ? { bubble } : {}),
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
  lines: Line[],
  done: Words,
  picture?: Picture | undefined,
): Screen => ({
  kind: "worked",
  tag: "Worked example",
  title,
  ...(picture ? { picture } : {}),
  problem: question,
  steps: lines.map(lineOf),
  done,
});

/** One step: its question, the right choice, a wrong one and its nudge, and the working it adds. */
export type Stage = [
  prompt: Words,
  right: Words,
  wrong: Wrong,
  then: Words,
  /** The written reason for this line, and Dot's explainer beside it. */
  more?: { reason?: Words; note?: Words },
];

/** A line of working as written in a lesson: [line, why], or its parts by name. */
export type Line = [line: Words, why: Words] | WorkingLine;

const lineOf = (l: Line): WorkingLine => (Array.isArray(l) ? { line: l[0], why: l[1] } : l);

const extraOf = (more: Stage[4]) => ({
  ...(more?.reason ? { reason: more.reason } : {}),
  ...(more?.note ? { note: more.note } : {}),
});

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
  stages: stages.map(([prompt, right, wrong, then, more]) => ({
    prompt,
    options: options(right, "", [wrong]),
    then,
    ...extraOf(more),
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
export const methodCard = (
  title: Words,
  method: Words[],
  picture?: Picture,
  bubble?: Words,
): Screen => ({
  kind: "explain",
  tag: "Method",
  title,
  text: method,
  numbered: true,
  ...(picture ? { picture } : {}),
  ...(bubble ? { bubble } : {}),
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
  example: { problem: Words; lines: Line[]; picture?: Picture },
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
    steps: example.lines.map(lineOf),
  },
  question,
  done,
});

/** A faded example: the first steps shown done, then the pupil does the rest a step at a time. */
export const fade = (
  title: Words,
  start: Words,
  given: (Words | WorkingLine)[],
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
    ...given
      .map((g) => (typeof g === "string" ? { line: g } : g))
      .map((g) => ({
        prompt: "",
        options: [{ text: g.line, correct: true as const, feedback: "" }],
        then: g.line,
        ...extraOf(g),
        given: true as const,
      })),
    ...stages.map(([prompt, right, wrong, then, more]) => ({
      prompt,
      options: options(right, "", [wrong]),
      then,
      ...extraOf(more),
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

/** The screens a redraft replaces: the old learning stage and exit check. */
const REPLACED = new Set(["Worked example", "Together", "Your turn", "Exit check"]);

/**
 * A lesson redrafted with variation. Its own problem, warm-ups, discovery, Watch out, Spot the
 * mistake and Back to the problem stay as they were (less any `drop`ped by title); the method
 * card and the new learning stage go in before Watch out, and the new exit check at the end.
 */
export function redraft(
  original: UnitLesson | undefined,
  plan: {
    method: Words[];
    variation: Variation;
    learning: Screen[];
    exit: Screen;
    picture?: Picture;
    drop?: Words[];
    /**
     * Kept screens to replace, by title (or "tag: title" where two share a title): a
     * diagram-first version of a worded one.
     */
    swap?: Record<Words, Screen>;
    /** Kept screens that may stay words only, by title (or "tag: title"), with the reason. */
    wordsOnly?: Record<Words, Words>;
    /** Screens to put just before the method card, such as an Explore. */
    before?: Screen[];
  },
): UnitLesson {
  if (!original) throw new Error("No lesson to redraft");
  const kept = original.screens
    .filter((s) => !REPLACED.has(s.tag ?? "") && !(plan.drop ?? []).includes(s.title))
    .map((s) => {
      const key = `${s.tag ?? ""}: ${s.title}`;
      const swapped = plan.swap?.[key] ?? plan.swap?.[s.title];
      if (swapped) return swapped;
      const why = plan.wordsOnly?.[key] ?? plan.wordsOnly?.[s.title];
      return why ? { ...s, wordsOnly: why } : s;
    });
  const at = kept.findIndex((s) =>
    ["Watch out", "Spot the mistake", "Back to the problem"].includes(s.tag ?? ""),
  );
  const split = at === -1 ? kept.length : at;
  return {
    ...original,
    method: plan.method,
    variation: plan.variation,
    screens: [
      ...kept.slice(0, split),
      ...(plan.before ?? []),
      methodCard("The method", plan.method, plan.picture),
      ...plan.learning,
      ...kept.slice(split),
      plan.exit,
    ],
  };
}

// Hands-on screens (docs/proposals/lesson-interactive.md).

/** Tap the part of a diagram asked for: one name, or several to tap together. */
export const tap = (
  tag: string,
  title: Words,
  picture: DrawingPic,
  answers: string | string[],
  hint: Words,
  done: Words,
  e: { text?: Words; wrong?: Record<string, Words> } = {},
): Screen => ({
  kind: "tap",
  tag,
  title,
  ...(e.text !== undefined ? { text: e.text } : {}),
  picture,
  answers: typeof answers === "string" ? [answers] : answers,
  ...(e.wrong ? { wrong: e.wrong } : {}),
  hint,
  done,
});

/** A question with one right option: the question, the right one and why, and the others. */
export type Notice = [question: Words, right: Words, why: Words, wrongs: readonly Wrong[]];

/**
 * Explore a diagram before the method: drag it and watch what changes. A prediction can come
 * first; once the pupil has explored, `notice` asks what stayed the same.
 */
export const explore = (
  title: Words,
  scene: Explore["scene"],
  notice: Notice,
  done: Words,
  e: { text?: Words; expect?: Expect; tag?: string } = {},
): Screen => ({
  kind: "explore",
  tag: e.tag ?? "Explore",
  title,
  ...(e.text !== undefined ? { text: e.text } : {}),
  scene,
  ...(e.expect
    ? { expect: { question: e.expect[0], options: options(e.expect[1], e.expect[2], e.expect[3]) } }
    : {}),
  notice: { question: notice[0], options: options(notice[1], notice[2], notice[3]) },
  done,
});

/** One line of a calc screen: the working before the box, its answer, then what follows it. */
export type CalcLine = [
  before: Words,
  answer: string,
  hint: Words,
  more?: { after?: Words; reason?: Words },
];

/** Work it out as in an exercise book: the pupil types the answer on each line in turn. */
export const calc = (
  tag: string,
  title: Words,
  picture: Picture | undefined,
  lines: CalcLine[],
  done: Words,
  e: { text?: Words } = {},
): Screen => ({
  kind: "calc",
  tag,
  title,
  ...(e.text !== undefined ? { text: e.text } : {}),
  ...(picture ? { picture } : {}),
  lines: lines.map(([before, answer, hint, more]) => ({
    before,
    answer,
    hint,
    ...(more?.after ? { after: more.after } : {}),
    ...(more?.reason ? { reason: more.reason } : {}),
  })),
  done,
});

/** The summary: what to remember, with what to write in an exercise book to revise from. */
export const summary = (
  title: Words,
  text: Words[],
  picture: Picture | undefined,
  book: Words[],
  bubble?: Words,
): Screen => ({
  kind: "explain",
  tag: "Summary",
  title,
  text,
  ...(picture ? { picture } : {}),
  book,
  ...(bubble ? { bubble } : {}),
});
