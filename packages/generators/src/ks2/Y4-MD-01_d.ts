/**
 * @statement Y4-MD-01.d
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-MD-01.d: Recall division facts for tables up to 12 × 12
import { defineGenerator } from "@mathsplanner/core";
import { timesTables } from "../shared/md.ts";

const base = timesTables(
  "Y4-MD-01.d",
  { friendly: [6, 7, 9], standard: [6, 7, 8, 9, 11, 12], stretch: [7, 8, 9, 11, 12] },
  { friendly: 10, standard: 12, stretch: 12 },
);

export default defineGenerator({
  ...base,
  depths: [1, 2],
  params: (rng, numbers) => ({ ...base.params(rng, numbers), divide: true }),
});
