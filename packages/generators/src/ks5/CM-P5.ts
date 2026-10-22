/**
 * @statement CM-P5
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// CM-P5: Use probability notation for exclusive, complementary, independent and conditional events
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

const MEANINGS = [
  { tex: "P(A \\cap B)", words: "The probability that A and B both happen" },
  { tex: "P(A \\cup B)", words: "The probability that A or B (or both) happens" },
  { tex: "P(A')", words: "The probability that A does not happen" },
  { tex: "P(A \\mid B)", words: "The probability that A happens, given that B happens" },
];

const KINDS = ["Independent", "Mutually exclusive", "Neither independent nor mutually exclusive"];

interface Params {
  m: number;
  pa: number;
  pb: number;
  kind: number;
}

/** P(A) × P(B), from percentages. */
const product = (p: Params) => (p.pa * p.pb) / 10000;
const pab = (p: Params) =>
  p.kind === 0 ? product(p) : p.kind === 1 ? 0 : Math.round(100 * product(p) + 5) / 100;

export default defineGenerator<Params>({
  id: "CM-P5",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.NOTATION", "PRO.INDEPENDENT.EXCLUSIVE"],

  params(rng) {
    return {
      m: rng.int(0, MEANINGS.length - 1),
      pa: rng.pick([20, 30, 40, 50]),
      pb: rng.pick([10, 20, 30, 50]),
      kind: rng.int(0, 2),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const M = MEANINGS[p.m] ?? (MEANINGS[0] as (typeof MEANINGS)[number]);
        return A.choice({
          rng,
          question: ["What does ", A.math(M.tex), " mean?"],
          correct: M.words,
          distractors: rng
            .shuffle(MEANINGS.filter((x) => x !== M))
            .slice(0, 2)
            .map((x) => ({
              content: x.words,
              code: "PRO.NOTATION",
              feedback: `That is ${x.words.toLowerCase()}, written ${x.tex.replace(/\\cap/, "∩").replace(/\\cup/, "∪").replace(/\\mid/, "|").replace(/ /g, "")}.`,
            })),
          solution: [{ say: `${M.words}.` }],
        });
      }
      case 2: {
        const right = KINDS[p.kind] as string;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "Events A and B have ",
            A.math(`P(A) = ${p.pa / 100}`),
            ", ",
            A.math(`P(B) = ${p.pb / 100}`),
            " and ",
            A.math(`P(A \\cap B) = ${pab(p)}`),
            ".",
          ],
          ask: "Which describes A and B?",
          correct: right,
          distractors: KINDS.filter((k) => k !== right).map((k) => ({
            content: k,
            code: "PRO.INDEPENDENT.EXCLUSIVE",
            feedback: "Independent: P(A ∩ B) = P(A) × P(B). Mutually exclusive: P(A ∩ B) = 0.",
          })),
          solution: [{ say: `P(A) × P(B) = ${product(p)}, and P(A ∩ B) = ${pab(p)}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Val says two events with P(A) = ${p.pa / 100} and P(B) = ${p.pb / 100} that are mutually exclusive must also be independent.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. If they are mutually exclusive, P(A ∩ B) = 0, but independence needs P(A ∩ B) = P(A)P(B) = ${product(p)}. If A happens, B cannot: they are strongly dependent.`,
              correct: true,
            },
            {
              text: "True. Exclusive events have nothing to do with each other.",
              code: "PRO.INDEPENDENT.EXCLUSIVE",
            },
            { text: "True. The two words mean the same.", code: "PRO.INDEPENDENT.EXCLUSIVE" },
          ],
          solution: [
            { say: "Events with non-zero probabilities cannot be both exclusive and independent." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === MEANINGS[p.m]?.words;
    if (question.key.depth === 2) return chosenText(question) === KINDS[p.kind];
    return true;
  },
});
