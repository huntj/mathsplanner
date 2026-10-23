/**
 * @statement Y4-NPV-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-NPV-01.a: Count in multiples of 6, 7 and 9
import { defineGenerator } from "@mathsplanner/core";
import { countInSteps } from "../shared/npv.ts";

export default defineGenerator(
  countInSteps("Y4-NPV-01.a", { friendly: [6, 9], standard: [6, 7, 9], stretch: [6, 7, 9] }),
);
