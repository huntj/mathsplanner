/**
 * @statement FM-D1-05.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-D1-05.a: Draw activity networks
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";

const own = concept(
  "FM-D1-05.a",
  ["DEC.CRITICAL-PATH"],
  [
    {
      question: "In an activity-on-arc network, what is a dummy activity for?",
      correct:
        "To show a dependency correctly, or keep each activity defined by its own pair of events",
      wrong: [
        [
          "To represent a real task that takes no work",
          "A dummy is not a task; it only shows dependencies.",
          "DEC.CRITICAL-PATH",
        ],
        [
          "To make the network look tidier",
          "Dummies are needed for logic, not appearance.",
          "DEC.CRITICAL-PATH",
        ],
      ],
      why: "Dummies have zero duration and are used only to show dependencies correctly.",
    },
    {
      question: "Activity D depends on A and B, and activity C depends on A only.",
      ask: "Which is needed in an activity network?",
      correct: "A dummy from the end of A to the start of D",
      wrong: [
        [
          "No dummy: D and C can start at the same event",
          "Then C would wrongly have to wait for B.",
          "DEC.CRITICAL-PATH",
        ],
        [
          "A dummy from the end of B to the start of C",
          "C does not depend on B.",
          "DEC.CRITICAL-PATH",
        ],
      ],
      why: "C must start after A alone, while D waits for A and B, so a dummy links A's end to D's start.",
    },
  ],
  [
    {
      statement: "Eve says a dummy activity adds time to the project.",
      truth: false,
      right:
        "False. A dummy has zero duration; it only records that one activity depends on another.",
      wrong: [
        ["True. Every arc takes some time.", "DEC.CRITICAL-PATH"],
        ["True. Dummies are always on the critical path.", "DEC.CRITICAL-PATH"],
      ],
    },
  ],
);

export default defineGenerator(own);
