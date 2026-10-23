/**
 * @statement Y5-NPV-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-NPV-01.a: Read and write numbers to 1 000 000
import { defineGenerator } from "@mathsplanner/core";
import { numbersInWords } from "../shared/npv.ts";

export default defineGenerator(
  numbersInWords("Y5-NPV-01.a", {
    friendly: [1000, 99999],
    standard: [10000, 899999],
    stretch: [100000, 899999],
  }),
);
