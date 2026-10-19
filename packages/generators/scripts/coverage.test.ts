import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import type { Statement } from "@mathsplanner/core";
import { afterEach, describe, expect, it } from "vitest";
import { coverageReport, findGenerators, loadStatements } from "./coverage.ts";

const statement = (id: string, stage: Statement["stage"]): Statement => ({
  id,
  stage,
  strand: "FR",
  text: id,
  needs: [],
  source: "NC KS2",
  statutory: true,
});

const STATEMENTS = [
  statement("Y6-FR-03", "Y6"),
  statement("Y6-FR-04", "Y6"),
  statement("Y1-FR-01", "Y1"),
];

let dir: string | undefined;
afterEach(() => {
  if (dir) rmSync(dir, { recursive: true, force: true });
  dir = undefined;
});

function generators(files: Record<string, string>) {
  dir = mkdtempSync(join(tmpdir(), "mathsplanner-coverage-"));
  for (const [path, source] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, path)), { recursive: true });
    writeFileSync(join(dir, path), source);
  }
  return findGenerators(dir);
}

describe("coverage", () => {
  it("lists every statement as missing when there are no generators", () => {
    const report = coverageReport(STATEMENTS, generators({ "index.ts": "export {};" }));
    expect(report.covered).toEqual([]);
    expect(report.missing.map((s) => s.id)).toEqual(["Y6-FR-03", "Y6-FR-04", "Y1-FR-01"]);
    expect(report.errors).toEqual([]);
  });

  it("counts a generator file as covering its statement", () => {
    const report = coverageReport(
      STATEMENTS,
      generators({
        "ks2/Y6-FR-03.ts": 'export default defineGenerator({ id: "Y6-FR-03" });',
        "ks2/Y6-FR-03.test.ts": 'it("ignores tests", () => ({ id: "NOT-AN-ID" }));',
      }),
    );
    expect(report.covered).toEqual(["Y6-FR-03"]);
    expect(report.missing.map((s) => s.id)).toEqual(["Y6-FR-04", "Y1-FR-01"]);
    expect(report).toMatchObject({ errors: [], warnings: [] });
  });

  it("fails on unknown statement IDs in file names or declarations", () => {
    const report = coverageReport(
      STATEMENTS,
      generators({
        "ks2/Y6-FR-99.ts": 'defineGenerator({ id: "Y6-FR-99" });',
        "ks2/Y6-FR-04.ts": "defineGenerator({ id: 'Y6-FR-04', remediate: { id: \"Y5-FR-77\" } });",
      }),
    );
    expect(report.errors).toEqual([
      "ks2/Y6-FR-04.ts: unknown statement ID Y5-FR-77",
      "ks2/Y6-FR-99.ts: unknown statement ID Y6-FR-99",
    ]);
    expect(report.covered).toEqual(["Y6-FR-04"]);
  });

  it("warns about misplaced, mismatched and duplicate generators", () => {
    const report = coverageReport(
      STATEMENTS,
      generators({
        "ks1/Y6-FR-03.ts": 'defineGenerator({ id: "Y6-FR-03" });',
        "ks2/nested/Y6-FR-03.ts": 'defineGenerator({ id: "Y6-FR-03" });',
        "ks1/Y1-FR-01.ts": 'defineGenerator({ id: "Y6-FR-04" });',
      }),
    );
    expect(report.errors).toEqual([]);
    expect(report.warnings).toEqual([
      'ks1/Y1-FR-01.ts: file is named Y1-FR-01 but does not declare id: "Y1-FR-01"',
      "ks1/Y6-FR-03.ts: Y6-FR-03 belongs in src/ks2/",
      "ks2/nested/Y6-FR-03.ts: Y6-FR-03 already has a generator in ks1/Y6-FR-03.ts",
    ]);
  });

  it("reports all 686 real statements as missing in Phase 0", () => {
    const report = coverageReport(loadStatements(), findGenerators());
    expect(report.errors).toEqual([]);
    expect(report.missing).toHaveLength(686);
  });
});
