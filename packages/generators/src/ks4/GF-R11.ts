/**
 * @statement GF-R11
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-R11: Use compound units such as speed, rates of pay, unit pricing, density and pressure
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  mass: number;
  vol: number;
  smallG: number;
  smallP: number;
  bigG: number;
  bigP: number;
  force: number;
  area: number;
  dist: number;
  speed: number;
}

const r2 = (x: number) => Math.round(x * 100) / 100;

export default defineGenerator<Params>({
  id: "GF-R11",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: ["RAT.COMPOUND-UNIT.ARRANGEMENT", "MEA.TIME.DECIMAL"],

  params(rng) {
    const vol = rng.int(5, 40) * 5;
    const density = rng.pick([0.8, 1.5, 2.5, 7.8, 11.3]);
    const smallG = rng.pick([250, 400, 500]);
    const bigG = smallG * rng.pick([2, 3]);
    const smallP = rng.int(80, 250);
    const bigP = Math.round(smallP * (bigG / smallG) * rng.pick([0.85, 0.9, 1.1, 1.15]));
    const speed = rng.int(8, 14) * 5;
    const dist = speed * rng.pick([1.5, 2.25, 2.5, 3.75]);
    if (!Number.isInteger(dist)) reject("a whole-number distance");
    return {
      mass: r2(vol * density),
      vol,
      smallG,
      smallP,
      bigG,
      bigP,
      force: rng.int(2, 20) * 10,
      area: rng.pick([2, 4, 5, 8]),
      dist,
      speed,
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const density = r2(p.mass / p.vol);
        return A.standard({
          question: `A block of metal has a mass of ${p.mass} g and a volume of ${p.vol} cm³.`,
          ask: "Work out its density in g/cm³.",
          answer: A.number(density, { units: "g/cm³" }),
          wrong: wrongs(density, [
            {
              code: "RAT.COMPOUND-UNIT.ARRANGEMENT",
              value: A.number(r2(p.vol / p.mass)),
              feedback: "Density = mass ÷ volume.",
            },
          ]),
          solution: [{ say: `${p.mass} ÷ ${p.vol} = ${density} g/cm³.` }],
        });
      }
      case 2: {
        const perSmall = p.smallP / p.smallG;
        const perBig = p.bigP / p.bigG;
        const big = perBig < perSmall;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `Cereal comes in a ${p.smallG} g box for £${(p.smallP / 100).toFixed(2)} or a ${p.bigG} g box for £${(p.bigP / 100).toFixed(2)}.`,
          ask: "Which box is better value?",
          correct: big ? `the ${p.bigG} g box` : `the ${p.smallG} g box`,
          distractors: [
            {
              content: big ? `the ${p.smallG} g box` : `the ${p.bigG} g box`,
              code: "RAT.COMPOUND-UNIT.ARRANGEMENT",
              feedback: `Compare the price per gram: ${r2(perSmall)}p and ${r2(perBig)}p.`,
            },
            { content: "They are the same value", feedback: "Work out the cost of 100 g in each." },
          ],
          solution: [
            {
              say: `Per 100 g: ${r2(perSmall * 100)}p and ${r2(perBig * 100)}p. The cheaper per gram is better value.`,
            },
          ],
        });
      }
      case 4: {
        const pressure = p.force / p.area;
        return A.trueOrFalseWhy({
          rng,
          statement: `A force of ${p.force} N acts on an area of ${p.area} m². Leo says the pressure is ${p.force * p.area} N/m².`,
          truth: false,
          reasons: [
            {
              text: `False. Pressure = force ÷ area = ${p.force} ÷ ${p.area} = ${pressure} N/m².`,
              correct: true,
            },
            { text: "True. Pressure = force × area.", code: "RAT.COMPOUND-UNIT.ARRANGEMENT" },
            {
              text: "True. A bigger area gives a bigger pressure.",
              code: "RAT.COMPOUND-UNIT.ARRANGEMENT",
            },
          ],
          solution: [{ say: "The units tell you: N/m² means newtons divided by square metres." }],
        });
      }
      default: {
        const hours = p.dist / p.speed;
        const h = Math.floor(hours);
        const m = Math.round((hours - h) * 60);
        return A.multiStepContext({
          context: `A coach travels ${p.dist} km at an average speed of ${p.speed} km/h.`,
          parts: [
            {
              ask: "How many hours does the journey take? Give your answer as a decimal.",
              answer: A.number(hours, { units: "hours" }),
              wrong: wrongs(hours, [
                {
                  code: "RAT.COMPOUND-UNIT.ARRANGEMENT",
                  value: A.number(p.dist * p.speed),
                  feedback: "Time = distance ÷ speed.",
                },
              ]),
            },
            {
              ask: "How many minutes is the part of an hour?",
              answer: A.number(m, { units: "minutes" }),
              wrong: wrongs(m, [
                {
                  code: "MEA.TIME.DECIMAL",
                  value: A.number(Math.round((hours - h) * 100)),
                  feedback: `0.${String(hours).split(".")[1]} of an hour is ${m} minutes: multiply by 60.`,
                },
              ]),
            },
          ],
          solution: [
            { say: `${p.dist} ÷ ${p.speed} = ${hours} hours.` },
            { say: `${r2(hours - h)} × 60 = ${m} minutes, so ${h} h ${m} min.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return Math.abs(numberAnswer(question) - p.mass / p.vol) < 0.006;
    if (question.archetype === "varied-form")
      return chosenText(question).includes(
        String(p.bigP / p.bigG < p.smallP / p.smallG ? p.bigG : p.smallG),
      );
    if (question.archetype === "multi-step-context")
      return numberAnswer(question) === p.dist / p.speed;
    return true;
  },
});
