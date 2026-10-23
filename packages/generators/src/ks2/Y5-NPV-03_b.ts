/**
 * @statement Y5-NPV-03.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-NPV-03.b: Count forwards and backwards through zero
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y5-NPV-03.ts";

export default defineGenerator({ ...parent.definition, id: "Y5-NPV-03.b", depths: [1, 2] });
