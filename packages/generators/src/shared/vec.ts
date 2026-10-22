// Vector helpers for A level: column vectors as LaTeX, i/j/k notation and magnitudes.

export type Vec = number[];

/** A column vector, e.g. col([3, -2]) is (3 over −2) in brackets. */
export const col = (v: (number | string)[]) =>
  `\\begin{pmatrix} ${v.join(" \\\\ ")} \\end{pmatrix}`;

/** 3i − 2j (+ k) with signs joined and unit coefficients left out. */
export function ijk(v: Vec): string {
  const names = ["\\mathbf{i}", "\\mathbf{j}", "\\mathbf{k}"];
  const terms: string[] = [];
  v.forEach((c, i) => {
    if (c === 0) return;
    const size = Math.abs(c) === 1 ? "" : String(Math.abs(c));
    const body = `${size}${names[i] ?? ""}`;
    terms.push(terms.length === 0 ? (c < 0 ? `-${body}` : body) : `${c < 0 ? "-" : "+"} ${body}`);
  });
  return terms.length ? terms.join(" ") : "\\mathbf{0}";
}

export const add = (a: Vec, b: Vec) => a.map((x, i) => x + (b[i] ?? 0));
export const sub = (a: Vec, b: Vec) => a.map((x, i) => x - (b[i] ?? 0));
export const scale = (k: number, a: Vec) => a.map((x) => k * x);
export const mag = (a: Vec) => Math.sqrt(a.reduce((s, x) => s + x * x, 0));
