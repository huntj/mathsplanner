/**
 * @statement Y5-MD-01.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-MD-01.c: Find common factors of two numbers
import { defineGenerator } from "@mathsplanner/core";
import { factorsFamily } from "../shared/md.ts";

export default defineGenerator({
  ...factorsFamily("Y5-MD-01.c", { friendly: 50, standard: 72, stretch: 100 }, true),
  depths: [1, 4],
});
