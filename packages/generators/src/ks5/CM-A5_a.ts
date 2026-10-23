/**
 * @statement CM-A5.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// CM-A5.a: Compare distributions using averages
import { defineGenerator } from "@mathsplanner/core";
import source from "./CM-A5.ts";

export default defineGenerator({ ...source.definition, id: "CM-A5.a", depths: [2, 4] });
