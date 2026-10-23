/**
 * @statement CM-P3.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// CM-P3.a: Calculate probabilities of independent combined events
import { defineGenerator } from "@mathsplanner/core";
import source from "../ks4/GF-P8_a.ts";

export default defineGenerator({ ...source.definition, id: "CM-P3.a" });
