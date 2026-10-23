/**
 * @statement R-PAT-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the early years sub-statements
 */
// R-PAT-01.a: Explore odd and even numbers to 10
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import type { CountersSpec } from "@mathsplanner/diagrams";
import { chosenFigure, chosenText, objects } from "../shared/counting.ts";
import { array } from "../shared/md.ts";

interface Params {
  n: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "R-PAT-01.a",
  version: "1.0.0",
  depths: [1, 3, 4],
  misconceptions: ["PAT.EVEN-ODD"],

  params(rng) {
    return { n: rng.int(1, 10), k: rng.int(2, 5) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = p.n % 2 === 0 ? "Even" : "Odd";
        return A.choice({
          rng,
          question: [`Is ${p.n} odd or even?`, A.figure(objects(p.n, { arrangement: "dice" }))],
          correct: right,
          distractors: [
            {
              content: right === "Even" ? "Odd" : "Even",
              code: "PAT.EVEN-ODD",
              feedback: "Put the counters into pairs. If one is left over, the number is odd.",
            },
          ],
          solution: [
            {
              say: `${p.n} ${p.n % 2 === 0 ? "makes pairs with none left over: even." : "makes pairs with one left over: odd."}`,
            },
          ],
        });
      }
      case 3:
        return A.chooseTheDiagram({
          rng,
          question: ["Which picture shows an even number of counters?"],
          correct: array(2, p.k),
          distractors: [
            {
              figure: objects(2 * p.k + 1),
              code: "PAT.EVEN-ODD",
              feedback: `${2 * p.k + 1} counters make pairs with one left over, so it is odd.`,
            },
          ],
          solution: [{ say: `${2 * p.k} counters in 2 equal rows: even.` }],
        });
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["An even number of sweets can be shared equally between 2 children."],
          truth: "always",
          reasons: [
            {
              text: "Always. Even numbers make pairs with none left over, so each child gets one from every pair.",
              correct: true,
            },
            { text: "Sometimes. Only small numbers.", code: "PAT.EVEN-ODD" },
            { text: "Never. There is always one left.", code: "PAT.EVEN-ODD" },
          ],
          solution: [{ say: "Even: share fairly between 2. Odd: one left over." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === (p.n % 2 === 0 ? "Even" : "Odd");
    if (question.key.depth === 3)
      return (chosenFigure(question) as CountersSpec | undefined)?.layout === "array";
    return true;
  },
});
