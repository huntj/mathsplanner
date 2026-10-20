/**
 * @statement Y5-GEO-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Phase 4 slice; awaiting teacher review
 */
// Y5-GEO-03: Draw given angles, and measure them in degrees
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import type { ProtractorSpec } from "@mathsplanner/diagrams";
import { deg, pickAngle, wrongs } from "../shared/angles.ts";

interface Params {
  angle: number;
  /** Which way the first arm points: right is read on the inner scale, left on the outer. */
  baseline: "right" | "left";
}

const protractor = (p: Params, extra: Partial<ProtractorSpec> = {}): ProtractorSpec => ({
  type: "measure",
  instrument: "protractor",
  angle: p.angle,
  baseline: p.baseline,
  ...extra,
});

const scaleName = (p: Params) => (p.baseline === "right" ? "inner" : "outer");

const wrongScale = (p: Params): A.Wrong => ({
  code: "GEO.PROTRACTOR.WRONG-SCALE",
  value: A.degrees(180 - p.angle),
  feedback: `Start from the 0 on the arm that lies along the base line, and read that scale (the ${scaleName(p)} scale here).`,
});

const solution = (p: Params): A.StepInput[] => [
  {
    say: `One arm lies along the base line pointing ${p.baseline}, where the ${scaleName(p)} scale starts at 0.`,
  },
  { say: `Follow the ${scaleName(p)} scale round to the other arm: it reads ${p.angle}°.` },
  {
    say: `Check: the angle is ${p.angle < 90 ? "acute, so less than 90°" : "obtuse, so more than 90°"}.`,
  },
];

export default defineGenerator<Params>({
  id: "Y5-GEO-03",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["GEO.PROTRACTOR.WRONG-SCALE"],

  params(rng, numbers) {
    return {
      angle: pickAngle(rng, numbers, 15, 165, [90]),
      baseline: numbers === "friendly" ? "right" : rng.pick(["right", "left"] as const),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "A protractor is placed over an angle.",
            A.figure(protractor({ ...p, baseline: "right" })),
          ],
          ask: "What is the size of the angle?",
          answer: A.degrees(p.angle),
          wrong: wrongs(p.angle, [wrongScale({ ...p, baseline: "right" })]),
          solution: solution({ ...p, baseline: "right" }),
        });
      case 2:
        // The arm runs to the left, so the outer scale (or the inner, read from the other end) is needed.
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "A protractor is placed over an angle.",
                A.figure(protractor({ ...p, baseline: "left" })),
              ],
              ask: "What is the size of the angle?",
            },
            {
              question: [
                "Here is a protractor on an angle that opens to the left.",
                A.figure(protractor({ ...p, baseline: "left" })),
              ],
              ask: "How many degrees is the angle?",
            },
          ],
          answer: A.degrees(p.angle),
          wrong: wrongs(p.angle, [wrongScale({ ...p, baseline: "left" })]),
          solution: solution({ ...p, baseline: "left" }),
        });
      case 3:
        return A.drawOrPlot({
          question: [
            "Use the protractor to draw an angle of ",
            A.math(deg(p.angle)),
            " at the end of the line.",
          ],
          canvas: protractor(p, { hideSecondArm: true }),
          target: protractor(p),
          tolerance: 2,
          solution: [
            {
              say: `Put the centre of the protractor on the end of the line, with the line along the 0 of the ${scaleName(p)} scale.`,
            },
            {
              say: `Count round the ${scaleName(p)} scale to ${p.angle}°, mark it, and join the mark to the end of the line.`,
            },
          ],
        });
      default: {
        const claim = 180 - p.angle;
        return A.explainTheError({
          rng,
          claim: [
            "Sam measures this angle.",
            A.figure(protractor(p)),
            "He says it is ",
            A.math(deg(claim)),
            ".",
          ],
          correct: `He read the wrong scale. The arm on the base line points ${p.baseline}, so he should count from the 0 on the ${scaleName(p)} scale.`,
          distractors: [
            {
              content:
                "He should have measured from the other arm, which always gives a different answer.",
            },
            { content: "He did not put the centre of the protractor on the point of the angle." },
            {
              content: "He is right, because both scales give the size of the angle.",
              code: "GEO.PROTRACTOR.WRONG-SCALE",
              feedback:
                "The two scales give two different numbers; only one starts from 0 on the arm.",
            },
          ],
          solution: [
            ...solution(p),
            {
              say: `So the angle is ${p.angle}°, not ${claim}°: ${claim}° is the reading on the other scale.`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    // The angle between the arms is the reading on one scale; the two scales add up to 180°.
    const answer = question.parts[0]?.answer;
    if (answer?.type === "number") return answer.value + (180 - p.angle) === 180;
    return p.angle > 0 && p.angle < 180;
  },

  bounds: {
    friendly: { min: 15, max: 165, dp: 0 },
    standard: { min: 15, max: 165, dp: 0 },
    stretch: { min: 15, max: 165, dp: 0 },
  },
});
