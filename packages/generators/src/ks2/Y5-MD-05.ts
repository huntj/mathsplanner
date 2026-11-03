/**
 * @statement Y5-MD-05
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-MD-05: Multiply and divide numbers mentally drawing on known facts
import { defineGenerator } from "@mathsplanner/core";
import { mentalMD } from "../shared/md.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    mentalMD(
      "Y5-MD-05",
      {
        friendly: ["times-tens", "divide-tens"],
        standard: ["times-tens", "divide-tens", "double-halve"],
        stretch: ["times-tens", "divide-tens", "double-halve"],
      },
      { friendly: 1, standard: 2, stretch: 3 },
    ),
    [
      {
        statement: "Zoe says $7 \\times 80 = 560$.",
        truth: true,
        right: "True. 7 × 8 = 56, and 80 is ten times 8, so 560.",
        wrong: [
          ["False. It is 5,600.", "MD.PLACE.ZEROS"],
          ["False. It is 87.", "MD.MULTIPLY.ADDS"],
        ],
      },
      {
        statement: "Ben says $3{,}600 \\div 9 = 4{,}000$.",
        truth: false,
        right: "False. 36 ÷ 9 = 4, and 3,600 is 100 times 36, so 400.",
        wrong: [
          ["True. 36 ÷ 9 = 4, then add three zeros.", "MD.PLACE.ZEROS"],
          ["True. Dividing big numbers gives big answers."],
        ],
      },
      {
        claim: "Multiplying a number by 0 gives 0.",
        truth: "always",
        right: "Always. Zero lots of anything is nothing.",
        wrong: [
          ["Never. It leaves the number the same.", "MD.ZERO-ONE.IDENTITY"],
          ["Sometimes. Only for small numbers."],
        ],
      },
    ],
  ),
);
