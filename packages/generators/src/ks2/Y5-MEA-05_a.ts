/**
 * @statement Y5-MEA-05.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-MEA-05.a: Estimate volume using 1 cm³ blocks
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y5-MEA-05.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims({ ...parent.definition, id: "Y5-MEA-05.a", depths: [1, 4] }, [
    {
      statement:
        "A cuboid is made of 1 cm³ cubes, 3 long, 2 wide and 2 high. Leo says its volume is 12 cm³.",
      truth: true,
      right: "True. Each layer is 3 × 2 = 6 cubes, and there are 2 layers: 12 cubes.",
      wrong: [
        ["False. It is 7 cm³, adding 3 + 2 + 2.", "MEA.VOLUME.ADDS"],
        ["False. It is 6 cm³."],
      ],
    },
    {
      claim: "Two cuboids built from the same number of 1 cm³ cubes have the same volume.",
      truth: "always",
      right: "Always. Volume is the number of cubes, whatever shape they make.",
      wrong: [
        ["Sometimes. The taller one holds more.", "MEA.COMPARE.LOOKS"],
        ["Never. Different shapes have different volumes.", "MEA.COMPARE.LOOKS"],
      ],
    },
    {
      statement:
        "Kit says a tall thin cuboid has a bigger volume than a short wide one, because it looks bigger.",
      truth: false,
      right: "False. Count or calculate the cubes: looks can trick you.",
      wrong: [
        ["True. Taller means more volume.", "MEA.COMPARE.LOOKS"],
        ["True. Volume is the height."],
      ],
    },
  ]),
);
