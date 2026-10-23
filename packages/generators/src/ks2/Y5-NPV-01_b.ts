/**
 * @statement Y5-NPV-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-NPV-01.b: Find the value of each digit in numbers to 1 000 000
import { defineGenerator } from "@mathsplanner/core";
import { digitValue } from "../shared/npv.ts";

export default defineGenerator(digitValue("Y5-NPV-01.b", { friendly: 5, standard: 6, stretch: 6 }));
