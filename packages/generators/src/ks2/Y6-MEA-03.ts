/**
 * @statement Y6-MEA-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-MEA-03: Convert between miles and kilometres
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** Multiples of 5 miles. */
  k: number;
  km: number;
  miles: number;
}

export default defineGenerator<Params>({
  id: "Y6-MEA-03",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MEA.CONVERT.APPROX"],

  params(rng, numbers) {
    const k = rng.int(1, numbers === "friendly" ? 4 : 12);
    const km = rng.pick([5, 10, 21, 42]);
    const miles = rng.int(3, 26);
    if (Math.abs(km * 5 - miles * 8) < 4) reject("a clear comparison");
    return { k, km, miles };
  },

  build(p, depth, rng): QuestionDraft {
    const fact = "5 miles is about 8 km.";
    switch (depth) {
      case 1:
        return A.standard({
          question: fact,
          ask: `About how many kilometres is ${5 * p.k} miles?`,
          answer: A.number(8 * p.k, { units: "km" }),
          wrong: wrongs(8 * p.k, [
            {
              code: "MEA.CONVERT.APPROX",
              value: A.number((25 * p.k) / 8, { units: "km" }),
              feedback:
                "A kilometre is shorter than a mile, so there are more kilometres than miles.",
            },
          ]),
          solution: [
            { say: `${5 * p.k} miles is ${p.k} lots of 5 miles, so ${p.k} × 8 = ${8 * p.k} km.` },
          ],
        });
      case 2:
        return A.reverse({
          question: fact,
          ask: `About how many miles is ${8 * p.k} km?`,
          answer: A.number(5 * p.k, { units: "miles" }),
          wrong: wrongs(5 * p.k, [
            {
              code: "MEA.CONVERT.APPROX",
              value: A.number((64 * p.k) / 5, { units: "miles" }),
              feedback:
                "A mile is longer than a kilometre, so there are fewer miles than kilometres.",
            },
          ]),
          solution: [
            { say: `${8 * p.k} km is ${p.k} lots of 8 km, so ${p.k} × 5 = ${5 * p.k} miles.` },
          ],
        });
      default: {
        const kmInMiles = (p.km * 5) / 8;
        const truth = kmInMiles > p.miles;
        return A.trueOrFalseWhy({
          rng,
          statement: `${fact} Sara says a ${p.km} km race is longer than a ${p.miles} mile race.`,
          truth,
          reasons: [
            {
              text: `${truth ? "True" : "False"}. ${p.km} km is about ${p.km} ÷ 8 × 5 = ${Math.round(kmInMiles * 10) / 10} miles, which is ${truth ? "more" : "less"} than ${p.miles} miles.`,
              correct: true,
            },
            {
              text: `${truth ? "False" : "True"}. ${Math.max(p.km, p.miles)} is the bigger number.`,
              code: "MEA.CONVERT.APPROX",
            },
            {
              text: `${truth ? "False" : "True"}. ${p.km} km is about ${p.km} ÷ 5 × 8 = ${(p.km * 8) / 5} miles.`,
              code: "MEA.CONVERT.APPROX",
            },
          ],
          solution: [
            {
              say: `Convert to the same unit: ${p.km} km ≈ ${Math.round(kmInMiles * 10) / 10} miles.`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return numberAnswer(question) === 8 * p.k;
    if (question.archetype === "reverse") return numberAnswer(question) === 5 * p.k;
    return true;
  },
});
