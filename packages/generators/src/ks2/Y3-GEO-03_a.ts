/**
 * @statement Y3-GEO-03.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-GEO-03.a: Identify right angles
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type GeneratorDefinition, type QuestionDraft } from "@mathsplanner/core";
import { angle, type GeometrySpec } from "@mathsplanner/diagrams";
import { pickAngle } from "../shared/angles.ts";
import { chosenFigure } from "../shared/counting.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./Y3-GEO-03.ts";

interface Params {
  small: number;
  large: number;
  rotation: number;
}

const own: GeneratorDefinition<Params> = {
  id: "Y3-GEO-03.a",
  version: "1.0.0",
  depths: [1, 4],
  misconceptions: ["GEO.ANGLES.SIZE-BY-ARMS", "GEO.SHAPES.ORIENTATION"],

  params(rng, numbers) {
    return {
      small: pickAngle(rng, "friendly", 40, 75),
      large: pickAngle(rng, "friendly", 105, 150),
      rotation: numbers === "friendly" ? 0 : rng.int(15, 75),
    };
  },

  build(p, depth, rng): QuestionDraft {
    if (depth === 1) {
      return A.chooseTheDiagram({
        rng,
        question: ["Which angle is a right angle?"],
        correct: angle(90, { rotation: p.rotation }),
        distractors: [
          {
            figure: angle(p.small, { rotation: p.rotation }),
            feedback: "That angle is narrower than the corner of a piece of paper.",
          },
          {
            figure: angle(p.large, { rotation: p.rotation }),
            feedback: "That angle is wider than the corner of a piece of paper.",
          },
        ],
        solution: [
          {
            say: "A right angle is a quarter turn: it fits exactly into the corner of a piece of paper.",
          },
        ],
      });
    }
    return A.trueOrFalseWhy({
      rng,
      statement: [
        "Two right angles are drawn, one with arms twice as long as the other.",
        A.figure(angle(90, { rotation: p.rotation, arms: [4, 4] })),
        "Ali says the one with longer arms is a bigger angle.",
      ],
      truth: false,
      reasons: [
        {
          text: "False. Both are quarter turns. The size of an angle is the amount of turn, not the length of the arms.",
          correct: true,
        },
        { text: "True. Longer arms make a bigger angle.", code: "GEO.ANGLES.SIZE-BY-ARMS" },
        { text: "True. A right angle must have short arms.", code: "GEO.ANGLES.SIZE-BY-ARMS" },
      ],
      solution: [{ say: "Every right angle is the same size: a quarter of a whole turn." }],
    });
  },

  verify(_p, question) {
    if (question.key.depth !== 1) return true;
    return (chosenFigure(question) as GeometrySpec | undefined)?.angles?.[0]?.right === true;
  },
};

export default defineGenerator(
  mixFamilies("Y3-GEO-03.a", { 1: own, 2: { ...parent.definition, id: "Y3-GEO-03.a" }, 4: own }),
);
