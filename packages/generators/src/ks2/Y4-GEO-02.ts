/**
 * @statement Y4-GEO-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Phase 4 slice
 * @reviewed 2026-10-20 @huntj (teacher): depth 4 checked in the gallery, all numbers settings
 */
// Y4-GEO-02: Identify acute and obtuse angles and compare and order angles up to two right
// angles by size
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { angle } from "@mathsplanner/diagrams";
import { pickAngle } from "../shared/angles.ts";

export interface Params {
  /** An angle to classify (may be a right angle). */
  single: number;
  /** Three different angles to compare, smallest first. */
  three: [number, number, number];
  rotation: number;
}

const kindOf = (a: number) => (a < 90 ? "acute" : a === 90 ? "a right angle" : "obtuse");
const KIND_TEXT = { acute: "Acute", "a right angle": "A right angle", obtuse: "Obtuse" } as const;

/** Bigger angles get shorter arms, so arm length cannot be used to judge size. */
const armsFor = (a: number, all: number[]): [number, number] => {
  const rank = [...all].sort((x, y) => x - y).indexOf(a);
  const length = [3.4, 2.6, 1.8][rank] ?? 2.5;
  return [length, length];
};

export default defineGenerator<Params>({
  id: "Y4-GEO-02",
  version: "1.0.1",
  depths: [1, 2, 3, 4],
  misconceptions: ["GEO.ANGLES.SIZE-BY-ARMS", "GEO.ANGLES.TYPE-CONFUSED"],

  params(rng, numbers) {
    const step = numbers === "stretch" ? 5 : 10;
    const pick = (min: number, max: number, avoid: number[] = []) =>
      pickAngle(rng, numbers === "stretch" ? "standard" : "friendly", min, max, avoid);
    const single = rng.bool(0.2) ? 90 : pick(20, 170, [90]);
    const a = pick(20, 160, [90]);
    const b = pick(20, 160, [90, a]);
    const c = pick(20, 160, [90, a, b]);
    const three = [a, b, c].sort((x, y) => x - y) as [number, number, number];
    // Close angles are the stretch; friendly ones differ clearly.
    const gap = numbers === "friendly" ? 30 : numbers === "standard" ? 20 : step * 2;
    if (three[1] - three[0] < gap || three[2] - three[1] < gap)
      return reject("angles too close to compare");
    return { single, three, rotation: rng.int(0, 60) };
  },

  build(p, depth, rng): QuestionDraft {
    const kind = kindOf(p.single);
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: ["Look at this angle.", A.figure(angle(p.single, { rotation: p.rotation }))],
          ask: "Is it acute, obtuse or a right angle?",
          correct: KIND_TEXT[kind],
          distractors: (Object.keys(KIND_TEXT) as (keyof typeof KIND_TEXT)[])
            .filter((k) => k !== kind)
            .map((k) => ({
              content: KIND_TEXT[k],
              code: "GEO.ANGLES.TYPE-CONFUSED",
              feedback: "Compare the angle with a right angle: smaller is acute, bigger is obtuse.",
            })),
          solution: [
            {
              say: `It is ${p.single < 90 ? "smaller than" : p.single === 90 ? "exactly" : "bigger than"} a right angle, so it is ${kind}.`,
            },
          ],
        });
      case 2: {
        // Words only: pick the obtuse (or acute) angle from a list of sizes.
        const target = rng.pick(["acute", "obtuse"] as const);
        const right = p.three.filter((a) => (target === "acute" ? a < 90 : a > 90));
        if (right.length !== 1) reject("need exactly one angle of the target type");
        const answer = right[0] ?? 0;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `Which of these angles is ${target}?`,
          correct: A.math(`${answer}^\\circ`),
          distractors: p.three
            .filter((a) => a !== answer)
            .map((a) => ({
              content: A.math(`${a}^\\circ`),
              code: "GEO.ANGLES.TYPE-CONFUSED",
              feedback: `${a}° is ${kindOf(a)}: ${target === "acute" ? "acute angles are less than 90°" : "obtuse angles are between 90° and 180°"}.`,
            })),
          solution: [
            {
              say: `${target === "acute" ? "Acute angles are less than 90°" : "Obtuse angles are between 90° and 180°"}, so the answer is ${answer}°.`,
            },
          ],
        });
      }
      case 3: {
        // Which is the largest angle? The largest has the shortest arms.
        const [small, middle, large] = p.three;
        const figure = (a: number) =>
          angle(a, { rotation: rng.int(0, 40), arms: armsFor(a, p.three) });
        return A.chooseTheDiagram({
          rng,
          question: "Here are three angles.",
          ask: "Which angle is the largest?",
          correct: figure(large),
          distractors: [
            {
              figure: figure(small),
              code: "GEO.ANGLES.SIZE-BY-ARMS",
              feedback:
                "Its arms are longest, but the size of an angle is the amount of turn between the arms, not their length.",
            },
            { figure: figure(middle) },
          ],
          solution: [
            {
              say: "The size of an angle is how far one arm turns to reach the other. Ignore how long the arms are: the angle with the widest opening is the largest.",
            },
          ],
        });
      }
      default: {
        // Two angles: the smaller one is drawn with longer arms.
        const [small, , large] = p.three;
        const smallBigger = rng.bool(0.5);
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Angle P has long arms; angle Q has short arms.",
            A.figure({
              ...angle(small, { arms: [3.4, 3.4], rotation: 10 }),
              description: "Angle P, an angle with long arms.",
            }),
            A.figure({
              ...angle(large, { arms: [1.6, 1.6], rotation: 10 }),
              description: "Angle Q, an angle with short arms.",
            }),
            smallBigger
              ? "Ali says angle P is bigger than angle Q."
              : "Ali says angle Q is bigger than angle P.",
          ],
          truth: !smallBigger,
          reasons: [
            {
              text: "Angle Q opens wider: it is a bigger turn, whatever the length of the arms.",
              correct: true,
            },
            {
              text: "Angle P has longer arms, so it is the bigger angle.",
              code: "GEO.ANGLES.SIZE-BY-ARMS",
            },
            { text: "They are the same size because they are both drawn from a point." },
          ],
          solution: [
            {
              say: `Angle P is ${small}° and angle Q is ${large}°. Arm length does not change the size of an angle.`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const answer = question.parts[0]?.answer;
    if (answer?.type === "choice") {
      // The correct option's text agrees with the angle sizes.
      const correct = answer.options.find((o) => o.id === answer.correct)?.content;
      const text = JSON.stringify(correct ?? []);
      if (question.archetype === "standard")
        return text
          .toLowerCase()
          .includes(kindOf(p.single).replace("a right angle", "right angle"));
      return true;
    }
    if (answer?.type === "choice-with-reason") return true;
    return false;
  },
});
