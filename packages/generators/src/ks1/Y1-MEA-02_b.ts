/**
 * @statement Y1-MEA-02.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y1-MEA-02.b: Measure mass
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { countMarksReading, pickScale, scaleSpec, type Scale } from "../shared/mea.ts";

interface Params {
  scale: Scale;
  item: number;
  cubes: number;
}

export default defineGenerator<Params>({
  id: "Y1-MEA-02.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MEA.SCALE.INTERVAL", "AS.PROBLEM.KEYWORD"],

  params(rng) {
    const scale = pickScale(rng, "friendly");
    return { scale, item: rng.int(3, 9), cubes: rng.int(2, 8) };
  },

  build(p, depth, rng): QuestionDraft {
    const s = p.scale;
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "A bag of flour is on the scales.",
            A.figure(scaleSpec("scales", s, "\\text{kg}")),
          ],
          ask: "How heavy is the bag?",
          answer: A.number(s.reading, { units: "kg" }),
          wrong: wrongs(s.reading, [
            {
              code: "MEA.SCALE.INTERVAL",
              value: A.number(countMarksReading(s), { units: "kg" }),
              feedback: `Work out what each small mark is worth first: ${s.step} kg shared into ${s.divisions} spaces.`,
            },
          ]),
          solution: [
            {
              say: `Each small mark is ${s.step / s.divisions} kg. The pointer is at ${s.reading} kg.`,
            },
          ],
        });
      case 2: {
        const total = p.item + p.cubes;
        return A.standard({
          question: `A balance is level. One side has a toy and ${p.cubes} cubes. The other side has ${total} cubes.`,
          ask: "How many cubes does the toy weigh?",
          answer: A.number(p.item),
          wrong: wrongs(p.item, [
            {
              code: "AS.PROBLEM.KEYWORD",
              value: A.number(total + p.cubes),
              feedback: `The toy and ${p.cubes} cubes balance ${total} cubes, so the toy is ${total} − ${p.cubes}.`,
            },
          ]),
          solution: [
            {
              say: `${total} − ${p.cubes} = ${p.item}, so the toy weighs the same as ${p.item} cubes.`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "A parcel is on the scales.",
            A.figure(
              scaleSpec("scales", { max: 20, step: 10, divisions: 5, reading: 14 }, "\\text{kg}"),
            ),
            "Ola counts the small marks after 10 in ones and says the parcel weighs 12 kg.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. There are 5 spaces between 10 and 20, so each mark is 2 kg. The parcel weighs 14 kg.",
              correct: true,
            },
            { text: "True. Every small mark is worth 1.", code: "MEA.SCALE.INTERVAL" },
            { text: "True. You always count the marks in ones.", code: "MEA.SCALE.INTERVAL" },
          ],
          solution: [{ say: "Work out what each mark is worth before you read a scale." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.scale.reading;
    if (question.key.depth === 2) return numberAnswer(question) === p.item;
    return true;
  },
});
