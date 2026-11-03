/**
 * @statement Y4-FR-09
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-FR-09: Compare numbers with the same number of decimal places up to two decimal places
import { defineGenerator } from "@mathsplanner/core";
import { compareDecimals } from "../shared/fr.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(compareDecimals("Y4-FR-09", { friendly: 1, standard: 2, stretch: 2 }, false), [
    {
      statement: "Raj says $4.7 > 4.3$.",
      truth: true,
      right: "True. Both have 4 ones; 7 tenths is more than 3 tenths.",
      wrong: [
        ["False. They are equal, as both start with 4.", "NPV.COMPARE.ONES-FIRST"],
        ["False. 4.3 is bigger."],
      ],
    },
    {
      claim:
        "Of two decimals with different whole-number parts, the one with the bigger whole number is bigger.",
      truth: "always",
      right: "Always. 5.1 > 4.9 because 5 ones is more than 4 ones and 9 tenths.",
      wrong: [
        ["Sometimes. The tenths could make up the difference.", "NPV.COMPARE.ONES-FIRST"],
        ["Never. Compare the tenths first."],
      ],
    },
    {
      statement: "Leo says £2.09 is more than £2.10, because 9 is bigger than 1.",
      truth: false,
      right: "False. Compare the tenths: £2.10 has 1 tenth and £2.09 has 0, so £2.10 is more.",
      wrong: [
        ["True. Compare the last digits.", "NPV.DECIMAL.LONGER-BIGGER"],
        ["True. 09 is bigger than 10."],
      ],
    },
  ]),
);
