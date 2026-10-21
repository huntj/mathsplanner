/**
 * @statement GF-A18
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-A18: Solve quadratic equations algebraically by factorising; find approximate solutions using a
// graph
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { bracket, poly } from "../shared/alg.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { distinctFrom } from "../shared/pos.ts";

interface Params {
  a: number;
  b: number;
  k: number;
  w: number;
}

const sol = (a: number, b: number) => `x = ${Math.min(a, b)} \\text{ or } x = ${Math.max(a, b)}`;

export default defineGenerator<Params>({
  id: "GF-A18",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: ["ALG.QUADRATIC.ROOT-SIGN", "ALG.QUADRATIC.ONE-ROOT", "ALG.FACTORISE.SIGNS"],

  params(rng) {
    const a = rng.int(-9, 9);
    const b = rng.int(-9, 9);
    if (a === 0 || b === 0 || a === b || a === -b) reject("two different non-zero roots");
    return { a, b, k: rng.int(2, 12), w: rng.int(3, 12) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = sol(p.a, p.b);
        return A.choice({
          rng,
          question: ["Solve ", A.math(`${bracket(-p.a)}${bracket(-p.b)} = 0`), "."],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(sol(-p.a, -p.b)),
              code: "ALG.QUADRATIC.ROOT-SIGN",
              feedback: `Set each bracket to 0: x ${p.a < 0 ? "+" : "-"} ${Math.abs(p.a)} = 0 gives x = ${p.a}.`,
            },
            {
              content: A.math(`x = ${p.a * p.b}`),
              feedback: "A product is zero when one of its factors is zero.",
            },
          ].filter(distinctFrom(A.math(right))),
          solution: [{ say: "One of the brackets must be 0: ", math: right }],
        });
      }
      case 2: {
        const eq = poly([1, -(p.a + p.b), p.a * p.b]);
        const right = sol(p.a, p.b);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["Solve ", A.math(`${eq} = 0`), " by factorising."],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(sol(-p.a, -p.b)),
              code: "ALG.QUADRATIC.ROOT-SIGN",
              feedback: "Check by substituting: each solution should make the expression 0.",
            },
            {
              content: A.math(`x = ${Math.max(p.a, p.b)}`),
              code: "ALG.QUADRATIC.ONE-ROOT",
              feedback: "A quadratic like this has two solutions.",
            },
          ].filter(distinctFrom(A.math(right))),
          solution: [
            { say: "", math: `${eq} = ${bracket(-p.a)}${bracket(-p.b)} = 0 \\Rightarrow ${right}` },
          ],
        });
      }
      case 4:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Ben says the only solution of ",
            A.math(`x^2 = ${p.k * p.k}`),
            ` is x = ${p.k}.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. (−${p.k})² = ${p.k * p.k} too, so x = ${p.k} or x = −${p.k}.`,
              correct: true,
            },
            { text: "True. A square root is always positive.", code: "ALG.QUADRATIC.ONE-ROOT" },
            { text: "True. Negative numbers cannot be squared.", code: "ALG.QUADRATIC.ONE-ROOT" },
          ],
          solution: [{ say: "", math: `x = \\pm ${p.k}` }],
        });
      default: {
        // A rectangle x by (x + w) has area A.
        const x = p.k;
        const area = x * (x + p.w);
        return A.multiStepContext({
          context: [`A rectangle is x cm wide and (x + ${p.w}) cm long. Its area is ${area} cm².`],
          parts: [
            {
              ask: [
                "Show that x satisfies an equation of the form ",
                A.math("x^2 + bx + c = 0"),
                ". Write the equation.",
              ],
              answer: A.exact(`x^2 + ${p.w}x - ${area} = 0`),
            },
            {
              ask: "Solve the equation and find the width of the rectangle, x.",
              answer: A.number(x, { units: "cm" }),
              wrong: [
                {
                  code: "ALG.QUADRATIC.ROOT-SIGN",
                  value: A.number(-(x + p.w)),
                  feedback: "A width cannot be negative: reject that solution.",
                },
              ],
            },
          ],
          solution: [
            {
              say: "",
              math: `x(x + ${p.w}) = ${area} \\Rightarrow x^2 + ${p.w}x - ${area} = 0 \\Rightarrow (x - ${x})(x + ${x + p.w}) = 0`,
            },
            { say: `x = ${x} or x = −${x + p.w}; the width is positive, so x = ${x} cm.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard" || question.archetype === "varied-form")
      return chosenText(question) === sol(p.a, p.b);
    if (question.archetype === "multi-step-context") return numberAnswer(question, 1) === p.k;
    return true;
  },
});
