/**
 * @statement Y6-GEO-05
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Phase 4 slice
 * @reviewed 2026-10-20 @huntj (teacher): depth 4 checked in the gallery, all numbers settings
 */
// Y6-GEO-05: Recognise angles where they meet at a point, are on a straight line, or are
// vertically opposite, and find missing angles
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { crossingLines, type GeoAngle } from "@mathsplanner/diagrams";
import { deg, pickAngle, wrongs } from "../shared/angles.ts";

export interface Params {
  /** ∠AOC, one of the angles between the two lines; never 90°. */
  angle: number;
  /** Which angle is asked for: the one opposite the given angle, or one next to it. */
  asked: "opposite" | "adjacent";
  rotation: number;
}

const answerOf = (p: Params) => (p.asked === "opposite" ? p.angle : 180 - p.angle);

/** The given angle at ∠AOC, and x either at ∠BOD (opposite) or ∠COB (adjacent). */
function diagram(p: Params, xLabel = "x") {
  const spec = crossingLines(p.angle, p.rotation);
  const given: GeoAngle = { vertex: "O", from: "A", to: "C", value: p.angle };
  const unknown: GeoAngle =
    p.asked === "opposite"
      ? { vertex: "O", from: "B", to: "D", value: p.angle, label: xLabel }
      : { vertex: "O", from: "C", to: "B", value: 180 - p.angle, label: xLabel };
  return { ...spec, angles: [given, unknown] };
}

function wrongAnswers(p: Params): A.Wrong[] {
  return wrongs(answerOf(p), [
    p.asked === "opposite"
      ? {
          code: "GEO.ANGLES.VERT-OPP-SUPPLEMENTARY",
          value: A.degrees(180 - p.angle),
          feedback: "Vertically opposite angles are equal; they do not add up to 180°.",
        }
      : {
          code: "GEO.ANGLES.STRAIGHT-LINE-360",
          value: A.degrees(360 - p.angle),
          feedback: "These two angles are on a straight line, so they add up to 180°, not 360°.",
        },
    p.asked === "adjacent"
      ? {
          code: "GEO.ANGLES.VERT-OPP-SUPPLEMENTARY",
          value: A.degrees(p.angle),
          feedback:
            "Only the angle opposite is equal. This angle is next to it, on a straight line.",
        }
      : undefined,
  ]);
}

function solution(p: Params): A.StepInput[] {
  return p.asked === "opposite"
    ? [
        {
          say: "Angle x is vertically opposite the given angle, and vertically opposite angles are equal.",
          math: `x = ${deg(p.angle)}`,
        },
      ]
    : [
        {
          say: "Angle x and the given angle are on a straight line, so they add up to 180°.",
          math: `x = 180^\\circ - ${deg(p.angle)} = ${deg(180 - p.angle)}`,
        },
      ];
}

export default defineGenerator<Params>({
  id: "Y6-GEO-05",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: ["GEO.ANGLES.VERT-OPP-SUPPLEMENTARY", "GEO.ANGLES.STRAIGHT-LINE-360"],

  params(rng, numbers) {
    return {
      angle: pickAngle(rng, numbers, 30, 150, [90]),
      asked: rng.pick(["opposite", "adjacent"] as const),
      rotation: rng.int(0, 40),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const x = answerOf(p);
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Two straight lines cross.", A.figure(diagram(p))],
          ask: ["Work out the size of angle ", A.math("x"), "."],
          answer: A.degrees(x),
          wrong: wrongAnswers(p),
          solution: solution(p),
        });
      case 2:
        // Words only: the student has to picture the diagram.
        return A.variedForm({
          rng,
          forms: [
            {
              question: `Two straight lines cross at a point. One of the four angles they make is ${p.angle}°.`,
              ask:
                p.asked === "opposite"
                  ? "What is the size of the angle opposite it?"
                  : "What is the size of an angle next to it?",
            },
            {
              question: `Two roads cross in a straight line. The angle between them on one side is ${p.angle}°.`,
              ask:
                p.asked === "opposite"
                  ? "What is the angle on the opposite side of the crossing, facing it?"
                  : "What is the angle between the roads next to it?",
            },
          ],
          answer: A.degrees(x),
          wrong: wrongAnswers(p),
          solution: solution(p),
        });
      case 4: {
        const wrong = p.asked === "opposite" ? 180 - p.angle : p.angle;
        return A.explainTheError({
          rng,
          claim: [
            "Two straight lines cross.",
            A.figure(diagram(p)),
            "Priya says angle ",
            A.math("x"),
            " is ",
            A.math(deg(wrong)),
            ".",
          ],
          correct:
            p.asked === "opposite"
              ? "Angle x is vertically opposite the given angle, so it is equal to it, not 180° minus it."
              : "Angle x is on a straight line with the given angle, so they add up to 180°; it is not vertically opposite.",
          distractors: [
            p.asked === "opposite"
              ? {
                  content: "She should have taken the angle away from 360°.",
                  code: "GEO.ANGLES.STRAIGHT-LINE-360",
                }
              : {
                  content: "She should have taken the angle away from 360°.",
                  code: "GEO.ANGLES.STRAIGHT-LINE-360",
                },
            p.asked === "opposite"
              ? {
                  content:
                    "Angle x and the given angle are on a straight line, so she should have added them.",
                }
              : {
                  content:
                    "Vertically opposite angles add up to 180°, so she should have halved it.",
                  code: "GEO.ANGLES.VERT-OPP-SUPPLEMENTARY",
                },
            { content: "She is right; angles that look different sizes cannot be equal." },
          ],
          solution: solution(p),
        });
      }
      default: {
        // Two lines cross, and one angle is d° bigger than the angle next to it.
        const small = Math.min(p.angle, 180 - p.angle);
        const big = 180 - small;
        return A.multiStepContext({
          context: [
            `Two straight lines cross. One of the angles they make is ${big - small}° bigger than the angle next to it.`,
          ],
          parts: [
            { ask: "What is the size of the smaller angle?", answer: A.degrees(small) },
            { ask: "What is the size of the larger angle?", answer: A.degrees(big) },
          ],
          solution: [
            {
              say: "Angles next to each other on a straight line add up to 180°, and one is the other plus the difference.",
              math: `2 \\times \\text{small} + ${big - small} = 180`,
            },
            {
              say: "Take away the difference and halve.",
              math: `\\text{small} = (180 - ${big - small}) \\div 2 = ${small}^\\circ`,
            },
            {
              say: "Add the difference back for the larger angle.",
              math: `\\text{large} = ${small} + ${big - small} = ${big}^\\circ`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const answer = question.parts[0]?.answer;
    if (answer?.type !== "number") return true;
    // Depth 5 asks for the smaller angle; otherwise the answer and the given angle are equal
    // (opposite) or make 180° (adjacent).
    if (question.parts.length === 2) {
      const larger = question.parts[1]?.answer;
      return (
        larger?.type === "number" &&
        answer.value + larger.value === 180 &&
        larger.value - answer.value === Math.abs(180 - 2 * p.angle)
      );
    }
    return p.asked === "opposite" ? answer.value === p.angle : answer.value + p.angle === 180;
  },

  bounds: {
    friendly: { min: 30, max: 150, dp: 0 },
    standard: { min: 30, max: 150, dp: 0 },
    stretch: { min: 30, max: 150, dp: 0 },
  },
});
