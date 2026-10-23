/**
 * @statement AL-P2.3.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P2.3.c: Solve quadratics, including in a function of the unknown
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
import parent from "./AL-P2.3.ts";

interface Params {
  /** Roots r and s of x² − (r + s)x + rs. */
  r: number;
  s: number;
  /** Depth 2: roots of the quadratic in √x, both positive. */
  u: number;
  v: number;
}

const own: GeneratorDefinition<Params> = {
  id: "AL-P2.3.c",
  version: "1.0.0",
  depths: [1, 2],
  misconceptions: ["ALG.QUADRATIC.ROOT-SIGN"],

  params(rng) {
    const p = { r: rng.int(-7, 7), s: rng.int(-7, 7), u: rng.int(1, 4), v: rng.int(2, 6) };
    if (p.r === 0 || p.s === 0 || p.r === p.s || p.r === -p.s || p.u === p.v)
      reject("two different non-zero roots");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    if (depth === 1) {
      const eq = `${poly([1, -(p.r + p.s), p.r * p.s])} = 0`;
      const sol = (a: number, b: number) =>
        `x = ${Math.min(a, b)} \\text{ or } x = ${Math.max(a, b)}`;
      return A.choice({
        rng,
        question: ["Solve ", A.math(eq), "."],
        correct: A.math(sol(p.r, p.s)),
        distractors: [
          {
            content: A.math(sol(-p.r, -p.s)),
            code: "ALG.QUADRATIC.ROOT-SIGN",
            feedback: `(x − a)(x − b) = 0 gives x = a or x = b: change the signs from the brackets.`,
          },
          {
            content: A.math(sol(p.r, -p.s)),
            code: "ALG.QUADRATIC.ROOT-SIGN",
            feedback: "Check each root by substituting it into the equation.",
          },
        ],
        solution: [
          {
            say: "",
            math: `(x ${p.r < 0 ? "+" : "-"} ${Math.abs(p.r)})(x ${p.s < 0 ? "+" : "-"} ${Math.abs(p.s)}) = 0 \\Rightarrow ${sol(p.r, p.s)}`,
          },
        ],
      });
    }
    const eq = `x - ${p.u + p.v}\\sqrt{x} + ${p.u * p.v} = 0`;
    return A.choice({
      rng,
      archetype: "varied-form",
      question: [
        "Solve ",
        A.math(eq),
        " by treating it as a quadratic in ",
        A.math("\\sqrt{x}"),
        ".",
      ],
      correct: A.math(`x = ${p.u * p.u} \\text{ or } x = ${p.v * p.v}`),
      distractors: [
        {
          content: A.math(`x = ${p.u} \\text{ or } x = ${p.v}`),
          feedback: `Those are the values of √x. Square them to find x.`,
        },
        {
          content: A.math(`x = ${2 * p.u} \\text{ or } x = ${2 * p.v}`),
          feedback: "Undo a square root by squaring, not doubling.",
        },
      ],
      solution: [
        {
          say: "",
          math: `(\\sqrt{x} - ${p.u})(\\sqrt{x} - ${p.v}) = 0 \\Rightarrow \\sqrt{x} = ${p.u}, ${p.v} \\Rightarrow x = ${p.u * p.u}, ${p.v * p.v}`,
        },
      ],
    });
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return chosenText(question).includes(
        `x = ${Math.min(p.r, p.s)} \\text{ or } x = ${Math.max(p.r, p.s)}`,
      );
    return chosenText(question).includes(`x = ${p.u * p.u}`);
  },
};

export default defineGenerator(
  mixFamilies("AL-P2.3.c", { 1: own, 2: own, 4: { ...parent.definition, id: "AL-P2.3.c" } }),
);
