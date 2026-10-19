// LaTeX formatting that prints fractions, mixed numbers, surds and signs the way a teacher would
// write them. These produce LaTeX strings only; KaTeX turns them into maths in @mathsplanner/render.
import { Rational, type Num } from "./rational.ts";
import { Surd } from "./surd.ts";

export type FractionForm = "fraction" | "mixed" | "decimal";

export interface LatexOptions {
  /** How to print non-integer rationals. "decimal" needs a terminating decimal. Default "fraction". */
  form?: FractionForm;
  /** Group digits of integer parts with 5 or more digits: "comma" gives 12{,}345, "space" 12\,345. */
  group?: "comma" | "space";
}

export type LatexValue = Num | Surd;

function groupDigits(digits: string, group: LatexOptions["group"]): string {
  if (!group || digits.length < 5) return digits;
  const separator = group === "comma" ? "{,}" : "\\,";
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

function rationalLatex(r: Rational, options: LatexOptions): string {
  const sign = r.sign() < 0 ? "-" : "";
  const a = r.abs();
  const integer = (n: bigint) => groupDigits(n.toString(), options.group);
  if (a.isInteger()) return sign + integer(a.n);

  switch (options.form ?? "fraction") {
    case "decimal": {
      const { integer: whole, fixed } = a.decimal();
      a.toDecimalString(); // throws for recurring decimals
      return `${sign}${groupDigits(whole, options.group)}.${fixed}`;
    }
    case "mixed": {
      const { whole, part } = a.toMixed();
      const fraction = `\\frac{${part.n}}{${part.d}}`;
      return whole === 0n ? sign + fraction : `${sign}${integer(whole)}${fraction}`;
    }
    case "fraction":
      return `${sign}\\frac{${integer(a.n)}}{${integer(a.d)}}`;
  }
}

/** One surd term c√r, with c ≥ 0 given separately from its sign. */
function surdTermLatex(size: Rational, radicand: bigint): string {
  const root = `\\sqrt{${radicand}}`;
  const top = size.n === 1n ? root : `${size.n}${root}`;
  return size.d === 1n ? top : `\\frac{${top}}{${size.d}}`;
}

function surdLatex(s: Surd, options: LatexOptions): string {
  if (s.isZero()) return "0";
  return [...s.terms]
    .map(([radicand, c], i) => {
      const negative = c.sign() < 0;
      const sign = i === 0 ? (negative ? "-" : "") : negative ? " - " : " + ";
      const body =
        radicand === 1n ? rationalLatex(c.abs(), options) : surdTermLatex(c.abs(), radicand);
      return sign + body;
    })
    .join("");
}

/** Formats a number, bigint, Rational or Surd as LaTeX. Strings pass through unchanged. */
export function toLatex(value: LatexValue, options: LatexOptions = {}): string {
  if (typeof value === "string") return value;
  if (value instanceof Surd) return surdLatex(value, options);
  return rationalLatex(Rational.from(value), options);
}

/** Wraps negative values in brackets: (-\frac{1}{4}) after an operator, 3 stays 3. */
export function bracket(value: LatexValue, options: LatexOptions = {}): string {
  const text = toLatex(value, options);
  if (!text.startsWith("-") && !(value instanceof Surd && value.terms.size > 1)) return text;
  return `\\left(${text}\\right)`;
}

/**
 * Tagged template that formats interpolated values with toLatex; strings (operators, variables)
 * are inserted as they are:
 *
 *   latex`${frac(1, 3)} ${op} ${frac(1, 4)}`  →  \frac{1}{3} + \frac{1}{4}
 */
export function latex(strings: TemplateStringsArray, ...values: LatexValue[]): string {
  return strings.reduce((out, text, i) => {
    const value = values[i - 1];
    return out + (value === undefined ? "" : toLatex(value)) + text;
  });
}

/** A term c·variable as you would write it: 3x, x, -x, \frac{1}{2}x; a constant if no variable. */
export function term(coefficient: Num, variable = ""): string {
  const c = Rational.from(coefficient);
  if (!variable) return toLatex(c);
  if (c.eq(1)) return variable;
  if (c.eq(-1)) return `-${variable}`;
  return toLatex(c) + variable;
}

/**
 * Joins terms into an expression, dropping zero terms and fixing signs:
 * expression([[3, "x^2"], [-1, "x"], [4, ""]]) is 3x^2 - x + 4.
 */
export function expression(terms: readonly (readonly [Num, string])[]): string {
  const kept = terms.filter(([c]) => !Rational.from(c).isZero());
  if (kept.length === 0) return "0";
  return kept
    .map(([c, variable], i) => {
      const r = Rational.from(c);
      if (i === 0) return term(r, variable);
      return `${r.sign() < 0 ? " - " : " + "}${term(r.abs(), variable)}`;
    })
    .join("");
}

/** "+ 3" or "- 3", for building expressions by hand. */
export function signed(value: Num): string {
  const r = Rational.from(value);
  return `${r.sign() < 0 ? "-" : "+"} ${toLatex(r.abs())}`;
}
