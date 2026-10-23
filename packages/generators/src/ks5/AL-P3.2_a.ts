/**
 * @statement AL-P3.2.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P3.2.a: Find the centre and radius of a circle by completing the square
import { defineGenerator } from "@mathsplanner/core";
import parent from "./AL-P3.2.ts";

export default defineGenerator({ ...parent.definition, id: "AL-P3.2.a", depths: [1, 4] });
