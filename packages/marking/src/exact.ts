// Exact answers: equivalence with the Cortex Compute Engine, then the required form.
// The engine is a large module, so it is loaded only when a question needs it: call
// loadEquivalence() (or prepareMarking) before marking exact answers.
import type { ComputeEngine } from "@cortex-js/compute-engine";
import type { AnswerForm } from "@mathsplanner/core";

type Engine = InstanceType<typeof ComputeEngine>;
/** One engine for every check; creating it is slow. */
let engine: Engine | undefined;

/** Loads the Compute Engine once. Exact and symbolic marking need it first. */
export async function loadEquivalence(): Promise<void> {
  if (engine) return;
  const module = await import("@cortex-js/compute-engine");
  engine ??= new module.ComputeEngine();
}

const ce = (): Engine => {
  if (!engine) throw new Error("call loadEquivalence() before marking exact answers");
  return engine;
};

type Json = unknown;
type Expr = NonNullable<ReturnType<Engine["parse"]>>;

/** Tidies LaTeX from MathLive or a keyboard so the form checks see one spelling. */
export function normaliseLatex(latex: string): string {
  return latex
    .replace(/\\left|\\right/g, "")
    .replace(/\\[dt]frac/g, "\\frac")
    .replace(/\\cdot/g, "\\times")
    .replace(/\\,|\\;|\\!|\\ |~/g, "")
    // Keep a command apart from a following letter: \times e must not become \timese.
    .replace(/(\\[a-zA-Z]+)\s+(?=[a-zA-Z])/g, "$1{}")
    .replace(/\s+/g, "")
    // 9e-24 means 9e − 24 here, not scientific notation: e is Euler's number.
    .replace(/(\d)e(?![a-zA-Z])/g, "$1\\times e")
    .replace(/−/g, "-")
    .replace(/\{,\}/g, ".")
    .replace(/\^(\d)/g, "^{$1}")
    .replace(/\\sqrt(\d)/g, "\\sqrt{$1}")
    .replace(/\\frac(\d)(\d)/g, "\\frac{$1}{$2}");
}

const SAMPLE = [0.37, 1.91, -2.3, 3.7, 0.83];
const close = (a: number, b: number) =>
  Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));

/** Whether two LaTeX values are equal, or undefined if either cannot be read. */
export function equivalent(response: string, expected: string): boolean | undefined {
  const engine = ce();
  const a = engine.parse(normaliseLatex(response));
  const b = engine.parse(normaliseLatex(expected));
  if (!a.isValid || !b.isValid) return undefined;
  // Equations: compare left minus right, either way round.
  if (a.operator === "Equal" && b.operator === "Equal") {
    const diff = (e: Expr) => {
      const [, left, right] = e.json as [string, Json, Json];
      return engine.box(["Subtract", left, right] as never);
    };
    const d1 = diff(a);
    const d2 = diff(b);
    return sameValue(d1, d2) || sameValue(d1, engine.box(["Negate", d2.json] as never));
  }
  if ((a.operator === "Equal") !== (b.operator === "Equal")) return false;
  return sameValue(a, b);
}

function sameValue(a: Expr, b: Expr): boolean {
  if (a.isIdenticallyEqual(b) === true) return true;
  const names = [...new Set([...a.unknowns, ...b.unknowns])];
  const points =
    names.length === 0
      ? [[]]
      : SAMPLE.map((v, i) => names.map((_, k) => SAMPLE[(i + k) % SAMPLE.length] ?? v));
  return points.every((values) => {
    const subs = Object.fromEntries(names.map((n, k) => [n, values[k] ?? 0]));
    const x = a.subs(subs).N();
    const y = b.subs(subs).N();
    return Number.isFinite(x.re) && Number.isFinite(y.re) && close(x.re, y.re) && close(x.im, y.im);
  });
}

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
const squareFree = (n: number) => {
  for (let k = 2; k * k <= n; k++) if (n % (k * k) === 0) return false;
  return true;
};

const FRACTION = /^-?\\frac\{-?(\d+)\}\{(\d+)\}$/;
const MIXED = /^-?(\d+)\\frac\{(\d+)\}\{(\d+)\}$/;
const INTEGER = /^-?\d+$/;
const DECIMAL = /^-?\d+(\.\d+)?$/;
const STANDARD = /^-?(\d+(?:\.\d+)?)\\times10\^\{(-?\d+)\}$/;
const SURD = /^-?(\d*)\\sqrt\{(\d+)\}$/;

/** Whether the raw (non-canonical) parse has brackets multiplied or raised to a power. */
function hasBracketProduct(json: Json): boolean {
  if (!Array.isArray(json)) return false;
  const [op, ...args] = json as [string, ...Json[]];
  const bracketed = (x: Json) =>
    Array.isArray(x) && (x[0] === "Delimiter" || x[0] === "Add" || x[0] === "Subtract");
  if ((op === "InvisibleOperator" || op === "Multiply") && args.some(bracketed) && args.length > 1)
    return true;
  if (op === "Power" && bracketed(args[0])) return true;
  return args.some(hasBracketProduct);
}

/** Why a correct value is not in the required form, or undefined if it is. */
export function formProblem(response: string, form: AnswerForm): string | undefined {
  const r = normaliseLatex(response);
  switch (form) {
    case "decimal":
      return DECIMAL.test(r) ? undefined : "Give your answer as a decimal.";
    case "simplest": {
      const fraction = FRACTION.exec(r);
      if (fraction) {
        const [n, d] = [Number(fraction[1]), Number(fraction[2])];
        return gcd(n, d) === 1 && d !== 1 ? undefined : "Simplify your answer fully.";
      }
      const mixed = MIXED.exec(r);
      if (mixed) {
        const [n, d] = [Number(mixed[2]), Number(mixed[3])];
        return n < d && gcd(n, d) === 1 ? undefined : "Simplify your answer fully.";
      }
      const s = SURD.exec(r);
      if (s) return squareFree(Number(s[2])) ? undefined : "Simplify the surd fully.";
      return INTEGER.test(r) || !/\\frac|\\sqrt|\./.test(r)
        ? undefined
        : "Give your answer in its simplest form.";
    }
    case "mixed-number": {
      const m = MIXED.exec(r);
      if (INTEGER.test(r)) return undefined;
      if (!m) return "Give your answer as a mixed number.";
      return Number(m[2]) < Number(m[3]) && gcd(Number(m[2]), Number(m[3])) === 1
        ? undefined
        : "Give the fraction part in its simplest form, less than 1.";
    }
    case "improper": {
      const m = FRACTION.exec(r);
      if (INTEGER.test(r)) return undefined;
      if (!m) return "Give your answer as an improper fraction.";
      return gcd(Number(m[1]), Number(m[2])) === 1 ? undefined : "Simplify your fraction fully.";
    }
    case "standard-form": {
      const m = STANDARD.exec(r);
      if (!m) return "Give your answer in standard form, A × 10ⁿ.";
      const a = Number(m[1]);
      return a >= 1 && a < 10
        ? undefined
        : "In standard form the first number must be at least 1 and less than 10.";
    }
    case "surd": {
      const m = SURD.exec(r);
      if (!m) return "Give your answer as a surd, in the form a√b.";
      return squareFree(Number(m[2]))
        ? undefined
        : "Simplify the surd: take out any square factors.";
    }
    case "factorised":
      return hasBracketProduct(ce().parse(r, { form: "raw" }).json)
        ? undefined
        : "Give your answer fully factorised.";
    case "expanded":
      return hasBracketProduct(ce().parse(r, { form: "raw" }).json)
        ? "Expand the brackets."
        : undefined;
  }
}
