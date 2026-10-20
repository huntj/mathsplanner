/**
 * @statement Y8-GEO-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Phase 4 slice; awaiting teacher review
 */
// Y8-GEO-02: Use the standard conventions for labelling the sides and angles of triangle ABC, and
// know and use the criteria for congruence of triangles
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { triangleSSS, type Coord, type GeometrySpec } from "@mathsplanner/diagrams";
import { CRITERIA, CRITERION_WORDS, pairSides, trianglePair } from "../shared/triangles.ts";

interface Params {
  /** Vertex names in order, e.g. ABC or PQR. */
  names: [string, string, string];
  /** Which vertex's side is asked about (0, 1 or 2). */
  which: number;
  /** Side lengths opposite each vertex, in cm. */
  lengths: [number, number, number];
  rotation: number;
  claim: number;
}

/** The triangle drawn with its vertices named; sides opposite each vertex have the given lengths. */
function triangle(p: Params): GeometrySpec {
  const [X, Y, Z] = p.names;
  const [x, y, z] = p.lengths;
  // XY is opposite Z, YZ opposite X, ZX opposite Y.
  const t = triangleSSS(z, x, y);
  const turn = (p.rotation * Math.PI) / 180;
  const at = ([px, py]: Coord): Coord => [
    Math.round((px * Math.cos(turn) - py * Math.sin(turn)) * 1e9) / 1e9,
    Math.round((px * Math.sin(turn) + py * Math.cos(turn)) * 1e9) / 1e9,
  ];
  return {
    type: "geometry",
    points: { [X]: at(t.A), [Y]: at(t.B), [Z]: at(t.C) },
    polygons: [{ vertices: [X, Y, Z] }],
    pointLabels: true,
    description: `Triangle ${X}${Y}${Z}.`,
  };
}

const sideOpposite = (names: string[], i: number) => names.filter((_, k) => k !== i).join("");

export default defineGenerator<Params>({
  id: "Y8-GEO-02",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["GEO.TRIANGLE.SIDE-LABELS", "GEO.CONGRUENCE.AAA"],

  params(rng, numbers) {
    const lengths = rng.sample([4, 5, 6, 7, 8, 9], 3) as [number, number, number];
    const sorted = [...lengths].sort((a, b) => a - b);
    if ((sorted[0] ?? 0) + (sorted[1] ?? 0) <= (sorted[2] ?? 0)) reject("not a triangle");
    return {
      names:
        numbers === "stretch"
          ? rng.pick([
              ["P", "Q", "R"],
              ["L", "M", "N"],
              ["X", "Y", "Z"],
            ] as [string, string, string][])
          : ["A", "B", "C"],
      which: rng.int(0, 2),
      lengths,
      rotation: numbers === "friendly" ? 0 : rng.int(0, 359),
      claim: rng.int(0, 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const vertex = p.names[p.which] ?? "A";
    const letter = vertex.toLowerCase();
    const opposite = sideOpposite(p.names, p.which);
    const name = p.names.join("");
    switch (depth) {
      case 1: {
        const touching = [0, 1, 2]
          .filter((k) => k !== p.which)
          .map((k) => sideOpposite(p.names, k));
        return A.choice({
          rng,
          question: [
            `Sides of a triangle are named with lower-case letters, using the usual convention.`,
            A.figure(triangle(p)),
          ],
          ask: [`Which side of triangle ${name} is side `, A.math(letter), "?"],
          correct: opposite,
          distractors: touching.map((side) => ({
            content: side,
            code: "GEO.TRIANGLE.SIDE-LABELS",
            feedback: `Side ${letter} is not next to ${vertex}: it is the side opposite angle ${vertex}.`,
          })),
          solution: [
            {
              say: `Side ${letter} is opposite angle ${vertex}, so it joins the other two vertices: ${opposite}.`,
            },
          ],
        });
      }
      case 2: {
        const given = p.names
          .map((n, k) => `${n.toLowerCase()} = ${p.lengths[k]}\\text{ cm}`)
          .join(",\\ ");
        const answer = p.lengths[p.which] ?? 0;
        // Students who label the side next to a vertex give the length of a side that touches it.
        const wrong = [0, 1, 2]
          .filter((k) => k !== p.which)
          .map((k) => ({
            code: "GEO.TRIANGLE.SIDE-LABELS",
            value: A.number(p.lengths[k] ?? 0, { units: "cm" }),
            feedback: `${opposite} is opposite ${vertex}, so it is side ${letter}.`,
          }));
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`In triangle ${name}, `, A.math(given), "."],
              ask: `How long is side ${opposite}?`,
            },
            {
              question: [`Triangle ${name} has `, A.math(given), ", using the usual labels."],
              ask: `Write down the length of ${opposite}.`,
            },
          ],
          answer: A.number(answer, { units: "cm" }),
          wrong,
          solution: [
            {
              say: `${opposite} is the side opposite ${vertex}, so it is side ${letter}:`,
              math: `${letter} = ${answer}\\text{ cm}`,
            },
          ],
        });
      }
      case 3: {
        const markings = rng.sample(CRITERIA, 3);
        return A.matchRepresentations({
          rng,
          question: "Match each pair of triangles to the condition that proves they are congruent.",
          pairs: markings.map(
            (m, k) =>
              [
                A.figure(
                  trianglePair(m, {
                    sides: pairSides(m, (min, max) => min + ((k * 3 + p.which) % (max - min + 1))),
                    rotation: rng.int(0, 3) * 30,
                    mirror: false,
                  }),
                ),
                m,
              ] as [A.RichInput, A.RichInput],
          ),
          solution: markings.map((m) => ({ say: `${m}: ${CRITERION_WORDS[m]}.` })),
        });
      }
      default: {
        const claims = [
          {
            statement: [
              `In triangle ${name}, side `,
              A.math(letter),
              ` joins ${opposite[0]} and ${opposite[1]}.`,
            ],
            truth: true,
            reasons: [
              {
                text: `Side ${letter} is opposite angle ${vertex}, and the side opposite ${vertex} joins the other two vertices.`,
                correct: true,
              },
              {
                text: `No: side ${letter} must touch vertex ${vertex}.`,
                code: "GEO.TRIANGLE.SIDE-LABELS",
              },
              { text: "It depends how the triangle is drawn." },
            ],
          },
          {
            statement: "Two triangles with the same three angles must be congruent.",
            truth: false,
            reasons: [
              {
                text: "They have the same shape, but one can be larger than the other.",
                correct: true,
              },
              {
                text: "Equal angles mean equal sides, so they are congruent.",
                code: "GEO.CONGRUENCE.AAA",
              },
              { text: "Only if both triangles are drawn the same way up." },
            ],
          },
        ];
        const c = claims[p.claim];
        if (!c) return reject("no claim");
        return A.trueOrFalseWhy({
          rng,
          statement: c.statement,
          truth: c.truth,
          reasons: c.reasons,
          solution: [{ say: c.reasons[0]?.text ?? "" }],
        });
      }
    }
  },

  verify(p, question) {
    const answer = question.parts[0]?.answer;
    const vertex = p.names[p.which] ?? "A";
    if (answer?.type === "number") return answer.value === p.lengths[p.which];
    if (question.archetype !== "standard" || answer?.type !== "choice") return true;
    // The chosen side is the one in the drawing that does not touch the vertex.
    const chosen = answer.options.find((o) => o.id === answer.correct)?.content[0] as
      { v?: string } | undefined;
    const points = question.diagrams[0]?.points as Record<string, Coord> | undefined;
    return (
      chosen?.v?.length === 2 &&
      !chosen.v.includes(vertex) &&
      [...chosen.v].every((n) => points?.[n] !== undefined)
    );
  },
});
