/**
 * @statement AL-P4.4.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P4.4.b: Sum arithmetic series, including the first n natural numbers
import { defineGenerator } from "@mathsplanner/core";
import parent from "./AL-P4.4.ts";

export default defineGenerator({ ...parent.definition, id: "AL-P4.4.b", depths: [2, 4] });
