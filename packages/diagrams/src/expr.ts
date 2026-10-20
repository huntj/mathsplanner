// A small, safe parser for curve expressions in x, so curves can live in JSON specs:
// "x^2 - 3x + 2", "1/x", "2sin(x)", "sqrt(x + 1)", "|x - 2|", "3(x - 1)^2".
// Grammar: sum := product (('+'|'-') product)*; product := unary (('*'|'/'|implicit) unary)*;
// unary := ('-'|'+') unary | power; power := atom ('^' unary)?; atom := number | x | pi | e
// | function '(' sum ')' | '(' sum ')' | '|' sum '|'.

export class ExpressionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ExpressionError";
  }
}

type Fn = (x: number) => number;

const FUNCTIONS: Record<string, (v: number, degrees: boolean) => number> = {
  sin: (v, d) => Math.sin(d ? (v * Math.PI) / 180 : v),
  cos: (v, d) => Math.cos(d ? (v * Math.PI) / 180 : v),
  tan: (v, d) => {
    // Exactly at an odd multiple of 90° tan is undefined; float rounding would give a huge value.
    const r = d ? (v * Math.PI) / 180 : v;
    return Math.abs(Math.cos(r)) < 1e-12 ? Number.NaN : Math.tan(r);
  },
  sqrt: (v) => Math.sqrt(v),
  abs: (v) => Math.abs(v),
  exp: (v) => Math.exp(v),
  ln: (v) => Math.log(v),
  log: (v) => Math.log10(v),
};

/** Compiles an expression in x to a function. Throws ExpressionError if it cannot be parsed. */
export function compileExpression(source: string, options: { degrees?: boolean } = {}): Fn {
  const degrees = options.degrees ?? false;
  const tokens = source.match(/\d+(?:\.\d+)?|\.\d+|[a-z]+|[-+*/^()|]|\S/gi) ?? [];
  let i = 0;
  const fail = (message: string): never => {
    throw new ExpressionError(`expression "${source}": ${message}`);
  };
  const peek = () => tokens[i];
  const next = () => tokens[i++];
  const expect = (t: string) => {
    if (next() !== t) fail(`expected ${t}`);
  };

  // Implicit multiplication starts with a number, a name or an opening bracket.
  const startsAtom = (t: string | undefined, insideBars: boolean) =>
    t !== undefined && (/^[\d.a-z(]/i.test(t) || (t === "|" && !insideBars));

  let bars = 0;

  const atom = (): Fn => {
    const t = next();
    if (t === undefined) return fail("unexpected end");
    if (/^[\d.]/.test(t)) {
      const v = Number(t);
      return () => v;
    }
    if (t === "(") {
      const inner = sum();
      expect(")");
      return inner;
    }
    if (t === "|") {
      bars++;
      const inner = sum();
      bars--;
      expect("|");
      return (x) => Math.abs(inner(x));
    }
    const name = t.toLowerCase();
    if (name === "x") return (x) => x;
    if (name === "pi") return () => Math.PI;
    if (name === "e") return () => Math.E;
    const fn = FUNCTIONS[name];
    if (fn) {
      // sin x and sin(x) are both allowed; without brackets the argument is one power.
      const arg = peek() === "(" ? atom() : power();
      return (x) => fn(arg(x), degrees);
    }
    return fail(`unknown name "${t}"`);
  };

  const power = (): Fn => {
    const base = atom();
    if (peek() === "^") {
      next();
      const exponent = unary();
      return (x) => base(x) ** exponent(x);
    }
    return base;
  };

  const unary = (): Fn => {
    if (peek() === "-") {
      next();
      const inner = unary();
      return (x) => -inner(x);
    }
    if (peek() === "+") {
      next();
      return unary();
    }
    return power();
  };

  const product = (): Fn => {
    let left = unary();
    for (;;) {
      const t = peek();
      if (t === "*" || t === "/") {
        next();
        const right = unary();
        const l = left;
        left = t === "*" ? (x) => l(x) * right(x) : (x) => l(x) / right(x);
      } else if (startsAtom(t, bars > 0)) {
        const right = power();
        const l = left;
        left = (x) => l(x) * right(x);
      } else {
        return left;
      }
    }
  };

  const sum = (): Fn => {
    let left = product();
    for (;;) {
      const t = peek();
      if (t !== "+" && t !== "-") return left;
      next();
      const right = product();
      const l = left;
      left = t === "+" ? (x) => l(x) + right(x) : (x) => l(x) - right(x);
    }
  };

  if (tokens.length === 0) fail("empty");
  const f = sum();
  if (i < tokens.length) fail(`unexpected "${tokens[i]}"`);
  return f;
}

/** The expression for descriptions: x^2 becomes x², * becomes ×. */
export function expressionToPlain(source: string): string {
  return source
    .replace(/\^2(?![\d.])/g, "²")
    .replace(/\^3(?![\d.])/g, "³")
    .replace(/\*/g, " × ")
    .replace(/-/g, "−")
    .replace(/\s+/g, " ")
    .trim();
}
