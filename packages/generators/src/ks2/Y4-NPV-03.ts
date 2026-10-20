/**
 * @statement Y4-NPV-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-NPV-03: Recognise the place value of each digit in a four-digit number (thousands, hundreds,
// tens, ones)
import { defineGenerator } from "@mathsplanner/core";
import { digitValue } from "../shared/npv.ts";

export default defineGenerator(digitValue("Y4-NPV-03", { friendly: 4, standard: 4, stretch: 4 }));
