/**
 * @statement Y6-MD-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-MD-04: Perform mental calculations, including with mixed operations and large numbers
import { defineGenerator } from "@mathsplanner/core";
import { mentalMD } from "../shared/md.ts";

export default defineGenerator(
  mentalMD(
    "Y6-MD-04",
    {
      friendly: ["times-tens", "divide-tens", "mixed"],
      standard: ["times-tens", "divide-tens", "double-halve", "mixed"],
      stretch: ["times-tens", "divide-tens", "double-halve", "mixed"],
    },
    { friendly: 2, standard: 3, stretch: 4 },
  ),
);
