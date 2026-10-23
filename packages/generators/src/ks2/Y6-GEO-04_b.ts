/**
 * @statement Y6-GEO-04.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y6-GEO-04.b: Know the diameter is twice the radius
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y6-GEO-04.ts";

export default defineGenerator({ ...parent.definition, id: "Y6-GEO-04.b", depths: [1, 4] });
