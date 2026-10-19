import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { bracket, expression, latex, signed, term, toLatex } from "./latex.ts";
import { frac, Rational } from "./rational.ts";
import { sqrt, surd } from "./surd.ts";

describe("toLatex", () => {
  it("prints integers and fractions", () => {
    expect(toLatex(5)).toBe("5");
    expect(toLatex(-5n)).toBe("-5");
    expect(toLatex(frac(3, 4))).toBe("\\frac{3}{4}");
    expect(toLatex(frac(-3, 4))).toBe("-\\frac{3}{4}");
    expect(toLatex(frac(8, 4))).toBe("2");
    expect(toLatex("x^2")).toBe("x^2");
  });

  it("prints mixed numbers and decimals on request", () => {
    expect(toLatex(frac(7, 3), { form: "mixed" })).toBe("2\\frac{1}{3}");
    expect(toLatex(frac(-7, 3), { form: "mixed" })).toBe("-2\\frac{1}{3}");
    expect(toLatex(frac(2, 3), { form: "mixed" })).toBe("\\frac{2}{3}");
    expect(toLatex(frac(3, 8), { form: "decimal" })).toBe("0.375");
    expect(toLatex(frac(-5, 4), { form: "decimal" })).toBe("-1.25");
    expect(() => toLatex(frac(1, 3), { form: "decimal" })).toThrow(RangeError);
  });

  it("groups digits only when asked, from five digits", () => {
    expect(toLatex(12345)).toBe("12345");
    expect(toLatex(1234, { group: "comma" })).toBe("1234");
    expect(toLatex(1234567, { group: "comma" })).toBe("1{,}234{,}567");
    expect(toLatex(-1234567, { group: "space" })).toBe("-1\\,234\\,567");
    expect(toLatex(frac("12345.25"), { form: "decimal", group: "comma" })).toBe("12{,}345.25");
  });

  it("prints surds as a teacher would", () => {
    expect(toLatex(sqrt(12))).toBe("2\\sqrt{3}");
    expect(toLatex(sqrt(5))).toBe("\\sqrt{5}");
    expect(toLatex(surd(-1, 5))).toBe("-\\sqrt{5}");
    expect(toLatex(sqrt("3/4"))).toBe("\\frac{\\sqrt{3}}{2}");
    expect(toLatex(surd(frac(3, 4), 2))).toBe("\\frac{3\\sqrt{2}}{4}");
    expect(toLatex(sqrt(2).mul(-1).add(1))).toBe("1 - \\sqrt{2}");
    expect(toLatex(surd(frac(-1, 2), 3).add(frac(1, 2)))).toBe(
      "\\frac{1}{2} - \\frac{\\sqrt{3}}{2}",
    );
    expect(toLatex(sqrt(0))).toBe("0");
  });

  it("never prints a double sign or a +-", () => {
    const value = fc.tuple(fc.integer({ min: -99, max: 99 }), fc.integer({ min: 1, max: 99 }));
    fc.assert(
      fc.property(value, value, fc.integer({ min: 1, max: 50 }), ([a, b], [c, d], r) => {
        const s = surd(frac(c, d), r).add(frac(a, b));
        const text = toLatex(s);
        expect(text).not.toMatch(/\+\s*-|-\s*-|--/);
        expect(text).not.toMatch(/^\s*\+/);
      }),
    );
  });
});

describe("latex tag", () => {
  it("formats values and leaves strings alone", () => {
    const op = "+";
    expect(latex`${frac(1, 3)} ${op} ${frac(1, 4)}`).toBe("\\frac{1}{3} + \\frac{1}{4}");
    expect(latex`x = ${0}`).toBe("x = 0");
    expect(latex`${sqrt(8)}`).toBe("2\\sqrt{2}");
  });

  it("brackets negatives and sums after an operator", () => {
    expect(`3 + ${bracket(frac(-1, 4))}`).toBe("3 + \\left(-\\frac{1}{4}\\right)");
    expect(bracket(3)).toBe("3");
    expect(bracket(sqrt(2).add(1))).toBe("\\left(1 + \\sqrt{2}\\right)");
  });
});

describe("terms and expressions", () => {
  it("writes coefficients the usual way", () => {
    expect(term(3, "x")).toBe("3x");
    expect(term(1, "x")).toBe("x");
    expect(term(-1, "x")).toBe("-x");
    expect(term(frac(1, 2), "x")).toBe("\\frac{1}{2}x");
    expect(term(-4)).toBe("-4");
  });

  it("joins terms, dropping zeros and fixing signs", () => {
    expect(
      expression([
        [3, "x^2"],
        [-1, "x"],
        [4, ""],
      ]),
    ).toBe("3x^2 - x + 4");
    expect(
      expression([
        [0, "x^2"],
        [-2, "x"],
        [-1, ""],
      ]),
    ).toBe("-2x - 1");
    expect(expression([[0, "x"]])).toBe("0");
  });

  it("signs values for building expressions", () => {
    expect(signed(3)).toBe("+ 3");
    expect(signed(frac(-1, 2))).toBe("- \\frac{1}{2}");
    expect(signed(Rational.from(0))).toBe("+ 0");
  });
});
