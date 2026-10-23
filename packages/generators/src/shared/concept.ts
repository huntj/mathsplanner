// Concept questions for a sub-statement step: a choice question at depths 1 and 2 and a true or
// false claim at depth 4, picked from short lists written for the step. Text may hold inline
// LaTeX between dollar signs, e.g. "Find $|z|$." Used alongside a parent generator's own depths.
import * as A from "@mathsplanner/archetypes";
import type { GeneratorDefinition, QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "./counting.ts";

/** A choice question. Each wrong option is [content, feedback, misconception code?]. */
export interface ConceptChoice {
  question: string;
  ask?: string;
  correct: string;
  wrong: [string, string, string?][];
  /** The worked reasoning shown in the solution. */
  why: string;
}

/** A claim to judge. The first reason is the right one; each wrong reason is [text, code?]. */
export interface ConceptClaim {
  statement: string;
  truth: boolean;
  right: string;
  wrong: [string, string?][];
}

export interface ConceptParams {
  c: number;
  k: number;
}

/** Text with $…$ for maths, as rich input. */
export function rich(s: string): A.RichInput {
  return s
    .split("$")
    .map((part, i) => (i % 2 ? A.math(part) : part))
    .filter((part) => part !== "");
}

/** What chosenText reads back for content written with rich(). */
const plain = (s: string) => s.replace(/\$/g, "");

export function concept(
  id: string,
  misconceptions: string[],
  choices: ConceptChoice[],
  claims: ConceptClaim[],
): GeneratorDefinition<ConceptParams> {
  return {
    id,
    version: "1.0.0",
    depths: [1, 2, 4],
    // Declare every code the questions use, as well as the ones listed.
    misconceptions: [
      ...new Set([
        ...misconceptions,
        ...choices.flatMap((c) => c.wrong.flatMap(([, , code]) => (code ? [code] : []))),
        ...claims.flatMap((k) => k.wrong.flatMap(([, code]) => (code ? [code] : []))),
      ]),
    ],

    params(rng) {
      // A step may only need one kind; an empty list is never asked for.
      return {
        c: rng.int(0, Math.max(0, choices.length - 1)),
        k: rng.int(0, Math.max(0, claims.length - 1)),
      };
    },

    build(p, depth, rng): QuestionDraft {
      if (depth === 4) {
        const k = claims[p.k] ?? claims[0];
        if (!k) throw new Error(`${id} has no claims`);
        return A.trueOrFalseWhy({
          rng,
          statement: rich(k.statement),
          truth: k.truth,
          reasons: [
            { text: k.right, correct: true },
            ...k.wrong.map(([text, code]) => (code ? { text, code } : { text })),
          ],
          solution: [{ say: k.right }],
        });
      }
      const c = choices[p.c] ?? choices[0];
      if (!c) throw new Error(`${id} has no choices`);
      return A.choice({
        rng,
        ...(depth === 2 ? { archetype: "varied-form" as const } : {}),
        question: [rich(c.question)],
        ...(c.ask ? { ask: rich(c.ask) } : {}),
        correct: rich(c.correct),
        distractors: c.wrong.map(([content, feedback, code]) => ({
          content: rich(content),
          feedback,
          ...(code ? { code } : {}),
        })),
        solution: [{ say: rich(c.why) }],
      });
    },

    verify(p, question) {
      if (question.key.depth === 4) return true;
      return chosenText(question) === plain((choices[p.c] ?? choices[0])?.correct ?? "");
    },
  };
}
