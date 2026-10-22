/**
 * @statement GH-G19
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GH-G19: Use area and volume scale factors in similar figures
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** Length scale factor k. */
  k: number;
  area: number;
  volume: number;
  solid: "cylinder" | "cone" | "jug";
}

export default defineGenerator<Params>({
  id: "GH-G19",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: ["RAT.SCALE.AREA-LINEAR"],

  params(rng) {
    return {
      k: rng.int(2, 4),
      area: rng.int(3, 15) * 5,
      volume: rng.int(2, 20) * 10,
      solid: rng.pick(["cylinder", "cone", "jug"] as const),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const big = p.area * p.k * p.k;
        return A.standard({
          question: `Two similar shapes have lengths in the ratio 1 : ${p.k}. The smaller shape has an area of ${p.area} cm².`,
          ask: "Work out the area of the larger shape.",
          answer: A.number(big, { units: "cm²" }),
          wrong: wrongs(big, [
            {
              code: "RAT.SCALE.AREA-LINEAR",
              value: A.number(p.area * p.k, { units: "cm²" }),
              feedback: `Areas scale by the square of the length scale factor: ${p.k}² = ${p.k * p.k}.`,
            },
          ]),
          solution: [
            {
              say: `Area scale factor ${p.k}² = ${p.k * p.k}, so ${p.area} × ${p.k * p.k} = ${big} cm².`,
            },
          ],
        });
      }
      case 2: {
        const sa = p.area;
        const big = p.volume * p.k ** 3;
        return A.variedForm({
          rng,
          forms: [
            {
              question: `Two similar ${p.solid}s have surface areas ${sa} cm² and ${sa * p.k * p.k} cm². The smaller ${p.solid} has a volume of ${p.volume} cm³.`,
              ask: `Work out the volume of the larger ${p.solid}.`,
            },
            {
              question: `A ${p.solid} has volume ${p.volume} cm³ and surface area ${sa} cm². A similar ${p.solid} has surface area ${sa * p.k * p.k} cm².`,
              ask: "What is its volume?",
            },
          ],
          answer: A.number(big, { units: "cm³" }),
          wrong: wrongs(big, [
            {
              code: "RAT.SCALE.AREA-LINEAR",
              value: A.number(p.volume * p.k * p.k, { units: "cm³" }),
              feedback: `The area scale factor is ${p.k * p.k}, so the length scale factor is ${p.k} and the volume scale factor is ${p.k}³ = ${p.k ** 3}.`,
            },
          ]),
          solution: [
            {
              say: `Area scale factor ${p.k * p.k}, so the length scale factor is √${p.k * p.k} = ${p.k}.`,
            },
            {
              say: `Volume scale factor ${p.k}³ = ${p.k ** 3}: ${p.volume} × ${p.k ** 3} = ${big} cm³.`,
            },
          ],
        });
      }
      case 4:
        return A.trueOrFalseWhy({
          rng,
          statement: `A model ${p.solid} is made with every length ${p.k} times as long as the original. Tia says it holds ${p.k} times as much.`,
          truth: false,
          reasons: [
            {
              text: `False. Volume scales by the cube of the length scale factor: ${p.k}³ = ${p.k ** 3} times as much.`,
              correct: true,
            },
            {
              text: "True. Every length is multiplied by the same number, so the volume is too.",
              code: "RAT.SCALE.AREA-LINEAR",
            },
            { text: `False. It holds ${p.k * p.k} times as much.`, code: "RAT.SCALE.AREA-LINEAR" },
          ],
          solution: [{ say: `Length × ${p.k}, area × ${p.k * p.k}, volume × ${p.k ** 3}.` }],
        });
      default: {
        const big = p.volume * p.k ** 3;
        return A.multiStepContext({
          context: `Two similar ${p.solid}s have volumes ${p.volume} cm³ and ${big} cm³.`,
          parts: [
            {
              ask: "Work out the length scale factor from the smaller to the larger.",
              answer: A.number(p.k),
              wrong: wrongs(p.k, [
                {
                  code: "RAT.SCALE.AREA-LINEAR",
                  value: A.number(p.k ** 3),
                  feedback: `That is the volume scale factor; take its cube root.`,
                },
              ]),
            },
            {
              ask: `The smaller ${p.solid} has a surface area of ${p.area} cm². Work out the surface area of the larger one.`,
              answer: A.number(p.area * p.k * p.k, { units: "cm²" }),
              wrong: wrongs(p.area * p.k * p.k, [
                {
                  code: "RAT.SCALE.AREA-LINEAR",
                  value: A.number(p.area * p.k ** 3, { units: "cm²" }),
                  feedback: "Areas scale by the square of the length scale factor, not the cube.",
                },
              ]),
            },
          ],
          solution: [
            {
              say: `Volume scale factor ${big} ÷ ${p.volume} = ${p.k ** 3}, so the length scale factor is ∛${p.k ** 3} = ${p.k}.`,
            },
            { say: `Area: ${p.area} × ${p.k}² = ${p.area * p.k * p.k} cm².` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.area * p.k * p.k;
    if (question.key.depth === 2) return numberAnswer(question) === p.volume * p.k ** 3;
    return true;
  },
});
