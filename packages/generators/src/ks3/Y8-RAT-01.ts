/**
 * @statement Y8-RAT-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y8-RAT-01: Use scale factors, scale diagrams and maps
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** Map scale 1 : s; s cm on the ground per cm on the map. */
  s: number;
  /** Map distance in tenths of a centimetre. */
  mm: number;
  claimTrue: boolean;
}

const SCALES = [10000, 20000, 25000, 50000, 100000];
const tidy = (x: number) => Number(x.toPrecision(12));

export default defineGenerator<Params>({
  id: "Y8-RAT-01",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.UNITS.DIRECTION"],

  params(rng, numbers) {
    const s = rng.pick(numbers === "friendly" ? [50000, 100000] : SCALES);
    const mm = numbers === "friendly" ? rng.int(1, 12) * 10 : rng.int(5, 150);
    if ((mm * s) % 10000 !== 0) reject("a distance in whole metres");
    return { s, mm, claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const cm = p.mm / 10;
    const km = tidy((cm * p.s) / 100000);
    const metres = tidy((cm * p.s) / 100);
    const scale = A.math(`1:${p.s.toLocaleString("en-GB").replace(/,/g, "{,}")}`);
    const how = `${cm} cm on the map is ${cm} × ${p.s.toLocaleString("en-GB")} = ${(cm * p.s).toLocaleString("en-GB")} cm on the ground. There are 100,000 cm in 1 km, so that is ${km} km.`;
    switch (depth) {
      case 1:
        return A.standard({
          question: ["A map has a scale of ", scale, `. Two towns are ${cm} cm apart on the map.`],
          ask: "How far apart are they in real life, in kilometres?",
          answer: A.number(km),
          wrong: wrongs(km, [
            {
              code: "RAT.UNITS.DIRECTION",
              value: A.number(metres),
              feedback: "That is in metres. Divide by 1000 to change metres to kilometres.",
            },
          ]),
          solution: [{ say: how }],
        });
      case 2:
        return A.reverse({
          question: ["A map has a scale of ", scale, `. Two villages are ${km} km apart.`],
          ask: "How far apart are they on the map, in centimetres?",
          answer: A.number(cm),
          wrong: wrongs(cm, [
            {
              code: "RAT.UNITS.DIRECTION",
              value: A.number(tidy((km * 1000) / p.s)),
              feedback: "Change kilometres to centimetres first: 1 km = 100,000 cm.",
            },
          ]),
          solution: [
            {
              say: `${km} km = ${(km * 100000).toLocaleString("en-GB")} cm. Divide by ${p.s.toLocaleString("en-GB")}: ${cm} cm.`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "On a map with scale ",
            scale,
            `, Owen says ${cm} cm stands for ${p.claimTrue ? `${km} km` : `${(cm * p.s).toLocaleString("en-GB")} km`}.`,
          ],
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                { text: `True. ${how}`, correct: true },
                {
                  text: `False. Multiply by ${p.s.toLocaleString("en-GB")} and the answer is in kilometres.`,
                  code: "RAT.UNITS.DIRECTION",
                },
                { text: "False. Map distances are always the same as real ones." },
              ]
            : [
                { text: `False. ${how}`, correct: true },
                {
                  text: `True. Multiply by ${p.s.toLocaleString("en-GB")} and the answer is in kilometres.`,
                  code: "RAT.UNITS.DIRECTION",
                },
                { text: "True. Real distances are always bigger." },
              ],
          solution: [{ say: how }],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return Math.abs(numberAnswer(question) - ((p.mm / 10) * p.s) / 100000) < 1e-9;
    if (question.archetype === "reverse")
      return Math.abs(numberAnswer(question) - p.mm / 10) < 1e-9;
    return true;
  },
});
