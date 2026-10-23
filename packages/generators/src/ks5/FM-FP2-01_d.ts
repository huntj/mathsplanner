/**
 * @statement FM-FP2-01.d
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FP2-01.d: Use divisibility tests
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FP2-01.ts";

const own = concept(
  "FM-FP2-01.d",
  ["NPV.MODULAR"],
  [
    {
      question: "A number is divisible by 9 exactly when its digit sum is.",
      ask: "Is 4572 divisible by 9?",
      correct: "Yes, the digit sum is 18",
      wrong: [
        [
          "No, the last digit is not 9 or 0",
          "The test for 9 uses the digit sum, not the last digit.",
          "NPV.MODULAR",
        ],
        ["No, the digit sum is 17", "4 + 5 + 7 + 2 = 18.", "NPV.MODULAR"],
      ],
      why: "$4 + 5 + 7 + 2 = 18$, a multiple of 9, because $10 \\equiv 1 \\pmod 9$.",
    },
    {
      question: "Which test shows a number is divisible by 4?",
      correct: "The number formed by its last two digits is divisible by 4",
      wrong: [
        [
          "Its last digit is divisible by 4",
          "100 is a multiple of 4, so the last two digits decide, not the last digit.",
          "NPV.MODULAR",
        ],
        ["Its digit sum is divisible by 4", "Digit sums test for 3 and 9.", "NPV.MODULAR"],
      ],
      why: "$100 \\equiv 0 \\pmod 4$, so only the last two digits matter.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-FP2-01.d" };

export default defineGenerator(mixFamilies("FM-FP2-01.d", { 1: own, 2: own, 4: base }));
