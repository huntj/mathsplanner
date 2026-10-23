/**
 * @statement FM-FS2-02.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FS2-02.b: Calculate Spearman's rank correlation coefficient
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FS2-02.ts";

const own = concept(
  "FM-FS2-02.b",
  ["STA.PMCC.INTERPRET"],
  [
    {
      question: "Spearman's coefficient uses $r_s = 1 - \\frac{6\\sum d^2}{n(n^2 - 1)}$.",
      ask: "What is d?",
      correct: "The difference between the two ranks of each item",
      wrong: [
        [
          "The difference between the two data values",
          "Spearman's coefficient works with ranks, not raw values.",
          "STA.PMCC.INTERPRET",
        ],
        [
          "The distance from the mean rank",
          "d compares each item's two ranks.",
          "STA.PMCC.INTERPRET",
        ],
      ],
      why: "Rank each variable, then d is the difference in rank for each item.",
    },
  ],
  [
    {
      statement: "Ian says Spearman's coefficient of 1 means the points lie on a straight line.",
      truth: false,
      right:
        "False. It means the ranks agree perfectly: the relationship is monotonic, not necessarily linear.",
      wrong: [
        ["True. It is the same as a PMCC of 1.", "STA.PMCC.INTERPRET"],
        ["True. Ranking turns any relationship into a line.", "STA.PMCC.INTERPRET"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-FS2-02.b" };

export default defineGenerator(mixFamilies("FM-FS2-02.b", { 1: base, 2: own, 4: own }));
