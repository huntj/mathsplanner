/**
 * @statement Y6-MEA-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-MEA-04: Recognise that shapes with the same areas can have different perimeters and vice versa
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  area: number;
  l: number;
  perimeterFirst: boolean;
}

/** Whole-number rectangles with this area, longest first. */
const rectangles = (area: number) => {
  const out: [number, number][] = [];
  for (let w = 1; w * w <= area; w++) if (area % w === 0) out.push([area / w, w]);
  return out;
};

export default defineGenerator<Params>({
  id: "Y6-MEA-04",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MEA.AREA.SAME-PERIMETER", "MEA.PERIMETER.AREA"],

  params(rng, numbers) {
    const area = rng.pick(numbers === "friendly" ? [12, 16, 18, 20] : [24, 30, 36, 40, 48]);
    const options = rectangles(area).filter(([l, w]) => l !== w && w >= 2);
    const pick = rng.pick(options);
    if (2 * (pick[0] + pick[1]) === area) reject("a perimeter that differs from the area");
    return { area, l: pick[0], perimeterFirst: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const w = p.area / p.l;
    const per = 2 * (p.l + w);
    const all = rectangles(p.area);
    switch (depth) {
      case 1: {
        const other = all.find(([l]) => l !== p.l) ?? [p.area, 1];
        return A.standard({
          question: `A rectangle has an area of ${p.area} cm² and a length of ${p.l} cm.`,
          ask: "What is its perimeter?",
          answer: A.number(per, { units: "cm" }),
          wrong: wrongs(per, [
            {
              code: "MEA.AREA.SAME-PERIMETER",
              value: A.number(2 * (other[0] + other[1]), { units: "cm" }),
              feedback: `That is the perimeter of a ${other[0]} by ${other[1]} rectangle, which has the same area but a different perimeter.`,
            },
            {
              code: "MEA.PERIMETER.AREA",
              value: A.number(p.area, { units: "cm" }),
              feedback: "The area and the perimeter are different measures.",
            },
          ]),
          solution: [
            {
              say: `Width = ${p.area} ÷ ${p.l} = ${w} cm. Perimeter = 2 × (${p.l} + ${w}) = ${per} cm.`,
            },
          ],
        });
      }
      case 2: {
        const best = all[all.length - 1] ?? [p.l, w];
        const label = ([l, x]: [number, number]) => `${l} cm by ${x} cm`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `Rectangles with whole-number sides have an area of ${p.area} cm².`,
          ask: "Which one has the smallest perimeter?",
          correct: label(best),
          distractors: all
            .filter(([l]) => l !== best[0])
            .slice(0, 3)
            .map((r) => ({
              content: label(r),
              code: "MEA.AREA.SAME-PERIMETER",
              feedback: `Same area, but its perimeter is ${2 * (r[0] + r[1])} cm. The closer to a square, the smaller the perimeter.`,
            })),
          solution: [
            {
              say: `Perimeters: ${all.map(([l, x]) => `${l} by ${x}: ${2 * (l + x)} cm`).join("; ")}.`,
            },
          ],
        });
      }
      default: {
        const [a, b] = all[0] ?? [p.area, 1];
        const [c, d] = all[all.length - 1] ?? [p.l, w];
        return p.perimeterFirst
          ? A.alwaysSometimesNever({
              rng,
              claim: "Two rectangles with the same area have the same perimeter.",
              truth: "sometimes",
              reasons: [
                {
                  text: `Sometimes. ${a} by ${b} and ${c} by ${d} both have area ${p.area} cm², but perimeters ${2 * (a + b)} cm and ${2 * (c + d)} cm. Only identical rectangles must match.`,
                  correct: true,
                },
                {
                  text: "Always. Area and perimeter go together.",
                  code: "MEA.AREA.SAME-PERIMETER",
                },
                { text: "Never. Rectangles with the same area can never have the same perimeter." },
              ],
              solution: [
                {
                  say: `Compare ${a} × ${b} and ${c} × ${d}: same area, different perimeters. A ${p.l} by ${w} rectangle and its copy turned round have the same of both.`,
                },
              ],
            })
          : A.alwaysSometimesNever({
              rng,
              claim: "Two rectangles with the same perimeter have the same area.",
              truth: "sometimes",
              reasons: [
                {
                  text: `Sometimes. ${p.l} by ${w} and ${p.l + 1} by ${w - 1} both have perimeter ${per} cm, but areas ${p.area} cm² and ${(p.l + 1) * (w - 1)} cm².`,
                  correct: true,
                },
                {
                  text: "Always. If the distance round is the same, the inside is the same.",
                  code: "MEA.AREA.SAME-PERIMETER",
                },
                { text: "Never. Different rectangles always have different perimeters." },
              ],
              solution: [
                { say: `Keep the perimeter at ${per} cm and change the sides: the area changes.` },
              ],
            });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return numberAnswer(question) === 2 * (p.l + p.area / p.l);
    if (question.archetype === "varied-form") {
      const all = rectangles(p.area);
      const best = all[all.length - 1] ?? [0, 0];
      return chosenText(question) === `${best[0]} cm by ${best[1]} cm`;
    }
    return p.area / p.l >= 2;
  },
});
