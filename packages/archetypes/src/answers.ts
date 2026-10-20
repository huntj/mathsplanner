// Answers as generators state them. Each becomes an AnswerSpec for marking, an AnswerValue when
// a misconception produces it, and LaTeX for solutions.
import {
  Rational,
  Surd,
  toLatex,
  type Accuracy,
  type AnswerForm,
  type AnswerSpec,
  type AnswerValue,
  type LatexValue,
  type LatexOptions,
} from "@mathsplanner/core";

export type Answer =
  | { kind: "number"; value: number; units?: string; accuracy: Accuracy }
  | { kind: "exact"; value: LatexValue; form?: AnswerForm; latex?: LatexOptions };

/** A numeric answer, exact unless an accuracy is given: number(63, { units: "°" }). */
export function number(
  value: number,
  options: { units?: string; accuracy?: Accuracy } = {},
): Answer {
  if (!Number.isFinite(value)) throw new RangeError(`answer ${value} is not a finite number`);
  return {
    kind: "number",
    value,
    accuracy: options.accuracy ?? { exact: true },
    ...(options.units === undefined ? {} : { units: options.units }),
  };
}

/** An angle in degrees: degrees(63). */
export function degrees(value: number): Answer {
  return number(value, { units: "°" });
}

/** An exact answer such as a fraction or surd, optionally in a required form. */
export function exact(value: LatexValue, form?: AnswerForm, latex?: LatexOptions): Answer {
  return {
    kind: "exact",
    value,
    ...(form === undefined ? {} : { form }),
    ...(latex === undefined ? {} : { latex }),
  };
}

/** The value as LaTeX, with units: 63^\circ, 8\text{ cm}, \frac{7}{12}. */
export function answerLatex(answer: Answer): string {
  if (answer.kind === "exact") return toLatex(answer.value, answer.latex);
  const value = toLatex(answer.value);
  if (!answer.units) return value;
  if (answer.units === "°") return `${value}^\\circ`;
  if (answer.units === "%") return `${value}\\%`;
  return `${value}\\text{ ${answer.units}}`;
}

export function toAnswerSpec(answer: Answer): AnswerSpec {
  if (answer.kind === "number") {
    return {
      type: "number",
      value: answer.value,
      accuracy: answer.accuracy,
      ...(answer.units === undefined ? {} : { units: answer.units }),
    };
  }
  return {
    type: "exact",
    value: toLatex(answer.value, answer.latex),
    ...(answer.form === undefined ? {} : { form: answer.form }),
  };
}

export function toAnswerValue(answer: Answer): AnswerValue {
  return answer.kind === "number"
    ? { type: "number", value: answer.value }
    : { type: "exact", latex: toLatex(answer.value, answer.latex) };
}

/** Whether two answers have the same value (exactly, for exact answers). */
export function sameValue(a: Answer, b: Answer): boolean {
  if (a.kind === "number" && b.kind === "number") return a.value === b.value;
  const asExact = (x: Answer): Surd | string =>
    x.kind === "number"
      ? Surd.from(Rational.from(x.value))
      : x.value instanceof Surd
        ? x.value
        : typeof x.value === "string"
          ? x.value
          : Surd.from(Rational.from(x.value));
  const ea = asExact(a);
  const eb = asExact(b);
  if (typeof ea === "string" || typeof eb === "string") return toLatex(ea) === toLatex(eb);
  return ea.eq(eb);
}
