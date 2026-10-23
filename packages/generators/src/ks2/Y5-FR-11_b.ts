/**
 * @statement Y5-FR-11.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-FR-11.b: Write percentages as fractions with denominator 100
import { defineGenerator } from "@mathsplanner/core";
import { percentages } from "../shared/fr.ts";

export default defineGenerator({
  ...percentages("Y5-FR-11.b", { friendly: [100], standard: [100], stretch: [100] }, false),
  depths: [2, 3],
});
