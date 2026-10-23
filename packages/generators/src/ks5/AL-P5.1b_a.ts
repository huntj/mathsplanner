/**
 * @statement AL-P5.1b.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P5.1b.a: Convert between degrees and radians
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type GeneratorDefinition, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { mixFamilies } from "../shared/npv.ts";
import { piLatex } from "../shared/trig.ts";
import parent from "./AL-P5.1b.ts";

interface Params {
  degrees: number;
}

const own: GeneratorDefinition<Params> = {
  id: "AL-P5.1b.a",
  version: "1.0.0",
  depths: [2, 4],
  misconceptions: ["GEO.RADIAN.CONVERT"],

  params(rng) {
    return { degrees: rng.pick([20, 36, 40, 72, 108, 120, 135, 150, 210, 240, 270, 300, 315]) };
  },

  build(p, depth, rng): QuestionDraft {
    const r = piLatex(p.degrees);
    if (depth === 2) {
      return A.standard({
        question: ["Write ", A.math(r), " radians in degrees."],
        answer: A.degrees(p.degrees),
        wrong: wrongs(p.degrees, [
          {
            code: "GEO.RADIAN.CONVERT",
            value: A.degrees(
              Math.round(((p.degrees * Math.PI) / 180) * (Math.PI / 180) * 1e4) / 1e4,
            ),
            feedback: "Multiply by 180/π to go from radians to degrees: π radians is 180°.",
          },
        ]),
        solution: [
          { say: "", math: `${r} \\times \\frac{180^\\circ}{\\pi} = ${p.degrees}^\\circ` },
        ],
      });
    }
    return A.trueOrFalseWhy({
      rng,
      statement: [
        "Beth says ",
        A.math(`${p.degrees}^\\circ = \\frac{${p.degrees} \\times 180}{\\pi}`),
        " radians.",
      ],
      truth: false,
      reasons: [
        {
          text: `False. Multiply by π/180 to change degrees into radians: ${p.degrees}° = ${r.replace(/\\frac\{(.+)\}\{(\d+)\}/, "$1/$2").replace("\\pi", "π")}.`,
          correct: true,
        },
        { text: "True. You always multiply by 180 and divide by π.", code: "GEO.RADIAN.CONVERT" },
        { text: "True. Degrees and radians use the same numbers.", code: "GEO.RADIAN.CONVERT" },
      ],
      solution: [{ say: "", math: `${p.degrees} \\times \\frac{\\pi}{180} = ${r}` }],
    });
  },

  verify(p, question) {
    return question.key.depth !== 2 || numberAnswer(question) === p.degrees;
  },
};

export default defineGenerator(
  mixFamilies("AL-P5.1b.a", { 1: { ...parent.definition, id: "AL-P5.1b.a" }, 2: own, 4: own }),
);
