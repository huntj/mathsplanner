// Turn helpers for the early-years statements on turns and direction.
import { turn } from "@mathsplanner/diagrams";

export type Direction = "clockwise" | "anticlockwise";
export type Heading = "up" | "right" | "down" | "left";

export const HEADINGS: readonly Heading[] = ["up", "right", "down", "left"];
const DEGREES: Record<Heading, number> = { right: 0, up: 90, left: 180, down: 270 };

/** "a quarter turn", "a half turn", "a three-quarter turn", "a whole turn" */
export function turnName(quarters: number): string {
  return (
    ["no turn", "a quarter turn", "a half turn", "a three-quarter turn", "a whole turn"][
      quarters
    ] ?? `${quarters} quarter turns`
  );
}

/** The way you face after turning `quarters` quarter turns from `start`. */
export function after(start: Heading, quarters: number, direction: Direction): Heading {
  const steps = direction === "clockwise" ? quarters : -quarters;
  const i = HEADINGS.indexOf(start);
  return HEADINGS[(((i + steps) % 4) + 4) % 4] ?? start;
}

/** A turn diagram with no size label, so young students read the turn rather than a number. */
export function turnDiagram(start: Heading, quarters: number, direction: Direction) {
  return turn(quarters * 90, direction, { heading: DEGREES[start], label: "" });
}
