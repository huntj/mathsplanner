/**
 * @statement Y3-MEA-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y3-MEA-01: Measure, compare, add and subtract: lengths (m/cm/mm); mass (kg/g); volume/capacity
// (l/ml)
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  kg: number;
  g: number;
  metres: number;
  cut: number;
  ml: number;
  litres: number;
  pour: [number, number];
}

export default defineGenerator<Params>({
  id: "Y3-MEA-01",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: ["MEA.UNITS.MIXED", "AS.MULTISTEP.ONE-STEP"],

  params(rng, numbers) {
    const step = numbers === "friendly" ? 100 : numbers === "standard" ? 50 : 5;
    const pour = [rng.int(2, 9) * 25, rng.int(2, 9) * 25] as [number, number];
    if (pour[0] + pour[1] >= 1000) reject("less than a litre poured");
    return {
      kg: rng.int(1, 4),
      g: rng.int(1, Math.floor(999 / step)) * step,
      metres: rng.int(1, 3),
      cut: rng.int(11, 99),
      ml: rng.int(1, 9) * 100,
      litres: rng.int(1, 2),
      pour,
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const total = p.kg * 1000 + p.g;
        return A.standard({
          question: `A bag of flour has a mass of ${p.kg} kg. A bag of sugar has a mass of ${p.g} g.`,
          ask: "What is their total mass in grams?",
          answer: A.number(total, { units: "g" }),
          wrong: wrongs(total, [
            {
              code: "MEA.UNITS.MIXED",
              value: A.number(p.kg + p.g, { units: "g" }),
              feedback: `Change ${p.kg} kg into grams first: ${p.kg} kg = ${p.kg * 1000} g.`,
            },
          ]),
          solution: [
            { say: `${p.kg} kg = ${p.kg * 1000} g, and ${p.kg * 1000} + ${p.g} = ${total} g.` },
          ],
        });
      }
      case 2: {
        const left = p.metres * 100 - p.cut;
        return A.standard({
          question: `A ribbon is ${p.metres} m long. Jess cuts off ${p.cut} cm.`,
          ask: "How much ribbon is left, in centimetres?",
          answer: A.number(left, { units: "cm" }),
          wrong: wrongs(left, [
            {
              code: "MEA.UNITS.MIXED",
              value: A.number(p.cut - p.metres, { units: "cm" }),
              feedback: `${p.metres} m is ${p.metres * 100} cm. Take ${p.cut} cm from that.`,
            },
          ]),
          solution: [
            {
              say: `${p.metres} m = ${p.metres * 100} cm, and ${p.metres * 100} − ${p.cut} = ${left} cm.`,
            },
          ],
        });
      }
      case 4:
        return A.trueOrFalseWhy({
          rng,
          statement: `Jug A holds ${p.ml} ml of juice. Jug B holds ${p.litres} litre${p.litres === 1 ? "" : "s"}. Ivy says jug A holds more, because ${p.ml} is more than ${p.litres}.`,
          truth: false,
          reasons: [
            {
              text: `False. ${p.litres} litre${p.litres === 1 ? " is" : "s are"} ${p.litres * 1000} ml, which is more than ${p.ml} ml.`,
              correct: true,
            },
            { text: `True. ${p.ml} is a bigger number than ${p.litres}.`, code: "MEA.UNITS.MIXED" },
            { text: "True. Millilitres are bigger than litres.", code: "MEA.UNITS.MIXED" },
          ],
          solution: [{ say: "1 litre = 1000 ml. Compare in the same units." }],
        });
      default: {
        const [a, b] = p.pour;
        return A.multiStepContext({
          context: `Sam pours ${a} ml of water into an empty 1 litre jug. Then he pours in another ${b} ml.`,
          parts: [
            {
              ask: "How much water is in the jug now, in ml?",
              answer: A.number(a + b, { units: "ml" }),
            },
            {
              ask: "How much more water would fill the jug?",
              answer: A.number(1000 - a - b, { units: "ml" }),
              wrong: wrongs(1000 - a - b, [
                {
                  code: "AS.MULTISTEP.ONE-STEP",
                  value: A.number(1000 - b, { units: "ml" }),
                  feedback: "Take away both amounts that were poured in.",
                },
                {
                  code: "MEA.UNITS.MIXED",
                  value: A.number(100 - a - b, { units: "ml" }),
                  feedback: "1 litre is 1000 ml.",
                },
              ]),
            },
          ],
          solution: [
            { say: `${a} + ${b} = ${a + b} ml.` },
            { say: `1 litre = 1000 ml, and 1000 − ${a + b} = ${1000 - a - b} ml.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "multi-step-context")
      return numberAnswer(question, 1) === 1000 - p.pour[0] - p.pour[1];
    if (question.archetype !== "standard") return true;
    const n = numberAnswer(question);
    return n === p.kg * 1000 + p.g || n === p.metres * 100 - p.cut;
  },
});
