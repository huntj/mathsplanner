/**
 * @statement Y4-MD-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-MD-01.b: Recall the 7 times table
import { defineGenerator } from "@mathsplanner/core";
import { timesTables } from "../shared/md.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    timesTables(
      "Y4-MD-01.b",
      { friendly: [7], standard: [7], stretch: [7] },
      { friendly: 10, standard: 12, stretch: 12 },
    ),
    [
      {
        statement: "Ola says $7 \\times 8 = 56$.",
        truth: true,
        right: "True. 7 × 8 = 56.",
        wrong: [
          ["False. It is 15.", "MD.MULTIPLY.ADDS"],
          ["False. It is 63.", "MD.TABLES.NEIGHBOUR"],
        ],
      },
      {
        statement: "Ben says $42 \\div 7 = 7$.",
        truth: false,
        right: "False. 7 × 6 = 42, so 42 ÷ 7 = 6.",
        wrong: [["True. 7 × 7 = 42.", "MD.TABLES.NEIGHBOUR"], ["True. Dividing by 7 gives 7."]],
      },
      {
        claim: "$7 \\times 4$ gives the same answer as $4 \\times 7$.",
        truth: "always",
        right: "Always. Multiplying in either order gives the same answer: 28.",
        wrong: [
          ["Never. The order changes the answer.", "MD.DIVIDE.ORDER"],
          ["Sometimes. Only for small numbers."],
        ],
      },
    ],
  ),
);
