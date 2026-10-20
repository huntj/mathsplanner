/**
 * @statement Y1-POS-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Phase 4 slice; awaiting teacher review
 */
// Y1-POS-01: Describe position, direction and movement, including whole, half, quarter and
// three-quarter turns
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
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
  /** Quarter turns: 1, 2 or 3 (a whole turn only appears in words). */
  quarters: 1 | 2 | 3;
  direction: Direction;
  fact: number;
}

const FACTS = [
  {
    statement:
      "A quarter turn clockwise ends facing the same way as a three-quarter turn anticlockwise.",
    truth: true,
    reasons: [
      {
        text: "Going the other way, three quarters round lands in the same place as one quarter.",
        correct: true,
      },
      { text: "They cannot end the same way because they turn different amounts." },
      { text: "A three-quarter turn is the same as a half turn.", code: "GEO.TURNS.FRACTION" },
    ],
  },
  {
    statement: "Two quarter turns make a whole turn.",
    truth: false,
    reasons: [
      {
        text: "Two quarter turns make a half turn; you need four for a whole turn.",
        correct: true,
      },
      { text: "Two quarters make a whole, so it is true.", code: "GEO.TURNS.FRACTION" },
      { text: "It depends which way you turn." },
    ],
  },
  {
    statement: "After a whole turn you face the same way as when you started.",
    truth: true,
    reasons: [
      { text: "A whole turn goes all the way round, back to the start.", correct: true },
      { text: "A whole turn leaves you facing the opposite way.", code: "GEO.TURNS.FRACTION" },
      { text: "Only if you turn clockwise." },
    ],
  },
];

export default defineGenerator<Params>({
  id: "Y1-POS-01",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["GEO.TURNS.FRACTION", "GEO.TURNS.DIRECTION"],

  params(rng, numbers) {
    return {
      start: numbers === "friendly" ? "up" : rng.pick(HEADINGS),
      quarters: numbers === "friendly" ? rng.pick([1, 2] as const) : rng.pick([1, 2, 3] as const),
      direction:
        numbers === "friendly" ? "clockwise" : rng.pick(["clockwise", "anticlockwise"] as const),
      fact: rng.int(0, FACTS.length - 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const name = turnName(p.quarters);
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [
            "The arrow turns from the dashed line to the solid line.",
            A.figure(turnDiagram(p.start, p.quarters, p.direction)),
          ],
          ask: "What turn is shown?",
          correct: `${name[0]?.toUpperCase()}${name.slice(1)}`,
          distractors: [1, 2, 3, 4]
            .filter((q) => q !== p.quarters)
            .map((q) => turnName(q))
            .map((t) => ({
              content: `${t[0]?.toUpperCase()}${t.slice(1)}`,
              code: "GEO.TURNS.FRACTION",
              feedback:
                "Count the quarter turns: a quarter turn is one right angle, a half turn is two, a three-quarter turn is three.",
            })),
          solution: [
            {
              say: `The arrow turns through ${p.quarters} quarter${p.quarters > 1 ? "s" : ""} of a whole turn, so it is ${name}.`,
            },
          ],
        });
      case 2: {
        const end = after(p.start, p.quarters, p.direction);
        const wrongWay = after(
          p.start,
          p.quarters,
          p.direction === "clockwise" ? "anticlockwise" : "clockwise",
        );
        const others = HEADINGS.filter((h) => h !== end);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `You are facing ${p.start}. You make ${name} ${p.direction}.`,
          ask: "Which way are you facing now?",
          correct: end,
          distractors: others.map((h) => ({
            content: h,
            ...(h === wrongWay && wrongWay !== end
              ? {
                  code: "GEO.TURNS.DIRECTION",
                  feedback: `Clockwise turns the same way as the hands of a clock.`,
                }
              : {}),
          })),
          solution: [
            {
              say: `Turning ${p.direction} from ${p.start}, ${p.quarters === 1 ? "one quarter turn" : `${p.quarters} quarter turns`} takes you to ${end}.`,
            },
          ],
        });
      }
      case 3: {
        const wrong = [
          {
            quarters: p.quarters === 2 ? 1 : 2,
            direction: p.direction,
            code: "GEO.TURNS.FRACTION",
          },
          {
            quarters: p.quarters,
            direction: (p.direction === "clockwise" ? "anticlockwise" : "clockwise") as Direction,
            code: "GEO.TURNS.DIRECTION",
          },
        ];
        // A half turn looks the same either way round, so swap direction only for other turns.
        if (p.quarters === 2)
          wrong[1] = { quarters: 3, direction: p.direction, code: "GEO.TURNS.FRACTION" };
        if (
          wrong[0]?.quarters === wrong[1]?.quarters &&
          wrong[0]?.direction === wrong[1]?.direction
        )
          reject("duplicate turns");
        return A.chooseTheDiagram({
          rng,
          question: `Which picture shows ${name} ${p.direction}?`,
          ask: "Choose the picture.",
          correct: turnDiagram(p.start, p.quarters, p.direction),
          distractors: wrong.map((w) => ({
            figure: turnDiagram(p.start, w.quarters, w.direction),
            code: w.code,
            feedback:
              w.code === "GEO.TURNS.DIRECTION"
                ? "This one turns the other way round."
                : `This one shows ${turnName(w.quarters)}.`,
          })),
          solution: [
            {
              say: `Look for the arrow that goes ${p.direction} through ${p.quarters} quarter${p.quarters > 1 ? "s" : ""} of a turn.`,
            },
          ],
        });
      }
      default: {
        const f = FACTS[p.fact] ?? FACTS[0];
        return A.trueOrFalseWhy({
          rng,
          statement: f?.statement ?? "",
          truth: f?.truth ?? true,
          reasons: f?.reasons ?? [],
          solution: [{ say: f?.reasons[0]?.text ?? "" }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "varied-form") {
      // Turning back the other way returns to the start.
      const answer = question.parts[0]?.answer;
      if (answer?.type !== "choice") return false;
      const chosen = JSON.stringify(
        answer.options.find((o) => o.id === answer.correct)?.content ?? [],
      );
      const end = HEADINGS.find((h) => chosen.includes(`"${h}"`));
      return (
        !!end &&
        after(end, p.quarters, p.direction === "clockwise" ? "anticlockwise" : "clockwise") ===
          p.start
      );
    }
    return p.quarters >= 1 && p.quarters <= 3;
  },
});
