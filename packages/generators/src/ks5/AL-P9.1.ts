/**
 * @statement AL-P9.1
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P9.1: Locate roots of f(x) = 0 by a change of sign, knowing when this fails
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

interface Params {
  k: number;
  c: number;
}

const f = (p: Params, x: number) => x ** 3 - p.k * x - p.c;

export default defineGenerator<Params>({
  id: "AL-P9.1",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.CHANGE-OF-SIGN"],

  params(rng) {
    const p = { k: rng.int(1, 6), c: rng.int(3, 30) };
    // Exactly one positive root, and not at a whole number.
    const roots = [0, 1, 2, 3, 4, 5, 6].filter((a) => f(p, a) * f(p, a + 1) < 0);
    if (roots.length !== 1 || [1, 2, 3, 4, 5, 6].some((a) => f(p, a) === 0))
      reject("one clear interval");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const a = [0, 1, 2, 3, 4, 5, 6].find((x) => f(p, x) * f(p, x + 1) < 0) ?? 1;
    const eq = `x^3 - ${p.k === 1 ? "" : p.k}x - ${p.c} = 0`;
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: ["The equation ", A.math(eq), " has one positive root."],
          ask: "Between which two consecutive whole numbers does it lie?",
          correct: `${a} and ${a + 1}`,
          distractors: [a + 1, a - 1, a + 2]
            .filter((b) => b >= 0 && b !== a)
            .slice(0, 2)
            .map((b) => ({
              content: `${b} and ${b + 1}`,
              code: "ALG.CHANGE-OF-SIGN",
              feedback: `f(${b}) = ${f(p, b)} and f(${b + 1}) = ${f(p, b + 1)} have the same sign.`,
            })),
          solution: [
            {
              say: `f(${a}) = ${f(p, a)} and f(${a + 1}) = ${f(p, a + 1)}: the sign changes, and f is continuous, so a root lies between them.`,
            },
          ],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "For ",
            A.math(`f(x) = \\frac{1}{x - ${a}}`),
            ", ",
            A.math(`f(${a - 0.5}) < 0`),
            " and ",
            A.math(`f(${a + 0.5}) > 0`),
            ".",
          ],
          ask: `Does f(x) = 0 have a root between ${a - 0.5} and ${a + 0.5}?`,
          correct: `No: f is not continuous at x = ${a} (there is an asymptote), and 1/(x − ${a}) is never 0.`,
          distractors: [
            {
              content: "Yes: the sign changes, so there must be a root.",
              code: "ALG.CHANGE-OF-SIGN",
              feedback:
                "A sign change only shows a root when the function is continuous over the interval.",
            },
            {
              content: `Yes: the root is x = ${a}.`,
              code: "ALG.CHANGE-OF-SIGN",
              feedback: `f(${a}) is undefined, not 0.`,
            },
          ],
          solution: [{ say: "Check continuity before using a change of sign." }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "For ",
            A.math("f(x) = (x - 1.2)(x - 1.8)"),
            ", f(1) and f(2) are both positive. Lucy says this proves there is no root between 1 and 2.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. There are two roots, 1.2 and 1.8, in the interval; the signs change twice, so the end values agree.",
              correct: true,
            },
            { text: "True. No change of sign means no root.", code: "ALG.CHANGE-OF-SIGN" },
            { text: "True. A positive function has no roots.", code: "ALG.CHANGE-OF-SIGN" },
          ],
          solution: [
            {
              say: "No sign change does not rule out an even number of roots, or a repeated root.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    const a = [0, 1, 2, 3, 4, 5, 6].find((x) => f(p, x) * f(p, x + 1) < 0) ?? 1;
    if (question.key.depth === 1) return chosenText(question) === `${a} and ${a + 1}`;
    return true;
  },
});
