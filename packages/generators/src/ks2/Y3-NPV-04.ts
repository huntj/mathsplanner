/**
 * @statement Y3-NPV-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y3-NPV-04: Identify, represent and estimate numbers using different representations
import { defineGenerator } from "@mathsplanner/core";
import { numberLines } from "../shared/npv.ts";

export default defineGenerator(
  numberLines("Y3-NPV-04", {
    friendly: { max: 1000, major: 100, minor: 2 },
    standard: { max: 1000, major: 100, minor: 10 },
    stretch: { max: 1000, major: 100, minor: 5 },
  }),
);
