/**
 * @statement R-NPV-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// R-NPV-03: Link the numeral with its cardinal value
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenText, countOf, tenFrames } from "../shared/counting.ts";

interface Params {
  n: number;
  set: number[];
}

export default defineGenerator<Params>({
  id: "R-NPV-03",
  version: "1.0.0",
  depths: [1, 3],
  misconceptions: ["NPV.COUNT.SKIP-OR-DOUBLE"],

  params(rng, numbers) {
    const [low, high] =
      numbers === "friendly" ? [1, 6] : numbers === "standard" ? [3, 10] : [5, 10];
    const pool = Array.from({ length: high - low + 1 }, (_, i) => low + i);
    return { n: rng.pick(pool), set: rng.sample(pool, 3) };
  },

  build(p, depth, rng): QuestionDraft {
    if (depth === 1) {
      const others = [p.n + 1, p.n - 1, p.n + 2].filter((m) => m >= 0 && m !== p.n).slice(0, 3);
      return A.choice({
        rng,
        question: ["Look at the ten frame.", A.figure(tenFrames(p.n, { hidden: true }))],
        ask: "Which number shows how many counters?",
        correct: A.math(String(p.n)),
        distractors: others.map((m) => ({
          content: A.math(String(m)),
          ...(Math.abs(m - p.n) === 1
            ? {
                code: "NPV.COUNT.SKIP-OR-DOUBLE",
                feedback: "Count the counters again, one at a time.",
              }
            : {}),
        })),
        solution: [
          {
            say: `There are ${p.n} counters${p.n > 5 ? `: a full row of 5 and ${p.n - 5} more` : ""}, so the number is ${p.n}.`,
          },
        ],
      });
    }
    return A.matchRepresentations({
      rng,
      question: "Match each ten frame to its number.",
      pairs: p.set.map(
        (m) =>
          [A.figure(tenFrames(m, { hidden: true })), A.math(String(m))] as [
            A.RichInput,
            A.RichInput,
          ],
      ),
      solution: [{ say: "A full row in a ten frame is 5, so count on from 5 for the second row." }],
    });
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return chosenText(question) === String(countOf(question.diagrams[0]));
    return new Set(p.set).size === 3;
  },
});
