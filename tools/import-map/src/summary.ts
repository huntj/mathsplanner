import type { Stage } from "@mathsplanner/core";
import { parseTables } from "./markdown.ts";

export interface CountGroup {
  label: string;
  stages: Stage[];
  /** Restricts the group to some strands of its stages (used for the Further Maths split). */
  strands?: { only?: string[]; except?: string[] };
}

/** Rows of the map's "Statements in this map" table, and the stages each one covers. */
export const SUMMARY_GROUPS: CountGroup[] = [
  { label: "EYFS", stages: ["N", "R"] },
  { label: "KS1", stages: ["Y1", "Y2"] },
  { label: "KS2", stages: ["Y3", "Y4", "Y5", "Y6"] },
  { label: "KS3", stages: ["Y7", "Y8", "Y9"] },
  { label: "KS4", stages: ["GF", "GH"] },
  { label: "KS5: A level Maths", stages: ["AL"] },
  { label: "KS5: Further Maths", stages: ["FM"] },
  { label: "KS5: Core Maths", stages: ["CM"] },
];

const FM_CORE: CountGroup = {
  label: "Further Maths core pure",
  stages: ["FM"],
  strands: { only: ["CP"] },
};
const FM_OPTIONS: CountGroup = {
  label: "Further Maths options",
  stages: ["FM"],
  strands: { except: ["CP"] },
};

export interface ExpectedCount {
  group: CountGroup;
  expected: number;
}

export interface SummaryResult {
  counts: ExpectedCount[];
  errors: string[];
}

/**
 * Reads the expected statement counts from the map's summary table, including the
 * "(31 core pure, 49 across the eight options)" split for Further Maths.
 */
export function readSummary(markdown: string): SummaryResult {
  const errors: string[] = [];
  const table = parseTables(markdown).find(
    (t) => t.header[0] === "Stage" && t.header[1] === "Statements in this map",
  );
  if (!table) return { counts: [], errors: ["the map has no summary table of statement counts"] };

  const counts: ExpectedCount[] = [];
  for (const row of table.rows) {
    const [label = "", count = "", basis = ""] = row.cells;
    const group = SUMMARY_GROUPS.find((g) => g.label === label);
    if (!group) {
      errors.push(`summary table row "${label}" (line ${row.line}) is not a known stage group`);
      continue;
    }
    if (!/^\d+$/.test(count)) {
      errors.push(`summary table count "${count}" for ${label} is not a number`);
      continue;
    }
    counts.push({ group, expected: Number(count) });

    const split = /\((\d+) core pure, (\d+) across/.exec(basis);
    if (group.label === "KS5: Further Maths" && split) {
      counts.push({ group: FM_CORE, expected: Number(split[1]) });
      counts.push({ group: FM_OPTIONS, expected: Number(split[2]) });
    }
  }
  for (const group of SUMMARY_GROUPS) {
    if (!counts.some((c) => c.group === group)) {
      errors.push(`summary table has no row for ${group.label}`);
    }
  }
  return { counts, errors };
}
