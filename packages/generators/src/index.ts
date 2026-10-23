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
import nPos01 from "./eyfs/N-POS-01.ts";
import nPos02 from "./eyfs/N-POS-02.ts";
import nPos03 from "./eyfs/N-POS-03.ts";
import nMea01 from "./eyfs/N-MEA-01.ts";
import nMea01A from "./eyfs/N-MEA-01_a.ts";
import nMea01B from "./eyfs/N-MEA-01_b.ts";
import nMea01C from "./eyfs/N-MEA-01_c.ts";
import nGeo01 from "./eyfs/N-GEO-01.ts";
import nGeo02 from "./eyfs/N-GEO-02.ts";
import nPat01 from "./eyfs/N-PAT-01.ts";
import nPat02 from "./eyfs/N-PAT-02.ts";
import nPat03 from "./eyfs/N-PAT-03.ts";
import nMea02 from "./eyfs/N-MEA-02.ts";
import rNpv01 from "./eyfs/R-NPV-01.ts";
import rNpv02 from "./eyfs/R-NPV-02.ts";
import rNpv03 from "./eyfs/R-NPV-03.ts";
import rNpv04 from "./eyfs/R-NPV-04.ts";
import rNpv05 from "./eyfs/R-NPV-05.ts";
import rNpv06 from "./eyfs/R-NPV-06.ts";
import rNpv07 from "./eyfs/R-NPV-07.ts";
import rNpv08 from "./eyfs/R-NPV-08.ts";
import rAs01 from "./eyfs/R-AS-01.ts";
import rAs01A from "./eyfs/R-AS-01_a.ts";
import rAs01B from "./eyfs/R-AS-01_b.ts";
import rNpv09 from "./eyfs/R-NPV-09.ts";
import rNpv10 from "./eyfs/R-NPV-10.ts";
import rPat01 from "./eyfs/R-PAT-01.ts";
import rPat01A from "./eyfs/R-PAT-01_a.ts";
import rPat01B from "./eyfs/R-PAT-01_b.ts";
import rPat01C from "./eyfs/R-PAT-01_c.ts";
import rGeo01 from "./eyfs/R-GEO-01.ts";
import rGeo02 from "./eyfs/R-GEO-02.ts";
import rPat02 from "./eyfs/R-PAT-02.ts";
import rMea01 from "./eyfs/R-MEA-01.ts";
import rMea01A from "./eyfs/R-MEA-01_a.ts";
import rMea01B from "./eyfs/R-MEA-01_b.ts";
import rMea01C from "./eyfs/R-MEA-01_c.ts";
import y1Npv01 from "./ks1/Y1-NPV-01.ts";
import y1Npv01A from "./ks1/Y1-NPV-01_a.ts";
import y1Npv01B from "./ks1/Y1-NPV-01_b.ts";
import y1Npv02 from "./ks1/Y1-NPV-02.ts";
import y1Npv02A from "./ks1/Y1-NPV-02_a.ts";
import y1Npv02B from "./ks1/Y1-NPV-02_b.ts";
import y1Npv02C from "./ks1/Y1-NPV-02_c.ts";
import y1Npv02D from "./ks1/Y1-NPV-02_d.ts";
import y1Npv03 from "./ks1/Y1-NPV-03.ts";
import y1Npv04 from "./ks1/Y1-NPV-04.ts";
import y1Npv04A from "./ks1/Y1-NPV-04_a.ts";
import y1Npv04B from "./ks1/Y1-NPV-04_b.ts";
import y1Npv04C from "./ks1/Y1-NPV-04_c.ts";
import y1Npv05 from "./ks1/Y1-NPV-05.ts";
import y1As01 from "./ks1/Y1-AS-01.ts";
import y1As02 from "./ks1/Y1-AS-02.ts";
import y1As02A from "./ks1/Y1-AS-02_a.ts";
import y1As02B from "./ks1/Y1-AS-02_b.ts";
import y1As02C from "./ks1/Y1-AS-02_c.ts";
import y1As03 from "./ks1/Y1-AS-03.ts";
import y1As03A from "./ks1/Y1-AS-03_a.ts";
import y1As03B from "./ks1/Y1-AS-03_b.ts";
import y1As03C from "./ks1/Y1-AS-03_c.ts";
import y1As04 from "./ks1/Y1-AS-04.ts";
import y1As04A from "./ks1/Y1-AS-04_a.ts";
import y1As04B from "./ks1/Y1-AS-04_b.ts";
import y1Md01 from "./ks1/Y1-MD-01.ts";
import y1Md01A from "./ks1/Y1-MD-01_a.ts";
import y1Md01B from "./ks1/Y1-MD-01_b.ts";
import y1Md01C from "./ks1/Y1-MD-01_c.ts";
import y1Fr01 from "./ks1/Y1-FR-01.ts";
import y1Fr02 from "./ks1/Y1-FR-02.ts";
import y1Mea01 from "./ks1/Y1-MEA-01.ts";
import y1Mea01A from "./ks1/Y1-MEA-01_a.ts";
import y1Mea01B from "./ks1/Y1-MEA-01_b.ts";
import y1Mea01C from "./ks1/Y1-MEA-01_c.ts";
import y1Mea01D from "./ks1/Y1-MEA-01_d.ts";
import y1Mea02 from "./ks1/Y1-MEA-02.ts";
import y1Mea02A from "./ks1/Y1-MEA-02_a.ts";
import y1Mea02B from "./ks1/Y1-MEA-02_b.ts";
import y1Mea02C from "./ks1/Y1-MEA-02_c.ts";
import y1Mea02D from "./ks1/Y1-MEA-02_d.ts";
import y1Mea03 from "./ks1/Y1-MEA-03.ts";
import y1Mea04 from "./ks1/Y1-MEA-04.ts";
import y1Mea05 from "./ks1/Y1-MEA-05.ts";
import y1Mea06 from "./ks1/Y1-MEA-06.ts";
import y1Mea06A from "./ks1/Y1-MEA-06_a.ts";
import y1Mea06B from "./ks1/Y1-MEA-06_b.ts";
import y1Mea06C from "./ks1/Y1-MEA-06_c.ts";
import y1Geo01 from "./ks1/Y1-GEO-01.ts";
import y1Geo02 from "./ks1/Y1-GEO-02.ts";
import y1Pos01 from "./ks1/Y1-POS-01.ts";
import y1Pos01A from "./ks1/Y1-POS-01_a.ts";
import y1Pos01B from "./ks1/Y1-POS-01_b.ts";
import y1Pos01C from "./ks1/Y1-POS-01_c.ts";
import y2Npv01 from "./ks1/Y2-NPV-01.ts";
import y2Npv01A from "./ks1/Y2-NPV-01_a.ts";
import y2Npv01B from "./ks1/Y2-NPV-01_b.ts";
import y2Npv01C from "./ks1/Y2-NPV-01_c.ts";
import y2Npv02 from "./ks1/Y2-NPV-02.ts";
import y2Npv03 from "./ks1/Y2-NPV-03.ts";
import y2Npv04 from "./ks1/Y2-NPV-04.ts";
import y2Npv04A from "./ks1/Y2-NPV-04_a.ts";
import y2Npv04B from "./ks1/Y2-NPV-04_b.ts";
import y2Npv05 from "./ks1/Y2-NPV-05.ts";
import y2Npv06 from "./ks1/Y2-NPV-06.ts";
import y2As01 from "./ks1/Y2-AS-01.ts";
import y2As01A from "./ks1/Y2-AS-01_a.ts";
import y2As01B from "./ks1/Y2-AS-01_b.ts";
import y2As02 from "./ks1/Y2-AS-02.ts";
import y2As02A from "./ks1/Y2-AS-02_a.ts";
import y2As02B from "./ks1/Y2-AS-02_b.ts";
import y2As02C from "./ks1/Y2-AS-02_c.ts";
import y2As02D from "./ks1/Y2-AS-02_d.ts";
import y2As03 from "./ks1/Y2-AS-03.ts";
import y2As04 from "./ks1/Y2-AS-04.ts";
import y2As05 from "./ks1/Y2-AS-05.ts";
import y2Md01 from "./ks1/Y2-MD-01.ts";
import y2Md01A from "./ks1/Y2-MD-01_a.ts";
import y2Md01B from "./ks1/Y2-MD-01_b.ts";
import y2Md01C from "./ks1/Y2-MD-01_c.ts";
import y2Md01D from "./ks1/Y2-MD-01_d.ts";
import y2Md02 from "./ks1/Y2-MD-02.ts";
import y2Md03 from "./ks1/Y2-MD-03.ts";
import y2Md04 from "./ks1/Y2-MD-04.ts";
import y2Md04A from "./ks1/Y2-MD-04_a.ts";
import y2Md04B from "./ks1/Y2-MD-04_b.ts";
import y2Fr01 from "./ks1/Y2-FR-01.ts";
import y2Fr01A from "./ks1/Y2-FR-01_a.ts";
import y2Fr01B from "./ks1/Y2-FR-01_b.ts";
import y2Fr01C from "./ks1/Y2-FR-01_c.ts";
import y2Fr02 from "./ks1/Y2-FR-02.ts";
import y2Fr02A from "./ks1/Y2-FR-02_a.ts";
import y2Fr02B from "./ks1/Y2-FR-02_b.ts";
import y2Mea01 from "./ks1/Y2-MEA-01.ts";
import y2Mea01A from "./ks1/Y2-MEA-01_a.ts";
import y2Mea01B from "./ks1/Y2-MEA-01_b.ts";
import y2Mea01C from "./ks1/Y2-MEA-01_c.ts";
import y2Mea01D from "./ks1/Y2-MEA-01_d.ts";
import y2Mea02 from "./ks1/Y2-MEA-02.ts";
import y2Mea02A from "./ks1/Y2-MEA-02_a.ts";
import y2Mea02B from "./ks1/Y2-MEA-02_b.ts";
import y2Mea02C from "./ks1/Y2-MEA-02_c.ts";
import y2Mea03 from "./ks1/Y2-MEA-03.ts";
import y2Mea03A from "./ks1/Y2-MEA-03_a.ts";
import y2Mea03B from "./ks1/Y2-MEA-03_b.ts";
import y2Mea03C from "./ks1/Y2-MEA-03_c.ts";
import y2Mea04 from "./ks1/Y2-MEA-04.ts";
import y2Mea05 from "./ks1/Y2-MEA-05.ts";
import y2Mea06 from "./ks1/Y2-MEA-06.ts";
import y2Mea06A from "./ks1/Y2-MEA-06_a.ts";
import y2Mea06B from "./ks1/Y2-MEA-06_b.ts";
import y2Mea07 from "./ks1/Y2-MEA-07.ts";
import y2Geo01 from "./ks1/Y2-GEO-01.ts";
import y2Geo01A from "./ks1/Y2-GEO-01_a.ts";
import y2Geo01B from "./ks1/Y2-GEO-01_b.ts";
import y2Geo02 from "./ks1/Y2-GEO-02.ts";
import y2Geo02A from "./ks1/Y2-GEO-02_a.ts";
import y2Geo02B from "./ks1/Y2-GEO-02_b.ts";
import y2Geo03 from "./ks1/Y2-GEO-03.ts";
import y2Geo04 from "./ks1/Y2-GEO-04.ts";
import y2Pos01 from "./ks1/Y2-POS-01.ts";
import y2Pos02 from "./ks1/Y2-POS-02.ts";
import y2Pos02A from "./ks1/Y2-POS-02_a.ts";
import y2Pos02B from "./ks1/Y2-POS-02_b.ts";
import y2Pos02C from "./ks1/Y2-POS-02_c.ts";
import y2Sta01 from "./ks1/Y2-STA-01.ts";
import y2Sta01A from "./ks1/Y2-STA-01_a.ts";
import y2Sta01B from "./ks1/Y2-STA-01_b.ts";
import y2Sta01C from "./ks1/Y2-STA-01_c.ts";
import y2Sta01D from "./ks1/Y2-STA-01_d.ts";
import y2Sta02 from "./ks1/Y2-STA-02.ts";
import y2Sta03 from "./ks1/Y2-STA-03.ts";
import y3Npv01 from "./ks2/Y3-NPV-01.ts";
import y3Npv01A from "./ks2/Y3-NPV-01_a.ts";
import y3Npv01B from "./ks2/Y3-NPV-01_b.ts";
import y3Npv01C from "./ks2/Y3-NPV-01_c.ts";
import y3Npv02 from "./ks2/Y3-NPV-02.ts";
import y3Npv03 from "./ks2/Y3-NPV-03.ts";
import y3Npv04 from "./ks2/Y3-NPV-04.ts";
import y3Npv05 from "./ks2/Y3-NPV-05.ts";
import y3Npv06 from "./ks2/Y3-NPV-06.ts";
import y3As01 from "./ks2/Y3-AS-01.ts";
import y3As01A from "./ks2/Y3-AS-01_a.ts";
import y3As01B from "./ks2/Y3-AS-01_b.ts";
import y3As01C from "./ks2/Y3-AS-01_c.ts";
import y3As02 from "./ks2/Y3-AS-02.ts";
import y3As02A from "./ks2/Y3-AS-02_a.ts";
import y3As02B from "./ks2/Y3-AS-02_b.ts";
import y3As03 from "./ks2/Y3-AS-03.ts";
import y3As03A from "./ks2/Y3-AS-03_a.ts";
import y3As03B from "./ks2/Y3-AS-03_b.ts";
import y3As04 from "./ks2/Y3-AS-04.ts";
import y3Md01 from "./ks2/Y3-MD-01.ts";
import y3Md01A from "./ks2/Y3-MD-01_a.ts";
import y3Md01B from "./ks2/Y3-MD-01_b.ts";
import y3Md01C from "./ks2/Y3-MD-01_c.ts";
import y3Md02 from "./ks2/Y3-MD-02.ts";
import y3Md02A from "./ks2/Y3-MD-02_a.ts";
import y3Md02B from "./ks2/Y3-MD-02_b.ts";
import y3Md02C from "./ks2/Y3-MD-02_c.ts";
import y3Md03 from "./ks2/Y3-MD-03.ts";
import y3Md03A from "./ks2/Y3-MD-03_a.ts";
import y3Md03B from "./ks2/Y3-MD-03_b.ts";
import y3Md03C from "./ks2/Y3-MD-03_c.ts";
import y3Fr01 from "./ks2/Y3-FR-01.ts";
import y3Fr01A from "./ks2/Y3-FR-01_a.ts";
import y3Fr01B from "./ks2/Y3-FR-01_b.ts";
import y3Fr02 from "./ks2/Y3-FR-02.ts";
import y3Fr02A from "./ks2/Y3-FR-02_a.ts";
import y3Fr02B from "./ks2/Y3-FR-02_b.ts";
import y3Fr03 from "./ks2/Y3-FR-03.ts";
import y3Fr04 from "./ks2/Y3-FR-04.ts";
import y3Fr05 from "./ks2/Y3-FR-05.ts";
import y3Fr06 from "./ks2/Y3-FR-06.ts";
import y3Fr07 from "./ks2/Y3-FR-07.ts";
import y3Mea01 from "./ks2/Y3-MEA-01.ts";
import y3Mea01A from "./ks2/Y3-MEA-01_a.ts";
import y3Mea01B from "./ks2/Y3-MEA-01_b.ts";
import y3Mea01C from "./ks2/Y3-MEA-01_c.ts";
import y3Mea02 from "./ks2/Y3-MEA-02.ts";
import y3Mea03 from "./ks2/Y3-MEA-03.ts";
import y3Mea04 from "./ks2/Y3-MEA-04.ts";
import y3Mea04A from "./ks2/Y3-MEA-04_a.ts";
import y3Mea04B from "./ks2/Y3-MEA-04_b.ts";
import y3Mea04C from "./ks2/Y3-MEA-04_c.ts";
import y3Mea05 from "./ks2/Y3-MEA-05.ts";
import y3Mea05A from "./ks2/Y3-MEA-05_a.ts";
import y3Mea05B from "./ks2/Y3-MEA-05_b.ts";
import y3Mea06 from "./ks2/Y3-MEA-06.ts";
import y3Mea06A from "./ks2/Y3-MEA-06_a.ts";
import y3Mea06B from "./ks2/Y3-MEA-06_b.ts";
import y3Mea06C from "./ks2/Y3-MEA-06_c.ts";
import y3Mea07 from "./ks2/Y3-MEA-07.ts";
import y3Geo01 from "./ks2/Y3-GEO-01.ts";
import y3Geo01A from "./ks2/Y3-GEO-01_a.ts";
import y3Geo01B from "./ks2/Y3-GEO-01_b.ts";
import y3Geo02 from "./ks2/Y3-GEO-02.ts";
import y3Geo03 from "./ks2/Y3-GEO-03.ts";
import y3Geo03A from "./ks2/Y3-GEO-03_a.ts";
import y3Geo03B from "./ks2/Y3-GEO-03_b.ts";
import y3Geo03C from "./ks2/Y3-GEO-03_c.ts";
import y3Geo04 from "./ks2/Y3-GEO-04.ts";
import y3Geo04A from "./ks2/Y3-GEO-04_a.ts";
import y3Geo04B from "./ks2/Y3-GEO-04_b.ts";
import y3Sta01 from "./ks2/Y3-STA-01.ts";
import y3Sta01A from "./ks2/Y3-STA-01_a.ts";
import y3Sta01B from "./ks2/Y3-STA-01_b.ts";
import y3Sta01C from "./ks2/Y3-STA-01_c.ts";
import y3Sta02 from "./ks2/Y3-STA-02.ts";
import y3Sta02A from "./ks2/Y3-STA-02_a.ts";
import y3Sta02B from "./ks2/Y3-STA-02_b.ts";
import y4Npv01 from "./ks2/Y4-NPV-01.ts";
import y4Npv01A from "./ks2/Y4-NPV-01_a.ts";
import y4Npv01B from "./ks2/Y4-NPV-01_b.ts";
import y4Npv01C from "./ks2/Y4-NPV-01_c.ts";
import y4Npv02 from "./ks2/Y4-NPV-02.ts";
import y4Npv03 from "./ks2/Y4-NPV-03.ts";
import y4Npv04 from "./ks2/Y4-NPV-04.ts";
import y4Npv05 from "./ks2/Y4-NPV-05.ts";
import y4Npv06 from "./ks2/Y4-NPV-06.ts";
import y4Npv07 from "./ks2/Y4-NPV-07.ts";
import y4Npv07A from "./ks2/Y4-NPV-07_a.ts";
import y4Npv07B from "./ks2/Y4-NPV-07_b.ts";
import y4Npv07C from "./ks2/Y4-NPV-07_c.ts";
import y4Npv08 from "./ks2/Y4-NPV-08.ts";
import y4Npv09 from "./ks2/Y4-NPV-09.ts";
import y4As01 from "./ks2/Y4-AS-01.ts";
import y4As01A from "./ks2/Y4-AS-01_a.ts";
import y4As01B from "./ks2/Y4-AS-01_b.ts";
import y4As02 from "./ks2/Y4-AS-02.ts";
import y4As03 from "./ks2/Y4-AS-03.ts";
import y4Md01 from "./ks2/Y4-MD-01.ts";
import y4Md01A from "./ks2/Y4-MD-01_a.ts";
import y4Md01B from "./ks2/Y4-MD-01_b.ts";
import y4Md01C from "./ks2/Y4-MD-01_c.ts";
import y4Md01D from "./ks2/Y4-MD-01_d.ts";
import y4Md02 from "./ks2/Y4-MD-02.ts";
import y4Md02A from "./ks2/Y4-MD-02_a.ts";
import y4Md02B from "./ks2/Y4-MD-02_b.ts";
import y4Md02C from "./ks2/Y4-MD-02_c.ts";
import y4Md03 from "./ks2/Y4-MD-03.ts";
import y4Md04 from "./ks2/Y4-MD-04.ts";
import y4Md04A from "./ks2/Y4-MD-04_a.ts";
import y4Md04B from "./ks2/Y4-MD-04_b.ts";
import y4Md05 from "./ks2/Y4-MD-05.ts";
import y4Md05A from "./ks2/Y4-MD-05_a.ts";
import y4Md05B from "./ks2/Y4-MD-05_b.ts";
import y4Fr01 from "./ks2/Y4-FR-01.ts";
import y4Fr02 from "./ks2/Y4-FR-02.ts";
import y4Fr02A from "./ks2/Y4-FR-02_a.ts";
import y4Fr02B from "./ks2/Y4-FR-02_b.ts";
import y4Fr03 from "./ks2/Y4-FR-03.ts";
import y4Fr03A from "./ks2/Y4-FR-03_a.ts";
import y4Fr03B from "./ks2/Y4-FR-03_b.ts";
import y4Fr04 from "./ks2/Y4-FR-04.ts";
import y4Fr05 from "./ks2/Y4-FR-05.ts";
import y4Fr05A from "./ks2/Y4-FR-05_a.ts";
import y4Fr05B from "./ks2/Y4-FR-05_b.ts";
import y4Fr06 from "./ks2/Y4-FR-06.ts";
import y4Fr07 from "./ks2/Y4-FR-07.ts";
import y4Fr07A from "./ks2/Y4-FR-07_a.ts";
import y4Fr07B from "./ks2/Y4-FR-07_b.ts";
import y4Fr08 from "./ks2/Y4-FR-08.ts";
import y4Fr09 from "./ks2/Y4-FR-09.ts";
import y4Fr10 from "./ks2/Y4-FR-10.ts";
import y4Mea01 from "./ks2/Y4-MEA-01.ts";
import y4Mea01A from "./ks2/Y4-MEA-01_a.ts";
import y4Mea01B from "./ks2/Y4-MEA-01_b.ts";
import y4Mea01C from "./ks2/Y4-MEA-01_c.ts";
import y4Mea02 from "./ks2/Y4-MEA-02.ts";
import y4Mea03 from "./ks2/Y4-MEA-03.ts";
import y4Mea04 from "./ks2/Y4-MEA-04.ts";
import y4Mea05 from "./ks2/Y4-MEA-05.ts";
import y4Mea05A from "./ks2/Y4-MEA-05_a.ts";
import y4Mea05B from "./ks2/Y4-MEA-05_b.ts";
import y4Mea06 from "./ks2/Y4-MEA-06.ts";
import y4Mea06A from "./ks2/Y4-MEA-06_a.ts";
import y4Mea06B from "./ks2/Y4-MEA-06_b.ts";
import y4Geo01 from "./ks2/Y4-GEO-01.ts";
import y4Geo01A from "./ks2/Y4-GEO-01_a.ts";
import y4Geo01B from "./ks2/Y4-GEO-01_b.ts";
import y4Geo02 from "./ks2/Y4-GEO-02.ts";
import y4Geo02A from "./ks2/Y4-GEO-02_a.ts";
import y4Geo02B from "./ks2/Y4-GEO-02_b.ts";
import y4Geo03 from "./ks2/Y4-GEO-03.ts";
import y4Geo04 from "./ks2/Y4-GEO-04.ts";
import y4Pos01 from "./ks2/Y4-POS-01.ts";
import y4Pos02 from "./ks2/Y4-POS-02.ts";
import y4Pos03 from "./ks2/Y4-POS-03.ts";
import y4Sta01 from "./ks2/Y4-STA-01.ts";
import y4Sta01A from "./ks2/Y4-STA-01_a.ts";
import y4Sta01B from "./ks2/Y4-STA-01_b.ts";
import y4Sta02 from "./ks2/Y4-STA-02.ts";
import y5Npv01 from "./ks2/Y5-NPV-01.ts";
import y5Npv01A from "./ks2/Y5-NPV-01_a.ts";
import y5Npv01B from "./ks2/Y5-NPV-01_b.ts";
import y5Npv01C from "./ks2/Y5-NPV-01_c.ts";
import y5Npv02 from "./ks2/Y5-NPV-02.ts";
import y5Npv03 from "./ks2/Y5-NPV-03.ts";
import y5Npv03A from "./ks2/Y5-NPV-03_a.ts";
import y5Npv03B from "./ks2/Y5-NPV-03_b.ts";
import y5Npv04 from "./ks2/Y5-NPV-04.ts";
import y5Npv04A from "./ks2/Y5-NPV-04_a.ts";
import y5Npv04B from "./ks2/Y5-NPV-04_b.ts";
import y5Npv05 from "./ks2/Y5-NPV-05.ts";
import y5Npv06 from "./ks2/Y5-NPV-06.ts";
import y5As01 from "./ks2/Y5-AS-01.ts";
import y5As01A from "./ks2/Y5-AS-01_a.ts";
import y5As01B from "./ks2/Y5-AS-01_b.ts";
import y5As02 from "./ks2/Y5-AS-02.ts";
import y5As03 from "./ks2/Y5-AS-03.ts";
import y5As04 from "./ks2/Y5-AS-04.ts";
import y5Md01 from "./ks2/Y5-MD-01.ts";
import y5Md01A from "./ks2/Y5-MD-01_a.ts";
import y5Md01B from "./ks2/Y5-MD-01_b.ts";
import y5Md01C from "./ks2/Y5-MD-01_c.ts";
import y5Md02 from "./ks2/Y5-MD-02.ts";
import y5Md02A from "./ks2/Y5-MD-02_a.ts";
import y5Md02B from "./ks2/Y5-MD-02_b.ts";
import y5Md03 from "./ks2/Y5-MD-03.ts";
import y5Md04 from "./ks2/Y5-MD-04.ts";
import y5Md04A from "./ks2/Y5-MD-04_a.ts";
import y5Md04B from "./ks2/Y5-MD-04_b.ts";
import y5Md05 from "./ks2/Y5-MD-05.ts";
import y5Md06 from "./ks2/Y5-MD-06.ts";
import y5Md06A from "./ks2/Y5-MD-06_a.ts";
import y5Md06B from "./ks2/Y5-MD-06_b.ts";
import y5Md07 from "./ks2/Y5-MD-07.ts";
import y5Md07A from "./ks2/Y5-MD-07_a.ts";
import y5Md07B from "./ks2/Y5-MD-07_b.ts";
import y5Md08 from "./ks2/Y5-MD-08.ts";
import y5Md08A from "./ks2/Y5-MD-08_a.ts";
import y5Md08B from "./ks2/Y5-MD-08_b.ts";
import y5Md09 from "./ks2/Y5-MD-09.ts";
import y5Fr01 from "./ks2/Y5-FR-01.ts";
import y5Fr02 from "./ks2/Y5-FR-02.ts";
import y5Fr02A from "./ks2/Y5-FR-02_a.ts";
import y5Fr02B from "./ks2/Y5-FR-02_b.ts";
import y5Fr03 from "./ks2/Y5-FR-03.ts";
import y5Fr03A from "./ks2/Y5-FR-03_a.ts";
import y5Fr03B from "./ks2/Y5-FR-03_b.ts";
import y5Fr03C from "./ks2/Y5-FR-03_c.ts";
import y5Fr04 from "./ks2/Y5-FR-04.ts";
import y5Fr04A from "./ks2/Y5-FR-04_a.ts";
import y5Fr04B from "./ks2/Y5-FR-04_b.ts";
import y5Fr05 from "./ks2/Y5-FR-05.ts";
import y5Fr05A from "./ks2/Y5-FR-05_a.ts";
import y5Fr05B from "./ks2/Y5-FR-05_b.ts";
import y5Fr06 from "./ks2/Y5-FR-06.ts";
import y5Fr07 from "./ks2/Y5-FR-07.ts";
import y5Fr08 from "./ks2/Y5-FR-08.ts";
import y5Fr08A from "./ks2/Y5-FR-08_a.ts";
import y5Fr08B from "./ks2/Y5-FR-08_b.ts";
import y5Fr09 from "./ks2/Y5-FR-09.ts";
import y5Fr09A from "./ks2/Y5-FR-09_a.ts";
import y5Fr09B from "./ks2/Y5-FR-09_b.ts";
import y5Fr10 from "./ks2/Y5-FR-10.ts";
import y5Fr11 from "./ks2/Y5-FR-11.ts";
import y5Fr11A from "./ks2/Y5-FR-11_a.ts";
import y5Fr11B from "./ks2/Y5-FR-11_b.ts";
import y5Fr11C from "./ks2/Y5-FR-11_c.ts";
import y5Fr12 from "./ks2/Y5-FR-12.ts";
import y5Mea01 from "./ks2/Y5-MEA-01.ts";
import y5Mea01A from "./ks2/Y5-MEA-01_a.ts";
import y5Mea01B from "./ks2/Y5-MEA-01_b.ts";
import y5Mea01C from "./ks2/Y5-MEA-01_c.ts";
import y5Mea02 from "./ks2/Y5-MEA-02.ts";
import y5Mea03 from "./ks2/Y5-MEA-03.ts";
import y5Mea04 from "./ks2/Y5-MEA-04.ts";
import y5Mea04A from "./ks2/Y5-MEA-04_a.ts";
import y5Mea04B from "./ks2/Y5-MEA-04_b.ts";
import y5Mea04C from "./ks2/Y5-MEA-04_c.ts";
import y5Mea05 from "./ks2/Y5-MEA-05.ts";
import y5Mea05A from "./ks2/Y5-MEA-05_a.ts";
import y5Mea05B from "./ks2/Y5-MEA-05_b.ts";
import y5Mea06 from "./ks2/Y5-MEA-06.ts";
import y5Mea07 from "./ks2/Y5-MEA-07.ts";
import y5Geo01 from "./ks2/Y5-GEO-01.ts";
import y5Geo02 from "./ks2/Y5-GEO-02.ts";
import y5Geo02A from "./ks2/Y5-GEO-02_a.ts";
import y5Geo02B from "./ks2/Y5-GEO-02_b.ts";
import y5Geo03 from "./ks2/Y5-GEO-03.ts";
import y5Geo03A from "./ks2/Y5-GEO-03_a.ts";
import y5Geo03B from "./ks2/Y5-GEO-03_b.ts";
import y5Geo04 from "./ks2/Y5-GEO-04.ts";
import y5Geo04A from "./ks2/Y5-GEO-04_a.ts";
import y5Geo04B from "./ks2/Y5-GEO-04_b.ts";
import y5Geo04C from "./ks2/Y5-GEO-04_c.ts";
import y5Geo05 from "./ks2/Y5-GEO-05.ts";
import y5Geo05A from "./ks2/Y5-GEO-05_a.ts";
import y5Geo05B from "./ks2/Y5-GEO-05_b.ts";
import y5Geo06 from "./ks2/Y5-GEO-06.ts";
import y5Pos01 from "./ks2/Y5-POS-01.ts";
import y5Pos01A from "./ks2/Y5-POS-01_a.ts";
import y5Pos01B from "./ks2/Y5-POS-01_b.ts";
import y5Sta01 from "./ks2/Y5-STA-01.ts";
import y5Sta02 from "./ks2/Y5-STA-02.ts";
import y5Sta02A from "./ks2/Y5-STA-02_a.ts";
import y5Sta02B from "./ks2/Y5-STA-02_b.ts";
import y6Npv01 from "./ks2/Y6-NPV-01.ts";
import y6Npv01A from "./ks2/Y6-NPV-01_a.ts";
import y6Npv01B from "./ks2/Y6-NPV-01_b.ts";
import y6Npv01C from "./ks2/Y6-NPV-01_c.ts";
import y6Npv02 from "./ks2/Y6-NPV-02.ts";
import y6Npv03 from "./ks2/Y6-NPV-03.ts";
import y6Npv03A from "./ks2/Y6-NPV-03_a.ts";
import y6Npv03B from "./ks2/Y6-NPV-03_b.ts";
import y6Npv04 from "./ks2/Y6-NPV-04.ts";
import y6Md01 from "./ks2/Y6-MD-01.ts";
import y6Md02 from "./ks2/Y6-MD-02.ts";
import y6Md02A from "./ks2/Y6-MD-02_a.ts";
import y6Md02B from "./ks2/Y6-MD-02_b.ts";
import y6Md02C from "./ks2/Y6-MD-02_c.ts";
import y6Md03 from "./ks2/Y6-MD-03.ts";
import y6Md04 from "./ks2/Y6-MD-04.ts";
import y6Md05 from "./ks2/Y6-MD-05.ts";
import y6Md05A from "./ks2/Y6-MD-05_a.ts";
import y6Md05B from "./ks2/Y6-MD-05_b.ts";
import y6Md05C from "./ks2/Y6-MD-05_c.ts";
import y6Md06 from "./ks2/Y6-MD-06.ts";
import y6Md07 from "./ks2/Y6-MD-07.ts";
import y6Md08 from "./ks2/Y6-MD-08.ts";
import y6Fr01 from "./ks2/Y6-FR-01.ts";
import y6Fr01A from "./ks2/Y6-FR-01_a.ts";
import y6Fr01B from "./ks2/Y6-FR-01_b.ts";
import y6Fr02 from "./ks2/Y6-FR-02.ts";
import y6Fr03 from "./ks2/Y6-FR-03.ts";
import y6Fr03A from "./ks2/Y6-FR-03_a.ts";
import y6Fr03B from "./ks2/Y6-FR-03_b.ts";
import y6Fr04 from "./ks2/Y6-FR-04.ts";
import y6Fr05 from "./ks2/Y6-FR-05.ts";
import y6Fr06 from "./ks2/Y6-FR-06.ts";
import y6Fr06A from "./ks2/Y6-FR-06_a.ts";
import y6Fr06B from "./ks2/Y6-FR-06_b.ts";
import y6Fr07 from "./ks2/Y6-FR-07.ts";
import y6Fr07A from "./ks2/Y6-FR-07_a.ts";
import y6Fr07B from "./ks2/Y6-FR-07_b.ts";
import y6Fr08 from "./ks2/Y6-FR-08.ts";
import y6Fr09 from "./ks2/Y6-FR-09.ts";
import y6Fr10 from "./ks2/Y6-FR-10.ts";
import y6Fr11 from "./ks2/Y6-FR-11.ts";
import y6Rat01 from "./ks2/Y6-RAT-01.ts";
import y6Rat02 from "./ks2/Y6-RAT-02.ts";
import y6Rat02A from "./ks2/Y6-RAT-02_a.ts";
import y6Rat02B from "./ks2/Y6-RAT-02_b.ts";
import y6Rat03 from "./ks2/Y6-RAT-03.ts";
import y6Rat04 from "./ks2/Y6-RAT-04.ts";
import y6Alg01 from "./ks2/Y6-ALG-01.ts";
import y6Alg02 from "./ks2/Y6-ALG-02.ts";
import y6Alg03 from "./ks2/Y6-ALG-03.ts";
import y6Alg04 from "./ks2/Y6-ALG-04.ts";
import y6Alg05 from "./ks2/Y6-ALG-05.ts";
import y6Mea01 from "./ks2/Y6-MEA-01.ts";
import y6Mea02 from "./ks2/Y6-MEA-02.ts";
import y6Mea02A from "./ks2/Y6-MEA-02_a.ts";
import y6Mea02B from "./ks2/Y6-MEA-02_b.ts";
import y6Mea02C from "./ks2/Y6-MEA-02_c.ts";
import y6Mea03 from "./ks2/Y6-MEA-03.ts";
import y6Mea04 from "./ks2/Y6-MEA-04.ts";
import y6Mea05 from "./ks2/Y6-MEA-05.ts";
import y6Mea06 from "./ks2/Y6-MEA-06.ts";
import y6Mea06A from "./ks2/Y6-MEA-06_a.ts";
import y6Mea06B from "./ks2/Y6-MEA-06_b.ts";
import y6Mea07 from "./ks2/Y6-MEA-07.ts";
import y6Mea07A from "./ks2/Y6-MEA-07_a.ts";
import y6Mea07B from "./ks2/Y6-MEA-07_b.ts";
import y6Geo01 from "./ks2/Y6-GEO-01.ts";
import y6Geo02 from "./ks2/Y6-GEO-02.ts";
import y6Geo03 from "./ks2/Y6-GEO-03.ts";
import y6Geo03A from "./ks2/Y6-GEO-03_a.ts";
import y6Geo03B from "./ks2/Y6-GEO-03_b.ts";
import y6Geo03C from "./ks2/Y6-GEO-03_c.ts";
import y6Geo03D from "./ks2/Y6-GEO-03_d.ts";
import y6Geo04 from "./ks2/Y6-GEO-04.ts";
import y6Geo04A from "./ks2/Y6-GEO-04_a.ts";
import y6Geo04B from "./ks2/Y6-GEO-04_b.ts";
import y6Geo05 from "./ks2/Y6-GEO-05.ts";
import y6Geo05A from "./ks2/Y6-GEO-05_a.ts";
import y6Geo05B from "./ks2/Y6-GEO-05_b.ts";
import y6Geo05C from "./ks2/Y6-GEO-05_c.ts";
import y6Pos01 from "./ks2/Y6-POS-01.ts";
import y6Pos02 from "./ks2/Y6-POS-02.ts";
import y6Pos02A from "./ks2/Y6-POS-02_a.ts";
import y6Pos02B from "./ks2/Y6-POS-02_b.ts";
import y6Sta01 from "./ks2/Y6-STA-01.ts";
import y6Sta01A from "./ks2/Y6-STA-01_a.ts";
import y6Sta01B from "./ks2/Y6-STA-01_b.ts";
import y6Sta02 from "./ks2/Y6-STA-02.ts";
import y7Npv01 from "./ks3/Y7-NPV-01.ts";
import y7Npv02 from "./ks3/Y7-NPV-02.ts";
import y7Npv02A from "./ks3/Y7-NPV-02_a.ts";
import y7Npv02B from "./ks3/Y7-NPV-02_b.ts";
import y7Npv02C from "./ks3/Y7-NPV-02_c.ts";
import y7Npv03 from "./ks3/Y7-NPV-03.ts";
import y7Npv03A from "./ks3/Y7-NPV-03_a.ts";
import y7Npv03B from "./ks3/Y7-NPV-03_b.ts";
import y7Npv03C from "./ks3/Y7-NPV-03_c.ts";
import y7Npv03D from "./ks3/Y7-NPV-03_d.ts";
import y7Npv04 from "./ks3/Y7-NPV-04.ts";
import y7Npv04A from "./ks3/Y7-NPV-04_a.ts";
import y7Npv04B from "./ks3/Y7-NPV-04_b.ts";
import y7Npv04C from "./ks3/Y7-NPV-04_c.ts";
import y7Npv04D from "./ks3/Y7-NPV-04_d.ts";
import y7Npv05 from "./ks3/Y7-NPV-05.ts";
import y7Npv05A from "./ks3/Y7-NPV-05_a.ts";
import y7Npv05B from "./ks3/Y7-NPV-05_b.ts";
import y7Npv05C from "./ks3/Y7-NPV-05_c.ts";
import y7Npv06 from "./ks3/Y7-NPV-06.ts";
import y7Npv07 from "./ks3/Y7-NPV-07.ts";
import y7Npv07A from "./ks3/Y7-NPV-07_a.ts";
import y7Npv07B from "./ks3/Y7-NPV-07_b.ts";
import y7Npv07C from "./ks3/Y7-NPV-07_c.ts";
import y7Npv07D from "./ks3/Y7-NPV-07_d.ts";
import y7Npv08 from "./ks3/Y7-NPV-08.ts";
import y7Npv08A from "./ks3/Y7-NPV-08_a.ts";
import y7Npv08B from "./ks3/Y7-NPV-08_b.ts";
import y7Npv09 from "./ks3/Y7-NPV-09.ts";
import y7Npv09A from "./ks3/Y7-NPV-09_a.ts";
import y7Npv09B from "./ks3/Y7-NPV-09_b.ts";
import y7Npv10 from "./ks3/Y7-NPV-10.ts";
import y7Fr01 from "./ks3/Y7-FR-01.ts";
import y7Alg01 from "./ks3/Y7-ALG-01.ts";
import y7Alg01A from "./ks3/Y7-ALG-01_a.ts";
import y7Alg01B from "./ks3/Y7-ALG-01_b.ts";
import y7Alg01C from "./ks3/Y7-ALG-01_c.ts";
import y7Alg02 from "./ks3/Y7-ALG-02.ts";
import y7Alg02A from "./ks3/Y7-ALG-02_a.ts";
import y7Alg02B from "./ks3/Y7-ALG-02_b.ts";
import y7Alg03 from "./ks3/Y7-ALG-03.ts";
import y7Alg04 from "./ks3/Y7-ALG-04.ts";
import y7Alg04A from "./ks3/Y7-ALG-04_a.ts";
import y7Alg04B from "./ks3/Y7-ALG-04_b.ts";
import y7Alg05 from "./ks3/Y7-ALG-05.ts";
import y7Alg05A from "./ks3/Y7-ALG-05_a.ts";
import y7Alg05B from "./ks3/Y7-ALG-05_b.ts";
import y7Alg06 from "./ks3/Y7-ALG-06.ts";
import y7Alg06A from "./ks3/Y7-ALG-06_a.ts";
import y7Alg06B from "./ks3/Y7-ALG-06_b.ts";
import y7Rat01 from "./ks3/Y7-RAT-01.ts";
import y7Rat01A from "./ks3/Y7-RAT-01_a.ts";
import y7Rat01B from "./ks3/Y7-RAT-01_b.ts";
import y7Rat01C from "./ks3/Y7-RAT-01_c.ts";
import y7Rat02 from "./ks3/Y7-RAT-02.ts";
import y7Rat03 from "./ks3/Y7-RAT-03.ts";
import y7Rat03A from "./ks3/Y7-RAT-03_a.ts";
import y7Rat03B from "./ks3/Y7-RAT-03_b.ts";
import y7Rat03C from "./ks3/Y7-RAT-03_c.ts";
import y7Rat04 from "./ks3/Y7-RAT-04.ts";
import y7Rat04A from "./ks3/Y7-RAT-04_a.ts";
import y7Rat04B from "./ks3/Y7-RAT-04_b.ts";
import y7Rat05 from "./ks3/Y7-RAT-05.ts";
import y7Rat05A from "./ks3/Y7-RAT-05_a.ts";
import y7Rat05B from "./ks3/Y7-RAT-05_b.ts";
import y7Geo01 from "./ks3/Y7-GEO-01.ts";
import y7Geo01A from "./ks3/Y7-GEO-01_a.ts";
import y7Geo01B from "./ks3/Y7-GEO-01_b.ts";
import y7Geo01C from "./ks3/Y7-GEO-01_c.ts";
import y7Geo01D from "./ks3/Y7-GEO-01_d.ts";
import y7Geo02 from "./ks3/Y7-GEO-02.ts";
import y7Geo02A from "./ks3/Y7-GEO-02_a.ts";
import y7Geo02B from "./ks3/Y7-GEO-02_b.ts";
import y7Geo03 from "./ks3/Y7-GEO-03.ts";
import y7Geo03A from "./ks3/Y7-GEO-03_a.ts";
import y7Geo03B from "./ks3/Y7-GEO-03_b.ts";
import y7Geo04 from "./ks3/Y7-GEO-04.ts";
import y7Geo04A from "./ks3/Y7-GEO-04_a.ts";
import y7Geo04B from "./ks3/Y7-GEO-04_b.ts";
import y7Geo05 from "./ks3/Y7-GEO-05.ts";
import y7Geo05A from "./ks3/Y7-GEO-05_a.ts";
import y7Geo05B from "./ks3/Y7-GEO-05_b.ts";
import y7Geo05C from "./ks3/Y7-GEO-05_c.ts";
import y7Geo06 from "./ks3/Y7-GEO-06.ts";
import y7Geo06A from "./ks3/Y7-GEO-06_a.ts";
import y7Geo06B from "./ks3/Y7-GEO-06_b.ts";
import y7Geo06C from "./ks3/Y7-GEO-06_c.ts";
import y7Sta01 from "./ks3/Y7-STA-01.ts";
import y7Sta01A from "./ks3/Y7-STA-01_a.ts";
import y7Sta01B from "./ks3/Y7-STA-01_b.ts";
import y7Sta01C from "./ks3/Y7-STA-01_c.ts";
import y7Sta01D from "./ks3/Y7-STA-01_d.ts";
import y7Pro01 from "./ks3/Y7-PRO-01.ts";
import y7Pro01A from "./ks3/Y7-PRO-01_a.ts";
import y7Pro01B from "./ks3/Y7-PRO-01_b.ts";
import y7Pro02 from "./ks3/Y7-PRO-02.ts";
import y8Npv01 from "./ks3/Y8-NPV-01.ts";
import y8Npv01A from "./ks3/Y8-NPV-01_a.ts";
import y8Npv01B from "./ks3/Y8-NPV-01_b.ts";
import y8Npv02 from "./ks3/Y8-NPV-02.ts";
import y8Alg01 from "./ks3/Y8-ALG-01.ts";
import y8Alg01A from "./ks3/Y8-ALG-01_a.ts";
import y8Alg01B from "./ks3/Y8-ALG-01_b.ts";
import y8Alg02 from "./ks3/Y8-ALG-02.ts";
import y8Alg02A from "./ks3/Y8-ALG-02_a.ts";
import y8Alg02B from "./ks3/Y8-ALG-02_b.ts";
import y8Alg03 from "./ks3/Y8-ALG-03.ts";
import y8Alg04 from "./ks3/Y8-ALG-04.ts";
import y8Alg04A from "./ks3/Y8-ALG-04_a.ts";
import y8Alg04B from "./ks3/Y8-ALG-04_b.ts";
import y8Alg04C from "./ks3/Y8-ALG-04_c.ts";
import y8Alg05 from "./ks3/Y8-ALG-05.ts";
import y8Alg06 from "./ks3/Y8-ALG-06.ts";
import y8Alg06A from "./ks3/Y8-ALG-06_a.ts";
import y8Alg06B from "./ks3/Y8-ALG-06_b.ts";
import y8Alg07 from "./ks3/Y8-ALG-07.ts";
import y8Alg08 from "./ks3/Y8-ALG-08.ts";
import y8Alg08A from "./ks3/Y8-ALG-08_a.ts";
import y8Alg08B from "./ks3/Y8-ALG-08_b.ts";
import y8Alg09 from "./ks3/Y8-ALG-09.ts";
import y8Rat01 from "./ks3/Y8-RAT-01.ts";
import y8Rat02 from "./ks3/Y8-RAT-02.ts";
import y8Rat03 from "./ks3/Y8-RAT-03.ts";
import y8Rat03A from "./ks3/Y8-RAT-03_a.ts";
import y8Rat03B from "./ks3/Y8-RAT-03_b.ts";
import y8Rat03C from "./ks3/Y8-RAT-03_c.ts";
import y8Rat03D from "./ks3/Y8-RAT-03_d.ts";
import y8Rat04 from "./ks3/Y8-RAT-04.ts";
import y8Rat04A from "./ks3/Y8-RAT-04_a.ts";
import y8Rat04B from "./ks3/Y8-RAT-04_b.ts";
import y8Rat05 from "./ks3/Y8-RAT-05.ts";
import y8Rat05A from "./ks3/Y8-RAT-05_a.ts";
import y8Rat05B from "./ks3/Y8-RAT-05_b.ts";
import y8Rat05C from "./ks3/Y8-RAT-05_c.ts";
import y8Geo01 from "./ks3/Y8-GEO-01.ts";
import y8Geo01A from "./ks3/Y8-GEO-01_a.ts";
import y8Geo01B from "./ks3/Y8-GEO-01_b.ts";
import y8Geo01C from "./ks3/Y8-GEO-01_c.ts";
import y8Geo02 from "./ks3/Y8-GEO-02.ts";
import y8Geo02A from "./ks3/Y8-GEO-02_a.ts";
import y8Geo02B from "./ks3/Y8-GEO-02_b.ts";
import y8Geo03 from "./ks3/Y8-GEO-03.ts";
import y8Geo04 from "./ks3/Y8-GEO-04.ts";
import y8Geo04A from "./ks3/Y8-GEO-04_a.ts";
import y8Geo04B from "./ks3/Y8-GEO-04_b.ts";
import y8Geo04C from "./ks3/Y8-GEO-04_c.ts";
import y8Geo04D from "./ks3/Y8-GEO-04_d.ts";
import y8Geo05 from "./ks3/Y8-GEO-05.ts";
import y8Geo05A from "./ks3/Y8-GEO-05_a.ts";
import y8Geo05B from "./ks3/Y8-GEO-05_b.ts";
import y8Pos01 from "./ks3/Y8-POS-01.ts";
import y8Pos01A from "./ks3/Y8-POS-01_a.ts";
import y8Pos01B from "./ks3/Y8-POS-01_b.ts";
import y8Pos01C from "./ks3/Y8-POS-01_c.ts";
import y8Geo06 from "./ks3/Y8-GEO-06.ts";
import y8Sta01 from "./ks3/Y8-STA-01.ts";
import y8Sta01A from "./ks3/Y8-STA-01_a.ts";
import y8Sta01B from "./ks3/Y8-STA-01_b.ts";
import y8Sta01C from "./ks3/Y8-STA-01_c.ts";
import y8Sta02 from "./ks3/Y8-STA-02.ts";
import y8Sta02A from "./ks3/Y8-STA-02_a.ts";
import y8Sta02B from "./ks3/Y8-STA-02_b.ts";
import y8Pro01 from "./ks3/Y8-PRO-01.ts";
import y9Npv01 from "./ks3/Y9-NPV-01.ts";
import y9Npv01A from "./ks3/Y9-NPV-01_a.ts";
import y9Npv01B from "./ks3/Y9-NPV-01_b.ts";
import y9Alg01 from "./ks3/Y9-ALG-01.ts";
import y9Alg01A from "./ks3/Y9-ALG-01_a.ts";
import y9Alg01B from "./ks3/Y9-ALG-01_b.ts";
import y9Alg02 from "./ks3/Y9-ALG-02.ts";
import y9Alg02A from "./ks3/Y9-ALG-02_a.ts";
import y9Alg02B from "./ks3/Y9-ALG-02_b.ts";
import y9Alg02C from "./ks3/Y9-ALG-02_c.ts";
import y9Alg03 from "./ks3/Y9-ALG-03.ts";
import y9Alg04 from "./ks3/Y9-ALG-04.ts";
import y9Alg04A from "./ks3/Y9-ALG-04_a.ts";
import y9Alg04B from "./ks3/Y9-ALG-04_b.ts";
import y9Alg04C from "./ks3/Y9-ALG-04_c.ts";
import y9Alg05 from "./ks3/Y9-ALG-05.ts";
import y9Alg05A from "./ks3/Y9-ALG-05_a.ts";
import y9Alg05B from "./ks3/Y9-ALG-05_b.ts";
import y9Alg06 from "./ks3/Y9-ALG-06.ts";
import y9Alg06A from "./ks3/Y9-ALG-06_a.ts";
import y9Alg06B from "./ks3/Y9-ALG-06_b.ts";
import y9Alg07 from "./ks3/Y9-ALG-07.ts";
import y9Alg07A from "./ks3/Y9-ALG-07_a.ts";
import y9Alg07B from "./ks3/Y9-ALG-07_b.ts";
import y9Alg08 from "./ks3/Y9-ALG-08.ts";
import y9Alg08A from "./ks3/Y9-ALG-08_a.ts";
import y9Alg08B from "./ks3/Y9-ALG-08_b.ts";
import y9Alg09 from "./ks3/Y9-ALG-09.ts";
import y9Rat01 from "./ks3/Y9-RAT-01.ts";
import y9Rat02 from "./ks3/Y9-RAT-02.ts";
import y9Rat03 from "./ks3/Y9-RAT-03.ts";
import y9Rat03A from "./ks3/Y9-RAT-03_a.ts";
import y9Rat03B from "./ks3/Y9-RAT-03_b.ts";
import y9Geo01 from "./ks3/Y9-GEO-01.ts";
import y9Geo01A from "./ks3/Y9-GEO-01_a.ts";
import y9Geo01B from "./ks3/Y9-GEO-01_b.ts";
import y9Geo01C from "./ks3/Y9-GEO-01_c.ts";
import y9Geo02 from "./ks3/Y9-GEO-02.ts";
import y9Geo02A from "./ks3/Y9-GEO-02_a.ts";
import y9Geo02B from "./ks3/Y9-GEO-02_b.ts";
import y9Geo03 from "./ks3/Y9-GEO-03.ts";
import y9Pos01 from "./ks3/Y9-POS-01.ts";
import y9Pro01 from "./ks3/Y9-PRO-01.ts";
import y9Pro01A from "./ks3/Y9-PRO-01_a.ts";
import y9Pro01B from "./ks3/Y9-PRO-01_b.ts";
import y9Pro02 from "./ks3/Y9-PRO-02.ts";
import y9Pro02A from "./ks3/Y9-PRO-02_a.ts";
import y9Pro02B from "./ks3/Y9-PRO-02_b.ts";
import gfN1 from "./ks4/GF-N1.ts";
import gfN1A from "./ks4/GF-N1_a.ts";
import gfN1B from "./ks4/GF-N1_b.ts";
import gfN2 from "./ks4/GF-N2.ts";
import gfN2A from "./ks4/GF-N2_a.ts";
import gfN2B from "./ks4/GF-N2_b.ts";
import gfN2C from "./ks4/GF-N2_c.ts";
import gfN2D from "./ks4/GF-N2_d.ts";
import gfN3 from "./ks4/GF-N3.ts";
import gfN3A from "./ks4/GF-N3_a.ts";
import gfN3B from "./ks4/GF-N3_b.ts";
import gfN4 from "./ks4/GF-N4.ts";
import gfN4A from "./ks4/GF-N4_a.ts";
import gfN4B from "./ks4/GF-N4_b.ts";
import gfN4C from "./ks4/GF-N4_c.ts";
import gfN5 from "./ks4/GF-N5.ts";
import ghN5 from "./ks4/GH-N5.ts";
import gfN6 from "./ks4/GF-N6.ts";
import gfN6A from "./ks4/GF-N6_a.ts";
import gfN6B from "./ks4/GF-N6_b.ts";
import gfN6C from "./ks4/GF-N6_c.ts";
import ghN6 from "./ks4/GH-N6.ts";
import gfN7 from "./ks4/GF-N7.ts";
import gfN7A from "./ks4/GF-N7_a.ts";
import gfN7B from "./ks4/GF-N7_b.ts";
import ghN7 from "./ks4/GH-N7.ts";
import gfN8 from "./ks4/GF-N8.ts";
import gfN8A from "./ks4/GF-N8_a.ts";
import gfN8B from "./ks4/GF-N8_b.ts";
import ghN8 from "./ks4/GH-N8.ts";
import ghN8A from "./ks4/GH-N8_a.ts";
import ghN8B from "./ks4/GH-N8_b.ts";
import ghN8C from "./ks4/GH-N8_c.ts";
import gfN9 from "./ks4/GF-N9.ts";
import gfN9A from "./ks4/GF-N9_a.ts";
import gfN9B from "./ks4/GF-N9_b.ts";
import gfN10 from "./ks4/GF-N10.ts";
import ghN10 from "./ks4/GH-N10.ts";
import ghN10A from "./ks4/GH-N10_a.ts";
import ghN10B from "./ks4/GH-N10_b.ts";
import gfN11 from "./ks4/GF-N11.ts";
import gfN12 from "./ks4/GF-N12.ts";
import gfN12A from "./ks4/GF-N12_a.ts";
import gfN12B from "./ks4/GF-N12_b.ts";
import gfN13 from "./ks4/GF-N13.ts";
import gfN13A from "./ks4/GF-N13_a.ts";
import gfN13B from "./ks4/GF-N13_b.ts";
import gfN14 from "./ks4/GF-N14.ts";
import gfN15 from "./ks4/GF-N15.ts";
import gfN15A from "./ks4/GF-N15_a.ts";
import gfN15B from "./ks4/GF-N15_b.ts";
import gfN15C from "./ks4/GF-N15_c.ts";
import gfN15D from "./ks4/GF-N15_d.ts";
import gfN16 from "./ks4/GF-N16.ts";
import ghN16 from "./ks4/GH-N16.ts";
import gfA1 from "./ks4/GF-A1.ts";
import gfA2 from "./ks4/GF-A2.ts";
import gfA2A from "./ks4/GF-A2_a.ts";
import gfA2B from "./ks4/GF-A2_b.ts";
import gfA3 from "./ks4/GF-A3.ts";
import ghA3 from "./ks4/GH-A3.ts";
import gfA4 from "./ks4/GF-A4.ts";
import gfA4A from "./ks4/GF-A4_a.ts";
import gfA4B from "./ks4/GF-A4_b.ts";
import gfA4C from "./ks4/GF-A4_c.ts";
import gfA4D from "./ks4/GF-A4_d.ts";
import gfA4E from "./ks4/GF-A4_e.ts";
import gfA4F from "./ks4/GF-A4_f.ts";
import gfA4G from "./ks4/GF-A4_g.ts";
import ghA4 from "./ks4/GH-A4.ts";
import ghA4A from "./ks4/GH-A4_a.ts";
import ghA4B from "./ks4/GH-A4_b.ts";
import ghA4C from "./ks4/GH-A4_c.ts";
import ghA4D from "./ks4/GH-A4_d.ts";
import gfA5 from "./ks4/GF-A5.ts";
import gfA5A from "./ks4/GF-A5_a.ts";
import gfA5B from "./ks4/GF-A5_b.ts";
import gfA6 from "./ks4/GF-A6.ts";
import gfA6A from "./ks4/GF-A6_a.ts";
import gfA6B from "./ks4/GF-A6_b.ts";
import gfA6C from "./ks4/GF-A6_c.ts";
import ghA6 from "./ks4/GH-A6.ts";
import gfA7 from "./ks4/GF-A7.ts";
import ghA7 from "./ks4/GH-A7.ts";
import gfA8 from "./ks4/GF-A8.ts";
import gfA9 from "./ks4/GF-A9.ts";
import gfA9A from "./ks4/GF-A9_a.ts";
import gfA9B from "./ks4/GF-A9_b.ts";
import gfA9C from "./ks4/GF-A9_c.ts";
import gfA9D from "./ks4/GF-A9_d.ts";
import ghA9 from "./ks4/GH-A9.ts";
import gfA10 from "./ks4/GF-A10.ts";
import gfA10A from "./ks4/GF-A10_a.ts";
import gfA10B from "./ks4/GF-A10_b.ts";
import gfA11 from "./ks4/GF-A11.ts";
import gfA11A from "./ks4/GF-A11_a.ts";
import gfA11B from "./ks4/GF-A11_b.ts";
import gfA11C from "./ks4/GF-A11_c.ts";
import ghA11 from "./ks4/GH-A11.ts";
import gfA12 from "./ks4/GF-A12.ts";
import gfA12A from "./ks4/GF-A12_a.ts";
import gfA12B from "./ks4/GF-A12_b.ts";
import gfA12C from "./ks4/GF-A12_c.ts";
import ghA12 from "./ks4/GH-A12.ts";
import ghA12A from "./ks4/GH-A12_a.ts";
import ghA12B from "./ks4/GH-A12_b.ts";
import ghA13 from "./ks4/GH-A13.ts";
import gfA14 from "./ks4/GF-A14.ts";
import gfA14A from "./ks4/GF-A14_a.ts";
import gfA14B from "./ks4/GF-A14_b.ts";
import ghA14 from "./ks4/GH-A14.ts";
import ghA15 from "./ks4/GH-A15.ts";
import ghA15A from "./ks4/GH-A15_a.ts";
import ghA15B from "./ks4/GH-A15_b.ts";
import ghA15C from "./ks4/GH-A15_c.ts";
import ghA16 from "./ks4/GH-A16.ts";
import ghA16A from "./ks4/GH-A16_a.ts";
import ghA16B from "./ks4/GH-A16_b.ts";
import gfA17 from "./ks4/GF-A17.ts";
import gfA17A from "./ks4/GF-A17_a.ts";
import gfA17B from "./ks4/GF-A17_b.ts";
import gfA17C from "./ks4/GF-A17_c.ts";
import ghA17 from "./ks4/GH-A17.ts";
import gfA18 from "./ks4/GF-A18.ts";
import gfA18A from "./ks4/GF-A18_a.ts";
import gfA18B from "./ks4/GF-A18_b.ts";
import ghA18 from "./ks4/GH-A18.ts";
import ghA18A from "./ks4/GH-A18_a.ts";
import ghA18B from "./ks4/GH-A18_b.ts";
import ghA18C from "./ks4/GH-A18_c.ts";
import gfA19 from "./ks4/GF-A19.ts";
import gfA19A from "./ks4/GF-A19_a.ts";
import gfA19B from "./ks4/GF-A19_b.ts";
import gfA19C from "./ks4/GF-A19_c.ts";
import ghA19 from "./ks4/GH-A19.ts";
import ghA20 from "./ks4/GH-A20.ts";
import gfA21 from "./ks4/GF-A21.ts";
import gfA22 from "./ks4/GF-A22.ts";
import ghA22 from "./ks4/GH-A22.ts";
import ghA22A from "./ks4/GH-A22_a.ts";
import ghA22B from "./ks4/GH-A22_b.ts";
import ghA22C from "./ks4/GH-A22_c.ts";
import gfA23 from "./ks4/GF-A23.ts";
import gfA23A from "./ks4/GF-A23_a.ts";
import gfA23B from "./ks4/GF-A23_b.ts";
import gfA24 from "./ks4/GF-A24.ts";
import gfA24A from "./ks4/GF-A24_a.ts";
import gfA24B from "./ks4/GF-A24_b.ts";
import gfA24C from "./ks4/GF-A24_c.ts";
import gfA24D from "./ks4/GF-A24_d.ts";
import ghA24 from "./ks4/GH-A24.ts";
import gfA25 from "./ks4/GF-A25.ts";
import ghA25 from "./ks4/GH-A25.ts";
import gfR1 from "./ks4/GF-R1.ts";
import ghR1 from "./ks4/GH-R1.ts";
import gfR2 from "./ks4/GF-R2.ts";
import gfR3 from "./ks4/GF-R3.ts";
import gfR4 from "./ks4/GF-R4.ts";
import gfR5 from "./ks4/GF-R5.ts";
import gfR5A from "./ks4/GF-R5_a.ts";
import gfR5B from "./ks4/GF-R5_b.ts";
import gfR5C from "./ks4/GF-R5_c.ts";
import gfR6 from "./ks4/GF-R6.ts";
import gfR7 from "./ks4/GF-R7.ts";
import gfR8 from "./ks4/GF-R8.ts";
import gfR9 from "./ks4/GF-R9.ts";
import gfR9A from "./ks4/GF-R9_a.ts";
import gfR9B from "./ks4/GF-R9_b.ts";
import gfR9C from "./ks4/GF-R9_c.ts";
import gfR9D from "./ks4/GF-R9_d.ts";
import gfR10 from "./ks4/GF-R10.ts";
import gfR10A from "./ks4/GF-R10_a.ts";
import gfR10B from "./ks4/GF-R10_b.ts";
import gfR10C from "./ks4/GF-R10_c.ts";
import gfR11 from "./ks4/GF-R11.ts";
import gfR11A from "./ks4/GF-R11_a.ts";
import gfR11B from "./ks4/GF-R11_b.ts";
import gfR11C from "./ks4/GF-R11_c.ts";
import gfR11D from "./ks4/GF-R11_d.ts";
import gfR12 from "./ks4/GF-R12.ts";
import gfR13 from "./ks4/GF-R13.ts";
import ghR13 from "./ks4/GH-R13.ts";
import gfR14 from "./ks4/GF-R14.ts";
import ghR14 from "./ks4/GH-R14.ts";
import ghR15 from "./ks4/GH-R15.ts";
import gfR16 from "./ks4/GF-R16.ts";
import gfR16A from "./ks4/GF-R16_a.ts";
import gfR16B from "./ks4/GF-R16_b.ts";
import gfR16C from "./ks4/GF-R16_c.ts";
import ghR16 from "./ks4/GH-R16.ts";
import gfG1 from "./ks4/GF-G1.ts";
import gfG2 from "./ks4/GF-G2.ts";
import gfG2A from "./ks4/GF-G2_a.ts";
import gfG2B from "./ks4/GF-G2_b.ts";
import gfG3 from "./ks4/GF-G3.ts";
import gfG3A from "./ks4/GF-G3_a.ts";
import gfG3B from "./ks4/GF-G3_b.ts";
import gfG3C from "./ks4/GF-G3_c.ts";
import gfG4 from "./ks4/GF-G4.ts";
import gfG4A from "./ks4/GF-G4_a.ts";
import gfG4B from "./ks4/GF-G4_b.ts";
import gfG5 from "./ks4/GF-G5.ts";
import gfG6 from "./ks4/GF-G6.ts";
import gfG7 from "./ks4/GF-G7.ts";
import gfG7A from "./ks4/GF-G7_a.ts";
import gfG7B from "./ks4/GF-G7_b.ts";
import gfG7C from "./ks4/GF-G7_c.ts";
import gfG7D from "./ks4/GF-G7_d.ts";
import ghG7 from "./ks4/GH-G7.ts";
import ghG8 from "./ks4/GH-G8.ts";
import gfG9 from "./ks4/GF-G9.ts";
import ghG10 from "./ks4/GH-G10.ts";
import gfG11 from "./ks4/GF-G11.ts";
import gfG12 from "./ks4/GF-G12.ts";
import gfG13 from "./ks4/GF-G13.ts";
import gfG13A from "./ks4/GF-G13_a.ts";
import gfG13B from "./ks4/GF-G13_b.ts";
import gfG14 from "./ks4/GF-G14.ts";
import gfG15 from "./ks4/GF-G15.ts";
import gfG15A from "./ks4/GF-G15_a.ts";
import gfG15B from "./ks4/GF-G15_b.ts";
import gfG15C from "./ks4/GF-G15_c.ts";
import gfG16 from "./ks4/GF-G16.ts";
import gfG16A from "./ks4/GF-G16_a.ts";
import gfG16B from "./ks4/GF-G16_b.ts";
import gfG16C from "./ks4/GF-G16_c.ts";
import gfG17 from "./ks4/GF-G17.ts";
import gfG17A from "./ks4/GF-G17_a.ts";
import gfG17B from "./ks4/GF-G17_b.ts";
import gfG17C from "./ks4/GF-G17_c.ts";
import gfG17D from "./ks4/GF-G17_d.ts";
import gfG18 from "./ks4/GF-G18.ts";
import gfG18A from "./ks4/GF-G18_a.ts";
import gfG18B from "./ks4/GF-G18_b.ts";
import gfG18C from "./ks4/GF-G18_c.ts";
import gfG19 from "./ks4/GF-G19.ts";
import ghG19 from "./ks4/GH-G19.ts";
import gfG20 from "./ks4/GF-G20.ts";
import gfG20A from "./ks4/GF-G20_a.ts";
import gfG20B from "./ks4/GF-G20_b.ts";
import gfG20C from "./ks4/GF-G20_c.ts";
import ghG20 from "./ks4/GH-G20.ts";
import ghG20A from "./ks4/GH-G20_a.ts";
import ghG20B from "./ks4/GH-G20_b.ts";
import ghG20C from "./ks4/GH-G20_c.ts";
import gfG21 from "./ks4/GF-G21.ts";
import gfG21A from "./ks4/GF-G21_a.ts";
import gfG21B from "./ks4/GF-G21_b.ts";
import ghG22 from "./ks4/GH-G22.ts";
import ghG22A from "./ks4/GH-G22_a.ts";
import ghG22B from "./ks4/GH-G22_b.ts";
import ghG23 from "./ks4/GH-G23.ts";
import gfG24 from "./ks4/GF-G24.ts";
import gfG25 from "./ks4/GF-G25.ts";
import gfG25A from "./ks4/GF-G25_a.ts";
import gfG25B from "./ks4/GF-G25_b.ts";
import gfG25C from "./ks4/GF-G25_c.ts";
import ghG25 from "./ks4/GH-G25.ts";
import gfP1 from "./ks4/GF-P1.ts";
import gfP2 from "./ks4/GF-P2.ts";
import gfP3 from "./ks4/GF-P3.ts";
import gfP4 from "./ks4/GF-P4.ts";
import gfP5 from "./ks4/GF-P5.ts";
import gfP6 from "./ks4/GF-P6.ts";
import gfP6A from "./ks4/GF-P6_a.ts";
import gfP6B from "./ks4/GF-P6_b.ts";
import gfP6C from "./ks4/GF-P6_c.ts";
import gfP7 from "./ks4/GF-P7.ts";
import gfP8 from "./ks4/GF-P8.ts";
import gfP8A from "./ks4/GF-P8_a.ts";
import gfP8B from "./ks4/GF-P8_b.ts";
import ghP9 from "./ks4/GH-P9.ts";
import ghP9A from "./ks4/GH-P9_a.ts";
import ghP9B from "./ks4/GH-P9_b.ts";
import ghP9C from "./ks4/GH-P9_c.ts";
import gfS1 from "./ks4/GF-S1.ts";
import gfS2 from "./ks4/GF-S2.ts";
import gfS2A from "./ks4/GF-S2_a.ts";
import gfS2B from "./ks4/GF-S2_b.ts";
import gfS2C from "./ks4/GF-S2_c.ts";
import gfS3 from "./ks4/GF-S3.ts";
import gfS3A from "./ks4/GF-S3_a.ts";
import gfS3B from "./ks4/GF-S3_b.ts";
import gfS3C from "./ks4/GF-S3_c.ts";
import ghS3 from "./ks4/GH-S3.ts";
import ghS3A from "./ks4/GH-S3_a.ts";
import ghS3B from "./ks4/GH-S3_b.ts";
import gfS4 from "./ks4/GF-S4.ts";
import gfS4A from "./ks4/GF-S4_a.ts";
import gfS4B from "./ks4/GF-S4_b.ts";
import gfS4C from "./ks4/GF-S4_c.ts";
import ghS4 from "./ks4/GH-S4.ts";
import ghS4A from "./ks4/GH-S4_a.ts";
import ghS4B from "./ks4/GH-S4_b.ts";
import gfS5 from "./ks4/GF-S5.ts";
import gfS6 from "./ks4/GF-S6.ts";
import gfS6A from "./ks4/GF-S6_a.ts";
import gfS6B from "./ks4/GF-S6_b.ts";
import alP11a from "./ks5/AL-P1.1a.ts";
import alP11b from "./ks5/AL-P1.1b.ts";
import alP21 from "./ks5/AL-P2.1.ts";
import alP22 from "./ks5/AL-P2.2.ts";
import alP23 from "./ks5/AL-P2.3.ts";
import alP23A from "./ks5/AL-P2.3_a.ts";
import alP23B from "./ks5/AL-P2.3_b.ts";
import alP23C from "./ks5/AL-P2.3_c.ts";
import alP24 from "./ks5/AL-P2.4.ts";
import alP24A from "./ks5/AL-P2.4_a.ts";
import alP24B from "./ks5/AL-P2.4_b.ts";
import alP25 from "./ks5/AL-P2.5.ts";
import alP25A from "./ks5/AL-P2.5_a.ts";
import alP25B from "./ks5/AL-P2.5_b.ts";
import alP26a from "./ks5/AL-P2.6a.ts";
import alP26aA from "./ks5/AL-P2.6a_a.ts";
import alP26aB from "./ks5/AL-P2.6a_b.ts";
import alP26aC from "./ks5/AL-P2.6a_c.ts";
import alP26b from "./ks5/AL-P2.6b.ts";
import alP27a from "./ks5/AL-P2.7a.ts";
import alP27b from "./ks5/AL-P2.7b.ts";
import alP28 from "./ks5/AL-P2.8.ts";
import alP28A from "./ks5/AL-P2.8_a.ts";
import alP28B from "./ks5/AL-P2.8_b.ts";
import alP28C from "./ks5/AL-P2.8_c.ts";
import alP29a from "./ks5/AL-P2.9a.ts";
import alP29b from "./ks5/AL-P2.9b.ts";
import alP210 from "./ks5/AL-P2.10.ts";
import alP211 from "./ks5/AL-P2.11.ts";
import alP31 from "./ks5/AL-P3.1.ts";
import alP31A from "./ks5/AL-P3.1_a.ts";
import alP31B from "./ks5/AL-P3.1_b.ts";
import alP32 from "./ks5/AL-P3.2.ts";
import alP32A from "./ks5/AL-P3.2_a.ts";
import alP32B from "./ks5/AL-P3.2_b.ts";
import alP33 from "./ks5/AL-P3.3.ts";
import alP34 from "./ks5/AL-P3.4.ts";
import alP41a from "./ks5/AL-P4.1a.ts";
import alP41b from "./ks5/AL-P4.1b.ts";
import alP42 from "./ks5/AL-P4.2.ts";
import alP43 from "./ks5/AL-P4.3.ts";
import alP44 from "./ks5/AL-P4.4.ts";
import alP44A from "./ks5/AL-P4.4_a.ts";
import alP44B from "./ks5/AL-P4.4_b.ts";
import alP45 from "./ks5/AL-P4.5.ts";
import alP45A from "./ks5/AL-P4.5_a.ts";
import alP45B from "./ks5/AL-P4.5_b.ts";
import alP45C from "./ks5/AL-P4.5_c.ts";
import alP46 from "./ks5/AL-P4.6.ts";
import alP51a from "./ks5/AL-P5.1a.ts";
import alP51aA from "./ks5/AL-P5.1a_a.ts";
import alP51aB from "./ks5/AL-P5.1a_b.ts";
import alP51aC from "./ks5/AL-P5.1a_c.ts";
import alP51aD from "./ks5/AL-P5.1a_d.ts";
import alP51b from "./ks5/AL-P5.1b.ts";
import alP51bA from "./ks5/AL-P5.1b_a.ts";
import alP51bB from "./ks5/AL-P5.1b_b.ts";
import alP51bC from "./ks5/AL-P5.1b_c.ts";
import alP52 from "./ks5/AL-P5.2.ts";
import alP53 from "./ks5/AL-P5.3.ts";
import alP54 from "./ks5/AL-P5.4.ts";
import alP54A from "./ks5/AL-P5.4_a.ts";
import alP54B from "./ks5/AL-P5.4_b.ts";
import alP55a from "./ks5/AL-P5.5a.ts";
import alP55b from "./ks5/AL-P5.5b.ts";
import alP56 from "./ks5/AL-P5.6.ts";
import alP56A from "./ks5/AL-P5.6_a.ts";
import alP56B from "./ks5/AL-P5.6_b.ts";
import alP56C from "./ks5/AL-P5.6_c.ts";
import alP57 from "./ks5/AL-P5.7.ts";
import alP57A from "./ks5/AL-P5.7_a.ts";
import alP57B from "./ks5/AL-P5.7_b.ts";
import alP57C from "./ks5/AL-P5.7_c.ts";
import alP58 from "./ks5/AL-P5.8.ts";
import alP59 from "./ks5/AL-P5.9.ts";
import alP61 from "./ks5/AL-P6.1.ts";
import alP62 from "./ks5/AL-P6.2.ts";
import alP63 from "./ks5/AL-P6.3.ts";
import alP64 from "./ks5/AL-P6.4.ts";
import alP65 from "./ks5/AL-P6.5.ts";
import alP66 from "./ks5/AL-P6.6.ts";
import alP67 from "./ks5/AL-P6.7.ts";
import alP68 from "./ks5/AL-P6.8.ts";
import alP71a from "./ks5/AL-P7.1a.ts";
import alP71b from "./ks5/AL-P7.1b.ts";
import alP72a from "./ks5/AL-P7.2a.ts";
import alP72b from "./ks5/AL-P7.2b.ts";
import alP73 from "./ks5/AL-P7.3.ts";
import alP73A from "./ks5/AL-P7.3_a.ts";
import alP73B from "./ks5/AL-P7.3_b.ts";
import alP73C from "./ks5/AL-P7.3_c.ts";
import alP74 from "./ks5/AL-P7.4.ts";
import alP74A from "./ks5/AL-P7.4_a.ts";
import alP74B from "./ks5/AL-P7.4_b.ts";
import alP74C from "./ks5/AL-P7.4_c.ts";
import alP75 from "./ks5/AL-P7.5.ts";
import alP75A from "./ks5/AL-P7.5_a.ts";
import alP75B from "./ks5/AL-P7.5_b.ts";
import alP76 from "./ks5/AL-P7.6.ts";
import alP81 from "./ks5/AL-P8.1.ts";
import alP82 from "./ks5/AL-P8.2.ts";
import alP83 from "./ks5/AL-P8.3.ts";
import alP84 from "./ks5/AL-P8.4.ts";
import alP84A from "./ks5/AL-P8.4_a.ts";
import alP84B from "./ks5/AL-P8.4_b.ts";
import alP84C from "./ks5/AL-P8.4_c.ts";
import alP85 from "./ks5/AL-P8.5.ts";
import alP86 from "./ks5/AL-P8.6.ts";
import alP87 from "./ks5/AL-P8.7.ts";
import alP87A from "./ks5/AL-P8.7_a.ts";
import alP87B from "./ks5/AL-P8.7_b.ts";
import alP88 from "./ks5/AL-P8.8.ts";
import alP89 from "./ks5/AL-P8.9.ts";
import alP810 from "./ks5/AL-P8.10.ts";
import alP91 from "./ks5/AL-P9.1.ts";
import alP92 from "./ks5/AL-P9.2.ts";
import alP93 from "./ks5/AL-P9.3.ts";
import alP94 from "./ks5/AL-P9.4.ts";
import alP95 from "./ks5/AL-P9.5.ts";
import alP101a from "./ks5/AL-P10.1a.ts";
import alP101b from "./ks5/AL-P10.1b.ts";
import alP102 from "./ks5/AL-P10.2.ts";
import alP103 from "./ks5/AL-P10.3.ts";
import alP104 from "./ks5/AL-P10.4.ts";
import alP105 from "./ks5/AL-P10.5.ts";
import alS11 from "./ks5/AL-S1.1.ts";
import alS11A from "./ks5/AL-S1.1_a.ts";
import alS11B from "./ks5/AL-S1.1_b.ts";
import alS21 from "./ks5/AL-S2.1.ts";
import alS21A from "./ks5/AL-S2.1_a.ts";
import alS21B from "./ks5/AL-S2.1_b.ts";
import alS21C from "./ks5/AL-S2.1_c.ts";
import alS22a from "./ks5/AL-S2.2a.ts";
import alS22b from "./ks5/AL-S2.2b.ts";
import alS23 from "./ks5/AL-S2.3.ts";
import alS23A from "./ks5/AL-S2.3_a.ts";
import alS23B from "./ks5/AL-S2.3_b.ts";
import alS24 from "./ks5/AL-S2.4.ts";
import alS31 from "./ks5/AL-S3.1.ts";
import alS32 from "./ks5/AL-S3.2.ts";
import alS32A from "./ks5/AL-S3.2_a.ts";
import alS32B from "./ks5/AL-S3.2_b.ts";
import alS32C from "./ks5/AL-S3.2_c.ts";
import alS33 from "./ks5/AL-S3.3.ts";
import alS41 from "./ks5/AL-S4.1.ts";
import alS41A from "./ks5/AL-S4.1_a.ts";
import alS41B from "./ks5/AL-S4.1_b.ts";
import alS42 from "./ks5/AL-S4.2.ts";
import alS42A from "./ks5/AL-S4.2_a.ts";
import alS42B from "./ks5/AL-S4.2_b.ts";
import alS42C from "./ks5/AL-S4.2_c.ts";
import alS43 from "./ks5/AL-S4.3.ts";
import alS51a from "./ks5/AL-S5.1a.ts";
import alS51aA from "./ks5/AL-S5.1a_a.ts";
import alS51aB from "./ks5/AL-S5.1a_b.ts";
import alS51aC from "./ks5/AL-S5.1a_c.ts";
import alS51b from "./ks5/AL-S5.1b.ts";
import alS52 from "./ks5/AL-S5.2.ts";
import alS53 from "./ks5/AL-S5.3.ts";
import alM61 from "./ks5/AL-M6.1.ts";
import alM71 from "./ks5/AL-M7.1.ts";
import alM72 from "./ks5/AL-M7.2.ts";
import alM72A from "./ks5/AL-M7.2_a.ts";
import alM72B from "./ks5/AL-M7.2_b.ts";
import alM73a from "./ks5/AL-M7.3a.ts";
import alM73b from "./ks5/AL-M7.3b.ts";
import alM74a from "./ks5/AL-M7.4a.ts";
import alM74b from "./ks5/AL-M7.4b.ts";
import alM75 from "./ks5/AL-M7.5.ts";
import alM81 from "./ks5/AL-M8.1.ts";
import alM82 from "./ks5/AL-M8.2.ts";
import alM83 from "./ks5/AL-M8.3.ts";
import alM84 from "./ks5/AL-M8.4.ts";
import alM84A from "./ks5/AL-M8.4_a.ts";
import alM84B from "./ks5/AL-M8.4_b.ts";
import alM85 from "./ks5/AL-M8.5.ts";
import alM86 from "./ks5/AL-M8.6.ts";
import alM86A from "./ks5/AL-M8.6_a.ts";
import alM86B from "./ks5/AL-M8.6_b.ts";
import alM91 from "./ks5/AL-M9.1.ts";
import alM91A from "./ks5/AL-M9.1_a.ts";
import alM91B from "./ks5/AL-M9.1_b.ts";
import fmCp01 from "./ks5/FM-CP-01.ts";
import fmCp02 from "./ks5/FM-CP-02.ts";
import fmCp03 from "./ks5/FM-CP-03.ts";
import fmCp04 from "./ks5/FM-CP-04.ts";
import fmCp05 from "./ks5/FM-CP-05.ts";
import fmCp06 from "./ks5/FM-CP-06.ts";
import fmCp07 from "./ks5/FM-CP-07.ts";
import fmCp08 from "./ks5/FM-CP-08.ts";
import fmCp09 from "./ks5/FM-CP-09.ts";
import fmCp10 from "./ks5/FM-CP-10.ts";
import fmCp11 from "./ks5/FM-CP-11.ts";
import fmCp12 from "./ks5/FM-CP-12.ts";
import fmCp13 from "./ks5/FM-CP-13.ts";
import fmCp14 from "./ks5/FM-CP-14.ts";
import fmCp15 from "./ks5/FM-CP-15.ts";
import fmCp16 from "./ks5/FM-CP-16.ts";
import fmCp17 from "./ks5/FM-CP-17.ts";
import fmCp18 from "./ks5/FM-CP-18.ts";
import fmCp19 from "./ks5/FM-CP-19.ts";
import fmCp20 from "./ks5/FM-CP-20.ts";
import fmCp21 from "./ks5/FM-CP-21.ts";
import fmCp22 from "./ks5/FM-CP-22.ts";
import fmCp23 from "./ks5/FM-CP-23.ts";
import fmCp24 from "./ks5/FM-CP-24.ts";
import fmCp25 from "./ks5/FM-CP-25.ts";
import fmCp26 from "./ks5/FM-CP-26.ts";
import fmCp27 from "./ks5/FM-CP-27.ts";
import fmCp28 from "./ks5/FM-CP-28.ts";
import fmCp29 from "./ks5/FM-CP-29.ts";
import fmCp30 from "./ks5/FM-CP-30.ts";
import fmCp31 from "./ks5/FM-CP-31.ts";
import fmFp101 from "./ks5/FM-FP1-01.ts";
import fmFp102 from "./ks5/FM-FP1-02.ts";
import fmFp103 from "./ks5/FM-FP1-03.ts";
import fmFp104 from "./ks5/FM-FP1-04.ts";
import fmFp105 from "./ks5/FM-FP1-05.ts";
import fmFp106 from "./ks5/FM-FP1-06.ts";
import fmFp107 from "./ks5/FM-FP1-07.ts";
import fmFp201 from "./ks5/FM-FP2-01.ts";
import fmFp202 from "./ks5/FM-FP2-02.ts";
import fmFp203 from "./ks5/FM-FP2-03.ts";
import fmFp204 from "./ks5/FM-FP2-04.ts";
import fmFp205 from "./ks5/FM-FP2-05.ts";
import fmFp206 from "./ks5/FM-FP2-06.ts";
import fmFs101 from "./ks5/FM-FS1-01.ts";
import fmFs102 from "./ks5/FM-FS1-02.ts";
import fmFs103 from "./ks5/FM-FS1-03.ts";
import fmFs104 from "./ks5/FM-FS1-04.ts";
import fmFs105 from "./ks5/FM-FS1-05.ts";
import fmFs106 from "./ks5/FM-FS1-06.ts";
import fmFs107 from "./ks5/FM-FS1-07.ts";
import fmFs108 from "./ks5/FM-FS1-08.ts";
import fmFs201 from "./ks5/FM-FS2-01.ts";
import fmFs202 from "./ks5/FM-FS2-02.ts";
import fmFs203 from "./ks5/FM-FS2-03.ts";
import fmFs204 from "./ks5/FM-FS2-04.ts";
import fmFs205 from "./ks5/FM-FS2-05.ts";
import fmFs206 from "./ks5/FM-FS2-06.ts";
import fmFm101 from "./ks5/FM-FM1-01.ts";
import fmFm102 from "./ks5/FM-FM1-02.ts";
import fmFm103 from "./ks5/FM-FM1-03.ts";
import fmFm104 from "./ks5/FM-FM1-04.ts";
import fmFm105 from "./ks5/FM-FM1-05.ts";
import fmFm201 from "./ks5/FM-FM2-01.ts";
import fmFm202 from "./ks5/FM-FM2-02.ts";
import fmFm203 from "./ks5/FM-FM2-03.ts";
import fmFm204 from "./ks5/FM-FM2-04.ts";
import fmFm205 from "./ks5/FM-FM2-05.ts";
import fmD101 from "./ks5/FM-D1-01.ts";
import fmD102 from "./ks5/FM-D1-02.ts";
import fmD103 from "./ks5/FM-D1-03.ts";
import fmD104 from "./ks5/FM-D1-04.ts";
import fmD105 from "./ks5/FM-D1-05.ts";
import fmD106 from "./ks5/FM-D1-06.ts";
import fmD201 from "./ks5/FM-D2-01.ts";
import fmD202 from "./ks5/FM-D2-02.ts";
import fmD203 from "./ks5/FM-D2-03.ts";
import fmD204 from "./ks5/FM-D2-04.ts";
import fmD205 from "./ks5/FM-D2-05.ts";
import fmD206 from "./ks5/FM-D2-06.ts";
import cmA1 from "./ks5/CM-A1.ts";
import cmA2 from "./ks5/CM-A2.ts";
import cmA3 from "./ks5/CM-A3.ts";
import cmA4 from "./ks5/CM-A4.ts";
import cmA5 from "./ks5/CM-A5.ts";
import cmA6 from "./ks5/CM-A6.ts";
import cmA7 from "./ks5/CM-A7.ts";
import cmA8 from "./ks5/CM-A8.ts";
import cmA9 from "./ks5/CM-A9.ts";
import cmA10 from "./ks5/CM-A10.ts";
import cmP1 from "./ks5/CM-P1.ts";
import cmP2 from "./ks5/CM-P2.ts";
import cmP3 from "./ks5/CM-P3.ts";
import cmP4 from "./ks5/CM-P4.ts";
import cmP5 from "./ks5/CM-P5.ts";
import cmP6 from "./ks5/CM-P6.ts";
import cmP7 from "./ks5/CM-P7.ts";
import cmLp1 from "./ks5/CM-LP1.ts";
import cmLp2 from "./ks5/CM-LP2.ts";
import cmLp3 from "./ks5/CM-LP3.ts";
import cmLp4 from "./ks5/CM-LP4.ts";
import cmLp5 from "./ks5/CM-LP5.ts";
import cmLp6 from "./ks5/CM-LP6.ts";
import cmLp7 from "./ks5/CM-LP7.ts";
import cmLp8 from "./ks5/CM-LP8.ts";
import cmLp9 from "./ks5/CM-LP9.ts";
import cmLp10 from "./ks5/CM-LP10.ts";
import cmLp11 from "./ks5/CM-LP11.ts";
import cmSg1 from "./ks5/CM-SG1.ts";
import cmSg2 from "./ks5/CM-SG2.ts";
import cmSg3 from "./ks5/CM-SG3.ts";
import cmSg4 from "./ks5/CM-SG4.ts";
import cmSg5 from "./ks5/CM-SG5.ts";
import cmSg6 from "./ks5/CM-SG6.ts";
import cmSg7 from "./ks5/CM-SG7.ts";
import cmSg8 from "./ks5/CM-SG8.ts";
import cmSg9 from "./ks5/CM-SG9.ts";
import cmSg10 from "./ks5/CM-SG10.ts";

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
  nPos01,
  nPos02,
  nPos03,
  nMea01,
  nMea01A,
  nMea01B,
  nMea01C,
  nGeo01,
  nGeo02,
  nPat01,
  nPat02,
  nPat03,
  nMea02,
  rNpv01,
  rNpv02,
  rNpv03,
  rNpv04,
  rNpv05,
  rNpv06,
  rNpv07,
  rNpv08,
  rAs01,
  rAs01A,
  rAs01B,
  rNpv09,
  rNpv10,
  rPat01,
  rPat01A,
  rPat01B,
  rPat01C,
  rGeo01,
  rGeo02,
  rPat02,
  rMea01,
  rMea01A,
  rMea01B,
  rMea01C,
  y1Npv01,
  y1Npv01A,
  y1Npv01B,
  y1Npv02,
  y1Npv02A,
  y1Npv02B,
  y1Npv02C,
  y1Npv02D,
  y1Npv03,
  y1Npv04,
  y1Npv04A,
  y1Npv04B,
  y1Npv04C,
  y1Npv05,
  y1As01,
  y1As02,
  y1As02A,
  y1As02B,
  y1As02C,
  y1As03,
  y1As03A,
  y1As03B,
  y1As03C,
  y1As04,
  y1As04A,
  y1As04B,
  y1Md01,
  y1Md01A,
  y1Md01B,
  y1Md01C,
  y1Fr01,
  y1Fr02,
  y1Mea01,
  y1Mea01A,
  y1Mea01B,
  y1Mea01C,
  y1Mea01D,
  y1Mea02,
  y1Mea02A,
  y1Mea02B,
  y1Mea02C,
  y1Mea02D,
  y1Mea03,
  y1Mea04,
  y1Mea05,
  y1Mea06,
  y1Mea06A,
  y1Mea06B,
  y1Mea06C,
  y1Geo01,
  y1Geo02,
  y1Pos01,
  y1Pos01A,
  y1Pos01B,
  y1Pos01C,
  y2Npv01,
  y2Npv01A,
  y2Npv01B,
  y2Npv01C,
  y2Npv02,
  y2Npv03,
  y2Npv04,
  y2Npv04A,
  y2Npv04B,
  y2Npv05,
  y2Npv06,
  y2As01,
  y2As01A,
  y2As01B,
  y2As02,
  y2As02A,
  y2As02B,
  y2As02C,
  y2As02D,
  y2As03,
  y2As04,
  y2As05,
  y2Md01,
  y2Md01A,
  y2Md01B,
  y2Md01C,
  y2Md01D,
  y2Md02,
  y2Md03,
  y2Md04,
  y2Md04A,
  y2Md04B,
  y2Fr01,
  y2Fr01A,
  y2Fr01B,
  y2Fr01C,
  y2Fr02,
  y2Fr02A,
  y2Fr02B,
  y2Mea01,
  y2Mea01A,
  y2Mea01B,
  y2Mea01C,
  y2Mea01D,
  y2Mea02,
  y2Mea02A,
  y2Mea02B,
  y2Mea02C,
  y2Mea03,
  y2Mea03A,
  y2Mea03B,
  y2Mea03C,
  y2Mea04,
  y2Mea05,
  y2Mea06,
  y2Mea06A,
  y2Mea06B,
  y2Mea07,
  y2Geo01,
  y2Geo01A,
  y2Geo01B,
  y2Geo02,
  y2Geo02A,
  y2Geo02B,
  y2Geo03,
  y2Geo04,
  y2Pos01,
  y2Pos02,
  y2Pos02A,
  y2Pos02B,
  y2Pos02C,
  y2Sta01,
  y2Sta01A,
  y2Sta01B,
  y2Sta01C,
  y2Sta01D,
  y2Sta02,
  y2Sta03,
  y3Npv01,
  y3Npv01A,
  y3Npv01B,
  y3Npv01C,
  y3Npv02,
  y3Npv03,
  y3Npv04,
  y3Npv05,
  y3Npv06,
  y3As01,
  y3As01A,
  y3As01B,
  y3As01C,
  y3As02,
  y3As02A,
  y3As02B,
  y3As03,
  y3As03A,
  y3As03B,
  y3As04,
  y3Md01,
  y3Md01A,
  y3Md01B,
  y3Md01C,
  y3Md02,
  y3Md02A,
  y3Md02B,
  y3Md02C,
  y3Md03,
  y3Md03A,
  y3Md03B,
  y3Md03C,
  y3Fr01,
  y3Fr01A,
  y3Fr01B,
  y3Fr02,
  y3Fr02A,
  y3Fr02B,
  y3Fr03,
  y3Fr04,
  y3Fr05,
  y3Fr06,
  y3Fr07,
  y3Mea01,
  y3Mea01A,
  y3Mea01B,
  y3Mea01C,
  y3Mea02,
  y3Mea03,
  y3Mea04,
  y3Mea04A,
  y3Mea04B,
  y3Mea04C,
  y3Mea05,
  y3Mea05A,
  y3Mea05B,
  y3Mea06,
  y3Mea06A,
  y3Mea06B,
  y3Mea06C,
  y3Mea07,
  y3Geo01,
  y3Geo01A,
  y3Geo01B,
  y3Geo02,
  y3Geo03,
  y3Geo03A,
  y3Geo03B,
  y3Geo03C,
  y3Geo04,
  y3Geo04A,
  y3Geo04B,
  y3Sta01,
  y3Sta01A,
  y3Sta01B,
  y3Sta01C,
  y3Sta02,
  y3Sta02A,
  y3Sta02B,
  y4Npv01,
  y4Npv01A,
  y4Npv01B,
  y4Npv01C,
  y4Npv02,
  y4Npv03,
  y4Npv04,
  y4Npv05,
  y4Npv06,
  y4Npv07,
  y4Npv07A,
  y4Npv07B,
  y4Npv07C,
  y4Npv08,
  y4Npv09,
  y4As01,
  y4As01A,
  y4As01B,
  y4As02,
  y4As03,
  y4Md01,
  y4Md01A,
  y4Md01B,
  y4Md01C,
  y4Md01D,
  y4Md02,
  y4Md02A,
  y4Md02B,
  y4Md02C,
  y4Md03,
  y4Md04,
  y4Md04A,
  y4Md04B,
  y4Md05,
  y4Md05A,
  y4Md05B,
  y4Fr01,
  y4Fr02,
  y4Fr02A,
  y4Fr02B,
  y4Fr03,
  y4Fr03A,
  y4Fr03B,
  y4Fr04,
  y4Fr05,
  y4Fr05A,
  y4Fr05B,
  y4Fr06,
  y4Fr07,
  y4Fr07A,
  y4Fr07B,
  y4Fr08,
  y4Fr09,
  y4Fr10,
  y4Mea01,
  y4Mea01A,
  y4Mea01B,
  y4Mea01C,
  y4Mea02,
  y4Mea03,
  y4Mea04,
  y4Mea05,
  y4Mea05A,
  y4Mea05B,
  y4Mea06,
  y4Mea06A,
  y4Mea06B,
  y4Geo01,
  y4Geo01A,
  y4Geo01B,
  y4Geo02,
  y4Geo02A,
  y4Geo02B,
  y4Geo03,
  y4Geo04,
  y4Pos01,
  y4Pos02,
  y4Pos03,
  y4Sta01,
  y4Sta01A,
  y4Sta01B,
  y4Sta02,
  y5Npv01,
  y5Npv01A,
  y5Npv01B,
  y5Npv01C,
  y5Npv02,
  y5Npv03,
  y5Npv03A,
  y5Npv03B,
  y5Npv04,
  y5Npv04A,
  y5Npv04B,
  y5Npv05,
  y5Npv06,
  y5As01,
  y5As01A,
  y5As01B,
  y5As02,
  y5As03,
  y5As04,
  y5Md01,
  y5Md01A,
  y5Md01B,
  y5Md01C,
  y5Md02,
  y5Md02A,
  y5Md02B,
  y5Md03,
  y5Md04,
  y5Md04A,
  y5Md04B,
  y5Md05,
  y5Md06,
  y5Md06A,
  y5Md06B,
  y5Md07,
  y5Md07A,
  y5Md07B,
  y5Md08,
  y5Md08A,
  y5Md08B,
  y5Md09,
  y5Fr01,
  y5Fr02,
  y5Fr02A,
  y5Fr02B,
  y5Fr03,
  y5Fr03A,
  y5Fr03B,
  y5Fr03C,
  y5Fr04,
  y5Fr04A,
  y5Fr04B,
  y5Fr05,
  y5Fr05A,
  y5Fr05B,
  y5Fr06,
  y5Fr07,
  y5Fr08,
  y5Fr08A,
  y5Fr08B,
  y5Fr09,
  y5Fr09A,
  y5Fr09B,
  y5Fr10,
  y5Fr11,
  y5Fr11A,
  y5Fr11B,
  y5Fr11C,
  y5Fr12,
  y5Mea01,
  y5Mea01A,
  y5Mea01B,
  y5Mea01C,
  y5Mea02,
  y5Mea03,
  y5Mea04,
  y5Mea04A,
  y5Mea04B,
  y5Mea04C,
  y5Mea05,
  y5Mea05A,
  y5Mea05B,
  y5Mea06,
  y5Mea07,
  y5Geo01,
  y5Geo02,
  y5Geo02A,
  y5Geo02B,
  y5Geo03,
  y5Geo03A,
  y5Geo03B,
  y5Geo04,
  y5Geo04A,
  y5Geo04B,
  y5Geo04C,
  y5Geo05,
  y5Geo05A,
  y5Geo05B,
  y5Geo06,
  y5Pos01,
  y5Pos01A,
  y5Pos01B,
  y5Sta01,
  y5Sta02,
  y5Sta02A,
  y5Sta02B,
  y6Npv01,
  y6Npv01A,
  y6Npv01B,
  y6Npv01C,
  y6Npv02,
  y6Npv03,
  y6Npv03A,
  y6Npv03B,
  y6Npv04,
  y6Md01,
  y6Md02,
  y6Md02A,
  y6Md02B,
  y6Md02C,
  y6Md03,
  y6Md04,
  y6Md05,
  y6Md05A,
  y6Md05B,
  y6Md05C,
  y6Md06,
  y6Md07,
  y6Md08,
  y6Fr01,
  y6Fr01A,
  y6Fr01B,
  y6Fr02,
  y6Fr03,
  y6Fr03A,
  y6Fr03B,
  y6Fr04,
  y6Fr05,
  y6Fr06,
  y6Fr06A,
  y6Fr06B,
  y6Fr07,
  y6Fr07A,
  y6Fr07B,
  y6Fr08,
  y6Fr09,
  y6Fr10,
  y6Fr11,
  y6Rat01,
  y6Rat02,
  y6Rat02A,
  y6Rat02B,
  y6Rat03,
  y6Rat04,
  y6Alg01,
  y6Alg02,
  y6Alg03,
  y6Alg04,
  y6Alg05,
  y6Mea01,
  y6Mea02,
  y6Mea02A,
  y6Mea02B,
  y6Mea02C,
  y6Mea03,
  y6Mea04,
  y6Mea05,
  y6Mea06,
  y6Mea06A,
  y6Mea06B,
  y6Mea07,
  y6Mea07A,
  y6Mea07B,
  y6Geo01,
  y6Geo02,
  y6Geo03,
  y6Geo03A,
  y6Geo03B,
  y6Geo03C,
  y6Geo03D,
  y6Geo04,
  y6Geo04A,
  y6Geo04B,
  y6Geo05,
  y6Geo05A,
  y6Geo05B,
  y6Geo05C,
  y6Pos01,
  y6Pos02,
  y6Pos02A,
  y6Pos02B,
  y6Sta01,
  y6Sta01A,
  y6Sta01B,
  y6Sta02,
  y7Npv01,
  y7Npv02,
  y7Npv02A,
  y7Npv02B,
  y7Npv02C,
  y7Npv03,
  y7Npv03A,
  y7Npv03B,
  y7Npv03C,
  y7Npv03D,
  y7Npv04,
  y7Npv04A,
  y7Npv04B,
  y7Npv04C,
  y7Npv04D,
  y7Npv05,
  y7Npv05A,
  y7Npv05B,
  y7Npv05C,
  y7Npv06,
  y7Npv07,
  y7Npv07A,
  y7Npv07B,
  y7Npv07C,
  y7Npv07D,
  y7Npv08,
  y7Npv08A,
  y7Npv08B,
  y7Npv09,
  y7Npv09A,
  y7Npv09B,
  y7Npv10,
  y7Fr01,
  y7Alg01,
  y7Alg01A,
  y7Alg01B,
  y7Alg01C,
  y7Alg02,
  y7Alg02A,
  y7Alg02B,
  y7Alg03,
  y7Alg04,
  y7Alg04A,
  y7Alg04B,
  y7Alg05,
  y7Alg05A,
  y7Alg05B,
  y7Alg06,
  y7Alg06A,
  y7Alg06B,
  y7Rat01,
  y7Rat01A,
  y7Rat01B,
  y7Rat01C,
  y7Rat02,
  y7Rat03,
  y7Rat03A,
  y7Rat03B,
  y7Rat03C,
  y7Rat04,
  y7Rat04A,
  y7Rat04B,
  y7Rat05,
  y7Rat05A,
  y7Rat05B,
  y7Geo01,
  y7Geo01A,
  y7Geo01B,
  y7Geo01C,
  y7Geo01D,
  y7Geo02,
  y7Geo02A,
  y7Geo02B,
  y7Geo03,
  y7Geo03A,
  y7Geo03B,
  y7Geo04,
  y7Geo04A,
  y7Geo04B,
  y7Geo05,
  y7Geo05A,
  y7Geo05B,
  y7Geo05C,
  y7Geo06,
  y7Geo06A,
  y7Geo06B,
  y7Geo06C,
  y7Sta01,
  y7Sta01A,
  y7Sta01B,
  y7Sta01C,
  y7Sta01D,
  y7Pro01,
  y7Pro01A,
  y7Pro01B,
  y7Pro02,
  y8Npv01,
  y8Npv01A,
  y8Npv01B,
  y8Npv02,
  y8Alg01,
  y8Alg01A,
  y8Alg01B,
  y8Alg02,
  y8Alg02A,
  y8Alg02B,
  y8Alg03,
  y8Alg04,
  y8Alg04A,
  y8Alg04B,
  y8Alg04C,
  y8Alg05,
  y8Alg06,
  y8Alg06A,
  y8Alg06B,
  y8Alg07,
  y8Alg08,
  y8Alg08A,
  y8Alg08B,
  y8Alg09,
  y8Rat01,
  y8Rat02,
  y8Rat03,
  y8Rat03A,
  y8Rat03B,
  y8Rat03C,
  y8Rat03D,
  y8Rat04,
  y8Rat04A,
  y8Rat04B,
  y8Rat05,
  y8Rat05A,
  y8Rat05B,
  y8Rat05C,
  y8Geo01,
  y8Geo01A,
  y8Geo01B,
  y8Geo01C,
  y8Geo02,
  y8Geo02A,
  y8Geo02B,
  y8Geo03,
  y8Geo04,
  y8Geo04A,
  y8Geo04B,
  y8Geo04C,
  y8Geo04D,
  y8Geo05,
  y8Geo05A,
  y8Geo05B,
  y8Pos01,
  y8Pos01A,
  y8Pos01B,
  y8Pos01C,
  y8Geo06,
  y8Sta01,
  y8Sta01A,
  y8Sta01B,
  y8Sta01C,
  y8Sta02,
  y8Sta02A,
  y8Sta02B,
  y8Pro01,
  y9Npv01,
  y9Npv01A,
  y9Npv01B,
  y9Alg01,
  y9Alg01A,
  y9Alg01B,
  y9Alg02,
  y9Alg02A,
  y9Alg02B,
  y9Alg02C,
  y9Alg03,
  y9Alg04,
  y9Alg04A,
  y9Alg04B,
  y9Alg04C,
  y9Alg05,
  y9Alg05A,
  y9Alg05B,
  y9Alg06,
  y9Alg06A,
  y9Alg06B,
  y9Alg07,
  y9Alg07A,
  y9Alg07B,
  y9Alg08,
  y9Alg08A,
  y9Alg08B,
  y9Alg09,
  y9Rat01,
  y9Rat02,
  y9Rat03,
  y9Rat03A,
  y9Rat03B,
  y9Geo01,
  y9Geo01A,
  y9Geo01B,
  y9Geo01C,
  y9Geo02,
  y9Geo02A,
  y9Geo02B,
  y9Geo03,
  y9Pos01,
  y9Pro01,
  y9Pro01A,
  y9Pro01B,
  y9Pro02,
  y9Pro02A,
  y9Pro02B,
  gfN1,
  gfN1A,
  gfN1B,
  gfN2,
  gfN2A,
  gfN2B,
  gfN2C,
  gfN2D,
  gfN3,
  gfN3A,
  gfN3B,
  gfN4,
  gfN4A,
  gfN4B,
  gfN4C,
  gfN5,
  ghN5,
  gfN6,
  gfN6A,
  gfN6B,
  gfN6C,
  ghN6,
  gfN7,
  gfN7A,
  gfN7B,
  ghN7,
  gfN8,
  gfN8A,
  gfN8B,
  ghN8,
  ghN8A,
  ghN8B,
  ghN8C,
  gfN9,
  gfN9A,
  gfN9B,
  gfN10,
  ghN10,
  ghN10A,
  ghN10B,
  gfN11,
  gfN12,
  gfN12A,
  gfN12B,
  gfN13,
  gfN13A,
  gfN13B,
  gfN14,
  gfN15,
  gfN15A,
  gfN15B,
  gfN15C,
  gfN15D,
  gfN16,
  ghN16,
  gfA1,
  gfA2,
  gfA2A,
  gfA2B,
  gfA3,
  ghA3,
  gfA4,
  gfA4A,
  gfA4B,
  gfA4C,
  gfA4D,
  gfA4E,
  gfA4F,
  gfA4G,
  ghA4,
  ghA4A,
  ghA4B,
  ghA4C,
  ghA4D,
  gfA5,
  gfA5A,
  gfA5B,
  gfA6,
  gfA6A,
  gfA6B,
  gfA6C,
  ghA6,
  gfA7,
  ghA7,
  gfA8,
  gfA9,
  gfA9A,
  gfA9B,
  gfA9C,
  gfA9D,
  ghA9,
  gfA10,
  gfA10A,
  gfA10B,
  gfA11,
  gfA11A,
  gfA11B,
  gfA11C,
  ghA11,
  gfA12,
  gfA12A,
  gfA12B,
  gfA12C,
  ghA12,
  ghA12A,
  ghA12B,
  ghA13,
  gfA14,
  gfA14A,
  gfA14B,
  ghA14,
  ghA15,
  ghA15A,
  ghA15B,
  ghA15C,
  ghA16,
  ghA16A,
  ghA16B,
  gfA17,
  gfA17A,
  gfA17B,
  gfA17C,
  ghA17,
  gfA18,
  gfA18A,
  gfA18B,
  ghA18,
  ghA18A,
  ghA18B,
  ghA18C,
  gfA19,
  gfA19A,
  gfA19B,
  gfA19C,
  ghA19,
  ghA20,
  gfA21,
  gfA22,
  ghA22,
  ghA22A,
  ghA22B,
  ghA22C,
  gfA23,
  gfA23A,
  gfA23B,
  gfA24,
  gfA24A,
  gfA24B,
  gfA24C,
  gfA24D,
  ghA24,
  gfA25,
  ghA25,
  gfR1,
  ghR1,
  gfR2,
  gfR3,
  gfR4,
  gfR5,
  gfR5A,
  gfR5B,
  gfR5C,
  gfR6,
  gfR7,
  gfR8,
  gfR9,
  gfR9A,
  gfR9B,
  gfR9C,
  gfR9D,
  gfR10,
  gfR10A,
  gfR10B,
  gfR10C,
  gfR11,
  gfR11A,
  gfR11B,
  gfR11C,
  gfR11D,
  gfR12,
  gfR13,
  ghR13,
  gfR14,
  ghR14,
  ghR15,
  gfR16,
  gfR16A,
  gfR16B,
  gfR16C,
  ghR16,
  gfG1,
  gfG2,
  gfG2A,
  gfG2B,
  gfG3,
  gfG3A,
  gfG3B,
  gfG3C,
  gfG4,
  gfG4A,
  gfG4B,
  gfG5,
  gfG6,
  gfG7,
  gfG7A,
  gfG7B,
  gfG7C,
  gfG7D,
  ghG7,
  ghG8,
  gfG9,
  ghG10,
  gfG11,
  gfG12,
  gfG13,
  gfG13A,
  gfG13B,
  gfG14,
  gfG15,
  gfG15A,
  gfG15B,
  gfG15C,
  gfG16,
  gfG16A,
  gfG16B,
  gfG16C,
  gfG17,
  gfG17A,
  gfG17B,
  gfG17C,
  gfG17D,
  gfG18,
  gfG18A,
  gfG18B,
  gfG18C,
  gfG19,
  ghG19,
  gfG20,
  gfG20A,
  gfG20B,
  gfG20C,
  ghG20,
  ghG20A,
  ghG20B,
  ghG20C,
  gfG21,
  gfG21A,
  gfG21B,
  ghG22,
  ghG22A,
  ghG22B,
  ghG23,
  gfG24,
  gfG25,
  gfG25A,
  gfG25B,
  gfG25C,
  ghG25,
  gfP1,
  gfP2,
  gfP3,
  gfP4,
  gfP5,
  gfP6,
  gfP6A,
  gfP6B,
  gfP6C,
  gfP7,
  gfP8,
  gfP8A,
  gfP8B,
  ghP9,
  ghP9A,
  ghP9B,
  ghP9C,
  gfS1,
  gfS2,
  gfS2A,
  gfS2B,
  gfS2C,
  gfS3,
  gfS3A,
  gfS3B,
  gfS3C,
  ghS3,
  ghS3A,
  ghS3B,
  gfS4,
  gfS4A,
  gfS4B,
  gfS4C,
  ghS4,
  ghS4A,
  ghS4B,
  gfS5,
  gfS6,
  gfS6A,
  gfS6B,
  alP11a,
  alP11b,
  alP21,
  alP22,
  alP23,
  alP23A,
  alP23B,
  alP23C,
  alP24,
  alP24A,
  alP24B,
  alP25,
  alP25A,
  alP25B,
  alP26a,
  alP26aA,
  alP26aB,
  alP26aC,
  alP26b,
  alP27a,
  alP27b,
  alP28,
  alP28A,
  alP28B,
  alP28C,
  alP29a,
  alP29b,
  alP210,
  alP211,
  alP31,
  alP31A,
  alP31B,
  alP32,
  alP32A,
  alP32B,
  alP33,
  alP34,
  alP41a,
  alP41b,
  alP42,
  alP43,
  alP44,
  alP44A,
  alP44B,
  alP45,
  alP45A,
  alP45B,
  alP45C,
  alP46,
  alP51a,
  alP51aA,
  alP51aB,
  alP51aC,
  alP51aD,
  alP51b,
  alP51bA,
  alP51bB,
  alP51bC,
  alP52,
  alP53,
  alP54,
  alP54A,
  alP54B,
  alP55a,
  alP55b,
  alP56,
  alP56A,
  alP56B,
  alP56C,
  alP57,
  alP57A,
  alP57B,
  alP57C,
  alP58,
  alP59,
  alP61,
  alP62,
  alP63,
  alP64,
  alP65,
  alP66,
  alP67,
  alP68,
  alP71a,
  alP71b,
  alP72a,
  alP72b,
  alP73,
  alP73A,
  alP73B,
  alP73C,
  alP74,
  alP74A,
  alP74B,
  alP74C,
  alP75,
  alP75A,
  alP75B,
  alP76,
  alP81,
  alP82,
  alP83,
  alP84,
  alP84A,
  alP84B,
  alP84C,
  alP85,
  alP86,
  alP87,
  alP87A,
  alP87B,
  alP88,
  alP89,
  alP810,
  alP91,
  alP92,
  alP93,
  alP94,
  alP95,
  alP101a,
  alP101b,
  alP102,
  alP103,
  alP104,
  alP105,
  alS11,
  alS11A,
  alS11B,
  alS21,
  alS21A,
  alS21B,
  alS21C,
  alS22a,
  alS22b,
  alS23,
  alS23A,
  alS23B,
  alS24,
  alS31,
  alS32,
  alS32A,
  alS32B,
  alS32C,
  alS33,
  alS41,
  alS41A,
  alS41B,
  alS42,
  alS42A,
  alS42B,
  alS42C,
  alS43,
  alS51a,
  alS51aA,
  alS51aB,
  alS51aC,
  alS51b,
  alS52,
  alS53,
  alM61,
  alM71,
  alM72,
  alM72A,
  alM72B,
  alM73a,
  alM73b,
  alM74a,
  alM74b,
  alM75,
  alM81,
  alM82,
  alM83,
  alM84,
  alM84A,
  alM84B,
  alM85,
  alM86,
  alM86A,
  alM86B,
  alM91,
  alM91A,
  alM91B,
  fmCp01,
  fmCp02,
  fmCp03,
  fmCp04,
  fmCp05,
  fmCp06,
  fmCp07,
  fmCp08,
  fmCp09,
  fmCp10,
  fmCp11,
  fmCp12,
  fmCp13,
  fmCp14,
  fmCp15,
  fmCp16,
  fmCp17,
  fmCp18,
  fmCp19,
  fmCp20,
  fmCp21,
  fmCp22,
  fmCp23,
  fmCp24,
  fmCp25,
  fmCp26,
  fmCp27,
  fmCp28,
  fmCp29,
  fmCp30,
  fmCp31,
  fmFp101,
  fmFp102,
  fmFp103,
  fmFp104,
  fmFp105,
  fmFp106,
  fmFp107,
  fmFp201,
  fmFp202,
  fmFp203,
  fmFp204,
  fmFp205,
  fmFp206,
  fmFs101,
  fmFs102,
  fmFs103,
  fmFs104,
  fmFs105,
  fmFs106,
  fmFs107,
  fmFs108,
  fmFs201,
  fmFs202,
  fmFs203,
  fmFs204,
  fmFs205,
  fmFs206,
  fmFm101,
  fmFm102,
  fmFm103,
  fmFm104,
  fmFm105,
  fmFm201,
  fmFm202,
  fmFm203,
  fmFm204,
  fmFm205,
  fmD101,
  fmD102,
  fmD103,
  fmD104,
  fmD105,
  fmD106,
  fmD201,
  fmD202,
  fmD203,
  fmD204,
  fmD205,
  fmD206,
  cmA1,
  cmA2,
  cmA3,
  cmA4,
  cmA5,
  cmA6,
  cmA7,
  cmA8,
  cmA9,
  cmA10,
  cmP1,
  cmP2,
  cmP3,
  cmP4,
  cmP5,
  cmP6,
  cmP7,
  cmLp1,
  cmLp2,
  cmLp3,
  cmLp4,
  cmLp5,
  cmLp6,
  cmLp7,
  cmLp8,
  cmLp9,
  cmLp10,
  cmLp11,
  cmSg1,
  cmSg2,
  cmSg3,
  cmSg4,
  cmSg5,
  cmSg6,
  cmSg7,
  cmSg8,
  cmSg9,
  cmSg10,
] as Generator[];

/** Unreviewed placeholders that exercise the gallery; real generators replace them. */
export const examples: Generator[] = [];

export {
  selectPaper,
  selectQuestions,
  type PaperSelection,
  type SelectedItem,
  type Selection,
} from "./select.ts";
