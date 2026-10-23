/**
 * @statement Y4-MD-02.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-MD-02.b: Multiply three numbers together
import { defineGenerator } from "@mathsplanner/core";
import { mentalMD } from "../shared/md.ts";

export default defineGenerator(
  mentalMD(
    "Y4-MD-02.b",
    { friendly: ["three"], standard: ["three"], stretch: ["three"] },
    { friendly: 1, standard: 1, stretch: 2 },
  ),
);
