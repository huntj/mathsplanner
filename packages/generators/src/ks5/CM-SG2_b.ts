/**
 * @statement CM-SG2.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// CM-SG2.b: Compare simple and compound interest graphically
import { defineGenerator } from "@mathsplanner/core";
import source from "./CM-SG2.ts";

export default defineGenerator({ ...source.definition, id: "CM-SG2.b", depths: [2, 4] });
