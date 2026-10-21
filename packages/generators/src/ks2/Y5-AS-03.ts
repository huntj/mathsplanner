/**
 * @statement Y5-AS-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-AS-03: Use rounding to check answers and determine levels of accuracy
import { defineGenerator } from "@mathsplanner/core";
import { checking } from "../shared/as.ts";

export default defineGenerator(
  checking(
    "Y5-AS-03",
    { friendly: [10001, 49999], standard: [10001, 99999], stretch: [100001, 999999] },
    { friendly: [1000], standard: [1000, 10000], stretch: [10000, 100000] },
  ),
);
