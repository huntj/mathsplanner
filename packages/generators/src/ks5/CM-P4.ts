/**
 * @statement CM-P4
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// CM-P4: Calculate conditional probabilities using two-way tables, tree diagrams and Venn diagrams
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { exactAnswer } from "../shared/counting.ts";
import { tableLatex } from "../shared/sta.ts";

interface Params {
  /** Counts: [car & late, car & on time], [bus & late, bus & on time]. */
  t: number[][];
  ab: number;
  b: number;
}

const total = (t: number[][]) => t.flat().reduce((s, x) => s + x, 0);
const busTotal = (t: number[][]) => (t[1]?.[0] ?? 0) + (t[1]?.[1] ?? 0);

export default defineGenerator<Params>({
  id: "CM-P4",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.CONDITIONAL.TOTAL", "PRO.CONDITIONAL.FORMULA"],

  params(rng) {
    const t = [
      [rng.int(3, 20), rng.int(20, 60)],
      [rng.int(3, 20), rng.int(20, 60)],
    ];
    const b = rng.int(20, 70);
    const p = { t, ab: rng.int(5, b - 5), b };
    if (toLatex(frac(t[1]?.[0] ?? 0, busTotal(t))) === toLatex(frac(t[1]?.[0] ?? 0, total(t))))
      reject("different denominators");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = toLatex(frac(p.t[1]?.[0] ?? 0, busTotal(p.t)));
        return A.standard({
          question: [
            "The table shows how some students travel to college and whether they were late one day.",
            A.math(
              tableLatex(
                ["", "Late", "On time"],
                [
                  ["Car", ...(p.t[0] ?? [])],
                  ["Bus", ...(p.t[1] ?? [])],
                ],
              ),
            ),
          ],
          ask: "A student who travelled by bus is chosen at random. Find the probability that they were late.",
          answer: A.exact(v),
          wrong: [
            {
              code: "PRO.CONDITIONAL.TOTAL",
              value: A.exact(toLatex(frac(p.t[1]?.[0] ?? 0, total(p.t)))),
              feedback: `We know the student came by bus, so divide by the ${busTotal(p.t)} bus students only.`,
            },
          ],
          solution: [
            {
              say: "",
              math: `P(\\text{late} \\mid \\text{bus}) = \\frac{${p.t[1]?.[0]}}{${busTotal(p.t)}} = ${v}`,
            },
          ],
        });
      }
      case 2: {
        const v = toLatex(frac(p.ab, p.b));
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Given ",
                A.math(`P(A \\cap B) = ${p.ab / 100}`),
                " and ",
                A.math(`P(B) = ${p.b / 100}`),
                ",",
              ],
              ask: ["find ", A.math("P(A \\mid B)"), " as a fraction."],
            },
          ],
          answer: A.exact(v),
          wrong: [
            {
              code: "PRO.CONDITIONAL.TOTAL",
              value: A.exact(toLatex(frac(p.ab, 100))),
              feedback: "P(A | B) = P(A ∩ B) ÷ P(B): divide by the probability of what is given.",
            },
          ],
          solution: [{ say: "", math: `\\frac{${p.ab / 100}}{${p.b / 100}} = ${v}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: ["Ugo says P(late | bus) is the same as P(bus | late)."],
          truth: false,
          reasons: [
            {
              text: `False. P(late | bus) divides by the bus students; P(bus | late) divides by the late students. Here they are ${p.t[1]?.[0]}/${busTotal(p.t)} and ${p.t[1]?.[0]}/${(p.t[0]?.[0] ?? 0) + (p.t[1]?.[0] ?? 0)}.`,
              correct: true,
            },
            { text: "True. Both are about late bus students.", code: "PRO.CONDITIONAL.FORMULA" },
            {
              text: "True. The order of a conditional probability does not matter.",
              code: "PRO.CONDITIONAL.FORMULA",
            },
          ],
          solution: [{ say: "The 'given' part decides which total you divide by." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return exactAnswer(question) === toLatex(frac(p.t[1]?.[0] ?? 0, busTotal(p.t)));
    if (question.key.depth === 2) return exactAnswer(question) === toLatex(frac(p.ab, p.b));
    return true;
  },
});
