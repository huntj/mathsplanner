/**
 * @statement Y2-GEO-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-GEO-01.a: Describe the sides and vertices of 2D shapes
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y2-GEO-01.ts";

export default defineGenerator({ ...parent.definition, id: "Y2-GEO-01.a", depths: [1, 2, 4] });
