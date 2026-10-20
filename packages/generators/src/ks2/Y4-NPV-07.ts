/**
 * @statement Y4-NPV-07
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-NPV-07: Round any number to the nearest 10, 100 or 1000
import { defineGenerator } from "@mathsplanner/core";
import { rounding } from "../shared/npv.ts";

export default defineGenerator(
  rounding(
    "Y4-NPV-07",
    { friendly: [11, 999], standard: [100, 9999], stretch: [1000, 9999] },
    { friendly: [10], standard: [10, 100], stretch: [10, 100, 1000] },
  ),
);
