/**
 * @statement Y7-RAT-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-RAT-01.b: Convert units of area and volume
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  m2: number;
  cm3: number;
}

const r = (v: number) => Number(v.toFixed(6));

export default defineGenerator<Params>({
  id: "Y7-RAT-01.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.UNITS.AREA-FACTOR", "RAT.UNITS.DIRECTION"],

  params(rng) {
    return { m2: rng.int(2, 15), cm3: rng.int(2, 40) * 250 };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = p.m2 * 10000;
        return A.standard({
          question: [`Convert ${p.m2} m² to cm².`],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "RAT.UNITS.AREA-FACTOR",
              value: A.number(p.m2 * 100),
              feedback: "1 m² is a square 100 cm by 100 cm, so it is 10 000 cm².",
            },
          ]),
          solution: [{ say: "", math: `${p.m2} \\times 100 \\times 100 = ${v}` }],
        });
      }
      case 2: {
        const v = r(p.cm3 / 1000);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`A tank holds ${p.cm3} cm³ of water. 1 litre = 1000 cm³.`],
              ask: "How many litres is that?",
            },
            {
              question: [`A carton has a volume of ${p.cm3} cm³. 1 litre = 1000 cm³.`],
              ask: "What is its volume in litres?",
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "RAT.UNITS.DIRECTION",
              value: A.number(p.cm3 * 1000),
              feedback: "Litres are bigger than cm³, so divide by 1000.",
            },
          ]),
          solution: [{ say: "", math: `${p.cm3} \\div 1000 = ${v}` }],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["1 cm³ = 10 mm³."],
          truth: "never",
          reasons: [
            {
              text: "Never. A 1 cm cube is 10 mm by 10 mm by 10 mm, so 1 cm³ = 1000 mm³.",
              correct: true,
            },
            { text: "Always. 1 cm = 10 mm.", code: "RAT.UNITS.AREA-FACTOR" },
            { text: "Sometimes. It depends on the shape.", code: "RAT.UNITS.AREA-FACTOR" },
          ],
          solution: [{ say: "Cube the length factor for volume." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.m2 * 10000;
    if (question.key.depth === 2) return numberAnswer(question) === r(p.cm3 / 1000);
    return true;
  },
});
