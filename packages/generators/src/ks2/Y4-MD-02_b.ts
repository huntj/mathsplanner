/**
 * @statement Y4-MD-02.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-MD-02.b: Multiply three numbers together
import { defineGenerator } from "@mathsplanner/core";
import { mentalMD } from "../shared/md.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    mentalMD(
      "Y4-MD-02.b",
      { friendly: ["three"], standard: ["three"], stretch: ["three"] },
      { friendly: 1, standard: 1, stretch: 2 },
    ),
    [
      {
        statement: "Jo says $2 \\times 3 \\times 5 = 30$.",
        truth: true,
        right: "True. 2 × 3 = 6, and 6 × 5 = 30.",
        wrong: [["False. It is 10, adding them.", "MD.MULTIPLY.ADDS"], ["False. It is 25."]],
      },
      {
        claim: "Multiplying three numbers in a different order gives the same answer.",
        truth: "always",
        right: "Always. 2 × 5 × 7 = 10 × 7 = 70, and 7 × 2 × 5 = 14 × 5 = 70.",
        wrong: [
          ["Never. The order matters.", "MD.MULTIPLY.ADDS"],
          ["Sometimes. Only if one of them is 1."],
        ],
      },
      {
        statement: "Kai says $4 \\times 5 \\times 2 = 11$.",
        truth: false,
        right: "False. 4 × 5 = 20 and 20 × 2 = 40. 11 is what you get by adding.",
        wrong: [
          ["True. 4 + 5 + 2 = 11.", "MD.MULTIPLY.ADDS"],
          ["True. Small numbers give small answers."],
        ],
      },
    ],
  ),
);
