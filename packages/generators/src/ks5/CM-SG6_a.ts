/**
 * @statement CM-SG6.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// CM-SG6.a: Find the nth term of linear sequences
import { defineGenerator } from "@mathsplanner/core";
import source from "./CM-SG6.ts";

export default defineGenerator({ ...source.definition, id: "CM-SG6.a", depths: [1, 4] });
