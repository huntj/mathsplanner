/**
 * @statement Y4-NPV-09
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-NPV-09: Solve number and practical problems with increasingly large positive numbers
import { defineGenerator } from "@mathsplanner/core";
import { numberProblems } from "../shared/npv.ts";

export default defineGenerator(
  numberProblems(
    "Y4-NPV-09",
    { friendly: [1200, 8800], standard: [1200, 9800], stretch: [10200, 98800] },
    { friendly: [100], standard: [100, 1000], stretch: [1000] },
  ),
);
