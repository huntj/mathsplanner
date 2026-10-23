/**
 * @statement Y5-NPV-04.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-NPV-04.b: Round to the nearest 10 000 and 100 000
import { defineGenerator } from "@mathsplanner/core";
import { rounding } from "../shared/npv.ts";

export default defineGenerator(
  rounding(
    "Y5-NPV-04.b",
    { friendly: [10001, 99999], standard: [10001, 999999], stretch: [100001, 999999] },
    { friendly: [10000], standard: [10000, 100000], stretch: [10000, 100000] },
  ),
);
