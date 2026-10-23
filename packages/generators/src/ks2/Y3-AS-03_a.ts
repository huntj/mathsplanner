/**
 * @statement Y3-AS-03.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-AS-03.a: Estimate the answer to a calculation
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y3-AS-03.ts";

export default defineGenerator({ ...parent.definition, id: "Y3-AS-03.a", depths: [1, 4] });
