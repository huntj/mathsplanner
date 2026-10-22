/**
 * @statement AL-M8.2
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-M8.2: Apply F = ma in a straight line and in 2D with vectors
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { ijk, mag } from "../shared/vec.ts";

interface Params {
  m: number;
  drive: number;
  resist: number;
  F: [number, number];
}

const r2 = (x: number) => Math.round(x * 100) / 100;

export default defineGenerator<Params>({
  id: "AL-M8.2",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MECH.F-MA"],

  params(rng) {
    const F: [number, number] = [rng.int(-12, 12), rng.int(-12, 12)];
    const p = {
      m: 100 * rng.int(8, 20),
      drive: 100 * rng.int(20, 60),
      resist: 100 * rng.int(5, 15),
      F,
    };
    if (p.resist >= p.drive || F.includes(0)) reject("a forward resultant and a 2D force");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const a = r2((p.drive - p.resist) / p.m);
        return A.standard({
          question: `A car of mass ${p.m} kg has a driving force of ${p.drive} N and faces resistance of ${p.resist} N.`,
          ask: "Find its acceleration, to 2 decimal places.",
          answer: A.number(a, { units: "m/s²", accuracy: { dp: 2 } }),
          wrong: wrongs(a, [
            {
              code: "MECH.F-MA",
              value: A.number(r2(p.drive / p.m), { units: "m/s²", accuracy: { dp: 2 } }),
              feedback: "Use the resultant force: driving force minus resistance.",
            },
          ]),
          solution: [{ say: `F = ma: ${p.drive} − ${p.resist} = ${p.m}a, so a = ${a} m s⁻².` }],
        });
      }
      case 2: {
        const m = 2;
        const a = r2(mag(p.F) / m);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "A particle of mass 2 kg is acted on by a single force ",
                A.math(`(${ijk(p.F)})\\text{ N}`),
                ".",
              ],
              ask: "Find the magnitude of its acceleration, to 2 decimal places.",
            },
          ],
          answer: A.number(a, { units: "m/s²", accuracy: { dp: 2 } }),
          wrong: wrongs(a, [
            {
              code: "MECH.F-MA",
              value: A.number(r2(mag(p.F) * m), { units: "m/s²", accuracy: { dp: 2 } }),
              feedback: "a = F/m: divide by the mass.",
            },
          ]),
          solution: [
            { say: "", math: `\\mathbf{a} = \\frac{1}{2}(${ijk(p.F)}),\\ |\\mathbf{a}| = ${a}` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `A car of mass ${p.m} kg has a driving force of ${p.drive} N and resistance ${p.resist} N. Sam works out its acceleration as ${p.drive} ÷ ${p.m}.`,
          truth: false,
          reasons: [
            {
              text: `False. F in F = ma is the resultant force: (${p.drive} − ${p.resist}) ÷ ${p.m}.`,
              correct: true,
            },
            { text: "True. Use the driving force in F = ma.", code: "MECH.F-MA" },
            { text: "True. Resistance only matters at high speed.", code: "MECH.F-MA" },
          ],
          solution: [{ say: "Always find the resultant force first." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === r2((p.drive - p.resist) / p.m);
    return true;
  },
});
