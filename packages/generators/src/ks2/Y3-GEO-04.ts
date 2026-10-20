/**
 * @statement Y3-GEO-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Phase 4 slice; awaiting teacher review
 */
// Y3-GEO-04: Identify horizontal and vertical lines and pairs of perpendicular and parallel lines
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { pointAt, type GeometrySpec } from "@mathsplanner/diagrams";

type Relation = "parallel" | "perpendicular" | "neither";

interface Params {
  relation: Relation;
  /** Direction of the first line, in degrees. */
  heading: number;
  /** For "neither": the angle between the lines. */
  skew: number;
  orientation: "horizontal" | "vertical";
}

/** Two line segments in the given relation. Perpendicular lines meet; parallel ones are offset. */
function pair(relation: Relation, heading: number, skew: number): GeometrySpec {
  const second =
    relation === "parallel"
      ? heading
      : relation === "perpendicular"
        ? heading + 90
        : heading + skew;
  const a = [0, 0] as [number, number];
  const b = pointAt(a, heading, 4);
  const offset = pointAt(a, heading + 90, 1.6);
  const c = relation === "perpendicular" ? pointAt(a, heading, 1.2) : offset;
  const d = relation === "perpendicular" ? pointAt(c, second, 2.4) : pointAt(c, second, 4);
  return {
    type: "geometry",
    points: { A: a, B: b, C: c, D: d },
    segments: [
      { from: "A", to: "B" },
      { from: "C", to: "D" },
    ],
    description: "Two straight lines.",
  };
}

export default defineGenerator<Params>({
  id: "Y3-GEO-04",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["GEO.LINES.PARALLEL-PERPENDICULAR", "GEO.LINES.PARALLEL-ON-PAGE"],

  params(rng, numbers) {
    return {
      relation: rng.pick(["parallel", "perpendicular", "neither"] as const),
      heading: numbers === "friendly" ? rng.pick([0, 90]) : rng.int(0, 170),
      skew: rng.pick([35, 50, 60, 125, 140]),
      orientation: rng.pick(["horizontal", "vertical"] as const),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const label = { parallel: "Parallel", perpendicular: "Perpendicular", neither: "Neither" };
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: ["Look at these two lines.", A.figure(pair(p.relation, p.heading, p.skew))],
          ask: "Are they parallel, perpendicular or neither?",
          correct: label[p.relation],
          distractors: (["parallel", "perpendicular", "neither"] as const)
            .filter((r) => r !== p.relation)
            .map((r) => ({
              content: label[r],
              ...(r !== "neither" && p.relation !== "neither"
                ? {
                    code: "GEO.LINES.PARALLEL-PERPENDICULAR",
                    feedback:
                      "Parallel lines never meet and stay the same distance apart; perpendicular lines meet at a right angle.",
                  }
                : {}),
            })),
          solution: [
            {
              say:
                p.relation === "parallel"
                  ? "The lines go in exactly the same direction and stay the same distance apart, so they are parallel."
                  : p.relation === "perpendicular"
                    ? "The lines meet at a right angle, so they are perpendicular."
                    : "The lines would meet, but not at a right angle, so they are neither.",
            },
          ],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question:
            p.orientation === "horizontal"
              ? "A line goes straight across the page, like the horizon."
              : "A line goes straight down the page, like a hanging rope.",
          ask: "Is it horizontal or vertical?",
          correct: p.orientation === "horizontal" ? "Horizontal" : "Vertical",
          distractors: [{ content: p.orientation === "horizontal" ? "Vertical" : "Horizontal" }],
          solution: [
            {
              say: "Horizontal lines go across, like the horizon; vertical lines go straight up and down.",
            },
          ],
        });
      case 3: {
        const target = p.relation === "neither" ? "parallel" : p.relation;
        const others = (["parallel", "perpendicular", "neither"] as const).filter(
          (r) => r !== target,
        );
        return A.chooseTheDiagram({
          rng,
          question: `Which diagram shows a pair of ${target} lines?`,
          ask: "Choose the diagram.",
          correct: pair(target, p.heading, p.skew),
          distractors: others.map((r) => ({
            figure: pair(r, p.heading, p.skew),
            ...(r !== "neither"
              ? { code: "GEO.LINES.PARALLEL-PERPENDICULAR", feedback: `These lines are ${r}.` }
              : {}),
          })),
          solution: [
            {
              say:
                target === "parallel"
                  ? "Parallel lines never meet."
                  : "Perpendicular lines meet at a right angle.",
            },
          ],
        });
      }
      default: {
        // Two lines that close in on each other but do not meet on the page.
        const spec: GeometrySpec = {
          type: "geometry",
          points: { A: [0, 0], B: [5, 0], C: [0, 1.6], D: pointAt([0, 1.6], -12, 5) },
          segments: [
            { from: "A", to: "B" },
            { from: "C", to: "D" },
          ],
          description:
            "Two straight lines that get closer together towards the right but do not meet in the drawing.",
        };
        return A.trueOrFalseWhy({
          rng,
          statement: ["These two lines do not meet, so they are parallel.", A.figure(spec)],
          truth: false,
          reasons: [
            {
              text: "They get closer together, so if they were made longer they would meet.",
              correct: true,
            },
            {
              text: "Lines that do not touch on the page are always parallel.",
              code: "GEO.LINES.PARALLEL-ON-PAGE",
            },
            {
              text: "They are perpendicular because one slopes.",
              code: "GEO.LINES.PARALLEL-PERPENDICULAR",
            },
          ],
          solution: [
            {
              say: "Parallel lines stay the same distance apart forever. These close in on each other, so they are not parallel.",
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype !== "standard") return true;
    // Measure the angle between the drawn lines.
    const spec = question.diagrams[0] as GeometrySpec | undefined;
    const pts = spec?.points;
    if (!pts?.A || !pts.B || !pts.C || !pts.D) return false;
    const angle = ([ux, uy]: [number, number], [vx, vy]: [number, number]) =>
      Math.abs(Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy)) * (180 / Math.PI);
    const between = angle(
      [pts.B[0] - pts.A[0], pts.B[1] - pts.A[1]],
      [pts.D[0] - pts.C[0], pts.D[1] - pts.C[1]],
    );
    if (p.relation === "parallel") return between < 0.5 || between > 179.5;
    if (p.relation === "perpendicular") return Math.abs(between - 90) < 0.5;
    return between > 20 && between < 160 && Math.abs(between - 90) > 20;
  },
});
