/**
 * @statement Y8-GEO-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y8-GEO-01: Calculate and solve problems involving perimeters of 2D shapes (including circles),
// areas of circles and composite shapes
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import type { Coord, GeometrySpec, GeoSegment } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  r: number;
  useDiameter: boolean;
  /** Depth 3: three radii. */
  radii: number[];
  /** Depth 5: a rectangle w by h with a semicircle on the top side. */
  w: number;
  h: number;
}

const r1 = (x: number) => Math.round(x * 10) / 10;
const dp1 = { accuracy: { dp: 1 } } as const;

/** A circle with its radius or diameter drawn and labelled. */
function circle(r: number, diameter: boolean): GeometrySpec {
  const P: Coord = [r * Math.cos(0.5), r * Math.sin(0.5)];
  const Q: Coord = [-P[0], -P[1]];
  const seg: GeoSegment = diameter
    ? { from: "Q", to: "P", label: `${2 * r}\\text{ cm}`, length: 2 * r }
    : { from: "O", to: "P", label: `${r}\\text{ cm}`, length: r };
  return {
    type: "geometry",
    points: { O: [0, 0], P, Q },
    circles: [{ centre: "O", radius: r }],
    segments: [seg],
    dots: ["O"],
    description: `A circle with its ${diameter ? `diameter, ${2 * r} cm,` : `radius, ${r} cm,`} marked.`,
  };
}

/** A rectangle with a semicircle on its top side. */
function arch(w: number, h: number): GeometrySpec {
  const n = 18;
  const points: Record<string, Coord> = { A: [0, 0], B: [w, 0], C: [w, h], D: [0, h] };
  const segments: GeoSegment[] = [
    { from: "A", to: "B", label: `${w}\\text{ m}`, length: w },
    { from: "B", to: "C", label: `${h}\\text{ m}`, length: h },
    { from: "D", to: "A" },
    { from: "D", to: "C", dashed: true },
  ];
  for (let i = 0; i <= n; i++) {
    const t = (Math.PI * i) / n;
    points[`s${i}`] = [w / 2 + (w / 2) * Math.cos(t), h + (w / 2) * Math.sin(t)];
    if (i > 0) segments.push({ from: `s${i - 1}`, to: `s${i}` });
  }
  return {
    type: "geometry",
    points,
    segments,
    description: `A rectangle ${w} m wide and ${h} m tall with a semicircle on its top side.`,
  };
}

export default defineGenerator<Params>({
  id: "Y8-GEO-01",
  version: "1.0.0",
  depths: [1, 2, 3, 4, 5],
  misconceptions: [
    "GEO.CIRCLE.RADIUS-DIAMETER",
    "MEA.CIRCLE.FORMULA",
    "RAT.SCALE.AREA-LINEAR",
    "AS.MULTISTEP.ONE-STEP",
  ],

  params(rng, numbers) {
    return {
      r: rng.int(2, numbers === "friendly" ? 6 : 15),
      useDiameter: rng.bool(),
      radii: rng.shuffle([2, 3, 4, 5, 6, 7, 8, 9, 10]).slice(0, 3),
      w: rng.int(2, 6) * 2,
      h: rng.int(3, 8),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const C = r1(2 * Math.PI * p.r);
    const area = r1(Math.PI * p.r * p.r);
    switch (depth) {
      case 1:
        return A.standard({
          question: [A.figure(circle(p.r, p.useDiameter))],
          ask: "Work out the circumference of the circle. Give your answer to 1 decimal place.",
          answer: A.number(C, { units: "cm", ...dp1 }),
          wrong: wrongs(C, [
            p.useDiameter
              ? {
                  code: "GEO.CIRCLE.RADIUS-DIAMETER",
                  value: A.number(r1(4 * Math.PI * p.r), { units: "cm", ...dp1 }),
                  feedback: "The marked length is the diameter. C = πd, or 2πr with the radius.",
                }
              : {
                  code: "GEO.CIRCLE.RADIUS-DIAMETER",
                  value: A.number(r1(Math.PI * p.r), { units: "cm", ...dp1 }),
                  feedback: "The marked length is the radius. C = 2πr, or πd with the diameter.",
                },
            {
              code: "MEA.CIRCLE.FORMULA",
              value: A.number(area, { units: "cm", ...dp1 }),
              feedback: "πr² is the area. The circumference is 2πr.",
            },
          ]),
          solution: [{ say: `C = πd = π × ${2 * p.r} = ${C} cm (1 d.p.).` }],
        });
      case 2:
        return A.standard({
          question: [A.figure(circle(p.r, p.useDiameter))],
          ask: "Work out the area of the circle. Give your answer to 1 decimal place.",
          answer: A.number(area, { units: "cm²", ...dp1 }),
          wrong: wrongs(area, [
            ...(p.useDiameter
              ? [
                  {
                    code: "GEO.CIRCLE.RADIUS-DIAMETER",
                    value: A.number(r1(Math.PI * 4 * p.r * p.r), { units: "cm²", ...dp1 }),
                    feedback: `Halve the diameter first: r = ${p.r} cm.`,
                  },
                ]
              : []),
            {
              code: "MEA.CIRCLE.FORMULA",
              value: A.number(C, { units: "cm²", ...dp1 }),
              feedback: "2πr is the circumference. The area is πr².",
            },
            {
              code: "MEA.CIRCLE.FORMULA",
              value: A.number(r1((Math.PI * p.r) ** 2), { units: "cm²", ...dp1 }),
              feedback: "Only the radius is squared: π × r².",
            },
          ]),
          solution: [{ say: `r = ${p.r} cm. A = πr² = π × ${p.r}² = ${area} cm² (1 d.p.).` }],
        });
      case 3:
        return A.matchRepresentations({
          rng,
          question: "Match each circle to its area, in terms of π.",
          pairs: p.radii.map(
            (r) =>
              [`radius ${r} cm`, A.math(`${r * r}\\pi\\text{ cm}^2`)] as [A.RichInput, A.RichInput],
          ),
          solution: [{ say: "Area = πr², so square the radius and keep the π." }],
        });
      case 4:
        return A.trueOrFalseWhy({
          rng,
          statement: `Kai says that if you double the radius of a circle, its area doubles too.`,
          truth: false,
          reasons: [
            {
              text: `False. The radius is squared, so the area is multiplied by 2² = 4. A radius of ${p.r} cm gives ${p.r * p.r}π cm²; a radius of ${2 * p.r} cm gives ${4 * p.r * p.r}π cm².`,
              correct: true,
            },
            {
              text: "True. Area goes up in the same way as the radius.",
              code: "RAT.SCALE.AREA-LINEAR",
            },
            {
              text: "True. The circumference doubles, so the area does too.",
              code: "RAT.SCALE.AREA-LINEAR",
            },
          ],
          solution: [{ say: "π(2r)² = 4πr², four times the area." }],
        });
      default: {
        const semi = r1((Math.PI * (p.w / 2) ** 2) / 2);
        const total = r1(p.w * p.h + (Math.PI * (p.w / 2) ** 2) / 2);
        return A.multiStepContext({
          context: ["A window is a rectangle with a semicircle on top.", A.figure(arch(p.w, p.h))],
          parts: [
            {
              ask: "Work out the area of the semicircle, to 1 decimal place.",
              answer: A.number(semi, { units: "m²", ...dp1 }),
              wrong: wrongs(semi, [
                {
                  code: "GEO.CIRCLE.RADIUS-DIAMETER",
                  value: A.number(r1((Math.PI * p.w * p.w) / 2), { units: "m²", ...dp1 }),
                  feedback: `The radius is half the width: ${p.w / 2} m.`,
                },
                {
                  code: "AS.MULTISTEP.ONE-STEP",
                  value: A.number(r1(Math.PI * (p.w / 2) ** 2), { units: "m²", ...dp1 }),
                  feedback: "That is a whole circle. Halve it for a semicircle.",
                },
              ]),
            },
            {
              ask: "Work out the total area of the window, to 1 decimal place.",
              answer: A.number(total, { units: "m²", ...dp1 }),
            },
          ],
          solution: [
            { say: `r = ${p.w / 2} m. Semicircle = ½ × π × ${p.w / 2}² = ${semi} m².` },
            { say: `Rectangle = ${p.w} × ${p.h} = ${p.w * p.h} m². Total ≈ ${total} m².` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const n = numberAnswer(question);
    if (question.archetype === "standard")
      return Math.abs(n - 2 * Math.PI * p.r) < 0.06 || Math.abs(n - Math.PI * p.r * p.r) < 0.06;
    if (question.archetype === "multi-step-context")
      return (
        Math.abs(numberAnswer(question, 1) - (p.w * p.h + (Math.PI * (p.w / 2) ** 2) / 2)) < 0.06
      );
    return true;
  },
});
