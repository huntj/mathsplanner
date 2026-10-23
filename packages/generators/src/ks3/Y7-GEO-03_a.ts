/**
 * @statement Y7-GEO-03.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-GEO-03.a: Measure line segments and angles
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { ProtractorSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { ruler } from "../shared/mea.ts";

interface Params {
  angle: number;
  start: number;
  mm: number;
}

export default defineGenerator<Params>({
  id: "Y7-GEO-03.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.PROTRACTOR.WRONG-SCALE", "MEA.RULER.END", "GEO.ANGLES.TYPE-CONFUSED"],

  params(rng) {
    const p = { angle: rng.int(3, 33) * 5, start: rng.int(1, 4), mm: rng.int(25, 95) };
    if (p.angle === 90) reject("an angle that is not 90°");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const spec: ProtractorSpec = {
          type: "measure",
          instrument: "protractor",
          angle: p.angle,
          baseline: "right",
        };
        return A.standard({
          question: ["A protractor is placed over an angle.", A.figure(spec)],
          ask: "What is the size of the angle?",
          answer: A.degrees(p.angle),
          wrong: wrongs(p.angle, [
            {
              code: "GEO.PROTRACTOR.WRONG-SCALE",
              value: A.degrees(180 - p.angle),
              feedback: `Read the scale that starts at 0 on the base line. The angle is ${p.angle < 90 ? "acute" : "obtuse"}.`,
            },
          ]),
          solution: [{ say: "", math: `${p.angle}^\\circ` }],
        });
      }
      case 2: {
        const len = p.mm / 10;
        const end = Math.round((p.start + len) * 10) / 10;
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["A line is measured with a ruler.", A.figure(ruler(15, p.start, end))],
              ask: "How long is the line, in mm?",
            },
          ],
          answer: A.number(p.mm, { units: "mm" }),
          wrong: wrongs(p.mm, [
            {
              code: "MEA.RULER.END",
              value: A.number(Math.round(end * 10), { units: "mm" }),
              feedback: `The line starts at ${p.start} cm, not at 0.`,
            },
          ]),
          solution: [
            { say: "", math: `${end} - ${p.start} = ${len} \\text{ cm} = ${p.mm} \\text{ mm}` },
          ],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["An angle bigger than 90° is obtuse."],
          truth: "sometimes",
          reasons: [
            {
              text: "Sometimes. Angles between 90° and 180° are obtuse, but angles between 180° and 360° are reflex.",
              correct: true,
            },
            {
              text: "Always. Obtuse means more than a right angle.",
              code: "GEO.ANGLES.TYPE-CONFUSED",
            },
            { text: "Never. Obtuse angles are less than 90°.", code: "GEO.ANGLES.TYPE-CONFUSED" },
          ],
          solution: [{ say: "Acute < 90° < obtuse < 180° < reflex < 360°." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.angle;
    if (question.key.depth === 2) return numberAnswer(question) === p.mm;
    return true;
  },
});
