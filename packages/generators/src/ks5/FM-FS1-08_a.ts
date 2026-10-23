/**
 * @statement FM-FS1-08.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FS1-08.a: Identify Type I and Type II errors
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FS1-08.ts";

const own = concept(
  "FM-FS1-08.a",
  ["STA.HYPOTHESIS.CONCLUSION"],
  [
    {
      question: "A test has significance level 5%.",
      ask: "What is the probability of a Type I error?",
      correct: "At most 0.05",
      wrong: [
        [
          "0.95",
          "That is the probability of correctly accepting a true H₀.",
          "STA.HYPOTHESIS.CONCLUSION",
        ],
        [
          "It cannot be found",
          "A Type I error rejects a true H₀, which happens with probability at most the significance level.",
          "STA.HYPOTHESIS.CONCLUSION",
        ],
      ],
      why: "A Type I error is rejecting H₀ when it is true; its probability is the size of the test, at most 5%.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-FS1-08.a" };

export default defineGenerator(mixFamilies("FM-FS1-08.a", { 1: base, 2: own, 4: base }));
