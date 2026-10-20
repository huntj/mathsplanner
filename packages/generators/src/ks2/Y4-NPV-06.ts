/**
 * @statement Y4-NPV-06
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-NPV-06: Identify, represent and estimate numbers using different representations
import { defineGenerator } from "@mathsplanner/core";
import { numberLines } from "../shared/npv.ts";

export default defineGenerator(
  numberLines("Y4-NPV-06", {
    friendly: { max: 10000, major: 1000, minor: 2 },
    standard: { max: 10000, major: 1000, minor: 10 },
    stretch: { max: 10000, major: 1000, minor: 5 },
  }),
);
