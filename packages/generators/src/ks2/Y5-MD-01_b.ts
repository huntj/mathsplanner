/**
 * @statement Y5-MD-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-MD-01.b: Find all factor pairs of a number
import { defineGenerator } from "@mathsplanner/core";
import { factorsFamily } from "../shared/md.ts";

export default defineGenerator({
  ...factorsFamily("Y5-MD-01.b", { friendly: 50, standard: 72, stretch: 100 }, false),
  depths: [2, 4],
});
