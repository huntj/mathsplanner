/**
 * @statement Y3-MEA-05.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-MEA-05.b: Use am, pm, noon and midnight
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y3-MEA-05.ts";

export default defineGenerator({ ...parent.definition, id: "Y3-MEA-05.b", depths: [2, 4] });
