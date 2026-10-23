/**
 * @statement FM-FS2-06.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FS2-06.b: Use paired t-tests
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FS2-06.ts";

const own = concept(
  "FM-FS2-06.b",
  ["STA.HYPOTHESIS.SAMPLE-MEAN"],
  [
    {
      question: "Ten students sit a test before and after a course.",
      ask: "Which test compares the means?",
      correct: "A paired t-test on the differences",
      wrong: [
        [
          "A two-sample t-test treating the groups as independent",
          "The same students are measured twice, so the samples are paired.",
          "STA.HYPOTHESIS.SAMPLE-MEAN",
        ],
        [
          "A chi-squared test",
          "Chi-squared tests frequencies, not means.",
          "STA.HYPOTHESIS.CONCLUSION",
        ],
      ],
      why: "Each student gives a before-after difference; test the mean difference with a t-test on 9 degrees of freedom.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-FS2-06.b" };

export default defineGenerator(mixFamilies("FM-FS2-06.b", { 1: own, 2: own, 4: base }));
