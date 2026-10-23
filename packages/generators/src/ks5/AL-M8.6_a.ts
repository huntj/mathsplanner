/**
 * @statement AL-M8.6.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-M8.6.a: Use limiting friction in statics
import { defineGenerator } from "@mathsplanner/core";
import parent from "./AL-M8.6.ts";

export default defineGenerator({ ...parent.definition, id: "AL-M8.6.a", depths: [1, 4] });
