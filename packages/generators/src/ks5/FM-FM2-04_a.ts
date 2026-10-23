/**
 * @statement FM-FM2-04.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FM2-04.a: Use forces depending on time
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FM2-04.ts";

const own = concept(
  "FM-FM2-04.a",
  ["MECH.VARIABLE-FORCE"],
  [
    {
      question: "A particle's acceleration is $a = 6t$ m/s², and it starts from rest.",
      ask: "What is its velocity at time t?",
      correct: "$3t^2$",
      wrong: [
        ["$6$", "Integrate a with respect to t; do not differentiate.", "MECH.CALCULUS"],
        ["$6t^2$", "∫6t dt = 3t².", "MECH.CALCULUS"],
      ],
      why: "$v = \\int 6t\\,dt = 3t^2 + c$, and $v = 0$ at $t = 0$ gives $c = 0$.",
    },
  ],
  [
    {
      statement:
        "Wes says that when a force depends on time, you can use the constant acceleration formulae.",
      truth: false,
      right: "False. The acceleration changes with time, so integrate a = F/m with respect to t.",
      wrong: [
        ["True. suvat works for any force.", "MECH.VARIABLE-FORCE"],
        ["True. Use the average force in suvat.", "MECH.VARIABLE-FORCE"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-FM2-04.a" };

export default defineGenerator(mixFamilies("FM-FM2-04.a", { 1: base, 2: own, 4: own }));
