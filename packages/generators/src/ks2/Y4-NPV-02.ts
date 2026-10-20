/**
 * @statement Y4-NPV-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-NPV-02: Find 1000 more or less than a given number
import { defineGenerator } from "@mathsplanner/core";
import { moreOrLess } from "../shared/npv.ts";

export default defineGenerator(
  moreOrLess(
    "Y4-NPV-02",
    { friendly: [1000, 8999], standard: [1000, 9999], stretch: [1000, 99999] },
    { friendly: [1000], standard: [1000], stretch: [1000] },
  ),
);
