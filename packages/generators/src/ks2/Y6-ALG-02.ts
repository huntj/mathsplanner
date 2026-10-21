/**
 * @statement Y6-ALG-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-ALG-02: Generate and describe linear number sequences
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  first: number;
  step: number;
  /** Depth 4: a far-off position. */
  far: number;
}

export default defineGenerator<Params>({
  id: "Y6-ALG-02",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SEQUENCE.POSITION-RULE"],

  params(rng, numbers) {
    const step =
      rng.int(2, numbers === "friendly" ? 5 : 12) * (numbers === "stretch" && rng.bool() ? -1 : 1);
    const first = rng.int(1, 20) + (step < 0 ? 60 : 0);
    if (first === step || first % step === 0)
      reject("a first term that is not a multiple of the step");
    return { first, step, far: rng.int(10, 25) };
  },

  build(p, depth, rng): QuestionDraft {
    const term = (k: number) => p.first + (k - 1) * p.step;
    const shown = [1, 2, 3, 4].map(term).join(", ");
    const rule = p.step > 0 ? `add ${p.step}` : `subtract ${-p.step}`;
    switch (depth) {
      case 1:
        return A.standard({
          question: `Here is a sequence: ${shown}, …`,
          ask: "What is the next term?",
          answer: A.number(term(5)),
          solution: [
            {
              say: `The rule is ${rule}: ${term(4)} ${p.step > 0 ? "+" : "−"} ${Math.abs(p.step)} = ${term(5)}.`,
            },
          ],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `Here is a sequence: ${shown}, …`,
          ask: "Which rule describes it?",
          correct: `Start at ${p.first} and ${rule} each time`,
          distractors: [
            {
              content: `Start at ${p.first} and ${p.step > 0 ? "subtract" : "add"} ${Math.abs(p.step)} each time`,
              feedback: `The terms ${p.step > 0 ? "go up" : "go down"}.`,
            },
            {
              content: `Start at ${term(2)} and ${rule} each time`,
              feedback: `The first term is ${p.first}.`,
            },
            {
              content: `Start at ${p.first} and ${rule.replace(/\d+/, String(Math.abs(p.step) + 1))} each time`,
              feedback: `Find the difference between neighbouring terms: ${term(2)} − ${p.first} = ${p.step}.`,
            },
          ],
          solution: [
            {
              say: `The difference between each pair of terms is ${p.step}, so the rule is ${rule}.`,
            },
          ],
        });
      default: {
        const right = term(p.far);
        const slip = p.far * p.step;
        return A.trueOrFalseWhy({
          rng,
          statement: `In the sequence ${shown}, …, Maya says the ${p.far}th term is ${p.far} × ${p.step} = ${slip}.`,
          truth: slip === right,
          reasons: [
            {
              text: `False. The first term is ${p.first}, not ${p.step}. There are ${p.far - 1} steps after the first term: ${p.first} + ${p.far - 1} × ${p.step} = ${right}.`,
              correct: true,
            },
            {
              text: `True. The ${p.far}th term is always ${p.far} lots of the difference.`,
              code: "ALG.SEQUENCE.POSITION-RULE",
            },
            { text: "True. You cannot find a term without writing them all out." },
          ],
          solution: [
            {
              say: `term = ${p.first} + (position − 1) × ${p.step}, so the ${p.far}th term is ${right}.`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return numberAnswer(question) === p.first + 4 * p.step;
    if (question.archetype === "varied-form")
      return chosenText(question).startsWith(
        `Start at ${p.first} and ${p.step > 0 ? "add" : "subtract"} ${Math.abs(p.step)} `,
      );
    return p.far * p.step !== p.first + (p.far - 1) * p.step;
  },
});
