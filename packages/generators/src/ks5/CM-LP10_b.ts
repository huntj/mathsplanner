/**
 * @statement CM-LP10.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// CM-LP10.b: Use the vertex method
import { defineGenerator } from "@mathsplanner/core";
import source from "./CM-LP10.ts";

export default defineGenerator({ ...source.definition, id: "CM-LP10.b", depths: [1, 4] });
