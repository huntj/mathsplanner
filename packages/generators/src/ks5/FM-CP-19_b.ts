/**
 * @statement FM-CP-19.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-19.b: Find volumes of revolution about the y-axis
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-CP-19.ts";

const own = concept(
  "FM-CP-19.b",
  ["CALC.VOLUME"],
  [
    {
      question: "For a volume of revolution about the y-axis, which integral is used?",
      correct: "$\\pi\\int x^2\\,dy$",
      wrong: [
        [
          "$\\pi\\int y^2\\,dx$",
          "That is about the x-axis. About the y-axis, x is the radius.",
          "CALC.VOLUME",
        ],
        ["$\\pi\\int x\\,dy$", "Square the radius, x.", "CALC.VOLUME"],
      ],
      why: "Discs about the y-axis have radius x and thickness dy.",
    },
  ],
  [
    {
      statement: "To rotate $y = x^2$ about the y-axis, Cal integrates $\\pi\\int y^2\\,dy$.",
      truth: false,
      right: "False. About the y-axis use π∫x² dy, and here x² = y, so π∫y dy.",
      wrong: [
        ["True. Always square y.", "CALC.VOLUME"],
        ["True. The formula is the same for either axis.", "CALC.VOLUME"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-CP-19.b" };

export default defineGenerator(mixFamilies("FM-CP-19.b", { 1: own, 2: base, 4: own }));
