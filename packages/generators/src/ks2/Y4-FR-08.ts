/**
 * @statement Y4-FR-08
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-FR-08: Round decimals with one decimal place to the nearest whole number
import { defineGenerator } from "@mathsplanner/core";
import { roundDecimals } from "../shared/fr.ts";

export default defineGenerator(
  roundDecimals(
    "Y4-FR-08",
    { friendly: [[1, 0]], standard: [[1, 0]], stretch: [[1, 0]] },
    { friendly: 10, standard: 20, stretch: 99 },
  ),
);
