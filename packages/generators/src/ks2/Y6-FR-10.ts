/**
 * @statement Y6-FR-10
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-FR-10: Solve problems which require answers to be rounded to specified degrees of accuracy
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** Depth 1: £total shared between `people`, to the nearest penny. */
  total: number;
  people: number;
  /** Depth 2: a length in metres cut into `pieces`, to one decimal place. */
  length: number;
  pieces: number;
}

const round = (x: number, dp: number) => Math.round(x * 10 ** dp) / 10 ** dp;
const down = (x: number, dp: number) => Math.floor(x * 10 ** dp) / 10 ** dp;

export default defineGenerator<Params>({
  id: "Y6-FR-10",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.ROUND.ALWAYS-DOWN", "NPV.ROUND.WRONG-PLACE"],

  params(rng, numbers) {
    const people = rng.pick([3, 6, 7, 9, 11]);
    const total = rng.int(10, numbers === "stretch" ? 500 : 100);
    const pieces = rng.pick([3, 6, 7, 9]);
    const length = rng.int(5, numbers === "friendly" ? 20 : 50);
    const share = total / people;
    const piece = length / pieces;
    if (round(share, 2) === down(share, 2) || round(piece, 1) === down(piece, 1))
      reject("answers that round up");
    if (Number.isInteger(share * 100) || Number.isInteger(piece * 10))
      reject("answers that need rounding");
    return { total, people, length, pieces };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const exact = p.total / p.people;
        const answer = round(exact, 2);
        return A.standard({
          question: `£${p.total} is shared equally between ${p.people} people.`,
          ask: "How much does each person get, to the nearest penny?",
          answer: A.number(answer),
          wrong: wrongs(answer, [
            {
              code: "NPV.ROUND.ALWAYS-DOWN",
              value: A.number(down(exact, 2)),
              feedback: "Look at the third decimal place to decide whether to round up.",
            },
            {
              code: "NPV.ROUND.WRONG-PLACE",
              value: A.number(round(exact, 1)),
              feedback: "The nearest penny is two decimal places of a pound.",
            },
          ]),
          solution: [
            {
              say: `£${p.total} ÷ ${p.people} = £${exact.toFixed(4)}…, which is £${answer.toFixed(2)} to the nearest penny.`,
            },
          ],
        });
      }
      case 2: {
        const exact = p.length / p.pieces;
        const answer = round(exact, 1);
        return A.variedForm({
          rng,
          forms: [
            {
              question: `A rope ${p.length} m long is cut into ${p.pieces} equal pieces.`,
              ask: "How long is each piece, to one decimal place?",
            },
            {
              question: `${p.pieces} children share a ${p.length} km walk equally, in relay legs.`,
              ask: "How long is each leg, in kilometres, to one decimal place?",
            },
          ],
          answer: A.number(answer),
          wrong: wrongs(answer, [
            {
              code: "NPV.ROUND.ALWAYS-DOWN",
              value: A.number(down(exact, 1)),
              feedback: "Look at the hundredths digit to decide whether to round up.",
            },
          ]),
          solution: [
            {
              say: `${p.length} ÷ ${p.pieces} = ${exact.toFixed(3)}…, which is ${answer.toFixed(1)} to one decimal place.`,
            },
          ],
        });
      }
      default: {
        // Rounding too early: each share rounded, then multiplied back up, misses the total.
        const each = round(p.length / p.pieces, 1);
        const back = round(each * p.pieces, 1);
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `A rope ${p.length} m long is cut into ${p.pieces} equal pieces. Each is ${each} m to one decimal place. Dan says ${p.pieces} pieces of ${each} m make exactly ${back} m, so the rope was ${back} m long.`,
          ],
          truth: back === p.length,
          reasons: [
            {
              text: `False. ${each} m is rounded. The real pieces are ${(p.length / p.pieces).toFixed(3)}… m, and ${p.pieces} of them make exactly ${p.length} m. Round only at the end.`,
              correct: true,
            },
            {
              text: "True. Rounded numbers give exact answers when you multiply them.",
              code: "NPV.ROUND.WRONG-PLACE",
            },
            { text: "True. Rounding never changes a total." },
          ],
          solution: [
            {
              say: `${p.pieces} × ${each} = ${back}, not ${p.length}: the rounding error is multiplied by ${p.pieces}.`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return Math.abs(numberAnswer(question) - p.total / p.people) <= 0.005 + 1e-9;
    if (question.archetype === "varied-form")
      return Math.abs(numberAnswer(question) - p.length / p.pieces) <= 0.05 + 1e-9;
    return Math.abs(round(p.length / p.pieces, 1) * p.pieces - p.length) > 1e-9;
  },
});
