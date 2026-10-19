// The statement ID scheme: Stage-Strand-Number, as set out in docs/progression-map.md.
import type { FurtherMathsOption, Stage } from "./statement.ts";

export interface ParsedId {
  stage: Stage;
  strand: string;
  tier?: "F" | "H";
  option?: FurtherMathsOption;
}

/** Strands used by EYFS to KS3 IDs (the strand table at the top of the map). */
export const PRIMARY_STRANDS = [
  "NPV",
  "AS",
  "MD",
  "FR",
  "RAT",
  "ALG",
  "MEA",
  "GEO",
  "POS",
  "STA",
  "PRO",
  "PAT",
] as const;

const PATTERNS: [RegExp, (m: RegExpExecArray) => ParsedId | undefined][] = [
  // N-NPV-01, R-AS-01, Y6-FR-03
  [
    /^(N|R|Y[1-9])-([A-Z]+)-(\d{2})$/,
    (m) =>
      (PRIMARY_STRANDS as readonly string[]).includes(m[2] ?? "")
        ? { stage: m[1] as Stage, strand: m[2] as string }
        : undefined,
  ],
  // GF-N1, GH-A18: Pearson / DfE content references
  [
    /^(GF|GH)-([NARGPS])(\d{1,2})$/,
    (m) => ({
      stage: m[1] as Stage,
      strand: m[2] as string,
      tier: m[1] === "GF" ? "F" : "H",
    }),
  ],
  // AL-P7.4, AL-P1.1a, AL-S2.2b, AL-M7.3a: 9MA0 topic numbering
  [/^AL-([PSM]\d{1,2})\.\d{1,2}[a-z]?$/, (m) => ({ stage: "AL", strand: m[1] as string })],
  // FM-CP-01 (core pure), FM-FS1-02 (option paper)
  [
    /^FM-(CP|FP1|FP2|FS1|FS2|FM1|FM2|D1|D2)-(\d{2})$/,
    (m) =>
      m[1] === "CP"
        ? { stage: "FM", strand: "CP" }
        : { stage: "FM", strand: m[1] as string, option: m[1] as FurtherMathsOption },
  ],
  // CM-A1, CM-LP10, CM-SG3
  [/^CM-(A|P|LP|SG)\d{1,2}$/, (m) => ({ stage: "CM", strand: m[1] as string })],
];

/** Derives stage, strand, tier and option from a statement ID, or undefined if it is malformed. */
export function parseId(id: string): ParsedId | undefined {
  for (const [pattern, build] of PATTERNS) {
    const m = pattern.exec(id);
    if (m) return build(m);
  }
  return undefined;
}

/** The source each stage's statements are paraphrased from. */
export const STAGE_SOURCE: Record<Stage, string> = {
  N: "Development Matters",
  R: "EYFS framework",
  Y1: "NC KS1",
  Y2: "NC KS1",
  Y3: "NC KS2",
  Y4: "NC KS2",
  Y5: "NC KS2",
  Y6: "NC KS2",
  Y7: "NC KS3",
  Y8: "NC KS3",
  Y9: "NC KS3",
  GF: "Edexcel 1MA1",
  GH: "Edexcel 1MA1",
  AL: "Edexcel 9MA0",
  FM: "Edexcel 9FM0",
  CM: "Edexcel 7MC0",
};

/** Teaching order used to spot prerequisites that point forwards. KS4 tiers share a rank. */
export const STAGE_RANK: Record<Stage, number> = {
  N: 0,
  R: 1,
  Y1: 2,
  Y2: 3,
  Y3: 4,
  Y4: 5,
  Y5: 6,
  Y6: 7,
  Y7: 8,
  Y8: 9,
  Y9: 10,
  GF: 11,
  GH: 11,
  AL: 12,
  CM: 12,
  FM: 13,
};

/** Generator folders under packages/generators/src, as in the design doc. */
export function keyStageFolder(stage: Stage): "eyfs" | "ks1" | "ks2" | "ks3" | "ks4" | "ks5" {
  switch (stage) {
    case "N":
    case "R":
      return "eyfs";
    case "Y1":
    case "Y2":
      return "ks1";
    case "Y3":
    case "Y4":
    case "Y5":
    case "Y6":
      return "ks2";
    case "Y7":
    case "Y8":
    case "Y9":
      return "ks3";
    case "GF":
    case "GH":
      return "ks4";
    case "AL":
    case "FM":
    case "CM":
      return "ks5";
  }
}
