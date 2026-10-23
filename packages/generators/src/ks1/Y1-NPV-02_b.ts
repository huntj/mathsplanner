/**
 * @statement Y1-NPV-02.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y1-NPV-02.b: Count in 2s
import { defineGenerator } from "@mathsplanner/core";
import { countInSteps } from "../shared/npv.ts";

export default defineGenerator(
  countInSteps("Y1-NPV-02.b", { friendly: [2], standard: [2], stretch: [2] }),
);
