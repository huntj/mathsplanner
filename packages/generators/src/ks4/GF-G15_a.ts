/**
 * @statement GF-G15.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-G15.a: Measure lines and angles
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { ProtractorSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { ruler } from "../shared/mea.ts";

interface Params {
  angle: number;
  start: number;
  length: number;
}

const r1 = (v: number) => Math.round(v * 10) / 10;

export default defineGenerator<Params>({
  id: "GF-G15.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.PROTRACTOR.WRONG-SCALE", "MEA.RULER.END", "GEO.ANGLES.SIZE-BY-ARMS"],

  params(rng) {
    const p = {
      angle: rng.int(4, 32) * 5,
      start: rng.int(11, 39) / 10,
      length: rng.int(25, 90) / 10,
    };
    if (p.angle === 90 || p.start + p.length > 14)
      reject("an angle that is not 90° and a line that fits the ruler");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const spec: ProtractorSpec = {
          type: "measure",
          instrument: "protractor",
          angle: p.angle,
          baseline: "left",
        };
        return A.standard({
          question: ["A protractor is placed over an angle.", A.figure(spec)],
          ask: "What is the size of the angle?",
          answer: A.degrees(p.angle),
          wrong: wrongs(p.angle, [
            {
              code: "GEO.PROTRACTOR.WRONG-SCALE",
              value: A.degrees(180 - p.angle),
              feedback:
                "Start from the 0 on the arm along the base line and read that scale. Check: is the angle acute or obtuse?",
            },
          ]),
          solution: [
            {
              say: `Reading the scale that starts at 0 on the base line: `,
              math: `${p.angle}^\\circ`,
            },
          ],
        });
      }
      case 2: {
        const end = r1(p.start + p.length);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "A line is placed along a ruler. It does not start at 0.",
                A.figure(ruler(15, p.start, end)),
              ],
              ask: "How long is the line, in cm?",
            },
            {
              question: ["A pencil lies next to a ruler.", A.figure(ruler(15, p.start, end))],
              ask: "Find the length of the pencil in centimetres.",
            },
          ],
          answer: A.number(p.length, { units: "cm" }),
          wrong: wrongs(p.length, [
            {
              code: "MEA.RULER.END",
              value: A.number(end, { units: "cm" }),
              feedback: `The line starts at ${p.start} cm, not 0, so subtract: ${end} − ${p.start}.`,
            },
          ]),
          solution: [{ say: "", math: `${end} - ${p.start} = ${p.length} \\text{ cm}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Eve draws two angles of 40°, one with arms 3 cm long and one with arms 8 cm long. She says the second angle is bigger.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. The size of an angle is the amount of turn between the arms, not how long the arms are. Both are 40°.",
              correct: true,
            },
            { text: "True. Longer arms make a bigger angle.", code: "GEO.ANGLES.SIZE-BY-ARMS" },
            {
              text: "True. The gap between the ends of the arms is wider.",
              code: "GEO.ANGLES.SIZE-BY-ARMS",
            },
          ],
          solution: [{ say: "Extending the arms does not change the angle." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.angle;
    if (question.key.depth === 2) return numberAnswer(question) === p.length;
    return true;
  },
});
