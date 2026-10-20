/**
 * @statement Y3-NPV-06
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y3-NPV-06: Solve number problems and practical problems involving these ideas
import { defineGenerator } from "@mathsplanner/core";
import { numberProblems } from "../shared/npv.ts";

export default defineGenerator(
  numberProblems(
    "Y3-NPV-06",
    { friendly: [120, 880], standard: [120, 880], stretch: [101, 899] },
    { friendly: [10], standard: [10, 100], stretch: [10, 100] },
  ),
);
