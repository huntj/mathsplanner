/**
 * @statement AL-P5.7
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P5.7: Solve trigonometric equations in a given interval, including quadratics in trig functions
// and multiple angles
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { solutions, type TrigFn } from "../shared/trig.ts";

/** Equations f(x) = value with a principal value p in degrees. */
const CASES: { fn: TrigFn; value: string; p: number }[] = [
  { fn: "sin", value: "\\frac{1}{2}", p: 30 },
  { fn: "sin", value: "\\frac{\\sqrt{3}}{2}", p: 60 },
  { fn: "sin", value: "-\\frac{1}{2}", p: -30 },
  { fn: "cos", value: "\\frac{1}{2}", p: 60 },
  { fn: "cos", value: "-\\frac{1}{2}", p: 120 },
  { fn: "cos", value: "\\frac{\\sqrt{2}}{2}", p: 45 },
  { fn: "tan", value: "1", p: 45 },
  { fn: "tan", value: "\\sqrt{3}", p: 60 },
];

interface Params {
  c: number;
  k: 2 | 3;
}

const list = (xs: number[]) => `x = ${xs.map((x) => `${x}^\\circ`).join(",\\ ")}`;

export default defineGenerator<Params>({
  id: "AL-P5.7",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.QUADRATIC.ONE-ROOT", "ALG.TRIG.SYMMETRY", "GEO.TRIG.MULTIPLE-ANGLE"],

  params(rng) {
    return { c: rng.int(0, CASES.length - 1), k: rng.pick([2, 3] as const) };
  },

  build(p, depth, rng): QuestionDraft {
    const c = CASES[p.c] ?? (CASES[0] as (typeof CASES)[number]);
    switch (depth) {
      case 1: {
        const right = solutions(c.fn, c.p);
        const first = right[0] ?? 0;
        const wrongPair =
          c.fn === "sin"
            ? solutions("cos", 90 - c.p)
                .filter((x) => x !== right[1])
                .slice(0, 2)
            : [first, (first + 180) % 360];
        return A.choice({
          rng,
          question: [
            "Solve ",
            A.math(`\\${c.fn} x = ${c.value}`),
            " for ",
            A.math("0^\\circ \\le x < 360^\\circ"),
            ".",
          ],
          correct: A.math(list(right)),
          distractors: [
            {
              content: A.math(list([first])),
              code: "ALG.QUADRATIC.ONE-ROOT",
              feedback:
                "There is more than one solution in the interval: use the graph's symmetry or period.",
            },
            ...(JSON.stringify(wrongPair) !== JSON.stringify(right) && wrongPair.length === 2
              ? [
                  {
                    content: A.math(list(wrongPair)),
                    code: "ALG.TRIG.SYMMETRY",
                    feedback: `Use the symmetry of the ${c.fn} graph to find the second solution.`,
                  },
                ]
              : []),
          ],
          solution: [
            {
              say: `The calculator value is ${c.p}°; the graph's symmetry and period give ${right.map((x) => `${x}°`).join(" and ")}.`,
            },
          ],
        });
      }
      case 2: {
        const hi = 360;
        const kx = solutions(c.fn, c.p, 0, p.k * hi);
        const xs = kx.map((v) => Math.round((v / p.k) * 1e6) / 1e6).filter((x) => x < 360);
        const naive = solutions(c.fn, c.p).map((v) => Math.round((v / p.k) * 1e6) / 1e6);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "Solve ",
            A.math(`\\${c.fn} ${p.k}x = ${c.value}`),
            " for ",
            A.math("0^\\circ \\le x < 360^\\circ"),
            ".",
          ],
          correct: A.math(list(xs)),
          distractors: [
            {
              content: A.math(list(naive)),
              code: "GEO.TRIG.MULTIPLE-ANGLE",
              feedback: `Solve for ${p.k}x in 0° ≤ ${p.k}x < ${p.k * 360}°, then divide every solution by ${p.k}.`,
            },
            {
              content: A.math(list(solutions(c.fn, c.p))),
              code: "GEO.TRIG.MULTIPLE-ANGLE",
              feedback: `These solve ${c.fn} x = ${c.value}; divide the solutions for ${p.k}x by ${p.k}.`,
            },
          ],
          solution: [
            {
              say: `Let u = ${p.k}x with 0° ≤ u < ${p.k * 360}°; solve for u and divide each by ${p.k}.`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Ana solves ",
            A.math("2\\sin^2 x - \\sin x - 1 = 0"),
            " and gets sin x = 1 or sin x = −½. She says sin x = −½ gives no solutions between 0° and 360°.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. sin x is negative in the third and fourth quadrants: x = 210° or 330°.",
              correct: true,
            },
            { text: "True. Sine cannot be negative.", code: "ALG.TRIG.SYMMETRY" },
            {
              text: "True. Only the first factor gives solutions.",
              code: "ALG.QUADRATIC.ONE-ROOT",
            },
          ],
          solution: [{ say: "sin x = 1 gives 90°; sin x = −½ gives 210° and 330°." }],
        });
    }
  },

  verify(p, question) {
    const c = CASES[p.c] ?? (CASES[0] as (typeof CASES)[number]);
    if (question.key.depth === 1) return chosenText(question).includes(list(solutions(c.fn, c.p)));
    return true;
  },
});
