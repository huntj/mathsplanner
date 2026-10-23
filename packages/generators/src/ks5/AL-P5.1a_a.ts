/**
 * @statement AL-P5.1a.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P5.1a.a: Use sin, cos and tan for all arguments
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type GeneratorDefinition, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./AL-P5.1a.ts";

// [angle, function, exact value, the value with the wrong sign, the value of the other ratio]
const CASES: [number, "sin" | "cos" | "tan", string, string, string][] = [
  [150, "cos", "-\\frac{\\sqrt{3}}{2}", "\\frac{\\sqrt{3}}{2}", "-\\frac{1}{2}"],
  [210, "sin", "-\\frac{1}{2}", "\\frac{1}{2}", "-\\frac{\\sqrt{3}}{2}"],
  [135, "tan", "-1", "1", "-\\sqrt{3}"],
  [300, "cos", "\\frac{1}{2}", "-\\frac{1}{2}", "\\frac{\\sqrt{3}}{2}"],
  [240, "tan", "\\sqrt{3}", "-\\sqrt{3}", "\\frac{1}{\\sqrt{3}}"],
  [315, "sin", "-\\frac{\\sqrt{2}}{2}", "\\frac{\\sqrt{2}}{2}", "-1"],
  [120, "sin", "\\frac{\\sqrt{3}}{2}", "-\\frac{\\sqrt{3}}{2}", "\\frac{1}{2}"],
  [225, "cos", "-\\frac{\\sqrt{2}}{2}", "\\frac{\\sqrt{2}}{2}", "-\\frac{1}{2}"],
];

interface Params {
  c: number;
}

const own: GeneratorDefinition<Params> = {
  id: "AL-P5.1a.a",
  version: "1.0.0",
  depths: [1, 2],
  misconceptions: ["GEO.TRIG.EXACT"],

  params(rng) {
    return { c: rng.int(0, CASES.length - 1) };
  },

  build(p, depth, rng): QuestionDraft {
    const [angle, fn, value, flipped, other] = CASES[p.c] ?? CASES[0] ?? [150, "cos", "", "", ""];
    const quadrant = angle < 180 ? 2 : angle < 270 ? 3 : 4;
    if (depth === 1) {
      return A.choice({
        rng,
        question: ["Find the exact value of ", A.math(`\\${fn} ${angle}^\\circ`), "."],
        correct: A.math(value),
        distractors: [
          {
            content: A.math(flipped),
            code: "GEO.TRIG.EXACT",
            feedback: `${angle}° is in quadrant ${quadrant}. Check whether ${fn} is positive or negative there.`,
          },
          {
            content: A.math(other),
            code: "GEO.TRIG.EXACT",
            feedback: "Find the related acute angle and use its exact value for this ratio.",
          },
        ],
        solution: [
          {
            say: `Use the related acute angle and the sign of ${fn} in quadrant ${quadrant}.`,
            math: `\\${fn} ${angle}^\\circ = ${value}`,
          },
        ],
      });
    }
    const negative = value.startsWith("-");
    return A.choice({
      rng,
      archetype: "varied-form",
      question: [
        `Without a calculator, decide the sign of `,
        A.math(`\\${fn} ${angle}^\\circ`),
        ".",
      ],
      correct: negative ? "Negative" : "Positive",
      distractors: [
        {
          content: negative ? "Positive" : "Negative",
          code: "GEO.TRIG.EXACT",
          feedback: "In quadrant 1 all are positive, then sin, then tan, then cos (CAST).",
        },
        {
          content: "Zero",
          feedback: `${angle}° is not a multiple of 90°, so ${fn} is not zero there.`,
        },
      ],
      solution: [
        {
          say: `${angle}° is in quadrant ${quadrant}, where ${fn} is ${negative ? "negative" : "positive"}.`,
        },
      ],
    });
  },

  verify(p, question) {
    const c = CASES[p.c];
    if (question.key.depth === 1) return chosenText(question) === c?.[2];
    return chosenText(question) === (c?.[2].startsWith("-") ? "Negative" : "Positive");
  },
};

export default defineGenerator(
  mixFamilies("AL-P5.1a.a", { 1: own, 2: own, 4: { ...parent.definition, id: "AL-P5.1a.a" } }),
);
