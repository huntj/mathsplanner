/**
 * @statement Y4-NPV-07.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-NPV-07.a: Round to the nearest 10
import { defineGenerator } from "@mathsplanner/core";
import { rounding } from "../shared/npv.ts";

export default defineGenerator(
  rounding(
    "Y4-NPV-07.a",
    { friendly: [11, 999], standard: [100, 9999], stretch: [1000, 9999] },
    { friendly: [10], standard: [10], stretch: [10] },
  ),
);
