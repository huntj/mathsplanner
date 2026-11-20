// The reasons a pupil writes beside a line of working, worded as in a model exam answer and the
// same wherever they appear. A lesson's `reason` fields come from here; the tests hold them to it.
export const REASON = {
  centre: "angle at the centre is twice the angle at the circumference",
  semicircle: "angle in a semicircle is 90°",
  triangle: "angles in a triangle add up to 180°",
  sameSegment: "angles in the same segment are equal",
  cyclic: "opposite angles of a cyclic quadrilateral add up to 180°",
  tangent: "a tangent meets a radius at 90°",
  quadrilateral: "angles in a quadrilateral add up to 360°",
  alternate: "alternate segment theorem",
  straightLine: "angles on a straight line add up to 180°",
} as const;

/** Every reason, for checking. */
export const REASONS: ReadonlySet<string> = new Set(Object.values(REASON));
