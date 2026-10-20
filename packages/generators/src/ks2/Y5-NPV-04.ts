/**
 * @statement Y5-NPV-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-NPV-04: Round any number up to 1 000 000 to the nearest 10, 100, 1000, 10 000 and 100 000
import { defineGenerator } from "@mathsplanner/core";
import { rounding } from "../shared/npv.ts";

export default defineGenerator(
  rounding(
    "Y5-NPV-04",
    { friendly: [1000, 99999], standard: [10000, 999999], stretch: [100000, 999999] },
    { friendly: [10, 100, 1000], standard: [1000, 10000], stretch: [10000, 100000] },
  ),
);
