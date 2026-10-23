/**
 * @statement AL-P5.4.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P5.4.a: Use sec, cosec and cot
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type GeneratorDefinition, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./AL-P5.4.ts";

const FNS = [
  { name: "\\sec\\theta", right: "\\frac{1}{\\cos\\theta}", wrong: "\\frac{1}{\\sin\\theta}" },
  {
    name: "\\operatorname{cosec}\\theta",
    right: "\\frac{1}{\\sin\\theta}",
    wrong: "\\frac{1}{\\cos\\theta}",
  },
  {
    name: "\\cot\\theta",
    right: "\\frac{\\cos\\theta}{\\sin\\theta}",
    wrong: "\\frac{\\sin\\theta}{\\cos\\theta}",
  },
];

interface Params {
  fn: number;
}

const own: GeneratorDefinition<Params> = {
  id: "AL-P5.4.a",
  version: "1.0.0",
  depths: [2],
  misconceptions: ["GEO.RECIPROCAL-TRIG"],

  params(rng) {
    return { fn: rng.int(0, FNS.length - 1) };
  },

  build(p, _depth, rng): QuestionDraft {
    const f = FNS[p.fn] ?? FNS[0];
    return A.choice({
      rng,
      archetype: "varied-form",
      question: ["Which is equal to ", A.math(f?.name ?? ""), "?"],
      correct: A.math(f?.right ?? ""),
      distractors: [
        {
          content: A.math(f?.wrong ?? ""),
          code: "GEO.RECIPROCAL-TRIG",
          feedback: "The third letter helps: sec goes with cos, cosec with sin, cot is 1/tan.",
        },
        {
          content: A.math(`-${f?.right ?? ""}`),
          feedback: "A reciprocal is 1 over the function, not its negative.",
        },
      ],
      solution: [{ say: "", math: `${f?.name} = ${f?.right}` }],
    });
  },

  verify(p, question) {
    return chosenText(question) === FNS[p.fn]?.right;
  },
};

export default defineGenerator(
  mixFamilies("AL-P5.4.a", {
    1: { ...parent.definition, id: "AL-P5.4.a" },
    2: own,
    4: { ...parent.definition, id: "AL-P5.4.a" },
  }),
);
