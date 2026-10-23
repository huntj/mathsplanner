/**
 * @statement FM-FM2-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FM2-01.b: Model vertical circular motion
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";

const own = concept(
  "FM-FM2-01.b",
  ["MECH.CIRCULAR"],
  [
    {
      question: "A particle on a light rod moves in a vertical circle.",
      ask: "What is the condition for it to complete the circle?",
      correct: "Its speed at the top is greater than 0",
      wrong: [
        [
          "The tension at the top is greater than 0",
          "A rod can push as well as pull, so only the speed matters.",
          "MECH.CIRCULAR",
        ],
        [
          "Its speed at the bottom is greater than 0",
          "It must still be moving when it reaches the top.",
          "MECH.CIRCULAR",
        ],
      ],
      why: "A rod can provide a thrust, so the particle completes the circle if it still has speed at the top.",
    },
    {
      question: "A particle on a string moves in a vertical circle of radius r.",
      ask: "What is the least speed at the top for the string to stay taut?",
      correct: "$\\sqrt{gr}$",
      wrong: [
        ["$0$", "A string cannot push: at the top, mg must not exceed mv²/r.", "MECH.CIRCULAR"],
        ["$\\sqrt{2gr}$", "At the top, T + mg = mv²/r with T ≥ 0 gives v² ≥ gr.", "MECH.CIRCULAR"],
      ],
      why: "At the top $T + mg = \\frac{mv^2}{r}$, and $T \\ge 0$ needs $v^2 \\ge gr$.",
    },
  ],
  [
    {
      statement:
        "Sal says a particle moving in a vertical circle has the same speed all the way round.",
      truth: false,
      right:
        "False. Gravity does work as the height changes, so by energy conservation the particle is slowest at the top.",
      wrong: [
        ["True. Circular motion always has constant speed.", "MECH.CIRCULAR"],
        ["True. The tension keeps the speed constant.", "MECH.CIRCULAR"],
      ],
    },
  ],
);

export default defineGenerator(own);
