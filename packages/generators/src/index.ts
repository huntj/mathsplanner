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
import nAs01 from "./eyfs/N-AS-01.ts";
import nNpv08 from "./eyfs/N-NPV-08.ts";
import rNpv01 from "./eyfs/R-NPV-01.ts";
import rNpv02 from "./eyfs/R-NPV-02.ts";
import rNpv03 from "./eyfs/R-NPV-03.ts";
import rNpv04 from "./eyfs/R-NPV-04.ts";
import rNpv05 from "./eyfs/R-NPV-05.ts";
import rNpv06 from "./eyfs/R-NPV-06.ts";
import rNpv07 from "./eyfs/R-NPV-07.ts";
import rNpv08 from "./eyfs/R-NPV-08.ts";
import rAs01 from "./eyfs/R-AS-01.ts";
import rNpv09 from "./eyfs/R-NPV-09.ts";
import rNpv10 from "./eyfs/R-NPV-10.ts";
import y1Npv01 from "./ks1/Y1-NPV-01.ts";
import y1Npv02 from "./ks1/Y1-NPV-02.ts";
import y1Npv03 from "./ks1/Y1-NPV-03.ts";
import y1Npv04 from "./ks1/Y1-NPV-04.ts";
import y1Npv05 from "./ks1/Y1-NPV-05.ts";
import y1As01 from "./ks1/Y1-AS-01.ts";
import y1As02 from "./ks1/Y1-AS-02.ts";
import y1As03 from "./ks1/Y1-AS-03.ts";
import y1As04 from "./ks1/Y1-AS-04.ts";
import y1Md01 from "./ks1/Y1-MD-01.ts";
import y1Geo01 from "./ks1/Y1-GEO-01.ts";
import y1Pos01 from "./ks1/Y1-POS-01.ts";
import y2Npv01 from "./ks1/Y2-NPV-01.ts";
import y2Npv02 from "./ks1/Y2-NPV-02.ts";
import y2Npv03 from "./ks1/Y2-NPV-03.ts";
import y2Npv04 from "./ks1/Y2-NPV-04.ts";
import y2Npv05 from "./ks1/Y2-NPV-05.ts";
import y2Npv06 from "./ks1/Y2-NPV-06.ts";
import y2As01 from "./ks1/Y2-AS-01.ts";
import y2As02 from "./ks1/Y2-AS-02.ts";
import y2As03 from "./ks1/Y2-AS-03.ts";
import y2As04 from "./ks1/Y2-AS-04.ts";
import y2As05 from "./ks1/Y2-AS-05.ts";
import y2Md01 from "./ks1/Y2-MD-01.ts";
import y2Md02 from "./ks1/Y2-MD-02.ts";
import y2Md03 from "./ks1/Y2-MD-03.ts";
import y2Md04 from "./ks1/Y2-MD-04.ts";
import y2Geo01 from "./ks1/Y2-GEO-01.ts";
import y2Pos02 from "./ks1/Y2-POS-02.ts";
import y3Npv01 from "./ks2/Y3-NPV-01.ts";
import y3Npv02 from "./ks2/Y3-NPV-02.ts";
import y3Npv03 from "./ks2/Y3-NPV-03.ts";
import y3Npv04 from "./ks2/Y3-NPV-04.ts";
import y3Npv05 from "./ks2/Y3-NPV-05.ts";
import y3Npv06 from "./ks2/Y3-NPV-06.ts";
import y3As01 from "./ks2/Y3-AS-01.ts";
import y3As02 from "./ks2/Y3-AS-02.ts";
import y3As03 from "./ks2/Y3-AS-03.ts";
import y3As04 from "./ks2/Y3-AS-04.ts";
import y3Md01 from "./ks2/Y3-MD-01.ts";
import y3Md02 from "./ks2/Y3-MD-02.ts";
import y3Md03 from "./ks2/Y3-MD-03.ts";
import y3Geo02 from "./ks2/Y3-GEO-02.ts";
import y3Geo03 from "./ks2/Y3-GEO-03.ts";
import y3Geo04 from "./ks2/Y3-GEO-04.ts";
import y4Npv01 from "./ks2/Y4-NPV-01.ts";
import y4Npv02 from "./ks2/Y4-NPV-02.ts";
import y4Npv03 from "./ks2/Y4-NPV-03.ts";
import y4Npv04 from "./ks2/Y4-NPV-04.ts";
import y4Npv05 from "./ks2/Y4-NPV-05.ts";
import y4Npv06 from "./ks2/Y4-NPV-06.ts";
import y4Npv07 from "./ks2/Y4-NPV-07.ts";
import y4Npv08 from "./ks2/Y4-NPV-08.ts";
import y4Npv09 from "./ks2/Y4-NPV-09.ts";
import y4As01 from "./ks2/Y4-AS-01.ts";
import y4As02 from "./ks2/Y4-AS-02.ts";
import y4As03 from "./ks2/Y4-AS-03.ts";
import y4Md01 from "./ks2/Y4-MD-01.ts";
import y4Md02 from "./ks2/Y4-MD-02.ts";
import y4Md03 from "./ks2/Y4-MD-03.ts";
import y4Md04 from "./ks2/Y4-MD-04.ts";
import y4Md05 from "./ks2/Y4-MD-05.ts";
import y4Geo01 from "./ks2/Y4-GEO-01.ts";
import y4Geo02 from "./ks2/Y4-GEO-02.ts";
import y4Geo03 from "./ks2/Y4-GEO-03.ts";
import y4Geo04 from "./ks2/Y4-GEO-04.ts";
import y5Npv01 from "./ks2/Y5-NPV-01.ts";
import y5Npv02 from "./ks2/Y5-NPV-02.ts";
import y5Npv03 from "./ks2/Y5-NPV-03.ts";
import y5Npv04 from "./ks2/Y5-NPV-04.ts";
import y5Npv05 from "./ks2/Y5-NPV-05.ts";
import y5Npv06 from "./ks2/Y5-NPV-06.ts";
import y5As01 from "./ks2/Y5-AS-01.ts";
import y5As02 from "./ks2/Y5-AS-02.ts";
import y5As03 from "./ks2/Y5-AS-03.ts";
import y5As04 from "./ks2/Y5-AS-04.ts";
import y5Md01 from "./ks2/Y5-MD-01.ts";
import y5Md02 from "./ks2/Y5-MD-02.ts";
import y5Md03 from "./ks2/Y5-MD-03.ts";
import y5Md04 from "./ks2/Y5-MD-04.ts";
import y5Md05 from "./ks2/Y5-MD-05.ts";
import y5Md06 from "./ks2/Y5-MD-06.ts";
import y5Md07 from "./ks2/Y5-MD-07.ts";
import y5Md08 from "./ks2/Y5-MD-08.ts";
import y5Md09 from "./ks2/Y5-MD-09.ts";
import y5Geo02 from "./ks2/Y5-GEO-02.ts";
import y5Geo03 from "./ks2/Y5-GEO-03.ts";
import y5Geo04 from "./ks2/Y5-GEO-04.ts";
import y5Geo05 from "./ks2/Y5-GEO-05.ts";
import y5Geo06 from "./ks2/Y5-GEO-06.ts";
import y6Npv01 from "./ks2/Y6-NPV-01.ts";
import y6Npv02 from "./ks2/Y6-NPV-02.ts";
import y6Npv03 from "./ks2/Y6-NPV-03.ts";
import y6Npv04 from "./ks2/Y6-NPV-04.ts";
import y6Md01 from "./ks2/Y6-MD-01.ts";
import y6Md02 from "./ks2/Y6-MD-02.ts";
import y6Md03 from "./ks2/Y6-MD-03.ts";
import y6Md04 from "./ks2/Y6-MD-04.ts";
import y6Md05 from "./ks2/Y6-MD-05.ts";
import y6Md06 from "./ks2/Y6-MD-06.ts";
import y6Md07 from "./ks2/Y6-MD-07.ts";
import y6Md08 from "./ks2/Y6-MD-08.ts";
import y6Geo01 from "./ks2/Y6-GEO-01.ts";
import y6Geo03 from "./ks2/Y6-GEO-03.ts";
import y6Geo04 from "./ks2/Y6-GEO-04.ts";
import y6Geo05 from "./ks2/Y6-GEO-05.ts";
import y7Npv01 from "./ks3/Y7-NPV-01.ts";
import y7Npv02 from "./ks3/Y7-NPV-02.ts";
import y7Npv03 from "./ks3/Y7-NPV-03.ts";
import y7Npv04 from "./ks3/Y7-NPV-04.ts";
import y7Npv05 from "./ks3/Y7-NPV-05.ts";
import y7Npv06 from "./ks3/Y7-NPV-06.ts";
import y7Npv07 from "./ks3/Y7-NPV-07.ts";
import y7Npv08 from "./ks3/Y7-NPV-08.ts";
import y7Npv09 from "./ks3/Y7-NPV-09.ts";
import y7Npv10 from "./ks3/Y7-NPV-10.ts";
import y7Geo03 from "./ks3/Y7-GEO-03.ts";
import y7Geo04 from "./ks3/Y7-GEO-04.ts";
import y7Geo05 from "./ks3/Y7-GEO-05.ts";
import y7Geo06 from "./ks3/Y7-GEO-06.ts";
import y8Npv01 from "./ks3/Y8-NPV-01.ts";
import y8Npv02 from "./ks3/Y8-NPV-02.ts";
import y8Geo02 from "./ks3/Y8-GEO-02.ts";
import y8Geo03 from "./ks3/Y8-GEO-03.ts";
import y8Geo05 from "./ks3/Y8-GEO-05.ts";
import y9Npv01 from "./ks3/Y9-NPV-01.ts";
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
  nAs01,
  nNpv08,
  rNpv01,
  rNpv02,
  rNpv03,
  rNpv04,
  rNpv05,
  rNpv06,
  rNpv07,
  rNpv08,
  rAs01,
  rNpv09,
  rNpv10,
  y1Npv01,
  y1Npv02,
  y1Npv03,
  y1Npv04,
  y1Npv05,
  y1As01,
  y1As02,
  y1As03,
  y1As04,
  y1Md01,
  y1Geo01,
  y1Pos01,
  y2Npv01,
  y2Npv02,
  y2Npv03,
  y2Npv04,
  y2Npv05,
  y2Npv06,
  y2As01,
  y2As02,
  y2As03,
  y2As04,
  y2As05,
  y2Md01,
  y2Md02,
  y2Md03,
  y2Md04,
  y2Geo01,
  y2Pos02,
  y3Npv01,
  y3Npv02,
  y3Npv03,
  y3Npv04,
  y3Npv05,
  y3Npv06,
  y3As01,
  y3As02,
  y3As03,
  y3As04,
  y3Md01,
  y3Md02,
  y3Md03,
  y3Geo02,
  y3Geo03,
  y3Geo04,
  y4Npv01,
  y4Npv02,
  y4Npv03,
  y4Npv04,
  y4Npv05,
  y4Npv06,
  y4Npv07,
  y4Npv08,
  y4Npv09,
  y4As01,
  y4As02,
  y4As03,
  y4Md01,
  y4Md02,
  y4Md03,
  y4Md04,
  y4Md05,
  y4Geo01,
  y4Geo02,
  y4Geo03,
  y4Geo04,
  y5Npv01,
  y5Npv02,
  y5Npv03,
  y5Npv04,
  y5Npv05,
  y5Npv06,
  y5As01,
  y5As02,
  y5As03,
  y5As04,
  y5Md01,
  y5Md02,
  y5Md03,
  y5Md04,
  y5Md05,
  y5Md06,
  y5Md07,
  y5Md08,
  y5Md09,
  y5Geo02,
  y5Geo03,
  y5Geo04,
  y5Geo05,
  y5Geo06,
  y6Npv01,
  y6Npv02,
  y6Npv03,
  y6Npv04,
  y6Md01,
  y6Md02,
  y6Md03,
  y6Md04,
  y6Md05,
  y6Md06,
  y6Md07,
  y6Md08,
  y6Geo01,
  y6Geo03,
  y6Geo04,
  y6Geo05,
  y7Npv01,
  y7Npv02,
  y7Npv03,
  y7Npv04,
  y7Npv05,
  y7Npv06,
  y7Npv07,
  y7Npv08,
  y7Npv09,
  y7Npv10,
  y7Geo03,
  y7Geo04,
  y7Geo05,
  y7Geo06,
  y8Npv01,
  y8Npv02,
  y8Geo02,
  y8Geo03,
  y8Geo05,
  y9Npv01,
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
