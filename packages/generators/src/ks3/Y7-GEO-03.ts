/**
 * @statement Y7-GEO-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Phase 4 slice; awaiting teacher review
 */
// Y7-GEO-03: Draw and measure line segments and angles in geometric figures, including
// interpreting scale drawings
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";

interface Params {
  /** On the drawing, 1 cm represents `scale` units. */
  scale: number;
  unit: "m" | "km";
  /** A length on the drawing, in cm. */
  drawn: number;
  context: number;
}

const CONTEXTS = [
  { thing: "a map", between: "the two villages" },
  { thing: "a plan of a school", between: "the hall and the gate" },
  { thing: "a scale drawing of a garden", between: "the two trees" },
];

const real = (p: Params) => Math.round(p.drawn * p.scale * 100) / 100;

export default defineGenerator<Params>({
  id: "Y7-GEO-03",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: ["GEO.SCALE.DIVIDES"],

  params(rng, numbers) {
    const unit = rng.pick(["m", "km"] as const);
    const scale = {
      friendly: rng.pick([2, 5, 10]),
      standard: rng.pick([2, 4, 5, 20, 25, 50]),
      stretch: rng.pick([3, 4, 15, 25, 40, 250]),
    }[numbers];
    const drawn =
      numbers === "stretch"
        ? rng.int(13, 95) / 10
        : numbers === "standard"
          ? rng.int(4, 19) / 2
          : rng.int(2, 12);
    return { scale, unit, drawn, context: rng.int(0, CONTEXTS.length - 1) };
  },

  build(p, depth, rng): QuestionDraft {
    const ctx = CONTEXTS[p.context] ?? CONTEXTS[0];
    const intro = `On ${ctx?.thing}, 1 cm represents ${p.scale} ${p.unit}.`;
    const answer = real(p);
    const divided = Math.round((p.drawn / p.scale) * 100) / 100;
    switch (depth) {
      case 1:
        return A.standard({
          question: `${intro} On the drawing, ${ctx?.between} are ${p.drawn} cm apart.`,
          ask: `How far apart are they in real life, in ${p.unit}?`,
          answer: A.number(answer, { units: p.unit }),
          wrong: wrongs(answer, [
            {
              code: "GEO.SCALE.DIVIDES",
              value: A.number(divided, { units: p.unit }),
              feedback: `Each centimetre is ${p.scale} ${p.unit} in real life, so multiply by ${p.scale}.`,
            },
          ]),
          solution: [
            {
              say: `Each centimetre stands for ${p.scale} ${p.unit}.`,
              math: `${p.drawn} \\times ${p.scale} = ${answer}\\text{ ${p.unit}}`,
            },
          ],
        });
      case 2:
        return A.reverse({
          question: `${intro} In real life, ${ctx?.between} are ${answer} ${p.unit} apart.`,
          ask: "How far apart should they be on the drawing, in cm?",
          answer: A.number(p.drawn, { units: "cm" }),
          wrong: wrongs(p.drawn, [
            {
              code: "GEO.SCALE.DIVIDES",
              value: A.number(Math.round(answer * p.scale * 100) / 100, { units: "cm" }),
              feedback: `Real lengths are ${p.scale} times longer than drawn ones, so divide by ${p.scale}.`,
            },
          ]),
          solution: [
            {
              say: `Each ${p.scale} ${p.unit} is 1 cm on the drawing.`,
              math: `${answer} \\div ${p.scale} = ${p.drawn}\\text{ cm}`,
            },
          ],
        });
      case 4:
        return A.explainTheError({
          rng,
          claim: `${intro} Ella measures ${p.drawn} cm on the drawing and says the real distance is ${divided} ${p.unit}.`,
          correct: `She divided by ${p.scale} instead of multiplying: each centimetre on the drawing is ${p.scale} ${p.unit} in real life.`,
          distractors: [
            {
              content:
                "She should have added the scale: 1 cm more on the drawing is 1 m more in real life.",
            },
            {
              content: `She should have used ${p.scale === 10 ? 100 : 10} instead, because there are ${p.unit === "m" ? 100 : 1000} of those in a metre.`,
            },
            {
              content: "She is right: real distances are always smaller than drawn ones.",
              code: "GEO.SCALE.DIVIDES",
              feedback: "Real distances are bigger than the drawing.",
            },
          ],
          solution: [
            {
              say: `Multiply by the scale.`,
              math: `${p.drawn} \\times ${p.scale} = ${answer}\\text{ ${p.unit}}`,
            },
          ],
        });
      default: {
        // Two steps with a unit change: real length in m, then in cm or km.
        const inM = p.unit === "m" ? answer : answer * 1000;
        const bigger = p.unit === "m" ? "km" : "m";
        const converted = p.unit === "m" ? inM / 1000 : inM;
        return A.multiStepContext({
          context: `${intro} A path on the drawing is ${p.drawn} cm long.`,
          parts: [
            {
              ask: `How long is the path in real life, in ${p.unit}?`,
              answer: A.number(answer, { units: p.unit }),
              wrong: wrongs(answer, [
                {
                  code: "GEO.SCALE.DIVIDES",
                  value: A.number(divided, { units: p.unit }),
                  feedback: `Multiply by ${p.scale}.`,
                },
              ]),
            },
            {
              ask: `How long is it in ${bigger}?`,
              answer: A.number(Math.round(converted * 1000) / 1000, { units: bigger }),
            },
          ],
          solution: [
            {
              say: "Multiply by the scale.",
              math: `${p.drawn} \\times ${p.scale} = ${answer}\\text{ ${p.unit}}`,
            },
            {
              say:
                p.unit === "m"
                  ? "There are 1000 m in 1 km, so divide by 1000."
                  : "There are 1000 m in 1 km, so multiply by 1000.",
              math: `${Math.round(converted * 1000) / 1000}\\text{ ${bigger}}`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const first = question.parts[0]?.answer;
    if (first?.type !== "number") return true;
    // Dividing the real length by the scale gets back to the drawn length.
    if (question.archetype === "reverse") return Math.abs(first.value * p.scale - real(p)) < 1e-6;
    return Math.abs(first.value / p.scale - p.drawn) < 1e-6;
  },

  bounds: {
    friendly: { min: 0.001 },
    standard: { min: 0.001, dp: 3 },
    stretch: { min: 0.001, dp: 3 },
  },
});
