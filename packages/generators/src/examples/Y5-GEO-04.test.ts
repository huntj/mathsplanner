import { NUMBERS } from "@mathsplanner/core";
import { describe, expect, it } from "vitest";
import generator from "./Y5-GEO-04.ts";

describe("Y5-GEO-04 example", () => {
  for (const depth of generator.depths) {
    for (const numbers of NUMBERS) {
      it(`generates depth ${depth} ${numbers} questions that verify, across 200 seeds`, () => {
        for (let seed = 0; seed < 200; seed++) {
          const { question, params } = generator.generateFull({ depth, numbers, seed });
          expect(generator.generate({ depth, numbers, seed })).toEqual(question);
          expect(generator.definition.verify?.(params, question)).toBe(true);
          const missing = 180 - params.known.reduce((sum, a) => sum + a, 0);
          expect(missing).toBeGreaterThanOrEqual(10);
          expect(missing).not.toBe(90);
        }
      });
    }
  }

  it("offers four different explanations at depth 4, one of them correct, in varying order", () => {
    const firsts = new Set<string>();
    for (let seed = 0; seed < 200; seed++) {
      const answer = generator.generate({ depth: 4, numbers: "standard", seed }).parts[0]?.answer;
      if (answer?.type !== "choice") throw new Error("expected a choice");
      expect(new Set(answer.options.map((o) => o.id)).size).toBe(4);
      expect(answer.options.map((o) => o.id)).toContain(answer.correct);
      firsts.add(answer.options[0]?.id ?? "");
    }
    expect(firsts.size).toBe(4);
  });
});
