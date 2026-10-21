/**
 * @statement Y6-FR-06
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-FR-06: Associate a fraction with division and calculate decimal fraction equivalents, e.g.
// 0.375 for ⅜
import { defineGenerator } from "@mathsplanner/core";
import { fractionDecimal } from "../shared/fr.ts";

export default defineGenerator(
  fractionDecimal(
    "Y6-FR-06",
    { friendly: [2, 4, 5], standard: [4, 5, 8, 20, 25], stretch: [8, 16, 20, 25, 40] },
    true,
  ),
);
