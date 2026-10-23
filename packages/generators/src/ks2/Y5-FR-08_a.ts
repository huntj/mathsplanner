/**
 * @statement Y5-FR-08.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-FR-08.a: Round decimals with two places to the nearest whole number
import { defineGenerator } from "@mathsplanner/core";
import { roundDecimals } from "../shared/fr.ts";

export default defineGenerator(
  roundDecimals(
    "Y5-FR-08.a",
    { friendly: [[2, 0]], standard: [[2, 0]], stretch: [[2, 0]] },
    { friendly: 10, standard: 50, stretch: 99 },
  ),
);
