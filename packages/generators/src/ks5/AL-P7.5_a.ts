/**
 * @statement AL-P7.5.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P7.5.a: Differentiate implicitly
import { defineGenerator } from "@mathsplanner/core";
import parent from "./AL-P7.5.ts";

export default defineGenerator({ ...parent.definition, id: "AL-P7.5.a", depths: [2, 4] });
