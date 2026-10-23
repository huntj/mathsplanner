/**
 * @statement Y5-MD-02.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-MD-02.a: Identify prime and composite numbers
import { defineGenerator } from "@mathsplanner/core";
import { primesFamily } from "../shared/md.ts";

export default defineGenerator(
  primesFamily("Y5-MD-02.a", { friendly: 30, standard: 50, stretch: 100 }, false),
);
