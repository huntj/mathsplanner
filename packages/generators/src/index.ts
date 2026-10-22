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
import rNpv09 from "./eyfs/R-NPV-09.ts";
import rNpv10 from "./eyfs/R-NPV-10.ts";
import rPat01 from "./eyfs/R-PAT-01.ts";
import rGeo01 from "./eyfs/R-GEO-01.ts";
import rGeo02 from "./eyfs/R-GEO-02.ts";
import rPat02 from "./eyfs/R-PAT-02.ts";
import rMea01 from "./eyfs/R-MEA-01.ts";
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
import y1Fr01 from "./ks1/Y1-FR-01.ts";
import y1Fr02 from "./ks1/Y1-FR-02.ts";
import y1Mea01 from "./ks1/Y1-MEA-01.ts";
import y1Mea02 from "./ks1/Y1-MEA-02.ts";
import y1Mea03 from "./ks1/Y1-MEA-03.ts";
import y1Mea04 from "./ks1/Y1-MEA-04.ts";
import y1Mea05 from "./ks1/Y1-MEA-05.ts";
import y1Mea06 from "./ks1/Y1-MEA-06.ts";
import y1Geo01 from "./ks1/Y1-GEO-01.ts";
import y1Geo02 from "./ks1/Y1-GEO-02.ts";
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
import y2Fr01 from "./ks1/Y2-FR-01.ts";
import y2Fr02 from "./ks1/Y2-FR-02.ts";
import y2Mea01 from "./ks1/Y2-MEA-01.ts";
import y2Mea02 from "./ks1/Y2-MEA-02.ts";
import y2Mea03 from "./ks1/Y2-MEA-03.ts";
import y2Mea04 from "./ks1/Y2-MEA-04.ts";
import y2Mea05 from "./ks1/Y2-MEA-05.ts";
import y2Mea06 from "./ks1/Y2-MEA-06.ts";
import y2Mea07 from "./ks1/Y2-MEA-07.ts";
import y2Geo01 from "./ks1/Y2-GEO-01.ts";
import y2Geo02 from "./ks1/Y2-GEO-02.ts";
import y2Geo03 from "./ks1/Y2-GEO-03.ts";
import y2Geo04 from "./ks1/Y2-GEO-04.ts";
import y2Pos01 from "./ks1/Y2-POS-01.ts";
import y2Pos02 from "./ks1/Y2-POS-02.ts";
import y2Sta01 from "./ks1/Y2-STA-01.ts";
import y2Sta02 from "./ks1/Y2-STA-02.ts";
import y2Sta03 from "./ks1/Y2-STA-03.ts";
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
import y3Fr01 from "./ks2/Y3-FR-01.ts";
import y3Fr02 from "./ks2/Y3-FR-02.ts";
import y3Fr03 from "./ks2/Y3-FR-03.ts";
import y3Fr04 from "./ks2/Y3-FR-04.ts";
import y3Fr05 from "./ks2/Y3-FR-05.ts";
import y3Fr06 from "./ks2/Y3-FR-06.ts";
import y3Fr07 from "./ks2/Y3-FR-07.ts";
import y3Mea01 from "./ks2/Y3-MEA-01.ts";
import y3Mea02 from "./ks2/Y3-MEA-02.ts";
import y3Mea03 from "./ks2/Y3-MEA-03.ts";
import y3Mea04 from "./ks2/Y3-MEA-04.ts";
import y3Mea05 from "./ks2/Y3-MEA-05.ts";
import y3Mea06 from "./ks2/Y3-MEA-06.ts";
import y3Mea07 from "./ks2/Y3-MEA-07.ts";
import y3Geo01 from "./ks2/Y3-GEO-01.ts";
import y3Geo02 from "./ks2/Y3-GEO-02.ts";
import y3Geo03 from "./ks2/Y3-GEO-03.ts";
import y3Geo04 from "./ks2/Y3-GEO-04.ts";
import y3Sta01 from "./ks2/Y3-STA-01.ts";
import y3Sta02 from "./ks2/Y3-STA-02.ts";
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
import y4Fr01 from "./ks2/Y4-FR-01.ts";
import y4Fr02 from "./ks2/Y4-FR-02.ts";
import y4Fr03 from "./ks2/Y4-FR-03.ts";
import y4Fr04 from "./ks2/Y4-FR-04.ts";
import y4Fr05 from "./ks2/Y4-FR-05.ts";
import y4Fr06 from "./ks2/Y4-FR-06.ts";
import y4Fr07 from "./ks2/Y4-FR-07.ts";
import y4Fr08 from "./ks2/Y4-FR-08.ts";
import y4Fr09 from "./ks2/Y4-FR-09.ts";
import y4Fr10 from "./ks2/Y4-FR-10.ts";
import y4Mea01 from "./ks2/Y4-MEA-01.ts";
import y4Mea02 from "./ks2/Y4-MEA-02.ts";
import y4Mea03 from "./ks2/Y4-MEA-03.ts";
import y4Mea04 from "./ks2/Y4-MEA-04.ts";
import y4Mea05 from "./ks2/Y4-MEA-05.ts";
import y4Mea06 from "./ks2/Y4-MEA-06.ts";
import y4Geo01 from "./ks2/Y4-GEO-01.ts";
import y4Geo02 from "./ks2/Y4-GEO-02.ts";
import y4Geo03 from "./ks2/Y4-GEO-03.ts";
import y4Geo04 from "./ks2/Y4-GEO-04.ts";
import y4Pos01 from "./ks2/Y4-POS-01.ts";
import y4Pos02 from "./ks2/Y4-POS-02.ts";
import y4Pos03 from "./ks2/Y4-POS-03.ts";
import y4Sta01 from "./ks2/Y4-STA-01.ts";
import y4Sta02 from "./ks2/Y4-STA-02.ts";
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
import y5Fr01 from "./ks2/Y5-FR-01.ts";
import y5Fr02 from "./ks2/Y5-FR-02.ts";
import y5Fr03 from "./ks2/Y5-FR-03.ts";
import y5Fr04 from "./ks2/Y5-FR-04.ts";
import y5Fr05 from "./ks2/Y5-FR-05.ts";
import y5Fr06 from "./ks2/Y5-FR-06.ts";
import y5Fr07 from "./ks2/Y5-FR-07.ts";
import y5Fr08 from "./ks2/Y5-FR-08.ts";
import y5Fr09 from "./ks2/Y5-FR-09.ts";
import y5Fr10 from "./ks2/Y5-FR-10.ts";
import y5Fr11 from "./ks2/Y5-FR-11.ts";
import y5Fr12 from "./ks2/Y5-FR-12.ts";
import y5Mea01 from "./ks2/Y5-MEA-01.ts";
import y5Mea02 from "./ks2/Y5-MEA-02.ts";
import y5Mea03 from "./ks2/Y5-MEA-03.ts";
import y5Mea04 from "./ks2/Y5-MEA-04.ts";
import y5Mea05 from "./ks2/Y5-MEA-05.ts";
import y5Mea06 from "./ks2/Y5-MEA-06.ts";
import y5Mea07 from "./ks2/Y5-MEA-07.ts";
import y5Geo01 from "./ks2/Y5-GEO-01.ts";
import y5Geo02 from "./ks2/Y5-GEO-02.ts";
import y5Geo03 from "./ks2/Y5-GEO-03.ts";
import y5Geo04 from "./ks2/Y5-GEO-04.ts";
import y5Geo05 from "./ks2/Y5-GEO-05.ts";
import y5Geo06 from "./ks2/Y5-GEO-06.ts";
import y5Pos01 from "./ks2/Y5-POS-01.ts";
import y5Sta01 from "./ks2/Y5-STA-01.ts";
import y5Sta02 from "./ks2/Y5-STA-02.ts";
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
import y6Fr01 from "./ks2/Y6-FR-01.ts";
import y6Fr02 from "./ks2/Y6-FR-02.ts";
import y6Fr03 from "./ks2/Y6-FR-03.ts";
import y6Fr04 from "./ks2/Y6-FR-04.ts";
import y6Fr05 from "./ks2/Y6-FR-05.ts";
import y6Fr06 from "./ks2/Y6-FR-06.ts";
import y6Fr07 from "./ks2/Y6-FR-07.ts";
import y6Fr08 from "./ks2/Y6-FR-08.ts";
import y6Fr09 from "./ks2/Y6-FR-09.ts";
import y6Fr10 from "./ks2/Y6-FR-10.ts";
import y6Fr11 from "./ks2/Y6-FR-11.ts";
import y6Rat01 from "./ks2/Y6-RAT-01.ts";
import y6Rat02 from "./ks2/Y6-RAT-02.ts";
import y6Rat03 from "./ks2/Y6-RAT-03.ts";
import y6Rat04 from "./ks2/Y6-RAT-04.ts";
import y6Alg01 from "./ks2/Y6-ALG-01.ts";
import y6Alg02 from "./ks2/Y6-ALG-02.ts";
import y6Alg03 from "./ks2/Y6-ALG-03.ts";
import y6Alg04 from "./ks2/Y6-ALG-04.ts";
import y6Alg05 from "./ks2/Y6-ALG-05.ts";
import y6Mea01 from "./ks2/Y6-MEA-01.ts";
import y6Mea02 from "./ks2/Y6-MEA-02.ts";
import y6Mea03 from "./ks2/Y6-MEA-03.ts";
import y6Mea04 from "./ks2/Y6-MEA-04.ts";
import y6Mea05 from "./ks2/Y6-MEA-05.ts";
import y6Mea06 from "./ks2/Y6-MEA-06.ts";
import y6Mea07 from "./ks2/Y6-MEA-07.ts";
import y6Geo01 from "./ks2/Y6-GEO-01.ts";
import y6Geo02 from "./ks2/Y6-GEO-02.ts";
import y6Geo03 from "./ks2/Y6-GEO-03.ts";
import y6Geo04 from "./ks2/Y6-GEO-04.ts";
import y6Geo05 from "./ks2/Y6-GEO-05.ts";
import y6Pos01 from "./ks2/Y6-POS-01.ts";
import y6Pos02 from "./ks2/Y6-POS-02.ts";
import y6Sta01 from "./ks2/Y6-STA-01.ts";
import y6Sta02 from "./ks2/Y6-STA-02.ts";
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
import y7Fr01 from "./ks3/Y7-FR-01.ts";
import y7Alg01 from "./ks3/Y7-ALG-01.ts";
import y7Alg02 from "./ks3/Y7-ALG-02.ts";
import y7Alg03 from "./ks3/Y7-ALG-03.ts";
import y7Alg04 from "./ks3/Y7-ALG-04.ts";
import y7Alg05 from "./ks3/Y7-ALG-05.ts";
import y7Alg06 from "./ks3/Y7-ALG-06.ts";
import y7Rat01 from "./ks3/Y7-RAT-01.ts";
import y7Rat02 from "./ks3/Y7-RAT-02.ts";
import y7Rat03 from "./ks3/Y7-RAT-03.ts";
import y7Rat04 from "./ks3/Y7-RAT-04.ts";
import y7Rat05 from "./ks3/Y7-RAT-05.ts";
import y7Geo01 from "./ks3/Y7-GEO-01.ts";
import y7Geo02 from "./ks3/Y7-GEO-02.ts";
import y7Geo03 from "./ks3/Y7-GEO-03.ts";
import y7Geo04 from "./ks3/Y7-GEO-04.ts";
import y7Geo05 from "./ks3/Y7-GEO-05.ts";
import y7Geo06 from "./ks3/Y7-GEO-06.ts";
import y7Sta01 from "./ks3/Y7-STA-01.ts";
import y7Pro01 from "./ks3/Y7-PRO-01.ts";
import y7Pro02 from "./ks3/Y7-PRO-02.ts";
import y8Npv01 from "./ks3/Y8-NPV-01.ts";
import y8Npv02 from "./ks3/Y8-NPV-02.ts";
import y8Alg01 from "./ks3/Y8-ALG-01.ts";
import y8Alg02 from "./ks3/Y8-ALG-02.ts";
import y8Alg03 from "./ks3/Y8-ALG-03.ts";
import y8Alg04 from "./ks3/Y8-ALG-04.ts";
import y8Alg05 from "./ks3/Y8-ALG-05.ts";
import y8Alg06 from "./ks3/Y8-ALG-06.ts";
import y8Alg07 from "./ks3/Y8-ALG-07.ts";
import y8Alg08 from "./ks3/Y8-ALG-08.ts";
import y8Alg09 from "./ks3/Y8-ALG-09.ts";
import y8Rat01 from "./ks3/Y8-RAT-01.ts";
import y8Rat02 from "./ks3/Y8-RAT-02.ts";
import y8Rat03 from "./ks3/Y8-RAT-03.ts";
import y8Rat04 from "./ks3/Y8-RAT-04.ts";
import y8Rat05 from "./ks3/Y8-RAT-05.ts";
import y8Geo01 from "./ks3/Y8-GEO-01.ts";
import y8Geo02 from "./ks3/Y8-GEO-02.ts";
import y8Geo03 from "./ks3/Y8-GEO-03.ts";
import y8Geo04 from "./ks3/Y8-GEO-04.ts";
import y8Geo05 from "./ks3/Y8-GEO-05.ts";
import y8Pos01 from "./ks3/Y8-POS-01.ts";
import y8Geo06 from "./ks3/Y8-GEO-06.ts";
import y8Sta01 from "./ks3/Y8-STA-01.ts";
import y8Sta02 from "./ks3/Y8-STA-02.ts";
import y8Pro01 from "./ks3/Y8-PRO-01.ts";
import y9Npv01 from "./ks3/Y9-NPV-01.ts";
import y9Alg01 from "./ks3/Y9-ALG-01.ts";
import y9Alg02 from "./ks3/Y9-ALG-02.ts";
import y9Alg03 from "./ks3/Y9-ALG-03.ts";
import y9Alg04 from "./ks3/Y9-ALG-04.ts";
import y9Alg05 from "./ks3/Y9-ALG-05.ts";
import y9Alg06 from "./ks3/Y9-ALG-06.ts";
import y9Alg07 from "./ks3/Y9-ALG-07.ts";
import y9Alg08 from "./ks3/Y9-ALG-08.ts";
import y9Alg09 from "./ks3/Y9-ALG-09.ts";
import y9Rat01 from "./ks3/Y9-RAT-01.ts";
import y9Rat02 from "./ks3/Y9-RAT-02.ts";
import y9Rat03 from "./ks3/Y9-RAT-03.ts";
import y9Geo01 from "./ks3/Y9-GEO-01.ts";
import y9Geo02 from "./ks3/Y9-GEO-02.ts";
import y9Geo03 from "./ks3/Y9-GEO-03.ts";
import y9Pos01 from "./ks3/Y9-POS-01.ts";
import y9Pro01 from "./ks3/Y9-PRO-01.ts";
import y9Pro02 from "./ks3/Y9-PRO-02.ts";
import gfN1 from "./ks4/GF-N1.ts";
import gfN2 from "./ks4/GF-N2.ts";
import gfN3 from "./ks4/GF-N3.ts";
import gfN4 from "./ks4/GF-N4.ts";
import gfN5 from "./ks4/GF-N5.ts";
import ghN5 from "./ks4/GH-N5.ts";
import gfN6 from "./ks4/GF-N6.ts";
import ghN6 from "./ks4/GH-N6.ts";
import gfN7 from "./ks4/GF-N7.ts";
import ghN7 from "./ks4/GH-N7.ts";
import gfN8 from "./ks4/GF-N8.ts";
import ghN8 from "./ks4/GH-N8.ts";
import gfN9 from "./ks4/GF-N9.ts";
import gfN10 from "./ks4/GF-N10.ts";
import ghN10 from "./ks4/GH-N10.ts";
import gfN11 from "./ks4/GF-N11.ts";
import gfN12 from "./ks4/GF-N12.ts";
import gfN13 from "./ks4/GF-N13.ts";
import gfN14 from "./ks4/GF-N14.ts";
import gfN15 from "./ks4/GF-N15.ts";
import gfN16 from "./ks4/GF-N16.ts";
import ghN16 from "./ks4/GH-N16.ts";
import gfA1 from "./ks4/GF-A1.ts";
import gfA2 from "./ks4/GF-A2.ts";
import gfA3 from "./ks4/GF-A3.ts";
import ghA3 from "./ks4/GH-A3.ts";
import gfA4 from "./ks4/GF-A4.ts";
import ghA4 from "./ks4/GH-A4.ts";
import gfA5 from "./ks4/GF-A5.ts";
import gfA6 from "./ks4/GF-A6.ts";
import ghA6 from "./ks4/GH-A6.ts";
import gfA7 from "./ks4/GF-A7.ts";
import ghA7 from "./ks4/GH-A7.ts";
import gfA8 from "./ks4/GF-A8.ts";
import gfA9 from "./ks4/GF-A9.ts";
import ghA9 from "./ks4/GH-A9.ts";
import gfA10 from "./ks4/GF-A10.ts";
import gfA11 from "./ks4/GF-A11.ts";
import ghA11 from "./ks4/GH-A11.ts";
import gfA12 from "./ks4/GF-A12.ts";
import ghA12 from "./ks4/GH-A12.ts";
import ghA13 from "./ks4/GH-A13.ts";
import gfA14 from "./ks4/GF-A14.ts";
import ghA14 from "./ks4/GH-A14.ts";
import ghA15 from "./ks4/GH-A15.ts";
import ghA16 from "./ks4/GH-A16.ts";
import gfA17 from "./ks4/GF-A17.ts";
import ghA17 from "./ks4/GH-A17.ts";
import gfA18 from "./ks4/GF-A18.ts";
import ghA18 from "./ks4/GH-A18.ts";
import gfA19 from "./ks4/GF-A19.ts";
import ghA19 from "./ks4/GH-A19.ts";
import ghA20 from "./ks4/GH-A20.ts";
import gfA21 from "./ks4/GF-A21.ts";
import gfA22 from "./ks4/GF-A22.ts";
import ghA22 from "./ks4/GH-A22.ts";
import gfA23 from "./ks4/GF-A23.ts";
import gfA24 from "./ks4/GF-A24.ts";
import ghA24 from "./ks4/GH-A24.ts";
import gfA25 from "./ks4/GF-A25.ts";
import ghA25 from "./ks4/GH-A25.ts";
import gfR1 from "./ks4/GF-R1.ts";
import ghR1 from "./ks4/GH-R1.ts";
import gfR2 from "./ks4/GF-R2.ts";
import gfR3 from "./ks4/GF-R3.ts";
import gfR4 from "./ks4/GF-R4.ts";
import gfR5 from "./ks4/GF-R5.ts";
import gfR6 from "./ks4/GF-R6.ts";
import gfR7 from "./ks4/GF-R7.ts";
import gfR8 from "./ks4/GF-R8.ts";
import gfR9 from "./ks4/GF-R9.ts";
import gfR10 from "./ks4/GF-R10.ts";
import gfR11 from "./ks4/GF-R11.ts";
import gfR12 from "./ks4/GF-R12.ts";
import gfR13 from "./ks4/GF-R13.ts";
import ghR13 from "./ks4/GH-R13.ts";
import gfR14 from "./ks4/GF-R14.ts";
import ghR14 from "./ks4/GH-R14.ts";
import ghR15 from "./ks4/GH-R15.ts";
import gfR16 from "./ks4/GF-R16.ts";
import ghR16 from "./ks4/GH-R16.ts";
import gfG1 from "./ks4/GF-G1.ts";
import gfG2 from "./ks4/GF-G2.ts";
import gfG3 from "./ks4/GF-G3.ts";
import gfG4 from "./ks4/GF-G4.ts";
import gfG5 from "./ks4/GF-G5.ts";
import gfG6 from "./ks4/GF-G6.ts";
import gfG7 from "./ks4/GF-G7.ts";
import ghG7 from "./ks4/GH-G7.ts";
import ghG8 from "./ks4/GH-G8.ts";
import gfG9 from "./ks4/GF-G9.ts";
import ghG10 from "./ks4/GH-G10.ts";
import gfG11 from "./ks4/GF-G11.ts";
import gfG12 from "./ks4/GF-G12.ts";
import gfG13 from "./ks4/GF-G13.ts";
import gfG14 from "./ks4/GF-G14.ts";
import gfG15 from "./ks4/GF-G15.ts";
import gfG16 from "./ks4/GF-G16.ts";
import gfG17 from "./ks4/GF-G17.ts";
import gfG18 from "./ks4/GF-G18.ts";
import gfG19 from "./ks4/GF-G19.ts";
import ghG19 from "./ks4/GH-G19.ts";
import gfG20 from "./ks4/GF-G20.ts";
import ghG20 from "./ks4/GH-G20.ts";
import gfG21 from "./ks4/GF-G21.ts";
import ghG22 from "./ks4/GH-G22.ts";
import ghG23 from "./ks4/GH-G23.ts";
import gfG24 from "./ks4/GF-G24.ts";
import gfG25 from "./ks4/GF-G25.ts";
import ghG25 from "./ks4/GH-G25.ts";
import gfP1 from "./ks4/GF-P1.ts";
import gfP2 from "./ks4/GF-P2.ts";
import gfP3 from "./ks4/GF-P3.ts";
import gfP4 from "./ks4/GF-P4.ts";
import gfP5 from "./ks4/GF-P5.ts";
import gfP6 from "./ks4/GF-P6.ts";
import gfP7 from "./ks4/GF-P7.ts";
import gfP8 from "./ks4/GF-P8.ts";
import ghP9 from "./ks4/GH-P9.ts";
import gfS1 from "./ks4/GF-S1.ts";
import gfS2 from "./ks4/GF-S2.ts";
import gfS3 from "./ks4/GF-S3.ts";
import ghS3 from "./ks4/GH-S3.ts";
import gfS4 from "./ks4/GF-S4.ts";
import ghS4 from "./ks4/GH-S4.ts";
import gfS5 from "./ks4/GF-S5.ts";
import gfS6 from "./ks4/GF-S6.ts";
import alP11a from "./ks5/AL-P1.1a.ts";
import alP11b from "./ks5/AL-P1.1b.ts";
import alP21 from "./ks5/AL-P2.1.ts";
import alP22 from "./ks5/AL-P2.2.ts";
import alP23 from "./ks5/AL-P2.3.ts";
import alP24 from "./ks5/AL-P2.4.ts";
import alP25 from "./ks5/AL-P2.5.ts";
import alP26a from "./ks5/AL-P2.6a.ts";
import alP26b from "./ks5/AL-P2.6b.ts";
import alP27a from "./ks5/AL-P2.7a.ts";
import alP27b from "./ks5/AL-P2.7b.ts";
import alP28 from "./ks5/AL-P2.8.ts";
import alP29a from "./ks5/AL-P2.9a.ts";
import alP29b from "./ks5/AL-P2.9b.ts";
import alP210 from "./ks5/AL-P2.10.ts";
import alP211 from "./ks5/AL-P2.11.ts";
import alP31 from "./ks5/AL-P3.1.ts";
import alP32 from "./ks5/AL-P3.2.ts";
import alP33 from "./ks5/AL-P3.3.ts";
import alP34 from "./ks5/AL-P3.4.ts";
import alP41a from "./ks5/AL-P4.1a.ts";
import alP41b from "./ks5/AL-P4.1b.ts";
import alP42 from "./ks5/AL-P4.2.ts";
import alP43 from "./ks5/AL-P4.3.ts";
import alP44 from "./ks5/AL-P4.4.ts";
import alP45 from "./ks5/AL-P4.5.ts";
import alP46 from "./ks5/AL-P4.6.ts";
import alP51a from "./ks5/AL-P5.1a.ts";
import alP51b from "./ks5/AL-P5.1b.ts";
import alP52 from "./ks5/AL-P5.2.ts";
import alP53 from "./ks5/AL-P5.3.ts";
import alP54 from "./ks5/AL-P5.4.ts";
import alP55a from "./ks5/AL-P5.5a.ts";
import alP55b from "./ks5/AL-P5.5b.ts";
import alP56 from "./ks5/AL-P5.6.ts";
import alP57 from "./ks5/AL-P5.7.ts";
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
import alP74 from "./ks5/AL-P7.4.ts";
import alP75 from "./ks5/AL-P7.5.ts";
import alP76 from "./ks5/AL-P7.6.ts";
import alP81 from "./ks5/AL-P8.1.ts";
import alP82 from "./ks5/AL-P8.2.ts";
import alP83 from "./ks5/AL-P8.3.ts";
import alP84 from "./ks5/AL-P8.4.ts";
import alP85 from "./ks5/AL-P8.5.ts";
import alP86 from "./ks5/AL-P8.6.ts";
import alP87 from "./ks5/AL-P8.7.ts";
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
import alS21 from "./ks5/AL-S2.1.ts";
import alS22a from "./ks5/AL-S2.2a.ts";
import alS22b from "./ks5/AL-S2.2b.ts";
import alS23 from "./ks5/AL-S2.3.ts";
import alS24 from "./ks5/AL-S2.4.ts";
import alS31 from "./ks5/AL-S3.1.ts";
import alS32 from "./ks5/AL-S3.2.ts";
import alS33 from "./ks5/AL-S3.3.ts";
import alS41 from "./ks5/AL-S4.1.ts";
import alS42 from "./ks5/AL-S4.2.ts";
import alS43 from "./ks5/AL-S4.3.ts";
import alS51a from "./ks5/AL-S5.1a.ts";
import alS51b from "./ks5/AL-S5.1b.ts";
import alS52 from "./ks5/AL-S5.2.ts";
import alS53 from "./ks5/AL-S5.3.ts";
import alM61 from "./ks5/AL-M6.1.ts";
import alM71 from "./ks5/AL-M7.1.ts";
import alM72 from "./ks5/AL-M7.2.ts";
import alM73a from "./ks5/AL-M7.3a.ts";
import alM73b from "./ks5/AL-M7.3b.ts";
import alM74a from "./ks5/AL-M7.4a.ts";
import alM74b from "./ks5/AL-M7.4b.ts";
import alM75 from "./ks5/AL-M7.5.ts";
import alM81 from "./ks5/AL-M8.1.ts";
import alM82 from "./ks5/AL-M8.2.ts";
import alM83 from "./ks5/AL-M8.3.ts";
import alM84 from "./ks5/AL-M8.4.ts";
import alM85 from "./ks5/AL-M8.5.ts";
import alM86 from "./ks5/AL-M8.6.ts";
import alM91 from "./ks5/AL-M9.1.ts";
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
  rNpv09,
  rNpv10,
  rPat01,
  rGeo01,
  rGeo02,
  rPat02,
  rMea01,
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
  y1Fr01,
  y1Fr02,
  y1Mea01,
  y1Mea02,
  y1Mea03,
  y1Mea04,
  y1Mea05,
  y1Mea06,
  y1Geo01,
  y1Geo02,
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
  y2Fr01,
  y2Fr02,
  y2Mea01,
  y2Mea02,
  y2Mea03,
  y2Mea04,
  y2Mea05,
  y2Mea06,
  y2Mea07,
  y2Geo01,
  y2Geo02,
  y2Geo03,
  y2Geo04,
  y2Pos01,
  y2Pos02,
  y2Sta01,
  y2Sta02,
  y2Sta03,
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
  y3Fr01,
  y3Fr02,
  y3Fr03,
  y3Fr04,
  y3Fr05,
  y3Fr06,
  y3Fr07,
  y3Mea01,
  y3Mea02,
  y3Mea03,
  y3Mea04,
  y3Mea05,
  y3Mea06,
  y3Mea07,
  y3Geo01,
  y3Geo02,
  y3Geo03,
  y3Geo04,
  y3Sta01,
  y3Sta02,
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
  y4Fr01,
  y4Fr02,
  y4Fr03,
  y4Fr04,
  y4Fr05,
  y4Fr06,
  y4Fr07,
  y4Fr08,
  y4Fr09,
  y4Fr10,
  y4Mea01,
  y4Mea02,
  y4Mea03,
  y4Mea04,
  y4Mea05,
  y4Mea06,
  y4Geo01,
  y4Geo02,
  y4Geo03,
  y4Geo04,
  y4Pos01,
  y4Pos02,
  y4Pos03,
  y4Sta01,
  y4Sta02,
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
  y5Fr01,
  y5Fr02,
  y5Fr03,
  y5Fr04,
  y5Fr05,
  y5Fr06,
  y5Fr07,
  y5Fr08,
  y5Fr09,
  y5Fr10,
  y5Fr11,
  y5Fr12,
  y5Mea01,
  y5Mea02,
  y5Mea03,
  y5Mea04,
  y5Mea05,
  y5Mea06,
  y5Mea07,
  y5Geo01,
  y5Geo02,
  y5Geo03,
  y5Geo04,
  y5Geo05,
  y5Geo06,
  y5Pos01,
  y5Sta01,
  y5Sta02,
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
  y6Fr01,
  y6Fr02,
  y6Fr03,
  y6Fr04,
  y6Fr05,
  y6Fr06,
  y6Fr07,
  y6Fr08,
  y6Fr09,
  y6Fr10,
  y6Fr11,
  y6Rat01,
  y6Rat02,
  y6Rat03,
  y6Rat04,
  y6Alg01,
  y6Alg02,
  y6Alg03,
  y6Alg04,
  y6Alg05,
  y6Mea01,
  y6Mea02,
  y6Mea03,
  y6Mea04,
  y6Mea05,
  y6Mea06,
  y6Mea07,
  y6Geo01,
  y6Geo02,
  y6Geo03,
  y6Geo04,
  y6Geo05,
  y6Pos01,
  y6Pos02,
  y6Sta01,
  y6Sta02,
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
  y7Fr01,
  y7Alg01,
  y7Alg02,
  y7Alg03,
  y7Alg04,
  y7Alg05,
  y7Alg06,
  y7Rat01,
  y7Rat02,
  y7Rat03,
  y7Rat04,
  y7Rat05,
  y7Geo01,
  y7Geo02,
  y7Geo03,
  y7Geo04,
  y7Geo05,
  y7Geo06,
  y7Sta01,
  y7Pro01,
  y7Pro02,
  y8Npv01,
  y8Npv02,
  y8Alg01,
  y8Alg02,
  y8Alg03,
  y8Alg04,
  y8Alg05,
  y8Alg06,
  y8Alg07,
  y8Alg08,
  y8Alg09,
  y8Rat01,
  y8Rat02,
  y8Rat03,
  y8Rat04,
  y8Rat05,
  y8Geo01,
  y8Geo02,
  y8Geo03,
  y8Geo04,
  y8Geo05,
  y8Pos01,
  y8Geo06,
  y8Sta01,
  y8Sta02,
  y8Pro01,
  y9Npv01,
  y9Alg01,
  y9Alg02,
  y9Alg03,
  y9Alg04,
  y9Alg05,
  y9Alg06,
  y9Alg07,
  y9Alg08,
  y9Alg09,
  y9Rat01,
  y9Rat02,
  y9Rat03,
  y9Geo01,
  y9Geo02,
  y9Geo03,
  y9Pos01,
  y9Pro01,
  y9Pro02,
  gfN1,
  gfN2,
  gfN3,
  gfN4,
  gfN5,
  ghN5,
  gfN6,
  ghN6,
  gfN7,
  ghN7,
  gfN8,
  ghN8,
  gfN9,
  gfN10,
  ghN10,
  gfN11,
  gfN12,
  gfN13,
  gfN14,
  gfN15,
  gfN16,
  ghN16,
  gfA1,
  gfA2,
  gfA3,
  ghA3,
  gfA4,
  ghA4,
  gfA5,
  gfA6,
  ghA6,
  gfA7,
  ghA7,
  gfA8,
  gfA9,
  ghA9,
  gfA10,
  gfA11,
  ghA11,
  gfA12,
  ghA12,
  ghA13,
  gfA14,
  ghA14,
  ghA15,
  ghA16,
  gfA17,
  ghA17,
  gfA18,
  ghA18,
  gfA19,
  ghA19,
  ghA20,
  gfA21,
  gfA22,
  ghA22,
  gfA23,
  gfA24,
  ghA24,
  gfA25,
  ghA25,
  gfR1,
  ghR1,
  gfR2,
  gfR3,
  gfR4,
  gfR5,
  gfR6,
  gfR7,
  gfR8,
  gfR9,
  gfR10,
  gfR11,
  gfR12,
  gfR13,
  ghR13,
  gfR14,
  ghR14,
  ghR15,
  gfR16,
  ghR16,
  gfG1,
  gfG2,
  gfG3,
  gfG4,
  gfG5,
  gfG6,
  gfG7,
  ghG7,
  ghG8,
  gfG9,
  ghG10,
  gfG11,
  gfG12,
  gfG13,
  gfG14,
  gfG15,
  gfG16,
  gfG17,
  gfG18,
  gfG19,
  ghG19,
  gfG20,
  ghG20,
  gfG21,
  ghG22,
  ghG23,
  gfG24,
  gfG25,
  ghG25,
  gfP1,
  gfP2,
  gfP3,
  gfP4,
  gfP5,
  gfP6,
  gfP7,
  gfP8,
  ghP9,
  gfS1,
  gfS2,
  gfS3,
  ghS3,
  gfS4,
  ghS4,
  gfS5,
  gfS6,
  alP11a,
  alP11b,
  alP21,
  alP22,
  alP23,
  alP24,
  alP25,
  alP26a,
  alP26b,
  alP27a,
  alP27b,
  alP28,
  alP29a,
  alP29b,
  alP210,
  alP211,
  alP31,
  alP32,
  alP33,
  alP34,
  alP41a,
  alP41b,
  alP42,
  alP43,
  alP44,
  alP45,
  alP46,
  alP51a,
  alP51b,
  alP52,
  alP53,
  alP54,
  alP55a,
  alP55b,
  alP56,
  alP57,
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
  alP74,
  alP75,
  alP76,
  alP81,
  alP82,
  alP83,
  alP84,
  alP85,
  alP86,
  alP87,
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
  alS21,
  alS22a,
  alS22b,
  alS23,
  alS24,
  alS31,
  alS32,
  alS33,
  alS41,
  alS42,
  alS43,
  alS51a,
  alS51b,
  alS52,
  alS53,
  alM61,
  alM71,
  alM72,
  alM73a,
  alM73b,
  alM74a,
  alM74b,
  alM75,
  alM81,
  alM82,
  alM83,
  alM84,
  alM85,
  alM86,
  alM91,
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
] as Generator[];

/** Unreviewed placeholders that exercise the gallery; real generators replace them. */
export const examples: Generator[] = [];

export { selectQuestions, type SelectedItem, type Selection } from "./select.ts";
