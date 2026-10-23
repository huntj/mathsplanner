/**
 * @statement AL-P7.5.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P7.5.b: Differentiate parametrically
import * as A from "@mathsplanner/archetypes";
import {
  defineGenerator,
  frac,
  toLatex,
  type GeneratorDefinition,
  type QuestionDraft,
} from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./AL-P7.5.ts";

interface Params {
  /** x = a t², y = b t³. */
  a: number;
  b: number;
}

const own: GeneratorDefinition<Params> = {
  id: "AL-P7.5.b",
  version: "1.0.0",
  depths: [2, 4],
  misconceptions: ["CALC.PARAMETRIC"],

  params(rng) {
    return { a: rng.int(1, 4), b: rng.int(1, 5) };
  },

  build(p, depth, rng): QuestionDraft {
    const xs = `x = ${p.a === 1 ? "" : p.a}t^2`;
    const ys = `y = ${p.b === 1 ? "" : p.b}t^3`;
    const right = `${toLatex(frac(3 * p.b, 2 * p.a))}t`;
    const flipped = `${toLatex(frac(2 * p.a, 3 * p.b))}t^{-1}`;
    if (depth === 2) {
      return A.choice({
        rng,
        archetype: "varied-form",
        question: ["A curve has parametric equations ", A.math(xs), " and ", A.math(ys), "."],
        ask: ["Find ", A.math("\\frac{dy}{dx}"), " in terms of t."],
        correct: A.math(right),
        distractors: [
          {
            content: A.math(flipped),
            code: "CALC.PARAMETRIC",
            feedback: "dy/dx = (dy/dt) ÷ (dx/dt): y's derivative goes on top.",
          },
          {
            content: A.math(`${3 * p.b}t^2`),
            code: "CALC.PARAMETRIC",
            feedback: "That is dy/dt. Divide it by dx/dt.",
          },
        ],
        solution: [
          { say: "", math: `\\frac{dy}{dx} = \\frac{${3 * p.b}t^2}{${2 * p.a}t} = ${right}` },
        ],
      });
    }
    return A.trueOrFalseWhy({
      rng,
      statement: [
        "For ",
        A.math(xs),
        " and ",
        A.math(ys),
        ", Ola works out dy/dx as (dx/dt) ÷ (dy/dt).",
      ],
      truth: false,
      reasons: [
        { text: "False. dy/dx = (dy/dt) ÷ (dx/dt), as if the dt's cancel.", correct: true },
        { text: "True. Either way round gives the gradient.", code: "CALC.PARAMETRIC" },
        { text: "True. x comes first, so its derivative goes on top.", code: "CALC.PARAMETRIC" },
      ],
      solution: [{ say: "", math: `\\frac{dy}{dx} = ${right}` }],
    });
  },

  verify(p, question) {
    return (
      question.key.depth !== 2 || chosenText(question) === `${toLatex(frac(3 * p.b, 2 * p.a))}t`
    );
  },
};

export default defineGenerator(
  mixFamilies("AL-P7.5.b", { 1: { ...parent.definition, id: "AL-P7.5.b" }, 2: own, 4: own }),
);
