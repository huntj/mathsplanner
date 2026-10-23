/**
 * @statement FM-FP2-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FP2-01.b: Use modular arithmetic
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FP2-01.ts";

const own = concept(
  "FM-FP2-01.b",
  ["NPV.MODULAR"],
  [
    {
      question: "Work out $47 \\bmod 6$.",
      correct: "5",
      wrong: [
        ["7", "47 = 7 × 6 + 5: the remainder is 5.", "NPV.MODULAR"],
        ["1", "6 × 8 = 48 is too big; use 6 × 7 = 42.", "NPV.MODULAR"],
      ],
      why: "$47 = 7 \\times 6 + 5$, so $47 \\equiv 5 \\pmod 6$.",
    },
  ],
  [
    {
      statement:
        "Lia says that if $ac \\equiv bc \\pmod{m}$ then $a \\equiv b \\pmod{m}$, for any c.",
      truth: false,
      right:
        "False. You can only cancel c if it is coprime to m. For example 2 × 3 ≡ 4 × 3 (mod 6), but 2 ≢ 4 (mod 6).",
      wrong: [
        ["True. Divide both sides by c, as with equations.", "NPV.MODULAR"],
        ["True. Congruences behave exactly like equations.", "NPV.MODULAR"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-FP2-01.b" };

export default defineGenerator(mixFamilies("FM-FP2-01.b", { 1: own, 2: base, 4: own }));
