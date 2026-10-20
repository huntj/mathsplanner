/**
 * @statement GF-G15
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Phase 4 slice; awaiting teacher review
 */
// GF-G15: Measure lines and angles, interpret maps and scale drawings, and use bearings
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { pointAt, type GeometrySpec } from "@mathsplanner/diagrams";
import { pickAngle, wrongs } from "../shared/angles.ts";

interface Params {
  /** Bearing of B from A, in degrees, not a multiple of 90. */
  bearing: number;
  /** Map scale: 1 cm represents `km` kilometres, and the drawn distance in cm. */
  km: number;
  drawn: number;
}

/** "070" */
const threeFigures = (b: number) => String(b).padStart(3, "0");
const back = (b: number) => (b < 180 ? b + 180 : b - 180);

/** B lies west of north; the angle is marked anticlockwise from north, as a student might see it. */
function westernDiagram(bearing: number): GeometrySpec {
  const anticlockwise = 360 - bearing;
  return {
    type: "geometry",
    points: { A: [0, 0], N: [0, 1.8], B: pointAt([0, 0], 90 + anticlockwise, 3) },
    segments: [
      { from: "A", to: "N", arrow: true },
      { from: "A", to: "B" },
    ],
    angles: [{ vertex: "A", from: "N", to: "B", value: anticlockwise }],
    pointLabels: ["A", "B", "N"],
    dots: ["A", "B"],
  };
}

export default defineGenerator<Params>({
  id: "GF-G15",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: ["GEO.BEARINGS.ANTICLOCKWISE", "GEO.BEARINGS.BACK-BEARING", "GEO.SCALE.DIVIDES"],

  params(rng, numbers) {
    return {
      // Western bearings (180° to 360°) for the diagram question; others use any bearing.
      bearing: pickAngle(rng, numbers, 200, 340, [270]),
      km: rng.pick(
        { friendly: [2, 5, 10], standard: [2, 4, 5, 20], stretch: [3, 4, 15, 25] }[numbers],
      ),
      drawn: numbers === "stretch" ? rng.int(13, 95) / 10 : rng.int(3, 12),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const anticlockwise = 360 - p.bearing;
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "The diagram shows the positions of A and B.",
            A.figure(westernDiagram(p.bearing)),
          ],
          ask: "Work out the bearing of B from A.",
          answer: A.degrees(p.bearing),
          wrong: wrongs(p.bearing, [
            {
              code: "GEO.BEARINGS.ANTICLOCKWISE",
              value: A.degrees(anticlockwise),
              feedback:
                "Bearings are measured clockwise from north; the marked angle goes anticlockwise.",
            },
          ]),
          solution: [
            {
              say: "Bearings are measured clockwise from north. The marked angle goes anticlockwise, so take it away from 360°.",
              math: `360^\\circ - ${anticlockwise}^\\circ = ${p.bearing}^\\circ`,
            },
            { say: `As a three-figure bearing: ${threeFigures(p.bearing)}°.` },
          ],
        });
      case 2: {
        const ab = back(p.bearing);
        return A.reverse({
          question: `The bearing of B from A is ${threeFigures(ab)}°.`,
          ask: "Work out the bearing of A from B.",
          answer: A.degrees(back(ab)),
          wrong: wrongs(back(ab), [
            {
              code: "GEO.BEARINGS.BACK-BEARING",
              value: A.degrees(ab),
              feedback:
                "Going back the other way, you face the opposite direction: add or take away 180°.",
            },
          ]),
          solution: [
            {
              say: "The bearing back is in the opposite direction, so it differs by 180°.",
              math: `${ab}^\\circ ${ab < 180 ? "+" : "-"} 180^\\circ = ${back(ab)}^\\circ`,
            },
          ],
        });
      }
      case 4: {
        const ab = back(p.bearing);
        return A.explainTheError({
          rng,
          claim: `The bearing of B from A is ${threeFigures(ab)}°. Jo says the bearing of A from B is also ${threeFigures(ab)}°.`,
          correct:
            "From B you face the opposite direction to get back to A, so the bearing differs by 180°.",
          distractors: [
            {
              content: `It should be ${threeFigures(360 - ab)}°, because the way back turns the other way round.`,
              code: "GEO.BEARINGS.ANTICLOCKWISE",
              feedback: "Bearings are always clockwise from north.",
            },
            { content: "Bearings back are always 360° minus the bearing there." },
            {
              content: "She is right: the line between A and B is the same both ways.",
              code: "GEO.BEARINGS.BACK-BEARING",
              feedback: "The line is the same, but the direction is opposite.",
            },
          ],
          solution: [
            {
              say: "Add 180° if the bearing is less than 180°, otherwise subtract it.",
              math: `${ab}^\\circ ${ab < 180 ? "+" : "-"} 180^\\circ = ${back(ab)}^\\circ`,
            },
          ],
        });
      }
      default: {
        const distance = Math.round(p.drawn * p.km * 100) / 100;
        return A.multiStepContext({
          context: `On a map, 1 cm represents ${p.km} km. A ship sails from a port P to a lighthouse L. On the map, L is ${p.drawn} cm from P on a bearing of ${threeFigures(back(p.bearing))}°.`,
          parts: [
            {
              ask: "How far does the ship sail, in km?",
              answer: A.number(distance, { units: "km" }),
              wrong: wrongs(distance, [
                {
                  code: "GEO.SCALE.DIVIDES",
                  value: A.number(Math.round((p.drawn / p.km) * 100) / 100, { units: "km" }),
                  feedback: `Each centimetre on the map is ${p.km} km, so multiply.`,
                },
              ]),
            },
            {
              ask: "On what bearing must it sail to return to P?",
              answer: A.degrees(p.bearing),
              wrong: wrongs(p.bearing, [
                {
                  code: "GEO.BEARINGS.BACK-BEARING",
                  value: A.degrees(back(p.bearing)),
                  feedback: "To come back, the ship faces the opposite way: 180° different.",
                },
              ]),
            },
          ],
          solution: [
            { say: "Use the scale.", math: `${p.drawn} \\times ${p.km} = ${distance}\\text{ km}` },
            {
              say: "The return bearing differs by 180°.",
              math: `${back(p.bearing)}^\\circ ${back(p.bearing) < 180 ? "+" : "-"} 180^\\circ = ${p.bearing}^\\circ`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const parts = question.parts.map((q) => q.answer);
    const last = parts[parts.length - 1];
    if (last?.type !== "number") return true;
    // Bearings there and back always differ by exactly 180°.
    if (parts.length === 2) return Math.abs(last.value - back(p.bearing)) === 180;
    if (question.archetype === "reverse") return Math.abs(last.value - back(p.bearing)) === 180;
    return last.value + (360 - p.bearing) === 360;
  },

  bounds: { friendly: { min: 0.01 }, standard: { min: 0.01 }, stretch: { min: 0.01, dp: 2 } },
});
