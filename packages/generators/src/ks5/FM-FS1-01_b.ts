/**
 * @statement FM-FS1-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FS1-01.b: Find the expectation and variance of functions of a random variable
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FS1-01.ts";

const own = concept(
  "FM-FS1-01.b",
  ["PRO.EXPECTATION"],
  [
    {
      question: "$E(X) = 4$ and $\\operatorname{Var}(X) = 3$.",
      ask: "Find $E(5X - 2)$.",
      correct: "18",
      wrong: [
        ["20", "Subtract the 2 as well: 5 × 4 − 2.", "PRO.EXPECTATION"],
        ["73", "That uses the variance. E(aX + b) = aE(X) + b.", "PRO.EXPECTATION"],
      ],
      why: "$E(5X - 2) = 5E(X) - 2 = 18$.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-FS1-01.b" };

export default defineGenerator(mixFamilies("FM-FS1-01.b", { 1: base, 2: own, 4: base }));
