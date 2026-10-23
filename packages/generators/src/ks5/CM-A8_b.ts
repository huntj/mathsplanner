/**
 * @statement CM-A8.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// CM-A8.b: Use and interpret the PMCC
import { defineGenerator } from "@mathsplanner/core";
import source from "./CM-A8.ts";

export default defineGenerator({ ...source.definition, id: "CM-A8.b", depths: [2, 4] });
