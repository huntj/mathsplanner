/**
 * @statement Y7-GEO-05.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-GEO-05.c: Use vertically opposite angles
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { crossingLines, type GeometrySpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  rot: number;
}

function cross(a: number, rot: number, partner: "opposite" | "next"): GeometrySpec {
  const spec = crossingLines(a, rot);
  return {
    ...spec,
    angles: [
      { vertex: "O", from: "A", to: "C", value: a, label: `${a}^\\circ` },
      partner === "opposite"
        ? { vertex: "O", from: "B", to: "D", value: a, label: "x" }
        : { vertex: "O", from: "C", to: "B", value: 180 - a, label: "x" },
    ],
    description: `Two straight lines crossing. One angle is ${a}°; another, x, is marked.`,
  };
}

export default defineGenerator<Params>({
  id: "Y7-GEO-05.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.ANGLES.VERT-OPP-SUPPLEMENTARY"],

  params(rng) {
    const p = { a: rng.int(30, 150), rot: rng.int(5, 35) };
    if (Math.abs(p.a - 90) < 10) reject("an angle clearly not a right angle");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Two straight lines cross.", A.figure(cross(p.a, p.rot, "opposite"))],
          ask: "Find the angle x.",
          answer: A.degrees(p.a),
          wrong: wrongs(p.a, [
            {
              code: "GEO.ANGLES.VERT-OPP-SUPPLEMENTARY",
              value: A.degrees(180 - p.a),
              feedback: "x is vertically opposite the given angle, so they are equal.",
            },
          ]),
          solution: [{ say: "Vertically opposite angles are equal: ", math: `x = ${p.a}^\\circ` }],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["Two straight lines cross.", A.figure(cross(p.a, p.rot, "next"))],
              ask: "Find the angle x.",
            },
          ],
          answer: A.degrees(180 - p.a),
          wrong: wrongs(180 - p.a, [
            {
              code: "GEO.ANGLES.VERT-OPP-SUPPLEMENTARY",
              value: A.degrees(p.a),
              feedback:
                "x is next to the given angle on a straight line, not opposite it: they add up to 180°.",
            },
          ]),
          solution: [
            {
              say: "Angles on a straight line: ",
              math: `x = 180^\\circ - ${p.a}^\\circ = ${180 - p.a}^\\circ`,
            },
          ],
        });
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["Vertically opposite angles add up to 180°."],
          truth: "sometimes",
          reasons: [
            {
              text: "Sometimes. Vertically opposite angles are equal, so they add to 180° only when both are 90°.",
              correct: true,
            },
            {
              text: "Always. They are on a straight line.",
              code: "GEO.ANGLES.VERT-OPP-SUPPLEMENTARY",
            },
            { text: "Never. They add up to 360°.", code: "GEO.ANGLES.VERT-OPP-SUPPLEMENTARY" },
          ],
          solution: [{ say: "Opposite angles are equal; neighbouring angles add to 180°." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.a;
    if (question.key.depth === 2) return numberAnswer(question) === 180 - p.a;
    return true;
  },
});
