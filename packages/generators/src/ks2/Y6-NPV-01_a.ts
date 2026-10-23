/**
 * @statement Y6-NPV-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y6-NPV-01.a: Read and write numbers to 10 000 000
import { defineGenerator } from "@mathsplanner/core";
import { digitValue } from "../shared/npv.ts";

export default defineGenerator({
  ...digitValue("Y6-NPV-01.a", { friendly: 6, standard: 7, stretch: 7 }),
  depths: [2, 3],
});
