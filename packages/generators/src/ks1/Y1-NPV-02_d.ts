/**
 * @statement Y1-NPV-02.d
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y1-NPV-02.d: Count in 10s
import { defineGenerator } from "@mathsplanner/core";
import { countInSteps } from "../shared/npv.ts";

export default defineGenerator(
  countInSteps("Y1-NPV-02.d", { friendly: [10], standard: [10], stretch: [10] }),
);
