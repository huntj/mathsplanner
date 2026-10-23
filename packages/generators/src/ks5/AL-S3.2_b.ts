/**
 * @statement AL-S3.2.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-S3.2.b: Find conditional probabilities from tree diagrams and two-way tables
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type GeneratorDefinition, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./AL-S3.2.ts";

interface Params {
  /** P(rain) and P(late | rain), P(late | dry), in tenths. */
  rain: number;
  lateRain: number;
  lateDry: number;
}

const r4 = (x: number) => Math.round(x * 10000) / 10000;

const own: GeneratorDefinition<Params> = {
  id: "AL-S3.2.b",
  version: "1.0.0",
  depths: [1, 4],
  misconceptions: ["PRO.TREE.ADD-ALONG", "PRO.CONDITIONAL.FORMULA"],

  params(rng) {
    return { rain: rng.int(1, 6) / 10, lateRain: rng.int(3, 8) / 10, lateDry: rng.int(1, 3) / 10 };
  },

  build(p, depth, rng): QuestionDraft {
    const intro = `The probability that it rains on a school day is ${p.rain}. If it rains, the probability that Tom is late is ${p.lateRain}; if it is dry, the probability is ${p.lateDry}.`;
    const late = r4(p.rain * p.lateRain + (1 - p.rain) * p.lateDry);
    if (depth === 1) {
      return A.standard({
        question: intro,
        ask: "Find the probability that Tom is late, to 4 decimal places.",
        answer: A.number(late, { accuracy: { dp: 4 } }),
        wrong: wrongs(late, [
          {
            code: "PRO.TREE.ADD-ALONG",
            value: A.number(r4(p.rain + p.lateRain), { accuracy: { dp: 4 } }),
            feedback: "Multiply along each branch, then add the branches that end in 'late'.",
          },
        ]),
        solution: [
          {
            say: "",
            math: `${p.rain} \\times ${p.lateRain} + ${r4(1 - p.rain)} \\times ${p.lateDry} = ${late}`,
          },
        ],
      });
    }
    const given = r4((p.rain * p.lateRain) / late);
    return A.trueOrFalseWhy({
      rng,
      statement: `${intro} Tom is late. Eli says the probability that it rained is ${p.lateRain}.`,
      truth: false,
      reasons: [
        {
          text: `False. ${p.lateRain} is P(late | rain). P(rain | late) = P(rain and late)/P(late) = ${r4(p.rain * p.lateRain)}/${late} ≈ ${given}.`,
          correct: true,
        },
        {
          text: "True. P(rain | late) is the same as P(late | rain).",
          code: "PRO.CONDITIONAL.FORMULA",
        },
        {
          text: "True. The branch probability answers every question about that branch.",
          code: "PRO.CONDITIONAL.FORMULA",
        },
      ],
      solution: [{ say: "", math: `P(R \\mid L) = \\frac{P(R \\cap L)}{P(L)}` }],
    });
  },

  verify(p, question) {
    return (
      question.key.depth !== 1 ||
      numberAnswer(question) === r4(p.rain * p.lateRain + (1 - p.rain) * p.lateDry)
    );
  },
};

export default defineGenerator(
  mixFamilies("AL-S3.2.b", { 1: own, 2: { ...parent.definition, id: "AL-S3.2.b" }, 4: own }),
);
