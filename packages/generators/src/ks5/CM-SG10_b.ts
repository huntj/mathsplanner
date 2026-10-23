/**
 * @statement CM-SG10.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// CM-SG10.b: Find the sum to infinity when |r| < 1
import { defineGenerator } from "@mathsplanner/core";
import source from "./AL-P4.5_c.ts";

export default defineGenerator({ ...source.definition, id: "CM-SG10.b" });
