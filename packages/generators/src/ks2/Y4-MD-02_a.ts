/**
 * @statement Y4-MD-02.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-MD-02.a: Multiply by 0 and 1 and divide by 1
import { defineGenerator } from "@mathsplanner/core";
import { mentalMD } from "../shared/md.ts";

export default defineGenerator(
  mentalMD(
    "Y4-MD-02.a",
    { friendly: ["zero-one"], standard: ["zero-one"], stretch: ["zero-one"] },
    { friendly: 1, standard: 1, stretch: 2 },
  ),
);
