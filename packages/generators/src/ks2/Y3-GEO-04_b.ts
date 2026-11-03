/**
 * @statement Y3-GEO-04.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-GEO-04.b: Identify perpendicular and parallel lines
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y3-GEO-04.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims({ ...parent.definition, id: "Y3-GEO-04.b", depths: [1, 3, 4] }, [
    {
      claim: "Parallel lines stay the same distance apart.",
      truth: "always",
      right: "Always. That is why they never meet.",
      wrong: [
        ["Sometimes. They get closer at the ends.", "GEO.LINES.PARALLEL-ON-PAGE"],
        ["Never. They move apart."],
      ],
    },
    {
      statement: "Kit says a square has two pairs of parallel sides.",
      truth: true,
      right: "True. The top and bottom are parallel, and so are the two sides.",
      wrong: [
        ["False. It has none.", "GEO.LINES.PARALLEL-PERPENDICULAR"],
        ["False. Only the top and bottom count.", "GEO.LINES.PARALLEL-ON-PAGE"],
      ],
    },
    {
      claim: "Two lines are parallel if they do not meet on the page.",
      truth: "sometimes",
      right:
        "Sometimes. If they slope towards each other, they would meet if you drew them longer.",
      wrong: [
        ["Always. Not meeting means parallel.", "GEO.LINES.PARALLEL-ON-PAGE"],
        ["Never. Parallel lines meet."],
      ],
    },
  ]),
);
