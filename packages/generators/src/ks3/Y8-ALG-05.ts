/**
 * @statement Y8-ALG-05
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y8-ALG-05: Work with coordinates in all four quadrants
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { grid } from "../shared/alg.ts";

interface Params {
  x: number;
  y: number;
  /** Depth 2: four labelled points, the first at (x, y), the second at (y, x). */
  others: [number, number][];
}

const coord = (x: number, y: number) => `(${x}, ${y})`;
const QUADRANT = (x: number, y: number) =>
  x > 0 ? (y > 0 ? "first" : "fourth") : y > 0 ? "second" : "third";

export default defineGenerator<Params>({
  id: "Y8-ALG-05",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.COORD.ORDER"],

  params(rng, numbers) {
    const r = numbers === "friendly" ? 5 : 6;
    const x = rng.int(1, r) * rng.pick([1, -1]);
    const y = rng.int(1, r) * rng.pick([1, -1]);
    const others: [number, number][] = [
      [rng.int(-r, r), rng.int(-r, r)],
      [rng.int(-r, r), rng.int(-r, r)],
    ];
    const all = [[x, y], [y, x], ...others].map(([a, b]) => `${a},${b}`);
    if (Math.abs(x) === Math.abs(y) || new Set(all).size < 4) reject("four different points");
    return { x, y, others };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [
            "What are the coordinates of point P?",
            A.figure(
              grid(
                6,
                [],
                [{ at: [p.x, p.y], label: "P" }],
                "A coordinate grid with one point, P, marked.",
              ),
            ),
          ],
          correct: A.math(coord(p.x, p.y)),
          distractors: [
            {
              content: A.math(coord(p.y, p.x)),
              code: "ALG.COORD.ORDER",
              feedback:
                "The x-coordinate (across) comes first, then the y-coordinate (up or down).",
            },
            {
              content: A.math(coord(-p.x, p.y)),
              feedback: `P is to the ${p.x > 0 ? "right" : "left"} of the y-axis, so x is ${p.x > 0 ? "positive" : "negative"}.`,
            },
            {
              content: A.math(coord(p.x, -p.y)),
              feedback: `P is ${p.y > 0 ? "above" : "below"} the x-axis, so y is ${p.y > 0 ? "positive" : "negative"}.`,
            },
          ],
          solution: [
            {
              say: `Across ${p.x} (along the x-axis), then ${p.y > 0 ? "up" : "down"} ${Math.abs(p.y)}: P is at (${p.x}, ${p.y}).`,
            },
          ],
        });
      case 2: {
        const pts: [number, number][] = [[p.x, p.y], [p.y, p.x], ...p.others];
        const letters = ["A", "B", "C", "D"];
        const order = rng.shuffle([0, 1, 2, 3]);
        const labelOf = (i: number) => letters[order.indexOf(i)] ?? "A";
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "Which point is at ",
            A.math(coord(p.x, p.y)),
            "?",
            A.figure(
              grid(
                6,
                [],
                pts.map((at, i) => ({ at, label: labelOf(i) })),
                "A coordinate grid with points A, B, C and D marked.",
              ),
            ),
          ],
          correct: labelOf(0),
          distractors: [
            {
              content: labelOf(1),
              code: "ALG.COORD.ORDER",
              feedback: `That point is at (${p.y}, ${p.x}). Go across first, then up or down.`,
            },
            { content: labelOf(2), feedback: `That point is at (${p.others[0]?.join(", ")}).` },
            { content: labelOf(3), feedback: `That point is at (${p.others[1]?.join(", ")}).` },
          ],
          solution: [
            {
              say: `Go ${Math.abs(p.x)} ${p.x > 0 ? "right" : "left"} and ${Math.abs(p.y)} ${p.y > 0 ? "up" : "down"}: that is point ${labelOf(0)}.`,
            },
          ],
        });
      }
      default: {
        // Swapping x and y only changes the quadrant when their signs differ.
        const swapped = QUADRANT(p.y, p.x);
        const right = QUADRANT(p.x, p.y);
        const where = `x = ${p.x} is ${p.x > 0 ? "right" : "left"} of the y-axis and y = ${p.y} is ${p.y > 0 ? "above" : "below"} the x-axis, so it is in the ${right} quadrant.`;
        const truth = swapped === right;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Eve says the point ",
            A.math(coord(p.x, p.y)),
            ` is in the ${swapped} quadrant.`,
          ],
          truth,
          reasons: truth
            ? [
                { text: `True. ${where}`, correct: true },
                {
                  text: "False. A point with a negative coordinate is always in the third quadrant.",
                  code: "ALG.COORD.ORDER",
                },
                { text: "False. Points on a grid are not in quadrants." },
              ]
            : [
                { text: `False. ${where}`, correct: true },
                {
                  text: "True. Read the second number first, as how far across.",
                  code: "ALG.COORD.ORDER",
                },
                { text: "True. Every point with a negative coordinate is in that quadrant." },
              ],
          solution: [
            {
              say: `The quadrants go anticlockwise from the top right: first (+, +), second (−, +), third (−, −), fourth (+, −).`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return chosenText(question) === coord(p.x, p.y);
    return true;
  },
});
