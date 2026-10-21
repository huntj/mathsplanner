/**
 * @statement GF-G20
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-G20: Know the formulae for Pythagoras' theorem and the trigonometric ratios, and apply them to
// find angles and lengths in right-angled triangles in two-dimensional figures
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { GeometrySpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  angle: number;
  hyp: number;
  opp: number;
  adj: number;
  claim: number;
}

const r1 = (x: number) => Math.round(x * 10) / 10;
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

/** A right-angled triangle, right angle at B; the angle θ at A; labels on chosen sides. */
function tri(
  angle: number,
  hyp: number,
  labels: { ab?: string; bc?: string; ca?: string; theta?: string },
): GeometrySpec {
  const ab = hyp * Math.cos(rad(angle));
  const bc = hyp * Math.sin(rad(angle));
  return {
    type: "geometry",
    points: { A: [0, 0], B: [ab, 0], C: [ab, bc] },
    polygons: [{ vertices: ["A", "B", "C"] }],
    segments: [
      ...(labels.ab ? [{ from: "A", to: "B", label: labels.ab }] : []),
      ...(labels.bc ? [{ from: "B", to: "C", label: labels.bc }] : []),
      ...(labels.ca ? [{ from: "C", to: "A", label: labels.ca }] : []),
    ],
    angles: [
      { vertex: "B", from: "C", to: "A", right: true },
      ...(labels.theta ? [{ vertex: "A", from: "B", to: "C", label: labels.theta }] : []),
    ],
    description: "A right-angled triangle with some sides and an angle labelled.",
  };
}

export default defineGenerator<Params>({
  id: "GF-G20",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: ["GEO.TRIG.RATIO", "GEO.PYTHAG.ADD-FOR-SHORT"],

  params(rng) {
    const angle = rng.int(25, 65);
    const hyp = rng.int(6, 20);
    const opp = rng.int(3, 12);
    const adj = rng.int(4, 15);
    if (opp === adj) reject("different legs");
    return { angle, hyp, opp, adj, claim: rng.int(0, 2) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const x = r1(p.hyp * Math.sin(rad(p.angle)));
        return A.standard({
          question: [
            A.figure(
              tri(p.angle, p.hyp, {
                ca: `${p.hyp}\\text{ cm}`,
                bc: "x",
                theta: `${p.angle}^\\circ`,
              }),
            ),
          ],
          ask: "Work out x, to 1 decimal place.",
          answer: A.number(x, { units: "cm", accuracy: { dp: 1 } }),
          wrong: wrongs(x, [
            {
              code: "GEO.TRIG.RATIO",
              value: A.number(r1(p.hyp * Math.cos(rad(p.angle))), { accuracy: { dp: 1 } }),
              feedback: "x is opposite the angle and you know the hypotenuse: use sin.",
            },
          ]),
          solution: [
            { say: `sin ${p.angle}° = x/${p.hyp}, so x = ${p.hyp} × sin ${p.angle}° = ${x} cm.` },
          ],
        });
      }
      case 2: {
        const theta = r1(deg(Math.atan(p.opp / p.adj)));
        const ab = Math.hypot(p.opp, p.adj);
        return A.standard({
          question: [
            A.figure(
              tri(deg(Math.atan(p.opp / p.adj)), ab, {
                ab: `${p.adj}\\text{ cm}`,
                bc: `${p.opp}\\text{ cm}`,
                theta: "\\theta",
              }),
            ),
          ],
          ask: "Work out the angle θ, to 1 decimal place.",
          answer: A.number(theta, { units: "°", accuracy: { dp: 1 } }),
          wrong: wrongs(theta, [
            {
              code: "GEO.TRIG.RATIO",
              value: A.number(r1(deg(Math.atan(p.adj / p.opp))), { accuracy: { dp: 1 } }),
              feedback: "tan θ = opposite ÷ adjacent.",
            },
          ]),
          solution: [
            { say: `tan θ = ${p.opp}/${p.adj}, so θ = tan⁻¹(${p.opp}/${p.adj}) = ${theta}°.` },
          ],
        });
      }
      case 4: {
        const choices = ["sin", "cos", "tan"] as const;
        const pick = choices[p.claim] ?? "sin";
        const right = "tan";
        return A.trueOrFalseWhy({
          rng,
          statement: `In a right-angled triangle you know the side opposite an angle and the side adjacent to it. Sam says you should use ${pick} to find the angle.`,
          truth: pick === right,
          reasons: [
            {
              text:
                pick === right
                  ? "True. Opposite and adjacent are linked by tan θ = opp/adj."
                  : `False. ${pick} needs the hypotenuse. With opposite and adjacent, use tan.`,
              correct: true,
            },
            {
              text: `${pick === right ? "False" : "True"}. Any ratio works with any two sides.`,
              code: "GEO.TRIG.RATIO",
            },
            {
              text: `${pick === right ? "False" : "True"}. sin is always used to find angles.`,
              code: "GEO.TRIG.RATIO",
            },
          ],
          solution: [{ say: "SOH CAH TOA: choose the ratio that uses the two sides you know." }],
        });
      }
      default: {
        const hyp = r1(Math.hypot(p.opp, p.adj));
        const theta = r1(deg(Math.atan(p.opp / p.adj)));
        return A.multiStepContext({
          context: `A ramp rises ${p.opp} m over a horizontal distance of ${p.adj} m.`,
          parts: [
            {
              ask: "How long is the sloping surface of the ramp, to 1 decimal place?",
              answer: A.number(hyp, { units: "m", accuracy: { dp: 1 } }),
              wrong: wrongs(hyp, [
                {
                  code: "GEO.PYTHAG.ADD-FOR-SHORT",
                  value: A.number(p.opp + p.adj),
                  feedback: "Use Pythagoras: square, add, square root.",
                },
              ]),
            },
            {
              ask: "Work out the angle the ramp makes with the ground, to 1 decimal place.",
              answer: A.number(theta, { units: "°", accuracy: { dp: 1 } }),
              wrong: wrongs(theta, [
                {
                  code: "GEO.TRIG.RATIO",
                  value: A.number(r1(90 - theta), { accuracy: { dp: 1 } }),
                  feedback: "That is the angle at the top. tan θ = rise ÷ horizontal distance.",
                },
              ]),
            },
          ],
          solution: [
            { say: `√(${p.opp}² + ${p.adj}²) = ${hyp} m.` },
            { say: `tan θ = ${p.opp}/${p.adj}, θ = ${theta}°.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const n = numberAnswer(question);
    if (question.archetype === "standard")
      return question.key.depth === 1
        ? Math.abs(n - p.hyp * Math.sin(rad(p.angle))) < 0.06
        : Math.abs(n - deg(Math.atan(p.opp / p.adj))) < 0.06;
    if (question.archetype === "multi-step-context")
      return Math.abs(n - Math.hypot(p.opp, p.adj)) < 0.06;
    return true;
  },
});
