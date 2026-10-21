/**
 * @statement GF-A19
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-A19: Solve two simultaneous equations in two variables (linear/linear) algebraically; find
// approximate solutions using a graph
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { clearOfOrigin, grid, poly } from "../shared/alg.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { coord, distinctFrom } from "../shared/pos.ts";

interface Params {
  x: number;
  y: number;
  a: number;
  b: number;
  m1: number;
  m2: number;
  adult: number;
  child: number;
}

export default defineGenerator<Params>({
  id: "GF-A19",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: ["ALG.SIMULTANEOUS.SIGN", "ALG.COORD.ORDER"],

  params(rng) {
    const x = rng.int(-4, 4);
    const y = rng.int(-4, 4);
    const a = rng.int(2, 5);
    const b = rng.int(1, 4);
    const m1 = rng.pick([1, 2, -1, -2]);
    const m2 = rng.pick([1, 2, -1, -2, 3]);
    if (x === 0 || y === 0 || x === y || m1 === m2) reject("a crossing off the axes");
    if (!clearOfOrigin(m1, y - m1 * x) || !clearOfOrigin(m2, y - m2 * x))
      reject("lines clear of the origin label");
    return { x, y, a, b, m1, m2, adult: rng.int(6, 15), child: rng.int(3, 8) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        // ax + by = s, ax − by = t: add to eliminate y.
        const s = p.a * p.x + p.b * p.y;
        const t = p.a * p.x - p.b * p.y;
        const right = `x = ${p.x},\\ y = ${p.y}`;
        return A.choice({
          rng,
          question: [
            "Solve the simultaneous equations ",
            A.math(`${p.a}x + ${p.b}y = ${s}`),
            " and ",
            A.math(`${p.a}x - ${p.b}y = ${t}`),
            ".",
          ],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(`x = ${p.x},\\ y = ${-p.y}`),
              code: "ALG.SIMULTANEOUS.SIGN",
              feedback: "Substitute x back into the first equation carefully, keeping the signs.",
            },
            {
              content: A.math(`x = ${p.y},\\ y = ${p.x}`),
              code: "ALG.COORD.ORDER",
              feedback: "Check by substituting: x and y are swapped.",
            },
          ].filter(distinctFrom(A.math(right))),
          solution: [
            {
              say: "Add the equations to eliminate y: ",
              math: `${2 * p.a}x = ${s + t} \\Rightarrow x = ${p.x}`,
            },
            { say: "Substitute: ", math: `${p.b}y = ${s} - ${p.a * p.x} \\Rightarrow y = ${p.y}` },
          ],
        });
      }
      case 2: {
        const c1 = p.y - p.m1 * p.x;
        const c2 = p.y - p.m2 * p.x;
        const right = coord([p.x, p.y]);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "The graphs of ",
            A.math(`y = ${poly([p.m1, c1])}`),
            " and ",
            A.math(`y = ${poly([p.m2, c2])}`),
            " are drawn.",
            A.figure(
              grid(
                8,
                [poly([p.m1, c1]), poly([p.m2, c2])],
                [],
                "Two straight lines on a coordinate grid.",
              ),
            ),
          ],
          ask: "Use the graph to solve the simultaneous equations.",
          correct: A.math(`x = ${p.x},\\ y = ${p.y}`),
          distractors: [
            {
              content: A.math(`x = ${p.y},\\ y = ${p.x}`),
              code: "ALG.COORD.ORDER",
              feedback: "Read across for x and up for y.",
            },
            {
              content: A.math(`x = 0,\\ y = ${c1}`),
              feedback:
                "That is where one line crosses the y-axis. The solution is where the lines cross each other.",
            },
          ].filter(distinctFrom(A.math(`x = ${p.x},\\ y = ${p.y}`))),
          solution: [{ say: `The lines cross at ${right}.` }],
        });
      }
      case 4: {
        const s = p.a * p.x + p.b * p.y;
        const t = p.a * p.x - p.b * p.y;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "To solve ",
            A.math(`${p.a}x + ${p.b}y = ${s}`),
            " and ",
            A.math(`${p.a}x - ${p.b}y = ${t}`),
            ", Ola subtracts the equations to eliminate y.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. The y terms have opposite signs (+${p.b}y and −${p.b}y), so adding eliminates y. Subtracting eliminates x.`,
              correct: true,
            },
            {
              text: "True. You always subtract to eliminate a variable.",
              code: "ALG.SIMULTANEOUS.SIGN",
            },
            { text: "True. Subtracting removes the term with the bigger number." },
          ],
          solution: [{ say: "Same signs: subtract. Opposite signs: add." }],
        });
      }
      default: {
        const t1 = 2 * p.adult + 3 * p.child;
        const t2 = p.adult + 2 * p.child;
        return A.multiStepContext({
          context: `2 adult tickets and 3 child tickets cost £${t1}. 1 adult ticket and 2 child tickets cost £${t2}.`,
          parts: [
            {
              ask: "Work out the cost of a child ticket.",
              answer: A.number(p.child, { units: "£" }),
              wrong: [
                {
                  code: "ALG.SIMULTANEOUS.SIGN",
                  value: A.number(-p.child),
                  feedback:
                    "Subtract the first equation from the doubled second one: (2a + 4c) − (2a + 3c) = c.",
                },
              ],
            },
            {
              ask: "Work out the cost of an adult ticket.",
              answer: A.number(p.adult, { units: "£" }),
            },
          ],
          solution: [
            { say: "", math: `2a + 3c = ${t1},\\ 2a + 4c = ${2 * t2} \\Rightarrow c = ${p.child}` },
            { say: "", math: `a = ${t2} - 2 \\times ${p.child} = ${p.adult}` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard" || question.archetype === "varied-form")
      return chosenText(question) === `x = ${p.x},\\ y = ${p.y}`;
    if (question.archetype === "multi-step-context")
      return numberAnswer(question) === p.child && numberAnswer(question, 1) === p.adult;
    return true;
  },
});
