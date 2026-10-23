/**
 * @statement FM-FM2-02.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FM2-02.b: Find centres of mass by integration
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FM2-02.ts";

const own = concept(
  "FM-FM2-02.b",
  ["MECH.CENTRE-MASS"],
  [
    {
      question:
        "For a uniform lamina under $y = f(x)$ from $x = a$ to $x = b$, which gives $\\bar{x}$?",
      correct: "$\\frac{\\int_a^b xy\\,dx}{\\int_a^b y\\,dx}$",
      wrong: [
        ["$\\int_a^b xy\\,dx$", "Divide by the area, ∫y dx.", "MECH.CENTRE-MASS"],
        [
          "$\\frac{\\int_a^b x\\,dx}{\\int_a^b y\\,dx}$",
          "Each strip at x has area y δx, so the moment is xy δx.",
          "MECH.CENTRE-MASS",
        ],
      ],
      why: "Moment of the strips $\\int xy\\,dx$ divided by the area $\\int y\\,dx$.",
    },
  ],
  [
    {
      statement:
        "Tom says the centre of mass of the lamina under $y = x^2$ from 0 to 2 is at $x = 1$, the middle of the interval.",
      truth: false,
      right: "False. More area is near x = 2, so x̄ = ∫x³dx ÷ ∫x²dx = 4 ÷ (8/3) = 1.5.",
      wrong: [
        ["True. It is always at the middle of the interval.", "MECH.CENTRE-MASS"],
        ["True. A uniform lamina balances at its midpoint.", "MECH.CENTRE-MASS"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-FM2-02.b" };

export default defineGenerator(mixFamilies("FM-FM2-02.b", { 1: own, 2: base, 4: own }));
