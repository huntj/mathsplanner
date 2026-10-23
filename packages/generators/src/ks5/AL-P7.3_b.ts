/**
 * @statement AL-P7.3.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P7.3.b: Find and classify stationary points
import * as A from "@mathsplanner/archetypes";
import {
  defineGenerator,
  reject,
  type GeneratorDefinition,
  type QuestionDraft,
} from "@mathsplanner/core";
import { poly } from "../shared/alg.ts";
import { chosenText } from "../shared/counting.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./AL-P7.3.ts";

interface Params {
  /** Stationary points at x = r and x = s. */
  r: number;
  s: number;
  c: number;
}

const own: GeneratorDefinition<Params> = {
  id: "AL-P7.3.b",
  version: "1.0.0",
  depths: [1, 2],
  misconceptions: ["CALC.STATIONARY", "CALC.SECOND-DERIVATIVE"],

  params(rng) {
    const p = { r: rng.int(-4, 3), s: rng.int(-3, 5), c: rng.int(-9, 9) };
    if (p.s <= p.r || p.r + p.s === 0 || p.r * p.s === 0)
      reject("two stationary points, not symmetric about 0");
    const same = (a: number[], b: number[]) => [...a].sort().join() === [...b].sort().join();
    const sets = [
      [p.r, p.s],
      [-p.r, -p.s],
      [p.r + p.s, p.r * p.s],
    ];
    if (sets.some((a, i) => sets.some((b, j) => i < j && same(a, b)))) reject("distinct options");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    // y = x³ − (3/2)(r + s)x² + 3rs x + c needs an even r + s for whole coefficients; scale by 2.
    const coeffs = [2, -3 * (p.r + p.s), 6 * p.r * p.s, p.c];
    const curve = `y = ${poly(coeffs)}`;
    const dydx = poly([6, -6 * (p.r + p.s), 6 * p.r * p.s]);
    const xs = (a: number, b: number) =>
      `x = ${Math.min(a, b)} \\text{ and } x = ${Math.max(a, b)}`;
    if (depth === 1) {
      return A.choice({
        rng,
        question: ["Find the x-coordinates of the stationary points of ", A.math(curve), "."],
        correct: A.math(xs(p.r, p.s)),
        distractors: [
          {
            content: A.math(xs(-p.r, -p.s)),
            code: "CALC.STATIONARY",
            feedback: `Solve dy/dx = ${dydx} = 0 carefully: 6(x − ${p.r})(x − ${p.s}) = 0.`,
          },
          {
            content: A.math(xs(p.r + p.s, p.r * p.s)),
            code: "CALC.STATIONARY",
            feedback: "Set dy/dx equal to 0 and solve the quadratic.",
          },
        ],
        solution: [
          {
            say: "",
            math: `\\frac{dy}{dx} = ${dydx} = 6(x ${p.r < 0 ? "+" : "-"} ${Math.abs(p.r)})(x ${p.s < 0 ? "+" : "-"} ${Math.abs(p.s)}) = 0`,
          },
        ],
      });
    }
    return A.choice({
      rng,
      archetype: "varied-form",
      question: ["The curve ", A.math(curve), ` has a stationary point where x = ${p.r}.`],
      ask: "What kind of stationary point is it?",
      correct: "A maximum",
      distractors: [
        {
          content: "A minimum",
          code: "CALC.SECOND-DERIVATIVE",
          feedback: `d²y/dx² = 12x − ${6 * (p.r + p.s)} is negative at x = ${p.r}, so it is a maximum.`,
        },
        {
          content: "A point of inflection",
          code: "CALC.SECOND-DERIVATIVE",
          feedback: "The second derivative is not zero there; check its sign.",
        },
      ],
      solution: [
        {
          say: "",
          math: `\\frac{d^2y}{dx^2} = 12x ${-6 * (p.r + p.s) < 0 ? "-" : "+"} ${Math.abs(6 * (p.r + p.s))} = ${12 * p.r - 6 * (p.r + p.s)} < 0 \\text{ at } x = ${p.r}`,
        },
      ],
    });
  },

  verify(p, question) {
    if (question.key.depth === 2)
      return 12 * p.r - 6 * (p.r + p.s) < 0 && chosenText(question) === "A maximum";
    return chosenText(question).includes(`x = ${Math.min(p.r, p.s)} \\text{ and }`);
  },
};

export default defineGenerator(
  mixFamilies("AL-P7.3.b", { 1: own, 2: own, 4: { ...parent.definition, id: "AL-P7.3.b" } }),
);
