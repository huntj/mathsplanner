// Runs the importer and checker against the real progression map and data files.
import { describe, expect, it } from "vitest";
import { checkData } from "../src/check.ts";
import { loadCheckInput, PATHS, readText } from "../src/files.ts";
import { importMap } from "../src/import.ts";
import { readSummary } from "../src/summary.ts";

const map = readText(PATHS.map);

describe("docs/progression-map.md", () => {
  const result = importMap(map);

  it("imports all 686 statements without errors", () => {
    expect(result.errors).toEqual([]);
    expect(result.statements).toHaveLength(686);
  });

  it("has the summary counts agreed for Phase 0", () => {
    const { counts, errors } = readSummary(map);
    expect(errors).toEqual([]);
    expect(Object.fromEntries(counts.map((c) => [c.group.label, c.expected]))).toEqual({
      EYFS: 35,
      KS1: 54,
      KS2: 170,
      KS3: 76,
      KS4: 127,
      "KS5: A level Maths": 106,
      "KS5: Further Maths": 80,
      "Further Maths core pure": 31,
      "Further Maths options": 49,
      "KS5: Core Maths": 38,
    });
  });
});

describe("data/", () => {
  it("passes data:check", () => {
    const { input, summaryErrors } = loadCheckInput();
    const result = checkData(input);
    expect(summaryErrors).toEqual([]);
    expect(result.errors).toEqual([]);
    expect(result.total).toEqual({ expected: 686, actual: 686 });
  });
});
