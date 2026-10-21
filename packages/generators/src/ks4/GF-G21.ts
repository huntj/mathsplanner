/**
 * @statement GF-G21
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-G21: Know the exact values of sin θ and cos θ for θ = 0°, 30°, 45°, 60° and 90°; know the exact
// value of tan θ for θ = 0°, 30°, 45° and 60°
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

interface Params {
  fn: "sin" | "cos" | "tan";
  angle: number;
  pairs: number[];
  claim: number;
}

const VALUES: Record<string, Record<number, string>> = {
  sin: {
    0: "0",
    30: "\\frac{1}{2}",
    45: "\\frac{\\sqrt{2}}{2}",
    60: "\\frac{\\sqrt{3}}{2}",
    90: "1",
  },
  cos: {
    0: "1",
    30: "\\frac{\\sqrt{3}}{2}",
    45: "\\frac{\\sqrt{2}}{2}",
    60: "\\frac{1}{2}",
    90: "0",
  },
  tan: { 0: "0", 30: "\\frac{\\sqrt{3}}{3}", 45: "1", 60: "\\sqrt{3}" },
};
const ALL = [
  "0",
  "\\frac{1}{2}",
  "\\frac{\\sqrt{2}}{2}",
  "\\frac{\\sqrt{3}}{2}",
  "1",
  "\\sqrt{3}",
  "\\frac{\\sqrt{3}}{3}",
];
const CLAIMS: { latex: string; truth: boolean; why: string }[] = [
  {
    latex: "\\tan 45^\\circ = 1",
    truth: true,
    why: "A 45° right-angled triangle is isosceles, so opposite = adjacent.",
  },
  {
    latex: "\\cos 60^\\circ = \\frac{\\sqrt{3}}{2}",
    truth: false,
    why: "cos 60° = 1/2; √3/2 is cos 30° (and sin 60°).",
  },
  {
    latex: "\\sin 30^\\circ = \\cos 60^\\circ",
    truth: true,
    why: "Both are 1/2: sin θ = cos(90° − θ).",
  },
];

export default defineGenerator<Params>({
  id: "GF-G21",
  version: "1.0.0",
  depths: [1, 3, 4],
  misconceptions: ["GEO.TRIG.EXACT"],

  params(rng) {
    const fn = rng.pick(["sin", "cos", "tan"] as const);
    const angles = fn === "tan" ? [0, 30, 45, 60] : [0, 30, 45, 60, 90];
    return {
      fn,
      angle: rng.pick(angles),
      pairs: rng.shuffle([30, 45, 60]),
      claim: rng.int(0, CLAIMS.length - 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = VALUES[p.fn]?.[p.angle] ?? "0";
        const other = p.fn === "sin" ? VALUES.cos?.[p.angle] : VALUES.sin?.[p.angle];
        return A.choice({
          rng,
          question: ["Write down the exact value of ", A.math(`\\${p.fn} ${p.angle}^\\circ`), "."],
          correct: A.math(right),
          distractors: [
            ...(other && other !== right ? [other] : []),
            ...rng.shuffle(ALL.filter((v) => v !== right && v !== other)),
          ]
            .slice(0, 3)
            .map((v) => ({
              content: A.math(v),
              code: "GEO.TRIG.EXACT",
              feedback:
                "Use the half-equilateral triangle (sides 1, 2, √3) or the isosceles right-angled triangle (sides 1, 1, √2).",
            })),
          solution: [{ say: "", math: `\\${p.fn} ${p.angle}^\\circ = ${right}` }],
        });
      }
      case 3:
        return A.matchRepresentations({
          rng,
          question: ["Match each angle θ to the exact value of ", A.math("\\sin\\theta"), "."],
          pairs: p.pairs.map(
            (a) =>
              [A.math(`${a}^\\circ`), A.math(VALUES.sin?.[a] ?? "0")] as [A.RichInput, A.RichInput],
          ),
          solution: [{ say: "sin 30° = 1/2, sin 45° = √2/2, sin 60° = √3/2." }],
        });
      default: {
        const c = CLAIMS[p.claim] as (typeof CLAIMS)[number];
        return A.trueOrFalseWhy({
          rng,
          statement: ["Is this true? ", A.math(c.latex)],
          truth: c.truth,
          reasons: [
            { text: `${c.truth ? "True" : "False"}. ${c.why}`, correct: true },
            {
              text: `${c.truth ? "False" : "True"}. sin and cos of the same angle are always equal.`,
              code: "GEO.TRIG.EXACT",
            },
            {
              text: `${c.truth ? "False" : "True"}. The values go up in equal steps.`,
              code: "GEO.TRIG.EXACT",
            },
          ],
          solution: [{ say: "Learn the values from the two special triangles." }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return chosenText(question) === VALUES[p.fn]?.[p.angle];
    return true;
  },
});
