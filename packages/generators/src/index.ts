// @mathsplanner/generators: one generator per statement, by key stage. See docs/design.md.
// Add each new generator to the list below so the gallery and registry can find it.
import type { Generator } from "@mathsplanner/core";
import nNpv01 from "./eyfs/N-NPV-01.ts";
import nNpv02 from "./eyfs/N-NPV-02.ts";
import nNpv03 from "./eyfs/N-NPV-03.ts";
import nNpv04 from "./eyfs/N-NPV-04.ts";
import nNpv05 from "./eyfs/N-NPV-05.ts";
import nNpv06 from "./eyfs/N-NPV-06.ts";
import nNpv07 from "./eyfs/N-NPV-07.ts";
import nNpv08 from "./eyfs/N-NPV-08.ts";
import rNpv01 from "./eyfs/R-NPV-01.ts";
import rNpv02 from "./eyfs/R-NPV-02.ts";
import rNpv03 from "./eyfs/R-NPV-03.ts";
import rNpv04 from "./eyfs/R-NPV-04.ts";
import rNpv05 from "./eyfs/R-NPV-05.ts";
import rNpv06 from "./eyfs/R-NPV-06.ts";
import rNpv07 from "./eyfs/R-NPV-07.ts";
import rNpv08 from "./eyfs/R-NPV-08.ts";
import rNpv09 from "./eyfs/R-NPV-09.ts";
import rNpv10 from "./eyfs/R-NPV-10.ts";
import y1Npv01 from "./ks1/Y1-NPV-01.ts";
import y1Npv02 from "./ks1/Y1-NPV-02.ts";
import y1Npv03 from "./ks1/Y1-NPV-03.ts";
import y1Npv04 from "./ks1/Y1-NPV-04.ts";
import y1Npv05 from "./ks1/Y1-NPV-05.ts";
import y1Geo01 from "./ks1/Y1-GEO-01.ts";
import y1Pos01 from "./ks1/Y1-POS-01.ts";
import y2Npv01 from "./ks1/Y2-NPV-01.ts";
import y2Npv02 from "./ks1/Y2-NPV-02.ts";
import y2Npv03 from "./ks1/Y2-NPV-03.ts";
import y2Npv04 from "./ks1/Y2-NPV-04.ts";
import y2Npv05 from "./ks1/Y2-NPV-05.ts";
import y2Npv06 from "./ks1/Y2-NPV-06.ts";
import y2Geo01 from "./ks1/Y2-GEO-01.ts";
import y2Pos02 from "./ks1/Y2-POS-02.ts";
import y3Geo02 from "./ks2/Y3-GEO-02.ts";
import y3Geo03 from "./ks2/Y3-GEO-03.ts";
import y3Geo04 from "./ks2/Y3-GEO-04.ts";
import y4Geo01 from "./ks2/Y4-GEO-01.ts";
import y4Geo02 from "./ks2/Y4-GEO-02.ts";
import y4Geo03 from "./ks2/Y4-GEO-03.ts";
import y4Geo04 from "./ks2/Y4-GEO-04.ts";
import y5Geo02 from "./ks2/Y5-GEO-02.ts";
import y5Geo03 from "./ks2/Y5-GEO-03.ts";
import y5Geo04 from "./ks2/Y5-GEO-04.ts";
import y5Geo05 from "./ks2/Y5-GEO-05.ts";
import y5Geo06 from "./ks2/Y5-GEO-06.ts";
import y6Geo01 from "./ks2/Y6-GEO-01.ts";
import y6Geo03 from "./ks2/Y6-GEO-03.ts";
import y6Geo04 from "./ks2/Y6-GEO-04.ts";
import y6Geo05 from "./ks2/Y6-GEO-05.ts";
import y7Geo03 from "./ks3/Y7-GEO-03.ts";
import y7Geo04 from "./ks3/Y7-GEO-04.ts";
import y7Geo05 from "./ks3/Y7-GEO-05.ts";
import y7Geo06 from "./ks3/Y7-GEO-06.ts";
import y8Geo02 from "./ks3/Y8-GEO-02.ts";
import y8Geo03 from "./ks3/Y8-GEO-03.ts";
import y8Geo05 from "./ks3/Y8-GEO-05.ts";
import y9Geo03 from "./ks3/Y9-GEO-03.ts";
import gfG1 from "./ks4/GF-G1.ts";
import gfG3 from "./ks4/GF-G3.ts";
import gfG4 from "./ks4/GF-G4.ts";
import gfG5 from "./ks4/GF-G5.ts";
import gfG6 from "./ks4/GF-G6.ts";
import gfG9 from "./ks4/GF-G9.ts";
import ghG10 from "./ks4/GH-G10.ts";
import gfG15 from "./ks4/GF-G15.ts";

/** Every generator, in the order of data/statements.json. */
export const generators: Generator[] = [
  nNpv01,
  nNpv02,
  nNpv03,
  nNpv04,
  nNpv05,
  nNpv06,
  nNpv07,
  nNpv08,
  rNpv01,
  rNpv02,
  rNpv03,
  rNpv04,
  rNpv05,
  rNpv06,
  rNpv07,
  rNpv08,
  rNpv09,
  rNpv10,
  y1Npv01,
  y1Npv02,
  y1Npv03,
  y1Npv04,
  y1Npv05,
  y1Geo01,
  y1Pos01,
  y2Npv01,
  y2Npv02,
  y2Npv03,
  y2Npv04,
  y2Npv05,
  y2Npv06,
  y2Geo01,
  y2Pos02,
  y3Geo02,
  y3Geo03,
  y3Geo04,
  y4Geo01,
  y4Geo02,
  y4Geo03,
  y4Geo04,
  y5Geo02,
  y5Geo03,
  y5Geo04,
  y5Geo05,
  y5Geo06,
  y6Geo01,
  y6Geo03,
  y6Geo04,
  y6Geo05,
  y7Geo03,
  y7Geo04,
  y7Geo05,
  y7Geo06,
  y8Geo02,
  y8Geo03,
  y8Geo05,
  y9Geo03,
  gfG1,
  gfG3,
  gfG4,
  gfG5,
  gfG6,
  gfG9,
  ghG10,
  gfG15,
] as Generator[];

/** Unreviewed placeholders that exercise the gallery; real generators replace them. */
export const examples: Generator[] = [];

export { selectQuestions, type SelectedItem, type Selection } from "./select.ts";
