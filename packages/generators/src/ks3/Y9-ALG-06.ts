/**
 * @statement Y9-ALG-06
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y9-ALG-06: Use algebraic methods to solve simultaneous linear equations in two variables
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { numberAnswer } from "../shared/counting.ts";
import { signedWrongs } from "../shared/alg.ts";

interface Params {
  /** a1 x + b y = r1 and a2 x + b y = r2 share the y coefficient, so subtracting eliminates y. */
  a1: number;
  a2: number;
  b: number;
  x: number;
  y: number;
}

const side = (a: number, b: number) => `${a === 1 ? "" : a}x + ${b === 1 ? "" : b}y`;

export default defineGenerator<Params>({
  id: "Y9-ALG-06",
  version: "1.0.0",
  depths: [1, 2, 5],
  misconceptions: ["ALG.SIMULTANEOUS.SIGN", "AS.MULTISTEP.ONE-STEP"],

  params(rng, numbers) {
    const a1 = rng.int(2, 6);
    const a2 = rng.int(1, a1 - 1);
    const b = rng.int(1, numbers === "friendly" ? 3 : 5);
    const x = rng.int(1, 9);
    const y = rng.int(numbers === "stretch" ? -5 : 1, 9);
    if (y === 0 || x === y || (a1 - a2) * x === (a1 + a2) * x) reject("distinct values");
    return { a1, a2, b, x, y };
  },

  build(p, depth, rng): QuestionDraft {
    const [r1, r2] = [p.a1 * p.x + p.b * p.y, p.a2 * p.x + p.b * p.y];
    const [e1, e2] = [`${side(p.a1, p.b)} = ${r1}`, `${side(p.a2, p.b)} = ${r2}`];
    const diff = p.a1 - p.a2;
    // Adding the equations instead of subtracting leaves 2by in, which some students then drop:
    // x = (r1 + r2) / (a1 + a2), when that is whole.
    const added = (r1 + r2) / (p.a1 + p.a2);
    const how = `Both equations have ${p.b === 1 ? "" : p.b}y, so subtract them: ${diff === 1 ? "" : diff}x = ${r1 - r2}, so x = ${p.x}. Substitute: ${p.a2 === 1 ? "" : `${p.a2} × `}${p.x} + ${p.b === 1 ? "" : p.b}y = ${r2}, so y = ${p.y}.`;
    const wrongX = signedWrongs(
      p.x,
      Number.isInteger(added)
        ? [
            {
              code: "ALG.SIMULTANEOUS.SIGN",
              value: A.number(added),
              feedback: `The y terms are the same, so subtract the equations to remove y.`,
            },
          ]
        : [],
    );
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Solve the simultaneous equations ", A.math(e1), " and ", A.math(e2), "."],
          ask: "What is x?",
          answer: A.number(p.x),
          wrong: wrongX,
          solution: [{ say: how }],
        });
      case 2:
        return A.variedForm({
          rng,
          // Ticket prices must be positive, so the story is only used when y > 0.
          forms: [
            { question: ["Find x if ", A.math(e1), " and ", A.math(e2), "."] },
            ...(p.y > 0
              ? [
                  {
                    question: `${p.a1} adult tickets and ${p.b} child ticket${p.b === 1 ? "" : "s"} cost £${r1}. ${p.a2} adult ticket${p.a2 === 1 ? "" : "s"} and ${p.b} child ticket${p.b === 1 ? "" : "s"} cost £${r2}.`,
                    ask: "How much is one adult ticket, in pounds?",
                  },
                ]
              : []),
          ],
          answer: A.number(p.x),
          wrong: wrongX,
          solution: [{ say: `Let an adult ticket cost £x and a child ticket £y. ${how}` }],
        });
      default:
        return A.multiStepContext({
          context: ["Solve the simultaneous equations ", A.math(e1), " and ", A.math(e2), "."],
          parts: [
            { ask: "Find x.", answer: A.number(p.x), wrong: wrongX },
            {
              ask: "Find y.",
              answer: A.number(p.y),
              wrong: signedWrongs(p.y, [
                {
                  code: "AS.MULTISTEP.ONE-STEP",
                  value: A.number(r2 - p.a2 * p.x),
                  feedback: `${p.b === 1 ? "That is y." : `That is ${p.b}y. Divide by ${p.b}.`}`,
                },
              ]),
            },
          ],
          solution: [{ say: how }],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "multi-step-context")
      return numberAnswer(question, 0) === p.x && numberAnswer(question, 1) === p.y;
    return numberAnswer(question) === p.x;
  },
});
