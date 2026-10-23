/**
 * @statement Y4-FR-05.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-FR-05.b: Write hundredths as decimals
import { defineGenerator } from "@mathsplanner/core";
import { fractionDecimal } from "../shared/fr.ts";

export default defineGenerator(
  fractionDecimal("Y4-FR-05.b", { friendly: [100], standard: [100], stretch: [100] }, false),
);
