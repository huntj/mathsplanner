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
import gfN6 from "./ks4/GF-N6.ts";
import gfN7 from "./ks4/GF-N7.ts";
import gfN8 from "./ks4/GF-N8.ts";
import gfN9 from "./ks4/GF-N9.ts";
import gfN10 from "./ks4/GF-N10.ts";
import gfN11 from "./ks4/GF-N11.ts";
import gfN12 from "./ks4/GF-N12.ts";
import gfN13 from "./ks4/GF-N13.ts";
import gfN14 from "./ks4/GF-N14.ts";
import gfN15 from "./ks4/GF-N15.ts";
import gfN16 from "./ks4/GF-N16.ts";
import gfA1 from "./ks4/GF-A1.ts";
import gfA2 from "./ks4/GF-A2.ts";
import gfA3 from "./ks4/GF-A3.ts";
import gfA4 from "./ks4/GF-A4.ts";
import gfA5 from "./ks4/GF-A5.ts";
import gfA6 from "./ks4/GF-A6.ts";
import gfA7 from "./ks4/GF-A7.ts";
import gfA8 from "./ks4/GF-A8.ts";
import gfA9 from "./ks4/GF-A9.ts";
import gfA10 from "./ks4/GF-A10.ts";
import gfA11 from "./ks4/GF-A11.ts";
import gfA12 from "./ks4/GF-A12.ts";
import gfA14 from "./ks4/GF-A14.ts";
import gfA17 from "./ks4/GF-A17.ts";
import gfA18 from "./ks4/GF-A18.ts";
import gfA19 from "./ks4/GF-A19.ts";
import gfA21 from "./ks4/GF-A21.ts";
import gfA22 from "./ks4/GF-A22.ts";
import gfA23 from "./ks4/GF-A23.ts";
import gfA24 from "./ks4/GF-A24.ts";
import gfA25 from "./ks4/GF-A25.ts";
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
  gfN6,
  gfN7,
  gfN8,
  gfN9,
  gfN10,
  gfN11,
  gfN12,
  gfN13,
  gfN14,
  gfN15,
  gfN16,
  gfA1,
  gfA2,
  gfA3,
  gfA4,
  gfA5,
  gfA6,
  gfA7,
  gfA8,
  gfA9,
  gfA10,
  gfA11,
  gfA12,
  gfA14,
  gfA17,
  gfA18,
  gfA19,
  gfA21,
  gfA22,
  gfA23,
  gfA24,
  gfA25,
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
