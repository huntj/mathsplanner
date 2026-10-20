// Triangle helpers shared by the labelling, congruence and proof generators.
import {
  triangleSSS,
  type Coord,
  type GeoAngle,
  type GeometrySpec,
  type GeoSegment,
} from "@mathsplanner/diagrams";

/** What the marks on a pair of triangles show. AAA and SSA do not prove congruence. */
export type Marking = "SSS" | "SAS" | "ASA" | "RHS" | "AAA" | "SSA";
export const CRITERIA: Marking[] = ["SSS", "SAS", "ASA", "RHS"];

export const CRITERION_WORDS: Record<Marking, string> = {
  SSS: "three pairs of equal sides",
  SAS: "two pairs of equal sides and the angle between them",
  ASA: "two pairs of equal angles and the side between them",
  RHS: "a right angle, equal hypotenuses and one other pair of equal sides",
  AAA: "three pairs of equal angles",
  SSA: "two pairs of equal sides and an angle that is not between them",
};

const round = (v: number) => Math.round(v * 1e9) / 1e9;

/** The marks on triangle XYZ (in the order A, B, C) for each marking. */
function marksFor(m: Marking): { sides: [string, number][]; angles: [number, number | "right"][] } {
  // Sides by index: 0 = first-second (AB), 1 = second-third (BC), 2 = third-first (CA).
  switch (m) {
    case "SSS":
      return {
        sides: [
          ["AB", 1],
          ["BC", 2],
          ["CA", 3],
        ],
        angles: [],
      };
    case "SAS":
      return {
        sides: [
          ["AB", 1],
          ["BC", 2],
        ],
        angles: [[1, 1]],
      };
    case "ASA":
      return {
        sides: [["AB", 1]],
        angles: [
          [0, 1],
          [1, 2],
        ],
      };
    case "RHS":
      return {
        sides: [
          ["CA", 1],
          ["AB", 2],
        ],
        angles: [[1, "right"]],
      };
    case "AAA":
      return {
        sides: [],
        angles: [
          [0, 1],
          [1, 2],
          [2, 3],
        ],
      };
    case "SSA":
      return {
        sides: [
          ["AB", 1],
          ["BC", 2],
        ],
        angles: [[0, 1]],
      };
  }
}

export interface PairOptions {
  /** Side lengths AB, BC, CA; a right angle at B when marking is RHS. */
  sides: [number, number, number];
  /** Turn of the second triangle, in degrees. */
  rotation: number;
  /** Reflect the second triangle as well. */
  mirror: boolean;
}

/** Triangles ABC and DEF, DEF an exact copy moved to the right, marked to show `marking`. */
export function trianglePair(marking: Marking, o: PairOptions): GeometrySpec {
  const first = triangleSSS(...o.sides);
  const t = (o.rotation * Math.PI) / 180;
  const moved = (["A", "B", "C"] as const).map((name): Coord => {
    const [px, py] = first[name];
    const mx = o.mirror ? -px : px;
    return [mx * Math.cos(t) - py * Math.sin(t), mx * Math.sin(t) + py * Math.cos(t)];
  });
  const shift =
    Math.max(...Object.values(first).map((p) => p[0])) + 1.5 - Math.min(...moved.map((p) => p[0]));
  const lift =
    Math.min(...Object.values(first).map((p) => p[1])) - Math.min(...moved.map((p) => p[1]));
  const [D, E, F] = moved.map(([x, y]): Coord => [round(x + shift), round(y + lift)]) as [
    Coord,
    Coord,
    Coord,
  ];
  const names = [
    ["A", "B", "C"],
    ["D", "E", "F"],
  ] as const;
  const marks = marksFor(marking);
  const segments: GeoSegment[] = [];
  const angles: GeoAngle[] = [];
  names.forEach((tri, k) => {
    for (const [side, ticks] of marks.sides) {
      const i = "ABC".indexOf(side[0] ?? "A");
      const j = "ABC".indexOf(side[1] ?? "B");
      segments.push({ from: tri[i] ?? "A", to: tri[j] ?? "B", ticks });
    }
    // Second triangle mirrored: its vertices run clockwise, so angles turn the other way.
    const flip = k === 1 && o.mirror;
    for (const [v, arcs] of marks.angles) {
      const next = tri[(v + 1) % 3] ?? "A";
      const prev = tri[(v + 2) % 3] ?? "A";
      angles.push({
        vertex: tri[v] ?? "A",
        from: flip ? prev : next,
        to: flip ? next : prev,
        ...(arcs === "right" ? { right: true } : { arcs }),
      });
    }
  });
  return {
    type: "geometry",
    points: { ...first, D, E, F },
    polygons: [{ vertices: ["A", "B", "C"] }, { vertices: ["D", "E", "F"] }],
    segments,
    angles,
    pointLabels: true,
    description: `Triangles ABC and DEF, marked with ${CRITERION_WORDS[marking]}.`,
  };
}

/** Reads the marking back from the marks on triangle ABC, so a check does not trust the label. */
export function markingOf(spec: GeometrySpec): Marking | "other" {
  const inABC = (n: string) => "ABC".includes(n);
  const sides = (spec.segments ?? [])
    .filter((s) => s.ticks && inABC(s.from) && inABC(s.to))
    .map((s) => [s.from, s.to].sort().join(""));
  const angles = (spec.angles ?? []).filter((a) => inABC(a.vertex));
  const right = angles.find((a) => a.right);
  const vertices = angles.map((a) => a.vertex);
  if (sides.length === 3 && angles.length === 0) return "SSS";
  if (sides.length === 0 && angles.length === 3) return "AAA";
  if (sides.length === 2 && angles.length === 1) {
    const v = vertices[0] ?? "";
    const opposite = "ABC".replace(v, "");
    if (right && sides.includes(opposite) && sides.some((s) => s.includes(v))) return "RHS";
    return sides.every((s) => s.includes(v)) ? "SAS" : "SSA";
  }
  if (sides.length === 1 && angles.length === 2)
    return vertices.every((v) => sides[0]?.includes(v)) ? "ASA" : "other";
  return "other";
}

/** Side lengths for a scalene, non-right triangle (or a right one at B for RHS). */
export function pairSides(
  marking: Marking,
  pick: (min: number, max: number) => number,
): [number, number, number] {
  if (marking === "RHS") {
    const k = pick(8, 12) / 10;
    return [3 * k, 4 * k, 5 * k].map(round) as [number, number, number];
  }
  return [4, pick(26, 34) / 10, pick(41, 48) / 10];
}
