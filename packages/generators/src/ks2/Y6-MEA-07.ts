/**
 * @statement Y6-MEA-07
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-MEA-07: Calculate, estimate and compare volume of cubes and cuboids using standard units,
// including cubic centimetres (cm³) and cubic metres (m³), and extending to other units [for
// example, mm³ and km³]
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { cuboid } from "../shared/mea.ts";

export interface Params {
  l: number;
  w: number;
  h: number;
  unit: "cm" | "m";
  claim: number;
}

export default defineGenerator<Params>({
  id: "Y6-MEA-07",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: ["MEA.VOLUME.ADDS", "RAT.UNITS.AREA-FACTOR", "AS.MULTISTEP.ONE-STEP"],

  params(rng, numbers) {
    const top = numbers === "friendly" ? 6 : numbers === "standard" ? 12 : 25;
    const l = rng.int(3, top);
    const w = rng.int(2, top);
    const h = rng.int(2, top);
    if (l * w * h === l + w + h || l < w) reject("a cuboid that is longer than it is deep");
    return { l, w, h, unit: rng.pick(["cm", "m"] as const), claim: rng.int(0, 1) };
  },

  build(p, depth, rng): QuestionDraft {
    const v = p.l * p.w * p.h;
    const u3 = `${p.unit}³`;
    switch (depth) {
      case 1:
        return A.standard({
          question: [A.figure(cuboid(p.l, p.w, p.h, p.unit))],
          ask: "What is the volume of the cuboid?",
          answer: A.number(v, { units: u3 }),
          wrong: wrongs(v, [
            {
              code: "MEA.VOLUME.ADDS",
              value: A.number(p.l + p.w + p.h, { units: u3 }),
              feedback: "Volume = length × width × height: multiply, do not add.",
            },
          ]),
          solution: [{ say: `${p.l} × ${p.w} × ${p.h} = ${v} ${u3}.` }],
        });
      case 2:
        return A.missingValue({
          intro: `A cuboid has a volume of ${v} ${u3}. It is ${p.l} ${p.unit} long and ${p.w} ${p.unit} wide. How tall is it?`,
          relation: [p.l, "\\times", p.w, "\\times", p.h, "=", v],
          hide: 4,
          units: p.unit,
          wrong: wrongs(p.h, [
            {
              code: "MEA.VOLUME.ADDS",
              value: A.number(v - p.l - p.w, { units: p.unit }),
              feedback: `Divide the volume by the area of the base: ${v} ÷ (${p.l} × ${p.w}).`,
            },
          ]),
          solution: [
            { say: `${p.l} × ${p.w} = ${p.l * p.w}, and ${v} ÷ ${p.l * p.w} = ${p.h} ${p.unit}.` },
          ],
        });
      case 4:
        return p.claim === 0
          ? A.trueOrFalseWhy({
              rng,
              statement: "Ali says 1 m³ = 100 cm³, because 1 m = 100 cm.",
              truth: false,
              reasons: [
                {
                  text: "False. A 1 m cube is 100 cm long, 100 cm wide and 100 cm tall, so 1 m³ = 100 × 100 × 100 = 1 000 000 cm³.",
                  correct: true,
                },
                {
                  text: "True. You convert cubic units the same way as lengths.",
                  code: "RAT.UNITS.AREA-FACTOR",
                },
                { text: "False. 1 m³ = 1000 cm³.", code: "RAT.UNITS.AREA-FACTOR" },
              ],
              solution: [{ say: "100 × 100 × 100 = 1 000 000, so 1 m³ = 1 000 000 cm³." }],
            })
          : A.trueOrFalseWhy({
              rng,
              statement: `A cuboid is ${p.l} ${p.unit} by ${p.w} ${p.unit} by ${p.h} ${p.unit}. Ali says doubling every edge doubles the volume.`,
              truth: false,
              reasons: [
                {
                  text: `False. Each of the three lengths doubles, so the volume is multiplied by 2 × 2 × 2 = 8: from ${v} ${u3} to ${8 * v} ${u3}.`,
                  correct: true,
                },
                {
                  text: "True. Doubling the sizes doubles everything.",
                  code: "RAT.UNITS.AREA-FACTOR",
                },
                {
                  text: `True. The edges add up to twice as much, ${2 * (p.l + p.w + p.h)} ${p.unit}.`,
                  code: "MEA.VOLUME.ADDS",
                },
              ],
              solution: [
                {
                  say: `${2 * p.l} × ${2 * p.w} × ${2 * p.h} = ${8 * v} ${u3}, which is 8 × ${v}.`,
                },
              ],
            });
      default: {
        // A fish tank in cm, filled with water: 1000 cm³ = 1 litre.
        const L = p.l * 10;
        const W = p.w * 5;
        const H = p.h * 5;
        const cm3 = L * W * H;
        return A.multiStepContext({
          context: `A fish tank is a cuboid ${L} cm long, ${W} cm wide and ${H} cm tall. 1000 cm³ of water is 1 litre.`,
          parts: [
            {
              ask: "What is the volume of the tank in cm³?",
              answer: A.number(cm3, { units: "cm³" }),
              wrong: wrongs(cm3, [
                {
                  code: "MEA.VOLUME.ADDS",
                  value: A.number(L + W + H, { units: "cm³" }),
                  feedback: "Multiply the three lengths.",
                },
              ]),
            },
            {
              ask: "How many litres of water fill the tank?",
              answer: A.number(cm3 / 1000, { units: "litres" }),
              wrong: wrongs(cm3 / 1000, [
                {
                  code: "AS.MULTISTEP.ONE-STEP",
                  value: A.number(cm3 / 100, { units: "litres" }),
                  feedback: "1000 cm³ make 1 litre, so divide by 1000.",
                },
              ]),
            },
          ],
          solution: [
            { say: `${L} × ${W} × ${H} = ${cm3} cm³.` },
            { say: `${cm3} ÷ 1000 = ${cm3 / 1000} litres.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const v = p.l * p.w * p.h;
    if (question.archetype === "standard") return numberAnswer(question) === v;
    if (question.archetype === "missing-value") return numberAnswer(question) === p.h;
    if (question.archetype === "multi-step-context")
      return numberAnswer(question) === p.l * 10 * p.w * 5 * p.h * 5;
    return true;
  },
});
