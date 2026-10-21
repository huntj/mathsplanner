/**
 * @statement GF-R2
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-R2: Use scale factors, scale diagrams and maps
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  scale: number;
  cm: number;
  km: number;
  speed: number;
}

const r = (x: number) => Math.round(x * 1000) / 1000;

export default defineGenerator<Params>({
  id: "GF-R2",
  version: "1.0.0",
  depths: [1, 2, 5],
  misconceptions: ["RAT.UNITS.DIRECTION", "GEO.SCALE.DIVIDES"],

  params(rng) {
    return {
      scale: rng.pick([25000, 50000, 100000, 200000]),
      cm: rng.int(3, 18) / 2,
      km: rng.int(2, 12),
      speed: rng.pick([4, 5, 6]),
    };
  },

  build(p, depth): QuestionDraft {
    switch (depth) {
      case 1: {
        const km = r((p.cm * p.scale) / 100000);
        return A.standard({
          question: `A map has a scale of 1 : ${p.scale.toLocaleString("en-GB")}. Two villages are ${p.cm} cm apart on the map.`,
          ask: "How far apart are they in real life, in kilometres?",
          answer: A.number(km, { units: "km" }),
          wrong: wrongs(km, [
            {
              code: "RAT.UNITS.DIRECTION",
              value: A.number(r((p.cm * p.scale) / 1000)),
              feedback: "There are 100 000 cm in a kilometre (100 cm in 1 m, 1000 m in 1 km).",
            },
            {
              code: "GEO.SCALE.DIVIDES",
              value: A.number(r(p.cm / p.scale)),
              feedback:
                "Every map centimetre stands for " +
                p.scale.toLocaleString("en-GB") +
                " real centimetres: multiply.",
            },
          ]),
          solution: [
            {
              say: `${p.cm} × ${p.scale.toLocaleString("en-GB")} = ${(p.cm * p.scale).toLocaleString("en-GB")} cm = ${km} km.`,
            },
          ],
        });
      }
      case 2: {
        const cm = r((p.km * 100000) / p.scale);
        return A.reverse({
          question: `A map has a scale of 1 : ${p.scale.toLocaleString("en-GB")}. Two towns are ${p.km} km apart.`,
          ask: "How far apart are they on the map, in centimetres?",
          answer: A.number(cm, { units: "cm" }),
          wrong: wrongs(cm, [
            {
              code: "RAT.UNITS.DIRECTION",
              value: A.number(r((p.km * 1000) / p.scale)),
              feedback: "Change kilometres to centimetres first: 1 km = 100 000 cm.",
            },
          ]),
          solution: [
            {
              say: `${p.km} km = ${(p.km * 100000).toLocaleString("en-GB")} cm; ÷ ${p.scale.toLocaleString("en-GB")} = ${cm} cm.`,
            },
          ],
        });
      }
      default: {
        const km = r((p.cm * p.scale) / 100000);
        const mins = r((km / p.speed) * 60);
        return A.multiStepContext({
          context: `On a map with scale 1 : ${p.scale.toLocaleString("en-GB")}, a footpath is ${p.cm} cm long. Ana walks at ${p.speed} km/h.`,
          parts: [
            {
              ask: "How long is the footpath in kilometres?",
              answer: A.number(km, { units: "km" }),
            },
            {
              ask: "How many minutes does it take Ana to walk it, to the nearest minute?",
              answer: A.number(Math.round(mins), { units: "minutes", accuracy: { dp: 0 } }),
              wrong: wrongs(mins, [
                {
                  code: "RAT.UNITS.DIRECTION",
                  value: A.number(r(km / p.speed)),
                  feedback: "That is in hours. Multiply by 60 for minutes.",
                },
              ]),
            },
          ],
          solution: [
            { say: `${p.cm} cm × ${p.scale.toLocaleString("en-GB")} = ${km} km.` },
            { say: `${km} ÷ ${p.speed} = ${r(km / p.speed)} hours = ${mins} minutes.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "reverse")
      return Math.abs(numberAnswer(question) * p.scale - p.km * 100000) < 1e-6;
    return Math.abs(numberAnswer(question) * 100000 - p.cm * p.scale) < 1e-3;
  },
});
