/**
 * @statement Y8-GEO-05
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Phase 4 slice
 * @reviewed 2026-10-20 @huntj (teacher): depth 4 checked in the gallery, all numbers settings
 */
// Y8-GEO-05: Understand and use the relationship between parallel lines and alternate and
// corresponding angles
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { transversal, type GeoAngle, type GeometrySpec } from "@mathsplanner/diagrams";
import { deg, pickAngle, wrongs } from "../shared/angles.ts";

type Relation = "corresponding" | "alternate" | "co-interior";

interface Params {
  /** ∠BPQ, between the transversal and the lower parallel line. */
  angle: number;
  relation: Relation;
  /** For the true-or-false question: the relation the claim names. */
  claimed: Relation;
}

const equalPair = (r: Relation) => r !== "co-interior";
const answerOf = (p: Params) => (equalPair(p.relation) ? p.angle : 180 - p.angle);

/** The partner of ∠BPQ at Q for each relation. */
function partner(r: Relation, angle: number, label: string): GeoAngle {
  switch (r) {
    case "corresponding":
      return { vertex: "Q", from: "D", to: "T", value: angle, label };
    case "alternate":
      return { vertex: "Q", from: "C", to: "P", value: angle, label };
    case "co-interior":
      return { vertex: "Q", from: "P", to: "D", value: 180 - angle, label };
  }
}

function diagram(angle: number, r: Relation, labels: [string, string]): GeometrySpec {
  return {
    ...transversal(angle),
    angles: [
      { vertex: "P", from: "B", to: "Q", value: angle, label: labels[0] },
      partner(r, angle, labels[1]),
    ],
  };
}

const FACT: Record<Relation, string> = {
  corresponding: "Corresponding angles on parallel lines are equal.",
  alternate: "Alternate angles on parallel lines are equal.",
  "co-interior": "Co-interior angles on parallel lines add up to 180°.",
};

export default defineGenerator<Params>({
  id: "Y8-GEO-05",
  version: "1.0.0",
  depths: [1, 3, 4, 5],
  misconceptions: [
    "GEO.PARALLEL.ALTERNATE-SUPPLEMENTARY",
    "GEO.PARALLEL.CO-INTERIOR-EQUAL",
    "GEO.ANGLES.STRAIGHT-LINE-360",
  ],

  params(rng, numbers) {
    const relation = rng.pick(["corresponding", "alternate", "co-interior"] as const);
    return {
      angle: pickAngle(rng, numbers, 35, 145, [90]),
      relation,
      claimed: rng.bool(0.5)
        ? relation
        : rng.pick(
            (["corresponding", "alternate", "co-interior"] as const).filter((r) => r !== relation),
          ),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const x = answerOf(p);
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "The arrows show that the two lines are parallel.",
            A.figure(diagram(p.angle, p.relation, [deg(p.angle), "x"])),
          ],
          ask: ["Work out the size of angle ", A.math("x"), "."],
          answer: A.degrees(x),
          wrong: wrongs(x, [
            equalPair(p.relation)
              ? {
                  code: "GEO.PARALLEL.ALTERNATE-SUPPLEMENTARY",
                  value: A.degrees(180 - p.angle),
                  feedback: `These are ${p.relation} angles, so they are equal; they do not add up to 180°.`,
                }
              : {
                  code: "GEO.PARALLEL.CO-INTERIOR-EQUAL",
                  value: A.degrees(p.angle),
                  feedback:
                    "These are co-interior angles, so they add up to 180°; they are not equal.",
                },
          ]),
          solution: [
            {
              say: FACT[p.relation],
              math: equalPair(p.relation)
                ? `x = ${deg(p.angle)}`
                : `x = 180^\\circ - ${deg(p.angle)} = ${deg(180 - p.angle)}`,
            },
          ],
        });
      case 3:
        return A.matchRepresentations({
          rng,
          question:
            "In each diagram the arrows show parallel lines. Match each pair of marked angles to its name.",
          pairs: (["corresponding", "alternate", "co-interior"] as const).map(
            (r) =>
              [
                A.figure(diagram(p.angle, r, ["a", "b"])),
                `${r[0]?.toUpperCase()}${r.slice(1)} angles`,
              ] as [A.RichInput, A.RichInput],
          ),
          solution: [
            { say: "Corresponding angles are in the same position at each crossing (an F shape)." },
            {
              say: "Alternate angles are on opposite sides of the transversal, between the parallel lines (a Z shape).",
            },
            {
              say: "Co-interior angles are on the same side, between the parallel lines (a C shape).",
            },
          ],
        });
      case 4: {
        // "a = b because they are …": judge the statement, then the reason.
        const equal = equalPair(p.relation);
        const claimEqual = equalPair(p.claimed);
        const statement = claimEqual
          ? `a = b because they are ${p.claimed} angles.`
          : `a + b = 180° because they are ${p.claimed} angles.`;
        const truth = p.claimed === p.relation;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "The arrows show parallel lines.",
            A.figure(diagram(p.angle, p.relation, ["a", "b"])),
            statement,
          ],
          truth,
          reasons: [
            {
              text: `They are ${p.relation} angles, so ${equal ? "they are equal" : "they add up to 180°"}.`,
              correct: true,
            },
            {
              text: equal
                ? "Angles between parallel lines always add up to 180°."
                : "Angles on parallel lines are always equal.",
              code: equal
                ? "GEO.PARALLEL.ALTERNATE-SUPPLEMENTARY"
                : "GEO.PARALLEL.CO-INTERIOR-EQUAL",
            },
            { text: "You can only tell by measuring them with a protractor." },
          ],
          solution: [{ say: `a and b are ${p.relation} angles. ${FACT[p.relation]}` }],
        });
      }
      default: {
        // Two steps: across the parallel lines, then along a straight line.
        const y = 180 - p.angle;
        return A.multiStepContext({
          context: [
            "The arrows show that the two lines are parallel.",
            A.figure({
              ...transversal(p.angle),
              angles: [
                { vertex: "P", from: "B", to: "Q", value: p.angle, label: deg(p.angle) },
                { vertex: "Q", from: "C", to: "P", value: p.angle, label: "x" },
                { vertex: "Q", from: "T", to: "C", value: y, label: "y" },
              ],
            }),
          ],
          parts: [
            {
              ask: ["Work out angle ", A.math("x"), "."],
              answer: A.degrees(p.angle),
              wrong: wrongs(p.angle, [
                {
                  code: "GEO.PARALLEL.ALTERNATE-SUPPLEMENTARY",
                  value: A.degrees(180 - p.angle),
                  feedback: "These are alternate angles, so they are equal.",
                },
              ]),
            },
            {
              ask: ["Work out angle ", A.math("y"), "."],
              answer: A.degrees(y),
              wrong: wrongs(y, [
                {
                  code: "GEO.ANGLES.STRAIGHT-LINE-360",
                  value: A.degrees(360 - p.angle),
                  feedback: "x and y are on a straight line, so they add up to 180°.",
                },
              ]),
            },
          ],
          solution: [
            { say: "Alternate angles on parallel lines are equal.", math: `x = ${deg(p.angle)}` },
            {
              say: "Angles on a straight line add up to 180°.",
              math: `y = 180^\\circ - ${deg(p.angle)} = ${deg(y)}`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const first = question.parts[0]?.answer;
    if (first?.type !== "number") return true;
    if (question.parts.length === 2) {
      const second = question.parts[1]?.answer;
      return (
        first.value === p.angle && second?.type === "number" && first.value + second.value === 180
      );
    }
    // Equal pairs match; co-interior pairs make a straight angle.
    return equalPair(p.relation) ? first.value === p.angle : first.value + p.angle === 180;
  },

  bounds: {
    friendly: { min: 35, max: 145, dp: 0 },
    standard: { min: 35, max: 145, dp: 0 },
    stretch: { min: 35, max: 145, dp: 0 },
  },
});
