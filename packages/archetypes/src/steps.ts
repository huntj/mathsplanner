// Solution-step builders for working that many statements share.
import type { StepInput } from "./archetypes.ts";

const deg = (v: number) => `${v}^\\circ`;

export interface AngleSumInput {
  /** What the angles add up to: 180 on a line or in a triangle, 360 at a point or in a quadrilateral. */
  total: number;
  /** Why, e.g. "Angles on a straight line add up to 180°." */
  reason: string;
  /** The angles already known, in degrees. */
  known: number[];
  /** Name of the unknown, e.g. "x". */
  unknown: string;
  /** How many equal unknowns share the remainder (2 for the base angles of an isosceles triangle). */
  share?: number;
}

/** "Angles on a straight line add up to 180°", then x = 180° − 47° = 133°. */
export function angleSum(input: AngleSumInput): StepInput[] {
  const share = input.share ?? 1;
  const remainder = input.total - input.known.reduce((s, a) => s + a, 0);
  const subtraction = [deg(input.total), ...input.known.map(deg)].join(" - ");
  const steps: StepInput[] = [{ say: input.reason }];
  if (share === 1) {
    steps.push({
      say: "Subtract the known angles.",
      math: `${input.unknown} = ${subtraction} = ${deg(remainder)}`,
    });
  } else {
    steps.push(
      {
        say: "Subtract the known angles to find what is left.",
        math: `${subtraction} = ${deg(remainder)}`,
      },
      {
        say: `Share it equally between the ${share} equal angles.`,
        math: `${input.unknown} = ${deg(remainder)} \\div ${share} = ${deg(remainder / share)}`,
      },
    );
  }
  return steps;
}

/** The interior angles of an n-sided polygon add up to (n − 2) × 180°. */
export function polygonAngleSum(sides: number): StepInput[] {
  return [
    {
      say: `A polygon with ${sides} sides splits into ${sides - 2} triangles from one vertex, and each triangle's angles add up to 180°.`,
      math: `(${sides} - 2) \\times 180^\\circ = ${deg((sides - 2) * 180)}`,
    },
  ];
}

/** A single step with optional working. */
export function say(text: string, math?: string): StepInput {
  return math === undefined ? { say: text } : { say: text, math };
}
