/**
 * @statement Y5-POS-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-POS-01.a: Describe the position of a shape after a reflection
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y5-POS-01.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims({ ...parent.definition, id: "Y5-POS-01.a" }, [
    {
      statement:
        "A point is 3 squares to the left of a mirror line. Kai says its reflection is 3 squares to the right of the line.",
      truth: true,
      right: "True. The image is the same distance from the mirror, on the other side.",
      wrong: [
        ["False. It is 6 squares to the right.", "GEO.SYMMETRY.HALF-DISTANCE"],
        ["False. It is on the mirror line."],
      ],
    },
    {
      claim: "A reflected shape is the same size as the original.",
      truth: "always",
      right: "Always. A reflection flips a shape; it does not stretch or shrink it.",
      wrong: [
        [
          "Sometimes. It is bigger if it is further from the mirror.",
          "POS.TRANSFORM.CHANGES-SHAPE",
        ],
        ["Never. Reflections are smaller."],
      ],
    },
    {
      statement: "Pia says a reflected shape faces the same way as the original.",
      truth: false,
      right: "False. A reflection flips the shape over, like in a mirror.",
      wrong: [
        ["True. A reflection just slides it.", "GEO.SYMMETRY.TRANSLATES"],
        ["True. Shapes never flip."],
      ],
    },
  ]),
);
