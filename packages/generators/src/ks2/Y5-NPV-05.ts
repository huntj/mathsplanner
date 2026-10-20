/**
 * @statement Y5-NPV-05
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-NPV-05: Read Roman numerals to 1000 (M) and recognise years written in Roman numerals
import { defineGenerator } from "@mathsplanner/core";
import { romanNumerals } from "../shared/npv.ts";

export default defineGenerator(
  romanNumerals("Y5-NPV-05", { friendly: [50, 200], standard: [100, 1000], stretch: [1066, 2030] }),
);
