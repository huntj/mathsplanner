/**
 * @statement CM-SG4
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// CM-SG4: Interpret gradients of chords and tangents as average and instantaneous rates of change
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { round } from "../shared/dist.ts";

interface Params {
  a: number;
  b: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "CM-SG4",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.RATE.AVERAGE-INSTANT"],

  params(rng) {
    const p = { a: rng.int(1, 6), b: rng.int(3, 10), k: rng.int(1, 5) };
    if (p.b <= p.a + 1) reject("a chord across more than one second");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        // d = kt²: average speed from t = a to t = b is k(a + b).
        const v = p.k * (p.a + p.b);
        return A.standard({
          question: [
            "The distance travelled by a car, d metres, after t seconds is ",
            A.math(`d = ${p.k === 1 ? "" : p.k}t^2`),
            ".",
          ],
          ask: `Find its average speed between t = ${p.a} and t = ${p.b}, in m/s.`,
          answer: A.number(v, { units: "m/s" }),
          wrong: wrongs(v, [
            {
              code: "RAT.RATE.AVERAGE-INSTANT",
              value: A.number(p.k * (p.b * p.b - p.a * p.a)),
              feedback: `That is the distance. Divide by the time taken, ${p.b - p.a} s: the gradient of the chord.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\frac{${p.k * p.b * p.b} - ${p.k * p.a * p.a}}{${p.b} - ${p.a}} = ${v}`,
            },
          ],
        });
      }
      case 2: {
        const v = 2 * p.k * p.a;
        const chords = [1, 0.1, 0.01].map((h) => round(p.k * (2 * p.a + h), 3));
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "For ",
                A.math(`d = ${p.k === 1 ? "" : p.k}t^2`),
                `, the gradients of chords from t = ${p.a} to t = ${p.a} + h are ${chords.join(", ")} for h = 1, 0.1 and 0.01.`,
              ],
              ask: `Estimate the speed at the instant t = ${p.a}.`,
            },
          ],
          answer: A.number(v, { units: "m/s" }),
          wrong: signedWrongs(v, [
            {
              code: "RAT.RATE.AVERAGE-INSTANT",
              value: A.number(chords[0] ?? 0, { units: "m/s" }),
              feedback:
                "That is an average speed over a whole second. As h shrinks, the chord gradients approach the tangent gradient.",
            },
          ]),
          solution: [
            {
              say: `The chord gradients approach ${v}, the gradient of the tangent at t = ${p.a}.`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Hal says a car's average speed over a journey is always the same as its speed halfway through the journey's time.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. The average speed is the gradient of the chord across the whole journey; the speed at an instant is the gradient of the tangent there. They only match in special cases.",
              correct: true,
            },
            {
              text: "True. The middle of the journey is the average.",
              code: "RAT.RATE.AVERAGE-INSTANT",
            },
            {
              text: "True. Speed is always constant on average.",
              code: "RAT.RATE.AVERAGE-INSTANT",
            },
          ],
          solution: [
            { say: "A car stuck in traffic then speeding up shows the difference clearly." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.k * (p.a + p.b);
    if (question.key.depth === 2) return numberAnswer(question) === 2 * p.k * p.a;
    return true;
  },
});
