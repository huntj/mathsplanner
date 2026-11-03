/**
 * @statement Y6-GEO-04.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y6-GEO-04.b: Know the diameter is twice the radius
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y6-GEO-04.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims({ ...parent.definition, id: "Y6-GEO-04.b", depths: [1, 4] }, [
    {
      statement: "A circle has a radius of 9 cm. Dan says its diameter is 18 cm.",
      truth: true,
      right: "True. The diameter is twice the radius: 2 × 9 = 18 cm.",
      wrong: [["False. It is 4.5 cm.", "GEO.CIRCLE.RADIUS-DIAMETER"], ["False. It is 9 cm too."]],
    },
    {
      claim: "The radius of a circle is half its diameter.",
      truth: "always",
      right: "Always. A diameter is two radii end to end through the centre.",
      wrong: [
        ["Never. The radius is double the diameter.", "GEO.CIRCLE.RADIUS-DIAMETER"],
        ["Sometimes. Only for small circles."],
      ],
    },
    {
      claim: "The diameter of a circle is the longest straight line across it.",
      truth: "always",
      right: "Always. Every other line across, a chord, is shorter.",
      wrong: [
        ["Sometimes. A chord can be longer.", "GEO.CIRCLE.RADIUS-DIAMETER"],
        ["Never. The radius is longer."],
      ],
    },
  ]),
);
