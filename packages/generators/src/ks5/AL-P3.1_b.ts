/**
 * @statement AL-P3.1.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P3.1.b: Use gradient conditions for parallel and perpendicular lines
import * as A from "@mathsplanner/archetypes";
import {
  defineGenerator,
  frac,
  reject,
  toLatex,
  type GeneratorDefinition,
  type QuestionDraft,
} from "@mathsplanner/core";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./AL-P3.1.ts";

interface Params {
  n: number;
  d: number;
}

const own: GeneratorDefinition<Params> = {
  id: "AL-P3.1.b",
  version: "1.0.0",
  depths: [4],
  misconceptions: ["ALG.PERPENDICULAR.GRADIENT"],

  params(rng) {
    const p = { n: rng.int(1, 5), d: rng.int(2, 5) };
    // A gradient of 1 would make the negative and the negative reciprocal the same.
    if (p.n === p.d) reject("a gradient that is not 1");
    return p;
  },

  build(p, _depth, rng): QuestionDraft {
    const m = toLatex(frac(p.n, p.d));
    const perp = toLatex(frac(-p.d, p.n));
    return A.trueOrFalseWhy({
      rng,
      statement: [
        "Tom says a line perpendicular to one with gradient ",
        A.math(m),
        " has gradient ",
        A.math(`-${m}`),
        ".",
      ],
      truth: false,
      reasons: [
        {
          text: `False. Perpendicular gradients multiply to −1, so the gradient is the negative reciprocal, ${perp.replace(/\\frac\{(\d+)\}\{(\d+)\}/, "$1/$2")}.`,
          correct: true,
        },
        {
          text: "True. A perpendicular line has the opposite gradient.",
          code: "ALG.PERPENDICULAR.GRADIENT",
        },
        { text: "True. Perpendicular lines have the same gradient." },
      ],
      solution: [{ say: "", math: `${m} \\times \\left(${perp}\\right) = -1` }],
    });
  },
};

export default defineGenerator(
  mixFamilies("AL-P3.1.b", { 2: { ...parent.definition, id: "AL-P3.1.b" }, 4: own }),
);
