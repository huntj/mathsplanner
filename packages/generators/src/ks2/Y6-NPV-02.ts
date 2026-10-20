/**
 * @statement Y6-NPV-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-NPV-02: Round any whole number to a required degree of accuracy
import { defineGenerator } from "@mathsplanner/core";
import { rounding } from "../shared/npv.ts";

export default defineGenerator(
  rounding(
    "Y6-NPV-02",
    { friendly: [10000, 999999], standard: [100000, 9999999], stretch: [1000000, 9999999] },
    { friendly: [100, 1000], standard: [1000, 10000, 100000], stretch: [10000, 100000, 1000000] },
  ),
);
