/**
 * @statement CM-SG10.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// CM-SG10.a: Find the sum to n terms of a geometric series
import { defineGenerator } from "@mathsplanner/core";
import source from "./AL-P4.5_b.ts";

export default defineGenerator({ ...source.definition, id: "CM-SG10.a" });
