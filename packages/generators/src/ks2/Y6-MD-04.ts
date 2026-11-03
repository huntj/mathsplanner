/**
 * @statement Y6-MD-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-MD-04: Perform mental calculations, including with mixed operations and large numbers
import { defineGenerator } from "@mathsplanner/core";
import { mentalMD } from "../shared/md.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    mentalMD(
      "Y6-MD-04",
      {
        friendly: ["times-tens", "divide-tens", "mixed"],
        standard: ["times-tens", "divide-tens", "double-halve", "mixed"],
        stretch: ["times-tens", "divide-tens", "double-halve", "mixed"],
      },
      { friendly: 2, standard: 3, stretch: 4 },
    ),
    [
      {
        statement: "Zoe says $600 \\div 20 = 30$.",
        truth: true,
        right: "True. 600 ÷ 20 is the same as 60 ÷ 2, which is 30.",
        wrong: [["False. It is 300.", "MD.PLACE.ZEROS"], ["False. It is 3."]],
      },
      {
        statement: "Ben says $25 \\times 48$ is the same as $50 \\times 24$.",
        truth: true,
        right:
          "True. Doubling one number and halving the other keeps the answer the same: both are 1,200.",
        wrong: [
          ["False. Changing the numbers changes the answer.", "MD.MULTIPLY.ADDS"],
          ["False. You must double both numbers."],
        ],
      },
      {
        claim: "Multiplying a whole number by 1 leaves it the same.",
        truth: "always",
        right: "Always. One lot of a number is the number itself.",
        wrong: [
          ["Never. Multiplying always makes a number bigger.", "MD.ZERO-ONE.IDENTITY"],
          ["Sometimes. Only for small numbers."],
        ],
      },
    ],
  ),
);
