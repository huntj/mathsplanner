/**
 * @statement GF-N6
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-N6: Use positive integer powers and associated real roots (square, cube and higher); recognise
// powers of 2, 3, 4, 5
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  base: number;
  power: number;
  root: number;
  rootIndex: 2 | 3;
  neg: number;
}

export default defineGenerator<Params>({
  id: "GF-N6",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: [
    "NPV.POWER.TIMES-INDEX",
    "NPV.POWER.ROOT-HALF",
    "ALG.SUBSTITUTE.NEGATIVE-SQUARE",
  ],

  params(rng, numbers) {
    const base = rng.pick([2, 3, 4, 5]);
    const power = rng.int(3, base === 2 ? 7 : base === 5 ? 4 : 5);
    if (base ** power > 2000) reject("a power under 2000");
    const rootIndex = rng.pick([2, 3] as const);
    const root =
      rootIndex === 2
        ? rng.int(4, numbers === "friendly" ? 12 : 20)
        : rng.int(2, numbers === "friendly" ? 5 : 10);
    return { base, power, root, rootIndex, neg: rng.int(2, 9) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = p.base ** p.power;
        return A.standard({
          question: ["Work out ", A.math(`${p.base}^{${p.power}}`), "."],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "NPV.POWER.TIMES-INDEX",
              value: A.number(p.base * p.power),
              feedback: `The power ${p.power} means ${p.power} lots of ${p.base} multiplied together.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `${Array.from({ length: p.power }, () => p.base).join(" \\times ")} = ${v}`,
            },
          ],
        });
      }
      case 2: {
        const inside = p.root ** p.rootIndex;
        const sign = p.rootIndex === 2 ? "\\sqrt" : "\\sqrt[3]";
        return A.reverse({
          question: ["Work out ", A.math(`${sign}{${inside}}`), "."],
          answer: A.number(p.root),
          wrong: wrongs(p.root, [
            {
              code: "NPV.POWER.ROOT-HALF",
              value: A.number(inside / p.rootIndex),
              feedback: `The ${p.rootIndex === 2 ? "square" : "cube"} root is the number that ${p.rootIndex === 2 ? "squared" : "cubed"} gives ${inside}.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `${p.root}^{${p.rootIndex}} = ${inside},\\ \\text{so } ${sign}{${inside}} = ${p.root}`,
            },
          ],
        });
      }
      default: {
        const v = p.neg * p.neg;
        return A.trueOrFalseWhy({
          rng,
          statement: ["Ana says ", A.math(`(-${p.neg})^2 = -${v}`), "."],
          truth: false,
          reasons: [
            {
              text: `False. (−${p.neg})² = −${p.neg} × −${p.neg} = ${v}: negative × negative is positive.`,
              correct: true,
            },
            {
              text: "True. A negative number squared stays negative.",
              code: "ALG.SUBSTITUTE.NEGATIVE-SQUARE",
            },
            { text: `True. (−${p.neg})² = −${p.neg}².`, code: "ALG.SUBSTITUTE.NEGATIVE-SQUARE" },
          ],
          solution: [
            {
              say: "The bracket squares the whole of −" + p.neg + ".",
              math: `(-${p.neg})^2 = ${v}`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return numberAnswer(question) === p.base ** p.power;
    if (question.archetype === "reverse") return numberAnswer(question) === p.root;
    return true;
  },
});
