/**
 * @statement Y4-POS-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-POS-01: Describe positions on a 2D grid as coordinates in the first quadrant
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { CartesianSpec, Coord } from "@mathsplanner/diagrams";
import { chosenFigure, chosenText } from "../shared/counting.ts";
import { coord, same } from "../shared/pos.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  p: Coord;
  /** Depth 2: three other labelled points. */
  others: Coord[];
}

const MAX = 8;
const grid = (
  points: { at: Coord; label?: string }[],
  description = "A coordinate grid with a point marked.",
): CartesianSpec => ({
  type: "cartesian",
  x: { min: 0, max: MAX, step: 1 },
  y: { min: 0, max: MAX, step: 1 },
  grid: true,
  points,
  description,
});

export default defineGenerator<Params>({
  id: "Y4-POS-01",
  version: "1.1.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["ALG.COORD.ORDER"],

  params(rng, numbers) {
    const top = numbers === "friendly" ? 5 : MAX - 1;
    const p: Coord = [rng.int(1, top), rng.int(1, top)];
    if (p[0] === p[1]) reject("a point whose coordinates differ");
    const others: Coord[] = [
      [p[1], p[0]],
      [p[0] + 1, p[1]],
      [p[0], p[1] - 1],
    ];
    if (others.some((o) => o[0] > MAX || o[1] > MAX || o[1] < 0)) reject("points on the grid");
    return { p, others };
  },

  build(p, depth, rng): QuestionDraft {
    const [x, y] = p.p;
    const right = coord(p.p);
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [
            "What are the coordinates of point P?",
            A.figure(
              grid([{ at: p.p, label: "P" }], "A coordinate grid with one point, P, marked."),
            ),
          ],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(coord([y, x])),
              code: "ALG.COORD.ORDER",
              feedback: "Go across first, then up: the x-coordinate comes first.",
            },
            {
              content: A.math(coord([x + 1, y])),
              feedback: "Count the lines from 0, not the squares from 1.",
            },
            {
              content: A.math(coord([x, y - 1])),
              feedback: "Count up the lines from 0 to the point.",
            },
          ],
          solution: [
            { say: `Along the corridor ${x}, then up the stairs ${y}: P is at ${right}.` },
          ],
        });
      case 2: {
        const all = rng.shuffle([p.p, ...p.others]);
        const names = ["A", "B", "C", "D"];
        const at = (q: Coord) => names[all.findIndex((r) => same(r, q))] ?? "";
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            A.figure(
              grid(
                all.map((q, i) => ({ at: q, label: names[i] ?? "" })),
                "A coordinate grid with points A, B, C and D marked.",
              ),
            ),
          ],
          ask: ["Which point is at ", A.math(right), "?"],
          correct: at(p.p),
          distractors: p.others.map((q, i) => ({
            content: at(q),
            ...(i === 0 ? { code: "ALG.COORD.ORDER" } : {}),
            feedback:
              i === 0
                ? `That point is at ${coord(q)}. Go across ${x} first, then up ${y}.`
                : `That point is at ${coord(q)}.`,
          })),
          solution: [{ say: `Across ${x}, up ${y}: point ${at(p.p)}.` }],
        });
      }
      case 3:
        return A.chooseTheDiagram({
          rng,
          question: ["Which grid shows the point ", A.math(right), "?"],
          correct: grid([{ at: p.p }]),
          distractors: [
            {
              figure: grid([{ at: [y, x] }]),
              code: "ALG.COORD.ORDER",
              feedback: `That point is at ${coord([y, x])}: across ${y}, up ${x}.`,
            },
            {
              figure: grid([{ at: [x + 1, y] }]),
              feedback: `That point is at ${coord([x + 1, y])}.`,
            },
          ],
          solution: [{ say: `Start at (0, 0), go across ${x} and up ${y}.` }],
        });
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                "Tom says ",
                A.math(right),
                " and ",
                A.math(coord([y, x])),
                " are the same point, because they use the same numbers.",
              ],
              truth: false,
              reasons: [
                {
                  text: `False. The first number is how far across and the second how far up, so they are different points.`,
                  correct: true,
                },
                {
                  text: "True. The order of the numbers does not matter.",
                  code: "ALG.COORD.ORDER",
                },
                { text: "True. You can go up first or across first.", code: "ALG.COORD.ORDER" },
              ],
              solution: [
                {
                  say: `${right} is ${x} across and ${y} up; ${coord([y, x])} is ${y} across and ${x} up.`,
                },
              ],
            }),
          [
            {
              statement: "Leo plots (3, 1) by going 3 across and 1 up.",
              truth: true,
              right: "True. The first number is across, the second is up.",
              wrong: [
                ["False. Go 3 up and 1 across.", "ALG.COORD.ORDER"],
                ["False. Go 1 across and 3 up."],
              ],
            },
            {
              claim: "The point (0, 0) is at the corner where the axes meet.",
              truth: "always",
              right: "Always. It is the origin: 0 across and 0 up.",
              wrong: [
                ["Never. It is at the top.", "ALG.COORD.ORDER"],
                ["Sometimes. It depends on the grid."],
              ],
            },
            {
              statement: "Pia says the point (2, 6) is further across than the point (5, 1).",
              truth: false,
              right:
                "False. Across is the first number: 2 is less than 5, so (5, 1) is further across.",
              wrong: [
                ["True. 6 is the biggest number.", "ALG.COORD.ORDER"],
                ["True. The second number is across.", "ALG.COORD.ORDER"],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return chosenText(question).includes(coord(p.p));
    if (question.archetype === "choose-the-diagram") {
      const g = chosenFigure(question) as CartesianSpec | undefined;
      const q = g?.points?.[0]?.at;
      return q !== undefined && same(q, p.p);
    }
    return true;
  },
});
