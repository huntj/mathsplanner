/**
 * @statement Y5-NPV-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-NPV-01: Read, write, order and compare numbers to at least 1 000 000 and determine the value
// of each digit
import { defineGenerator } from "@mathsplanner/core";
import { compareNumbers, digitValue, mixFamilies } from "../shared/npv.ts";

export default defineGenerator(
  mixFamilies("Y5-NPV-01", {
    1: digitValue("Y5-NPV-01", { friendly: 5, standard: 6, stretch: 6 }),
    2: compareNumbers("Y5-NPV-01", {
      friendly: [10000, 99999],
      standard: [100000, 999999],
      stretch: [100000, 999999],
    }),
    3: digitValue("Y5-NPV-01", { friendly: 5, standard: 6, stretch: 6 }),
    4: compareNumbers("Y5-NPV-01", {
      friendly: [10000, 99999],
      standard: [100000, 999999],
      stretch: [100000, 999999],
    }),
  }),
);
