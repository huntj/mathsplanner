/**
 * @statement Y5-GEO-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Phase 4 slice; awaiting teacher review
 */
// Y5-GEO-04: Identify angles at a point and one whole turn (360°), angles at a point on a
// straight line and ½ a turn (180°), and other multiples of 90°
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { anglesAtPoint, anglesOnLine } from "@mathsplanner/diagrams";
import { deg, listOf, numbersOf, splitAngles, sum, TOTALS, wrongs } from "../shared/angles.ts";

interface Params {
  kind: "line" | "point";
  /** The known angles; the unknown x is what is left of the total. */
  known: number[];
}

const total = (p: Params) => TOTALS[p.kind].total;
const answerOf = (p: Params) => total(p) - sum(p.known);
const diagramOf = (p: Params, labelled = true) => {
  const angles = [
    ...p.known.map((value) => ({ value })),
    { value: answerOf(p), ...(labelled ? { label: "x" } : {}) },
  ];
  return p.kind === "line" ? anglesOnLine(angles) : anglesAtPoint(angles);
};

function wrongAnswers(p: Params): A.Wrong[] {
  const x = answerOf(p);
  const known = sum(p.known);
  return wrongs(x, [
    p.kind === "line"
      ? {
          code: "GEO.ANGLES.STRAIGHT-LINE-360",
          value: A.degrees(360 - known),
          feedback: "Angles on a straight line add up to 180°, not 360°.",
        }
      : {
          code: "GEO.ANGLES.POINT-180",
          value: A.degrees(180 - known),
          feedback: "Angles at a point make a full turn, so they add up to 360°, not 180°.",
        },
    {
      code: "GEO.ANGLES.ADDS-KNOWN",
      value: A.degrees(known),
      feedback: `Subtract the known angles from ${total(p)}°; do not add them.`,
    },
  ]);
}

const solution = (p: Params) =>
  A.steps.angleSum({ ...TOTALS[p.kind], known: p.known, unknown: "x" });
const where = (p: Params) => (p.kind === "line" ? "on a straight line" : "at a point");

export default defineGenerator<Params>({
  id: "Y5-GEO-04",
  version: "1.0.0",
  depths: [1, 2, 3, 4, 5],
  misconceptions: ["GEO.ANGLES.STRAIGHT-LINE-360", "GEO.ANGLES.POINT-180", "GEO.ANGLES.ADDS-KNOWN"],

  params(rng, numbers) {
    const kind = rng.pick(["line", "point"] as const);
    const parts = {
      friendly: kind === "line" ? 2 : 3,
      standard: 3,
      stretch: kind === "line" ? 3 : 4,
    }[numbers];
    const angles = splitAngles(rng, numbers, TOTALS[kind].total, parts, {
      min: numbers === "stretch" ? 15 : 20,
      max: 170,
    });
    return { kind, known: angles.slice(0, -1) };
  },

  build(p, depth, rng): QuestionDraft {
    const x = answerOf(p);
    const ask = ["Work out the size of angle ", A.math("x"), "."];
    switch (depth) {
      case 1:
        return A.standard({
          question: [`The diagram shows angles ${where(p)}.`, A.figure(diagramOf(p))],
          ask,
          answer: A.degrees(x),
          wrong: wrongAnswers(p),
          solution: solution(p),
        });
      case 2: {
        // The box can stand for any of the angles, not just the last.
        const all = [...p.known, x];
        const hide = rng.int(0, all.length - 1);
        const relation: (number | string)[] = all.flatMap((a, i) => (i === 0 ? [a] : ["+", a]));
        return A.missingValue({
          intro: `These angles are ${where(p)}.`,
          relation: [...relation, "=", total(p)],
          hide: hide * 2,
          units: "°",
          solution: A.steps.angleSum({
            ...TOTALS[p.kind],
            known: all.filter((_, i) => i !== hide),
            unknown: "\\square",
          }),
        });
      }
      case 3: {
        // Which picture matches a calculation: the same angles drawn on a line or at a point.
        const other: Params = { kind: p.kind === "line" ? "point" : "line", known: p.known };
        const otherFits = answerOf(other) > 0 && answerOf(other) < 180;
        // The same calculation with one angle 10° out: a near miss to read carefully.
        const shiftedUp: Params = { ...p, known: [(p.known[0] ?? 0) + 10, ...p.known.slice(1)] };
        const shiftedDown: Params = { ...p, known: [(p.known[0] ?? 0) - 10, ...p.known.slice(1)] };
        const fits = (q: Params) =>
          answerOf(q) >= 15 &&
          answerOf(q) <= 170 &&
          answerOf(q) !== 90 &&
          q.known.every((a) => a >= 15);
        const near = [shiftedUp, shiftedDown].filter(fits).slice(0, otherFits ? 1 : 2);
        if (near.length + (otherFits ? 1 : 0) < 2) reject("not enough distinct diagrams");
        return A.chooseTheDiagram({
          rng,
          ask: "Which diagram matches this calculation?",
          question: [A.displayMath(`x = ${[total(p), ...p.known].map(deg).join(" - ")}`)],
          correct: diagramOf(p),
          distractors: [
            ...(otherFits
              ? [
                  {
                    figure: diagramOf(other),
                    code:
                      p.kind === "line" ? "GEO.ANGLES.POINT-180" : "GEO.ANGLES.STRAIGHT-LINE-360",
                    feedback:
                      p.kind === "line"
                        ? "That diagram shows angles at a point, which add up to 360°."
                        : "That diagram shows angles on a straight line, which add up to 180°.",
                  },
                ]
              : []),
            ...near.map((q) => ({ figure: diagramOf(q) })),
          ],
          solution: [
            {
              say: `The calculation starts from ${total(p)}°, so the angles are ${where(p)}, and the known angles are ${listOf(p.known.map((a) => `${a}°`))}.`,
            },
          ],
        });
      }
      case 4: {
        const known = sum(p.known);
        const claim = p.kind === "line" ? 360 - known : known;
        const code = p.kind === "line" ? "GEO.ANGLES.STRAIGHT-LINE-360" : "GEO.ANGLES.ADDS-KNOWN";
        return A.explainTheError({
          rng,
          claim: [
            `The diagram shows angles ${where(p)}.`,
            A.figure(diagramOf(p)),
            "Sam says angle ",
            A.math("x"),
            " is ",
            A.math(deg(claim)),
            ".",
          ],
          correct:
            p.kind === "line"
              ? "He used 360°, but angles on a straight line add up to 180°."
              : "He added the known angles together instead of taking them away from 360°.",
          distractors: [
            ...(p.kind === "line"
              ? [
                  {
                    content: "He added the known angles together instead of taking them away.",
                    code: "GEO.ANGLES.ADDS-KNOWN",
                  },
                ]
              : [
                  {
                    content: "He used 360°, but angles at a point add up to 180°.",
                    code: "GEO.ANGLES.POINT-180",
                  },
                ]),
            { content: "He should have used 90°, because the lines make a right angle." },
            { content: "He measured the angle with a protractor instead of calculating it." },
          ],
          solution: [
            {
              say: TOTALS[p.kind].reason,
              math: `x = ${deg(total(p))} - ${deg(known)} = ${deg(answerOf(p))}`,
            },
            { say: `So x is ${answerOf(p)}°, not ${claim}°.` },
          ],
          tags: [code],
        });
      }
      default: {
        // Open: find three different angles at a point (or two on a line), each above a minimum.
        const count = p.kind === "line" ? 2 : 3;
        const low = p.kind === "line" ? Math.max(...p.known) : Math.min(...p.known, 100);
        const exists = p.kind === "line" ? 180 - low - 1 > low : 3 * low + 6 < 360;
        const example =
          p.kind === "line" ? [low + 10, 180 - low - 10] : [low + 10, low + 20, 360 - 2 * low - 30];
        return A.openConstruction({
          question: [
            `Find ${count} different angles ${where(p)}. Each angle must be bigger than `,
            A.math(deg(low)),
            ". Give your angles in degrees.",
          ],
          inputs: Array.from({ length: count }, () => "number" as const),
          describe: `${count} different whole-degree angles, each bigger than ${low}°, adding up to ${total(p)}°.`,
          check: (values) => {
            const v = numbersOf(values);
            return (
              !!v &&
              v.length === count &&
              new Set(v).size === count &&
              v.every((a) => a > low && Number.isInteger(a)) &&
              sum(v) === total(p)
            );
          },
          exists: exists && example.every((a) => a > low) && new Set(example).size === count,
          example: listOf(example.map((a) => `${a}°`)),
          solution: [
            {
              say: `${TOTALS[p.kind].reason} Choose angles bigger than ${low}° that add up to ${total(p)}°, for example ${listOf(example.map((a) => `${a}°`))}.`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    // Independent check: whatever was asked, the angles in the full picture make the total.
    const answer = question.parts[0]?.answer;
    if (answer?.type === "number") {
      const shown = question.stem.find((n) => n.t === "math" && n.v.includes("\\square"));
      if (shown && shown.t === "math") {
        const values = [...shown.v.matchAll(/(\d+)\^\\circ/g)].map((m) => Number(m[1]));
        const totalShown = values.pop() ?? 0;
        return sum(values) + answer.value === totalShown;
      }
      return sum(p.known) + answer.value === total(p);
    }
    return answerOf(p) > 0;
  },

  bounds: {
    friendly: { min: 20, max: 170, dp: 0 },
    standard: { min: 20, max: 170, dp: 0 },
    stretch: { min: 15, max: 170, dp: 0 },
  },
});
