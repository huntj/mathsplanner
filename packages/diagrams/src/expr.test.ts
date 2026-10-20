import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { compileExpression, ExpressionError, expressionToPlain } from "./expr.ts";

const at = (source: string, x: number, degrees = false) =>
  compileExpression(source, { degrees })(x);

describe("compileExpression", () => {
  it.each([
    ["x^2 - 3x + 2", 4, 6],
    ["2x + 1", 3, 7],
    ["3(x - 1)^2", 3, 12],
    ["x(x - 1)", 5, 20],
    ["-x^2", 3, -9],
    ["2^-1", 0, 0.5],
    ["2^3^2", 0, 512],
    ["1/x", 4, 0.25],
    ["10 / 2 / 5", 0, 1],
    ["sqrt(x + 7)", 9, 4],
    ["|x - 5|", 2, 3],
    ["2|x|", -3, 6],
    ["abs(x)", -2, 2],
    ["2sin(x)", Math.PI / 2, 2],
    ["sin x^2", Math.sqrt(Math.PI / 2), 1],
    ["exp(0) + ln(e)", 0, 2],
    ["log(1000)", 0, 3],
    ["pi", 0, Math.PI],
  ])("%s at x = %d is %d", (source, x, expected) => {
    expect(at(source, x)).toBeCloseTo(expected, 10);
  });

  it("uses degrees when asked", () => {
    expect(at("sin(x)", 30, true)).toBeCloseTo(0.5, 12);
    expect(at("cos(x)", 60, true)).toBeCloseTo(0.5, 12);
    expect(at("tan(x)", 45, true)).toBeCloseTo(1, 12);
    expect(at("tan(x)", 90, true)).toBeNaN();
  });

  it("agrees with JavaScript for random polynomials", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -9, max: 9 }),
        fc.integer({ min: -9, max: 9 }),
        fc.integer({ min: -9, max: 9 }),
        fc.double({ min: -10, max: 10, noNaN: true }),
        (a, b, c, x) => {
          const source = `${a}x^2 + ${b}x + ${c}`.replace(/\+ -/g, "- ");
          expect(at(source, x)).toBeCloseTo(a * x * x + b * x + c, 6);
        },
      ),
    );
  });

  it("refuses anything it cannot parse", () => {
    for (const bad of ["", "x +", "(x", "foo(x)", "2 $ 3", "x)"]) {
      expect(() => compileExpression(bad)).toThrow(ExpressionError);
    }
  });

  it("prints expressions for descriptions", () => {
    expect(expressionToPlain("x^2 - 3x + 2")).toBe("x² − 3x + 2");
    expect(expressionToPlain("2*x^3")).toBe("2 × x³");
  });
});
