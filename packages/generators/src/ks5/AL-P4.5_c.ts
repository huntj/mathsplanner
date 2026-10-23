/**
 * @statement AL-P4.5.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P4.5.c: Find the sum to infinity when |r| < 1
import { defineGenerator } from "@mathsplanner/core";
import parent from "./AL-P4.5.ts";

export default defineGenerator({ ...parent.definition, id: "AL-P4.5.c", depths: [2, 4] });
