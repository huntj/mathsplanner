/**
 * @statement AL-P9.5
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P9.5: Use numerical methods to solve problems in context
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { tableLatex } from "../shared/sta.ts";

interface Params {
  v: number[];
}

export default defineGenerator<Params>({
  id: "AL-P9.5",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.TRAPEZIUM", "ALG.MODEL.LIMITATION"],

  params(rng) {
    const v = [0];
    for (let i = 0; i < 4; i++) v.push((v[i] ?? 0) + rng.int(1, 4));
    return { v };
  },

  build(p, depth, rng): QuestionDraft {
    const t = [0, 2, 4, 6, 8];
    const table = A.displayMath(tableLatex(["t (s)", ...t.map(String)], [["v (m/s)", ...p.v]]));
    const h = 2;
    const inner = p.v.slice(1, 4).reduce((s, x) => s + x, 0);
    const ends = (p.v[0] ?? 0) + (p.v[4] ?? 0);
    const d = (h / 2) * (ends + 2 * inner);
    switch (depth) {
      case 1:
        return A.standard({
          question: ["A cyclist's speed is recorded every 2 seconds.", table],
          ask: "Use the trapezium rule to estimate the distance travelled in the 8 seconds.",
          answer: A.number(d, { units: "m" }),
          wrong: wrongs(d, [
            {
              code: "ALG.TRAPEZIUM",
              value: A.number((h / 2) * (ends + inner), { units: "m" }),
              feedback: "Double the middle speeds: each is shared by two strips.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\frac{2}{2}[${p.v[0]} + 2(${p.v.slice(1, 4).join(" + ")}) + ${p.v[4]}] = ${d}`,
            },
          ],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["A cyclist's speed is recorded every 2 seconds.", table],
              ask: "Estimate the cyclist's average speed over the 8 seconds, using the trapezium rule for the distance.",
            },
          ],
          answer: A.number(d / 8, { units: "m/s" }),
          wrong: wrongs(d / 8, [
            {
              code: "ALG.TRAPEZIUM",
              value: A.number(p.v.reduce((s, x) => s + x, 0) / 5, { units: "m/s" }),
              feedback:
                "Average speed = distance ÷ time; find the distance from the area under the speed-time graph.",
            },
          ]),
          solution: [{ say: `Distance ≈ ${d} m, so average speed ≈ ${d} ÷ 8 = ${d / 8} m/s.` }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "A cyclist's speed is recorded every 2 seconds.",
            table,
            ` Kai says the trapezium rule gives the distance travelled exactly: ${d} m.`,
          ],
          truth: false,
          reasons: [
            {
              text: "False. It assumes the speed changes steadily between readings; the true distance depends on what happens in between, so this is an estimate.",
              correct: true,
            },
            { text: "True. The trapezium rule is exact for any data.", code: "ALG.TRAPEZIUM" },
            {
              text: "True. The readings are measured, so the answer is exact.",
              code: "ALG.MODEL.LIMITATION",
            },
          ],
          solution: [
            { say: "Numerical methods give approximations; more frequent readings improve them." },
          ],
        });
    }
  },

  verify(p, question) {
    const inner = p.v.slice(1, 4).reduce((s, x) => s + x, 0);
    if (question.key.depth === 1)
      return numberAnswer(question) === (p.v[0] ?? 0) + (p.v[4] ?? 0) + 2 * inner;
    return true;
  },
});
