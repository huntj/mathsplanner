/**
 * @statement FM-D1-05.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-D1-05.c: Draw Gantt charts and level resources
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";

const own = concept(
  "FM-D1-05.c",
  ["DEC.CRITICAL-PATH"],
  [
    {
      question: "On a Gantt chart, how are critical activities shown?",
      correct: "At their earliest start times, with no float",
      wrong: [
        [
          "At their latest start times, with float shown after",
          "Critical activities have no float to show.",
          "DEC.CRITICAL-PATH",
        ],
        [
          "Only at the end of the project",
          "Critical activities appear throughout the project.",
          "DEC.CRITICAL-PATH",
        ],
      ],
      why: "Critical activities have zero float, so their bars cannot move.",
    },
    {
      question: "A resource histogram shows 5 workers needed on day 4, but only 3 are available.",
      ask: "What should you try first?",
      correct: "Delay non-critical activities using their float",
      wrong: [
        [
          "Delay a critical activity",
          "That would lengthen the whole project.",
          "DEC.CRITICAL-PATH",
        ],
        [
          "Shorten every activity",
          "Resource levelling moves activities within their floats.",
          "DEC.CRITICAL-PATH",
        ],
      ],
      why: "Moving non-critical activities within their float can reduce the peak without delaying the project.",
    },
  ],
  [
    {
      statement:
        "Fin says a project can always be finished in its critical path time, however few workers there are.",
      truth: false,
      right:
        "False. With too few workers, activities may have to be delayed beyond their floats, lengthening the project.",
      wrong: [
        ["True. The critical path fixes the finish time.", "DEC.CRITICAL-PATH"],
        ["True. Workers do not affect the schedule.", "DEC.CRITICAL-PATH"],
      ],
    },
  ],
);

export default defineGenerator(own);
