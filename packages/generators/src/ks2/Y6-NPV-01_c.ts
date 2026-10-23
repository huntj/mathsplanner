/**
 * @statement Y6-NPV-01.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y6-NPV-01.c: Order and compare numbers to 10 000 000
import { defineGenerator } from "@mathsplanner/core";
import { compareNumbers } from "../shared/npv.ts";

export default defineGenerator(
  compareNumbers("Y6-NPV-01.c", {
    friendly: [100000, 999999],
    standard: [1000000, 9999999],
    stretch: [1000000, 9999999],
  }),
);
