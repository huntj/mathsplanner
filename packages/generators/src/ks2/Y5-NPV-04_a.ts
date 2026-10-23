/**
 * @statement Y5-NPV-04.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-NPV-04.a: Round to the nearest 10, 100 and 1000
import { defineGenerator } from "@mathsplanner/core";
import { rounding } from "../shared/npv.ts";

export default defineGenerator(
  rounding(
    "Y5-NPV-04.a",
    { friendly: [1000, 99999], standard: [1000, 999999], stretch: [10000, 999999] },
    { friendly: [10, 100], standard: [10, 100, 1000], stretch: [10, 100, 1000] },
  ),
);
