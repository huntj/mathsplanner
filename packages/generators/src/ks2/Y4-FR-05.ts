/**
 * @statement Y4-FR-05
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-FR-05: Recognise and write decimal equivalents of any number of tenths or hundredths
import { defineGenerator } from "@mathsplanner/core";
import { fractionDecimal } from "../shared/fr.ts";

export default defineGenerator(
  fractionDecimal("Y4-FR-05", { friendly: [10], standard: [10, 100], stretch: [100] }, false),
);
