/**
 * @statement FM-FS1-03.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FS1-03.a: Use the geometric distribution
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FS1-03.ts";

const own = concept(
  "FM-FS1-03.a",
  ["PRO.GEOMETRIC"],
  [],
  [
    {
      statement:
        "Di says that for $X \\sim \\text{Geo}(0.2)$, the mean number of trials up to the first success is 0.2.",
      truth: false,
      right: "False. The mean is 1/p = 5 trials.",
      wrong: [
        ["True. The mean is p.", "PRO.GEOMETRIC"],
        ["True. The mean is 1 − p.", "PRO.GEOMETRIC"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-FS1-03.a" };

export default defineGenerator(mixFamilies("FM-FS1-03.a", { 1: base, 2: base, 4: own }));
