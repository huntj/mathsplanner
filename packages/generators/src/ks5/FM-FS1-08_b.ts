/**
 * @statement FM-FS1-08.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FS1-08.b: Find the size and power of a test
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FS1-08.ts";

const own = concept(
  "FM-FS1-08.b",
  ["STA.HYPOTHESIS.CONCLUSION"],
  [
    {
      question:
        "For a particular value of the parameter, the probability of a Type II error is 0.3.",
      ask: "What is the power of the test for that value?",
      correct: "0.7",
      wrong: [
        [
          "0.3",
          "Power is the probability of rejecting H₀ when it is false: 1 − P(Type II).",
          "STA.HYPOTHESIS.CONCLUSION",
        ],
        ["0.05", "The size of the test is a different quantity.", "STA.HYPOTHESIS.CONCLUSION"],
      ],
      why: "Power $= 1 - P(\\text{Type II error}) = 0.7$.",
    },
  ],
  [
    {
      statement:
        "Gil says the power of a test is the same whatever the true value of the parameter.",
      truth: false,
      right:
        "False. Power depends on the true value: the further it is from H₀, the more likely the test rejects H₀.",
      wrong: [
        ["True. Power is fixed by the significance level.", "STA.HYPOTHESIS.CONCLUSION"],
        ["True. Power is always 1 minus the size.", "STA.HYPOTHESIS.CONCLUSION"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-FS1-08.b" };

export default defineGenerator(mixFamilies("FM-FS1-08.b", { 1: own, 2: base, 4: own }));
