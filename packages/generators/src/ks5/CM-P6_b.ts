/**
 * @statement CM-P6.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// CM-P6.b: Use the addition rule
import { defineGenerator } from "@mathsplanner/core";
import source from "./CM-P6.ts";

export default defineGenerator({ ...source.definition, id: "CM-P6.b", depths: [1, 4] });
