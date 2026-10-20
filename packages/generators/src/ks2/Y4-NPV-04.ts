/**
 * @statement Y4-NPV-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-NPV-04: Count backwards through zero to include negative numbers
import { defineGenerator } from "@mathsplanner/core";
import { negatives } from "../shared/npv.ts";

export default defineGenerator(
  negatives(
    "Y4-NPV-04",
    { friendly: [-5, 5], standard: [-10, 10], stretch: [-20, 20] },
    { friendly: [1], standard: [1, 2], stretch: [2, 5] },
  ),
);
