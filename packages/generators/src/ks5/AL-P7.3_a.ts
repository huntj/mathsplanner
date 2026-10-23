/**
 * @statement AL-P7.3.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P7.3.a: Find tangents and normals
import { defineGenerator } from "@mathsplanner/core";
import parent from "./AL-P7.3.ts";

export default defineGenerator({ ...parent.definition, id: "AL-P7.3.a", depths: [1, 2] });
