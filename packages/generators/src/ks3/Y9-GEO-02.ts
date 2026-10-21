/**
 * @statement Y9-GEO-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y9-GEO-02: Use the properties of faces, surfaces, edges and vertices of cubes, cuboids, prisms,
// cylinders, pyramids, cones and spheres to calculate surface area of prisms and volume of cylinders
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { cuboid } from "../shared/mea.ts";
import { cylinder, prism } from "../shared/solids.ts";

interface Params {
  l: number;
  w: number;
  h: number;
  r: number;
  ch: number;
  pair: number;
  k: number;
  len: number;
}

const r1 = (x: number) => Math.round(x * 10) / 10;
const dp1 = { accuracy: { dp: 1 } } as const;
const sa = (l: number, w: number, h: number) => 2 * (l * w + l * h + w * h);
// Pairs of cuboids with the same volume but different surface areas.
const PAIRS: [[number, number, number], [number, number, number]][] = [
  [
    [2, 2, 2],
    [1, 2, 4],
  ],
  [
    [3, 3, 2],
    [1, 3, 6],
  ],
  [
    [4, 2, 2],
    [8, 2, 1],
  ],
  [
    [3, 4, 2],
    [6, 2, 2],
  ],
  [
    [6, 2, 3],
    [9, 2, 2],
  ],
];

export default defineGenerator<Params>({
  id: "Y9-GEO-02",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: [
    "MEA.SURFACE.MISSING-FACES",
    "MEA.SURFACE.VOLUME",
    "MEA.CIRCLE.FORMULA",
    "GEO.CIRCLE.RADIUS-DIAMETER",
    "MEA.AREA.TRIANGLE-HALF",
    "AS.MULTISTEP.ONE-STEP",
  ],

  params(rng, numbers) {
    const top = numbers === "friendly" ? 6 : 12;
    const l = rng.int(3, top);
    const w = rng.int(2, top);
    const h = rng.int(2, top);
    if (l < w || sa(l, w, h) === l * w * h)
      reject("a cuboid longer than it is deep, with area and volume different");
    const r = rng.int(2, numbers === "friendly" ? 5 : 10);
    const ch = rng.int(3, 15);
    if (ch > 4 * r || r > 3 * ch) reject("a sensible cylinder");
    return {
      l,
      w,
      h,
      r,
      ch,
      pair: rng.int(0, PAIRS.length - 1),
      k: rng.int(1, 3),
      len: rng.int(5, 15),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const s = sa(p.l, p.w, p.h);
        return A.standard({
          question: [A.figure(cuboid(p.l, p.w, p.h))],
          ask: "Work out the surface area of the cuboid.",
          answer: A.number(s, { units: "cm²" }),
          wrong: wrongs(s, [
            {
              code: "MEA.SURFACE.MISSING-FACES",
              value: A.number(s / 2, { units: "cm²" }),
              feedback:
                "There are six faces: each one you can see has a matching face hidden opposite it.",
            },
            {
              code: "MEA.SURFACE.VOLUME",
              value: A.number(p.l * p.w * p.h, { units: "cm²" }),
              feedback:
                "Multiplying the three edges gives the volume. Surface area adds the areas of the faces.",
            },
          ]),
          solution: [
            {
              say: `2 × (${p.l} × ${p.w} + ${p.l} × ${p.h} + ${p.w} × ${p.h}) = 2 × ${s / 2} = ${s} cm².`,
            },
          ],
        });
      }
      case 2: {
        const v = r1(Math.PI * p.r * p.r * p.ch);
        return A.standard({
          question: [
            `A cylinder has radius ${p.r} cm and height ${p.ch} cm.`,
            A.figure(cylinder(p.r, p.ch)),
          ],
          ask: "Work out the volume of the cylinder, to 1 decimal place.",
          answer: A.number(v, { units: "cm³", ...dp1 }),
          wrong: wrongs(v, [
            {
              code: "MEA.CIRCLE.FORMULA",
              value: A.number(r1(2 * Math.PI * p.r * p.ch), { units: "cm³", ...dp1 }),
              feedback: "2πr is the circumference. The cross-section's area is πr².",
            },
            {
              code: "GEO.CIRCLE.RADIUS-DIAMETER",
              value: A.number(r1(Math.PI * 4 * p.r * p.r * p.ch), { units: "cm³", ...dp1 }),
              feedback: `The radius is ${p.r} cm; do not double it.`,
            },
          ]),
          solution: [{ say: `V = πr²h = π × ${p.r}² × ${p.ch} = ${v} cm³ (1 d.p.).` }],
        });
      }
      case 4: {
        const [[a, b, c], [d, e, f]] = PAIRS[p.pair] as (typeof PAIRS)[number];
        return A.trueOrFalseWhy({
          rng,
          statement: `Cuboid P is ${a} cm by ${b} cm by ${c} cm. Cuboid Q is ${d} cm by ${e} cm by ${f} cm. Both have a volume of ${a * b * c} cm³. Liam says they must have the same surface area.`,
          truth: false,
          reasons: [
            {
              text: `False. P's surface area is ${sa(a, b, c)} cm² and Q's is ${sa(d, e, f)} cm². The same volume can be wrapped in different amounts of surface.`,
              correct: true,
            },
            { text: "True. Surface area and volume go together.", code: "MEA.SURFACE.VOLUME" },
            { text: "True. Same volume means the same faces.", code: "MEA.SURFACE.VOLUME" },
          ],
          solution: [
            {
              say: `2 × (${a * b} + ${a * c} + ${b * c}) = ${sa(a, b, c)}; 2 × (${d * e} + ${d * f} + ${e * f}) = ${sa(d, e, f)}.`,
            },
          ],
        });
      }
      default: {
        const [a, b, c] = [3 * p.k, 4 * p.k, 5 * p.k];
        const ends = a * b;
        const total = ends + (a + b + c) * p.len;
        const fig = prism(
          [
            [0, 0],
            [a, 0],
            [0, b],
          ],
          p.len,
          {
            front: [
              [0, `${a}\\text{ cm}`],
              [1, `${c}\\text{ cm}`],
              [2, `${b}\\text{ cm}`],
            ],
            depth: `${p.len}\\text{ cm}`,
          },
        );
        return A.multiStepContext({
          context: ["A prism has a right-angled triangle as its cross-section.", A.figure(fig)],
          parts: [
            {
              ask: "Work out the total area of the two triangular ends.",
              answer: A.number(ends, { units: "cm²" }),
              wrong: wrongs(ends, [
                {
                  code: "MEA.AREA.TRIANGLE-HALF",
                  value: A.number(2 * ends, { units: "cm²" }),
                  feedback: "Each triangle is ½ × base × height.",
                },
              ]),
            },
            {
              ask: "Work out the total surface area of the prism.",
              answer: A.number(total, { units: "cm²" }),
              wrong: wrongs(total, [
                {
                  code: "MEA.SURFACE.MISSING-FACES",
                  value: A.number(ends + (a + b) * p.len, { units: "cm²" }),
                  feedback: "There are three rectangles: include the sloping one.",
                },
                {
                  code: "AS.MULTISTEP.ONE-STEP",
                  value: A.number((a + b + c) * p.len, { units: "cm²" }),
                  feedback: "Add the two triangular ends as well.",
                },
              ]),
            },
          ],
          solution: [
            { say: `Two triangles: 2 × ½ × ${a} × ${b} = ${ends} cm².` },
            {
              say: `Three rectangles: (${a} + ${b} + ${c}) × ${p.len} = ${(a + b + c) * p.len} cm². Total ${total} cm².`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") {
      const n = numberAnswer(question);
      return n === sa(p.l, p.w, p.h) || Math.abs(n - Math.PI * p.r * p.r * p.ch) < 0.06;
    }
    if (question.archetype === "multi-step-context")
      return numberAnswer(question, 1) === 12 * p.k * p.k + 12 * p.k * p.len;
    return true;
  },
});
