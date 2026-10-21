/**
 * @statement Y2-POS-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y2-POS-01: Order and arrange combinations of mathematical objects in patterns and sequences
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import {
  itemName,
  nextGuesses,
  pickUnit,
  repeat,
  row,
  type Item,
  type Kind,
} from "../shared/pat.ts";

interface Params {
  kind: Kind;
  unit: Item[];
  gap: number;
  ask: number;
  total: number;
}

export default defineGenerator<Params>({
  id: "Y2-POS-01",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: ["PAT.REPEAT.UNIT", "AS.MULTISTEP.ONE-STEP"],

  params(rng) {
    const kind = rng.pick(["ABB", "AAB", "ABC"] as const);
    return {
      kind,
      unit: pickUnit(rng, kind),
      gap: rng.int(2, 7),
      ask: rng.int(10, 15),
      total: rng.pick([12, 15, 18]),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const n = p.unit.length;
    switch (depth) {
      case 1: {
        const items = repeat(p.unit, 7);
        const right = p.unit[7 % n] as Item;
        return A.choice({
          rng,
          question: [
            "Look at the pattern.",
            A.figure(row([...items, null], "A repeating pattern of shapes with a gap at the end.")),
          ],
          ask: "What comes next?",
          correct: itemName(right),
          distractors: nextGuesses(p.unit, 7).map((g) => ({
            content: itemName(g),
            code: "PAT.REPEAT.UNIT",
            feedback: `The repeating part is ${p.unit.map(itemName).join(", ")}.`,
          })),
          solution: [{ say: `Next is a ${itemName(right)}.` }],
        });
      }
      case 2: {
        const items = repeat(p.unit, 9).map((it, i) => (i === p.gap ? null : it));
        const right = p.unit[p.gap % n] as Item;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "One shape is missing.",
            A.figure(row(items, "A repeating pattern of shapes with one gap.")),
          ],
          ask: "What goes in the gap?",
          correct: itemName(right),
          distractors: p.unit
            .filter(
              (u, i, all) =>
                itemName(u) !== itemName(right) &&
                all.findIndex((v) => itemName(v) === itemName(u)) === i,
            )
            .map((u) => ({
              content: itemName(u),
              code: "PAT.REPEAT.UNIT",
              feedback: "Count along the repeating part to the gap.",
            })),
          solution: [{ say: `The gap is a ${itemName(right)}.` }],
        });
      }
      case 4: {
        const truthItem = p.unit[(p.ask - 1) % n] as Item;
        const wrong = p.unit[(p.ask - 2 + n) % n] as Item;
        const truth = itemName(wrong) === itemName(truthItem);
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "The pattern keeps going.",
            A.figure(row(repeat(p.unit, n * 2), "A repeating pattern of shapes.")),
            `Sid says the ${p.ask}th shape is a ${itemName(wrong)}.`,
          ],
          truth,
          reasons: [
            {
              text: `${truth ? "True" : "False"}. The part repeats every ${n} shapes; counting on, the ${p.ask}th shape is a ${itemName(truthItem)}.`,
              correct: true,
            },
            {
              text: `${truth ? "False" : "True"}. Every shape in a pattern is the same.`,
              code: "PAT.REPEAT.UNIT",
            },
            {
              text: `${truth ? "False" : "True"}. You only need to look at the last shape you can see.`,
              code: "PAT.REPEAT.UNIT",
            },
          ],
          solution: [
            {
              say: `Shapes ${n}, ${2 * n}, ${3 * n}, … end a repeat. Count on from there to ${p.ask}.`,
            },
          ],
        });
      }
      default: {
        const a = p.unit[0] as Item;
        const perUnit = p.unit.filter((u) => itemName(u) === itemName(a)).length;
        const count = (p.total / n) * perUnit;
        return A.multiStepContext({
          context: [
            "Ella makes this pattern with exactly " + p.total + " shapes.",
            A.figure(row(repeat(p.unit, n * 2), "A repeating pattern of shapes.")),
          ],
          parts: [
            {
              ask: `How many times does the repeating part appear in ${p.total} shapes?`,
              answer: A.number(p.total / n),
              wrong: wrongs(p.total / n, [
                {
                  code: "PAT.REPEAT.UNIT",
                  value: A.number(p.total / (n === 3 ? 2 : 3)),
                  feedback: `The repeating part has ${n} shapes.`,
                },
              ]),
            },
            {
              ask: `How many ${itemName(a)}s are there?`,
              answer: A.number(count),
              wrong: wrongs(count, [
                {
                  code: "AS.MULTISTEP.ONE-STEP",
                  value: A.number(p.total / n),
                  feedback: `Each repeat has ${perUnit} ${itemName(a)}${perUnit === 1 ? "" : "s"}.`,
                },
              ]),
            },
          ],
          solution: [
            { say: `${p.total} ÷ ${n} = ${p.total / n} repeats.` },
            { say: `${p.total / n} × ${perUnit} = ${count} ${itemName(a)}s.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const n = p.unit.length;
    if (question.archetype === "standard")
      return chosenText(question) === itemName(p.unit[7 % n] as Item);
    if (question.archetype === "varied-form")
      return chosenText(question) === itemName(p.unit[p.gap % n] as Item);
    if (question.archetype === "multi-step-context") return numberAnswer(question) === p.total / n;
    return true;
  },
});
