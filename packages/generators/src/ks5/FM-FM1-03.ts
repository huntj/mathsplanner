/**
 * @statement FM-FM1-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-FM1-03: Model elastic strings and springs with Hooke's law and elastic potential energy
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { round } from "../shared/dist.ts";

interface Params {
  lambda: number;
  l: number;
  x: number;
}

const tension = (p: Params) => round((p.lambda * p.x) / p.l, 2);
const epe = (p: Params) => round((p.lambda * p.x * p.x) / (2 * p.l), 2);

export default defineGenerator<Params>({
  id: "FM-FM1-03",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MECH.ELASTIC"],

  params(rng) {
    return {
      lambda: 5 * rng.int(4, 30),
      l: round(rng.int(5, 30) / 10, 1),
      x: round(rng.int(1, 9) / 10, 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const intro = `An elastic string has natural length ${p.l} m and modulus of elasticity ${p.lambda} N. It is stretched by ${p.x} m.`;
    switch (depth) {
      case 1: {
        const v = tension(p);
        return A.standard({
          question: [intro],
          ask: "Find the tension in the string, to 2 decimal places.",
          answer: A.number(v, { units: "N", accuracy: { dp: 2 } }),
          wrong: wrongs(v, [
            {
              code: "MECH.ELASTIC",
              value: A.number(round(p.lambda * p.x, 2), { units: "N", accuracy: { dp: 2 } }),
              feedback: "Hooke's law: T = λx/l. Divide by the natural length.",
            },
          ]),
          solution: [{ say: "", math: `T = \\frac{${p.lambda} \\times ${p.x}}{${p.l}} = ${v}` }],
        });
      }
      case 2: {
        const v = epe(p);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [intro],
              ask: "Find the elastic potential energy stored, in joules, to 2 decimal places.",
            },
          ],
          answer: A.number(v, { units: "J", accuracy: { dp: 2 } }),
          wrong: wrongs(v, [
            {
              code: "MECH.ELASTIC",
              value: A.number(round((p.lambda * p.x * p.x) / p.l, 2), {
                units: "J",
                accuracy: { dp: 2 },
              }),
              feedback: "EPE = λx²/2l: keep the 2.",
            },
          ]),
          solution: [
            { say: "", math: `\\frac{${p.lambda} \\times ${p.x}^2}{2 \\times ${p.l}} = ${v}` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Dot says an elastic string of natural length ${p.l} m, compressed to ${round(p.l / 2, 2)} m, pushes outwards with a thrust of λx/l.`,
          ],
          truth: false,
          reasons: [
            {
              text: "False. A string goes slack when shorter than its natural length, so the tension is 0 and it cannot push. A spring could.",
              correct: true,
            },
            { text: "True. Hooke's law works for compression too.", code: "MECH.ELASTIC" },
            { text: "True. Strings and springs behave the same.", code: "MECH.ELASTIC" },
          ],
          solution: [{ say: "Strings only pull; springs can push or pull." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === tension(p);
    if (question.key.depth === 2) return numberAnswer(question) === epe(p);
    return true;
  },
});
