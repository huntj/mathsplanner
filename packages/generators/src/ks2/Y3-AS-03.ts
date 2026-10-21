/**
 * @statement Y3-AS-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y3-AS-03: Estimate the answer to a calculation and use inverse operations to check answers
import { defineGenerator } from "@mathsplanner/core";
import { checking } from "../shared/as.ts";

export default defineGenerator(
  checking(
    "Y3-AS-03",
    { friendly: [101, 499], standard: [101, 999], stretch: [101, 999] },
    { friendly: [100], standard: [10, 100], stretch: [10, 100] },
  ),
);
