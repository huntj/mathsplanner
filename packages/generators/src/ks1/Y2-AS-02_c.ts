/**
 * @statement Y2-AS-02.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-AS-02.c: Add and subtract two 2-digit numbers
import { defineGenerator } from "@mathsplanner/core";
import { mental } from "../shared/as.ts";

export default defineGenerator(
  mental(
    "Y2-AS-02.c",
    { friendly: [11, 49], standard: [21, 89], stretch: [21, 89] },
    { friendly: [{ kind: "pair" }], standard: [{ kind: "pair" }], stretch: [{ kind: "pair" }] },
    10,
  ),
);
