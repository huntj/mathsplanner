/**
 * @statement Y3-GEO-03.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-GEO-03.b: Relate right angles to quarter, half, three-quarter and whole turns
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y3-GEO-03.ts";

export default defineGenerator({ ...parent.definition, id: "Y3-GEO-03.b", depths: [1, 4] });
