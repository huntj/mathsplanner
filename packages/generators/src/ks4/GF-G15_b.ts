/**
 * @statement GF-G15.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-G15.b: Interpret maps and scale drawings
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { tex } from "../shared/npv.ts";

interface Params {
  scale: number;
  cm: number;
  k: number;
  real: number;
}

const r = (v: number) => Number(v.toFixed(6));

export default defineGenerator<Params>({
  id: "GF-G15.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.SCALE.DIVIDES", "MEA.CONVERT.FACTOR"],

  params(rng) {
    const p = {
      scale: rng.pick([10000, 20000, 25000, 50000, 100000]),
      cm: rng.int(2, 24),
      k: rng.pick([2, 4, 5, 10, 20]),
      real: rng.int(3, 40) * 5,
    };
    if (p.real % p.k !== 0) reject("a whole-number drawing length");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = r((p.cm * p.scale) / 100000);
        return A.standard({
          question: [
            "A map has scale ",
            A.math(`1 : ${tex(p.scale)}`),
            `. Two towns are ${p.cm} cm apart on the map.`,
          ],
          ask: "How far apart are they in real life, in km?",
          answer: A.number(v, { units: "km" }),
          wrong: wrongs(v, [
            {
              code: "MEA.CONVERT.FACTOR",
              value: A.number(r((p.cm * p.scale) / 1000), { units: "km" }),
              feedback: "There are 100 000 cm in a kilometre (100 cm in a metre, 1000 m in a km).",
            },
            {
              code: "GEO.SCALE.DIVIDES",
              value: A.number(r(p.cm / p.scale), { units: "km" }),
              feedback: `Each map centimetre is ${tex(p.scale).replace(/\{,\}/g, " ")} real centimetres: multiply.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `${p.cm} \\times ${tex(p.scale)} = ${tex(p.cm * p.scale)} \\text{ cm} = ${v} \\text{ km}`,
            },
          ],
        });
      }
      case 2: {
        const v = p.real / p.k;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `On a scale drawing, 1 cm represents ${p.k} m. A wall is ${p.real} m long.`,
              ],
              ask: "How long is it on the drawing, in cm?",
            },
            {
              question: [
                `A plan of a park uses 1 cm to represent ${p.k} m. A path is ${p.real} m long.`,
              ],
              ask: "How long should the path be drawn, in cm?",
            },
          ],
          answer: A.number(v, { units: "cm" }),
          wrong: wrongs(v, [
            {
              code: "GEO.SCALE.DIVIDES",
              value: A.number(p.real * p.k, { units: "cm" }),
              feedback: `Going from real life to the drawing makes lengths smaller: divide by ${p.k}.`,
            },
          ]),
          solution: [{ say: "", math: `${p.real} \\div ${p.k} = ${v} \\text{ cm}` }],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: [
            "On a map with scale ",
            A.math(`1 : ${tex(p.scale)}`),
            `, 1 cm on the map is ${tex(p.scale).replace(/\{,\}/g, " ")} km in real life.`,
          ],
          truth: "never",
          reasons: [
            {
              text: `Never. 1 cm on the map is ${tex(p.scale).replace(/\{,\}/g, " ")} cm in real life, which is ${r(p.scale / 100000)} km.`,
              correct: true,
            },
            {
              text: "Always. The scale tells you the number of kilometres.",
              code: "MEA.CONVERT.FACTOR",
            },
            { text: "Sometimes. It depends what units the map uses.", code: "MEA.CONVERT.FACTOR" },
          ],
          solution: [{ say: "A ratio scale has the same units on both sides." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === r((p.cm * p.scale) / 100000);
    if (question.key.depth === 2) return numberAnswer(question) === p.real / p.k;
    return true;
  },
});
