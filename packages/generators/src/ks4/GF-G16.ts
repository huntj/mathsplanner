/**
 * @statement GF-G16
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-G16: Know and apply formulae to calculate: area of triangles, parallelograms, trapezia; volume
// of cuboids and other right prisms (including cylinders)
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { trapezium } from "../shared/mea.ts";
import { cylinder } from "../shared/solids.ts";

interface Params {
  a: number;
  b: number;
  h: number;
  offset: number;
  r: number;
  ch: number;
  len: number;
}

const r1 = (x: number) => Math.round(x * 10) / 10;
const dp1 = { accuracy: { dp: 1 } } as const;

export default defineGenerator<Params>({
  id: "GF-G16",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: ["MEA.AREA.TRAPEZIUM-HALF", "MEA.CIRCLE.FORMULA", "MEA.VOLUME.ADDS"],

  params(rng) {
    const b = rng.int(6, 16);
    const a = rng.int(2, b - 2);
    const h = rng.int(3, 12);
    const offset = rng.int(1, Math.max(1, b - a - 1));
    if (offset + a > b || h > 1.5 * b || h * 2.5 < b) reject("a trapezium that looks like one");
    const r = rng.int(2, 9);
    const ch = rng.int(4, 20);
    if (ch > 4 * r || r > 3 * ch) reject("a sensible cylinder");
    return { a, b, h, offset, r, ch, len: rng.int(5, 20) };
  },

  build(p, depth, rng): QuestionDraft {
    const area = ((p.a + p.b) / 2) * p.h;
    switch (depth) {
      case 1:
        return A.standard({
          question: [A.figure(trapezium(p.a, p.b, p.h, p.offset))],
          ask: "Work out the area of the trapezium.",
          answer: A.number(area, { units: "cm²" }),
          wrong: wrongs(area, [
            {
              code: "MEA.AREA.TRAPEZIUM-HALF",
              value: A.number((p.a + p.b) * p.h),
              feedback: "Area = ½(a + b)h.",
            },
          ]),
          solution: [{ say: `½ × (${p.a} + ${p.b}) × ${p.h} = ${area} cm².` }],
        });
      case 2: {
        const v = r1(Math.PI * p.r * p.r * p.ch);
        return A.standard({
          question: [
            `A cylinder has radius ${p.r} cm and height ${p.ch} cm.`,
            A.figure(cylinder(p.r, p.ch)),
          ],
          ask: "Work out its volume, to 1 decimal place.",
          answer: A.number(v, { units: "cm³", ...dp1 }),
          wrong: wrongs(v, [
            {
              code: "MEA.CIRCLE.FORMULA",
              value: A.number(r1(2 * Math.PI * p.r * p.ch), dp1),
              feedback: "The cross-section's area is πr², not 2πr.",
            },
          ]),
          solution: [{ say: `V = πr²h = π × ${p.r}² × ${p.ch} = ${v} cm³.` }],
        });
      }
      case 4:
        return A.trueOrFalseWhy({
          rng,
          statement:
            "Ola says the volume of any right prism is the area of its cross-section multiplied by its length.",
          truth: true,
          reasons: [
            {
              text: "True. A prism has the same cross-section all the way along, so its volume is cross-section area × length; a cylinder is a prism with a circular cross-section.",
              correct: true,
            },
            {
              text: "False. Only cuboids work like that; other prisms need length × width × height.",
              code: "MEA.VOLUME.ADDS",
            },
            { text: "False. You must add the three dimensions." },
          ],
          solution: [{ say: "V = A × l for every prism, including cylinders (A = πr²)." }],
        });
      default: {
        const v = area * p.len;
        return A.multiStepContext({
          context: [
            "A trough is a prism. Its cross-section is this trapezium, and it is ",
            A.math(`${p.len}\\text{ cm}`),
            " long.",
            A.figure(trapezium(p.a, p.b, p.h, p.offset)),
          ],
          parts: [
            {
              ask: "Work out the area of the cross-section.",
              answer: A.number(area, { units: "cm²" }),
              wrong: wrongs(area, [
                {
                  code: "MEA.AREA.TRAPEZIUM-HALF",
                  value: A.number((p.a + p.b) * p.h),
                  feedback: "Halve: ½(a + b)h.",
                },
              ]),
            },
            { ask: "Work out the volume of the trough.", answer: A.number(v, { units: "cm³" }) },
          ],
          solution: [
            { say: `Area = ${area} cm².` },
            { say: `Volume = ${area} × ${p.len} = ${v} cm³.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const area = ((p.a + p.b) / 2) * p.h;
    if (question.archetype === "multi-step-context")
      return numberAnswer(question, 1) === area * p.len;
    if (question.archetype === "standard") {
      const n = numberAnswer(question);
      return n === area || Math.abs(n - Math.PI * p.r * p.r * p.ch) < 0.06;
    }
    return true;
  },
});
