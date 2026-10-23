/**
 * @statement Y6-MD-05.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y6-MD-05.c: Identify prime numbers
import { defineGenerator } from "@mathsplanner/core";
import { primesFamily } from "../shared/md.ts";

export default defineGenerator(
  primesFamily("Y6-MD-05.c", { friendly: 50, standard: 100, stretch: 100 }, false),
);
