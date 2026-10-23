/**
 * @statement AL-P2.3.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P2.3.a: Use the discriminant
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type GeneratorDefinition, type QuestionDraft } from "@mathsplanner/core";
import { poly } from "../shared/alg.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./AL-P2.3.ts";

interface Params {
  a: number;
  c: number;
}

const own: GeneratorDefinition<Params> = {
  id: "AL-P2.3.a",
  version: "1.0.0",
  depths: [4],
  misconceptions: ["ALG.QUADRATIC.FORMULA"],

  params(rng) {
    return { a: rng.int(1, 4), c: rng.int(1, 9) };
  },

  build(p, _depth, rng): QuestionDraft {
    const eq = `${poly([p.a, 0, p.c])} = 0`;
    return A.trueOrFalseWhy({
      rng,
      statement: [
        "Leo says ",
        A.math(eq),
        " has two real roots, because its discriminant is ",
        A.math(`4 \\times ${p.a} \\times ${p.c} = ${4 * p.a * p.c}`),
        ", which is positive.",
      ],
      truth: false,
      reasons: [
        {
          text: `False. b² − 4ac = 0 − ${4 * p.a * p.c} = −${4 * p.a * p.c}, which is negative, so there are no real roots.`,
          correct: true,
        },
        {
          text: "True. A positive discriminant means two real roots.",
          code: "ALG.QUADRATIC.FORMULA",
        },
        { text: "True. Every quadratic has two real roots." },
      ],
      solution: [
        {
          say: "",
          math: `b^2 - 4ac = 0^2 - 4 \\times ${p.a} \\times ${p.c} = -${4 * p.a * p.c} < 0`,
        },
      ],
    });
  },
};

export default defineGenerator(
  mixFamilies("AL-P2.3.a", {
    1: { ...parent.definition, id: "AL-P2.3.a" },
    2: { ...parent.definition, id: "AL-P2.3.a" },
    4: own,
  }),
);
