/**
 * @statement Y3-FR-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y3-FR-04: Recognise and show, using diagrams, equivalent fractions with small denominators
import { defineGenerator } from "@mathsplanner/core";
import { equivalents } from "../shared/fr.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    equivalents(
      "Y3-FR-04",
      { friendly: [2, 3, 4], standard: [2, 3, 4, 5], stretch: [3, 4, 5, 6] },
      { friendly: 2, standard: 3, stretch: 4 },
    ),
    [
      {
        claim: "1/2 is the same amount as 2/4.",
        truth: "always",
        right: "Always. Cut each half into 2 and you have 2 quarters.",
        wrong: [["Never. 2/4 is bigger.", "FR.EQUIV.ADD-SAME"], ["Sometimes. Only for cakes."]],
      },
      {
        claim: "Adding 1 to the top and bottom of a fraction keeps it the same amount.",
        truth: "sometimes",
        right: "Sometimes. 2/2 → 3/3 stays 1 whole, but 1/2 → 2/3 changes.",
        wrong: [
          ["Always. Do the same to the top and bottom.", "FR.EQUIV.ADD-SAME"],
          ["Never. Even 2/2 changes."],
        ],
      },
      {
        statement: "Kai says 1/3 = 2/6.",
        truth: true,
        right: "True. Multiply the top and bottom by 2.",
        wrong: [
          ["False. 1/3 = 2/4, adding 1.", "FR.EQUIV.ADD-SAME"],
          ["False. Thirds and sixths cannot match."],
        ],
      },
    ],
  ),
);
