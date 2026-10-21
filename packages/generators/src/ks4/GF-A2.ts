/**
 * @statement GF-A2
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-A2: Substitute numerical values into formulae and expressions, including scientific formulae
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  u: number;
  a: number;
  t: number;
  x: number;
  m: number;
  v: number;
}

export default defineGenerator<Params>({
  id: "GF-A2",
  version: "1.0.0",
  depths: [1, 2, 5],
  misconceptions: [
    "ALG.SUBSTITUTE.NEGATIVE-SQUARE",
    "NPV.ORDER.LEFT-TO-RIGHT",
    "NPV.NEGATIVE.SIGN-RULE",
  ],

  params(rng) {
    return {
      u: rng.int(2, 20),
      a: -rng.int(2, 6),
      t: rng.int(2, 6),
      x: -rng.int(2, 7),
      m: rng.int(2, 10) * 2,
      v: rng.int(2, 9),
    };
  },

  build(p, depth): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = p.u + p.a * p.t;
        return A.standard({
          question: [
            "Use the formula ",
            A.math("v = u + at"),
            ` to find v when u = ${p.u}, a = ${p.a} and t = ${p.t}.`,
          ],
          answer: A.number(v),
          wrong: signedWrongs(v, [
            {
              code: "NPV.ORDER.LEFT-TO-RIGHT",
              value: A.number((p.u + p.a) * p.t),
              feedback: "Multiply a and t first, then add u.",
            },
            {
              code: "NPV.NEGATIVE.SIGN-RULE",
              value: A.number(p.u - p.a * p.t),
              feedback: `a is negative, so at = ${p.a} × ${p.t} = ${p.a * p.t}.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `v = ${p.u} + (${p.a}) \\times ${p.t} = ${p.u} - ${-p.a * p.t} = ${v}`,
            },
          ],
        });
      }
      case 2: {
        const y = 3 * p.x * p.x - 2 * p.x;
        return A.standard({
          question: ["Work out the value of ", A.math("3x^2 - 2x"), ` when x = ${p.x}.`],
          answer: A.number(y),
          wrong: signedWrongs(y, [
            {
              code: "ALG.SUBSTITUTE.NEGATIVE-SQUARE",
              value: A.number(-3 * p.x * p.x - 2 * p.x),
              feedback: `(${p.x})² = ${p.x * p.x}, which is positive.`,
            },
            {
              code: "ALG.SUBSTITUTE.NEGATIVE-SQUARE",
              value: A.number((3 * p.x) ** 2 - 2 * p.x),
              feedback: "Only x is squared, then multiplied by 3.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `3 \\times (${p.x})^2 - 2 \\times (${p.x}) = 3 \\times ${p.x * p.x} + ${-2 * p.x} = ${y}`,
            },
          ],
        });
      }
      default: {
        const e = (p.m * p.v * p.v) / 2;
        return A.multiStepContext({
          context: [
            "The kinetic energy of a moving object is ",
            A.math("K = \\frac{1}{2}mv^2"),
            ` joules, where m is its mass in kg and v its speed in m/s. A ${p.m} kg trolley moves at ${p.v} m/s.`,
          ],
          parts: [
            {
              ask: "Work out its kinetic energy.",
              answer: A.number(e, { units: "J" }),
              wrong: signedWrongs(e, [
                {
                  code: "NPV.ORDER.LEFT-TO-RIGHT",
                  value: A.number((p.m * p.v) ** 2 / 2),
                  feedback: "Only v is squared.",
                },
              ]),
            },
            {
              ask: "The speed doubles. By what number is the kinetic energy multiplied?",
              answer: A.number(4),
              wrong: signedWrongs(4, [
                {
                  code: "ALG.SUBSTITUTE.NEGATIVE-SQUARE",
                  value: A.number(2),
                  feedback: "v is squared, so doubling v multiplies v² by 2² = 4.",
                },
              ]),
            },
          ],
          solution: [
            { say: "", math: `K = \\frac{1}{2} \\times ${p.m} \\times ${p.v}^2 = ${e}` },
            { say: "(2v)² = 4v², so the energy is multiplied by 4." },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "multi-step-context")
      return numberAnswer(question) === (p.m * p.v * p.v) / 2;
    const n = numberAnswer(question);
    return n === p.u + p.a * p.t || n === 3 * p.x * p.x - 2 * p.x;
  },
});
