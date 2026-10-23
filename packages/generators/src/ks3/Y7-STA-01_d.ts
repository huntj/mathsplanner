/**
 * @statement Y7-STA-01.d
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-STA-01.d: Compare distributions using averages and range
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

interface Params {
  meanA: number;
  meanB: number;
  rangeA: number;
  rangeB: number;
  bFirst: boolean;
}

export default defineGenerator<Params>({
  id: "Y7-STA-01.d",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.RANGE.HIGHER-BETTER", "STA.COMPARE"],

  params(rng) {
    const meanA = rng.int(12, 30);
    const rangeA = rng.int(4, 12);
    return {
      meanA,
      meanB: meanA + rng.int(2, 8),
      rangeA,
      rangeB: rangeA + rng.int(3, 10),
      bFirst: rng.bool(),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const stem = `Two teams play darts. Team Red has a mean score of ${p.meanA} and a range of ${p.rangeA}. Team Blue has a mean of ${p.meanB} and a range of ${p.rangeB}.`;
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [stem],
          ask: "Which team scored higher on average?",
          correct: "Team Blue",
          distractors: [
            {
              content: "Team Red",
              code: "STA.RANGE.HIGHER-BETTER",
              feedback: "Compare the means for the average; the range only shows spread.",
            },
            {
              content: "You cannot tell",
              feedback: "The mean is an average: compare the two means.",
            },
          ],
          solution: [{ say: `Blue's mean, ${p.meanB}, is higher than Red's, ${p.meanA}.` }],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [stem],
          ask: "Which team's scores were more consistent?",
          correct: "Team Red",
          distractors: [
            {
              content: "Team Blue",
              code: "STA.RANGE.HIGHER-BETTER",
              feedback: "A bigger range means the scores were more spread out, so less consistent.",
            },
            { content: "Both the same", feedback: "The ranges are different." },
          ],
          solution: [
            { say: `Red's smaller range, ${p.rangeA}, means its scores were closer together.` },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Team Red's best score was higher than Team Blue's best. Sid says this proves Team Red did better overall.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. One high score says little; compare an average, where Blue's mean of ${p.meanB} beats Red's ${p.meanA}.`,
              correct: true,
            },
            {
              text: "True. The team with the highest score always did better.",
              code: "STA.COMPARE",
            },
            { text: "True. A bigger range means better scores.", code: "STA.RANGE.HIGHER-BETTER" },
          ],
          solution: [{ say: "Compare an average and a measure of spread, not single values." }],
        });
    }
  },

  verify(_p, question) {
    if (question.key.depth === 1) return chosenText(question) === "Team Blue";
    if (question.key.depth === 2) return chosenText(question) === "Team Red";
    return true;
  },
});
