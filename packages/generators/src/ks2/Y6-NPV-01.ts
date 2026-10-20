/**
 * @statement Y6-NPV-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-NPV-01: Read, write, order and compare numbers up to 10 000 000 and determine the value of
// each digit
import { defineGenerator } from "@mathsplanner/core";
import { compareNumbers, digitValue, mixFamilies } from "../shared/npv.ts";

export default defineGenerator(
  mixFamilies("Y6-NPV-01", {
    1: digitValue("Y6-NPV-01", { friendly: 6, standard: 7, stretch: 7 }),
    2: compareNumbers("Y6-NPV-01", {
      friendly: [100000, 999999],
      standard: [1000000, 9999999],
      stretch: [1000000, 9999999],
    }),
    3: digitValue("Y6-NPV-01", { friendly: 6, standard: 7, stretch: 7 }),
    4: compareNumbers("Y6-NPV-01", {
      friendly: [100000, 999999],
      standard: [1000000, 9999999],
      stretch: [1000000, 9999999],
    }),
  }),
);
