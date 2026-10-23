/**
 * @statement Y4-NPV-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-NPV-01.b: Count in multiples of 25
import { defineGenerator } from "@mathsplanner/core";
import { countInSteps } from "../shared/npv.ts";

export default defineGenerator(
  countInSteps("Y4-NPV-01.b", { friendly: [25], standard: [25], stretch: [25] }),
);
