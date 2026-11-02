// Variety for reasoning questions. A pupil practising a skill again and again should meet
// different claims with different right answers, not one claim with new numbers: otherwise they
// learn that the answer is "B" rather than why. A generator lists extra claims in a short form
// (text with $…$ for maths, as in concept.ts), some true and some false, or always, sometimes and
// never, and oneOf picks between them and its own question.
import * as A from "@mathsplanner/archetypes";
import type { QuestionDraft, Rng } from "@mathsplanner/core";
import { rich } from "./concept.ts";

/** A wrong reason, and the misconception behind it if it has one. */
export type Wrong = [text: string, code?: string];

/** A statement to judge true or false. */
export interface TrueFalse {
  statement: string;
  truth: boolean;
  /** The right reason, starting "True." or "False.". */
  right: string;
  wrong: Wrong[];
  /** A line for the worked solution; the right reason if not given. */
  say?: string;
}

/** A general claim to judge always, sometimes or never true. */
export interface Sometimes {
  claim: string;
  truth: "always" | "sometimes" | "never";
  /** The right reason, starting "Always.", "Sometimes." or "Never.". */
  right: string;
  wrong: Wrong[];
  say?: string;
}

export type Claim = TrueFalse | Sometimes;

const reasons = (c: Claim) => [
  { text: c.right, correct: true },
  ...c.wrong.map(([text, code]) => (code ? { text, code } : { text })),
];

/** The question for one claim. */
export function judge(rng: Rng, c: Claim): QuestionDraft {
  const solution = [{ say: c.say ?? c.right }];
  return "statement" in c
    ? A.trueOrFalseWhy({
        rng,
        statement: rich(c.statement),
        truth: c.truth,
        reasons: reasons(c),
        solution,
      })
    : A.alwaysSometimesNever({
        rng,
        claim: rich(c.claim),
        truth: c.truth,
        reasons: reasons(c),
        solution,
      });
}

/** One of several questions, chosen by the seed. */
export function oneOf(rng: Rng, makers: readonly (() => QuestionDraft)[]): QuestionDraft {
  return rng.pick(makers)();
}

/** A generator's own question, or one of its extra claims, chosen by the seed. */
export const orClaims = (rng: Rng, own: () => QuestionDraft, claims: readonly Claim[]) =>
  oneOf(rng, [own, ...claims.map((c) => () => judge(rng, c))]);
