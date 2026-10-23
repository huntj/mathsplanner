/**
 * @statement CM-SG5.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// CM-SG5.c: Calculate with fractional indices
import { defineGenerator } from "@mathsplanner/core";
import source from "./CM-SG5.ts";

export default defineGenerator({ ...source.definition, id: "CM-SG5.c", depths: [1, 4] });
