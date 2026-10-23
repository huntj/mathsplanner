/**
 * @statement Y2-NPV-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-NPV-01.b: Count in steps of 3 from 0
import { defineGenerator } from "@mathsplanner/core";
import { countInSteps } from "../shared/npv.ts";

export default defineGenerator(
  countInSteps("Y2-NPV-01.b", { friendly: [3], standard: [3], stretch: [3] }),
);
