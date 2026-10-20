// @mathsplanner/generators: one generator per statement, by key stage. See docs/design.md.
// Add each new generator to the list below so the gallery and registry can find it.
import type { Generator } from "@mathsplanner/core";
import y5Geo04 from "./ks2/Y5-GEO-04.ts";
import y6Geo03 from "./ks2/Y6-GEO-03.ts";
import y6Geo05 from "./ks2/Y6-GEO-05.ts";
import y7Geo05 from "./ks3/Y7-GEO-05.ts";
import y7Geo06 from "./ks3/Y7-GEO-06.ts";
import y8Geo05 from "./ks3/Y8-GEO-05.ts";
import gfG3 from "./ks4/GF-G3.ts";

/** Every generator, in the order of data/statements.json. */
export const generators: Generator[] = [
  y5Geo04,
  y6Geo03,
  y6Geo05,
  y7Geo05,
  y7Geo06,
  y8Geo05,
  gfG3,
] as Generator[];

/** Unreviewed placeholders that exercise the gallery; real generators replace them. */
export const examples: Generator[] = [];
