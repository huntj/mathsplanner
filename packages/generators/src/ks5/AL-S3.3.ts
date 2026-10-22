/**
 * @statement AL-S3.3
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-S3.3: Model with probability and critique assumptions
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";

interface Params {
  n: number;
  days: number;
  rainy: number;
}

export default defineGenerator<Params>({
  id: "AL-S3.3",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.MODEL.ASSUMPTION"],

  params(rng) {
    return { n: rng.int(10, 30), days: rng.int(8, 15), rainy: rng.int(2, 6) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: `A basketball player takes ${p.n} free throws. The number she scores is modelled by a binomial distribution.`,
          ask: "Which assumption does this model make?",
          correct:
            "Each throw is independent of the others and has the same probability of scoring.",
          distractors: [
            {
              content: "She scores exactly half of her throws.",
              code: "PRO.MODEL.ASSUMPTION",
              feedback: "The probability need not be ½; it must be the same for every throw.",
            },
            {
              content: "Her probability of scoring improves as she warms up.",
              code: "PRO.MODEL.ASSUMPTION",
              feedback: "That would break the binomial model, which needs a constant probability.",
            },
          ],
          solution: [
            {
              say: "A binomial model needs a fixed number of independent trials, each with the same probability of success.",
            },
          ],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `It rained on ${p.rainy} of the last ${p.days} days. Kai models the chance of rain tomorrow as ${p.rainy}/${p.days}.`,
          ask: "What is the main weakness of this model?",
          correct:
            "It is based on very few days, and the weather on one day is not independent of the next.",
          distractors: [
            {
              content: `The probability should be ${p.days - p.rainy}/${p.days}.`,
              code: "PRO.MODEL.ASSUMPTION",
              feedback: "That is the chance of no rain.",
            },
            {
              content: "There is no weakness: past data always predict the future.",
              code: "PRO.MODEL.ASSUMPTION",
              feedback: "Small samples and dependence between days make the estimate unreliable.",
            },
          ],
          solution: [
            {
              say: "Critique the data used and the assumptions (independence, constant probability) behind the model.",
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `A model says the probability that a seed germinates is 0.8. Max plants ${p.n} seeds and says exactly ${0.8 * p.n} will germinate.`,
          truth: false,
          reasons: [
            {
              text: `False. ${0.8 * p.n} is the expected number; the actual number varies, and the model's probability is itself only an estimate.`,
              correct: true,
            },
            {
              text: "True. A probability model gives exact results.",
              code: "PRO.MODEL.ASSUMPTION",
            },
            { text: "True. 80% of the seeds always germinate.", code: "PRO.MODEL.ASSUMPTION" },
          ],
          solution: [{ say: "Models give probabilities and expected values, not certainties." }],
        });
    }
  },

  verify() {
    return true;
  },
});
