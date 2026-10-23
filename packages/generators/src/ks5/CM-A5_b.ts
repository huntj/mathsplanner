/**
 * @statement CM-A5.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// CM-A5.b: Compare distributions using quartiles and IQR
import { defineGenerator } from "@mathsplanner/core";
import source from "../ks4/GH-S4_a.ts";

export default defineGenerator({ ...source.definition, id: "CM-A5.b" });
