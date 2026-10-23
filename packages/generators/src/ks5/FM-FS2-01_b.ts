/**
 * @statement FM-FS2-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FS2-01.b: Analyse residuals
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FS2-01.ts";

const own = concept(
  "FM-FS2-01.b",
  ["STA.REGRESSION.VARIABLES"],
  [
    {
      question: "Which is a residual?",
      correct: "The observed value of y minus the value predicted by the line",
      wrong: [
        [
          "The predicted value minus the observed value",
          "A residual is observed − predicted.",
          "STA.REGRESSION.VARIABLES",
        ],
        [
          "The horizontal distance from the point to the line",
          "Residuals are measured vertically, in the y direction.",
          "STA.REGRESSION.VARIABLES",
        ],
      ],
      why: "Residual = observed y − fitted y.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-FS2-01.b" };

export default defineGenerator(mixFamilies("FM-FS2-01.b", { 1: own, 2: base, 4: base }));
