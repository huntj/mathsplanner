/**
 * @statement Y5-FR-08.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-FR-08.b: Round decimals with two places to one decimal place
import { defineGenerator } from "@mathsplanner/core";
import { roundDecimals } from "../shared/fr.ts";

export default defineGenerator(
  roundDecimals(
    "Y5-FR-08.b",
    { friendly: [[2, 1]], standard: [[2, 1]], stretch: [[2, 1]] },
    { friendly: 10, standard: 50, stretch: 99 },
  ),
);
