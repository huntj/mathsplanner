/**
 * @statement Y3-NPV-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-NPV-01.b: Count in multiples of 50 and 100
import { defineGenerator } from "@mathsplanner/core";
import { countInSteps } from "../shared/npv.ts";

export default defineGenerator(
  countInSteps("Y3-NPV-01.b", { friendly: [100], standard: [50, 100], stretch: [50, 100] }),
);
