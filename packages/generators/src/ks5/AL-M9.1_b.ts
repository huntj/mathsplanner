/**
 * @statement AL-M9.1.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-M9.1.b: Use moments for ladders
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  /** Ladder weight W newtons, length 2a, angle θ with the ground (a 3-4-5 slope). */
  W: number;
  steep: boolean;
}

const r2 = (x: number) => Math.round(x * 100) / 100;

export default defineGenerator<Params>({
  id: "AL-M9.1.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MECH.MOMENTS", "MECH.FRICTION"],

  params(rng) {
    return { W: rng.int(10, 40) * 10, steep: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    // tan θ = 4/3 (steep) or 3/4. Smooth wall: S = W/(2 tan θ); friction at the ground F = S, R = W.
    const tan = p.steep ? 4 / 3 : 3 / 4;
    const S = r2(p.W / (2 * tan));
    const intro = `A uniform ladder of weight ${p.W} N rests with its foot on rough horizontal ground and its top against a smooth vertical wall. It makes an angle θ with the ground, where tan θ = ${p.steep ? "4/3" : "3/4"}. The ladder is about to slip.`;
    switch (depth) {
      case 1:
        return A.standard({
          question: intro,
          ask: "Taking moments about the foot of the ladder, find the reaction from the wall, in newtons.",
          answer: A.number(S, { units: "N", accuracy: { dp: 2 } }),
          wrong: wrongs(S, [
            {
              code: "MECH.MOMENTS",
              value: A.number(r2(p.W / tan), { units: "N", accuracy: { dp: 2 } }),
              feedback: "The weight acts at the middle of the ladder, half-way along it.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `S \\times 2a\\sin\\theta = ${p.W} \\times a\\cos\\theta \\Rightarrow S = \\frac{${p.W}}{2\\tan\\theta} = ${S}`,
            },
          ],
        });
      case 2: {
        const mu = r2(S / p.W);
        return A.standard({
          question: intro,
          ask: "Find the coefficient of friction between the ladder and the ground, to 2 decimal places.",
          answer: A.number(mu, { accuracy: { dp: 2 } }),
          wrong: wrongs(mu, [
            {
              code: "MECH.FRICTION",
              value: A.number(r2(p.W / S), { accuracy: { dp: 2 } }),
              feedback: "μ = F ÷ R, with the friction on top.",
            },
          ]),
          solution: [{ say: `R = ${p.W} N and F = S = ${S} N, so μ = ${S} ÷ ${p.W} = ${mu}.` }],
        });
      }
      default:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            intro,
            " Ivan takes moments about the foot of the ladder. Which force does he wrongly include?",
          ],
          correct: "The friction at the foot",
          distractors: [
            {
              content: "The weight of the ladder",
              code: "MECH.MOMENTS",
              feedback: "The weight is not at the foot, so it does have a moment about it.",
            },
            {
              content: "The reaction from the wall",
              code: "MECH.MOMENTS",
              feedback: "The wall reaction acts at the top, so it has a moment about the foot.",
            },
          ],
          solution: [
            {
              say: "Forces through the pivot have no moment about it: friction and the normal reaction at the foot drop out.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    const S = r2(p.W / (2 * (p.steep ? 4 / 3 : 3 / 4)));
    if (question.key.depth === 1) return numberAnswer(question) === S;
    if (question.key.depth === 2) return numberAnswer(question) === r2(S / p.W);
    return chosenText(question) === "The friction at the foot";
  },
});
