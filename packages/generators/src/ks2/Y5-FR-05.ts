/**
 * @statement Y5-FR-05
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-FR-05: Multiply proper fractions and mixed numbers by whole numbers, supported by materials and
// diagrams
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { fracTex, fractionBar, gcdOf, slash } from "../shared/fr.ts";

interface Params {
  n: number;
  d: number;
  k: number;
  /** Whole part, 0 for a proper fraction. */
  w: number;
}

const mixed = { form: "mixed" as const };

export default defineGenerator<Params>({
  id: "Y5-FR-05",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["FR.MULTIPLY.BOTH"],

  params(rng, numbers) {
    const d = rng.pick(numbers === "friendly" ? [3, 4, 5] : [3, 4, 5, 6, 8]);
    const options = Array.from({ length: d - 1 }, (_, i) => i + 1).filter((k) => gcdOf(k, d) === 1);
    return {
      n: rng.pick(options),
      d,
      k: rng.int(2, numbers === "friendly" ? 4 : 6),
      w: numbers === "stretch" ? rng.int(1, 3) : 0,
    };
  },

  build(p, depth, rng): QuestionDraft {
    const f = frac(p.w * p.d + p.n, p.d);
    const v = f.mul(p.k);
    const fTex = p.w ? `${p.w}${fracTex(p.n, p.d)}` : fracTex(p.n, p.d);
    const slip = fracTex(p.k * (p.w * p.d + p.n), p.k * p.d);
    const how = p.w
      ? `${p.k} × ${p.w} = ${p.k * p.w} and ${p.k} × ${slash(p.n, p.d)} = ${slash(p.k * p.n, p.d)}, so the answer is ${toLatex(v, mixed).replace(/\\frac\{(\d+)\}\{(\d+)\}/, " $1/$2")}.`
      : `${p.k} lots of ${slash(p.n, p.d)} is ${p.k * p.n} ${p.d === 2 ? "halves" : `parts of size ${slash(1, p.d)}`}: ${slash(p.k * p.n, p.d)}.`;
    const wrong = [
      {
        code: "FR.MULTIPLY.BOTH",
        value: A.exact(slip),
        feedback: `Multiplying by ${p.k} makes ${p.k} times as many parts; the size of the parts (the denominator) stays the same.`,
      },
    ];
    switch (depth) {
      case 1:
        return A.standard({
          question: [A.math(`${p.k} \\times ${fTex}`)],
          ask: "Work it out.",
          answer: A.exact(v, undefined, p.w ? mixed : undefined),
          wrong,
          solution: [{ say: how }],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "A cake needs ",
                A.math(fTex),
                " of a bag of flour. How much flour do ",
                String(p.k),
                " cakes need?",
              ],
              ask: "Give your answer in bags.",
            },
            // Bars only when every one can be drawn.
            ...(p.w === 0 && p.k <= 3
              ? [
                  {
                    question: [
                      `Each bar has ${slash(p.n, p.d)} shaded.`,
                      ...Array.from({ length: p.k }, () => A.figure(fractionBar(p.n, p.d))),
                    ],
                    ask: "How much is shaded altogether, as a fraction of one bar?",
                  },
                ]
              : []),
          ],
          answer: A.exact(v, undefined, p.w ? mixed : undefined),
          wrong,
          solution: [{ say: how }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: ["Ana says ", A.math(`${p.k} \\times ${fTex} = ${slip}`), "."],
          truth: false,
          reasons: [
            {
              text: `False. ${slip.replace(/\\frac\{(\d+)\}\{(\d+)\}/, "$1/$2")} is the same as ${slash(p.w * p.d + p.n, p.d)}, so nothing has been multiplied. ${how}`,
              correct: true,
            },
            { text: `True. Multiply the top and the bottom by ${p.k}.`, code: "FR.MULTIPLY.BOTH" },
            { text: "True. Multiplying always makes a fraction smaller." },
          ],
          solution: [{ say: how }],
        });
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (a?.type !== "exact") return question.archetype === "true-or-false-why";
    return String(a.value) === toLatex(frac(p.w * p.d + p.n, p.d).mul(p.k), p.w ? mixed : {});
  },
});
