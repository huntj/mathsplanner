/**
 * @statement Y8-RAT-05
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y8-RAT-05: Use compound units such as speed, unit pricing and density to solve problems
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  speed: number;
  hours: number;
  ask: "speed" | "distance" | "time";
  /** Best buy: a for £pa, b for £pb (pence). */
  a: number;
  pa: number;
  b: number;
  pb: number;
  /** Density in g/cm³ and two volumes. */
  density: number;
  volume: number;
  mass2: number;
}

const pounds = (p: number) => (p / 100).toFixed(2);

export default defineGenerator<Params>({
  id: "Y8-RAT-05",
  version: "1.0.0",
  depths: [1, 2, 5],
  misconceptions: ["RAT.COMPOUND-UNIT.ARRANGEMENT"],

  params(rng, numbers) {
    const speed = rng.int(3, numbers === "stretch" ? 120 : 60);
    const hours = rng.pick([0.5, 1.5, 2, 2.5, 3, 4]);
    const [a, b] = [rng.pick([4, 6, 8, 10]), rng.pick([12, 15, 20, 24])];
    const [pa, pb] = [a * rng.int(20, 90), b * rng.int(20, 90)];
    const density = rng.pick([2, 3, 7, 8, 11]);
    const volume = rng.int(5, 40);
    const mass2 = density * rng.int(5, 40);
    if (pa / a === pb / b || mass2 === density * volume)
      reject("a clear best buy; different blocks");
    if (!Number.isInteger(speed * hours)) reject("a whole number of kilometres");
    return {
      speed,
      hours,
      ask: rng.pick(["speed", "distance", "time"] as const),
      a,
      pa,
      b,
      pb,
      density,
      volume,
      mass2,
    };
  },

  build(p, depth, rng): QuestionDraft {
    const d = p.speed * p.hours;
    switch (depth) {
      case 1: {
        const setups = {
          speed: {
            q: `A cyclist travels ${d} km in ${p.hours} hours.`,
            ask: "What is the average speed, in km/h?",
            answer: p.speed,
            slip: d * p.hours,
            how: `speed = distance ÷ time = ${d} ÷ ${p.hours} = ${p.speed} km/h.`,
          },
          distance: {
            q: `A car travels at ${p.speed} km/h for ${p.hours} hours.`,
            ask: "How far does it travel, in km?",
            answer: d,
            slip: p.speed / p.hours,
            how: `distance = speed × time = ${p.speed} × ${p.hours} = ${d} km.`,
          },
          time: {
            q: `A train travels ${d} km at ${p.speed} km/h.`,
            ask: "How long does the journey take, in hours?",
            answer: p.hours,
            slip: d * p.speed,
            how: `time = distance ÷ speed = ${d} ÷ ${p.speed} = ${p.hours} hours.`,
          },
        } as const;
        const s = setups[p.ask];
        return A.standard({
          question: s.q,
          ask: s.ask,
          answer: A.number(s.answer),
          wrong: wrongs(s.answer, [
            {
              code: "RAT.COMPOUND-UNIT.ARRANGEMENT",
              value: A.number(Number(s.slip.toFixed(4))),
              feedback: "Check the units: km/h means kilometres ÷ hours.",
            },
          ]),
          solution: [{ say: s.how }],
        });
      }
      case 2: {
        const [ua, ub] = [p.pa / p.a, p.pb / p.b];
        const better = ua < ub ? `Pack A` : `Pack B`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `Pack A has ${p.a} pens for £${pounds(p.pa)}. Pack B has ${p.b} pens for £${pounds(p.pb)}.`,
          ask: "Which pack is better value?",
          correct: better,
          distractors: [
            {
              content: better === "Pack A" ? "Pack B" : "Pack A",
              feedback: `Find the cost of one pen: A is ${ua.toFixed(1)}p, B is ${ub.toFixed(1)}p.`,
            },
            {
              content: "They are the same value",
              feedback: `Find the cost of one pen: A is ${ua.toFixed(1)}p, B is ${ub.toFixed(1)}p.`,
            },
          ],
          solution: [
            {
              say: `Cost per pen: A ${p.pa}p ÷ ${p.a} = ${ua.toFixed(1)}p, B ${p.pb}p ÷ ${p.b} = ${ub.toFixed(1)}p. ${better} is cheaper per pen.`,
            },
          ],
        });
      }
      default: {
        const mass = p.density * p.volume;
        const v2 = p.mass2 / p.density;
        return A.multiStepContext({
          context: ["A metal has a density of ", A.math(`${p.density}\\text{ g/cm}^3`), "."],
          parts: [
            {
              ask: `What is the mass of ${p.volume} cm³ of the metal, in grams?`,
              answer: A.number(mass),
              wrong: wrongs(mass, [
                {
                  code: "RAT.COMPOUND-UNIT.ARRANGEMENT",
                  value: A.number(Number((p.volume / p.density).toFixed(4))),
                  feedback: "mass = density × volume.",
                },
              ]),
            },
            {
              ask: `Another piece of the metal has a mass of ${p.mass2} g. What is its volume, in cm³?`,
              answer: A.number(v2),
              wrong: wrongs(v2, [
                {
                  code: "RAT.COMPOUND-UNIT.ARRANGEMENT",
                  value: A.number(p.mass2 * p.density),
                  feedback: "volume = mass ÷ density.",
                },
              ]),
            },
          ],
          solution: [
            { say: `mass = density × volume = ${p.density} × ${p.volume} = ${mass} g.` },
            { say: `volume = mass ÷ density = ${p.mass2} ÷ ${p.density} = ${v2} cm³.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") {
      const want = { speed: p.speed, distance: p.speed * p.hours, time: p.hours }[p.ask];
      return Math.abs(numberAnswer(question) - want) < 1e-9;
    }
    if (question.archetype === "varied-form")
      return chosenText(question) === (p.pa / p.a < p.pb / p.b ? "Pack A" : "Pack B");
    return (
      numberAnswer(question, 0) === p.density * p.volume &&
      numberAnswer(question, 1) * p.density === p.mass2
    );
  },
});
