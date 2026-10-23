/**
 * @statement Y1-NPV-02.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y1-NPV-02.c: Count in 5s
import { defineGenerator } from "@mathsplanner/core";
import { countInSteps } from "../shared/npv.ts";

export default defineGenerator(
  countInSteps("Y1-NPV-02.c", { friendly: [5], standard: [5], stretch: [5] }),
);
