import { describe, expect, it } from "vitest";
import { renderDiagram } from "./render.ts";
import type { CountersSpec } from "./spec.ts";

const draw = (spec: Omit<CountersSpec, "type">) =>
  renderDiagram({ type: "counters", ...spec } as CountersSpec);
const count = (svg: string, tag: string) => svg.split(`<${tag} `).length - 1;

describe("counters", () => {
  it("draw exactly the counters asked for, in every arrangement", () => {
    for (const arrangement of ["dice", "row", "scatter"] as const) {
      for (let n = 1; n <= 10; n++) {
        const { svg, problems } = draw({ layout: "objects", counts: [n], arrangement, seed: 3 });
        expect(problems, `${arrangement} ${n}`).toEqual([]);
        expect(count(svg, "circle"), `${arrangement} ${n}`).toBe(n);
      }
    }
  });

  it("never overlap scattered counters", () => {
    for (let seed = 0; seed < 30; seed++) {
      const { svg } = draw({ layout: "objects", counts: [12], arrangement: "scatter", seed });
      const centres = [...svg.matchAll(/<circle cx="([\d.-]+)" cy="([\d.-]+)"/g)].map((m) => [
        Number(m[1]),
        Number(m[2]),
      ]);
      for (const [i, a] of centres.entries())
        for (const b of centres.slice(i + 1))
          expect(Math.hypot((a[0] ?? 0) - (b[0] ?? 0), (a[1] ?? 0) - (b[1] ?? 0))).toBeGreaterThan(
            26,
          );
    }
  });

  it("fill ten frames and outline the second colour", () => {
    const { svg, description } = draw({ layout: "ten-frame", frames: [10, 3], second: [0, 1] });
    expect(count(svg, "circle")).toBe(13);
    expect((svg.match(/<circle[^>]*fill="none"/g) ?? []).length).toBe(1);
    expect(description).toBe("2 ten frames: 10 counters and 3 counters (2 filled, 1 outlined).");
  });

  it("put the right counters or blocks in each place-value column", () => {
    const counters = draw({ layout: "place-value", columns: ["H", "T", "O"], counts: [2, 3, 5] });
    expect(count(counters.svg, "circle")).toBe(10);
    expect(counters.description).toContain("2 in H, 3 in T and 5 in O");
    const blocks = draw({
      layout: "place-value",
      columns: ["H", "T", "O"],
      counts: [1, 4, 2],
      style: "blocks",
    });
    expect(count(blocks.svg, "rect")).toBe(7);
  });

  it("report counts they cannot draw", () => {
    expect(draw({ layout: "objects", counts: [41] }).problems).not.toEqual([]);
    expect(draw({ layout: "ten-frame", frames: [11] }).problems).not.toEqual([]);
    expect(
      draw({ layout: "place-value", columns: ["Th", "O"], counts: [1, 2], style: "blocks" })
        .problems,
    ).not.toEqual([]);
    expect(draw({ layout: "fingers", count: 11 }).problems).not.toEqual([]);
  });

  it("describe fingers, tallies, arrays and part-whole models", () => {
    expect(draw({ layout: "fingers", count: 7 }).description).toBe("Two hands showing 7 fingers.");
    expect(draw({ layout: "tally", count: 12 }).description).toBe("12 tally marks.");
    expect(draw({ layout: "array", rows: 3, columns: 4 }).description).toBe(
      "An array of counters in 3 rows and 4 columns.",
    );
    expect(draw({ layout: "part-whole", whole: "7", parts: ["4", "3"] }).description).toBe(
      "A part-whole model: the whole is 7 and the parts are 4 and 3.",
    );
  });
});
