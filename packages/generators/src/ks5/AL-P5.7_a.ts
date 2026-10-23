/**
 * @statement AL-P5.7.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P5.7.a: Solve trig equations in a given interval
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type GeneratorDefinition, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { mixFamilies } from "../shared/npv.ts";
import { solutions } from "../shared/trig.ts";
import parent from "./AL-P5.7.ts";

// tan x = value, with principal value p in degrees.
const TANS: [string, number][] = [
  ["1", 45],
  ["-1", -45],
  ["\\sqrt{3}", 60],
  ["-\\sqrt{3}", -60],
  ["\\frac{1}{\\sqrt{3}}", 30],
];

interface Params {
  c: number;
}

const list = (xs: number[]) => xs.map((x) => `${x}^\\circ`).join(",\\ ");

const own: GeneratorDefinition<Params> = {
  id: "AL-P5.7.a",
  version: "1.0.0",
  depths: [2, 4],
  misconceptions: ["ALG.TRIG.SYMMETRY"],

  params(rng) {
    return { c: rng.int(0, TANS.length - 1) };
  },

  build(p, depth, rng): QuestionDraft {
    const [value, pv] = TANS[p.c] ?? ["1", 45];
    const right = solutions("tan", pv, 0, 359.999);
    const sinLike = [((pv % 360) + 360) % 360, (180 - pv + 360) % 360].sort((a, b) => a - b);
    if (depth === 2) {
      return A.choice({
        rng,
        archetype: "varied-form",
        question: [
          "Solve ",
          A.math(`\\tan x = ${value}`),
          " for ",
          A.math("0^\\circ \\le x < 360^\\circ"),
          ".",
        ],
        correct: A.math(list(right)),
        distractors: [
          {
            content: A.math(list(sinLike)),
            code: "ALG.TRIG.SYMMETRY",
            feedback: "tan repeats every 180°, so add 180° to the first solution.",
          },
          {
            content: A.math(list([((pv % 360) + 360) % 360])),
            code: "ALG.TRIG.SYMMETRY",
            feedback: "There is a second solution in the interval, 180° further on.",
          },
        ],
        solution: [{ say: `tan has period 180°, so the solutions are ${right.join("° and ")}°.` }],
      });
    }
    return A.trueOrFalseWhy({
      rng,
      statement: [
        "To solve ",
        A.math("\\sin x = \\frac{1}{2}"),
        " for 0° ≤ x < 360°, Ali finds 30° and then 360° − 30° = 330°.",
      ],
      truth: false,
      reasons: [
        {
          text: "False. sin x = sin(180° − x), so the second solution is 150°. 330° goes with cos.",
          correct: true,
        },
        {
          text: "True. The second solution is always 360° minus the first.",
          code: "ALG.TRIG.SYMMETRY",
        },
        { text: "True. sin is symmetrical about 180°.", code: "ALG.TRIG.SYMMETRY" },
      ],
      solution: [{ say: "", math: "x = 30^\\circ,\\ 150^\\circ" }],
    });
  },

  verify(p, question) {
    if (question.key.depth !== 2) return true;
    const [, pv] = TANS[p.c] ?? ["1", 45];
    return chosenText(question) === list(solutions("tan", pv, 0, 359.999));
  },
};

export default defineGenerator(
  mixFamilies("AL-P5.7.a", { 1: { ...parent.definition, id: "AL-P5.7.a" }, 2: own, 4: own }),
);
