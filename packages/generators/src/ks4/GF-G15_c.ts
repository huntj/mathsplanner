/**
 * @statement GF-G15.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-G15.c: Use bearings
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { bearing } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

const POINTS: [string, number][] = [
  ["north-east", 45],
  ["south-east", 135],
  ["south-west", 225],
  ["north-west", 315],
  ["east", 90],
  ["west", 270],
];

interface Params {
  b: number;
  point: number;
}

const three = (b: number) => String(b).padStart(3, "0");
const back = (b: number) => (b < 180 ? b + 180 : b - 180);

export default defineGenerator<Params>({
  id: "GF-G15.c",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.BEARINGS.BACK-BEARING", "GEO.BEARINGS.ANTICLOCKWISE"],

  params(rng) {
    let b = rng.int(2, 34) * 10 + rng.pick([0, 5]);
    if (b === 180) b = 165;
    return { b, point: rng.int(0, POINTS.length - 1) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = back(p.b);
        return A.standard({
          question: [
            `The bearing of B from A is ${three(p.b)}°.`,
            A.figure(bearing(p.b, { label: `${three(p.b)}^\\circ` })),
          ],
          ask: "Find the bearing of A from B.",
          answer: A.degrees(v),
          wrong: wrongs(v, [
            {
              code: "GEO.BEARINGS.BACK-BEARING",
              value: A.degrees(p.b),
              feedback:
                "Going back the other way faces the opposite direction: add or subtract 180°.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `${p.b}^\\circ ${p.b < 180 ? "+" : "-"} 180^\\circ = ${three(v)}^\\circ`,
            },
          ],
        });
      }
      case 2: {
        const [name, v] = POINTS[p.point] ?? ["east", 90];
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`A ship sails due ${name}.`],
              ask: "What three-figure bearing is it sailing on?",
            },
            {
              question: [`A hiker walks ${name} from a car park.`],
              ask: "On what bearing is she walking?",
            },
          ],
          answer: A.degrees(v),
          wrong: wrongs(v, [
            {
              code: "GEO.BEARINGS.ANTICLOCKWISE",
              value: A.degrees(360 - v),
              feedback: "Bearings are measured clockwise from north.",
            },
          ]),
          solution: [{ say: `Clockwise from north to ${name}: `, math: `${three(v)}^\\circ` }],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                "Ash measures a bearing anticlockwise from north because that is the way angles are measured in maths.",
              ],
              truth: false,
              reasons: [
                {
                  text: "False. Bearings are always measured clockwise from north and written with three figures, like 045°.",
                  correct: true,
                },
                {
                  text: "True. Angles always go anticlockwise.",
                  code: "GEO.BEARINGS.ANTICLOCKWISE",
                },
                {
                  text: "True. Either direction gives the same bearing.",
                  code: "GEO.BEARINGS.ANTICLOCKWISE",
                },
              ],
              solution: [{ say: "Three rules: from north, clockwise, three figures." }],
            }),
          [
            {
              statement: "Sol says a bearing of 090° points due east.",
              truth: true,
              right: "True. Bearings go clockwise from north: 090° is east.",
              wrong: [
                ["False. It points west.", "GEO.BEARINGS.ANTICLOCKWISE"],
                ["False. It points north."],
              ],
            },
            {
              claim: "A bearing is written with three figures.",
              truth: "always",
              right: "Always. For example 045°, not 45°.",
              wrong: [
                ["Never. Use as few figures as you need."],
                ["Sometimes. Only if it is over 100°."],
              ],
            },
            {
              statement:
                "The bearing of B from A is 060°. Ana says the bearing of A from B is 060° too.",
              truth: false,
              right: "False. The back bearing differs by 180°: 240°.",
              wrong: [
                ["True. It is the same line.", "GEO.BEARINGS.BACK-BEARING"],
                ["True. Bearings work both ways.", "GEO.BEARINGS.BACK-BEARING"],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === back(p.b);
    if (question.key.depth === 2) return numberAnswer(question) === (POINTS[p.point]?.[1] ?? 90);
    return true;
  },
});
