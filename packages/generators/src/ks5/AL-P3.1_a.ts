/**
 * @statement AL-P3.1.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P3.1.a: Use straight-line equations in all forms
import { defineGenerator } from "@mathsplanner/core";
import parent from "./AL-P3.1.ts";

export default defineGenerator({ ...parent.definition, id: "AL-P3.1.a", depths: [1, 4] });
