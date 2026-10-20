/**
 * @statement Y5-GEO-06
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Phase 4 slice
 * @reviewed 2026-10-20 @huntj (teacher): depth 4 checked in the gallery, all numbers settings
 */
// Y5-GEO-06: Distinguish between regular and irregular polygons based on reasoning about equal
// sides and angles
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { regularPolygon, type Coord, type GeometrySpec } from "@mathsplanner/diagrams";
import { equalSidedHexagon, polygonFacts, regularMarked, shape } from "../shared/shapes.ts";

type Figure = "regular" | "rhombus" | "equal-hexagon" | "rectangle" | "kite" | "stretched";

interface Params {
  figure: Figure;
  /** Sides of the regular or stretched polygon. */
  sides: number;
  rotation: number;
  claim: number;
}

/** A regular polygon pulled wider, so neither its sides nor its angles are all equal. */
function stretched(sides: number): GeometrySpec {
  const spec = regularPolygon(sides, 2);
  const points = Object.fromEntries(
    Object.entries(spec.points).map(([k, [x, y]]) => [
      k,
      [Math.round(x * 1.6 * 1e9) / 1e9, y] as Coord,
    ]),
  );
  return { ...spec, points };
}

/** A regular polygon with one corner pulled outwards. */
function pulled(sides: number): GeometrySpec {
  const spec = regularPolygon(sides, 2);
  const first = spec.polygons?.[0]?.vertices[0] ?? "A";
  const [x, y] = spec.points[first] ?? [0, 0];
  return {
    ...spec,
    points: {
      ...spec.points,
      [first]: [Math.round(x * 1.3 * 1e9) / 1e9, Math.round(y * 1.3 * 1e9) / 1e9],
    },
  };
}

function draw(p: Params): GeometrySpec {
  switch (p.figure) {
    case "regular":
      return regularMarked(p.sides);
    case "rhombus":
      return shape("rhombus", { marks: true, rotation: p.rotation });
    case "equal-hexagon":
      return equalSidedHexagon();
    case "rectangle":
      return shape("rectangle", { marks: true, rotation: p.rotation });
    case "kite":
      return shape("kite", { marks: true, rotation: p.rotation });
    case "stretched":
      return stretched(p.sides);
  }
}

const VERDICTS = {
  both: "Regular: all its sides are equal and all its angles are equal.",
  sides: "Irregular: its sides are all equal, but its angles are not.",
  angles: "Irregular: its angles are all equal, but its sides are not.",
  neither: "Irregular: its sides are not all equal and its angles are not all equal.",
};
const SIDES_ONLY = "Regular: all its sides are equal.";

const verdictOf = (f: { sidesEqual: boolean; anglesEqual: boolean }): keyof typeof VERDICTS =>
  f.sidesEqual ? (f.anglesEqual ? "both" : "sides") : f.anglesEqual ? "angles" : "neither";

export default defineGenerator<Params>({
  id: "Y5-GEO-06",
  version: "1.0.1",
  depths: [1, 3, 4],
  misconceptions: ["GEO.POLYGON.REGULAR-SIDES-ONLY", "GEO.SHAPES.ORIENTATION"],

  params(rng, numbers) {
    const figures: Figure[] =
      numbers === "friendly"
        ? ["regular", "rectangle", "kite", "regular"]
        : ["regular", "rhombus", "equal-hexagon", "rectangle", "kite", "stretched"];
    return {
      figure: rng.pick(figures),
      sides: rng.int(numbers === "friendly" ? 3 : 5, numbers === "stretch" ? 10 : 8),
      rotation: numbers === "friendly" ? 0 : rng.int(10, 70),
      claim: rng.int(0, 2),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const figure = draw(p);
        const verdict = verdictOf(polygonFacts(figure));
        const others = (Object.keys(VERDICTS) as (keyof typeof VERDICTS)[]).filter(
          (k) => k !== verdict,
        );
        const distractors: A.Distractor[] = others.map((k) => ({ content: VERDICTS[k] }));
        // Equal sides alone tempt the wrong conclusion; offer it in place of the least likely verdict.
        if (verdict === "sides")
          distractors.splice(-1, 1, {
            content: SIDES_ONLY,
            code: "GEO.POLYGON.REGULAR-SIDES-ONLY",
            feedback:
              "Equal sides are not enough: a regular polygon also has all its angles equal.",
          });
        return A.choice({
          rng,
          question: [
            "The marks show which sides are equal and which angles are right angles.",
            A.figure(figure),
          ],
          ask: "Is this polygon regular or irregular?",
          correct: VERDICTS[verdict],
          distractors,
          solution: [
            {
              say: "A polygon is regular only when all its sides are equal and all its angles are equal. Check both.",
            },
          ],
        });
      }
      case 3: {
        const n = p.figure === "equal-hexagon" || p.sides === 6 ? 6 : p.sides;
        const name = {
          5: "pentagon",
          6: "hexagon",
          7: "heptagon",
          8: "octagon",
          9: "nonagon",
          10: "decagon",
        }[n];
        if (!name) return reject("no name for this polygon");
        return A.chooseTheDiagram({
          rng,
          question: `Which picture shows a regular ${name}?`,
          ask: "Choose the picture.",
          correct: regularMarked(n),
          distractors: [
            ...(n === 6
              ? [
                  {
                    figure: equalSidedHexagon(),
                    code: "GEO.POLYGON.REGULAR-SIDES-ONLY",
                    feedback: "Its sides are equal, but its angles are not, so it is irregular.",
                  },
                ]
              : []),
            {
              figure: stretched(n),
              feedback: "This one has been stretched: its sides and angles are not all equal.",
            },
            {
              figure: regularMarked(n === 5 ? 6 : n - 1),
              feedback: "Count the sides: this regular polygon has the wrong number.",
            },
            ...(n === 6
              ? []
              : [
                  {
                    figure: pulled(n),
                    feedback:
                      "One corner sticks out, so two sides are longer and the angles are not all equal.",
                  },
                ]),
          ].slice(0, 3),
          solution: [{ say: `A regular ${name} has ${n} equal sides and ${n} equal angles.` }],
        });
      }
      default: {
        const claims = [
          {
            statement: [
              "Zara says this shape is a regular polygon because all its sides are equal.",
              A.figure(
                p.claim === 0
                  ? shape("rhombus", { marks: true, rotation: p.rotation })
                  : equalSidedHexagon(),
              ),
            ],
            truth: false,
            reasons: [
              { text: "Its angles are not all equal, so it is irregular.", correct: true },
              {
                text: "Equal sides are all a polygon needs to be regular.",
                code: "GEO.POLYGON.REGULAR-SIDES-ONLY",
              },
              {
                text: "It is irregular because it has been turned.",
                code: "GEO.SHAPES.ORIENTATION",
              },
            ],
          },
          {
            statement: "Omar says every equilateral triangle is a regular polygon.",
            truth: true,
            reasons: [
              {
                text: "Its three sides are equal and its three angles are all 60°.",
                correct: true,
              },
              {
                text: "No: a triangle cannot be regular, only shapes with four or more sides can.",
                code: "GEO.POLYGON.REGULAR-SIDES-ONLY",
              },
              { text: "Only if it is standing on one side.", code: "GEO.SHAPES.ORIENTATION" },
            ],
          },
          {
            statement:
              "Ella says a rectangle that is not a square is a regular polygon, because all its angles are right angles.",
            truth: false,
            reasons: [
              { text: "Its sides are not all equal, so it is irregular.", correct: true },
              { text: "Equal angles are all a polygon needs to be regular." },
              { text: "It is irregular because it has four sides." },
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
          solution: [
            {
              say: "Regular means all sides equal and all angles equal. Check both, whichever way the shape is turned.",
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "true-or-false-why") return true;
    const answer = question.parts[0]?.answer;
    if (answer?.type !== "choice") return false;
    const chosen = answer.options.find((o) => o.id === answer.correct)?.content[0] as
      { t: string; v?: string; i?: number } | undefined;
    if (question.archetype === "choose-the-diagram") {
      const drawn = question.diagrams[chosen?.i ?? -1] as GeometrySpec | undefined;
      const facts = drawn ? polygonFacts(drawn) : undefined;
      return facts?.sidesEqual === true && facts.anglesEqual && (drawn?.segments?.length ?? 0) > 0;
    }
    if (question.archetype !== "standard") return true;
    // The verdict chosen as correct is the one the drawn polygon's sides and angles give.
    return (
      chosen?.v === VERDICTS[verdictOf(polygonFacts(draw(p)))] && question.diagrams.length === 1
    );
  },
});
