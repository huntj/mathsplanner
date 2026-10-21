/**
 * @statement Y5-FR-06
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-FR-06: Read and write decimal numbers as fractions, e.g. 0.71 = 71/100
import { defineGenerator } from "@mathsplanner/core";
import { fractionDecimal } from "../shared/fr.ts";

export default defineGenerator(
  fractionDecimal(
    "Y5-FR-06",
    { friendly: [10, 100], standard: [100], stretch: [100, 1000] },
    false,
  ),
);
