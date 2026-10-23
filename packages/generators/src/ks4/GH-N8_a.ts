/**
 * @statement GH-N8.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GH-N8.a: Simplify surds
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, Surd, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { chosenText, exactAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
}

export default defineGenerator<Params>({
  id: "GH-N8.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.SURD.SIMPLIFY"],

  params(rng) {
    return { a: rng.int(2, 6), b: rng.pick([2, 3, 5, 6, 7, 10, 11]) };
  },

  build(p, depth, rng): QuestionDraft {
    const n = p.a * p.a * p.b;
    const right = toLatex(Surd.term(p.a, p.b));
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Simplify ", A.math(`\\sqrt{${n}}`), "."],
          answer: A.exact(Surd.term(p.a, p.b), "surd"),
          wrong: [
            {
              code: "NPV.SURD.SIMPLIFY",
              value: A.exact(Surd.term(p.a * p.a, p.b)),
              feedback: `√${p.a * p.a} = ${p.a}: take the square root of the square factor.`,
            },
          ],
          solution: [
            {
              say: "",
              math: `\\sqrt{${n}} = \\sqrt{${p.a * p.a}} \\times \\sqrt{${p.b}} = ${right}`,
            },
          ],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["Which is ", A.math(`\\sqrt{${n}}`), " in its simplest form?"],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(toLatex(Surd.term(p.a * p.a, p.b))),
              code: "NPV.SURD.SIMPLIFY",
              feedback: `√${p.a * p.a} is ${p.a}, not ${p.a * p.a}.`,
            },
            {
              content: A.math(`${p.b}\\sqrt{${p.a * p.a}}`),
              code: "NPV.SURD.SIMPLIFY",
              feedback: `The square factor ${p.a * p.a} comes out as ${p.a}; the ${p.b} stays under the root.`,
            },
          ],
          solution: [{ say: "", math: `\\sqrt{${n}} = ${right}` }],
        });
      default:
        return A.oddOneOut({
          rng,
          question: "Which is the odd one out?",
          items: [
            { content: A.math(`\\sqrt{${4 * p.b}}`) },
            { content: A.math(`2\\sqrt{${p.b}}`) },
            { content: A.math(`\\sqrt{4} \\times \\sqrt{${p.b}}`) },
            { content: A.math(`4\\sqrt{${p.b}}`), odd: true },
          ],
          reasons: [
            { text: `It is the only one that is not equal to 2√${p.b}.`, correct: true },
            { text: "It is the only one in its simplest form.", code: "NPV.SURD.SIMPLIFY" },
            { text: "It is the only one with a whole number in front.", code: "NPV.SURD.SIMPLIFY" },
          ],
          solution: [
            {
              say: "",
              math: `\\sqrt{${4 * p.b}} = \\sqrt{4} \\times \\sqrt{${p.b}} = 2\\sqrt{${p.b}}`,
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return exactAnswer(question) === toLatex(Surd.term(p.a, p.b));
    if (question.key.depth === 2) return chosenText(question) === toLatex(Surd.term(p.a, p.b));
    return true;
  },
});
