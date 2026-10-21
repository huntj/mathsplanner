/**
 * @statement Y7-GEO-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y7-GEO-02: Calculate and solve problems involving volume of cuboids (including cubes) and other
// prisms
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { lShape } from "../shared/mea.ts";
import { prism } from "../shared/solids.ts";

interface Params {
  b: number;
  h: number;
  l: number;
  area: number;
  claimTrue: boolean;
  W: number;
  H: number;
  a: number;
  c: number;
}

const tri = (b: number, h: number, l: number) =>
  prism(
    [
      [0, 0],
      [b, 0],
      [0, h],
    ],
    l,
    {
      front: [
        [0, `${b}\\text{ cm}`],
        [2, `${h}\\text{ cm}`],
      ],
      depth: `${l}\\text{ cm}`,
    },
  );

export default defineGenerator<Params>({
  id: "Y7-GEO-02",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: ["MEA.AREA.TRIANGLE-HALF", "MEA.VOLUME.ADDS", "AS.MULTISTEP.ONE-STEP"],

  params(rng, numbers) {
    const top = numbers === "friendly" ? 8 : 14;
    const b = rng.int(3, top);
    const h = rng.int(3, top);
    const l = rng.int(4, top + 6);
    if ((b * h) % 2 !== 0 || b > 2.5 * h || h > 2.5 * b)
      reject("a whole-number cross-section and a sensible triangle");
    const W = rng.int(5, 10);
    const H = rng.int(4, 9);
    const a = rng.int(Math.ceil(W / 4), W - 2);
    const c = rng.int(Math.ceil(H / 3), H - 2);
    return { b, h, l, area: rng.int(6, 40), claimTrue: rng.bool(), W, H, a, c };
  },

  build(p, depth, rng): QuestionDraft {
    const v = (p.b * p.h * p.l) / 2;
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "This prism has a right-angled triangle as its cross-section.",
            A.figure(tri(p.b, p.h, p.l)),
          ],
          ask: "Work out its volume.",
          answer: A.number(v, { units: "cm³" }),
          wrong: wrongs(v, [
            {
              code: "MEA.AREA.TRIANGLE-HALF",
              value: A.number(p.b * p.h * p.l, { units: "cm³" }),
              feedback: "The cross-section is a triangle, so its area is ½ × base × height.",
            },
            {
              code: "MEA.VOLUME.ADDS",
              value: A.number(p.b + p.h + p.l, { units: "cm³" }),
              feedback: "Volume = area of cross-section × length.",
            },
          ]),
          solution: [
            {
              say: `Cross-section = ½ × ${p.b} × ${p.h} = ${(p.b * p.h) / 2} cm². Volume = ${(p.b * p.h) / 2} × ${p.l} = ${v} cm³.`,
            },
          ],
        });
      case 2:
        return A.missingValue({
          intro: `A prism has a cross-section of area ${p.area} cm² and a volume of ${p.area * p.l} cm³. How long is it?`,
          relation: [p.area, "\\times", p.l, "=", p.area * p.l],
          hide: 2,
          units: "cm",
          wrong: wrongs(p.l, [
            {
              code: "MEA.VOLUME.ADDS",
              value: A.number(p.area * p.l - p.area, { units: "cm" }),
              feedback: "Volume = area × length, so divide the volume by the area.",
            },
          ]),
          solution: [{ say: `${p.area * p.l} ÷ ${p.area} = ${p.l} cm.` }],
        });
      case 4:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            A.figure(tri(p.b, p.h, p.l)),
            `Sam says the volume is ${p.b} × ${p.h} × ${p.l}${p.claimTrue ? " ÷ 2" : ""} = ${p.claimTrue ? v : 2 * v} cm³.`,
          ],
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: "True. The cross-section is a triangle with area ½ × base × height; multiply that by the length.",
                  correct: true,
                },
                {
                  text: "False. Do not halve: volume is length × width × height.",
                  code: "MEA.AREA.TRIANGLE-HALF",
                },
                { text: "False. Add the three lengths.", code: "MEA.VOLUME.ADDS" },
              ]
            : [
                {
                  text: `False. That is the volume of a cuboid. The triangle is half of that, so ${v} cm³.`,
                  correct: true,
                },
                {
                  text: "True. Every prism's volume is length × width × height.",
                  code: "MEA.AREA.TRIANGLE-HALF",
                },
                {
                  text: "True. Multiplying all the lengths always gives the volume.",
                  code: "MEA.AREA.TRIANGLE-HALF",
                },
              ],
          solution: [
            {
              say: `Volume = area of cross-section × length = ½ × ${p.b} × ${p.h} × ${p.l} = ${v} cm³.`,
            },
          ],
        });
      default: {
        const area = p.W * p.H - p.a * p.c;
        return A.multiStepContext({
          context: [
            `A step is a prism ${p.l} cm long. Its cross-section is this L-shape.`,
            A.figure(lShape(p.W, p.H, p.a, p.c, [0, 1, 2, 3, 4, 5])),
          ],
          parts: [
            {
              ask: "Work out the area of the cross-section.",
              answer: A.number(area, { units: "cm²" }),
              wrong: wrongs(area, [
                {
                  code: "AS.MULTISTEP.ONE-STEP",
                  value: A.number(p.W * p.H, { units: "cm²" }),
                  feedback: "Take away the missing corner.",
                },
              ]),
            },
            {
              ask: "Work out the volume of the step.",
              answer: A.number(area * p.l, { units: "cm³" }),
              wrong: wrongs(area * p.l, [
                {
                  code: "MEA.VOLUME.ADDS",
                  value: A.number(area + p.l, { units: "cm³" }),
                  feedback: "Multiply the area by the length.",
                },
              ]),
            },
          ],
          solution: [
            { say: `${p.W} × ${p.H} − ${p.a} × ${p.c} = ${area} cm².` },
            { say: `${area} × ${p.l} = ${area * p.l} cm³.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return numberAnswer(question) === (p.b * p.h * p.l) / 2;
    if (question.archetype === "missing-value") return numberAnswer(question) === p.l;
    if (question.archetype === "multi-step-context")
      return numberAnswer(question, 1) === (p.W * p.H - p.a * p.c) * p.l;
    return true;
  },
});
