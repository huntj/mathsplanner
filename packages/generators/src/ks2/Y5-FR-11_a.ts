/**
 * @statement Y5-FR-11.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-FR-11.a: Understand per cent as parts per hundred
import { defineGenerator } from "@mathsplanner/core";
import { percentages } from "../shared/fr.ts";

export default defineGenerator({
  ...percentages("Y5-FR-11.a", { friendly: [100], standard: [100, 10], stretch: [100, 50] }, false),
  depths: [3, 5],
});
