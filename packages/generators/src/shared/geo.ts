// Diagrams shared by the GCSE geometry steps: parallel lines cut by a transversal, right-angled
// triangles for Pythagoras and trigonometry, and general triangles for the sine and cosine rules.
import { transversal, triangleASA, type GeometrySpec } from "@mathsplanner/diagrams";

const rad = (d: number) => (d * Math.PI) / 180;

export type Relation = "corresponding" | "alternate" | "co-interior";

/** Parallel lines cut by a transversal: ∠BPQ is given, and its partner at Q is labelled x. */
export function parallelAngles(angle: number, relation: Relation): GeometrySpec {
  const partner = {
    corresponding: { vertex: "Q", from: "D", to: "T", value: angle, label: "x" },
    alternate: { vertex: "Q", from: "C", to: "P", value: angle, label: "x" },
    "co-interior": { vertex: "Q", from: "P", to: "D", value: 180 - angle, label: "x" },
  }[relation];
  return {
    ...transversal(angle),
    angles: [{ vertex: "P", from: "B", to: "Q", value: angle, label: `${angle}^\\circ` }, partner],
    description: `Two parallel lines cut by a transversal. One angle is ${angle}°; another, x, is marked.`,
  };
}

/**
 * A right-angled triangle, right angle at B, with the angle θ at A; labels on chosen sides.
 * AB is adjacent to θ, BC is opposite it, and CA is the hypotenuse.
 */
export function rightTriangle(
  angle: number,
  hyp: number,
  labels: { ab?: string; bc?: string; ca?: string; theta?: string },
): GeometrySpec {
  const ab = hyp * Math.cos(rad(angle));
  const bc = hyp * Math.sin(rad(angle));
  return {
    type: "geometry",
    points: { A: [0, 0], B: [ab, 0], C: [ab, bc] },
    polygons: [{ vertices: ["A", "B", "C"] }],
    segments: [
      ...(labels.ab ? [{ from: "A", to: "B", label: labels.ab }] : []),
      ...(labels.bc ? [{ from: "B", to: "C", label: labels.bc }] : []),
      ...(labels.ca ? [{ from: "C", to: "A", label: labels.ca }] : []),
    ],
    angles: [
      { vertex: "B", from: "C", to: "A", right: true },
      ...(labels.theta ? [{ vertex: "A", from: "B", to: "C", label: labels.theta }] : []),
    ],
    description: "A right-angled triangle with some sides and an angle labelled.",
  };
}

/** The right-angled triangle with legs a (along the base) and b (upright). */
export function legsTriangle(
  a: number,
  b: number,
  labels: { ab?: string; bc?: string; ca?: string; theta?: string },
): GeometrySpec {
  return rightTriangle((Math.atan2(b, a) * 180) / Math.PI, Math.hypot(a, b), labels);
}

/**
 * Triangle ABC from two angles and the side between them (A at the origin, B along the base),
 * with chosen sides and angles labelled. Angles given a label are drawn to their true size.
 */
export function triangle(
  angleA: number,
  ab: number,
  angleB: number,
  sides: { ab?: string; bc?: string; ca?: string },
  angles: { A?: string; B?: string; C?: string },
): GeometrySpec {
  const value = { A: angleA, B: angleB, C: 180 - angleA - angleB };
  const arms = { A: ["B", "C"], B: ["C", "A"], C: ["A", "B"] } as const;
  return {
    type: "geometry",
    points: triangleASA(angleA, ab, angleB),
    polygons: [{ vertices: ["A", "B", "C"] }],
    segments: [
      ...(sides.ab ? [{ from: "A", to: "B", label: sides.ab }] : []),
      ...(sides.bc ? [{ from: "B", to: "C", label: sides.bc }] : []),
      ...(sides.ca ? [{ from: "C", to: "A", label: sides.ca }] : []),
    ],
    angles: (["A", "B", "C"] as const).flatMap((v) => {
      const label = angles[v];
      return label ? [{ vertex: v, from: arms[v][0], to: arms[v][1], value: value[v], label }] : [];
    }),
    pointLabels: ["A", "B", "C"],
    description: "A triangle ABC with some sides and angles labelled.",
  };
}
