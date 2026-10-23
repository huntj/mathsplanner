/**
 * @statement Y6-FR-06.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y6-FR-06.a: Understand a fraction as a division
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { fracTex } from "../shared/fr.ts";

interface Params {
  n: number;
  d: number;
}

export default defineGenerator<Params>({
  id: "Y6-FR-06.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MD.DIVIDE.ORDER"],

  params(rng, numbers) {
    const p = {
      n: rng.int(2, numbers === "friendly" ? 5 : 9),
      d: rng.int(3, numbers === "friendly" ? 6 : 10),
    };
    if (p.n >= p.d) reject("less than one each");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const share = A.math(fracTex(p.n, p.d));
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [`${p.n} pizzas are shared equally between ${p.d} people.`],
          ask: "How much pizza does each person get?",
          correct: share,
          distractors: [
            {
              content: A.math(fracTex(p.d, p.n)),
              code: "MD.DIVIDE.ORDER",
              feedback: `The pizzas are divided by the people: ${p.n} ÷ ${p.d}.`,
            },
            {
              content: A.math(fracTex(1, p.d)),
              feedback: `That is one pizza shared between ${p.d}. There are ${p.n} pizzas.`,
            },
          ],
          solution: [{ say: "", math: `${p.n} \\div ${p.d} = ${fracTex(p.n, p.d)}` }],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["Which division is the same as ", share, "?"],
          correct: A.math(`${p.n} \\div ${p.d}`),
          distractors: [
            {
              content: A.math(`${p.d} \\div ${p.n}`),
              code: "MD.DIVIDE.ORDER",
              feedback: "The numerator is divided by the denominator.",
            },
            {
              content: A.math(`${p.n} \\times ${p.d}`),
              feedback: "A fraction means divide, not multiply.",
            },
          ],
          solution: [{ say: "", math: `${fracTex(p.n, p.d)} = ${p.n} \\div ${p.d}` }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Mia says that sharing ${p.d} bars of chocolate between ${p.n} children gives each child `,
            A.math(fracTex(p.n, p.d)),
            " of a bar.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. Each child gets ${p.d} ÷ ${p.n} = ${p.d}/${p.n} bars, which is more than one bar.`,
              correct: true,
            },
            { text: "True. The smaller number always goes on top.", code: "MD.DIVIDE.ORDER" },
            { text: "True. Sharing always gives less than one each." },
          ],
          solution: [{ say: "", math: `${p.d} \\div ${p.n} = ${fracTex(p.d, p.n)}` }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question).includes(fracTex(p.n, p.d));
    if (question.key.depth === 2) return chosenText(question).includes(`${p.n} \\div ${p.d}`);
    return true;
  },
});
