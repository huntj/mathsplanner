/**
 * @statement FM-FS2-02.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FS2-02.c: Test for association
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FS2-02.ts";

const own = concept(
  "FM-FS2-02.c",
  ["STA.HYPOTHESIS.LANGUAGE"],
  [
    {
      question: "Which hypotheses test for positive correlation in the population?",
      correct: "H₀: ρ = 0, H₁: ρ > 0",
      wrong: [
        [
          "H₀: r = 0, H₁: r > 0",
          "Hypotheses are about the population coefficient ρ, not the sample value r.",
          "STA.HYPOTHESIS.LANGUAGE",
        ],
        [
          "H₀: ρ > 0, H₁: ρ = 0",
          "The null hypothesis is no correlation.",
          "STA.HYPOTHESIS.LANGUAGE",
        ],
      ],
      why: "The null hypothesis is no correlation in the population, $\\rho = 0$.",
    },
  ],
  [
    {
      statement:
        "Jo finds significant evidence of positive correlation between ice cream sales and sunburn, and says ice cream causes sunburn.",
      truth: false,
      right: "False. Correlation does not show cause: both are likely linked to sunny weather.",
      wrong: [
        ["True. Significant correlation proves cause.", "STA.SCATTER.CAUSATION"],
        ["True. The stronger variable causes the other.", "STA.SCATTER.CAUSATION"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-FS2-02.c" };

export default defineGenerator(mixFamilies("FM-FS2-02.c", { 1: own, 2: base, 4: own }));
