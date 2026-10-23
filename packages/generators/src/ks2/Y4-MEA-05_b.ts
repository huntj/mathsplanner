/**
 * @statement Y4-MEA-05.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-MEA-05.b: Convert between 12-hour and 24-hour times
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y4-MEA-05.ts";

export default defineGenerator({ ...parent.definition, id: "Y4-MEA-05.b", depths: [2, 4] });
