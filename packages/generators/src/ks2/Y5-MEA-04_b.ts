/**
 * @statement Y5-MEA-04.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-MEA-04.b: Compare areas in cm² and m²
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y5-MEA-04.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims({ ...parent.definition, id: "Y5-MEA-04.b", depths: [3, 4] }, [
    {
      statement: "Ali says a classroom floor is best measured in m², not cm².",
      truth: true,
      right: "True. A floor is several metres across, so square metres give sensible numbers.",
      wrong: [
        ["False. Always use cm².", "MEA.PERIMETER.AREA"],
        ["False. Floors are measured in m."],
      ],
    },
    {
      claim: "A longer rectangle has a bigger area.",
      truth: "sometimes",
      right: "Sometimes. A 10 by 1 rectangle has area 10, less than a 4 by 4 square's 16.",
      wrong: [
        ["Always. Longer means bigger.", "MEA.COMPARE.LOOKS"],
        ["Never. Squares are always bigger.", "MEA.COMPARE.LOOKS"],
      ],
    },
    {
      statement: "Bea says a 3 m by 2 m rug has an area of 10 m².",
      truth: false,
      right: "False. Area = 3 × 2 = 6 m². 10 m is its perimeter.",
      wrong: [
        ["True. 3 + 2 + 3 + 2 = 10.", "MEA.PERIMETER.AREA"],
        ["True. Add the sides and square them."],
      ],
    },
  ]),
);
