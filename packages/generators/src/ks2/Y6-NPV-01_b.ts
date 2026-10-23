/**
 * @statement Y6-NPV-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y6-NPV-01.b: Find the value of each digit in numbers to 10 000 000
import { defineGenerator } from "@mathsplanner/core";
import { digitValue } from "../shared/npv.ts";

export default defineGenerator({
  ...digitValue("Y6-NPV-01.b", { friendly: 6, standard: 7, stretch: 7 }),
  depths: [1, 4],
});
