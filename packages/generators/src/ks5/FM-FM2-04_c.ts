/**
 * @statement FM-FM2-04.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FM2-04.c: Use forces depending on velocity
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";

const own = concept(
  "FM-FM2-04.c",
  ["MECH.VARIABLE-FORCE"],
  [
    {
      question: "A particle of mass 2 kg moves against a resistance of $4v$ N and no other forces.",
      ask: "Which equation of motion is right?",
      correct: "$2\\frac{dv}{dt} = -4v$",
      wrong: [
        [
          "$2\\frac{dv}{dt} = 4v$",
          "The resistance opposes the motion, so it is negative.",
          "MECH.VARIABLE-FORCE",
        ],
        ["$\\frac{dv}{dt} = -4v$", "Use F = ma with m = 2.", "MECH.F-MA"],
      ],
      why: "$m\\frac{dv}{dt} = -4v$ with $m = 2$; this gives exponential decay of v.",
    },
    {
      question: "A particle moves with $\\frac{dv}{dt} = -2v$, starting at speed 10 m/s.",
      ask: "What is its velocity at time t?",
      correct: "$10e^{-2t}$",
      wrong: [
        [
          "$10 - 2t$",
          "The deceleration is not constant; separate the variables.",
          "MECH.VARIABLE-FORCE",
        ],
        ["$10e^{2t}$", "The speed decreases, so the exponent is negative.", "MECH.VARIABLE-FORCE"],
      ],
      why: "$\\int \\frac{dv}{v} = -2\\int dt$ gives $v = 10e^{-2t}$.",
    },
  ],
  [
    {
      statement:
        "Xia says a particle slowing down under a resistance proportional to its speed stops after a finite time.",
      truth: false,
      right: "False. v = v₀e^(−kt) gets smaller and smaller but never reaches 0.",
      wrong: [
        ["True. Every resistance stops a particle eventually.", "MECH.VARIABLE-FORCE"],
        ["True. It stops when t = v₀/k.", "MECH.VARIABLE-FORCE"],
      ],
    },
  ],
);

export default defineGenerator(own);
