/**
 * @statement AL-S2.3.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-S2.3.b: Calculate variance and standard deviation from raw data and summary statistics
import { defineGenerator } from "@mathsplanner/core";
import parent from "./AL-S2.3.ts";

export default defineGenerator({ ...parent.definition, id: "AL-S2.3.b" });
