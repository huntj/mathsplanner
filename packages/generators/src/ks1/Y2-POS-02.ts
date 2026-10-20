/**
 * @statement Y2-POS-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Phase 4 slice
 * @reviewed 2026-10-20 @huntj (teacher): depth 4 checked in the gallery, all numbers settings
 */
// Y2-POS-02: Use mathematical vocabulary for position, direction and movement, including
// straight-line movement and rotation as a turn (quarter, half, three-quarter; clockwise and
// anticlockwise)
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import {
  after,
  HEADINGS,
  turnDiagram,
  turnName,
  type Direction,
  type Heading,
} from "../shared/turns.ts";

interface Params {
  start: Heading;
  /** 1 or 3 quarters: a half turn looks the same both ways, so direction questions avoid it. */
  quarters: 1 | 3;
  direction: Direction;
}

const other = (d: Direction): Direction => (d === "clockwise" ? "anticlockwise" : "clockwise");

export default defineGenerator<Params>({
  id: "Y2-POS-02",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["GEO.TURNS.DIRECTION", "GEO.TURNS.FRACTION"],

  params(rng, numbers) {
    return {
      start: numbers === "friendly" ? "up" : rng.pick(HEADINGS),
      quarters: numbers === "friendly" ? 1 : rng.pick([1, 3] as const),
      direction: rng.pick(["clockwise", "anticlockwise"] as const),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const name = turnName(p.quarters);
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [
            "The arrow shows a turn from the dashed line to the solid line.",
            A.figure(turnDiagram(p.start, p.quarters, p.direction)),
          ],
          ask: "Is the turn clockwise or anticlockwise?",
          correct: `${p.direction[0]?.toUpperCase()}${p.direction.slice(1)}`,
          distractors: [
            {
              content: `${other(p.direction)[0]?.toUpperCase()}${other(p.direction).slice(1)}`,
              code: "GEO.TURNS.DIRECTION",
              feedback:
                "Clockwise turns the same way as the hands of a clock; anticlockwise turns the other way.",
            },
          ],
          solution: [
            {
              say: `The arrow turns ${p.direction === "clockwise" ? "the same way as" : "the opposite way to"} the hands of a clock, so the turn is ${p.direction}.`,
            },
          ],
        });
      case 2: {
        const end = after(p.start, p.quarters, p.direction);
        const wrongWay = after(p.start, p.quarters, other(p.direction));
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `A robot faces ${p.start}. It makes ${name} ${p.direction}.`,
          ask: "Which way does it face now?",
          correct: end,
          distractors: HEADINGS.filter((h) => h !== end).map((h) => ({
            content: h,
            ...(h === wrongWay
              ? {
                  code: "GEO.TURNS.DIRECTION",
                  feedback: `That is where ${name} ${other(p.direction)} would end. ${p.direction === "clockwise" ? "Clockwise" : "Anticlockwise"} turns ${p.direction === "clockwise" ? "the same way as" : "against"} the clock's hands.`,
                }
              : {}),
          })),
          solution: [{ say: `From ${p.start}, ${name} ${p.direction} ends facing ${end}.` }],
        });
      }
      case 3:
        return A.matchRepresentations({
          rng,
          question: "Match each turn to its picture. Each turn starts at the dashed line.",
          pairs: [
            [`A quarter turn ${p.direction}`, A.figure(turnDiagram(p.start, 1, p.direction))],
            [
              `A quarter turn ${other(p.direction)}`,
              A.figure(turnDiagram(p.start, 1, other(p.direction))),
            ],
            ["A half turn", A.figure(turnDiagram(p.start, 2, p.direction))],
          ],
          solution: [
            {
              say: "A half turn ends facing the opposite way. For the quarter turns, check which way round the arrow goes.",
            },
          ],
        });
      default: {
        const claimed = other(p.direction);
        return A.explainTheError({
          rng,
          claim: [
            "Ben looks at this turn.",
            A.figure(turnDiagram(p.start, p.quarters, p.direction)),
            `He says it is ${name} ${claimed}.`,
          ],
          correct: `The arrow goes ${p.direction === "clockwise" ? "the same way as" : "the opposite way to"} a clock's hands, so it is ${p.direction}, not ${claimed}.`,
          distractors: [
            {
              content: `It is ${p.quarters === 1 ? "a half turn" : "a quarter turn"}, not ${name}.`,
              code: "GEO.TURNS.FRACTION",
              feedback: "Count the quarter turns.",
            },
            { content: "Turns do not have a direction; only the amount matters." },
            {
              content: "He is right: clockwise means turning to the left.",
              code: "GEO.TURNS.DIRECTION",
              feedback: "Clockwise means turning the same way as a clock's hands.",
            },
          ],
          solution: [{ say: `It is ${name} ${p.direction}.` }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype !== "varied-form") return true;
    // Undo the turn and you are back where you started.
    const answer = question.parts[0]?.answer;
    if (answer?.type !== "choice") return false;
    const chosen = JSON.stringify(
      answer.options.find((o) => o.id === answer.correct)?.content ?? [],
    );
    const end = HEADINGS.find((h) => chosen.includes(`"${h}"`));
    return !!end && after(end, p.quarters, other(p.direction)) === p.start;
  },
});
