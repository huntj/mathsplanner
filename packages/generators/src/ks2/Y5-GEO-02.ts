/**
 * @statement Y5-GEO-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Phase 4 slice
 * @reviewed 2026-10-20 @huntj (teacher): depth 4 checked in the gallery, all numbers settings
 */
// Y5-GEO-02: Know angles are measured in degrees; estimate and compare acute, obtuse and reflex
// angles
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { angle } from "@mathsplanner/diagrams";
import { pickAngle } from "../shared/angles.ts";

export interface Params {
  /** An angle to classify or estimate, from 10° to 350°, never a multiple of 90°. */
  size: number;
  rotation: number;
  claim: number;
}

type Kind = "acute" | "obtuse" | "reflex";
const kindOf = (a: number): Kind => (a < 90 ? "acute" : a < 180 ? "obtuse" : "reflex");
const RANGE: Record<Kind, string> = {
  acute: "less than 90°",
  obtuse: "between 90° and 180°",
  reflex: "between 180° and 360°",
};

const CLAIMS = [
  {
    claim: "An angle bigger than 90° is obtuse.",
    truth: "sometimes" as const,
    reasons: [
      {
        text: "Angles between 90° and 180° are obtuse, but angles over 180° are reflex.",
        correct: true,
      },
      {
        text: "Every angle bigger than a right angle is obtuse.",
        code: "GEO.ANGLES.TYPE-CONFUSED",
      },
      { text: "Obtuse angles are smaller than 90°." },
    ],
  },
  {
    claim: "A reflex angle is bigger than two right angles.",
    truth: "always" as const,
    reasons: [
      { text: "Reflex angles are more than 180°, which is two right angles.", correct: true },
      { text: "Only when it is close to 360°." },
      { text: "Reflex angles are between 90° and 180°.", code: "GEO.ANGLES.TYPE-CONFUSED" },
    ],
  },
  {
    claim: "An acute angle is bigger than an obtuse angle.",
    truth: "never" as const,
    reasons: [
      {
        text: "Acute angles are less than 90° and obtuse angles are more than 90°.",
        correct: true,
      },
      { text: "It depends how long the arms are.", code: "GEO.ANGLES.SIZE-BY-ARMS" },
      { text: "Acute means sharp, and sharp angles are the biggest." },
    ],
  },
];

export default defineGenerator<Params>({
  id: "Y5-GEO-02",
  version: "1.0.1",
  depths: [1, 2, 3, 4],
  misconceptions: ["GEO.ANGLES.TYPE-CONFUSED", "GEO.ANGLES.SIZE-BY-ARMS"],

  params(rng, numbers) {
    const step = { friendly: 10, standard: 5, stretch: 1 }[numbers];
    const size = pickAngle(rng, numbers, 15, 345, [90, 180, 270]);
    if (size % step !== 0) return reject("off-step angle");
    return { size, rotation: rng.int(0, 60), claim: rng.int(0, CLAIMS.length - 1) };
  },

  build(p, depth, rng): QuestionDraft {
    const kind = kindOf(p.size);
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: ["An angle measures ", A.math(`${p.size}^\\circ`), "."],
          ask: "What type of angle is it?",
          correct: kind,
          distractors: (["acute", "obtuse", "reflex"] as const)
            .filter((k) => k !== kind)
            .map((k) => ({
              content: k,
              code: "GEO.ANGLES.TYPE-CONFUSED",
              feedback: `${k[0]?.toUpperCase()}${k.slice(1)} angles are ${RANGE[k]}.`,
            })),
          solution: [{ say: `${p.size}° is ${RANGE[kind]}, so it is ${kind}.` }],
        });
      case 2: {
        // Estimate an unlabelled angle: the right estimate against plausible wrong ones.
        const estimate = Math.round(p.size / 10) * 10;
        const candidates = [
          180 - estimate,
          360 - estimate,
          estimate + 60,
          estimate - 60,
          estimate + 90,
        ].filter((v) => v > 0 && v < 360 && Math.abs(v - estimate) >= 40);
        const unique = [...new Set(candidates)].filter((v, i, all) =>
          all.every((w, j) => j >= i || Math.abs(v - w) >= 30),
        );
        if (unique.length < 2) reject("not enough distinct estimates");
        const [d1, d2] = unique;
        return A.choice({
          rng,
          question: [
            "Estimate the size of this angle.",
            A.figure(angle(p.size, { rotation: p.rotation })),
          ],
          ask: "Which is the best estimate?",
          correct: A.math(`${estimate}^\\circ`),
          distractors: [
            {
              content: A.math(`${d1}^\\circ`),
              ...(d1 === 360 - estimate || d1 === 180 - estimate
                ? {
                    code: "GEO.ANGLES.TYPE-CONFUSED",
                    feedback: `The angle is ${kind}, so its size is ${RANGE[kind]}.`,
                  }
                : {}),
            },
            { content: A.math(`${d2}^\\circ`) },
          ],
          solution: [
            {
              say: `The angle is ${kind} (${RANGE[kind]}). Comparing it with a right angle and a straight line, it is about ${estimate}°.`,
            },
          ],
        });
      }
      case 3: {
        // Match sizes to types.
        const acute = pickAngle(rng, "standard", 15, 80);
        const obtuse = pickAngle(rng, "standard", 100, 170);
        const reflex = pickAngle(rng, "standard", 190, 340, [270]);
        return A.matchRepresentations({
          rng,
          question: "Match each angle to its type.",
          pairs: [
            [A.math(`${acute}^\\circ`), "acute"],
            [A.math(`${obtuse}^\\circ`), "obtuse"],
            [A.math(`${reflex}^\\circ`), "reflex"],
            [A.math("90^\\circ"), "right angle"],
          ],
          solution: [
            {
              say: "Acute: less than 90°. Right angle: 90°. Obtuse: between 90° and 180°. Reflex: between 180° and 360°.",
            },
          ],
        });
      }
      default: {
        const c = CLAIMS[p.claim] ?? CLAIMS[0];
        if (!c) return reject("no claim");
        return A.alwaysSometimesNever({
          rng,
          claim: c.claim,
          truth: c.truth,
          reasons: c.reasons,
          solution: [{ say: c.reasons[0]?.text ?? "" }],
        });
      }
    }
  },

  verify(p, question) {
    const answer = question.parts[0]?.answer;
    if (answer?.type !== "choice" || question.archetype !== "standard") return true;
    const correct = JSON.stringify(
      answer.options.find((o) => o.id === answer.correct)?.content ?? [],
    );
    // Either the type name, or an estimate within 5° of the true size.
    const degrees = /(\d+)\^\\\\circ/.exec(correct);
    if (degrees) return Math.abs(Number(degrees[1]) - p.size) <= 5;
    return correct.includes(kindOf(p.size));
  },
});
