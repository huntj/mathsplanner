/**
 * @statement Y3-MEA-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-MEA-01.a: Measure lengths in m, cm and mm
import * as A from "@mathsplanner/archetypes";
import {
  defineGenerator,
  reject,
  type GeneratorDefinition,
  type QuestionDraft,
} from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { ruler } from "../shared/mea.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./Y3-MEA-01.ts";

interface Params {
  /** The pencil's length in mm, starting at 0. */
  mm: number;
}

const own: GeneratorDefinition<Params> = {
  id: "Y3-MEA-01.a",
  version: "1.0.0",
  depths: [1, 4],
  misconceptions: ["MEA.CONVERT.FACTOR"],

  params(rng) {
    const mm = rng.int(21, 99);
    if (mm % 10 === 0) reject("a length between centimetres");
    return { mm };
  },

  build(p, depth, rng): QuestionDraft {
    const cm = Math.floor(p.mm / 10);
    if (depth === 1) {
      return A.standard({
        question: [
          "A pencil lies along a ruler marked in centimetres and millimetres.",
          A.figure(ruler(10, 0, p.mm / 10)),
        ],
        ask: "How long is the pencil in millimetres?",
        answer: A.number(p.mm, { units: "mm" }),
        wrong: wrongs(p.mm, [
          {
            code: "MEA.CONVERT.FACTOR",
            value: A.number(cm + (p.mm % 10), { units: "mm" }),
            feedback: `Each centimetre is 10 mm, so ${cm} cm is ${10 * cm} mm. Then count on the small marks.`,
          },
        ]),
        solution: [
          { say: `${cm} cm is ${10 * cm} mm, and ${p.mm % 10} more small marks make ${p.mm} mm.` },
        ],
      });
    }
    return A.trueOrFalseWhy({
      rng,
      statement: `Zara says ${cm} cm is the same as ${100 * cm} mm.`,
      truth: false,
      reasons: [
        { text: `False. 1 cm = 10 mm, so ${cm} cm = ${10 * cm} mm.`, correct: true },
        { text: "True. There are 100 mm in every centimetre.", code: "MEA.CONVERT.FACTOR" },
        {
          text: "True. Millimetres are 100 times smaller, like centimetres and metres.",
          code: "MEA.CONVERT.FACTOR",
        },
      ],
      solution: [{ say: "1 cm = 10 mm and 1 m = 100 cm." }],
    });
  },

  verify(p, question) {
    return question.key.depth !== 1 || numberAnswer(question) === p.mm;
  },
};

export default defineGenerator(
  mixFamilies("Y3-MEA-01.a", { 1: own, 2: { ...parent.definition, id: "Y3-MEA-01.a" }, 4: own }),
);
