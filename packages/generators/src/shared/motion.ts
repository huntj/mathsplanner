// Motion graphs shared by the GCSE kinematics sub-statements.
import type { CartesianSpec, Coord } from "@mathsplanner/diagrams";

/** A trip at velocity v: speeding up for t1 seconds, steady for t2, slowing to a stop over t3. */
export interface Trip {
  v: number;
  t1: number;
  t2: number;
  t3: number;
}

/** The velocity–time graph of a trip. */
export function vt(p: Trip): CartesianSpec {
  const pts: Coord[] = [
    [0, 0],
    [p.t1, p.v],
    [p.t1 + p.t2, p.v],
    [p.t1 + p.t2 + p.t3, 0],
  ];
  return {
    type: "cartesian",
    x: { min: 0, max: p.t1 + p.t2 + p.t3 + 2, step: 2, label: "\\text{time (s)}" },
    y: { min: 0, max: p.v + 2, step: 2, label: "\\text{velocity (m/s)}" },
    grid: true,
    segments: pts.slice(1).map((to, i) => ({ from: pts[i] as Coord, to })),
    description:
      "A velocity–time graph: speeding up steadily, a constant speed, then slowing down to stop.",
  };
}
