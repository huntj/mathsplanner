/**
 * @statement FM-FP2-01.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FP2-01.c: Use Fermat's little theorem
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FP2-01.ts";

const own = concept(
  "FM-FP2-01.c",
  ["NPV.MODULAR"],
  [
    {
      question:
        "Fermat's little theorem says $a^{p-1} \\equiv 1 \\pmod{p}$ for prime p not dividing a.",
      ask: "What is $3^{12} \\bmod 13$?",
      correct: "1",
      wrong: [
        ["3", "12 = 13 − 1, so 3¹² ≡ 1 (mod 13).", "NPV.MODULAR"],
        ["0", "13 does not divide 3¹², since 13 is prime and does not divide 3.", "NPV.MODULAR"],
      ],
      why: "With $p = 13$ and $a = 3$: $3^{12} \\equiv 1 \\pmod{13}$.",
    },
  ],
  [
    {
      statement: "Max says Fermat's little theorem shows $4^{8} \\equiv 1 \\pmod 9$.",
      truth: false,
      right: "False. 9 is not prime, so the theorem does not apply. In fact 4⁸ ≡ 7 (mod 9).",
      wrong: [
        ["True. a^(m−1) ≡ 1 for every modulus m.", "NPV.MODULAR"],
        ["True. 4 and 9 share no factor, so it works.", "NPV.MODULAR"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-FP2-01.c" };

export default defineGenerator(mixFamilies("FM-FP2-01.c", { 1: base, 2: own, 4: own }));
