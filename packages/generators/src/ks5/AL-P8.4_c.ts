/**
 * @statement AL-P8.4.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P8.4.c: Integrate sin kx and cos kx
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type GeneratorDefinition, type QuestionDraft } from "@mathsplanner/core";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./AL-P8.4.ts";

interface Params {
  k: number;
  sin: boolean;
}

const own: GeneratorDefinition<Params> = {
  id: "AL-P8.4.c",
  version: "1.0.0",
  depths: [4],
  misconceptions: ["CALC.STANDARD-INTEGRAL"],

  params(rng) {
    return { k: rng.int(2, 6), sin: rng.bool() };
  },

  build(p, _depth, rng): QuestionDraft {
    const [fn, said, right] = p.sin
      ? ["\\sin", `\\frac{1}{${p.k}}\\cos ${p.k}x + c`, `-\\frac{1}{${p.k}}\\cos ${p.k}x + c`]
      : ["\\cos", `-\\frac{1}{${p.k}}\\sin ${p.k}x + c`, `\\frac{1}{${p.k}}\\sin ${p.k}x + c`];
    return A.trueOrFalseWhy({
      rng,
      statement: ["Ivy says ", A.math(`\\int ${fn} ${p.k}x\\,dx = ${said}`), "."],
      truth: false,
      reasons: [
        {
          text: p.sin
            ? "False. The derivative of cos is −sin, so ∫ sin kx dx = −(1/k) cos kx + c."
            : "False. The derivative of sin is cos, so ∫ cos kx dx = (1/k) sin kx + c, with no minus sign.",
          correct: true,
        },
        {
          text: "True. Integrating sin and cos uses the same signs as differentiating them.",
          code: "CALC.STANDARD-INTEGRAL",
        },
        {
          text: "True. The sign does not matter in an indefinite integral.",
          code: "CALC.STANDARD-INTEGRAL",
        },
      ],
      solution: [
        {
          say: "Differentiate the answer to check: it should give the function you integrated.",
          math: `\\int ${fn} ${p.k}x\\,dx = ${right}`,
        },
      ],
    });
  },
};

export default defineGenerator(
  mixFamilies("AL-P8.4.c", { 2: { ...parent.definition, id: "AL-P8.4.c" }, 4: own }),
);
