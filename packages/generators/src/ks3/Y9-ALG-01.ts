/**
 * @statement Y9-ALG-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y9-ALG-01: Simplify and manipulate algebraic expressions by factorising quadratic expressions of the
// form x² + bx + c
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { bracket, poly } from "../shared/alg.ts";

interface Params {
  p: number;
  q: number;
  claimTrue: boolean;
}

export default defineGenerator<Params>({
  id: "Y9-ALG-01",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.FACTORISE.SIGNS"],

  params(rng, numbers) {
    const sign = () => (numbers === "friendly" ? 1 : rng.pick([1, -1]));
    const p = rng.int(1, 9) * sign();
    const q = rng.int(1, 9) * sign();
    if (p + q === 0 || p === q) reject("a middle term and two different factors");
    return { p, q, claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const quad = poly([1, p.p + p.q, p.p * p.q]);
    const answer = `${bracket(p.p)}${bracket(p.q)}`;
    // Same product, wrong sum: both signs flipped.
    const slip = `${bracket(-p.p)}${bracket(-p.q)}`;
    const how = `Find two numbers that multiply to ${p.p * p.q} and add to ${p.p + p.q}: ${p.p} and ${p.q}. So ${quad.replace(/\^2/, "²")} = ${answer}.`;
    const wrong = [
      {
        code: "ALG.FACTORISE.SIGNS",
        value: A.exact(slip),
        feedback: `Those multiply to ${p.p * p.q} but add to ${-(p.p + p.q)}, not ${p.p + p.q}.`,
      },
    ];
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Factorise ", A.math(quad), "."],
          answer: A.exact(answer, "factorised"),
          wrong,
          solution: [{ say: how }],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            { question: ["Write ", A.math(quad), " as the product of two brackets."] },
            {
              question: [
                "Fill in the brackets: ",
                A.math(`${quad} = (x \\ \\ \\square)(x \\ \\ \\square)`),
              ],
              ask: "Write the factorised expression.",
            },
          ],
          answer: A.exact(answer, "factorised"),
          wrong,
          solution: [{ say: how }],
        });
      default: {
        const shown = p.claimTrue ? answer : slip;
        return A.trueOrFalseWhy({
          rng,
          statement: ["Uma says ", A.math(`${quad} = ${shown}`), "."],
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: `True. ${p.p} × ${p.q} = ${p.p * p.q} and ${p.p} + ${p.q} = ${p.p + p.q}. Expanding gives back ${quad.replace(/\^2/, "²")}.`,
                  correct: true,
                },
                {
                  text: "False. The signs in the brackets must match the signs in the quadratic.",
                  code: "ALG.FACTORISE.SIGNS",
                },
                { text: "False. Quadratics cannot be factorised." },
              ]
            : [
                {
                  text: `False. The numbers multiply to ${p.p * p.q} but add to ${-(p.p + p.q)}. Check by expanding: ${slip} = ${poly([1, -(p.p + p.q), p.p * p.q]).replace(/\^2/, "²")}.`,
                  correct: true,
                },
                {
                  text: "True. Any pair that multiplies to the last number works.",
                  code: "ALG.FACTORISE.SIGNS",
                },
                { text: "True. It has two brackets." },
              ],
          solution: [{ say: how }],
        });
      }
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (a?.type !== "exact") return question.archetype === "true-or-false-why";
    return a.value === `${bracket(p.p)}${bracket(p.q)}`;
  },
});
