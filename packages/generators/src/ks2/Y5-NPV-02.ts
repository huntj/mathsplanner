/**
 * @statement Y5-NPV-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-NPV-02: Count forwards or backwards in steps of powers of 10 for any number up to 1 000 000
import { defineGenerator } from "@mathsplanner/core";
import { moreOrLess } from "../shared/npv.ts";

export default defineGenerator(
  moreOrLess(
    "Y5-NPV-02",
    { friendly: [1000, 99999], standard: [10000, 899999], stretch: [10000, 899999] },
    { friendly: [10, 100, 1000], standard: [1000, 10000], stretch: [10000, 100000] },
  ),
);
