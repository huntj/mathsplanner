// Standard form from whole-number digits and a power of ten, worked on strings so the digits stay
// exact: 345 with shift 2 is 34 500 = 3.45 × 10⁴.

export interface StandardForm {
  /** A, with 1 ≤ A < 10, e.g. "3.45". */
  mantissa: string;
  power: number;
  /** The form an answer is marked against: 3.45\times10^{4}. */
  latex: string;
  /** Spaced for display: 3.45 \times 10^{4}. */
  display: string;
}

/** The positive whole number `int` × 10^shift, in standard form. */
export function standardForm(int: number, shift: number): StandardForm {
  if (!Number.isSafeInteger(int) || int <= 0)
    throw new RangeError(`standardForm needs a positive whole number, not ${int}`);
  const raw = String(int);
  const digits = raw.replace(/0+$/, "");
  const power = digits.length - 1 + shift + (raw.length - digits.length);
  const mantissa = digits.length === 1 ? digits : `${digits[0]}.${digits.slice(1)}`;
  return {
    mantissa,
    power,
    latex: `${mantissa}\\times10^{${power}}`,
    display: `${mantissa} \\times 10^{${power}}`,
  };
}

/** A mantissa and power written out as LaTeX, e.g. for a wrong answer with the wrong power. */
export const sfLatex = (mantissa: string, power: number) => `${mantissa}\\times10^{${power}}`;
export const sfDisplay = (mantissa: string, power: number) => `${mantissa} \\times 10^{${power}}`;

/** The positive whole number `int` × 10^shift as an ordinary number in LaTeX, e.g. 34{,}500 or 0.000345. */
export function ordinary(int: number, shift: number): string {
  const s = String(int);
  if (shift >= 0) return (s + "0".repeat(shift)).replace(/\B(?=(\d{3})+$)/g, "{,}");
  const point = s.length + shift;
  const whole = point > 0 ? s.slice(0, point) : "0";
  const frac = (point > 0 ? s.slice(point) : "0".repeat(-point) + s).replace(/0+$/, "");
  const grouped = whole.replace(/\B(?=(\d{3})+$)/g, "{,}");
  return frac ? `${grouped}.${frac}` : grouped;
}

/** The value of an ordinary() string. */
export const ordinaryValue = (latex: string) => Number(latex.replace(/\{,\}/g, ""));
