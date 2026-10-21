/**
 * @statement Y5-FR-08
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-FR-08: Round decimals with two decimal places to the nearest whole number and to one decimal
// place
import { defineGenerator } from "@mathsplanner/core";
import { roundDecimals } from "../shared/fr.ts";

export default defineGenerator(
  roundDecimals(
    "Y5-FR-08",
    {
      friendly: [[2, 0]],
      standard: [
        [2, 0],
        [2, 1],
      ],
      stretch: [
        [2, 1],
        [2, 0],
      ],
    },
    { friendly: 10, standard: 50, stretch: 99 },
  ),
);
