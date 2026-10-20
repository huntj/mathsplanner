/**
 * @statement Y5-GEO-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this placeholder to exercise the gallery in Phase 2
 */
// Example only: a placeholder that shows the shape of a generator and exercises the renderer
// and gallery. It lives in examples/, so the coverage report does not count it, and it will be
// replaced by a reviewed generator in the Phase 4 angles and geometry slice.
//
// Y5-GEO-04: Identify angles at a point and one whole turn (360°), angles at a point on a
// straight line and ½ a turn (180°), and other multiples of 90°
import { defineGenerator, type QuestionDraft, type Rich } from "@mathsplanner/core";
import { anglesOnLine } from "@mathsplanner/diagrams";

const STRAIGHT_LINE_360 = "GEO.ANGLES.STRAIGHT-LINE-360";

interface Params {
  /** Known angles on the straight line, in degrees. */
  known: number[];
}

const degrees = (n: number) => `${n}^\\circ`;
const text = (v: string): Rich[number] => ({ t: "text", v });
const math = (v: string): Rich[number] => ({ t: "math", v });

function answerOf({ known }: Params): number {
  return 180 - known.reduce((sum, a) => sum + a, 0);
}

function knownList(known: number[]): Rich {
  return known.flatMap((a, i) => [
    ...(i === 0 ? [] : [text(i === known.length - 1 ? " and " : ", ")]),
    math(degrees(a)),
  ]);
}

export default defineGenerator<Params>({
  id: "Y5-GEO-04",
  version: "0.1.0",
  depths: [1, 2, 4],
  misconceptions: [STRAIGHT_LINE_360],

  // Parameters depend only on rng and the numbers setting.
  params(rng, numbers) {
    switch (numbers) {
      case "friendly":
        return { known: [rng.int(2, 16) * 10] };
      case "standard":
        return { known: [rng.int(11, 169)] };
      case "stretch": {
        const first = rng.int(15, 120);
        return { known: [first, rng.int(15, 165 - first)] };
      }
    }
  },

  // Keep the missing angle away from 0° and from a right angle, which would be too easy.
  accept: (p) => answerOf(p) >= 10 && answerOf(p) !== 90,

  build(params, depth, rng): QuestionDraft {
    const answer = answerOf(params);
    const wrong360 = 360 - params.known.reduce((sum, a) => sum + a, 0);
    // Drawn to scale: the known angles, then the unknown x.
    const diagram = anglesOnLine([
      ...params.known.map((value) => ({ value })),
      { value: answer, label: "x" },
    ]);
    const misconception = {
      code: STRAIGHT_LINE_360,
      answer: { type: "number" as const, value: wrong360 },
      feedback: [text("Angles on a straight line add up to 180°, not 360°.")],
    };

    switch (depth) {
      case 1:
        return {
          archetype: "standard",
          stem: [text("The diagram shows angles on a straight line."), { t: "diagram", i: 0 }],
          diagrams: [diagram],
          parts: [
            {
              prompt: [text("Work out the size of angle "), math("x"), text(".")],
              answer: { type: "number", value: answer, accuracy: { exact: true }, units: "°" },
              misconceptions: [misconception],
            },
          ],
        };
      case 2:
        return {
          archetype: "varied-form",
          stem: [
            text(`${params.known.length + 1} angles make a straight line. `),
            text(params.known.length === 1 ? "One of them is " : "Two of them are "),
            ...knownList(params.known),
            text("."),
          ],
          parts: [
            {
              prompt: [text("What is the size of the other angle?")],
              answer: { type: "number", value: answer, accuracy: { exact: true }, units: "°" },
              misconceptions: [misconception],
            },
          ],
        };
      default: {
        const options = rng.shuffle([
          {
            id: "right",
            content: [text("He used 360°, but angles on a straight line add up to 180°.")],
          },
          {
            id: "reflex",
            content: [text("He should have added the angles, not subtracted them.")],
          },
          {
            id: "right-angle",
            content: [
              text("He should have used 90°, because a straight line makes a right angle."),
            ],
          },
          { id: "measure", content: [text("He read the protractor from the wrong scale.")] },
        ]);
        return {
          archetype: "explain-the-error",
          stem: [
            text("The diagram shows angles on a straight line."),
            { t: "diagram", i: 0 },
            text("Sam says angle "),
            math("x"),
            text(" is "),
            math(degrees(wrong360)),
            text("."),
          ],
          diagrams: [diagram],
          parts: [
            {
              prompt: [text("Which explanation of Sam's mistake is correct?")],
              answer: { type: "choice", options, correct: "right" },
            },
          ],
        };
      }
    }
  },

  solution: (params) => [
    { say: [text("Angles on a straight line add up to 180°.")] },
    {
      say: [text("Subtract the known angles from 180°.")],
      math: `x = 180^\\circ - ${params.known.map(degrees).join(" - ")} = ${degrees(answerOf(params))}`,
    },
  ],

  verify: (params, question) => {
    // Independent check: the angles, including the answer, add up to a half turn.
    const answer = question.parts[0]?.answer;
    if (answer?.type !== "number") return true;
    return [...params.known, answer.value].reduce((sum, a) => sum + a, 0) === 180;
  },
});
