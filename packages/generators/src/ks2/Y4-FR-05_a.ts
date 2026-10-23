/**
 * @statement Y4-FR-05.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-FR-05.a: Write tenths as decimals
import { defineGenerator } from "@mathsplanner/core";
import { fractionDecimal } from "../shared/fr.ts";

export default defineGenerator(
  fractionDecimal("Y4-FR-05.a", { friendly: [10], standard: [10], stretch: [10] }, false),
);
