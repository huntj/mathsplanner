/**
 * @statement Y5-FR-11
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-FR-11: Recognise the per cent symbol, understand that per cent relates to 'number of parts per
// hundred', and write percentages as a fraction with denominator 100 and as a decimal
import { defineGenerator } from "@mathsplanner/core";
import { percentages } from "../shared/fr.ts";

export default defineGenerator(
  percentages("Y5-FR-11", { friendly: [100], standard: [100, 10], stretch: [100, 50] }, false),
);
