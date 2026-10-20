/**
 * @statement Y6-GEO-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Phase 4 slice
 * @reviewed 2026-10-20 @huntj (teacher): depth 4 checked in the gallery, all numbers settings
 */
// Y6-GEO-04: Illustrate and name parts of circles, including radius, diameter and circumference,
// and know the diameter is twice the radius
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import type { Coord, GeometrySpec } from "@mathsplanner/diagrams";
import { circle, onCircle, RADIUS } from "../shared/circles.ts";

type Part = "radius" | "diameter" | "centre" | "circumference";

interface Params {
  given: "radius" | "diameter";
  /** The length given, in cm. */
  length: number;
  /** Direction of the drawn radius or diameter. */
  turn: number;
  parts: Part[];
  claimTrue: boolean;
}

const cm = (v: number) => `${v}\\text{ cm}`;

/** A circle with a radius OP or a diameter PQ drawn and labelled. */
function measured(
  given: Params["given"],
  label: string,
  length: number,
  turn: number,
): GeometrySpec {
  const P = onCircle(turn);
  const Q = onCircle(turn + 180);
  return circle({
    points: given === "radius" ? { P } : { P, Q },
    segments: [
      given === "radius"
        ? { from: "O", to: "P", label, length }
        : { from: "Q", to: "P", label, length },
    ],
    description: `A circle with centre O and its ${given} labelled ${label.replace("\\text{ cm}", " cm")}.`,
  });
}

/** A circle with one part marked by a question mark. */
function partFigure(part: Part, turn: number): GeometrySpec {
  const P = onCircle(turn);
  const Q = onCircle(turn + 180);
  switch (part) {
    case "radius":
      return circle({
        points: { P },
        segments: [{ from: "O", to: "P", label: "?" }],
        description: "A circle with a line from the centre to the edge marked ?.",
      });
    case "diameter":
      return circle({
        points: { P, Q },
        segments: [{ from: "Q", to: "P", label: "?" }],
        description: "A circle with a line across it through the centre marked ?.",
      });
    case "centre":
      return circle({
        names: { O: "?" },
        pointLabels: ["O"],
        description: "A circle with the point in the middle marked ?.",
      });
    case "circumference":
      return {
        ...circle({ description: "A circle with the line around its edge marked ?." }),
        circles: [{ centre: "O", radius: RADIUS, label: "?" }],
      };
  }
}

const NAME: Record<Part, string> = {
  radius: "Radius",
  diameter: "Diameter",
  centre: "Centre",
  circumference: "Circumference",
};

export default defineGenerator<Params>({
  id: "Y6-GEO-04",
  version: "1.0.1",
  depths: [1, 3, 4],
  misconceptions: ["GEO.CIRCLE.RADIUS-DIAMETER"],

  params(rng, numbers) {
    const given = rng.pick(["radius", "diameter"] as const);
    // Friendly diameters are even, so the radius is whole; stretch allows halves.
    const length =
      numbers === "friendly"
        ? given === "diameter"
          ? 2 * rng.int(1, 10)
          : rng.int(1, 10)
        : numbers === "standard"
          ? rng.int(3, 30)
          : rng.int(5, 60) / (given === "radius" ? 2 : 1);
    return {
      given,
      length,
      turn: numbers === "friendly" ? 0 : rng.int(0, 11) * 30,
      parts: rng.sample(["radius", "diameter", "centre", "circumference"] as Part[], 3),
      claimTrue: rng.bool(),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const figure = measured(p.given, cm(p.length), p.length, p.turn);
    switch (depth) {
      case 1: {
        const toDiameter = p.given === "radius";
        const answer = toDiameter ? 2 * p.length : p.length / 2;
        return A.standard({
          question: ["O is the centre of the circle.", A.figure(figure)],
          ask: `Work out the ${toDiameter ? "diameter" : "radius"} of the circle.`,
          answer: A.number(answer, { units: "cm" }),
          wrong: [
            {
              code: "GEO.CIRCLE.RADIUS-DIAMETER",
              value: A.number(toDiameter ? p.length / 2 : 2 * p.length, { units: "cm" }),
              feedback: toDiameter
                ? "The diameter goes right across the circle, so it is twice the radius, not half."
                : "The radius only goes from the centre to the edge, so it is half the diameter, not double.",
            },
          ],
          solution: [
            {
              say: toDiameter
                ? "The diameter is twice the radius:"
                : "The radius is half the diameter:",
              math: toDiameter
                ? `2 \\times ${p.length} = ${cm(answer)}`
                : `${p.length} \\div 2 = ${cm(answer)}`,
            },
          ],
        });
      }
      case 3:
        return A.matchRepresentations({
          rng,
          question: "Match each marked part of a circle to its name.",
          pairs: p.parts.map(
            (part) =>
              [A.figure(partFigure(part, p.turn)), NAME[part]] as [A.RichInput, A.RichInput],
          ),
          solution: [
            {
              say: "The centre is the point in the middle. A radius goes from the centre to the edge.",
            },
            {
              say: "A diameter goes right across through the centre. The circumference is the distance all the way round.",
            },
          ],
        });
      default: {
        const other = p.given === "radius" ? 2 * p.length : p.length / 2;
        const shown = p.claimTrue ? other : p.given === "radius" ? p.length / 2 : 2 * p.length;
        const asked = p.given === "radius" ? "diameter" : "radius";
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "O is the centre of the circle.",
            A.figure(figure),
            `Sam says the ${asked} of this circle is ${shown} cm.`,
          ],
          truth: p.claimTrue,
          reasons: [
            {
              text: `The diameter is twice the radius, so the ${asked} is ${other} cm.`,
              correct: true,
            },
            {
              text: `The ${asked} is ${p.given === "radius" ? "half" : "double"} the ${p.given}.`,
              code: "GEO.CIRCLE.RADIUS-DIAMETER",
            },
            { text: "You need to know the circumference to work it out." },
          ],
          solution: [
            {
              say: `The diameter is twice the radius. Here the ${p.given} is ${p.length} cm, so the ${asked} is ${other} cm.`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const answer = question.parts[0]?.answer;
    if (answer?.type !== "number") return true;
    // The drawn line is a radius (centre to edge) or diameter (through the centre), measured.
    const drawn = question.diagrams[0] as GeometrySpec | undefined;
    const s = drawn?.segments?.[0];
    const at = (n: string): Coord => drawn?.points[n] ?? [NaN, NaN];
    if (!s) return false;
    const len = Math.hypot(at(s.to)[0] - at(s.from)[0], at(s.to)[1] - at(s.from)[1]);
    const r = drawn.circles?.[0]?.radius ?? NaN;
    const isRadius = Math.abs(len - r) < 1e-6;
    const isDiameter = Math.abs(len - 2 * r) < 1e-6;
    return isRadius
      ? p.given === "radius" && answer.value === 2 * p.length
      : isDiameter && p.given === "diameter" && answer.value === p.length / 2;
  },
});
