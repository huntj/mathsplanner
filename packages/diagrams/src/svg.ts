// Small helpers for writing SVG strings with stable output (snapshot tests compare them).

/** A number with at most two decimals and no trailing zeros, so output is stable. */
export function fmt(n: number): string {
  const rounded = Math.round(n * 100) / 100;
  return Object.is(rounded, -0) ? "0" : String(rounded);
}

export function escapeXml(text: string): string {
  return text.replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] ?? c,
  );
}

export type Point = [number, number];

export function points(list: readonly Point[]): string {
  return list.map(([x, y]) => `${fmt(x)},${fmt(y)}`).join(" ");
}

export interface StrokeOptions {
  dashed?: boolean | undefined;
  width?: number;
}

export function stroke({ dashed, width = 1.6 }: StrokeOptions = {}): string {
  return `stroke="currentColor" stroke-width="${fmt(width)}"${dashed ? ' stroke-dasharray="6 4"' : ""}`;
}

export function line(a: Point, b: Point, options: StrokeOptions = {}): string {
  return `<line x1="${fmt(a[0])}" y1="${fmt(a[1])}" x2="${fmt(b[0])}" y2="${fmt(b[1])}" ${stroke(options)} stroke-linecap="round"/>`;
}

export function polyline(list: readonly Point[], options: StrokeOptions = {}): string {
  return `<polyline points="${points(list)}" fill="none" ${stroke(options)} stroke-linejoin="round" stroke-linecap="round"/>`;
}

export function polygon(
  list: readonly Point[],
  options: StrokeOptions & { shaded?: boolean | undefined } = {},
): string {
  const fill = options.shaded ? `fill="currentColor" fill-opacity="0.15"` : `fill="none"`;
  return `<polygon points="${points(list)}" ${fill} ${stroke(options)} stroke-linejoin="round"/>`;
}

export function circle(
  c: Point,
  r: number,
  options: StrokeOptions & { filled?: boolean } = {},
): string {
  const fill = options.filled ? `fill="currentColor"` : `fill="none"`;
  return `<circle cx="${fmt(c[0])}" cy="${fmt(c[1])}" r="${fmt(r)}" ${fill} ${stroke(options)}/>`;
}

export function path(d: string, options: StrokeOptions & { fill?: string } = {}): string {
  return `<path d="${d}" fill="${options.fill ?? "none"}" ${stroke(options)} stroke-linecap="round" stroke-linejoin="round"/>`;
}
