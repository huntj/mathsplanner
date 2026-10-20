// The Phase 3 exit check: 50 reference diagrams, no label collisions, no truth problems.
import { describe, expect, it } from "vitest";
import { REFERENCE_DIAGRAMS } from "./references.ts";
import { renderDiagram } from "./render.ts";

describe("reference diagrams", () => {
  it("has 50 diagrams with unique IDs", () => {
    expect(REFERENCE_DIAGRAMS).toHaveLength(50);
    expect(new Set(REFERENCE_DIAGRAMS.map((r) => r.id)).size).toBe(50);
  });

  it.each(REFERENCE_DIAGRAMS.map((r) => [r.id, r] as const))(
    "%s renders cleanly",
    (_, reference) => {
      const result = renderDiagram(reference.spec);
      expect(result.problems).toEqual([]);
      expect(result.collisions).toEqual([]);
      expect(result.description.length).toBeGreaterThan(10);
      expect(result.svg).toMatchSnapshot();
    },
  );
});
