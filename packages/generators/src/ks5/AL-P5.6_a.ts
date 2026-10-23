/**
 * @statement AL-P5.6.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P5.6.a: Use the addition formulae
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type GeneratorDefinition, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./AL-P5.6.ts";

const FORMULAE = [
  {
    left: "\\sin(A + B)",
    right: "\\sin A\\cos B + \\cos A\\sin B",
    wrong: "\\sin A\\cos B - \\cos A\\sin B",
    naive: "\\sin A + \\sin B",
  },
  {
    left: "\\sin(A - B)",
    right: "\\sin A\\cos B - \\cos A\\sin B",
    wrong: "\\sin A\\cos B + \\cos A\\sin B",
    naive: "\\sin A - \\sin B",
  },
  {
    left: "\\cos(A + B)",
    right: "\\cos A\\cos B - \\sin A\\sin B",
    wrong: "\\cos A\\cos B + \\sin A\\sin B",
    naive: "\\cos A + \\cos B",
  },
  {
    left: "\\cos(A - B)",
    right: "\\cos A\\cos B + \\sin A\\sin B",
    wrong: "\\cos A\\cos B - \\sin A\\sin B",
    naive: "\\cos A - \\cos B",
  },
];

interface Params {
  f: number;
}

const own: GeneratorDefinition<Params> = {
  id: "AL-P5.6.a",
  version: "1.0.0",
  depths: [2, 4],
  misconceptions: ["GEO.ADDITION.SIGN"],

  params(rng) {
    return { f: rng.int(0, FORMULAE.length - 1) };
  },

  build(p, depth, rng): QuestionDraft {
    const f = FORMULAE[p.f] ?? FORMULAE[0];
    if (depth === 2) {
      return A.choice({
        rng,
        archetype: "varied-form",
        question: ["Which is equal to ", A.math(f?.left ?? ""), "?"],
        correct: A.math(f?.right ?? ""),
        distractors: [
          {
            content: A.math(f?.wrong ?? ""),
            code: "GEO.ADDITION.SIGN",
            feedback: "For cos the sign swaps; for sin it matches the sign in the bracket.",
          },
          {
            content: A.math(f?.naive ?? ""),
            feedback: "A trig function of a sum is not the sum of the trig functions.",
          },
        ],
        solution: [{ say: "", math: `${f?.left} = ${f?.right}` }],
      });
    }
    return A.trueOrFalseWhy({
      rng,
      statement: ["Ravi says ", A.math(`${f?.left} = ${f?.wrong}`), "."],
      truth: false,
      reasons: [
        {
          text: `False. ${f?.left.replace(/\\/g, "")} = ${f?.right.replace(/\\/g, "")}.`,
          correct: true,
        },
        {
          text: "True. The sign inside the bracket is copied for every formula.",
          code: "GEO.ADDITION.SIGN",
        },
        {
          text: "True. The sin and cos formulae follow the same sign pattern.",
          code: "GEO.ADDITION.SIGN",
        },
      ],
      solution: [{ say: "", math: `${f?.left} = ${f?.right}` }],
    });
  },

  verify(p, question) {
    return question.key.depth !== 2 || chosenText(question) === FORMULAE[p.f]?.right;
  },
};

export default defineGenerator(
  mixFamilies("AL-P5.6.a", { 1: { ...parent.definition, id: "AL-P5.6.a" }, 2: own, 4: own }),
);
