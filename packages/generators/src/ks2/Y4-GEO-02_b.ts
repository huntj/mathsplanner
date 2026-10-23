/**
 * @statement Y4-GEO-02.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-GEO-02.b: Compare and order angles up to two right angles
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y4-GEO-02.ts";

export default defineGenerator({ ...parent.definition, id: "Y4-GEO-02.b", depths: [3, 4] });
