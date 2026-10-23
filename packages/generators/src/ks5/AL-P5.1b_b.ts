/**
 * @statement AL-P5.1b.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P5.1b.b: Find arc lengths in radians
import { defineGenerator } from "@mathsplanner/core";
import parent from "./AL-P5.1b.ts";

export default defineGenerator({ ...parent.definition, id: "AL-P5.1b.b", depths: [2, 4] });
