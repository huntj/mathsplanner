/**
 * @statement Y3-MEA-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-MEA-01.b: Measure mass and capacity
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y3-MEA-01.ts";

export default defineGenerator({ ...parent.definition, id: "Y3-MEA-01.b", depths: [1, 4] });
