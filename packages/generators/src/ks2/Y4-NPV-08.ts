/**
 * @statement Y4-NPV-08
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-NPV-08: Read Roman numerals to 100 (I to C) and know that the numeral system changed over time
// to include zero and place value
import { defineGenerator } from "@mathsplanner/core";
import { romanNumerals } from "../shared/npv.ts";

export default defineGenerator(
  romanNumerals("Y4-NPV-08", { friendly: [1, 20], standard: [1, 50], stretch: [20, 100] }),
);
