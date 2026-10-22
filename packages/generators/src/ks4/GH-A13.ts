/**
 * @statement GH-A13
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GH-A13: Sketch translations and reflections of a given function
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

type Move = "up" | "neg-f" | "neg-x";

interface Params {
  /** The turning point (a, b) of y = f(x). */
  a: number;
  b: number;
  /** A shift. */
  c: number;
  move: Move;
  left: boolean;
}

const pt = (x: number, y: number) => `(${x}, ${y})`;

export default defineGenerator<Params>({
  id: "GH-A13",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.TRANSFORM.DIRECTION"],

  params(rng) {
    const a = rng.int(-5, 5);
    const b = rng.int(-5, 5);
    const c = rng.int(2, 6);
    if (
      a === 0 ||
      b === 0 ||
      Math.abs(a) === c ||
      Math.abs(b) === c ||
      a === b ||
      a === -b ||
      c === -2 * b
    )
      reject("a point whose images are all different");
    return { a, b, c, move: rng.pick(["up", "neg-f", "neg-x"] as const), left: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const intro = [
      "The curve ",
      A.math("y = f(x)"),
      " has a turning point at ",
      A.math(pt(p.a, p.b)),
      ".",
    ];
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: intro,
          ask: ["What is the turning point of ", A.math(`y = f(x + ${p.c})`), "?"],
          correct: A.math(pt(p.a - p.c, p.b)),
          distractors: [
            {
              content: A.math(pt(p.a + p.c, p.b)),
              code: "ALG.TRANSFORM.DIRECTION",
              feedback: `f(x + ${p.c}) moves the curve ${p.c} units left, not right.`,
            },
            {
              content: A.math(pt(p.a, p.b + p.c)),
              code: "ALG.TRANSFORM.DIRECTION",
              feedback:
                "Adding inside the bracket moves the curve sideways; adding outside moves it up.",
            },
            {
              content: A.math(pt(p.a, p.b - p.c)),
              code: "ALG.TRANSFORM.DIRECTION",
              feedback: "A change inside the bracket is a horizontal translation.",
            },
          ],
          solution: [
            {
              say: `y = f(x + ${p.c}) is a translation by ${p.c} units to the left: (${p.a} − ${p.c}, ${p.b}).`,
            },
          ],
        });
      case 2: {
        const transforms: Record<Move, { eq: string; image: [number, number]; words: string }> = {
          up: {
            eq: `y = f(x) + ${p.c}`,
            image: [p.a, p.b + p.c],
            words: `a translation ${p.c} units up`,
          },
          "neg-f": { eq: "y = -f(x)", image: [p.a, -p.b], words: "a reflection in the x-axis" },
          "neg-x": { eq: "y = f(-x)", image: [-p.a, p.b], words: "a reflection in the y-axis" },
        };
        const t = transforms[p.move];
        const others = (Object.keys(transforms) as Move[])
          .filter((m) => m !== p.move)
          .map((m) => transforms[m]);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: intro,
          ask: ["What is the turning point of ", A.math(t.eq), "?"],
          correct: A.math(pt(...t.image)),
          distractors: [
            ...others.map((o) => ({
              content: A.math(pt(...o.image)),
              code: "ALG.TRANSFORM.DIRECTION",
              feedback: `That is the turning point of ${o.eq.replace("y = ", "y = ")}, ${o.words}.`,
            })),
            {
              content: A.math(pt(-p.a, -p.b)),
              code: "ALG.TRANSFORM.DIRECTION",
              feedback: "Only one coordinate changes.",
            },
          ],
          solution: [{ say: `${t.eq} is ${t.words}.` }],
        });
      }
      default: {
        const dir = p.left ? "left" : "right";
        const eq = `y = (x ${p.left ? "-" : "+"} ${p.c})^2`;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Sam says the graph of ",
            A.math(eq),
            " is the graph of ",
            A.math("y = x^2"),
            ` translated ${p.c} units ${dir}.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. (x ${p.left ? "−" : "+"} ${p.c})² is zero when x = ${p.left ? p.c : -p.c}, so the curve moves ${p.c} units ${p.left ? "right" : "left"}.`,
              correct: true,
            },
            {
              text: `True. The sign in the bracket tells you: ${p.left ? "minus means left" : "plus means right"}.`,
              code: "ALG.TRANSFORM.DIRECTION",
            },
            {
              text: `False. It moves ${p.c} units ${p.left ? "down" : "up"}.`,
              code: "ALG.TRANSFORM.DIRECTION",
            },
          ],
          solution: [
            {
              say: "y = f(x − a) is a translation a units to the right; y = f(x + a) is a units to the left.",
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question).includes(pt(p.a - p.c, p.b));
    return true;
  },
});
