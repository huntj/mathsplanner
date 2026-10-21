/**
 * @statement N-PAT-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// N-PAT-01: Talk about and identify the patterns around me, e.g. stripes on clothes
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import type { CountersSpec } from "@mathsplanner/diagrams";
import { chosenFigure, chosenText } from "../shared/counting.ts";
import { itemName, pickUnit, repeat, row, sameItem, type Item } from "../shared/pat.ts";

interface Params {
  kind: "AB" | "ABB" | "ABC";
  thing: number;
  unit: Item[];
}

const THINGS: [string, string][] = [
  ["a stripy jumper", "red, blue, red, blue"],
  ["a zebra", "black, white, black, white"],
  ["a fence", "post, gap, post, gap"],
  ["a necklace", "big bead, small bead, big bead, small bead"],
];

export default defineGenerator<Params>({
  id: "N-PAT-01",
  version: "1.0.0",
  depths: [1, 3, 4],
  misconceptions: ["PAT.REPEAT.UNIT"],

  params(rng) {
    const kind = rng.pick(["AB", "ABB", "ABC"] as const);
    return { kind, thing: rng.int(0, THINGS.length - 1), unit: pickUnit(rng, kind) };
  },

  build(p, depth, rng): QuestionDraft {
    const unit = p.unit;
    const items = repeat(unit, unit.length * 3);
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [
            "Look at the pattern.",
            A.figure(row(items, "A row of shapes in a repeating pattern.")),
          ],
          ask: "Which part keeps repeating?",
          correct: unit.map(itemName).join(", "),
          distractors: [
            {
              content: itemName(unit[0] as Item),
              code: "PAT.REPEAT.UNIT",
              feedback: "That is only the first shape. Find the group that comes again and again.",
            },
            {
              content: [...unit, unit[0] as Item].map(itemName).join(", "),
              code: "PAT.REPEAT.UNIT",
              feedback: "That group is too long: it starts to repeat itself.",
            },
          ],
          solution: [{ say: `${unit.map(itemName).join(", ")} — then it starts again.` }],
        });
      case 3: {
        // A jumbled row of the same shapes is not a repeating pattern.
        const jumbled = [...items];
        for (let i = 0; i < 3; i++) {
          const a = rng.int(0, jumbled.length - 1);
          const b = rng.int(0, jumbled.length - 1);
          [jumbled[a], jumbled[b]] = [jumbled[b] as Item, jumbled[a] as Item];
        }
        const isPattern = (list: Item[]) =>
          list.every((it, i) => sameItem(it, unit[i % unit.length]));
        if (isPattern(jumbled)) [jumbled[0], jumbled[1]] = [jumbled[1] as Item, jumbled[0] as Item];
        return A.chooseTheDiagram({
          rng,
          question: ["Which row is a repeating pattern?"],
          correct: row(items, "A row of shapes."),
          distractors: [
            {
              figure: row(jumbled, "A row of shapes."),
              code: "PAT.REPEAT.UNIT",
              feedback: "In that row the shapes do not come round in the same order each time.",
            },
          ],
          solution: [
            {
              say: "In a repeating pattern, the same group comes again and again in the same order.",
            },
          ],
        });
      }
      default: {
        const [thing, colours] = THINGS[p.thing] as (typeof THINGS)[number];
        return A.trueOrFalseWhy({
          rng,
          statement: `Kit says ${thing} has a pattern: ${colours}.`,
          truth: true,
          reasons: [
            {
              text: "True. The same group comes again and again, in the same order.",
              correct: true,
            },
            { text: "False. Patterns only happen in maths books.", code: "PAT.REPEAT.UNIT" },
            { text: "False. A pattern has to use numbers." },
          ],
          solution: [{ say: "Patterns are all around us: stripes, beads and fences repeat." }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "choose-the-diagram") {
      const g = chosenFigure(question) as CountersSpec | undefined;
      if (g?.layout !== "pattern") return false;
      const len = p.kind === "AB" ? 2 : 3;
      return g.items.every((it, i) => JSON.stringify(it) === JSON.stringify(g.items[i % len]));
    }
    if (question.archetype === "standard")
      return chosenText(question) === p.unit.map(itemName).join(", ");
    return true;
  },
});
