import { describe, expect, it } from "vitest";
import { renderDiagram } from "./render.ts";

describe("diagram frames", () => {
  const toSvg = (
    frame: { origin: [number, number]; scale: [number, number] },
    [x, y]: [number, number],
  ): [number, number] => [
    frame.origin[0] + frame.scale[0] * x,
    frame.origin[1] - frame.scale[1] * y,
  ];

  it("maps geometry points to where they are drawn", () => {
    const result = renderDiagram({
      type: "geometry",
      points: { A: [1, 1], B: [5, 1], C: [3, 4] },
      polygons: [{ vertices: ["A", "B", "C"] }],
    });
    const frame = result.frame;
    if (!frame) throw new Error("no frame");
    // The figure is fitted with its leftmost point at x = 0 and its top at y = 0.
    expect(toSvg(frame, [1, 1])[0]).toBeCloseTo(0);
    expect(toSvg(frame, [3, 4])[1]).toBeCloseTo(0);
  });

  it("puts a cartesian origin where the axes cross and a protractor's vertex at 0, 0", () => {
    const graph = renderDiagram({
      type: "cartesian",
      x: { min: -2, max: 4 },
      y: { min: -3, max: 3 },
    });
    expect(graph.frame && toSvg(graph.frame, [-2, 3])).toEqual([0, 0]);
    const protractor = renderDiagram({
      type: "measure",
      instrument: "protractor",
      angle: 40,
      baseline: "right",
    });
    expect(protractor.frame).toEqual({ origin: [0, 0], scale: [1, 1] });
  });
});
