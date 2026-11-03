/**
 * @statement Y5-MEA-05.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-MEA-05.b: Estimate capacity
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type GeneratorDefinition, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./Y5-MEA-05.ts";
import { withClaims } from "../shared/variety.ts";

interface Params {
  cup: number;
  litres: number;
}

const own: GeneratorDefinition<Params> = {
  id: "Y5-MEA-05.b",
  version: "1.0.0",
  depths: [1, 4],
  misconceptions: ["MEA.CONVERT.FACTOR"],

  params(rng) {
    return { cup: rng.pick([100, 200, 250, 500]), litres: rng.int(1, 3) };
  },

  build(p, depth, rng): QuestionDraft {
    const n = (1000 * p.litres) / p.cup;
    if (depth === 1) {
      return A.standard({
        question: `A jug holds ${p.litres} litre${p.litres > 1 ? "s" : ""}. A cup holds about ${p.cup} ml.`,
        ask: "About how many cups will the jug fill?",
        answer: A.number(n),
        wrong: wrongs(n, [
          {
            code: "MEA.CONVERT.FACTOR",
            value: A.number((100 * p.litres) / p.cup),
            feedback: "1 litre is 1000 ml, not 100 ml.",
          },
        ]),
        solution: [
          {
            say: `${p.litres} litre${p.litres > 1 ? "s" : ""} = ${1000 * p.litres} ml, and ${1000 * p.litres} ÷ ${p.cup} = ${n}.`,
          },
        ],
      });
    }
    return A.trueOrFalseWhy({
      rng,
      statement: "Max says a mug of tea holds about 3 litres.",
      truth: false,
      reasons: [
        {
          text: "False. A mug holds about 250 ml to 350 ml. 3 litres would fill about ten mugs.",
          correct: true,
        },
        { text: "True. A litre is a small amount, like a spoonful.", code: "MEA.CONVERT.FACTOR" },
        { text: "True. Mugs and buckets hold about the same." },
      ],
      solution: [
        {
          say: "Use known amounts: a mug holds about 300 ml and a large bottle of water holds about 2 litres.",
        },
      ],
    });
  },

  verify(p, question) {
    return question.key.depth !== 1 || numberAnswer(question) === (1000 * p.litres) / p.cup;
  },
};

export default defineGenerator(
  withClaims(
    mixFamilies("Y5-MEA-05.b", { 1: own, 2: { ...parent.definition, id: "Y5-MEA-05.b" }, 4: own }),
    [
      {
        statement: "Ana says a bucket holds about 10 litres.",
        truth: true,
        right: "True. A household bucket holds around 10 litres.",
        wrong: [
          ["False. It holds about 10 ml.", "MEA.CONVERT.FACTOR"],
          ["False. It holds about 1000 litres.", "MEA.COMPARE.LOOKS"],
        ],
      },
      {
        statement: "Raj says a teaspoon holds about 5 litres.",
        truth: false,
        right: "False. A teaspoon holds about 5 ml. 5 litres would fill a large saucepan.",
        wrong: [
          ["True. Litres measure small amounts.", "MEA.CONVERT.FACTOR"],
          ["True. A teaspoon holds a lot."],
        ],
      },
      {
        claim: "A container that looks taller holds more.",
        truth: "sometimes",
        right: "Sometimes. A wide bowl can hold more than a tall thin glass.",
        wrong: [
          ["Always. Taller means more.", "MEA.COMPARE.LOOKS"],
          ["Never. Shorter containers hold more.", "MEA.VOLUME.ADDS"],
        ],
      },
    ],
  ),
);
