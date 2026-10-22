/**
 * @statement AL-P7.6
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P7.6: Construct simple differential equations in pure maths and in context
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";

interface Params {
  room: number;
  r: number;
}

export default defineGenerator<Params>({
  id: "AL-P7.6",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["CALC.RATE-EQUATION"],

  params(rng) {
    return { room: rng.pick([15, 18, 20, 22]), r: rng.pick([0.05, 0.1, 0.2]) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question:
            "The volume V of a culture grows at a rate proportional to V, with constant k > 0.",
          ask: "Which differential equation models this?",
          correct: A.math("\\frac{dV}{dt} = kV"),
          distractors: [
            {
              content: A.math("\\frac{dV}{dt} = k"),
              code: "CALC.RATE-EQUATION",
              feedback: "The rate depends on V, so V must appear on the right.",
            },
            {
              content: A.math("V = kt"),
              code: "CALC.RATE-EQUATION",
              feedback: "A rate of change is a derivative, dV/dt.",
            },
            {
              content: A.math("\\frac{dV}{dt} = -kV"),
              code: "CALC.RATE-EQUATION",
              feedback: "The volume grows, so the rate is positive.",
            },
          ],
          solution: [{ say: "'Rate of change of V' is dV/dt; 'proportional to V' means kV." }],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `A cup of tea cools in a room at ${p.room} °C. The rate at which its temperature T falls is proportional to the difference between T and the room temperature.`,
          ask: "Which differential equation models this, with k > 0?",
          correct: A.math(`\\frac{dT}{dt} = -k(T - ${p.room})`),
          distractors: [
            {
              content: A.math(`\\frac{dT}{dt} = k(T - ${p.room})`),
              code: "CALC.RATE-EQUATION",
              feedback:
                "The temperature falls, so dT/dt is negative while T is above room temperature.",
            },
            {
              content: A.math("\\frac{dT}{dt} = -kT"),
              code: "CALC.RATE-EQUATION",
              feedback: `The rate depends on the difference T − ${p.room}, not on T alone.`,
            },
          ],
          solution: [
            {
              say: "Falling means a negative rate; proportional to the difference gives k(T − room).",
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "A population is modelled by ",
            A.math(`\\frac{dP}{dt} = ${p.r}P`),
            `. Lia says this means P increases by ${p.r} each year.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. The rate of increase is ${p.r} × P, so it grows as P grows: a bigger population increases faster.`,
              correct: true,
            },
            {
              text: `True. dP/dt = ${p.r} means an increase of ${p.r} per year.`,
              code: "CALC.RATE-EQUATION",
            },
            {
              text: "True. The number in front is the yearly increase.",
              code: "CALC.RATE-EQUATION",
            },
          ],
          solution: [
            {
              say: "dP/dt = kP describes exponential growth: the rate is proportional to the current size.",
            },
          ],
        });
    }
  },

  verify() {
    return true;
  },
});
