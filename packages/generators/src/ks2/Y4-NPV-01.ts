/**
 * @statement Y4-NPV-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-NPV-01: Count in multiples of 6, 7, 9, 25 and 1000
import { defineGenerator } from "@mathsplanner/core";
import { countInSteps } from "../shared/npv.ts";

export default defineGenerator(
  countInSteps("Y4-NPV-01", {
    friendly: [25, 1000],
    standard: [6, 7, 9, 25, 1000],
    stretch: [6, 7, 9],
  }),
);
