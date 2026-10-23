/**
 * @statement Y5-MEA-05.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-MEA-05.a: Estimate volume using 1 cm³ blocks
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y5-MEA-05.ts";

export default defineGenerator({ ...parent.definition, id: "Y5-MEA-05.a", depths: [1, 4] });
