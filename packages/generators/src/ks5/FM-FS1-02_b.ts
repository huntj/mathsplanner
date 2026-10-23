/**
 * @statement FM-FS1-02.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FS1-02.b: Use the additive property of Poisson distributions
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FS1-02.ts";

const own = concept(
  "FM-FS1-02.b",
  ["PRO.POISSON"],
  [
    {
      question: "A shop gets $\\text{Po}(4)$ customers per hour, independently each hour.",
      ask: "What is the distribution of the number of customers in 3 hours?",
      correct: "$\\text{Po}(12)$",
      wrong: [
        ["$\\text{Po}(4)$", "Over 3 hours the mean triples.", "PRO.POISSON"],
        ["$\\text{Po}(64)$", "Add the means, do not multiply them: 4 + 4 + 4.", "PRO.POISSON"],
      ],
      why: "Independent Poisson counts add: $4 + 4 + 4 = 12$.",
    },
  ],
  [
    {
      statement:
        "Cy says that if $X \\sim \\text{Po}(2)$ and $Y \\sim \\text{Po}(5)$ are independent, then $X + Y \\sim \\text{Po}(10)$.",
      truth: false,
      right: "False. The means add: X + Y ~ Po(7).",
      wrong: [
        ["True. Multiply the means.", "PRO.POISSON"],
        ["True. Combining Poisson variables multiplies their rates.", "PRO.POISSON"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-FS1-02.b" };

export default defineGenerator(mixFamilies("FM-FS1-02.b", { 1: own, 2: base, 4: own }));
