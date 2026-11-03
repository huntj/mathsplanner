/**
 * @statement Y3-MD-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-MD-01.a: Recall and use the 3 times table
import { defineGenerator } from "@mathsplanner/core";
import { timesTables } from "../shared/md.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    timesTables(
      "Y3-MD-01.a",
      { friendly: [3], standard: [3], stretch: [3] },
      { friendly: 10, standard: 12, stretch: 12 },
    ),
    [
      {
        statement: "Ola says 3 × 7 = 21.",
        truth: true,
        right: "True. 7, 14, 21.",
        wrong: [
          ["False. It is 10.", "MD.MULTIPLY.ADDS"],
          ["False. It is 24.", "MD.TABLES.NEIGHBOUR"],
        ],
      },
      {
        statement: "Gus says 3 × 6 = 21.",
        truth: false,
        right: "False. 3 × 6 = 18. 21 is 3 × 7.",
        wrong: [
          ["True. 21 is in the 3 times table.", "MD.TABLES.NEIGHBOUR"],
          ["True. 3 + 6 makes 21."],
        ],
      },
      {
        claim: "3 × 5 gives the same answer as 5 × 3.",
        truth: "always",
        right: "Always. Both are 15: you can multiply in either order.",
        wrong: [
          ["Never. The order matters.", "MD.DIVIDE.ORDER"],
          ["Sometimes. Only for odd numbers."],
        ],
      },
    ],
  ),
);
