/**
 * @statement Y7-ALG-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y7-ALG-03: Understand and use the concepts and vocabulary of expressions, equations, inequalities,
// terms and factors
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText, numberAnswer } from "../shared/counting.ts";

type Kind = "expression" | "equation" | "inequality" | "formula";

interface Params {
  kind: Kind;
  a: number;
  b: number;
  c: number;
  /** Depth 2: number of terms in an expression. */
  terms: number;
}

const EXAMPLES = (a: number, b: number, c: number): Record<Kind, string> => ({
  expression: `${a}x + ${b}`,
  equation: `${a}x + ${b} = ${c}`,
  inequality: `${a}x + ${b} > ${c}`,
  formula: `A = ${a === 1 ? "" : a}lw`,
});
const NAMES: Record<Kind, string> = {
  expression: "an expression",
  equation: "an equation",
  inequality: "an inequality",
  formula: "a formula",
};

export default defineGenerator<Params>({
  id: "Y7-ALG-03",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.VOCAB"],

  params(rng, numbers) {
    const [a, b, c] = [rng.int(2, 9), rng.int(1, 9), rng.int(10, 40)];
    if (a === b) reject("different numbers");
    return {
      kind: rng.pick(["expression", "equation", "inequality"] as const),
      a,
      b,
      c,
      terms: rng.int(2, numbers === "friendly" ? 3 : 5),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const ex = EXAMPLES(p.a, p.b, p.c);
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: ["Which of these is ", NAMES[p.kind], "?"],
          correct: A.math(ex[p.kind]),
          distractors: (["expression", "equation", "inequality", "formula"] as const)
            .filter((k) => k !== p.kind)
            .map((k) => ({
              content: A.math(ex[k]),
              code: "ALG.VOCAB",
              feedback: `That is ${NAMES[k]}.`,
            })),
          solution: [
            {
              say: "An expression has no = sign; an equation says two things are equal; an inequality uses <, >, ≤ or ≥; a formula links variables, like A = lw.",
            },
          ],
        });
      case 2: {
        const letters = ["x", "y", "z", "w", "v"];
        const parts = letters.slice(0, p.terms).map((l, i) => `${i + 2}${l}`);
        const latex = [...parts, String(p.b)].join(" + ");
        return A.standard({
          question: ["How many terms are in the expression ", A.math(latex), "?"],
          answer: A.number(p.terms + 1),
          wrong: [
            {
              code: "ALG.VOCAB",
              value: A.number(p.terms),
              feedback: `A number on its own, like ${p.b}, is a term too.`,
            },
          ],
          solution: [
            {
              say: `The terms are separated by + and − signs: ${[...parts, String(p.b)].join(", ")}. That is ${p.terms + 1} terms.`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: ["Ana says ", A.math(ex.expression), " is an equation."],
          truth: false,
          reasons: [
            {
              text: "False. It has no = sign, so it is an expression. It cannot be solved, only simplified or evaluated.",
              correct: true,
            },
            { text: "True. Anything with a letter in it is an equation.", code: "ALG.VOCAB" },
            { text: "True. It has a number and a letter." },
          ],
          solution: [{ say: `${ex.expression} is an expression; ${ex.equation} is an equation.` }],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "standard" && question.parts[0]?.answer.type === "choice")
      return chosenText(question) === EXAMPLES(p.a, p.b, p.c)[p.kind];
    if (question.archetype === "standard") return numberAnswer(question) === p.terms + 1;
    return true;
  },
});
