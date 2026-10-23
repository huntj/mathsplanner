/**
 * @statement Y1-NPV-04.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y1-NPV-04.b: Represent numbers on a number line
import { defineGenerator } from "@mathsplanner/core";
import { numberLines } from "../shared/npv.ts";

export default defineGenerator(
  numberLines("Y1-NPV-04.b", {
    friendly: { max: 10, major: 5, minor: 5 },
    standard: { max: 20, major: 5, minor: 5 },
    stretch: { max: 100, major: 10, minor: 10 },
  }),
);
