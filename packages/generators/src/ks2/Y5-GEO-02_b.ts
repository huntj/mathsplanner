/**
 * @statement Y5-GEO-02.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-GEO-02.b: Identify acute, obtuse and reflex angles
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y5-GEO-02.ts";

export default defineGenerator({ ...parent.definition, id: "Y5-GEO-02.b", depths: [1, 3, 4] });
