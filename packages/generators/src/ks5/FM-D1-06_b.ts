/**
 * @statement FM-D1-06.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-D1-06.b: Solve linear programs graphically
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-D1-06.ts";

const own = concept(
  "FM-D1-06.b",
  ["DEC.LP", "DEC.INTEGER"],
  [
    {
      question: "Using the objective line method, where is the maximum of P found?",
      correct: "At the last vertex the objective line touches as it moves away from the origin",
      wrong: [
        [
          "At the first vertex the line touches",
          "For a maximum, slide the line as far as possible.",
          "DEC.LP",
        ],
        [
          "At the centre of the feasible region",
          "Linear objectives are optimised at vertices.",
          "DEC.LP",
        ],
      ],
      why: "Sliding the objective line outwards, the last feasible point it meets gives the maximum.",
    },
  ],
  [
    {
      statement:
        "The optimum is at $(3.6, 2.4)$ but x and y must be whole numbers. Hal rounds to $(4, 2)$ and says that is optimal.",
      truth: false,
      right:
        "False. (4, 2) may not even be feasible. Check the whole-number points near the vertex.",
      wrong: [
        ["True. Rounding the optimum always gives the best integer point.", "DEC.INTEGER"],
        ["True. Round each value to the nearest whole number.", "DEC.INTEGER"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-D1-06.b" };

export default defineGenerator(mixFamilies("FM-D1-06.b", { 1: own, 2: base, 4: own }));
