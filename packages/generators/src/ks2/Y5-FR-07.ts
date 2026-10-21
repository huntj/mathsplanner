/**
 * @statement Y5-FR-07
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-FR-07: Recognise and use thousandths and relate them to tenths, hundredths and decimal
// equivalents
import { defineGenerator } from "@mathsplanner/core";
import { fractionDecimal } from "../shared/fr.ts";

export default defineGenerator(
  fractionDecimal("Y5-FR-07", { friendly: [1000], standard: [100, 1000], stretch: [1000] }, false),
);
