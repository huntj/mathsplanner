/**
 * @statement Y5-FR-12
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-FR-12: Solve problems requiring knowing percentage and decimal equivalents of ½, ¼, ⅕, ⅖, ⅘
// and fractions with denominator 10 or 25
import { defineGenerator } from "@mathsplanner/core";
import { percentages } from "../shared/fr.ts";

export default defineGenerator(
  percentages(
    "Y5-FR-12",
    { friendly: [2, 4, 5], standard: [2, 4, 5, 10], stretch: [4, 5, 10, 25] },
    true,
  ),
);
