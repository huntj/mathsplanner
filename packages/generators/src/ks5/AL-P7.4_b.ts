/**
 * @statement AL-P7.4.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P7.4.b: Use the product rule
import { defineGenerator } from "@mathsplanner/core";
import parent from "./AL-P7.4.ts";

export default defineGenerator({ ...parent.definition, id: "AL-P7.4.b", depths: [2, 4] });
