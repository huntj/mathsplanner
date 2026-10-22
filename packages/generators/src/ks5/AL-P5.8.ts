/**
 * @statement AL-P5.8
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P5.8: Construct proofs involving trigonometric functions and identities
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";

/** Identities to prove, with the right first step and a tempting wrong one. */
const PROOFS = [
  {
    identity: "\\frac{1 - \\cos^2\\theta}{\\sin\\theta} \\equiv \\sin\\theta",
    step: "\\frac{\\sin^2\\theta}{\\sin\\theta}",
    slip: "\\frac{1 - \\cos\\theta}{\\sin\\theta}",
    slipWhy: "1 − cos²θ = sin²θ by sin²θ + cos²θ = 1; you cannot take a square root of each term.",
  },
  {
    identity: "\\tan\\theta + \\frac{1}{\\tan\\theta} \\equiv \\frac{1}{\\sin\\theta\\cos\\theta}",
    step: "\\frac{\\sin^2\\theta + \\cos^2\\theta}{\\sin\\theta\\cos\\theta}",
    slip: "\\frac{\\sin\\theta + \\cos\\theta}{\\sin\\theta\\cos\\theta}",
    slipWhy: "Over a common denominator the tops are sin²θ and cos²θ.",
  },
  {
    identity: "(\\sin\\theta + \\cos\\theta)^2 \\equiv 1 + \\sin 2\\theta",
    step: "\\sin^2\\theta + 2\\sin\\theta\\cos\\theta + \\cos^2\\theta",
    slip: "\\sin^2\\theta + \\cos^2\\theta",
    slipWhy: "Squaring a bracket gives a middle term, 2 sin θ cos θ.",
  },
] as const;

interface Params {
  proof: number;
}

export default defineGenerator<Params>({
  id: "AL-P5.8",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.TRIG.IDENTITY", "ALG.PROOF.EXAMPLES", "ALG.EXPAND.BINOMIAL-TWO-TERMS"],

  params(rng) {
    return { proof: rng.int(0, PROOFS.length - 1) };
  },

  build(p, depth, rng): QuestionDraft {
    const pr = PROOFS[p.proof] ?? (PROOFS[0] as (typeof PROOFS)[number]);
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: ["Prove that ", A.math(pr.identity), "."],
          ask: "Which is a correct first step, working on the left-hand side?",
          correct: A.math(pr.step),
          distractors: [
            {
              content: A.math(pr.slip),
              code: p.proof === 2 ? "ALG.EXPAND.BINOMIAL-TWO-TERMS" : "GEO.TRIG.IDENTITY",
              feedback: pr.slipWhy,
            },
          ],
          solution: [
            { say: "Start from one side and transform it, step by step, into the other." },
          ],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["Sam wants to prove ", A.math(pr.identity), "."],
          ask: "Which method is a valid proof?",
          correct:
            "Start with the left-hand side and use known identities to turn it into the right-hand side.",
          distractors: [
            {
              content: "Check that both sides are equal when θ = 30°, 45° and 60°.",
              code: "ALG.PROOF.EXAMPLES",
              feedback: "Examples cannot prove a result for every θ.",
            },
            {
              content: "Assume the identity is true, then simplify both sides until they match.",
              code: "ALG.PROOF.EXAMPLES",
              feedback: "That assumes what you are trying to prove.",
            },
          ],
          solution: [
            {
              say: "A proof of an identity works from one side to the other using identities that are already known.",
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Rob checks ",
            A.math(pr.identity),
            " for θ = 20° and θ = 70° and finds both sides agree. He says this proves the identity.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. Checking values can only disprove an identity; a proof must work for every θ, using algebra and known identities.",
              correct: true,
            },
            { text: "True. Two different angles are enough.", code: "ALG.PROOF.EXAMPLES" },
            { text: "True. If it fails it would fail at 20°.", code: "ALG.PROOF.EXAMPLES" },
          ],
          solution: [{ say: "Use known identities to transform one side into the other." }],
        });
    }
  },

  verify() {
    return true;
  },
});
