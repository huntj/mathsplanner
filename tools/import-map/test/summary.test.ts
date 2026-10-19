import { describe, expect, it } from "vitest";
import { readSummary } from "../src/summary.ts";

const summary = (rows: string[]) =>
  ["| Stage | Statements in this map | Statutory basis |", "| --- | --- | --- |", ...rows].join(
    "\n",
  );

const ALL_ROWS = [
  "| EYFS | 35 | EYFS framework |",
  "| KS1 | 54 | NC |",
  "| KS2 | 170 | NC |",
  "| KS3 | 76 | NC |",
  "| KS4 | 127 | 1MA1 |",
  "| KS5: A level Maths | 106 | 9MA0 |",
  "| KS5: Further Maths | 80 | Edexcel 9FM0 (31 core pure, 49 across the eight options) |",
  "| KS5: Core Maths | 38 | 7MC0 |",
];

describe("readSummary", () => {
  it("reads each stage group and the Further Maths split", () => {
    const { counts, errors } = readSummary(summary(ALL_ROWS));
    expect(errors).toEqual([]);
    expect(counts.map((c) => [c.group.label, c.expected])).toEqual([
      ["EYFS", 35],
      ["KS1", 54],
      ["KS2", 170],
      ["KS3", 76],
      ["KS4", 127],
      ["KS5: A level Maths", 106],
      ["KS5: Further Maths", 80],
      ["Further Maths core pure", 31],
      ["Further Maths options", 49],
      ["KS5: Core Maths", 38],
    ]);
  });

  it("reports unknown rows, bad counts and missing groups", () => {
    const { errors } = readSummary(summary(["| EYFS | lots | x |", "| KS6 | 3 | x |"]));
    expect(errors).toContain('summary table count "lots" for EYFS is not a number');
    expect(errors).toContainEqual(expect.stringContaining('"KS6"'));
    expect(errors).toContain("summary table has no row for KS1");
  });

  it("reports a map with no summary table", () => {
    expect(readSummary("# Nothing here").errors).toEqual([
      "the map has no summary table of statement counts",
    ]);
  });
});
