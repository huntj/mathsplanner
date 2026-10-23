/**
 * @statement Y6-GEO-03.d
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y6-GEO-03.d: Find unknown angles in regular polygons
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { regularPolygon } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

const NAMES: Record<number, string> = {
  5: "pentagon",
  6: "hexagon",
  8: "octagon",
  10: "decagon",
  12: "dodecagon",
};

interface Params {
  n: number;
}

export default defineGenerator<Params>({
  id: "Y6-GEO-03.d",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.POLYGON.SUM-N-TIMES-180", "GEO.POLYGON.INTERIOR-EXTERIOR"],

  params(rng, numbers) {
    return {
      n: rng.pick(
        numbers === "friendly" ? [5, 6] : numbers === "standard" ? [5, 6, 8] : [8, 10, 12],
      ),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const name = NAMES[p.n] ?? "polygon";
    const sum = (p.n - 2) * 180;
    const each = sum / p.n;
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            `The angles inside a ${name} add up to ${sum}°. This is a regular ${name}.`,
            A.figure(regularPolygon(p.n)),
          ],
          ask: "What is the size of each angle inside it?",
          answer: A.degrees(each),
          wrong: wrongs(each, [
            {
              code: "GEO.POLYGON.INTERIOR-EXTERIOR",
              value: A.degrees(360 / p.n),
              feedback: `${360 / p.n}° is the turn at each corner as you walk round. Share the inside total, ${sum}°, between ${p.n} angles.`,
            },
          ]),
          solution: [{ say: `${sum}° ÷ ${p.n} = ${each}°.` }],
        });
      case 2:
        return A.standard({
          question: [
            `A ${name} can be split into ${p.n - 2} triangles from one corner.`,
            A.figure(regularPolygon(p.n)),
          ],
          ask: "What do the angles inside it add up to?",
          answer: A.degrees(sum),
          wrong: wrongs(sum, [
            {
              code: "GEO.POLYGON.SUM-N-TIMES-180",
              value: A.degrees(180 * p.n),
              feedback: `There are ${p.n - 2} triangles, not ${p.n}.`,
            },
          ]),
          solution: [{ say: `${p.n - 2} × 180° = ${sum}°.` }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `Omar says each angle inside a regular ${name} is 180°, because the angles add up to ${p.n} × 180°.`,
          truth: false,
          reasons: [
            {
              text: `False. A ${name} splits into ${p.n - 2} triangles, so the angles add up to ${sum}° and each is ${each}°.`,
              correct: true,
            },
            {
              text: `True. A shape with ${p.n} sides has ${p.n} triangles inside it.`,
              code: "GEO.POLYGON.SUM-N-TIMES-180",
            },
            {
              text: "True. Every angle in a polygon is 180°.",
              code: "GEO.POLYGON.SUM-N-TIMES-180",
            },
          ],
          solution: [{ say: `(${p.n} − 2) × 180° = ${sum}°, and ${sum}° ÷ ${p.n} = ${each}°.` }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === ((p.n - 2) * 180) / p.n;
    if (question.key.depth === 2) return numberAnswer(question) === (p.n - 2) * 180;
    return true;
  },
});
