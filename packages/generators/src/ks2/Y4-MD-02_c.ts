/**
 * @statement Y4-MD-02.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-MD-02.c: Multiply and divide mentally using derived facts, e.g. 60 × 3
import { defineGenerator } from "@mathsplanner/core";
import { mentalMD } from "../shared/md.ts";

export default defineGenerator(
  mentalMD(
    "Y4-MD-02.c",
    {
      friendly: ["times-tens"],
      standard: ["times-tens", "divide-tens"],
      stretch: ["times-tens", "divide-tens"],
    },
    { friendly: 1, standard: 1, stretch: 2 },
  ),
);
