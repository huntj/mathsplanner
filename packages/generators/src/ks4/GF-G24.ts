/**
 * @statement GF-G24
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-G24: Describe translations as 2D vectors
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { Coord } from "@mathsplanner/diagrams";
import { chosenText } from "../shared/counting.ts";
import {
  coord,
  distinctFrom,
  inRange,
  shapeClearOfOrigin,
  SHAPES,
  shapesGrid,
  translate,
} from "../shared/pos.ts";

interface Params {
  shape: number;
  at: Coord;
  dx: number;
  dy: number;
  p: Coord;
}

const col = (a: number, b: number) => `\\begin{pmatrix} ${a} \\\\ ${b} \\end{pmatrix}`;
const R = 7;

export default defineGenerator<Params>({
  id: "GF-G24",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.VECTOR.COMPONENTS", "POS.TRANSLATE.DIRECTION"],

  params(rng) {
    const shape = rng.int(0, SHAPES.length - 1);
    const at: Coord = [rng.int(-6, 0), rng.int(-6, 0)];
    const dx = rng.int(-5, 6);
    const dy = rng.int(-5, 6);
    const s = translate(SHAPES[shape] as Coord[], at[0], at[1]);
    if (
      dx === 0 ||
      dy === 0 ||
      Math.abs(dx) === Math.abs(dy) ||
      !inRange(s, -R, R) ||
      !inRange(translate(s, dx, dy), -R, R)
    )
      reject("both shapes on the grid");
    if (!shapeClearOfOrigin(s) || !shapeClearOfOrigin(translate(s, dx, dy)))
      reject("shapes clear of the origin label");
    return { shape, at, dx, dy, p: [rng.int(-5, 5), rng.int(-5, 5)] };
  },

  build(p, depth, rng): QuestionDraft {
    const s = translate(SHAPES[p.shape] as Coord[], p.at[0], p.at[1]);
    const t = translate(s, p.dx, p.dy);
    switch (depth) {
      case 1: {
        const right = col(p.dx, p.dy);
        return A.choice({
          rng,
          question: [
            A.figure(
              shapesGrid(
                -R,
                R,
                [
                  { vertices: s, label: "A" },
                  { vertices: t, label: "B" },
                ],
                "Two congruent shapes, A and B, on a coordinate grid.",
              ),
            ),
          ],
          ask: "Write down the column vector that translates shape A onto shape B.",
          correct: A.math(right),
          distractors: [
            {
              content: A.math(col(p.dy, p.dx)),
              code: "GEO.VECTOR.COMPONENTS",
              feedback: "The top number is the movement across (x); the bottom is up or down (y).",
            },
            {
              content: A.math(col(-p.dx, -p.dy)),
              code: "GEO.VECTOR.COMPONENTS",
              feedback: "That moves B back onto A.",
            },
            {
              content: A.math(col(p.dx, -p.dy)),
              code: "POS.TRANSLATE.DIRECTION",
              feedback: "Up is positive, down is negative.",
            },
          ].filter(distinctFrom(A.math(right))),
          solution: [{ say: "Follow one vertex from A to B: ", math: right }],
        });
      }
      case 2: {
        const q: Coord = [p.p[0] + p.dx, p.p[1] + p.dy];
        const right = coord(q);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "The point ",
            A.math(coord(p.p)),
            " is translated by the vector ",
            A.math(col(p.dx, p.dy)),
            ".",
          ],
          ask: "Where does it end up?",
          correct: A.math(right),
          distractors: [
            {
              content: A.math(coord([p.p[0] + p.dy, p.p[1] + p.dx])),
              code: "GEO.VECTOR.COMPONENTS",
              feedback: "Add the top number to x and the bottom to y.",
            },
            {
              content: A.math(coord([p.p[0] - p.dx, p.p[1] - p.dy])),
              code: "POS.TRANSLATE.DIRECTION",
              feedback: "Add the vector; do not subtract it.",
            },
          ].filter(distinctFrom(A.math(right))),
          solution: [{ say: "", math: `${coord(p.p)} + ${col(p.dx, p.dy)} = ${right}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Jo says the vector ",
            A.math(col(p.dx, p.dy)),
            ` means ${Math.abs(p.dx)} ${p.dx > 0 ? "up" : "down"} and ${Math.abs(p.dy)} ${p.dy > 0 ? "right" : "left"}.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. The top number is horizontal: ${Math.abs(p.dx)} ${p.dx > 0 ? "right" : "left"}; the bottom is vertical: ${Math.abs(p.dy)} ${p.dy > 0 ? "up" : "down"}.`,
              correct: true,
            },
            {
              text: "True. The top number of a column vector is the vertical movement.",
              code: "GEO.VECTOR.COMPONENTS",
            },
            {
              text: "True. The order of the numbers does not matter.",
              code: "GEO.VECTOR.COMPONENTS",
            },
          ],
          solution: [{ say: "Column vector: top = x (across), bottom = y (up or down)." }],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return chosenText(question) === col(p.dx, p.dy);
    if (question.archetype === "varied-form")
      return chosenText(question) === coord([p.p[0] + p.dx, p.p[1] + p.dy]);
    return true;
  },
});
