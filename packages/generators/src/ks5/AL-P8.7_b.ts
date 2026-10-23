/**
 * @statement AL-P8.7.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P8.7.b: Integrate by parts
import { defineGenerator } from "@mathsplanner/core";
import parent from "./AL-P8.7.ts";

export default defineGenerator({ ...parent.definition, id: "AL-P8.7.b", depths: [1, 4] });
