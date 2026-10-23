/**
 * @statement Y8-GEO-02.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y8-GEO-02.a: Use the conventions for labelling triangles
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

const NAMES = [
  ["A", "B", "C"],
  ["P", "Q", "R"],
  ["X", "Y", "Z"],
  ["L", "M", "N"],
];

interface Params {
  n: number;
  v: number;
}

export default defineGenerator<Params>({
  id: "Y8-GEO-02.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.TRIANGLE.SIDE-LABELS"],

  params(rng) {
    return { n: rng.int(0, NAMES.length - 1), v: rng.int(0, 2) };
  },

  build(p, depth, rng): QuestionDraft {
    const [a, b, c] = NAMES[p.n] ?? ["A", "B", "C"];
    const pts = [a, b, c] as string[];
    const at = pts[p.v] ?? "A";
    const others = pts.filter((x) => x !== at);
    const opposite = `${others[0]}${others[1]}`;
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [
            `In triangle ${a}${b}${c}, which side is labelled `,
            A.math(at.toLowerCase()),
            "?",
          ],
          correct: A.math(opposite),
          distractors: others.map((o) => ({
            content: A.math(`${at}${o}`),
            code: "GEO.TRIANGLE.SIDE-LABELS",
            feedback: `Side ${at.toLowerCase()} is opposite angle ${at}, so it does not touch ${at}.`,
          })),
          solution: [
            { say: `Side ${at.toLowerCase()} is opposite vertex ${at}: `, math: opposite },
          ],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            `In triangle ${a}${b}${c}, which angle is opposite the side `,
            A.math(opposite),
            "?",
          ],
          correct: A.math(`\\angle ${at}`),
          distractors: others.map((o) => ({
            content: A.math(`\\angle ${o}`),
            code: "GEO.TRIANGLE.SIDE-LABELS",
            feedback: `Angle ${o} touches side ${opposite}. The opposite angle is at the vertex not on that side.`,
          })),
          solution: [
            { say: `${opposite} does not touch ${at}, so it is opposite `, math: `\\angle ${at}` },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Ali says side ${at.toLowerCase()} of triangle ${a}${b}${c} is one of the sides next to angle ${at}.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. By convention, side ${at.toLowerCase()} is opposite angle ${at}: it is ${opposite}.`,
              correct: true,
            },
            {
              text: "True. Each side is named after the angle it touches.",
              code: "GEO.TRIANGLE.SIDE-LABELS",
            },
            {
              text: `True. Side ${at.toLowerCase()} starts at ${at}.`,
              code: "GEO.TRIANGLE.SIDE-LABELS",
            },
          ],
          solution: [
            { say: "Small letter for a side, the same capital for the angle opposite it." },
          ],
        });
    }
  },

  verify(p, question) {
    const pts = NAMES[p.n] ?? ["A", "B", "C"];
    const at = pts[p.v] ?? "A";
    const others = pts.filter((x) => x !== at);
    if (question.key.depth === 1) return chosenText(question) === `${others[0]}${others[1]}`;
    if (question.key.depth === 2) return chosenText(question) === `\\angle ${at}`;
    return true;
  },
});
