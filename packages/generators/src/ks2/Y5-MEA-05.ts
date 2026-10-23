/**
 * @statement Y5-MEA-05
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-MEA-05: Estimate volume [for example, using 1 cm³ blocks to build cuboids (including cubes)]
// and capacity [for example, using water]
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { cuboid } from "../shared/mea.ts";

export interface Params {
  l: number;
  w: number;
  h: number;
  item: number;
  other: [number, number, number];
}

// [container, best estimate, too small, too big]
const CAPACITY: [string, string, string, string][] = [
  ["a mug", "300 ml", "3 ml", "30 litres"],
  ["a bucket", "10 litres", "10 ml", "1000 litres"],
  ["a teaspoon", "5 ml", "500 ml", "5 litres"],
  ["a bath", "150 litres", "150 ml", "15 000 litres"],
  ["a can of drink", "330 ml", "3 ml", "33 litres"],
];

export default defineGenerator<Params>({
  id: "Y5-MEA-05",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MEA.VOLUME.ADDS", "MEA.COMPARE.LOOKS"],

  params(rng, numbers) {
    const top = numbers === "friendly" ? 3 : 5;
    const l = rng.int(2, top + 1);
    const w = rng.int(2, top);
    const h = rng.int(1, top);
    if (l * w * h === l + w + h) reject("a volume that differs from the sum");
    const v = l * w * h;
    const others = [];
    for (let a = 1; a <= 8; a++)
      for (let b = 1; b <= a; b++)
        for (let c = 1; c <= b; c++)
          if (a + b + c !== l + w + h && (a * b * c === v || a * b * c === v + 2))
            others.push([a, b, c]);
    const other = (others.length ? rng.pick(others) : [l + 1, w, h]) as [number, number, number];
    return { l, w, h, item: rng.int(0, CAPACITY.length - 1), other };
  },

  build(p, depth, rng): QuestionDraft {
    const v = p.l * p.w * p.h;
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "This cuboid is made from 1 cm³ cubes.",
            A.figure(cuboid(p.l, p.w, p.h, "cm", true)),
          ],
          ask: "What is its volume?",
          answer: A.number(v, { units: "cm³" }),
          wrong: wrongs(v, [
            {
              code: "MEA.VOLUME.ADDS",
              value: A.number(p.l + p.w + p.h, { units: "cm³" }),
              feedback: `Count the cubes in one layer (${p.l} × ${p.w}) and multiply by the ${p.h} layers.`,
            },
            {
              code: "MEA.VOLUME.ADDS",
              value: A.number(p.l * p.h + p.w * p.h + p.l * p.w, { units: "cm³" }),
              feedback:
                "That counts only the faces you can see. Some cubes are hidden inside and behind.",
            },
          ]),
          solution: [
            {
              say: `Each layer has ${p.l} × ${p.w} = ${p.l * p.w} cubes, and there are ${p.h} layers: ${p.l * p.w} × ${p.h} = ${v} cm³.`,
            },
          ],
        });
      case 2: {
        const [thing, best, small, big] = (CAPACITY[p.item] ??
          CAPACITY[0]) as (typeof CAPACITY)[number];
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `Which is the best estimate for the capacity of ${thing}?`,
          correct: best,
          distractors: [
            {
              content: small,
              code: "MEA.COMPARE.LOOKS",
              feedback: "That is far too little. A teaspoon holds about 5 ml.",
            },
            {
              content: big,
              code: "MEA.COMPARE.LOOKS",
              feedback: "That is far too much. A large bottle of water holds about 2 litres.",
            },
          ],
          solution: [{ say: `${thing[0]?.toUpperCase()}${thing.slice(1)} holds about ${best}.` }],
        });
      }
      default: {
        const [a, b, c] = p.other;
        const w2 = a * b * c;
        const truth = w2 === v;
        return A.trueOrFalseWhy({
          rng,
          statement: `Cuboid P is made of 1 cm³ cubes, ${p.l} by ${p.w} by ${p.h}. Cuboid Q is ${a} by ${b} by ${c}. Dan says they have the same volume.`,
          truth,
          reasons: [
            {
              text: `${truth ? "True" : "False"}. P is ${p.l} × ${p.w} × ${p.h} = ${v} cm³ and Q is ${a} × ${b} × ${c} = ${w2} cm³.`,
              correct: true,
            },
            {
              text: `${truth ? "False" : "True"}. Add the edges: ${p.l + p.w + p.h} and ${a + b + c}.`,
              code: "MEA.VOLUME.ADDS",
            },
            {
              text: `${truth ? "False" : "True"}. Cuboids that look different always have different volumes.`,
              code: "MEA.COMPARE.LOOKS",
            },
          ],
          solution: [{ say: `Volume = length × width × height. P: ${v} cm³. Q: ${w2} cm³.` }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return numberAnswer(question) === p.l * p.w * p.h;
    if (question.archetype === "varied-form")
      return (
        chosenText(question) === ((CAPACITY[p.item] ?? CAPACITY[0]) as (typeof CAPACITY)[number])[1]
      );
    return true;
  },
});
