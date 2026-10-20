/**
 * @statement Y6-NPV-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-NPV-04: Solve number and practical problems that involve all of the above
import { defineGenerator } from "@mathsplanner/core";
import { numberProblems } from "../shared/npv.ts";

export default defineGenerator(
  numberProblems(
    "Y6-NPV-04",
    { friendly: [102000, 988000], standard: [1020000, 9880000], stretch: [1020000, 9880000] },
    { friendly: [10000], standard: [10000, 100000], stretch: [100000, 1000000] },
  ),
);
