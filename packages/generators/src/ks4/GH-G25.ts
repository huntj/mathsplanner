/**
 * @statement GH-G25
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GH-G25: Use vectors to construct geometric arguments and proofs
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import type { GeometrySpec } from "@mathsplanner/diagrams";
import { chosenText } from "../shared/counting.ts";

interface Params {
  /** P divides AB in the ratio m : n. */
  m: number;
  n: number;
  /** Depth 4: k(a + 2b) against a claimed parallel vector. */
  k: number;
  claimTrue: boolean;
}

const bold = (v: string) => `\\mathbf{${v}}`;

/** Write ca + db with tidy fractions, e.g. \frac{2}{3}\mathbf{a} + \frac{1}{3}\mathbf{b}. */
function combo(ca: [number, number], cb: [number, number]): string {
  const term = ([n, d]: [number, number], v: string) =>
    n === d ? bold(v) : `\\frac{${n}}{${d}}${bold(v)}`;
  return `${term(ca, "a")} + ${term(cb, "b")}`;
}

function triangle(withP: boolean, m: number, n: number): GeometrySpec {
  const A_: [number, number] = [6, 0];
  const B_: [number, number] = [2, 4];
  const t = m / (m + n);
  return {
    type: "geometry",
    points: {
      O: [0, 0],
      A: A_,
      B: B_,
      ...(withP
        ? { P: [A_[0] + t * (B_[0] - A_[0]), A_[1] + t * (B_[1] - A_[1])] as [number, number] }
        : {}),
    },
    polygons: [{ vertices: ["O", "A", "B"] }],
    segments: [
      { from: "O", to: "A", label: bold("a") },
      { from: "O", to: "B", label: bold("b") },
    ],
    pointLabels: true,
    description: withP
      ? "Triangle OAB with OA = a and OB = b, and a point P on AB."
      : "Triangle OAB with OA = a and OB = b.",
  };
}

export default defineGenerator<Params>({
  id: "GH-G25",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.VECTOR.DIRECTION", "RAT.ORDER"],

  params(rng) {
    const [m, n] = rng.pick([
      [1, 2],
      [2, 1],
      [1, 3],
      [3, 1],
    ] as const);
    return { m, n, k: rng.int(2, 4), claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [
            "In triangle OAB, ",
            A.math(`\\overrightarrow{OA} = ${bold("a")}`),
            " and ",
            A.math(`\\overrightarrow{OB} = ${bold("b")}`),
            ".",
            A.figure(triangle(false, 1, 1)),
          ],
          ask: ["Write ", A.math("\\overrightarrow{AB}"), " in terms of a and b."],
          correct: A.math(`${bold("b")} - ${bold("a")}`),
          distractors: [
            {
              content: A.math(`${bold("a")} - ${bold("b")}`),
              code: "GEO.VECTOR.DIRECTION",
              feedback: "From A to B, go back along a (−a) then along b: −a + b.",
            },
            {
              content: A.math(`${bold("a")} + ${bold("b")}`),
              code: "GEO.VECTOR.DIRECTION",
              feedback: "Travelling from A to O goes against a, so it is −a.",
            },
          ],
          solution: [
            {
              say: "",
              math: `\\overrightarrow{AB} = \\overrightarrow{AO} + \\overrightarrow{OB} = -${bold("a")} + ${bold("b")}`,
            },
          ],
        });
      case 2: {
        const s = p.m + p.n;
        const right = combo([p.n, s], [p.m, s]);
        const swapped = combo([p.m, s], [p.n, s]);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "In triangle OAB, ",
            A.math(`\\overrightarrow{OA} = ${bold("a")}`),
            " and ",
            A.math(`\\overrightarrow{OB} = ${bold("b")}`),
            `. P lies on AB with AP : PB = ${p.m} : ${p.n}.`,
            A.figure(triangle(true, p.m, p.n)),
          ],
          ask: ["Write ", A.math("\\overrightarrow{OP}"), " in terms of a and b."],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(swapped),
              code: "RAT.ORDER",
              feedback: `P is ${p.m}/${s} of the way from A to B, so OP = a + ${p.m}/${s}(b − a).`,
            },
            {
              content: A.math(`${bold("a")} + \\frac{${p.m}}{${s}}${bold("b")}`),
              code: "GEO.VECTOR.DIRECTION",
              feedback: "AB = b − a, not b.",
            },
          ],
          solution: [
            {
              say: "",
              math: `\\overrightarrow{OP} = ${bold("a")} + \\tfrac{${p.m}}{${s}}(${bold("b")} - ${bold("a")}) = ${right}`,
            },
          ],
        });
      }
      default: {
        const v = `${bold("a")} + 2${bold("b")}`;
        const w = p.claimTrue
          ? `${p.k}${bold("a")} + ${2 * p.k}${bold("b")}`
          : `2${bold("a")} + ${bold("b")}`;
        return A.trueOrFalseWhy({
          rng,
          statement: ["Ben says the vectors ", A.math(v), " and ", A.math(w), " are parallel."],
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: `True. The second is ${p.k} times the first, so they point the same way.`,
                  correct: true,
                },
                { text: "False. Parallel vectors must be equal." },
                {
                  text: "False. The numbers in front are different.",
                  code: "GEO.VECTOR.DIRECTION",
                },
              ]
            : [
                {
                  text: "False. 2a + b is not a multiple of a + 2b: the ratio of the a and b parts is different.",
                  correct: true,
                },
                { text: "True. Both use one a-part and one b-part.", code: "GEO.VECTOR.DIRECTION" },
                { text: "True. They have the same length." },
              ],
          solution: [
            { say: "Two vectors are parallel when one is a scalar multiple of the other." },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 2)
      return chosenText(question).includes(combo([p.n, p.m + p.n], [p.m, p.m + p.n]));
    return true;
  },
});
