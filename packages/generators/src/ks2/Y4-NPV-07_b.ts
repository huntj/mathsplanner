/**
 * @statement Y4-NPV-07.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-NPV-07.b: Round to the nearest 100
import { defineGenerator } from "@mathsplanner/core";
import { rounding } from "../shared/npv.ts";

export default defineGenerator(
  rounding(
    "Y4-NPV-07.b",
    { friendly: [101, 999], standard: [100, 9999], stretch: [1000, 9999] },
    { friendly: [100], standard: [100], stretch: [100] },
  ),
);
