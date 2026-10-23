/**
 * @statement CM-LP10.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// CM-LP10.a: Use the ruler (objective line) method
import { defineGenerator } from "@mathsplanner/core";
import source from "./CM-LP10.ts";

export default defineGenerator({ ...source.definition, id: "CM-LP10.a", depths: [2, 4] });
