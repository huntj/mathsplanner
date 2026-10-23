/**
 * @statement Y3-NPV-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-NPV-01.a: Count in multiples of 4 and 8
import { defineGenerator } from "@mathsplanner/core";
import { countInSteps } from "../shared/npv.ts";

export default defineGenerator(
  countInSteps("Y3-NPV-01.a", { friendly: [4], standard: [4, 8], stretch: [4, 8] }),
);
