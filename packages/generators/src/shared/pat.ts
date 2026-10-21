// Repeating patterns of shapes for the early years and KS1: units such as AB, ABB and ABC built from
// filled and empty shapes, drawn as a row with optional gaps.
import type { Rng } from "@mathsplanner/core";
import type { CounterShape, CountersSpec } from "@mathsplanner/diagrams";

export interface Item {
  shape: CounterShape;
  filled: boolean;
}

const SHAPES: CounterShape[] = ["circle", "square", "triangle", "star"];
export const ITEMS: Item[] = SHAPES.flatMap((shape) => [
  { shape, filled: true },
  { shape, filled: false },
]);

export const itemName = (it: Item) => `${it.filled ? "filled" : "empty"} ${it.shape}`;
export const sameItem = (a: Item | undefined, b: Item | undefined) =>
  a !== undefined && b !== undefined && a.shape === b.shape && a.filled === b.filled;

export type Kind = "AB" | "ABB" | "AAB" | "ABC";

/** A repeating unit of the given kind, using different-looking items. */
export function pickUnit(rng: Rng, kind: Kind): Item[] {
  // Different shapes, so even outlines alone tell them apart.
  const shapes = rng.shuffle(SHAPES).slice(0, 3);
  const [a, b, c] = shapes.map((shape) => ({ shape, filled: rng.bool() })) as [Item, Item, Item];
  return kind === "AB"
    ? [a, b]
    : kind === "ABB"
      ? [a, b, b]
      : kind === "AAB"
        ? [a, a, b]
        : [a, b, c];
}

/** The unit repeated to `length` items. */
export const repeat = (unit: Item[], length: number): Item[] =>
  Array.from({ length }, (_, i) => unit[i % unit.length] as Item);

/** A row of items with gaps (nulls) at the given positions. */
export function row(items: (Item | null)[], description?: string): CountersSpec {
  return {
    type: "counters",
    layout: "pattern",
    items: items.map((it) =>
      it ? { shape: it.shape, ...(it.filled ? {} : { filled: false }) } : null,
    ),
    ...(description ? { description } : {}),
  };
}

/** Wrong guesses for the next item: the last item repeated, and another item from the unit. */
export function nextGuesses(unit: Item[], length: number): Item[] {
  const right = unit[length % unit.length] as Item;
  const last = unit[(length - 1) % unit.length] as Item;
  const others = unit.filter((u) => !sameItem(u, right));
  const out: Item[] = [];
  for (const g of [last, ...others])
    if (!sameItem(g, right) && !out.some((o) => sameItem(o, g))) out.push(g);
  return out;
}
