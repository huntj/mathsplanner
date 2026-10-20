/**
 * @statement Y5-NPV-06
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-NPV-06: Solve number problems and practical problems involving all of the above
import { defineGenerator } from "@mathsplanner/core";
import { numberProblems } from "../shared/npv.ts";

export default defineGenerator(
  numberProblems(
    "Y5-NPV-06",
    { friendly: [10200, 98800], standard: [102000, 988000], stretch: [102000, 988000] },
    { friendly: [1000], standard: [1000, 10000], stretch: [10000, 100000] },
  ),
);
