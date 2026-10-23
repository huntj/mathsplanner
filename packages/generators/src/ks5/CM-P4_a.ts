/**
 * @statement CM-P4.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// CM-P4.a: Find conditional probabilities from two-way tables
import { defineGenerator } from "@mathsplanner/core";
import source from "../ks4/GH-P9_a.ts";

export default defineGenerator({ ...source.definition, id: "CM-P4.a" });
