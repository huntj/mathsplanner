/**
 * @statement Y6-POS-02.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y6-POS-02.b: Reflect shapes in the axes
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y6-POS-02.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims({ ...parent.definition, id: "Y6-POS-02.b", depths: [1, 3, 4] }, [
    {
      statement: "Bea reflects (4, 2) in the y-axis and gets (−4, 2).",
      truth: true,
      right: "True. Reflecting in the y-axis changes the sign of x.",
      wrong: [
        ["False. It is (4, −2).", "POS.REFLECT.WRONG-AXIS"],
        ["False. It is (2, 4).", "ALG.COORD.ORDER"],
      ],
    },
    {
      claim: "A point and its reflection are the same distance from the mirror line.",
      truth: "always",
      right:
        "Always. A reflection puts the image as far behind the mirror as the point is in front.",
      wrong: [
        ["Sometimes. Only if the point is close.", "POS.REFLECT.WRONG-AXIS"],
        ["Never. The image is twice as far."],
      ],
    },
    {
      claim: "Reflecting a point in the x-axis changes its x-coordinate.",
      truth: "never",
      right: "Never. It changes the y-coordinate's sign; the x-coordinate stays the same.",
      wrong: [
        ["Always. The x-axis changes x.", "POS.REFLECT.WRONG-AXIS"],
        ["Sometimes. If x is negative."],
      ],
    },
  ]),
);
