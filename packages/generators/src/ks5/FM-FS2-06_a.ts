/**
 * @statement FM-FS2-06.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FS2-06.a: Use t-tests and t confidence intervals
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FS2-06.ts";

const own = concept(
  "FM-FS2-06.a",
  ["STA.HYPOTHESIS.SAMPLE-MEAN"],
  [],
  [
    {
      statement:
        "Ned uses the normal distribution for a test with a small sample from a normal population with unknown variance.",
      truth: false,
      right:
        "False. With σ unknown and a small sample, use the t-distribution with n − 1 degrees of freedom.",
      wrong: [
        ["True. The normal distribution always works for means.", "STA.HYPOTHESIS.SAMPLE-MEAN"],
        ["True. The t-distribution is only for large samples.", "STA.HYPOTHESIS.SAMPLE-MEAN"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-FS2-06.a" };

export default defineGenerator(mixFamilies("FM-FS2-06.a", { 1: base, 2: base, 4: own }));
