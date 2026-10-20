// End to end over the angles and geometry slice: the right answer to every question scores full
// marks, and every predictable wrong answer is marked wrong and named.
import type { AnswerSpec, AnswerValue } from "@mathsplanner/core";
import { generators } from "@mathsplanner/generators";
import { describe, expect, it } from "vitest";
import { markPart } from "./mark.ts";

/** The response a student who gets it right would give; undefined for condition parts. */
function rightAnswer(a: AnswerSpec): AnswerValue | undefined {
  switch (a.type) {
    case "number":
      return { type: "number", value: a.value };
    case "exact":
      return { type: "exact", latex: a.value };
    case "coordinate":
      return { type: "coordinate", x: a.x, y: a.y };
    case "choice":
      return { type: "choice", id: a.correct };
    case "multi-select":
      return { type: "choices", ids: a.correct };
    case "choice-with-reason":
      return { type: "choice-with-reason", id: a.correct, reason: a.correctReason };
    case "order":
      return { type: "order", ids: a.correct };
    case "match":
      return { type: "match", pairs: a.correct };
    case "plot": {
      if (a.target.type === "measure") {
        const angle = Number(a.target.angle);
        const deg = a.target.baseline === "left" ? 180 - angle : angle;
        return {
          type: "points",
          points: { arm: [Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180)] },
        };
      }
      const points = a.target.points as Record<string, [number, number]>;
      return {
        type: "points",
        points: Object.fromEntries(a.place.map((n) => [n, points[n] ?? [0, 0]])),
      };
    }
    default:
      return undefined;
  }
}

describe("every slice question can be marked", () => {
  for (const generator of generators) {
    it(generator.id, () => {
      for (const depth of generator.depths) {
        for (const numbers of ["friendly", "standard", "stretch"] as const) {
          for (let seed = 0; seed < 15; seed++) {
            const { question, validators } = generator.generateFull({ depth, numbers, seed });
            question.parts.forEach((part, i) => {
              const where = `${generator.id} depth ${depth} ${numbers} seed ${seed} part ${i + 1}`;
              const right = rightAnswer(part.answer);
              if (right) expect(markPart(part, right).status, where).toBe("correct");
              else expect(validators.has(i), `${where} has a validator`).toBe(true);
              for (const m of part.misconceptions) {
                // A wrong reason is a misconception whatever option goes with it.
                const response: AnswerValue =
                  part.answer.type === "choice-with-reason" && m.answer.type === "choice"
                    ? { type: "choice-with-reason", id: part.answer.correct, reason: m.answer.id }
                    : m.answer;
                const marked = markPart(part, response);
                expect(marked.status, `${where} ${m.code}`).not.toBe("correct");
                expect(marked.misconception?.code, `${where} ${m.code}`).toBe(m.code);
              }
            });
          }
        }
      }
    });
  }
});
