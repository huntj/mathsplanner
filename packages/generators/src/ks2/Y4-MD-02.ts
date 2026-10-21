/**
 * @statement Y4-MD-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-MD-02: Use place value, known and derived facts to multiply and divide mentally, including
// multiplying by 0 and 1, dividing by 1, and multiplying three numbers together
import { defineGenerator } from "@mathsplanner/core";
import { mentalMD } from "../shared/md.ts";

export default defineGenerator(
  mentalMD(
    "Y4-MD-02",
    {
      friendly: ["times-tens", "zero-one", "three"],
      standard: ["times-tens", "divide-tens", "zero-one", "three"],
      stretch: ["times-tens", "divide-tens", "zero-one", "three"],
    },
    { friendly: 1, standard: 1, stretch: 2 },
  ),
);
