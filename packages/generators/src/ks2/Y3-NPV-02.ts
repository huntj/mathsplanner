/**
 * @statement Y3-NPV-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y3-NPV-02: Recognise the place value of each digit in a three-digit number (hundreds, tens, ones)
import { defineGenerator } from "@mathsplanner/core";
import { digitValue } from "../shared/npv.ts";

export default defineGenerator(digitValue("Y3-NPV-02", { friendly: 3, standard: 3, stretch: 3 }));
