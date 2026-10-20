/**
 * @statement Y3-NPV-05
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y3-NPV-05: Read and write numbers up to 1000 in numerals and words
import { defineGenerator } from "@mathsplanner/core";
import { numbersInWords } from "../shared/npv.ts";

export default defineGenerator(
  numbersInWords("Y3-NPV-05", { friendly: [100, 999], standard: [100, 999], stretch: [100, 999] }),
);
