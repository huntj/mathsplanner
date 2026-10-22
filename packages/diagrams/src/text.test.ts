import { describe, expect, it } from "vitest";
import { LabelError, latexToPlain, layoutLabel } from "./text.ts";

describe("label text", () => {
  it("turns labels into plain text for descriptions", () => {
    expect(latexToPlain("52^\\circ")).toBe("52°");
    expect(latexToPlain("x")).toBe("x");
    expect(latexToPlain("8\\text{ cm}")).toBe("8 cm");
    expect(latexToPlain("\\frac{3}{4}")).toBe("3/4");
    expect(latexToPlain("\\frac{x+1}{2}")).toBe("(x + 1)/2");
    expect(latexToPlain("\\sqrt{2}")).toBe("√2");
    expect(latexToPlain("x^2")).toBe("x²");
    expect(latexToPlain("y = 2x - 1")).toBe("y = 2x − 1");
    expect(latexToPlain("-3")).toBe("−3");
    expect(latexToPlain("(1, -4)")).toBe("(1, −4)");
    expect(latexToPlain("\\theta")).toBe("θ");
    expect(latexToPlain("\\angle ABC")).toBe("∠ABC");
    expect(latexToPlain("25\\%")).toBe("25%");
    expect(latexToPlain("\\mathbf{a}")).toBe("a");
  });

  it("draws \\mathbf letters bold and upright, for vectors", () => {
    const svg = layoutLabel("\\mathbf{a}").svg(0, 0);
    expect(svg).toContain('font-weight="bold"');
    expect(svg).not.toContain('font-style="italic"');
  });

  it("measures with KaTeX metrics: wider text is wider, fractions are taller", () => {
    const one = layoutLabel("1");
    const many = layoutLabel("1000");
    expect(one.width).toBeCloseTo(0.5 * 16, 5);
    expect(many.width).toBeCloseTo(4 * one.width, 5);
    expect(layoutLabel("\\frac{1}{2}").height).toBeGreaterThan(one.height * 1.5);
    expect(layoutLabel("x", 32).width).toBeCloseTo(2 * layoutLabel("x", 16).width, 5);
  });

  it("spaces relations and binary operators but not unary signs", () => {
    const tight = layoutLabel("2x1");
    const spaced = layoutLabel("2x-1");
    const minusWidth = layoutLabel("-").width;
    // 2x − 1 = 2x1 + the minus + two medium spaces (0.222em each).
    expect(spaced.width).toBeCloseTo(tight.width + minusWidth + 2 * 0.222 * 16, 5);
    expect(layoutLabel("-1").width).toBeCloseTo(minusWidth + layoutLabel("1").width, 5);
  });

  it("writes SVG text in KaTeX fonts, italic for variables, with real minus signs", () => {
    const svg = layoutLabel("x - 2").svg(0, 20);
    expect(svg).toContain('font-family="KaTeX_Math');
    expect(svg).toContain('font-style="italic">x</text>');
    expect(svg).toContain(">−</text>");
    expect(layoutLabel("\\frac{1}{2}").svg(0, 0)).toContain("<line");
    expect(layoutLabel("a < b").svg(0, 0)).toContain("&lt;");
  });

  it("keeps spaces inside \\text", () => {
    expect(layoutLabel("8\\text{ cm}").svg(0, 0)).toContain("\u00a0cm");
  });

  it("refuses LaTeX outside the subset, so tests catch it", () => {
    expect(() => layoutLabel("\\int x")).toThrow(LabelError);
    expect(() => layoutLabel("\\frac{1}")).toThrow("missing argument");
    expect(() => layoutLabel("{x")).toThrow("unclosed");
    expect(() => layoutLabel("x}")).toThrow("unexpected }");
    expect(() => layoutLabel("\\sqrt[3]{8}")).toThrow("not supported");
    expect(() => layoutLabel("a & b")).toThrow("unexpected &");
  });
});
