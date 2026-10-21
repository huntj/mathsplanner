/**
 * @statement Y4-AS-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-AS-02: Estimate and use inverse operations to check answers to a calculation
import { defineGenerator } from "@mathsplanner/core";
import { checking } from "../shared/as.ts";

export default defineGenerator(
  checking(
    "Y4-AS-02",
    { friendly: [1001, 4999], standard: [1001, 9999], stretch: [1001, 9999] },
    { friendly: [1000], standard: [100, 1000], stretch: [100, 1000] },
  ),
);
