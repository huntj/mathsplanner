/**
 * @statement Y5-MD-05
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-MD-05: Multiply and divide numbers mentally drawing on known facts
import { defineGenerator } from "@mathsplanner/core";
import { mentalMD } from "../shared/md.ts";

export default defineGenerator(
  mentalMD(
    "Y5-MD-05",
    {
      friendly: ["times-tens", "divide-tens"],
      standard: ["times-tens", "divide-tens", "double-halve"],
      stretch: ["times-tens", "divide-tens", "double-halve"],
    },
    { friendly: 1, standard: 2, stretch: 3 },
  ),
);
