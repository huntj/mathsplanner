/**
 * @statement Y6-NPV-03.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y6-NPV-03.b: Calculate intervals across zero
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y6-NPV-03.ts";

export default defineGenerator({ ...parent.definition, id: "Y6-NPV-03.b", depths: [2, 4] });
