/**
 * @statement GF-G9
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Phase 4 slice; awaiting teacher review
 */
// GF-G9: Use circle vocabulary: centre, radius, chord, diameter, circumference, tangent, arc, sector,
// segment
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { pointAt, type Coord, type GeometrySpec } from "@mathsplanner/diagrams";
import { circle, onCircle, RADIUS, region } from "../shared/circles.ts";

type Feature = "radius" | "diameter" | "chord" | "tangent" | "sector" | "segment";

interface Params {
  feature: Feature;
  /** Where the feature sits round the circle. */
  turn: number;
  /** Angle at the centre for chords, sectors and segments; never 180°, which would be a semicircle. */
  span: number;
  claim: number;
}

const NAMES: Record<Feature, string> = {
  radius: "Radius",
  diameter: "Diameter",
  chord: "Chord",
  tangent: "Tangent",
  sector: "Sector",
  segment: "Segment",
};
const LINES: Feature[] = ["radius", "diameter", "chord", "tangent"];

function draw(f: Feature, turn: number, span: number): GeometrySpec {
  const P = onCircle(turn);
  switch (f) {
    case "radius":
      return circle({
        points: { P },
        segments: [{ from: "O", to: "P" }],
        description: "A circle with a line from the centre O to the edge.",
      });
    case "diameter":
      return circle({
        points: { P, Q: onCircle(turn + 180) },
        segments: [{ from: "Q", to: "P" }],
        description: "A circle with a line across it through the centre O.",
      });
    case "chord":
      return circle({
        points: { P, Q: onCircle(turn + span) },
        segments: [{ from: "P", to: "Q" }],
        description: "A circle with a line joining two points on the edge, not through the centre.",
      });
    case "tangent":
      return circle({
        points: { P, S: pointAt(P, turn + 90, 2.2), T: pointAt(P, turn - 90, 2.2) },
        segments: [{ from: "S", to: "T" }],
        dots: ["P"],
        description: "A circle with a straight line touching its edge at one point.",
      });
    case "sector":
    case "segment":
      return region(f, turn, turn + span);
  }
}

/** The feature a drawing shows, read from its geometry rather than from the parameters. */
function classify(spec: GeometrySpec): Feature | undefined {
  const at = (n: string): Coord => spec.points[n] ?? [NaN, NaN];
  const r = spec.circles?.[0]?.radius ?? NaN;
  const shaded = spec.polygons?.[0];
  if (shaded) return shaded.vertices.includes("O") ? "sector" : "segment";
  const s = spec.segments?.[0];
  if (!s) return undefined;
  const [a, b] = [at(s.from), at(s.to)];
  const on = (p: Coord) => Math.abs(Math.hypot(...p) - r) < 1e-6;
  // Distance from the centre to the line through a and b.
  const d = Math.abs(a[0] * b[1] - a[1] * b[0]) / Math.hypot(b[0] - a[0], b[1] - a[1]);
  if (s.from === "O" && on(b)) return "radius";
  if (on(a) && on(b)) return d < 1e-6 ? "diameter" : "chord";
  if (Math.abs(d - r) < 1e-6) return "tangent";
  return undefined;
}

/** The confusion each feature invites, as a coded wrong option. */
const CONFUSED: Partial<Record<Feature, A.Distractor>> = {
  chord: {
    content: "Diameter",
    code: "GEO.CIRCLE.CHORD-DIAMETER",
    feedback: "A diameter is a chord that passes through the centre. This one does not.",
  },
  diameter: {
    content: "Radius",
    code: "GEO.CIRCLE.RADIUS-DIAMETER",
    feedback: "A radius goes from the centre to the edge. This line goes right across.",
  },
  radius: {
    content: "Diameter",
    code: "GEO.CIRCLE.RADIUS-DIAMETER",
    feedback: "A diameter goes right across the circle. This line stops at the centre.",
  },
  sector: {
    content: "Segment",
    code: "GEO.CIRCLE.SECTOR-SEGMENT",
    feedback:
      "A segment is cut off by a chord. This region is between two radii, so it is a sector.",
  },
  segment: {
    content: "Sector",
    code: "GEO.CIRCLE.SECTOR-SEGMENT",
    feedback:
      "A sector is between two radii. This region is cut off by a chord, so it is a segment.",
  },
};

export default defineGenerator<Params>({
  id: "GF-G9",
  version: "1.0.0",
  depths: [1, 3, 4],
  misconceptions: [
    "GEO.CIRCLE.CHORD-DIAMETER",
    "GEO.CIRCLE.RADIUS-DIAMETER",
    "GEO.CIRCLE.SECTOR-SEGMENT",
  ],

  params(rng, numbers) {
    return {
      feature: rng.pick(
        numbers === "friendly"
          ? (["radius", "diameter", "chord", "sector"] as Feature[])
          : (Object.keys(NAMES) as Feature[]),
      ),
      turn: numbers === "friendly" ? 30 : rng.int(0, 23) * 15,
      span: rng.pick(numbers === "stretch" ? [70, 100, 130, 150] : [80, 110, 130]),
      claim: rng.int(0, 2),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const coded = CONFUSED[p.feature];
        // A diameter is also a chord, so "chord" is never a wrong answer for one.
        const others = (Object.keys(NAMES) as Feature[]).filter(
          (f) =>
            f !== p.feature &&
            NAMES[f] !== coded?.content &&
            !(p.feature === "diameter" && f === "chord"),
        );
        const isLine = LINES.includes(p.feature);
        return A.choice({
          rng,
          question: ["O is the centre of the circle.", A.figure(draw(p.feature, p.turn, p.span))],
          ask: isLine
            ? "What is the name of the straight line drawn?"
            : "What is the name of the shaded region?",
          correct: NAMES[p.feature],
          distractors: [
            ...(coded ? [coded] : []),
            ...rng.sample(others, coded ? 2 : 3).map((f) => ({ content: NAMES[f] })),
          ],
          solution: [
            {
              say: {
                radius: "It joins the centre to the circumference: a radius.",
                diameter:
                  "It joins two points on the circumference and passes through the centre: a diameter.",
                chord:
                  "It joins two points on the circumference without passing through the centre: a chord.",
                tangent: "It touches the circle at exactly one point: a tangent.",
                sector: "It is bounded by two radii and an arc: a sector.",
                segment: "It is bounded by a chord and an arc: a segment.",
              }[p.feature],
            },
          ],
        });
      }
      case 3: {
        const target: Feature =
          p.feature === "radius" || p.feature === "diameter" ? "tangent" : p.feature;
        const triangle = circle({
          points: { P: onCircle(p.turn), Q: onCircle(p.turn + p.span) },
          polygons: [{ vertices: ["O", "P", "Q"], shaded: true }],
          description: "A circle with the triangle between two radii and a chord shaded.",
        });
        const secant = circle({
          points: {
            S: pointAt(onCircle(p.turn), p.turn + 120, -1.2),
            T: pointAt(onCircle(p.turn), p.turn + 120, 3.8),
          },
          segments: [{ from: "S", to: "T" }],
          description: "A circle with a straight line crossing it at two points.",
        });
        const decoys: Record<
          Feature,
          { figure: GeometrySpec; code?: string; feedback?: string }[]
        > = {
          sector: [
            {
              figure: draw("segment", p.turn, p.span),
              code: "GEO.CIRCLE.SECTOR-SEGMENT",
              feedback: "That is a segment: it is cut off by a chord, not by two radii.",
            },
            {
              figure: triangle,
              feedback: "That is a triangle: its third side is a chord, not an arc.",
            },
          ],
          segment: [
            {
              figure: draw("sector", p.turn, p.span),
              code: "GEO.CIRCLE.SECTOR-SEGMENT",
              feedback: "That is a sector: it is between two radii.",
            },
            { figure: triangle, feedback: "That is a triangle made from two radii and a chord." },
          ],
          chord: [
            {
              figure: draw("radius", p.turn, p.span),
              feedback: "That is a radius: it starts at the centre.",
            },
            {
              figure: draw("tangent", p.turn, p.span),
              feedback: "That is a tangent: it only touches the circle.",
            },
          ],
          tangent: [
            {
              figure: draw("chord", p.turn, p.span),
              feedback: "That is a chord: both its ends are on the circle.",
            },
            {
              figure: secant,
              feedback: "That line crosses the circle at two points; a tangent touches it at one.",
            },
            { figure: draw("radius", p.turn, p.span) },
          ],
          radius: [],
          diameter: [],
        };
        return A.chooseTheDiagram({
          rng,
          question: "O is the centre of each circle.",
          ask: `Which diagram shows a ${target}?`,
          correct: draw(target, p.turn, p.span),
          distractors: decoys[target],
          solution: [
            {
              say: {
                sector: "A sector is between two radii and an arc.",
                segment: "A segment is between a chord and an arc.",
                chord: "A chord joins two points on the circle.",
                tangent: "A tangent touches the circle at exactly one point.",
                radius: "",
                diameter: "",
              }[target],
            },
          ],
        });
      }
      default: {
        const claims = [
          {
            statement: "Every diameter of a circle is also a chord.",
            truth: true,
            reasons: [
              {
                text: "A chord joins two points on the circle, and a diameter does that, passing through the centre too.",
                correct: true,
              },
              {
                text: "A chord can never pass through the centre.",
                code: "GEO.CIRCLE.CHORD-DIAMETER",
              },
              { text: "A diameter is a radius, not a chord.", code: "GEO.CIRCLE.RADIUS-DIAMETER" },
            ],
          },
          {
            statement: "A sector is the region between a chord and an arc.",
            truth: false,
            reasons: [
              {
                text: "That region is a segment. A sector is between two radii and an arc.",
                correct: true,
              },
              {
                text: "Sector and segment are two names for the same region.",
                code: "GEO.CIRCLE.SECTOR-SEGMENT",
              },
              { text: "A sector is the whole of the circle." },
            ],
          },
          {
            statement: "A tangent to a circle touches it at exactly one point.",
            truth: true,
            reasons: [
              {
                text: "A tangent meets the circle at one point and does not cross into it.",
                correct: true,
              },
              {
                text: "A tangent crosses the circle at two points, like a chord.",
                code: "GEO.CIRCLE.CHORD-DIAMETER",
              },
              { text: "A tangent must pass through the centre." },
            ],
          },
        ];
        const c = claims[p.claim];
        if (!c) return reject("no claim");
        return A.trueOrFalseWhy({
          rng,
          statement: c.statement,
          truth: c.truth,
          reasons: c.reasons,
          solution: [{ say: c.reasons[0]?.text ?? "" }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "true-or-false-why") return true;
    const answer = question.parts[0]?.answer;
    if (answer?.type !== "choice") return false;
    const chosen = answer.options.find((o) => o.id === answer.correct)?.content[0] as
      { v?: string; i?: number } | undefined;
    if (question.archetype === "choose-the-diagram") {
      const drawn = question.diagrams[chosen?.i ?? -1] as GeometrySpec | undefined;
      const target = p.feature === "radius" || p.feature === "diameter" ? "tangent" : p.feature;
      return drawn !== undefined && classify(drawn) === target;
    }
    // The name chosen is the feature measured from the drawing.
    const shown = classify(question.diagrams[0] as GeometrySpec);
    return (
      shown !== undefined &&
      chosen?.v === NAMES[shown] &&
      Math.abs((question.diagrams[0] as GeometrySpec).circles?.[0]?.radius ?? 0) === RADIUS
    );
  },
});
