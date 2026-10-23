/**
 * @statement Y2-MEA-03.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-MEA-03.b: Combine amounts to make a value
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y2-MEA-03.ts";

export default defineGenerator({ ...parent.definition, id: "Y2-MEA-03.b", depths: [1, 5] });
