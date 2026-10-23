/**
 * @statement Y4-NPV-01.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-NPV-01.c: Count in multiples of 1000
import { defineGenerator } from "@mathsplanner/core";
import { countInSteps } from "../shared/npv.ts";

export default defineGenerator(
  countInSteps("Y4-NPV-01.c", { friendly: [1000], standard: [1000], stretch: [1000] }),
);
