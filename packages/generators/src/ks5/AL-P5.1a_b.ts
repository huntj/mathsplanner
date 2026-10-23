/**
 * @statement AL-P5.1a.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P5.1a.b: Use the sine rule
import * as A from "@mathsplanner/archetypes";
import {
  defineGenerator,
  reject,
  type GeneratorDefinition,
  type QuestionDraft,
} from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { mixFamilies } from "../shared/npv.ts";
import { r1, rad } from "../shared/trig.ts";
import parent from "./AL-P5.1a.ts";

interface Params {
  /** Angles A and B, and side a opposite A. */
  angA: number;
  angB: number;
  a: number;
}

const own: GeneratorDefinition<Params> = {
  id: "AL-P5.1a.b",
  version: "1.0.0",
  depths: [1, 4],
  misconceptions: ["GEO.SINE-RULE.PAIR"],

  params(rng) {
    const p = { angA: rng.int(30, 80), angB: rng.int(30, 80), a: rng.int(5, 15) };
    if (Math.abs(p.angA - p.angB) < 8 || p.angA + p.angB > 150)
      reject("clearly different angles in a real triangle");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const b = r1((p.a * Math.sin(rad(p.angB))) / Math.sin(rad(p.angA)));
    const C = 180 - p.angA - p.angB;
    const wrong = r1((p.a * Math.sin(rad(p.angA))) / Math.sin(rad(p.angB)));
    if (depth === 1) {
      return A.standard({
        question: `In triangle ABC, angle A = ${p.angA}°, angle B = ${p.angB}° and BC = ${p.a} cm.`,
        ask: "Find AC, to 1 decimal place.",
        answer: A.number(b, { units: "cm", accuracy: { dp: 1 } }),
        wrong: wrongs(b, [
          {
            code: "GEO.SINE-RULE.PAIR",
            value: A.number(wrong, { units: "cm", accuracy: { dp: 1 } }),
            feedback:
              "Pair each side with the angle opposite it: BC with angle A, AC with angle B.",
          },
        ]),
        solution: [
          {
            say: "",
            math: `\\frac{AC}{\\sin ${p.angB}^\\circ} = \\frac{${p.a}}{\\sin ${p.angA}^\\circ} \\Rightarrow AC = ${b}\\text{ cm}`,
          },
        ],
      });
    }
    return A.trueOrFalseWhy({
      rng,
      statement: `In triangle ABC, angle A = ${p.angA}°, angle B = ${p.angB}° and BC = ${p.a} cm. Ola writes AC/sin ${p.angA}° = ${p.a}/sin ${p.angB}°.`,
      truth: false,
      reasons: [
        {
          text: `False. Each side goes with the angle opposite it: BC is opposite A and AC is opposite B, so AC/sin ${p.angB}° = ${p.a}/sin ${p.angA}°.`,
          correct: true,
        },
        { text: "True. Any side can go with any angle.", code: "GEO.SINE-RULE.PAIR" },
        {
          text: `True. The third angle, ${C}°, is not needed, so the order does not matter.`,
          code: "GEO.SINE-RULE.PAIR",
        },
      ],
      solution: [{ say: "", math: "\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}" }],
    });
  },

  verify(p, question) {
    return (
      question.key.depth !== 1 ||
      numberAnswer(question) === r1((p.a * Math.sin(rad(p.angB))) / Math.sin(rad(p.angA)))
    );
  },
};

export default defineGenerator(
  mixFamilies("AL-P5.1a.b", { 1: own, 2: { ...parent.definition, id: "AL-P5.1a.b" }, 4: own }),
);
