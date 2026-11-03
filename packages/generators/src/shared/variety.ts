// Variety for reasoning questions. A pupil practising a skill again and again should meet
// different claims with different right answers, not one claim with new numbers: otherwise they
// learn that the answer is "B" rather than why. A generator lists extra claims in a short form
// (text with $…$ for maths, as in concept.ts), some true and some false, or always, sometimes and
// never, and oneOf picks between them and its own question.
import * as A from "@mathsplanner/archetypes";
import type { Depth, GeneratorDefinition, QuestionDraft, Rng } from "@mathsplanner/core";
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

/** A version with its minor number one higher, as when a generator's questions change. */
const nextMinor = (version: string) => {
  const [major = "1", minor = "0"] = version.split(".");
  return `${major}.${Number(minor) + 1}.0`;
};

/**
 * A generator built from another (a shared family, or a parent statement's generator) with extra
 * claims at depth 4: there, each seed asks its own question or one of the claims. The claims can
 * depend on the params. Its version's minor number goes up, as its depth 4 questions change.
 */
export function withClaims<P>(
  def: GeneratorDefinition<P>,
  claims: readonly Claim[] | ((p: P) => readonly Claim[]),
  depth: Depth = 4,
): GeneratorDefinition<P> {
  const { verify } = def;
  return {
    ...def,
    version: nextMinor(def.version),
    build: (p, d, rng) =>
      d === depth
        ? orClaims(
            rng,
            () => def.build(p, d, rng),
            typeof claims === "function" ? claims(p) : claims,
          )
        : def.build(p, d, rng),
    // A claim has no params to check against; the generator's own question still is.
    ...(verify ? { verify: (p: P, q) => verify(p, q) || q.key.depth === depth } : {}),
  };
}
