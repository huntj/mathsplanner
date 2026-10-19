import { describe, expect, it } from "vitest";
import { parseTables, splitRow } from "../src/markdown.ts";

describe("splitRow", () => {
  it("trims cells and drops the outer pipes", () => {
    expect(splitRow("| A |  b c | |")).toEqual(["A", "b c", ""]);
  });

  it("keeps escaped pipes inside a cell", () => {
    expect(splitRow("| AL-P4.5 | sum to infinity when \\|r\\| < 1 | 13 |")).toEqual([
      "AL-P4.5",
      "sum to infinity when |r| < 1",
      "13",
    ]);
  });

  it("keeps other characters, including non-ASCII maths", () => {
    expect(splitRow("| x | ⅓ + ¼ ≠ 2/7 \\* |")).toEqual(["x", "⅓ + ¼ ≠ 2/7 *"]);
  });
});

describe("parseTables", () => {
  const md = [
    "# Title",
    "## Section A",
    "| H1 | H2 |",
    "| --- | --- |",
    "| a | b |",
    "",
    "### Sub",
    "",
    "| X |",
    "| :-: |",
    "| 1 |",
    "| 2 |",
    "Not a table row",
    "## Section B",
    "| Not a table because no delimiter |",
  ].join("\n");

  it("finds each table with its headings and line numbers", () => {
    const tables = parseTables(md);
    expect(tables).toHaveLength(2);
    expect(tables[0]).toMatchObject({
      line: 3,
      h2: "Section A",
      h3: undefined,
      header: ["H1", "H2"],
    });
    expect(tables[0]?.rows).toEqual([{ line: 5, cells: ["a", "b"] }]);
    expect(tables[1]).toMatchObject({ line: 9, h2: "Section A", h3: "Sub", header: ["X"] });
    expect(tables[1]?.rows.map((r) => r.cells[0])).toEqual(["1", "2"]);
  });

  it("resets the subheading when a new section starts", () => {
    const tables = parseTables("## A\n### B\n## C\n| H |\n| - |\n| v |\n");
    expect(tables[0]).toMatchObject({ h2: "C", h3: undefined });
  });

  it("handles Windows line endings", () => {
    expect(parseTables("## A\r\n| H |\r\n| --- |\r\n| v |\r\n")[0]?.rows[0]?.cells).toEqual(["v"]);
  });
});
