/**
 * @statement FM-D1-06.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-D1-06.a: Formulate linear programming problems
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-D1-06.ts";

const own = concept(
  "FM-D1-06.a",
  ["DEC.LP"],
  [
    {
      question:
        "A firm makes x tins of paint and y tins of varnish. It must make at least twice as many tins of paint as varnish.",
      ask: "Which constraint models this?",
      correct: "$x \\ge 2y$",
      wrong: [
        ["$2x \\ge y$", "Paint is at least twice varnish: x ≥ 2y.", "DEC.LP"],
        ["$x \\le 2y$", "'At least' means ≥.", "DEC.LP"],
      ],
      why: "The number of paint tins, x, must be at least 2 times y.",
    },
  ],
  [
    {
      statement: "Gus says the decision variables in a linear programming problem can be negative.",
      truth: false,
      right: "False. Quantities made or used cannot be negative, so include x ≥ 0 and y ≥ 0.",
      wrong: [
        ["True. Any real values are allowed.", "DEC.LP"],
        ["True. Negative values reduce the cost.", "DEC.LP"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-D1-06.a" };

export default defineGenerator(mixFamilies("FM-D1-06.a", { 1: base, 2: own, 4: own }));
