// Diagrams tell the truth: each check must catch a drawing that contradicts its numbers.
import { describe, expect, it } from "vitest";
import {
  anglesAtPoint,
  anglesOnLine,
  regularPolygon,
  triangleASA,
  triangleSSS,
} from "./builders.ts";
import { DiagramError, drawDiagram, renderDiagram } from "./render.ts";
import type { GeometrySpec } from "./spec.ts";

const square: GeometrySpec = {
  type: "geometry",
  points: { A: [0, 0], B: [4, 0], C: [4, 4], D: [0, 4] },
  polygons: [{ vertices: ["A", "B", "C", "D"] }],
};
const problems = (spec: Parameters<typeof renderDiagram>[0]) => renderDiagram(spec).problems;

describe("geometry truth checks", () => {
  it("accepts an honest diagram", () => {
    expect(
      problems({
        ...square,
        segments: [
          { from: "A", to: "B", label: "4", length: 4, ticks: 1, arrows: 1 },
          { from: "D", to: "C", length: 4, ticks: 1, arrows: 1 },
        ],
        angles: [
          { vertex: "A", from: "B", to: "D", right: true },
          { vertex: "C", from: "D", to: "A", value: 45 },
        ],
      }),
    ).toEqual([]);
  });

  it("catches a right-angle mark on an angle that is not 90°", () => {
    const spec = {
      ...square,
      points: { ...square.points, D: [1, 4] as [number, number] },
      angles: [{ vertex: "A", from: "B", to: "D", right: true }],
    };
    expect(problems(spec)).toEqual([
      expect.stringContaining("marked as a right angle but drawn as 76.0°"),
    ]);
  });

  it("catches a stated angle that does not match the drawing, unless not to scale", () => {
    const spec: GeometrySpec = {
      ...square,
      angles: [{ vertex: "A", from: "B", to: "D", value: 80 }],
    };
    expect(problems(spec)).toEqual([expect.stringContaining("stated as 80° but drawn as 90.0°")]);
    expect(problems({ ...spec, notToScale: true })).toEqual([]);
  });

  it("catches lengths drawn out of proportion", () => {
    const spec: GeometrySpec = {
      ...square,
      segments: [
        { from: "A", to: "B", length: 4 },
        { from: "B", to: "C", length: 6 },
      ],
    };
    expect(problems(spec)).toEqual([expect.stringContaining("BC is stated as 6")]);
  });

  it("catches equal marks on unequal sides and parallel marks on lines that are not", () => {
    const kite: GeometrySpec = {
      type: "geometry",
      points: { A: [0, 0], B: [3, 3], C: [0, 6], D: [-2, 3] },
      segments: [
        { from: "A", to: "B", ticks: 1 },
        { from: "A", to: "D", ticks: 1 },
        { from: "A", to: "B", arrows: 1 },
        { from: "D", to: "C", arrows: 1 },
      ],
    };
    expect(problems(kite)).toEqual([
      expect.stringContaining("AD is marked equal to AB"),
      expect.stringContaining("DC is marked parallel to AB"),
    ]);
  });

  it("checks stated angles still add up when not to scale", () => {
    const spec: GeometrySpec = {
      type: "geometry",
      points: { A: [0, 0], B: [5, 0], C: [1, 3] },
      polygons: [{ vertices: ["A", "B", "C"] }],
      angles: [
        { vertex: "A", from: "B", to: "C", value: 50 },
        { vertex: "B", from: "C", to: "A", value: 60 },
        { vertex: "C", from: "A", to: "B", value: 80 },
      ],
      notToScale: true,
    };
    expect(problems(spec)).toEqual([expect.stringContaining("add up to 190°, not 180°")]);
  });

  it("catches undefined points and degenerate shapes", () => {
    expect(
      problems({ type: "geometry", points: { A: [0, 0] }, segments: [{ from: "A", to: "Z" }] }),
    ).toEqual(["segment AZ uses point Z, which is not defined"]);
    expect(
      problems({
        type: "geometry",
        points: { A: [0, 0], B: [1, 1], C: [2, 2] },
        polygons: [{ vertices: ["A", "B", "C"] }],
      }),
    ).toEqual(["polygon ABC has no area"]);
  });

  it("drawDiagram refuses a diagram that lies", () => {
    expect(() =>
      drawDiagram({ ...square, angles: [{ vertex: "A", from: "B", to: "D", value: 60 }] }),
    ).toThrow(DiagramError);
  });
});

describe("other truth checks", () => {
  it("number lines", () => {
    expect(problems({ type: "number-line", min: 0, max: 10, step: 3 })).toEqual([
      "step 3 does not divide 0 to 10 evenly",
    ]);
    expect(
      problems({ type: "number-line", min: 0, max: 10, step: 1, points: [{ value: 12 }] }),
    ).toEqual(["point 12 is off the line (0 to 10)"]);
    expect(
      problems({ type: "number-line", min: 0, max: 10, step: 1, intervals: [{ from: 5, to: 2 }] }),
    ).toEqual(["interval from 5 to 2 is empty"]);
  });

  it("graphs", () => {
    expect(
      problems({
        type: "cartesian",
        x: { min: 0, max: 5 },
        y: { min: 0, max: 5 },
        points: [{ at: [6, 1] }],
      }),
    ).toEqual(["point (6, 1) is outside the axes"]);
    expect(
      problems({
        type: "cartesian",
        x: { min: 0, max: 5 },
        y: { min: 0, max: 5 },
        curves: [{ y: "2x +" }],
      }),
    ).toEqual(['expression "2x +": unexpected end']);
  });

  it("bar models", () => {
    expect(problems({ type: "bar-model", bars: [{ parts: [{ size: 0 }] }] })).toEqual([
      "bar 1 has a part of size 0",
    ]);
    expect(
      problems({
        type: "bar-model",
        bars: [{ parts: [{ size: 1 }] }],
        braces: [{ bar: 0, from: 0, to: 2, label: "x" }],
      }),
    ).toEqual(["brace on bar 1 spans parts 1 to 3, which do not exist"]);
  });

  it("refuses diagram types the engine does not draw yet, and malformed specs", () => {
    expect(() => renderDiagram({ type: "chart" })).toThrow(
      '"chart" diagrams are not supported yet',
    );
    expect(() => renderDiagram({ type: "counters", layout: "abacus" })).toThrow(
      "layout must be one of",
    );
    expect(() => renderDiagram({ type: "number-line" })).toThrow(
      "min, max and step must be numbers",
    );
  });
});

describe("builders", () => {
  it("make honest specs", () => {
    for (const spec of [
      anglesOnLine([{ value: 30 }, { value: 150, label: "x" }]),
      anglesAtPoint([{ value: 90 }, { value: 120 }, { value: 150 }]),
      regularPolygon(7),
    ]) {
      expect(problems(spec)).toEqual([]);
    }
  });

  it("refuse impossible figures", () => {
    expect(() => anglesOnLine([{ value: 100 }, { value: 100 }])).toThrow("not 180°");
    expect(() => anglesAtPoint([{ value: 100 }])).toThrow("not 360°");
    expect(() => triangleASA(100, 5, 90)).toThrow(RangeError);
    expect(() => triangleSSS(1, 2, 5)).toThrow("triangle inequality");
  });

  it("place triangles to scale", () => {
    const { C } = triangleSSS(4, 5, 3);
    expect(C[0]).toBeCloseTo(0, 9);
    expect(C[1]).toBeCloseTo(3, 9);
    const t = triangleASA(60, 2, 60);
    expect(Math.hypot(t.C[0] - t.B[0], t.C[1] - t.B[1])).toBeCloseTo(2, 9);
  });
});

describe("descriptions", () => {
  it("describe geometry for screen readers", () => {
    const { description } = renderDiagram({
      type: "geometry",
      points: triangleSSS(4, 5, 3),
      polygons: [{ vertices: ["A", "B", "C"] }],
      segments: [{ from: "A", to: "B", label: "4\\text{ cm}", length: 4 }],
      angles: [{ vertex: "A", from: "B", to: "C", right: true }],
    });
    expect(description).toBe("Triangle ABC. AB is labelled 4 cm. Angle BAC is a right angle.");
  });

  it("use the spec's own description when it has one", () => {
    expect(
      renderDiagram({ type: "number-line", min: 0, max: 1, step: 1, description: "Custom." })
        .description,
    ).toBe("Custom.");
  });
});
