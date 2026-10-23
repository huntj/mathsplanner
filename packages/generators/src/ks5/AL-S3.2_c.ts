/**
 * @statement AL-S3.2.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-S3.2.c: Use P(A|B) = P(A ∩ B)/P(B)
import { defineGenerator } from "@mathsplanner/core";
import parent from "./AL-S3.2.ts";

export default defineGenerator({ ...parent.definition, id: "AL-S3.2.c", depths: [1, 4] });
