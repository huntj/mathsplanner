/**
 * @statement Y5-NPV-01.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-NPV-01.c: Order and compare numbers to 1 000 000
import { defineGenerator } from "@mathsplanner/core";
import { compareNumbers } from "../shared/npv.ts";

export default defineGenerator(
  compareNumbers("Y5-NPV-01.c", {
    friendly: [10000, 99999],
    standard: [100000, 999999],
    stretch: [100000, 999999],
  }),
);
