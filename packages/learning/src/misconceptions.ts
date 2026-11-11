// The misconception catalogue's descriptions, for feedback and the "fix my mistakes" list.
import catalogueFile from "../../../data/misconceptions.json" with { type: "json" };

const catalogue = new Map(
  (catalogueFile as { misconceptions: { code: string; description: string }[] }).misconceptions.map(
    (m) => [m.code, m.description],
  ),
);

/** The catalogue's description of a misconception code. */
export const describeMisconception = (code: string): string | undefined => catalogue.get(code);
