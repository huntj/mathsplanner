/**
 * @statement Y5-MEA-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-MEA-03: Measure and calculate the perimeter of composite rectilinear shapes in centimetres and
// metres
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { lShape, lSides } from "../shared/mea.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  W: number;
  H: number;
  a: number;
  b: number;
  unit: "cm" | "m";
}

export default defineGenerator<Params>({
  id: "Y5-MEA-03",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["MEA.PERIMETER.MISSING-SIDES", "MEA.AREA.SAME-PERIMETER"],

  params(rng, numbers) {
    const top = numbers === "friendly" ? 12 : 30;
    const W = rng.int(6, top);
    const H = rng.int(5, top);
    const a = rng.int(Math.max(2, Math.ceil(W / 4)), W - 2);
    const b = rng.int(Math.max(2, Math.ceil(H / 3)), H - 2);
    if (W > 2.2 * H || H > 2.2 * W) reject("a shape that is not too thin");
    return { W, H, a, b, unit: rng.pick(["cm", "m"] as const) };
  },

  build(p, depth, rng): QuestionDraft {
    const sides = lSides(p.W, p.H, p.a, p.b);
    const per = 2 * (p.W + p.H);
    // Labelled sides: bottom, the right, the cut corner's two sides; the top and left are found.
    const shown = [0, 1, 2, 3];
    const labelled = shown.reduce((s, i) => s + (sides[i] ?? 0), 0);
    switch (depth) {
      case 1: {
        const full = [0, 1, 2, 3, 5];
        return A.standard({
          question: [A.figure(lShape(p.W, p.H, p.a, p.b, full, p.unit))],
          ask: "What is the perimeter of the shape?",
          answer: A.number(per, { units: p.unit }),
          wrong: wrongs(per, [
            {
              code: "MEA.PERIMETER.MISSING-SIDES",
              value: A.number(
                full.reduce((s, i) => s + (sides[i] ?? 0), 0),
                { units: p.unit },
              ),
              feedback: `One side has no label. Work it out: ${p.W} − ${p.a} = ${p.W - p.a}.`,
            },
          ]),
          solution: [
            {
              say: `The missing side is ${p.W} − ${p.a} = ${p.W - p.a} ${p.unit}. Adding all six sides: ${sides.join(" + ")} = ${per} ${p.unit}.`,
            },
          ],
        });
      }
      case 2:
        return A.standard({
          question: [A.figure(lShape(p.W, p.H, p.a, p.b, shown, p.unit))],
          ask: "What is the perimeter of the shape?",
          answer: A.number(per, { units: p.unit }),
          wrong: wrongs(per, [
            {
              code: "MEA.PERIMETER.MISSING-SIDES",
              value: A.number(labelled, { units: p.unit }),
              feedback:
                "Two sides are not labelled. Work out their lengths from the other sides, then add all six.",
            },
          ]),
          solution: [
            {
              say: `Left side: ${sides[1]} + ${p.b} = ${p.H}. Top side: ${p.W} − ${p.a} = ${p.W - p.a}.`,
            },
            { say: `Perimeter: ${sides.join(" + ")} = ${per} ${p.unit}.` },
          ],
        });
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                A.figure(lShape(p.W, p.H, p.a, p.b, [0, 5], p.unit)),
                `The shape is a ${p.W} ${p.unit} by ${p.H} ${p.unit} rectangle with a corner cut out. Zak says its perimeter is less than the rectangle's, because a piece has been cut away.`,
              ],
              truth: false,
              reasons: [
                {
                  text: `False. The two sides of the cut add up to the same as the sides they replace, so the perimeter is still 2 × (${p.W} + ${p.H}) = ${per} ${p.unit}.`,
                  correct: true,
                },
                {
                  text: "True. Less area always means less perimeter.",
                  code: "MEA.AREA.SAME-PERIMETER",
                },
                { text: "True. The shape has fewer sides than the rectangle." },
              ],
              solution: [
                {
                  say: `The steps across add up to ${p.W} and the steps up add up to ${p.H}, so the perimeter is ${per} ${p.unit}.`,
                },
              ],
            }),
          [
            {
              statement:
                "An L-shape is made from a 6 cm by 4 cm rectangle with a 2 cm by 2 cm corner cut out. Jo says its perimeter is 20 cm.",
              truth: true,
              right:
                "True. Cutting out a corner square swaps two edges for two edges of the same length, so the perimeter stays 6 + 4 + 6 + 4 = 20 cm.",
              wrong: [
                ["False. It is 16 cm, as 4 cm was cut away.", "MEA.PERIMETER.MISSING-SIDES"],
                ["False. It is 20 cm², its area."],
              ],
            },
            {
              statement:
                "To find the perimeter of an L-shape, Kai adds only the side lengths that are labelled.",
              truth: false,
              right:
                "False. Every side must be added. Work out any missing sides from the labelled ones first.",
              wrong: [
                ["True. Unlabelled sides do not count.", "MEA.PERIMETER.MISSING-SIDES"],
                ["True. The perimeter is the labelled numbers added up."],
              ],
            },
            {
              claim: "Two shapes with the same perimeter have the same area.",
              truth: "sometimes",
              right:
                "Sometimes. A 1 by 5 and a 2 by 4 rectangle both have perimeter 12, but areas 5 and 8.",
              wrong: [
                ["Always. Same perimeter, same area.", "MEA.AREA.SAME-PERIMETER"],
                ["Never. They can never match."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return numberAnswer(question) === 2 * (p.W + p.H);
    return true;
  },
});
