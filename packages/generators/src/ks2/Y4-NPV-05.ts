/**
 * @statement Y4-NPV-05
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-NPV-05: Order and compare numbers beyond 1000
import { defineGenerator } from "@mathsplanner/core";
import { compareNumbers } from "../shared/npv.ts";

export default defineGenerator(
  compareNumbers("Y4-NPV-05", {
    friendly: [1000, 9999],
    standard: [1000, 9999],
    stretch: [1000, 99999],
  }),
);
