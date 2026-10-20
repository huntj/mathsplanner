/**
 * @statement Y2-NPV-06
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y2-NPV-06: Use place value and number facts to solve problems
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { countOf, numberAnswer, placeValue } from "../shared/counting.ts";

interface Params {
  tens: number;
  ones: number;
  /** Depth 5: boxes sold or added. */
  change: number;
  thing: { box: string; item: string };
}

const THINGS = [
  { box: "box", item: "eggs" },
  { box: "pack", item: "pencils" },
  { box: "bag", item: "marbles" },
  { box: "tube", item: "sweets" },
];

export default defineGenerator<Params>({
  id: "Y2-NPV-06",
  version: "1.0.0",
  depths: [1, 2, 5],
  misconceptions: ["NPV.PLACE.FACE-VALUE", "NPV.PLACE.DIGIT-ORDER"],

  params(rng, numbers) {
    return {
      tens: rng.int(numbers === "friendly" ? 2 : 3, numbers === "stretch" ? 8 : 6),
      ones: rng.int(1, 9),
      change: rng.int(1, 2),
      thing: rng.pick(THINGS),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const n = p.tens * 10 + p.ones;
    const wrong = wrongs(n, [
      {
        code: "NPV.PLACE.FACE-VALUE",
        value: A.number(p.tens + p.ones),
        feedback: "Each full one holds 10, so count the full ones in tens.",
      },
      ...(p.tens !== p.ones
        ? [
            {
              code: "NPV.PLACE.DIGIT-ORDER",
              value: A.number(p.ones * 10 + p.tens),
              feedback: "Write the tens digit first.",
            },
          ]
        : []),
    ]);
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "Some tens and ones are shown.",
            A.figure(placeValue(n, { style: "blocks", hidden: true })),
          ],
          ask: "What number is shown?",
          answer: A.number(n),
          wrong,
          solution: [{ say: `${p.tens} tens and ${p.ones} ones make ${n}.` }],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: `A ${p.thing.box} holds 10 ${p.thing.item}. There are ${p.tens} full ${p.thing.box}s and ${p.ones} loose ${p.thing.item}.`,
              ask: `How many ${p.thing.item} are there altogether?`,
            },
            { question: `${p.ones} ones and ${p.tens} tens.`, ask: "What number is that?" },
          ],
          answer: A.number(n),
          wrong,
          solution: [{ say: `${p.tens} tens is ${p.tens * 10}; add ${p.ones} more to make ${n}.` }],
        });
      default: {
        const after = n - p.change * 10;
        return A.multiStepContext({
          context: `A shop has ${p.tens} full ${p.thing.box}s of 10 ${p.thing.item} and ${p.ones} loose ${p.thing.item}.`,
          parts: [
            { ask: `How many ${p.thing.item} does the shop have?`, answer: A.number(n), wrong },
            {
              ask: `The shop sells ${p.change} full ${p.thing.box}${p.change > 1 ? "s" : ""}. How many ${p.thing.item} are left?`,
              answer: A.number(after),
              wrong: wrongs(after, [
                {
                  code: "NPV.PLACE.FACE-VALUE",
                  value: A.number(n - p.change),
                  feedback: `Each ${p.thing.box} holds 10, so selling ${p.change} takes away ${p.change * 10}.`,
                },
              ]),
            },
          ],
          solution: [
            { say: `${p.tens} tens and ${p.ones} ones make ${n}.` },
            {
              say: `Selling ${p.change} ${p.thing.box}${p.change > 1 ? "s" : ""} takes away ${p.change} ten${p.change > 1 ? "s" : ""}: ${n} − ${p.change * 10} = ${after}.`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const n = p.tens * 10 + p.ones;
    if (question.archetype === "multi-step-context")
      return numberAnswer(question, 0) === n && numberAnswer(question, 1) === n - 10 * p.change;
    if (question.diagrams.length > 0)
      return numberAnswer(question) === countOf(question.diagrams[0]);
    return numberAnswer(question) === n;
  },
});
