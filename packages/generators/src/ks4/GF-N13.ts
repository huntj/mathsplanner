/**
 * @statement GF-N13
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-N13: Use standard units of mass, length, time, money and other measures (including standard
// compound measures) using decimal quantities where appropriate
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  hours: number;
  quarters: number;
  speed: number;
  minutes: number;
  dist: number;
  kg: number;
  pricePerKg: number;
}

export default defineGenerator<Params>({
  id: "GF-N13",
  version: "1.0.0",
  depths: [1, 2, 5],
  misconceptions: ["MEA.TIME.DECIMAL", "RAT.COMPOUND-UNIT.ARRANGEMENT", "MEA.CONVERT.FACTOR"],

  params(rng) {
    const minutes = rng.pick([15, 30, 45, 20, 40]);
    const speed = rng.int(4, 16) * 5;
    const dist = (speed * minutes) / 60;
    if (!Number.isInteger(dist * 2)) reject("a distance to the nearest half kilometre");
    return {
      hours: rng.int(1, 4),
      quarters: rng.int(1, 3),
      speed,
      minutes,
      dist,
      kg: rng.int(2, 9) / 2,
      pricePerKg: rng.int(120, 480),
    };
  },

  build(p, depth): QuestionDraft {
    switch (depth) {
      case 1: {
        const h = p.hours + p.quarters / 4;
        const m = h * 60;
        return A.standard({
          question: `A journey takes ${h} hours.`,
          ask: "How long is that in minutes?",
          answer: A.number(m, { units: "minutes" }),
          wrong: wrongs(m, [
            {
              code: "MEA.TIME.DECIMAL",
              value: A.number(p.hours * 60 + Number(String(h).split(".")[1] ?? 0)),
              feedback: `0.${String(h).split(".")[1]} of an hour is not ${String(h).split(".")[1]} minutes: it is ${(p.quarters / 4) * 60} minutes.`,
            },
          ]),
          solution: [{ say: `${h} × 60 = ${m} minutes.` }],
        });
      }
      case 2:
        return A.standard({
          question: `A cyclist travels ${p.dist} km in ${p.minutes} minutes.`,
          ask: "What is her average speed in km/h?",
          answer: A.number(p.speed, { units: "km/h" }),
          wrong: wrongs(p.speed, [
            {
              code: "MEA.TIME.DECIMAL",
              value: A.number(Math.round((p.dist / (p.minutes / 100)) * 100) / 100),
              feedback: `${p.minutes} minutes is ${p.minutes / 60} hours, not 0.${p.minutes}.`,
            },
            {
              code: "RAT.COMPOUND-UNIT.ARRANGEMENT",
              value: A.number(Math.round(p.dist * (p.minutes / 60) * 100) / 100),
              feedback: "Speed = distance ÷ time.",
            },
          ]),
          solution: [
            {
              say: `${p.minutes} minutes = ${p.minutes / 60} hours. Speed = ${p.dist} ÷ ${p.minutes / 60} = ${p.speed} km/h.`,
            },
          ],
        });
      default: {
        const cost = Math.round(p.kg * p.pricePerKg);
        return A.multiStepContext({
          context: `Cheese costs £${(p.pricePerKg / 100).toFixed(2)} per kilogram. Amy buys ${p.kg * 1000} g.`,
          parts: [
            {
              ask: "How many kilograms does she buy?",
              answer: A.number(p.kg, { units: "kg" }),
              wrong: wrongs(p.kg, [
                {
                  code: "MEA.CONVERT.FACTOR",
                  value: A.number(p.kg * 10),
                  feedback: "1 kg = 1000 g, so divide by 1000.",
                },
              ]),
            },
            {
              ask: "How much does it cost, to the nearest penny?",
              answer: A.number(cost / 100, { units: "£" }),
            },
          ],
          solution: [
            { say: `${p.kg * 1000} g = ${p.kg} kg.` },
            { say: `${p.kg} × £${(p.pricePerKg / 100).toFixed(2)} = £${(cost / 100).toFixed(2)}.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") {
      const n = numberAnswer(question);
      return n === (p.hours + p.quarters / 4) * 60 || n === p.speed;
    }
    return numberAnswer(question) === p.kg;
  },
});
