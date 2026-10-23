import type { MisconceptionsFile, Statement, StatementsFile } from "@mathsplanner/core";
import { describe, expect, it } from "vitest";
import { checkData, findCycles, type CheckInput } from "../src/check.ts";
import { PATHS, readJson } from "../src/files.ts";
import type { ExpectedCount } from "../src/summary.ts";

const statementsSchema = readJson(PATHS.statementsSchema) as object;
const misconceptionsSchema = readJson(PATHS.misconceptionsSchema) as object;

const s = (id: string, needs: string[] = [], extra: Partial<Statement> = {}): Statement => {
  const base: Record<string, Omit<Statement, "id" | "needs" | "text">> = {
    Y5: { stage: "Y5", strand: "FR", source: "NC KS2", statutory: true },
    Y6: { stage: "Y6", strand: "FR", source: "NC KS2", statutory: true },
    GF: { stage: "GF", strand: "A", tier: "F", source: "Edexcel 1MA1", statutory: false },
    GH: { stage: "GH", strand: "A", tier: "H", source: "Edexcel 1MA1", statutory: false },
    AL: { stage: "AL", strand: "P4", source: "Edexcel 9MA0", statutory: false },
    FM: { stage: "FM", strand: "CP", source: "Edexcel 9FM0", statutory: false },
  };
  const prefix = id.split("-")[0] ?? "";
  return { id, text: `Text for ${id}`, needs, ...base[prefix], ...extra } as Statement;
};

const VALID: Statement[] = [
  s("Y5-FR-01"),
  s("Y6-FR-01", ["Y5-FR-01"]),
  s("GF-A3", ["Y6-FR-01"]),
  s("GH-A3", ["GF-A3"]),
  s("AL-P4.2", ["GH-A3"], { years: [12] }),
  s("FM-CP-01", ["AL-P4.2"], { years: [12, 13] }),
];

const counts = (n: number): ExpectedCount[] => [
  { group: { label: "Everything", stages: ["Y5", "Y6", "GF", "GH", "AL", "FM"] }, expected: n },
];

const input = (
  statements: Statement[],
  overrides: Partial<CheckInput> = {},
  misconceptions: MisconceptionsFile["misconceptions"] = [],
): CheckInput => ({
  statements: { version: "0.1.0", statements } satisfies StatementsFile,
  misconceptions: { version: "0.1.0", misconceptions } satisfies MisconceptionsFile,
  statementsSchema,
  misconceptionsSchema,
  expectedCounts: counts(statements.length),
  ...overrides,
});

describe("checkData", () => {
  it("passes valid data", () => {
    const result = checkData(input(VALID));
    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([
      "Y5-FR-01 has no prerequisites (an entry point outside EYFS)",
    ]);
    expect(result.total).toEqual({ expected: 6, actual: 6 });
  });

  it("finds duplicate IDs", () => {
    expect(
      checkData(input([...VALID, s("Y5-FR-01")], { expectedCounts: counts(7) })).errors,
    ).toEqual(["Y5-FR-01: duplicate ID"]);
  });

  it("finds missing and self prerequisites", () => {
    const { errors } = checkData(input([s("Y5-FR-01", ["Y5-FR-01", "Y4-FR-09"])]));
    expect(errors).toEqual([
      "Y5-FR-01: needs itself",
      "Y5-FR-01: needs Y4-FR-09, which does not exist",
    ]);
  });

  it("finds prerequisite cycles", () => {
    const cyclic = [
      s("Y5-FR-01", ["Y5-FR-03"]),
      s("Y5-FR-02", ["Y5-FR-01"]),
      s("Y5-FR-03", ["Y5-FR-02"]),
    ];
    expect(checkData(input(cyclic)).errors).toEqual([
      "prerequisite cycle: Y5-FR-01 → Y5-FR-03 → Y5-FR-02 → Y5-FR-01",
    ]);
  });

  it("compares counts with the map's summary", () => {
    const { errors, counts: actual } = checkData(input(VALID, { expectedCounts: counts(7) }));
    expect(actual).toEqual([{ label: "Everything", expected: 7, actual: 6 }]);
    expect(errors).toEqual([
      "Everything: 6 statements, but the map's summary says 7",
      "6 statements in total, but the map's summary adds up to 7",
    ]);
  });

  it("checks that derived fields agree with the ID", () => {
    const { errors } = checkData(
      input([
        s("Y5-FR-01", [], { strand: "MD" }),
        s("GF-A3", [], { tier: "H" }),
        s("Y6-FR-01", [], { source: "NC KS1", statutory: false }),
        s("AL-P4.2", [], { option: "FS1" }),
        s("Y5-FR-02", [], { years: [12] }),
      ]),
    );
    expect(errors).toEqual([
      "Y5-FR-01: strand is MD, ID says FR",
      "GF-A3: tier is H, ID says F",
      'Y6-FR-01: source is "NC KS1", expected "NC KS2"',
      "Y6-FR-01: statutory should be true for stage Y6",
      "AL-P4.2: option is FS1, ID says unset",
      "Y5-FR-02: only KS5 statements have years",
    ]);
  });

  it("checks sub-statements against their parents, and leaves them out of the counts", () => {
    const ok = [
      ...VALID.slice(0, 3),
      s("GF-A3.a", ["Y6-FR-01"], { parent: "GF-A3" }),
      s("GF-A3.b", ["GF-A3.a"], { parent: "GF-A3" }),
      ...VALID.slice(3),
    ];
    const good = checkData(input(ok, { expectedCounts: counts(6) }));
    expect(good.errors).toEqual([]);
    expect(good.total).toEqual({ expected: 6, actual: 6 });

    const bad = [
      ...VALID.slice(0, 3),
      s("GF-A3.b", ["Y6-FR-01"], { parent: "GF-A3" }),
      s("GF-A3.c", [], { parent: "GF-A4" }),
      s("Y6-FR-01.a", [], { parent: "Y6-FR-01", statutory: false }),
      ...VALID.slice(3),
    ];
    expect(checkData(input(bad, { expectedCounts: counts(6) })).errors).toEqual([
      "GF-A3.b: should come straight after GF-A3.a",
      "GF-A3.c: parent is GF-A4, ID says GF-A3",
      "Y6-FR-01.a: statutory differs from Y6-FR-01",
      "Y6-FR-01.a: should come straight after Y6-FR-01",
    ]);
  });

  it("reports schema errors and stops", () => {
    const bad = { version: "one", statements: [{ id: "Y5-FR-01" }] };
    const result = checkData({ ...input(VALID), statements: bad });
    expect(result.errors).toContain(
      'statements.json/version must match pattern "^\\d+\\.\\d+\\.\\d+$"',
    );
    expect(result.errors).toContainEqual(
      expect.stringContaining("must have required property 'text'"),
    );
    expect(result.counts).toEqual([]);
  });

  it("checks the misconception catalogue", () => {
    const { errors } = checkData(
      input(VALID, {}, [
        { code: "FR.ADD.TOPS-AND-BOTTOMS", description: "Adds numerators and denominators" },
        { code: "FR.ADD.TOPS-AND-BOTTOMS", description: "Duplicate", remediate: "Y4-FR-04" },
      ]),
    );
    expect(errors).toEqual([
      "misconception FR.ADD.TOPS-AND-BOTTOMS: duplicate code",
      "misconception FR.ADD.TOPS-AND-BOTTOMS: remediates to Y4-FR-04, which does not exist",
    ]);
    const lower = checkData(input(VALID, {}, [{ code: "fr.add", description: "x" }]));
    expect(lower.errors).toContainEqual(
      expect.stringContaining("/misconceptions/0/code must match pattern"),
    );
  });

  it("warns about oddities without failing", () => {
    const odd = [
      s("Y5-FR-01", ["Y6-FR-01"]),
      s("Y6-FR-01", [], { text: "Same words" }),
      s("GH-A3", [], { text: "same words" }),
      s("GF-A6", ["GH-A3"]),
      s("AL-P4.3", ["GH-A3"], { years: [13] }),
      s("FM-CP-01", ["AL-P4.3"], { years: [12] }),
    ];
    const { errors, warnings } = checkData(input(odd));
    expect(errors).toEqual([]);
    expect(warnings).toEqual([
      "Y5-FR-01 (Y5) needs Y6-FR-01, which is taught later (Y6)",
      "Y6-FR-01 has no prerequisites (an entry point outside EYFS)",
      "GH-A3 has no prerequisites (an entry point outside EYFS)",
      "GF-A6 is tested on both tiers but needs Higher-only GH-A3",
      "FM-CP-01 (Year 12) needs AL-P4.3, recommended for Year 13",
      "Y6-FR-01 and GH-A3 have identical wording",
    ]);
  });
});

describe("findCycles", () => {
  it("returns nothing for an acyclic graph", () => {
    expect(findCycles(VALID)).toEqual([]);
  });

  it("finds a two-node cycle", () => {
    expect(findCycles([s("Y5-FR-01", ["Y5-FR-02"]), s("Y5-FR-02", ["Y5-FR-01"])])).toEqual([
      ["Y5-FR-01", "Y5-FR-02", "Y5-FR-01"],
    ]);
  });
});
