/**
 * @statement FM-CP-21.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-21.b: Integrate to give inverse trig functions
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-CP-21.ts";

const own = concept(
  "FM-CP-21.b",
  ["CALC.INVERSE-TRIG"],
  [
    {
      question: "Find $\\int \\frac{1}{9 + x^2}\\,dx$.",
      correct: "$\\frac{1}{3}\\arctan\\frac{x}{3} + c$",
      wrong: [
        [
          "$\\arctan\\frac{x}{3} + c$",
          "∫1/(a² + x²) dx = (1/a) arctan(x/a) + c: keep the 1/3.",
          "CALC.INVERSE-TRIG",
        ],
        [
          "$\\frac{1}{3}\\arcsin\\frac{x}{3} + c$",
          "a² + x² gives arctan; √(a² − x²) gives arcsin.",
          "CALC.INVERSE-TRIG",
        ],
      ],
      why: "With $a = 3$: $\\int \\frac{1}{a^2 + x^2}\\,dx = \\frac{1}{a}\\arctan\\frac{x}{a} + c$.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-CP-21.b" };

export default defineGenerator(mixFamilies("FM-CP-21.b", { 1: base, 2: own, 4: base }));
