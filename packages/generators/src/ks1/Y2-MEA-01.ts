/**
 * @statement Y2-MEA-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y2-MEA-01: Choose and use appropriate standard units to estimate and measure length/height in any
// direction (m/cm); mass (kg/g); temperature (°C); capacity (litres/ml) to the nearest appropriate
// unit, using rulers, scales, thermometers and measuring vessels
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { RulerSpec, ScaleSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { countMarksReading, pickScale, ruler, scaleSpec, type Scale } from "../shared/mea.ts";

type Kind = "jug" | "thermometer" | "scales";

export interface Params {
  kind: Kind;
  scale: Scale;
  start: number;
  length: number;
  items: number[];
}

const UNIT: Record<Kind, [string, string, string]> = {
  jug: ["\\text{ml}", "ml", "How much water is in the jug?"],
  thermometer: ["^\\circ\\text{C}", "°C", "What temperature does the thermometer show?"],
  scales: ["\\text{g}", "g", "What is the mass of the flour on the scales?"],
};
const SENSIBLE: [string, string][] = [
  ["the height of a door", "2 m"],
  ["the length of a pencil", "15 cm"],
  ["the mass of a bag of potatoes", "2 kg"],
  ["the mass of an apple", "100 g"],
  ["the water in a bath", "100 litres"],
  ["the water in a cup", "200 ml"],
  ["the temperature on a hot day", "28 °C"],
];

export default defineGenerator<Params>({
  id: "Y2-MEA-01",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["MEA.SCALE.INTERVAL", "MEA.RULER.END"],

  params(rng, numbers) {
    const kind = rng.pick(["jug", "thermometer", "scales"] as const);
    const scale = pickScale(rng, numbers === "stretch" ? "standard" : numbers);
    if (countMarksReading(scale) === scale.reading) reject("a reading between numbered marks");
    const length = rng.int(3, numbers === "friendly" ? 8 : 11);
    const start = rng.int(1, 3);
    if (start + length > 14) reject("an object on the ruler");
    return { kind, scale, start, length, items: rng.shuffle([0, 1, 2, 3, 4, 5, 6]).slice(0, 3) };
  },

  build(p, depth, rng): QuestionDraft {
    const [unit, plainUnit, ask] = UNIT[p.kind];
    const spec = scaleSpec(p.kind, p.scale, unit);
    const interval = p.scale.step / p.scale.divisions;
    const slip = countMarksReading(p.scale);
    switch (depth) {
      case 1:
        return A.standard({
          question: [A.figure(spec)],
          ask,
          answer: A.number(p.scale.reading, { units: plainUnit }),
          wrong: wrongs(p.scale.reading, [
            {
              code: "MEA.SCALE.INTERVAL",
              value: A.number(slip, { units: plainUnit }),
              feedback: `Each small mark is worth ${interval}, not 1. Work it out: ${p.scale.step} ÷ ${p.scale.divisions} = ${interval}.`,
            },
          ]),
          solution: [
            {
              say: `There are ${p.scale.divisions} spaces between ${0} and ${p.scale.step}, so each mark is ${interval} ${plainUnit}. It shows ${p.scale.reading} ${plainUnit}.`,
            },
          ],
        });
      case 2: {
        const end = p.start + p.length;
        return A.standard({
          question: ["A ribbon lies along a ruler.", A.figure(ruler(15, p.start, end, false))],
          ask: "How long is the ribbon?",
          answer: A.number(p.length, { units: "cm" }),
          wrong: wrongs(p.length, [
            {
              code: "MEA.RULER.END",
              value: A.number(end, { units: "cm" }),
              feedback: `The ribbon starts at ${p.start}. Take that away: ${end} − ${p.start}.`,
            },
          ]),
          solution: [{ say: `${end} − ${p.start} = ${p.length} cm.` }],
        });
      }
      case 3:
        return A.matchRepresentations({
          rng,
          question: "Match each thing to a sensible measurement.",
          pairs: p.items.map((i) => SENSIBLE[i] as [A.RichInput, A.RichInput]),
          solution: [
            {
              say: "Think about the size of each unit: a centimetre is about the width of a finger; a metre is a big step.",
            },
          ],
        });
      default: {
        return A.trueOrFalseWhy({
          rng,
          statement: [
            A.figure(spec),
            `Ella says it shows ${slip} ${plainUnit}, because she counted on 1 for each small mark.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. The numbered marks go up in ${p.scale.step}s with ${p.scale.divisions} spaces between, so each small mark is ${interval}. It shows ${p.scale.reading} ${plainUnit}.`,
              correct: true,
            },
            { text: "True. Every small mark on a scale is worth 1.", code: "MEA.SCALE.INTERVAL" },
            { text: "True. You always count in 1s on a scale.", code: "MEA.SCALE.INTERVAL" },
          ],
          solution: [
            {
              say: `Work out what one small mark is worth first: ${p.scale.step} ÷ ${p.scale.divisions} = ${interval}.`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype !== "standard") return true;
    const fig = question.diagrams[0] as ScaleSpec | RulerSpec | undefined;
    if (fig?.instrument === "ruler") return numberAnswer(question) === p.length;
    return numberAnswer(question) === p.scale.reading && fig?.reading === p.scale.reading;
  },
});
