/**
 * @statement AL-P2.4
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P2.4: Solve simultaneous equations by elimination and substitution, including one linear and
// one quadratic
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { lineLatex, poly } from "../shared/alg.ts";
import { chosenText } from "../shared/counting.ts";

/** A circle x² + y² = r2 and the line y = mx + k through two whole-number points on it. */
interface Case {
  r2: number;
  m: number;
  k: number;
  pts: [[number, number], [number, number]];
}

const CASES: Case[] = [
  {
    r2: 25,
    m: 1,
    k: 1,
    pts: [
      [-4, -3],
      [3, 4],
    ],
  },
  {
    r2: 25,
    m: -2,
    k: 5,
    pts: [
      [0, 5],
      [4, -3],
    ],
  },
  {
    r2: 25,
    m: -1,
    k: 1,
    pts: [
      [-3, 4],
      [4, -3],
    ],
  },
  {
    r2: 10,
    m: -1,
    k: 4,
    pts: [
      [1, 3],
      [3, 1],
    ],
  },
  {
    r2: 10,
    m: 1,
    k: 2,
    pts: [
      [-3, -1],
      [1, 3],
    ],
  },
  {
    r2: 13,
    m: -1,
    k: 5,
    pts: [
      [2, 3],
      [3, 2],
    ],
  },
  {
    r2: 13,
    m: -1,
    k: 1,
    pts: [
      [-2, 3],
      [3, -2],
    ],
  },
  {
    r2: 50,
    m: -1,
    k: 8,
    pts: [
      [1, 7],
      [7, 1],
    ],
  },
];

interface Params {
  c: number;
}

const sol = (pts: [number, number][]) =>
  pts.map(([x, y]) => `x = ${x},\\ y = ${y}`).join(" \\text{ and } ");

export default defineGenerator<Params>({
  id: "AL-P2.4",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SIMULTANEOUS.PAIR", "ALG.EXPAND.BINOMIAL-TWO-TERMS"],

  params(rng) {
    return { c: rng.int(0, CASES.length - 1) };
  },

  build(p, depth, rng): QuestionDraft {
    const c = CASES[p.c] ?? (CASES[0] as Case);
    const [[x1, y1], [x2, y2]] = c.pts;
    const circle = `x^2 + y^2 = ${c.r2}`;
    const line = lineLatex(c.m, c.k);
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [
            "Solve the simultaneous equations ",
            A.math(circle),
            " and ",
            A.math(line),
            ".",
          ],
          correct: A.math(sol(c.pts)),
          distractors: [
            ...(y1 !== y2
              ? [
                  {
                    content: A.math(
                      sol([
                        [x1, y2],
                        [x2, y1],
                      ]),
                    ),
                    code: "ALG.SIMULTANEOUS.PAIR",
                    feedback: "Substitute each x into the linear equation to find its own y.",
                  },
                ]
              : []),
            {
              content: A.math(`x = ${x1} \\text{ or } x = ${x2}`),
              code: "ALG.SIMULTANEOUS.PAIR",
              feedback: "Each solution needs its y-value too.",
            },
            {
              content: A.math(
                sol([
                  [-x1, -y1],
                  [-x2, -y2],
                ]),
              ),
              code: "ALG.SIMULTANEOUS.PAIR",
              feedback: "Check each pair in the linear equation.",
            },
          ],
          solution: [
            {
              say: "Substitute the line into the circle: ",
              math: `${poly([1 + c.m * c.m, 2 * c.m * c.k, c.k * c.k - c.r2])} = 0`,
            },
            { say: "Solve, then find each y from the line: ", math: sol(c.pts) },
          ],
        });
      case 2: {
        // Equations are matched up to sign only, so ask for the form with no common factor.
        const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
        const [qa, qb, qc] = [1 + c.m * c.m, 2 * c.m * c.k, c.k * c.k - c.r2];
        const g = gcd(gcd(qa, qb), qc);
        const simple = poly([qa / g, qb / g, qc / g]);
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["Substitute ", A.math(line), " into ", A.math(circle), "."],
              ask: "Write the result as a quadratic equation in x, in the form ax² + bx + c = 0, where a, b and c are integers with no common factor.",
            },
          ],
          answer: A.exact(`${simple} = 0`),
          wrong: [
            {
              code: "ALG.EXPAND.BINOMIAL-TWO-TERMS",
              value: A.exact(`${poly([qa / g, 0, qc / g])} = 0`),
              feedback: `(${poly([c.m, c.k])})² has a middle term ${2 * c.m * c.k}x.`,
            },
          ],
          solution: [
            {
              say: "",
              math: `x^2 + (${poly([c.m, c.k])})^2 = ${c.r2} \\Rightarrow ${poly([qa, qb, qc])} = 0${g > 1 ? ` \\Rightarrow ${simple} = 0` : ""}`,
            },
          ],
        });
      }
      default: {
        const d = Math.ceil(Math.sqrt(2 * c.r2)) + 1;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Tom says the line ",
            A.math(`y = x + ${d}`),
            " meets the circle ",
            A.math(circle),
            " at two points.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. Substituting gives 2x² + ${2 * d}x + ${d * d - c.r2} = 0, whose discriminant ${4 * d * d - 8 * (d * d - c.r2)} is negative: the line misses the circle.`,
              correct: true,
            },
            { text: "True. A line always crosses a circle twice." },
            { text: "True. Every quadratic has two solutions." },
          ],
          solution: [
            {
              say: "The number of meeting points is the number of real solutions of the quadratic: use the discriminant.",
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const c = CASES[p.c] ?? (CASES[0] as Case);
    if (question.key.depth === 1) return chosenText(question).includes(sol(c.pts));
    return true;
  },
});
