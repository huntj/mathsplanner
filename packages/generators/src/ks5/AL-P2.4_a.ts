/**
 * @statement AL-P2.4.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P2.4.a: Solve linear simultaneous equations by elimination and substitution
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { linear } from "../shared/alg.ts";
import { chosenText } from "../shared/counting.ts";

interface Params {
  x: number;
  y: number;
  /** ax + by = e and cx + dy = f. */
  a: number;
  b: number;
  c: number;
  d: number;
}

const sol = (x: number, y: number) => `x = ${x},\\ y = ${y}`;

export default defineGenerator<Params>({
  id: "AL-P2.4.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SIMULTANEOUS.SIGN", "ALG.SIMULTANEOUS.PAIR"],

  params(rng) {
    const p = {
      x: rng.int(-6, 8),
      y: rng.int(-6, 8),
      a: rng.int(1, 5),
      b: rng.int(1, 5),
      c: rng.int(1, 5),
      d: rng.int(-5, -1),
    };
    if (p.a * p.d === p.b * p.c || p.x === p.y || p.x === 0 || p.y === 0)
      reject("one solution with distinct values");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const e = p.a * p.x + p.b * p.y;
    const f = p.c * p.x + p.d * p.y;
    const eqs = A.displayMath(
      `\\begin{aligned} ${linear([
        [p.a, "x"],
        [p.b, "y"],
      ])} &= ${e} \\\\ ${linear([
        [p.c, "x"],
        [p.d, "y"],
      ])} &= ${f} \\end{aligned}`,
    );
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: ["Solve the simultaneous equations.", eqs],
          correct: A.math(sol(p.x, p.y)),
          distractors: [
            {
              content: A.math(sol(p.y, p.x)),
              code: "ALG.SIMULTANEOUS.PAIR",
              feedback:
                "Substitute both values into each equation to check which is x and which is y.",
            },
            {
              content: A.math(sol(p.x, -p.y)),
              code: "ALG.SIMULTANEOUS.SIGN",
              feedback:
                "Check the signs: subtract equations when the terms have the same sign, add when they differ.",
            },
            {
              content: A.math(sol(-p.x, p.y)),
              code: "ALG.SIMULTANEOUS.SIGN",
              feedback: "Substitute back to check both equations.",
            },
          ],
          solution: [
            {
              say: `Eliminate one variable, solve for the other and substitute back: ${sol(p.x, p.y).replace("\\ ", " ")}.`,
            },
          ],
        });
      case 2: {
        // Substitution: y = mx + k with x into a second line.
        const m = p.a;
        const k = p.y - m * p.x;
        const g = p.c * p.x + p.b * p.y;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "Solve by substitution.",
            A.displayMath(
              `\\begin{aligned} y &= ${linear([
                [m, "x"],
                [k, ""],
              ])} \\\\ ${linear([
                [p.c, "x"],
                [p.b, "y"],
              ])} &= ${g} \\end{aligned}`,
            ),
          ],
          correct: A.math(sol(p.x, p.y)),
          distractors: [
            {
              content: A.math(sol(p.y, p.x)),
              code: "ALG.SIMULTANEOUS.PAIR",
              feedback: "Find x first, then put it into y = … to get y.",
            },
            ...(k === 0
              ? []
              : [
                  {
                    content: A.math(sol(p.x, m * p.x)),
                    code: "ALG.SIMULTANEOUS.PAIR",
                    feedback: `Include the constant ${k} when you work out y.`,
                  },
                ]),
          ],
          solution: [
            {
              say: `Replace y in the second equation by ${m}x ${k < 0 ? "−" : "+"} ${Math.abs(k)} and solve for x.`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Kai solves these equations, finds x = ${p.x} and says that is the solution.`,
            eqs,
          ],
          truth: false,
          reasons: [
            {
              text: `False. A solution needs both values: substitute x = ${p.x} back to get y = ${p.y}.`,
              correct: true,
            },
            { text: "True. Finding one variable solves the pair.", code: "ALG.SIMULTANEOUS.PAIR" },
            { text: "True. y is always the same as x." },
          ],
          solution: [{ say: "", math: sol(p.x, p.y) }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 4) return true;
    return chosenText(question).includes(sol(p.x, p.y));
  },
});
