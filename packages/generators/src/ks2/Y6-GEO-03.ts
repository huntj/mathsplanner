/**
 * @statement Y6-GEO-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Phase 4 slice
 * @reviewed 2026-10-20 @huntj (teacher): depth 4 checked in the gallery, all numbers settings
 */
// Y6-GEO-03: Compare and classify geometric shapes based on their properties and sizes; find
// unknown angles in triangles, quadrilaterals and regular polygons
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { quadrilateralFromAngles, triangleASA, type GeometrySpec } from "@mathsplanner/diagrams";
import { deg, pickAngle, splitAngles, sum, TOTALS, wrongs } from "../shared/angles.ts";

interface Params {
  /** Angles of a triangle (3) or quadrilateral (4), in order round the shape; the last is unknown. */
  angles: number[];
  /** Apex of an isosceles triangle (even, so the base angles are whole numbers). */
  apex: number;
  /** For isosceles questions: whether the apex or a base angle is given. */
  given: "apex" | "base";
  claim: number;
}

const NAMES = ["A", "B", "C", "D"];

/** The known angle at depth 5: even, from 30° to 80°, so both cases give sensible triangles. */
const fifthAngle = (p: Params) => 30 + ((p.apex - 30) % 52);

function polygonDiagram(angles: number[]): GeometrySpec {
  let points: Record<string, [number, number]>;
  if (angles.length === 3) {
    points = triangleASA(angles[0] ?? 60, 5, angles[1] ?? 60);
  } else {
    try {
      points = quadrilateralFromAngles(
        angles[0] ?? 90,
        angles[1] ?? 90,
        angles[2] ?? 90,
        angles[3] ?? 90,
      );
    } catch {
      return reject("angles do not make a quadrilateral");
    }
  }
  const n = angles.length;
  return {
    type: "geometry",
    points,
    polygons: [{ vertices: NAMES.slice(0, n) }],
    angles: angles.map((value, i) => ({
      vertex: NAMES[i] ?? "",
      from: NAMES[(i + 1) % n] ?? "",
      to: NAMES[(i + n - 1) % n] ?? "",
      value,
      ...(i === n - 1 ? { label: "x" } : {}),
    })),
  };
}

/** Isosceles triangle with the apex at C and equal sides AC and BC marked. */
function isosceles(apex: number, labels: { apex: string; base: string }): GeometrySpec {
  const base = (180 - apex) / 2;
  return {
    type: "geometry",
    points: triangleASA(base, 4, base),
    polygons: [{ vertices: ["A", "B", "C"] }],
    segments: [
      { from: "A", to: "C", ticks: 1 },
      { from: "B", to: "C", ticks: 1 },
    ],
    angles: [
      { vertex: "C", from: "A", to: "B", value: apex, label: labels.apex },
      { vertex: "A", from: "B", to: "C", value: base, label: labels.base },
    ],
  };
}

const CLAIMS = [
  {
    claim: "A triangle can have two obtuse angles.",
    truth: "never" as const,
    reasons: [
      { text: "Two obtuse angles already add up to more than 180°.", correct: true },
      { text: "It can, if the third angle is very small." },
      { text: "Only right-angled triangles can have an obtuse angle." },
    ],
  },
  {
    claim: "A quadrilateral has an obtuse angle.",
    truth: "sometimes" as const,
    reasons: [
      {
        text: "A rectangle has none, but a parallelogram that is not a rectangle has two.",
        correct: true,
      },
      { text: "The angles add up to 360°, so one of them must be more than 90°." },
      { text: "Quadrilaterals only ever have right angles." },
    ],
  },
  {
    claim: "If you know two angles of a triangle, you can work out the third.",
    truth: "always" as const,
    reasons: [
      {
        text: "The three angles always add up to 180°, so the third is what is left.",
        correct: true,
      },
      { text: "Only if one of the angles is a right angle." },
      { text: "Only in an equilateral triangle, where all the angles are equal." },
    ],
  },
  {
    claim: "A triangle has a right angle and an obtuse angle.",
    truth: "never" as const,
    reasons: [
      { text: "90° plus an obtuse angle is already more than 180°.", correct: true },
      { text: "It can, if the third angle is 0°." },
      { text: "It can in a right-angled isosceles triangle." },
    ],
  },
];

export default defineGenerator<Params>({
  id: "Y6-GEO-03",
  version: "1.0.0",
  depths: [1, 2, 3, 4, 5],
  misconceptions: [
    "GEO.ANGLES.TRIANGLE-360",
    "GEO.ANGLES.QUADRILATERAL-180",
    "GEO.ANGLES.ADDS-KNOWN",
    "GEO.ISOSCELES.APEX-EQUALS-BASE",
  ],

  params(rng, numbers) {
    const shape = rng.pick(["triangle", "quadrilateral"] as const);
    const angles =
      shape === "triangle"
        ? splitAngles(rng, numbers, 180, 3, { min: 30, max: 120 })
        : splitAngles(rng, numbers, 360, 4, { min: 60, max: 150 });
    // An even apex keeps the base angles whole; friendly numbers keep them multiples of 5.
    const apexStep = numbers === "friendly" ? 10 : 2;
    const apex = rng.int(Math.ceil(30 / apexStep), Math.floor(140 / apexStep)) * apexStep;
    return {
      angles,
      apex: apex === 90 ? 80 : apex,
      given: rng.pick(["apex", "base"] as const),
      claim: rng.int(0, CLAIMS.length - 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const known = p.angles.slice(0, -1);
    const x = p.angles[p.angles.length - 1] ?? 0;
    const triangle = p.angles.length === 3;
    const facts = triangle ? TOTALS.triangle : TOTALS.quadrilateral;
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            `The diagram shows a ${triangle ? "triangle" : "quadrilateral"}.`,
            A.figure(polygonDiagram(p.angles)),
          ],
          ask: ["Work out the size of angle ", A.math("x"), "."],
          answer: A.degrees(x),
          wrong: wrongs(x, [
            triangle
              ? {
                  code: "GEO.ANGLES.TRIANGLE-360",
                  value: A.degrees(360 - sum(known)),
                  feedback: "The angles in a triangle add up to 180°, not 360°.",
                }
              : {
                  code: "GEO.ANGLES.QUADRILATERAL-180",
                  value: A.degrees(180 - sum(known)),
                  feedback: "The angles in a quadrilateral add up to 360°, not 180°.",
                },
            {
              code: "GEO.ANGLES.ADDS-KNOWN",
              value: A.degrees(sum(known)),
              feedback: `Take the known angles away from ${facts.total}°.`,
            },
          ]),
          solution: A.steps.angleSum({ ...facts, known, unknown: "x" }),
        });
      case 2: {
        const base = (180 - p.apex) / 2;
        const givenApex = p.given === "apex";
        const answer = givenApex ? base : p.apex;
        return A.standard({
          question: [
            "The triangle is isosceles: the sides with a dash are equal.",
            A.figure(
              isosceles(
                p.apex,
                givenApex ? { apex: deg(p.apex), base: "x" } : { apex: "x", base: deg(base) },
              ),
            ),
          ],
          ask: ["Work out the size of angle ", A.math("x"), "."],
          answer: A.degrees(answer),
          wrong: wrongs(
            answer,
            givenApex
              ? [
                  {
                    code: "GEO.ISOSCELES.APEX-EQUALS-BASE",
                    value: A.degrees(p.apex),
                    feedback:
                      "The angle between the equal sides is different; the two angles at the base are the equal ones.",
                  },
                  {
                    code: "GEO.ANGLES.TRIANGLE-360",
                    value: A.degrees((360 - p.apex) / 2),
                    feedback: "The angles in a triangle add up to 180°, not 360°.",
                  },
                ]
              : [
                  {
                    code: "GEO.ISOSCELES.APEX-EQUALS-BASE",
                    value: A.degrees(base),
                    feedback:
                      "The other base angle equals this one; the angle between the equal sides is what is left.",
                  },
                  {
                    code: "GEO.ANGLES.ADDS-KNOWN",
                    value: A.degrees(180 - base),
                    feedback: "There are two equal base angles, so take both away from 180°.",
                  },
                ],
          ),
          solution: givenApex
            ? A.steps.angleSum({ ...TOTALS.triangle, known: [p.apex], unknown: "x", share: 2 })
            : [
                {
                  say:
                    "The two base angles of an isosceles triangle are equal, so both are " +
                    base +
                    "°.",
                },
                ...A.steps.angleSum({ ...TOTALS.triangle, known: [base, base], unknown: "x" }),
              ],
        });
      }
      case 3: {
        // Match each set of angles to the kind of triangle it makes.
        // Avoid sets that fit two kinds: 60° makes isosceles equilateral, 45° makes it right-angled.
        const a = pickAngle(rng, "standard", 30, 70, [45, 60]);
        const right = pickAngle(rng, "standard", 25, 65, [45]);
        const scalene = splitAngles(rng, "standard", 180, 3, { min: 30, max: 110 });
        if (new Set(scalene).size < 3 || scalene.includes(60))
          reject("scalene angles must all differ");
        const list = (angles: number[]) => A.math(angles.map(deg).join(",\\ "));
        return A.matchRepresentations({
          rng,
          question:
            "Each set of angles belongs to a triangle. Match each one to the kind of triangle it is.",
          pairs: [
            [list([60, 60, 60]), "equilateral"],
            [list([a, a, 180 - 2 * a]), "isosceles"],
            [list([90, right, 90 - right]), "right-angled"],
            [list(scalene), "scalene"],
          ],
          solution: [
            { say: "Three 60° angles: all equal, so equilateral." },
            { say: `Two ${a}° angles: two equal angles, so isosceles.` },
            { say: "A 90° angle: right-angled." },
            { say: "Three different angles and no right angle: scalene." },
          ],
        });
      }
      case 4: {
        const c = CLAIMS[p.claim] ?? CLAIMS[0];
        if (!c) return reject("no claim");
        return A.alwaysSometimesNever({
          rng,
          claim: c.claim,
          truth: c.truth,
          reasons: c.reasons,
          solution: [{ say: c.reasons[0]?.text ?? "" }],
        });
      }
      default: {
        // One angle of an isosceles triangle is known, but not which one.
        const a = fifthAngle(p);
        return A.multiStepContext({
          context: ["One angle of an isosceles triangle is ", A.math(deg(a)), "."],
          parts: [
            {
              ask: "If it is the angle between the two equal sides, what size is each of the other two angles?",
              answer: A.degrees((180 - a) / 2),
              wrong: wrongs((180 - a) / 2, [
                {
                  code: "GEO.ISOSCELES.APEX-EQUALS-BASE",
                  value: A.degrees(a),
                  feedback:
                    "The other two angles are the equal ones, and they share what is left of 180°.",
                },
              ]),
            },
            {
              ask: "If instead it is one of the two equal angles, what size is the third angle?",
              answer: A.degrees(180 - 2 * a),
              wrong: wrongs(180 - 2 * a, [
                {
                  code: "GEO.ANGLES.ADDS-KNOWN",
                  value: A.degrees(180 - a),
                  feedback: "There are two angles of this size, so take both away from 180°.",
                },
              ]),
            },
          ],
          solution: [
            {
              say: "If it is between the equal sides, the other two angles are equal and share what is left.",
              math: `(180^\\circ - ${deg(a)}) \\div 2 = ${deg((180 - a) / 2)}`,
            },
            {
              say: "If it is one of the equal angles, there are two of them.",
              math: `180^\\circ - 2 \\times ${deg(a)} = ${deg(180 - 2 * a)}`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const parts = question.parts.map((q) => q.answer);
    const first = parts[0];
    if (first?.type !== "number") return true;
    if (parts.length === 2) {
      const second = parts[1];
      // Rebuild each triangle from the answers: both must have angles adding up to 180°.
      const a = fifthAngle(p);
      return (
        second?.type === "number" && a + 2 * first.value === 180 && 2 * a + second.value === 180
      );
    }
    const triangle = p.angles.length === 3;
    if (question.diagrams.some((d) => Array.isArray(d.segments))) {
      // Isosceles: apex + 2 × base = 180°.
      const base = (180 - p.apex) / 2;
      return p.given === "apex" ? first.value === base : first.value + 2 * base === 180;
    }
    return sum(p.angles.slice(0, -1)) + first.value === (triangle ? 180 : 360);
  },

  bounds: {
    friendly: { min: 10, max: 160, dp: 0 },
    standard: { min: 10, max: 160, dp: 0 },
    stretch: { min: 10, max: 160, dp: 0 },
  },
});
