/**
 * @statement GF-G6
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Phase 4 slice; awaiting teacher review
 */
// GF-G6: Use angle facts, congruence, similarity and quadrilateral properties to derive results,
// including Pythagoras, and write simple proofs
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { triangleASA, type Coord, type GeometrySpec } from "@mathsplanner/diagrams";
import { deg, pickAngle, wrongs } from "../shared/angles.ts";
import { circle, onCircle } from "../shared/circles.ts";
import { parallelogram } from "../shared/shapes.ts";

interface Step {
  claim: A.RichInput;
  reason: string;
  /** Wrong reasons for this step; those with a code are the tempting ones. */
  wrong?: { text: string; code?: string }[];
}

interface Proof {
  result: string;
  figure: GeometrySpec;
  steps: Step[];
}

const m = A.math;

function isoscelesFigure(): GeometrySpec {
  const t = triangleASA(65, 4, 65);
  return {
    type: "geometry",
    points: { B: t.A, C: t.B, A: t.C, M: [2, 0] },
    polygons: [{ vertices: ["A", "B", "C"] }],
    segments: [
      { from: "A", to: "B", ticks: 1 },
      { from: "A", to: "C", ticks: 1 },
      { from: "B", to: "M", ticks: 2 },
      { from: "M", to: "C", ticks: 2 },
      { from: "A", to: "M" },
    ],
    pointLabels: true,
    description: "Isosceles triangle ABC with AB = AC, and M the midpoint of BC joined to A.",
  };
}

function parallelogramFigure(): GeometrySpec {
  const base = parallelogram(60);
  return {
    ...base,
    segments: [...(base.segments ?? []), { from: "B", to: "D" }],
    pointLabels: true,
    description: "Parallelogram ABCD with diagonal BD.",
  };
}

function semicircleFigure(): GeometrySpec {
  return circle({
    points: { A: onCircle(180), B: onCircle(0), C: onCircle(125) },
    segments: [
      { from: "A", to: "B" },
      { from: "A", to: "C" },
      { from: "B", to: "C" },
      { from: "O", to: "C" },
    ],
    pointLabels: ["O", "A", "B", "C"],
    description: "A circle with centre O, diameter AB and a point C on the circle, with OC drawn.",
  });
}

function pythagorasFigure(): GeometrySpec {
  const [a, b] = [1.3, 2.2];
  const s = a + b;
  return {
    type: "geometry",
    points: {
      P: [0, 0],
      Q: [s, 0],
      R: [s, s],
      S: [0, s],
      E: [a, 0],
      F: [s, a],
      G: [b, s],
      H: [0, b],
    },
    polygons: [
      { vertices: ["P", "Q", "R", "S"] },
      { vertices: ["E", "F", "G", "H"], shaded: true },
    ],
    segments: [
      { from: "P", to: "E", label: "a" },
      { from: "E", to: "Q", label: "b" },
      { from: "E", to: "F", label: "c" },
    ],
    description:
      "A large square of side a + b with a tilted square of side c inside it, leaving four right-angled triangles with legs a and b.",
  };
}

const PROOFS: Proof[] = [
  {
    result: "The base angles of an isosceles triangle are equal.",
    figure: isoscelesFigure(),
    steps: [
      { claim: m("AB = AC"), reason: "given" },
      {
        claim: m("BM = CM"),
        reason: "M is the midpoint of BC",
        wrong: [
          { text: "the base angles of an isosceles triangle are equal", code: "GEO.PROOF.REASON" },
          { text: "alternate angles are equal" },
          { text: "AB = AC" },
        ],
      },
      { claim: [m("AM"), " is a side of both triangles"], reason: "common side" },
      {
        claim: ["Triangles ABM and ACM are congruent"],
        reason: "SSS",
        wrong: [{ text: "AAA", code: "GEO.CONGRUENCE.AAA" }, { text: "SAS" }, { text: "RHS" }],
      },
      {
        claim: m("\\angle ABM = \\angle ACM"),
        reason: "corresponding angles of congruent triangles are equal",
      },
    ],
  },
  {
    result: "Opposite angles of a parallelogram are equal.",
    figure: parallelogramFigure(),
    steps: [
      {
        claim: m("\\angle ABD = \\angle CDB"),
        reason: "alternate angles, as AB is parallel to DC",
        wrong: [
          { text: "corresponding angles, as AB is parallel to DC", code: "GEO.PROOF.REASON" },
          { text: "vertically opposite angles are equal" },
          { text: "co-interior angles add up to 180°" },
        ],
      },
      {
        claim: m("\\angle ADB = \\angle CBD"),
        reason: "alternate angles, as AD is parallel to BC",
      },
      { claim: [m("BD"), " is a side of both triangles"], reason: "common side" },
      {
        claim: ["Triangles ABD and CDB are congruent"],
        reason: "ASA",
        wrong: [{ text: "AAA", code: "GEO.CONGRUENCE.AAA" }, { text: "SSS" }, { text: "RHS" }],
      },
      {
        claim: m("\\angle DAB = \\angle BCD"),
        reason: "corresponding angles of congruent triangles are equal",
      },
    ],
  },
  {
    result: "The angle in a semicircle is a right angle.",
    figure: semicircleFigure(),
    steps: [
      {
        claim: m("OA = OB = OC"),
        reason: "radii of the circle",
        wrong: [
          { text: "the angle in a semicircle is 90°", code: "GEO.PROOF.REASON" },
          { text: "AB is a diameter" },
          { text: "triangle ABC is equilateral" },
        ],
      },
      {
        claim: [m("\\angle OAC = \\angle OCA"), " and ", m("\\angle OBC = \\angle OCB")],
        reason: "base angles of isosceles triangles are equal",
      },
      {
        claim: m("\\angle OAC + \\angle OCA + \\angle OCB + \\angle OBC = 180^\\circ"),
        reason: "angles in triangle ABC add up to 180°",
        wrong: [
          { text: "angles on a straight line add up to 180°", code: "GEO.PROOF.REASON" },
          { text: "angles at a point add up to 360°" },
          { text: "co-interior angles add up to 180°" },
        ],
      },
      {
        claim: m("\\angle ACB = \\angle OCA + \\angle OCB = 90^\\circ"),
        reason: "it is half of 180°",
      },
    ],
  },
  {
    result: "Pythagoras' theorem: a² + b² = c² for a right-angled triangle with hypotenuse c.",
    figure: pythagorasFigure(),
    steps: [
      { claim: ["The large square has area ", m("(a + b)^2")], reason: "its side is a + b" },
      {
        claim: ["The four triangles have area ", m("4 \\times \\tfrac{1}{2}ab = 2ab")],
        reason: "each is right-angled with legs a and b",
      },
      {
        claim: m("(a + b)^2 = 2ab + c^2"),
        reason: "the large square is the four triangles plus the tilted square",
      },
      {
        claim: m("a^2 + 2ab + b^2 = 2ab + c^2"),
        reason: "expanding the brackets",
        wrong: [
          { text: "Pythagoras' theorem", code: "GEO.PROOF.REASON" },
          { text: "factorising" },
          { text: "halving both sides" },
        ],
      },
      { claim: m("a^2 + b^2 = c^2"), reason: "subtracting 2ab from both sides" },
    ],
  },
];

interface Params {
  proof: number;
  /** Angles ABD and ADB of the parallelogram at depth 5. */
  p: number;
  q: number;
}

/** Parallelogram ABCD built from triangle ABD with ∠DAB = 180° − p − q; x = ∠CDB, y = ∠BCD. */
function chase(p: number, q: number): GeometrySpec {
  const t = triangleASA(180 - p - q, 4, p);
  const [A0, B, D] = [t.A, t.B, t.C];
  const C: Coord = [Math.round((B[0] + D[0]) * 1e9) / 1e9, Math.round((B[1] + D[1]) * 1e9) / 1e9];
  return {
    type: "geometry",
    points: { A: A0, B, C, D },
    polygons: [{ vertices: ["A", "B", "C", "D"] }],
    segments: [
      { from: "A", to: "B", arrows: 1 },
      { from: "D", to: "C", arrows: 1 },
      { from: "A", to: "D", arrows: 2 },
      { from: "B", to: "C", arrows: 2 },
      { from: "B", to: "D" },
    ],
    angles: [
      { vertex: "B", from: "D", to: "A", value: p },
      { vertex: "D", from: "A", to: "B", value: q },
      { vertex: "D", from: "B", to: "C", value: p, label: "x" },
      { vertex: "C", from: "D", to: "B", value: 180 - p - q, label: "y" },
    ],
    pointLabels: true,
    description: `Parallelogram ABCD with diagonal BD. Angle ABD is ${p}° and angle ADB is ${q}°; angle CDB is x and angle BCD is y.`,
  };
}

/** The angle at `v` between the rays to `a` and `b`, in degrees (0° to 180°). */
function angleAt(points: Record<string, Coord>, v: string, a: string, b: string): number {
  const [V, P, Q] = [v, a, b].map((n) => points[n] ?? [0, 0]) as [Coord, Coord, Coord];
  const t = Math.atan2(P[1] - V[1], P[0] - V[0]) - Math.atan2(Q[1] - V[1], Q[0] - V[0]);
  return Math.abs((((t * 180) / Math.PI + 540) % 360) - 180);
}

const lineOf = (s: Step, reason = s.reason): A.RichInput => [s.claim, ` (${reason})`];

export default defineGenerator<Params>({
  id: "GF-G6",
  version: "1.0.0",
  depths: [1, 4, 5],
  misconceptions: [
    "GEO.PROOF.REASON",
    "GEO.CONGRUENCE.AAA",
    "GEO.PARALLEL.ALTERNATE-SUPPLEMENTARY",
    "GEO.ANGLES.TRIANGLE-360",
  ],

  params(rng, numbers) {
    const p = pickAngle(rng, numbers, 30, 80);
    return {
      proof: rng.int(0, PROOFS.length - 1),
      p,
      q: pickAngle(rng, numbers, 30, 130 - p, [p]),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const proof = PROOFS[p.proof];
    if (!proof) return reject("no proof");
    // The steps that have wrong reasons to offer; one is chosen from the seed.
    const blanks = proof.steps.map((s, i) => (s.wrong ? i : -1)).filter((i) => i >= 0);
    const k = rng.pick(blanks);
    const step = proof.steps[k];
    if (!step?.wrong) return reject("no step to blank");
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [
            `This proves that ${proof.result.charAt(0).toLowerCase()}${proof.result.slice(1)}`,
            A.figure(proof.figure),
            ...proof.steps.flatMap((s, i) => [
              ` Line ${i + 1}: `,
              ...(i === k ? [s.claim, " (……)"] : [lineOf(s)]),
            ]),
          ],
          ask: `Which reason completes line ${k + 1}?`,
          correct: step.reason,
          distractors: step.wrong.map((w) => ({
            content: w.text,
            ...(w.code
              ? {
                  code: w.code,
                  feedback:
                    w.code === "GEO.PROOF.REASON"
                      ? "That uses the result being proved, or a fact that does not apply here."
                      : "Equal angles alone do not prove congruence.",
                }
              : {}),
          })),
          solution: [{ say: `Line ${k + 1} holds because ${step.reason}.` }],
        });
      case 4: {
        const bad = step.wrong.find((w) => w.code) ?? step.wrong[0];
        return A.spotTheMistake({
          question: [
            `Lena tries to prove that ${proof.result.charAt(0).toLowerCase()}${proof.result.slice(1)}`,
            A.figure(proof.figure),
          ],
          lines: proof.steps.map((s, i) => (i === k ? lineOf(s, bad?.text) : lineOf(s))),
          mistake: k,
          code: bad?.code ?? "GEO.PROOF.REASON",
          feedback: `Line ${k + 1} gives the wrong reason. It should be: ${step.reason}.`,
        });
      }
      default: {
        const y = 180 - p.p - p.q;
        return A.multiStepContext({
          context: ["ABCD is a parallelogram. BD is a diagonal.", A.figure(chase(p.p, p.q))],
          parts: [
            {
              ask: "Work out the size of angle x. Give a reason.",
              answer: A.degrees(p.p),
              wrong: wrongs(p.p, [
                {
                  code: "GEO.PARALLEL.ALTERNATE-SUPPLEMENTARY",
                  value: A.degrees(180 - p.p),
                  feedback:
                    "∠ABD and ∠CDB are alternate angles (AB is parallel to DC), so they are equal.",
                },
              ]),
            },
            {
              ask: "Work out the size of angle y.",
              answer: A.degrees(y),
              wrong: wrongs(y, [
                {
                  code: "GEO.ANGLES.TRIANGLE-360",
                  value: A.degrees(360 - p.p - p.q),
                  feedback: "The angles in triangle BCD add up to 180°.",
                },
              ]),
            },
          ],
          solution: [
            {
              say: "AB is parallel to DC, so ∠CDB = ∠ABD (alternate angles).",
              math: `x = ${deg(p.p)}`,
            },
            {
              say: "∠CBD = ∠ADB (alternate angles, AD parallel to BC), so in triangle BCD:",
              math: `y = 180^\\circ - ${deg(p.p)} - ${deg(p.q)} = ${deg(y)}`,
            },
            {
              say: `∠DAB is also 180° − ${p.p}° − ${p.q}° = ${y}°, so the opposite angles at A and C are equal.`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype !== "multi-step-context") {
      // The blanked reason is the true one, never one of the wrong reasons listed for that step.
      const proof = PROOFS[p.proof];
      return (
        proof !== undefined &&
        proof.steps.every((s) => !(s.wrong ?? []).some((w) => w.text === s.reason))
      );
    }
    const points = question.diagrams[0]?.points as Record<string, Coord> | undefined;
    const values = question.parts.map((part) =>
      part.answer.type === "number" ? part.answer.value : NaN,
    );
    if (!points) return false;
    const near = (a: number, b: number | undefined) => b !== undefined && Math.abs(a - b) < 1e-6;
    return (
      near(angleAt(points, "D", "B", "C"), values[0]) &&
      near(angleAt(points, "C", "D", "B"), values[1]) &&
      near(angleAt(points, "A", "B", "D"), values[1])
    );
  },
});
