/**
 * @statement Y7-RAT-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y7-RAT-03: Divide a given quantity into two parts in a given part:part or part:whole ratio; express
// the division of a quantity into two parts as a ratio
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { fracTex, gcdOf, slash } from "../shared/fr.ts";

interface Params {
  a: number;
  b: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "Y7-RAT-03",
  version: "1.0.0",
  depths: [1, 2, 5],
  misconceptions: ["RAT.SHARE.WRONG-TOTAL", "RAT.PART-WHOLE"],

  params(rng, numbers) {
    const a = rng.int(1, numbers === "friendly" ? 4 : 7);
    const b = rng.int(a + 1, numbers === "friendly" ? 6 : 11);
    const k = rng.int(2, numbers === "stretch" ? 50 : 12);
    if (gcdOf(a, b) !== 1) reject("a ratio in lowest terms");
    return { a, b, k };
  },

  build(p, depth): QuestionDraft {
    const total = (p.a + p.b) * p.k;
    const [small, big] = [p.a * p.k, p.b * p.k];
    const how = `There are ${p.a} + ${p.b} = ${p.a + p.b} parts. One part is £${total} ÷ ${p.a + p.b} = £${p.k}. The shares are ${p.a} × ${p.k} = £${small} and ${p.b} × ${p.k} = £${big}.`;
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "Share £",
            String(total),
            " between Amy and Ben in the ratio ",
            A.math(`${p.a}:${p.b}`),
            ".",
          ],
          ask: "How much does Ben get, in pounds?",
          answer: A.number(big),
          wrong: wrongs(big, [
            {
              code: "RAT.SHARE.WRONG-TOTAL",
              value: A.number(total / 2),
              feedback: `The ratio is not equal shares. Divide by the total number of parts, ${p.a + p.b}.`,
            },
          ]),
          solution: [{ say: how }],
        });
      case 2:
        return A.standard({
          question: [
            "In a bag, the ratio of red counters to blue counters is ",
            A.math(`${p.a}:${p.b}`),
            ".",
          ],
          ask: "What fraction of the counters are red?",
          answer: A.exact(frac(p.a, p.a + p.b)),
          wrong: [
            {
              code: "RAT.PART-WHOLE",
              value: A.exact(fracTex(p.a, p.b)),
              feedback: `${p.a}:${p.b} compares red with blue. Red is ${p.a} out of every ${p.a + p.b} counters.`,
            },
          ],
          solution: [
            {
              say: `For every ${p.a + p.b} counters, ${p.a} are red, so ${slash(p.a, p.a + p.b)} are red.`,
            },
          ],
        });
      default:
        return A.multiStepContext({
          context: [
            "Amy and Ben share some money in the ratio ",
            A.math(`${p.a}:${p.b}`),
            `. Ben gets £${big - small} more than Amy.`,
          ],
          parts: [
            {
              ask: "How much does Amy get, in pounds?",
              answer: A.number(small),
              wrong: wrongs(small, [
                {
                  code: "RAT.PART-WHOLE",
                  value: A.number(big - small),
                  feedback: `£${big - small} is the difference, which is ${p.b - p.a} part${p.b - p.a === 1 ? "" : "s"}.`,
                },
              ]),
            },
            { ask: "How much money is shared altogether, in pounds?", answer: A.number(total) },
          ],
          solution: [
            {
              say: `The difference is ${p.b} − ${p.a} = ${p.b - p.a} part${p.b - p.a === 1 ? "" : "s"}, worth £${big - small}, so one part is £${p.k}.`,
            },
            {
              say: `Amy gets ${p.a} × £${p.k} = £${small}. Altogether ${p.a + p.b} × £${p.k} = £${total}.`,
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "multi-step-context")
      return (
        numberAnswer(question, 0) === p.a * p.k && numberAnswer(question, 1) === (p.a + p.b) * p.k
      );
    const a = question.parts[0]?.answer;
    if (a?.type === "exact") return String(a.value) === toLatex(frac(p.a, p.a + p.b));
    return numberAnswer(question) === p.b * p.k;
  },
});
