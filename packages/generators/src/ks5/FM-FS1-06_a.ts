/**
 * @statement FM-FS1-06.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FS1-06.a: Use chi-squared tests for goodness of fit
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FS1-06.ts";

const own = concept(
  "FM-FS1-06.a",
  ["STA.HYPOTHESIS.CONCLUSION"],
  [
    {
      question:
        "A die is rolled 60 times to test whether it is fair, using a chi-squared goodness of fit test with no parameters estimated.",
      ask: "How many degrees of freedom are there?",
      correct: "5",
      wrong: [
        ["6", "Subtract 1 because the totals must agree: 6 − 1.", "STA.HYPOTHESIS.CONCLUSION"],
        [
          "59",
          "Degrees of freedom count the classes, not the observations.",
          "STA.HYPOTHESIS.CONCLUSION",
        ],
      ],
      why: "6 classes, minus 1 for the total: $\\nu = 5$.",
    },
  ],
  [
    {
      statement:
        "Fin estimates the mean from the data before fitting a Poisson model with 6 classes, and uses 5 degrees of freedom.",
      truth: false,
      right: "False. Each estimated parameter removes another degree of freedom: 6 − 1 − 1 = 4.",
      wrong: [
        ["True. Only the total reduces the degrees of freedom.", "STA.HYPOTHESIS.CONCLUSION"],
        ["True. Estimating the mean adds a degree of freedom.", "STA.HYPOTHESIS.CONCLUSION"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-FS1-06.a" };

export default defineGenerator(mixFamilies("FM-FS1-06.a", { 1: own, 2: base, 4: own }));
