/**
 * @statement Y3-GEO-03.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-GEO-03.c: Identify angles greater or less than a right angle
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type GeneratorDefinition, type QuestionDraft } from "@mathsplanner/core";
import { angle } from "@mathsplanner/diagrams";
import { pickAngle } from "../shared/angles.ts";
import { chosenText } from "../shared/counting.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./Y3-GEO-03.ts";

interface Params {
  degrees: number;
  rotation: number;
  arms: [number, number];
}

const answerFor = (d: number) =>
  d < 90 ? "Less than a right angle" : "Greater than a right angle";

const own: GeneratorDefinition<Params> = {
  id: "Y3-GEO-03.c",
  version: "1.0.0",
  depths: [1, 4],
  misconceptions: ["GEO.ANGLES.SIZE-BY-ARMS"],

  params(rng, numbers) {
    const small = rng.bool();
    const degrees = small
      ? pickAngle(rng, "friendly", numbers === "stretch" ? 65 : 30, numbers === "stretch" ? 80 : 60)
      : pickAngle(
          rng,
          "friendly",
          numbers === "stretch" ? 100 : 120,
          numbers === "stretch" ? 115 : 160,
        );
    // Long arms on a small angle and short arms on a big one, to test size-by-arms.
    return { degrees, rotation: rng.int(0, 60), arms: small ? [5, 5] : [2, 2] };
  },

  build(p, depth, rng): QuestionDraft {
    if (depth === 1) {
      const right = answerFor(p.degrees);
      return A.choice({
        rng,
        question: [
          "Look at this angle.",
          A.figure(angle(p.degrees, { rotation: p.rotation, arms: p.arms })),
        ],
        ask: "Is it less than or greater than a right angle?",
        correct: right,
        distractors: [
          {
            content: answerFor(180 - p.degrees),
            code: "GEO.ANGLES.SIZE-BY-ARMS",
            feedback: "Look at how far apart the arms open, not how long they are.",
          },
          {
            content: "Exactly a right angle",
            feedback: "Check it against the corner of a piece of paper.",
          },
        ],
        solution: [
          { say: `The angle is ${p.degrees < 90 ? "narrower" : "wider"} than a square corner.` },
        ],
      });
    }
    return A.alwaysSometimesNever({
      rng,
      claim: ["Every angle inside a triangle is less than a right angle."],
      truth: "sometimes",
      reasons: [
        {
          text: "Sometimes. An equilateral triangle's angles are all less, but a right-angled triangle has a right angle.",
          correct: true,
        },
        { text: "Always. Triangles are pointy, so all their angles are small." },
        { text: "Never. Triangles always have a right angle." },
      ],
      solution: [
        { say: "Some triangles have a right angle or an angle greater than a right angle." },
      ],
    });
  },

  verify(p, question) {
    return question.key.depth !== 1 || chosenText(question) === answerFor(p.degrees);
  },
};

export default defineGenerator(
  mixFamilies("Y3-GEO-03.c", { 1: own, 3: { ...parent.definition, id: "Y3-GEO-03.c" }, 4: own }),
);
