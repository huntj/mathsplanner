/**
 * @statement AL-P5.6.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P5.6.b: Use the double angle formulae
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
import parent from "./AL-P5.6.ts";

// Pythagorean triples (opposite, adjacent, hypotenuse) for an acute angle θ.
const TRIPLES: [number, number, number][] = [
  [3, 4, 5],
  [4, 3, 5],
  [5, 12, 13],
  [12, 5, 13],
  [8, 15, 17],
];

interface Params {
  t: number;
  cos: boolean;
}

const own: GeneratorDefinition<Params> = {
  id: "AL-P5.6.b",
  version: "1.0.0",
  depths: [1, 2],
  misconceptions: ["GEO.TRIG.IDENTITY"],

  params(rng) {
    return { t: rng.int(0, TRIPLES.length - 1), cos: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const [o, a, h] = TRIPLES[p.t] ?? [3, 4, 5];
    const sin2 = toLatex(frac(2 * o * a, h * h));
    const cos2 = toLatex(frac(a * a - o * o, h * h));
    const given = ["θ is acute and ", A.math(`\\sin\\theta = ${toLatex(frac(o, h))}`), "."];
    if (depth === 1) {
      return A.choice({
        rng,
        question: [...given, " Find the exact value of ", A.math("\\sin 2\\theta"), "."],
        correct: A.math(sin2),
        distractors: [
          {
            content: A.math(toLatex(frac(2 * o, h))),
            code: "GEO.TRIG.IDENTITY",
            feedback: "sin 2θ is not 2 sin θ: use sin 2θ = 2 sin θ cos θ.",
          },
          {
            content: A.math(toLatex(frac(o * a, h * h))),
            feedback: "Remember the 2 in 2 sin θ cos θ.",
          },
        ],
        solution: [
          {
            say: "",
            math: `\\cos\\theta = ${toLatex(frac(a, h))},\\ \\sin 2\\theta = 2 \\times ${toLatex(frac(o, h))} \\times ${toLatex(frac(a, h))} = ${sin2}`,
          },
        ],
      });
    }
    return A.choice({
      rng,
      archetype: "varied-form",
      question: [...given, " Find the exact value of ", A.math("\\cos 2\\theta"), "."],
      correct: A.math(cos2),
      distractors: [
        {
          content: A.math(toLatex(frac(2 * a, h))),
          code: "GEO.TRIG.IDENTITY",
          feedback: "cos 2θ is not 2 cos θ: use cos 2θ = 1 − 2 sin² θ.",
        },
        {
          content: A.math(toLatex(frac(o * o - a * a, h * h))),
          code: "GEO.TRIG.IDENTITY",
          feedback: "cos 2θ = cos² θ − sin² θ, in that order.",
        },
      ],
      solution: [
        {
          say: "",
          math: `\\cos 2\\theta = 1 - 2\\sin^2\\theta = 1 - 2 \\times ${toLatex(frac(o * o, h * h))} = ${cos2}`,
        },
      ],
    });
  },

  verify(p, question) {
    const [o, a, h] = TRIPLES[p.t] ?? [3, 4, 5];
    const want =
      question.key.depth === 1
        ? toLatex(frac(2 * o * a, h * h))
        : toLatex(frac(a * a - o * o, h * h));
    return chosenText(question) === want;
  },
};

export default defineGenerator(
  mixFamilies("AL-P5.6.b", { 1: own, 2: own, 4: { ...parent.definition, id: "AL-P5.6.b" } }),
);
