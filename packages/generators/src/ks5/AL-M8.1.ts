/**
 * @statement AL-M8.1
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-M8.1: Understand force and Newton's first law; equilibrium
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { distinctFrom } from "../shared/pos.ts";
import { add, ijk, scale } from "../shared/vec.ts";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  f1: [number, number];
  f2: [number, number];
  drive: number;
}

export default defineGenerator<Params>({
  id: "AL-M8.1",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MECH.EQUILIBRIUM"],

  params(rng) {
    const f1: [number, number] = [rng.int(-9, 9), rng.int(-9, 9)];
    const f2: [number, number] = [rng.int(-9, 9), rng.int(-9, 9)];
    if (add(f1, f2).includes(0) || f1.includes(0) || f2.includes(0))
      reject("a third force with two components");
    return { f1, f2, drive: 50 * rng.int(6, 30) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const f3 = scale(-1, add(p.f1, p.f2));
        return A.choice({
          rng,
          question: [
            "A particle is in equilibrium under three forces: ",
            A.math(`(${ijk(p.f1)})\\text{ N}`),
            ", ",
            A.math(`(${ijk(p.f2)})\\text{ N}`),
            " and F.",
          ],
          ask: "Find F.",
          correct: A.math(`(${ijk(f3)})\\text{ N}`),
          distractors: [
            {
              content: A.math(`(${ijk(add(p.f1, p.f2))})\\text{ N}`),
              code: "MECH.EQUILIBRIUM",
              feedback: "In equilibrium the three forces add to zero, so F = −(F₁ + F₂).",
            },
            {
              content: A.math("\\mathbf{0}\\text{ N}"),
              code: "MECH.EQUILIBRIUM",
              feedback: "F balances the other two forces; it is not zero.",
            },
          ].filter(distinctFrom(A.math(`(${ijk(f3)})\\text{ N}`))),
          solution: [{ say: "", math: `\\mathbf{F} = -(${ijk(add(p.f1, p.f2))}) = ${ijk(f3)}` }],
        });
      }
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: `A car moves along a straight level road at a constant speed. The driving force is ${p.drive} N.`,
              ask: "Find the total resistance to motion.",
            },
          ],
          answer: A.number(p.drive, { units: "N" }),
          wrong: wrongs(p.drive, [
            {
              code: "MECH.EQUILIBRIUM",
              value: A.number(p.drive / 2, { units: "N" }),
              feedback:
                "Constant velocity means no resultant force: resistance equals the driving force.",
            },
          ]),
          solution: [
            {
              say: `Newton's first law: constant velocity ⇒ resultant force 0, so resistance = ${p.drive} N.`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement:
            "Eve says that a spacecraft moving at constant velocity in deep space needs its engines on to keep moving.",
          truth: false,
          reasons: [
            {
              text: "False. By Newton's first law, with no resultant force it keeps moving at constant velocity.",
              correct: true,
            },
            { text: "True. Moving objects need a force to keep moving.", code: "MECH.EQUILIBRIUM" },
            { text: "True. Without a force it would stop.", code: "MECH.EQUILIBRIUM" },
          ],
          solution: [
            {
              say: "A resultant force changes velocity; it is not needed to keep velocity constant.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return chosenText(question).includes(ijk(scale(-1, add(p.f1, p.f2))));
    if (question.key.depth === 2) return numberAnswer(question) === p.drive;
    return true;
  },
});
