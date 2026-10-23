/**
 * @statement CM-A10.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// CM-A10.a: Calculate Spearman's rank correlation coefficient
import { defineGenerator } from "@mathsplanner/core";
import source from "./CM-A10.ts";

export default defineGenerator({ ...source.definition, id: "CM-A10.a", depths: [2, 4] });
