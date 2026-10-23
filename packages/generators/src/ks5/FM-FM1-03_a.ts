/**
 * @statement FM-FM1-03.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FM1-03.a: Use Hooke's law
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FM1-03.ts";

const own = concept(
  "FM-FM1-03.a",
  ["MECH.ELASTIC"],
  [
    {
      question:
        "An elastic string has natural length 0.8 m and modulus of elasticity 20 N. It is stretched to 1.2 m.",
      ask: "What is the tension?",
      correct: "10 N",
      wrong: [
        ["8 N", "The extension is 0.4 m: T = 20 × 0.4 ÷ 0.8.", "MECH.ELASTIC"],
        ["30 N", "Use the extension, 0.4 m, not the stretched length.", "MECH.ELASTIC"],
      ],
      why: "$T = \\frac{\\lambda x}{l} = \\frac{20 \\times 0.4}{0.8} = 10$ N.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-FM1-03.a" };

export default defineGenerator(mixFamilies("FM-FM1-03.a", { 1: base, 2: own, 4: base }));
