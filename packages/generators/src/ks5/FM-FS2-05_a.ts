/**
 * @statement FM-FS2-05.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FS2-05.a: Use unbiased estimators
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FS2-05.ts";

const own = concept(
  "FM-FS2-05.a",
  ["STA.VARIANCE.FORMULA"],
  [
    {
      question:
        "Why is $s^2 = \\frac{1}{n - 1}\\sum(x - \\bar{x})^2$ used to estimate the population variance?",
      correct: "Dividing by n tends to underestimate the variance, so n − 1 corrects the bias",
      wrong: [
        [
          "Dividing by n − 1 makes the estimate smaller",
          "It makes it slightly larger, to correct an underestimate.",
          "STA.VARIANCE.FORMULA",
        ],
        [
          "It is easier to calculate than dividing by n",
          "The reason is bias, not ease.",
          "STA.VARIANCE.FORMULA",
        ],
      ],
      why: "Deviations are measured from x̄, not μ, so dividing by n is biased low; n − 1 makes it unbiased.",
    },
  ],
  [
    {
      statement:
        "Mia says the sample mean $\\bar{X}$ is an unbiased estimator of the population mean μ.",
      truth: true,
      right: "True. E(X̄) = μ.",
      wrong: [
        ["False. You must divide by n − 1 for the mean too.", "STA.VARIANCE.FORMULA"],
        ["False. The sample mean is always too big.", "STA.VARIANCE.FORMULA"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-FS2-05.a" };

export default defineGenerator(mixFamilies("FM-FS2-05.a", { 1: base, 2: own, 4: own }));
