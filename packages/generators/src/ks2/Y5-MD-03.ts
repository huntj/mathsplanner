/**
 * @statement Y5-MD-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-MD-03: Establish whether a number up to 100 is prime and recall primes up to 19
import { defineGenerator } from "@mathsplanner/core";
import { primesFamily } from "../shared/md.ts";

export default defineGenerator(
  primesFamily("Y5-MD-03", { friendly: 20, standard: 50, stretch: 100 }, false),
);
