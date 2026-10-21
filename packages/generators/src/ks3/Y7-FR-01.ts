/**
 * @statement Y7-FR-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y7-FR-01: Work interchangeably with terminating decimals and their corresponding fractions, e.g.
// 3.5 and 7/2 or 0.375 and 3/8
import { defineGenerator } from "@mathsplanner/core";
import { fractionDecimal } from "../shared/fr.ts";

export default defineGenerator(
  fractionDecimal(
    "Y7-FR-01",
    { friendly: [2, 4, 5], standard: [4, 5, 8, 20], stretch: [8, 16, 25, 40] },
    true,
    true,
  ),
);
