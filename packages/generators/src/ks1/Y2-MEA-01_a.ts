/**
 * @statement Y2-MEA-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-MEA-01.a: Measure length and height in m and cm
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y2-MEA-01.ts";

export default defineGenerator({ ...parent.definition, id: "Y2-MEA-01.a", depths: [2, 3] });
