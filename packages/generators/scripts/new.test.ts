import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { Statement } from "@mathsplanner/core";
import { afterEach, describe, expect, it } from "vitest";
import { findGenerators } from "./coverage.ts";
import { scaffold } from "./new.ts";

const statements: Statement[] = [
  {
    id: "AL-P7.4",
    stage: "AL",
    strand: "P7",
    text: "Use the product, quotient and chain rules",
    needs: [],
    years: [13],
    source: "Edexcel 9MA0",
    statutory: false,
  },
];

let dir: string | undefined;
afterEach(() => {
  if (dir) rmSync(dir, { recursive: true, force: true });
  dir = undefined;
});

describe("pnpm new", () => {
  it("writes a generator and a test in the key stage folder", () => {
    dir = mkdtempSync(join(tmpdir(), "mathsplanner-new-"));
    const [generator, test] = scaffold("AL-P7.4", statements, dir);
    expect(generator).toBe(join(dir, "ks5", "AL-P7.4.ts"));
    expect(test).toBe(join(dir, "ks5", "AL-P7.4.test.ts"));
    const source = readFileSync(generator ?? "", "utf8");
    expect(source).toContain("@statement AL-P7.4");
    expect(source).toContain('id: "AL-P7.4"');
    expect(readFileSync(test ?? "", "utf8")).toContain('import generator from "./AL-P7.4.ts"');
    // The coverage report sees it as a generator for a known statement.
    expect(findGenerators(dir).map((g) => [g.fileId, g.declaredIds])).toEqual([
      ["AL-P7.4", ["AL-P7.4"]],
    ]);
  });

  it("refuses unknown IDs and never overwrites", () => {
    dir = mkdtempSync(join(tmpdir(), "mathsplanner-new-"));
    expect(() => scaffold("AL-P9.9", statements, dir)).toThrow("not a statement");
    scaffold("AL-P7.4", statements, dir);
    expect(() => scaffold("AL-P7.4", statements, dir)).toThrow("already exists");
    expect(existsSync(join(dir, "ks5", "AL-P7.4.ts"))).toBe(true);
  });
});
