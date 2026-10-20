/**
 * @statement Y3-GEO-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Phase 4 slice
 * @reviewed 2026-10-20 @huntj (teacher): depth 4 checked in the gallery, all numbers settings
 */
// Y3-GEO-03: Identify right angles; recognise that two right angles make a half-turn, three a
// three-quarter turn and four a complete turn; identify whether angles are greater or less than
// a right angle
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { angle, shape, type ShapeKind } from "@mathsplanner/diagrams";
import { pickAngle, wrongs } from "../shared/angles.ts";

interface Params {
  /** Turn asked about, in right angles: 2 (half), 3 (three-quarter) or 4 (whole). */
  rights: 2 | 3 | 4;
  kind: ShapeKind;
  rotation: number;
  small: number;
  large: number;
}

const TURN: Record<2 | 3 | 4, string> = {
  2: "a half turn",
  3: "a three-quarter turn",
  4: "a whole turn",
};
const RIGHT_ANGLES: Partial<Record<ShapeKind, number>> = {
  square: 4,
  rectangle: 4,
  "right-angled": 1,
  parallelogram: 0,
  kite: 0,
  rhombus: 0,
  isosceles: 0,
  scalene: 0,
};

export default defineGenerator<Params>({
  id: "Y3-GEO-03",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["GEO.TURNS.FRACTION"],

  params(rng, numbers) {
    const kinds: ShapeKind[] =
      numbers === "friendly"
        ? ["square", "rectangle", "right-angled"]
        : [
            "square",
            "rectangle",
            "right-angled",
            "parallelogram",
            "kite",
            "rhombus",
            "isosceles",
            "scalene",
          ];
    return {
      rights: rng.pick([2, 3, 4] as const),
      kind: rng.pick(kinds),
      rotation: numbers === "stretch" ? rng.int(10, 80) : 0,
      small: pickAngle(rng, numbers === "stretch" ? "standard" : "friendly", 30, 75),
      large: pickAngle(rng, numbers === "stretch" ? "standard" : "friendly", 105, 160),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: `How many right angles make ${TURN[p.rights]}?`,
          answer: A.number(p.rights),
          wrong: wrongs(p.rights, [
            {
              code: "GEO.TURNS.FRACTION",
              value: A.number(p.rights === 2 ? 1 : p.rights - 1),
              feedback:
                "A right angle is a quarter turn: a half turn is 2, a three-quarter turn is 3, a whole turn is 4.",
            },
          ]),
          solution: [
            {
              say: `A right angle is a quarter turn, so ${TURN[p.rights]} is ${p.rights} right angles.`,
            },
          ],
        });
      case 2: {
        const count = RIGHT_ANGLES[p.kind] ?? 0;
        return A.standard({
          question: ["Look at this shape.", A.figure(shape(p.kind, { rotation: p.rotation }))],
          ask: "How many right angles does it have?",
          answer: A.number(count),
          solution: [
            {
              say: `Check each corner against a right angle, like the corner of a piece of paper. This shape has ${count}.`,
            },
          ],
        });
      }
      case 3:
        return A.matchRepresentations({
          rng,
          question: "Match each angle to its description.",
          pairs: [
            [A.figure(angle(p.small, { rotation: rng.int(0, 60) })), "Less than a right angle"],
            [A.figure(angle(90, { rotation: rng.int(0, 60) })), "A right angle"],
            [A.figure(angle(p.large, { rotation: rng.int(0, 30) })), "More than a right angle"],
          ],
          solution: [
            {
              say: "Hold the corner of a piece of paper against each angle: one fits exactly, one is narrower, one is wider.",
            },
          ],
        });
      default: {
        const claimed = p.rights === 2 ? 3 : 2;
        return A.explainTheError({
          rng,
          claim: `Amy says ${claimed} right angles make ${TURN[p.rights]}.`,
          correct: `A right angle is a quarter turn, so ${TURN[p.rights]} is ${p.rights} right angles, not ${claimed}.`,
          distractors: [
            {
              content: "A right angle is a half turn, so she should have halved it.",
              code: "GEO.TURNS.FRACTION",
              feedback: "A right angle is a quarter of a whole turn.",
            },
            { content: "It depends whether you turn clockwise or anticlockwise." },
            { content: "She is right: every turn is made of 2 right angles." },
          ],
          solution: [{ say: `Count the quarter turns: ${TURN[p.rights]} is ${p.rights}.` }],
        });
      }
    }
  },

  verify(p, question) {
    const answer = question.parts[0]?.answer;
    if (answer?.type !== "number") return true;
    if (question.diagrams.length) {
      // Count the right angles in the drawn shape from its own marks.
      const marked = shape(p.kind, { marks: true }).angles?.filter((a) => a.right).length ?? 0;
      return marked === answer.value;
    }
    return answer.value * 90 === { 2: 180, 3: 270, 4: 360 }[p.rights];
  },
});
