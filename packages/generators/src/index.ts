// @mathsplanner/generators: one generator per statement, by key stage. See docs/design.md.
// Add each new generator to the list below so the gallery and registry can find it.
import type { Generator } from "@mathsplanner/core";
import y1Geo01 from "./ks1/Y1-GEO-01.ts";
import y1Pos01 from "./ks1/Y1-POS-01.ts";
import y2Pos02 from "./ks1/Y2-POS-02.ts";
import y3Geo02 from "./ks2/Y3-GEO-02.ts";
import y3Geo03 from "./ks2/Y3-GEO-03.ts";
import y3Geo04 from "./ks2/Y3-GEO-04.ts";
import y4Geo02 from "./ks2/Y4-GEO-02.ts";
import y5Geo02 from "./ks2/Y5-GEO-02.ts";
import y5Geo03 from "./ks2/Y5-GEO-03.ts";
import y5Geo04 from "./ks2/Y5-GEO-04.ts";
import y6Geo01 from "./ks2/Y6-GEO-01.ts";
import y6Geo03 from "./ks2/Y6-GEO-03.ts";
import y6Geo05 from "./ks2/Y6-GEO-05.ts";
import y7Geo03 from "./ks3/Y7-GEO-03.ts";
import y7Geo05 from "./ks3/Y7-GEO-05.ts";
import y7Geo06 from "./ks3/Y7-GEO-06.ts";
import y8Geo05 from "./ks3/Y8-GEO-05.ts";
import gfG3 from "./ks4/GF-G3.ts";
import gfG15 from "./ks4/GF-G15.ts";

/** Every generator, in the order of data/statements.json. */
export const generators: Generator[] = [
  y1Geo01,
  y1Pos01,
  y2Pos02,
  y3Geo02,
  y3Geo03,
  y3Geo04,
  y4Geo02,
  y5Geo02,
  y5Geo03,
  y5Geo04,
  y6Geo01,
  y6Geo03,
  y6Geo05,
  y7Geo03,
  y7Geo05,
  y7Geo06,
  y8Geo05,
  gfG3,
  gfG15,
] as Generator[];

/** Unreviewed placeholders that exercise the gallery; real generators replace them. */
export const examples: Generator[] = [];
