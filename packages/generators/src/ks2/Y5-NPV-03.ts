/**
 * @statement Y5-NPV-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-NPV-03: Interpret negative numbers in context; count through zero with positive and negative
// whole numbers
import { defineGenerator } from "@mathsplanner/core";
import { negatives } from "../shared/npv.ts";

export default defineGenerator(
  negatives(
    "Y5-NPV-03",
    { friendly: [-10, 10], standard: [-20, 20], stretch: [-50, 50] },
    { friendly: [1, 2, 5], standard: [5, 10], stretch: [10, 25] },
  ),
);
