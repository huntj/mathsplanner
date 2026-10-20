// Building Rich text without index bookkeeping: strings become text, math() becomes maths, and
// figure(spec) drops a diagram in place. A Collector numbers the diagrams as it meets them.
import {
  toLatex,
  type DiagramSpec,
  type LatexValue,
  type Rich,
  type RichNode,
} from "@mathsplanner/core";

/** A diagram to place inline; the collector gives it an index. */
export interface Figure {
  figure: DiagramSpec;
}

export type RichItem = string | RichNode | Figure | readonly RichItem[];
/** Anything that can become Rich: a string, nodes, figures, or a list of them. */
export type RichInput = RichItem;

/** Inline maths from LaTeX or a number, Rational or Surd. */
export function math(value: LatexValue): RichNode {
  return { t: "math", v: toLatex(value) };
}

/** Display maths on its own line. */
export function displayMath(value: LatexValue): RichNode {
  return { t: "math", v: toLatex(value), display: true };
}

/** A diagram placed where it appears in the text. */
export function figure(spec: DiagramSpec): Figure {
  return { figure: spec };
}

const isFigure = (item: RichItem): item is Figure =>
  typeof item === "object" && item !== null && !Array.isArray(item) && "figure" in item;

/** Collects the diagrams a question uses, so archetypes can build Rich anywhere. */
export class Collector {
  readonly diagrams: DiagramSpec[] = [];

  add(spec: DiagramSpec): number {
    const existing = this.diagrams.indexOf(spec);
    if (existing >= 0) return existing;
    this.diagrams.push(spec);
    return this.diagrams.length - 1;
  }

  rich(input: RichInput | undefined): Rich {
    if (input === undefined) return [];
    if (typeof input === "string") return input ? [{ t: "text", v: input }] : [];
    if (Array.isArray(input))
      return (input as readonly RichItem[]).flatMap((item) => this.rich(item));
    if (isFigure(input as RichItem))
      return [{ t: "diagram", i: this.add((input as Figure).figure) }];
    return [input as RichNode];
  }
}

/** Rich text with no diagrams, e.g. for feedback. */
export function rich(...items: RichItem[]): Rich {
  return new Collector().rich(items);
}
