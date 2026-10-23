/**
 * @statement AL-P3.2.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P3.2.b: Use circle properties, e.g. tangents and chords
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type GeneratorDefinition, type QuestionDraft } from "@mathsplanner/core";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./AL-P3.2.ts";

const CLAIMS = [
  {
    statement:
      "A tangent to a circle is perpendicular to the radius at the point where it touches.",
    truth: true,
    right:
      "True. So the gradient of the tangent is the negative reciprocal of the gradient of the radius.",
    wrong: [
      "False. A tangent is parallel to the radius.",
      "False. A tangent passes through the centre.",
    ],
  },
  {
    statement: "The perpendicular from the centre of a circle to a chord bisects the chord.",
    truth: true,
    right: "True. So the perpendicular bisector of any chord passes through the centre.",
    wrong: ["False. It only bisects a diameter.", "False. It meets the chord at one end."],
  },
  {
    statement:
      "The angle in a semicircle is 90°, so if AB is a diameter and C is on the circle, AC is perpendicular to BC.",
    truth: true,
    right: "True. The gradients of AC and BC multiply to −1.",
    wrong: [
      "False. The angle in a semicircle is 180°.",
      "False. Only when C is at the top of the circle.",
    ],
  },
];

interface Params {
  claim: number;
}

const own: GeneratorDefinition<Params> = {
  id: "AL-P3.2.b",
  version: "1.0.0",
  depths: [4],
  misconceptions: ["GEO.CIRCLE.TANGENT-RADIUS"],

  params(rng) {
    return { claim: rng.int(0, CLAIMS.length - 1) };
  },

  build(p, _depth, rng): QuestionDraft {
    const c = CLAIMS[p.claim] ?? CLAIMS[0];
    return A.trueOrFalseWhy({
      rng,
      statement: c?.statement ?? "",
      truth: c?.truth ?? true,
      reasons: [
        { text: c?.right ?? "", correct: true },
        { text: c?.wrong[0] ?? "", code: "GEO.CIRCLE.TANGENT-RADIUS" },
        { text: c?.wrong[1] ?? "" },
      ],
      solution: [{ say: c?.right ?? "" }],
    });
  },
};

export default defineGenerator(
  mixFamilies("AL-P3.2.b", { 2: { ...parent.definition, id: "AL-P3.2.b" }, 4: own }),
);
