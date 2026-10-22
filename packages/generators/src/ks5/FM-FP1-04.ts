/**
 * @statement FM-FP1-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-FP1-04: Use the t-formulae (t = tan ½θ) in trig equations, identities and integration
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { chosenText, exactAnswer } from "../shared/counting.ts";
import { gcdOf } from "../shared/fr.ts";

const FORMULAE = [
  { fn: "\\sin\\theta", tex: "\\frac{2t}{1 + t^2}" },
  { fn: "\\cos\\theta", tex: "\\frac{1 - t^2}{1 + t^2}" },
  { fn: "\\tan\\theta", tex: "\\frac{2t}{1 - t^2}" },
];

interface Params {
  f: number;
  p: number;
  q: number;
}

const sinOf = (p: number, q: number) => toLatex(frac(2 * p * q, q * q + p * p));

export default defineGenerator<Params>({
  id: "FM-FP1-04",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.TRIG.T-FORMULA"],

  params(rng) {
    const p = { f: rng.int(0, 2), p: rng.int(1, 6), q: rng.int(2, 7) };
    if (p.p >= p.q || gcdOf(p.p, p.q) !== 1) reject("a proper fraction in lowest terms");
    if (2 * p.p * p.q === p.q * p.q - p.p * p.p) reject("sin θ ≠ cos θ");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const F = FORMULAE[p.f] ?? (FORMULAE[0] as (typeof FORMULAE)[number]);
        const others = FORMULAE.filter((x) => x !== F);
        return A.choice({
          rng,
          question: [
            "Given ",
            A.math("t = \\tan\\frac{\\theta}{2}"),
            ", which expression equals ",
            A.math(F.fn),
            "?",
          ],
          correct: A.math(F.tex),
          distractors: others.map((o) => ({
            content: A.math(o.tex),
            code: "GEO.TRIG.T-FORMULA",
            feedback: `That is ${o.fn.replace("\\", "").replace("\\theta", " θ")}.`,
          })),
          solution: [{ say: "", math: `${F.fn} = ${F.tex}` }],
        });
      }
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Given that ",
                A.math(`\\tan\\frac{\\theta}{2} = \\frac{${p.p}}{${p.q}}`),
                ", find the exact value of ",
                A.math("\\sin\\theta"),
                ".",
              ],
            },
          ],
          answer: A.exact(sinOf(p.p, p.q)),
          wrong: [
            {
              code: "GEO.TRIG.T-FORMULA",
              value: A.exact(toLatex(frac(p.q * p.q - p.p * p.p, p.q * p.q + p.p * p.p))),
              feedback: "That is cos θ = (1 − t²)/(1 + t²). sin θ = 2t/(1 + t²).",
            },
          ],
          solution: [
            {
              say: "",
              math: `\\sin\\theta = \\frac{2t}{1 + t^2} = \\frac{2 \\times \\frac{${p.p}}{${p.q}}}{1 + \\frac{${p.p * p.p}}{${p.q * p.q}}} = ${sinOf(p.p, p.q)}`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Dee says that with ",
            A.math("t = \\tan\\frac{\\theta}{2}"),
            ", ",
            A.math("d\\theta = \\frac{dt}{1 + t^2}"),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: "False. θ = 2 arctan t, so dθ/dt = 2/(1 + t²) and dθ = 2 dt/(1 + t²).",
              correct: true,
            },
            { text: "True. The derivative of arctan t is 1/(1 + t²).", code: "GEO.TRIG.T-FORMULA" },
            { text: "True. dt/dθ = 1 + t².", code: "GEO.TRIG.T-FORMULA" },
          ],
          solution: [{ say: "dt/dθ = ½sec²(θ/2) = ½(1 + t²)." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === FORMULAE[p.f]?.tex;
    if (question.key.depth === 2) return exactAnswer(question) === sinOf(p.p, p.q);
    return true;
  },
});
