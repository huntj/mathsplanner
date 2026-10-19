// Statement data types. data/statements.json is the single source of truth for these;
// data/schema/statements.schema.json describes the same shape for editors and data:check.

/** Stage code, the first part of every statement ID. */
export type Stage =
  | "N"
  | "R"
  | "Y1"
  | "Y2"
  | "Y3"
  | "Y4"
  | "Y5"
  | "Y6"
  | "Y7"
  | "Y8"
  | "Y9"
  | "GF"
  | "GH"
  | "AL"
  | "FM"
  | "CM";

export const STAGES: readonly Stage[] = [
  "N",
  "R",
  "Y1",
  "Y2",
  "Y3",
  "Y4",
  "Y5",
  "Y6",
  "Y7",
  "Y8",
  "Y9",
  "GF",
  "GH",
  "AL",
  "FM",
  "CM",
];

/** Edexcel 9FM0 option papers. */
export type FurtherMathsOption = "FP1" | "FP2" | "FS1" | "FS2" | "FM1" | "FM2" | "D1" | "D2";

export const FURTHER_MATHS_OPTIONS: readonly FurtherMathsOption[] = [
  "FP1",
  "FP2",
  "FS1",
  "FS2",
  "FM1",
  "FM2",
  "D1",
  "D2",
];

export type KS5Year = 12 | 13;

export interface Statement {
  /** "Y6-FR-03", "GH-A18", "AL-P7.4", "FM-FS1-02" */
  id: string;
  stage: Stage;
  /** "FR", "ALG", "N", "P7", "CP", "FS1" … derived from the ID. */
  strand: string;
  /** The "I can…" wording. */
  text: string;
  /** Nearest direct prerequisite IDs. */
  needs: string[];
  /** KS5 recommended year(s); some statements span both. */
  years?: KS5Year[];
  /** GCSE tier: "F" is tested on both tiers, "H" is Higher only. */
  tier?: "F" | "H";
  /** Further Maths option paper. */
  option?: FurtherMathsOption;
  /** "NC KS2", "Edexcel 1MA1", "Edexcel 9MA0" … */
  source: string;
  /** True only for national curriculum content and the Reception ELGs. */
  statutory: boolean;
}

/** The shape of data/statements.json. */
export interface StatementsFile {
  $schema?: string;
  version: string;
  statements: Statement[];
}

export interface MisconceptionEntry {
  /** "FR.ADD.TOPS-AND-BOTTOMS" */
  code: string;
  /** What the student does or believes. */
  description: string;
  /** Statement ID to step back to. */
  remediate?: string;
}

/** The shape of data/misconceptions.json. */
export interface MisconceptionsFile {
  $schema?: string;
  version: string;
  misconceptions: MisconceptionEntry[];
}
