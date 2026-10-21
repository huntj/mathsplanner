/**
 * @statement Y5-MD-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-MD-02: Know and use prime numbers, prime factors and composite numbers
import { defineGenerator } from "@mathsplanner/core";
import { primesFamily } from "../shared/md.ts";

export default defineGenerator(
  primesFamily("Y5-MD-02", { friendly: 30, standard: 50, stretch: 100 }, true),
);
