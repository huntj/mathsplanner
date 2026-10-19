import { describe, expect, it } from "vitest";
import { importMap, sectionInfo } from "../src/import.ts";

const table = (header: string, rows: string[]) =>
  [header, header.replace(/[^|]+/g, " --- "), ...rows].join("\n");

const FIXTURE = [
  "## EYFS: Nursery and Reception (ages 3 to 5)",
  "### Nursery (3 to 4 years, Development Matters)",
  table("| ID | I can… | Needs |", ["| N-NPV-01 | Subitise to 3 |  |"]),
  "### Reception (4 to 5 years)",
  table("| ID | I can… | Needs |", [
    "| R-NPV-01 | Count objects | N-NPV-01 |",
    "| R-NPV-02 | Subitise up to 5 (ELG) | N-NPV-01 |",
  ]),
  "## Lower Key Stage 2: Years 3 and 4 (ages 7 to 9)",
  "### Year 3",
  table("| ID | I can… | Needs |", ["| Y3-FR-01 | Count in tenths | R-NPV-01, R-NPV-02 |"]),
  "## Key Stage 3: Years 7 to 9 (ages 11 to 14)",
  "### Year 7 (recommended)",
  table("| ID | I can… | Needs |", ["| Y7-ALG-01 | Use notation | Y3-FR-01 |"]),
  "## Key Stage 4: Pearson Edexcel GCSE (9-1) Mathematics 1MA1, Years 10 and 11",
  "### Number",
  table("| ID | I can… | Needs |", [
    "| GF-N1 | Order numbers | Y7-ALG-01 |",
    "| GH-N5 | Use the product rule | GF-N1 |",
  ]),
  "## Key Stage 5: Pearson Edexcel A level Mathematics 9MA0, Years 12 and 13",
  "### Pure mathematics",
  table("| ID | I can… | Yr | Needs |", [
    "| AL-P2.1 | Use indices | 12 | GH-N5 |",
    "| AL-P5.7 | Solve trig equations, \\|x\\| < 1 | 12, 13 | AL-P2.1 |",
  ]),
  "## Key Stage 5: Pearson Edexcel A level Further Mathematics 9FM0",
  "### Core Pure (Papers 1 and 2)",
  table("| ID | I can… | Yr | Needs |", ["| FM-CP-08 | Add matrices | 12 |  |"]),
  "### Option papers",
  table("| ID | Option | I can… | Needs |", [
    "| FM-FS1-01 | Further Statistics 1 | Find expectation | AL-P2.1 |",
  ]),
  "## Level 3 Core Maths: Pearson Edexcel Mathematics in Context 7MC0",
  table("| ID | I can… | Needs |", ["| CM-LP1 | Translate situations | GF-N1 |"]),
  "## Curriculum change watch",
  table("| Date | Change |", ["| Sep 2028 | New curriculum |"]),
].join("\n\n");

describe("importMap", () => {
  const result = importMap(FIXTURE);
  const byId = new Map(result.statements.map((s) => [s.id, s]));

  it("imports every statement row, in map order, and ignores other tables", () => {
    expect(result.errors).toEqual([]);
    expect(result.statements.map((s) => s.id)).toEqual([
      "N-NPV-01",
      "R-NPV-01",
      "R-NPV-02",
      "Y3-FR-01",
      "Y7-ALG-01",
      "GF-N1",
      "GH-N5",
      "AL-P2.1",
      "AL-P5.7",
      "FM-CP-08",
      "FM-FS1-01",
      "CM-LP1",
    ]);
  });

  it("produces the Statement shape with fields in interface order", () => {
    expect(Object.keys(byId.get("FM-FS1-01") ?? {})).toEqual([
      "id",
      "stage",
      "strand",
      "text",
      "needs",
      "option",
      "source",
      "statutory",
    ]);
    expect(byId.get("Y3-FR-01")).toEqual({
      id: "Y3-FR-01",
      stage: "Y3",
      strand: "FR",
      text: "Count in tenths",
      needs: ["R-NPV-01", "R-NPV-02"],
      source: "NC KS2",
      statutory: true,
    });
  });

  it("derives tier from GF and GH", () => {
    expect(byId.get("GF-N1")?.tier).toBe("F");
    expect(byId.get("GH-N5")?.tier).toBe("H");
    expect(byId.get("Y7-ALG-01")?.tier).toBeUndefined();
  });

  it("reads KS5 years, including rows that span both", () => {
    expect(byId.get("AL-P2.1")?.years).toEqual([12]);
    expect(byId.get("AL-P5.7")?.years).toEqual([12, 13]);
    expect(byId.get("AL-P5.7")?.text).toBe("Solve trig equations, |x| < 1");
    expect(byId.get("FM-FS1-01")?.years).toBeUndefined();
  });

  it("maps the Option column to option codes", () => {
    expect(byId.get("FM-FS1-01")?.option).toBe("FS1");
    expect(byId.get("FM-CP-08")?.option).toBeUndefined();
  });

  it("sets source from the section", () => {
    expect(
      ["N-NPV-01", "R-NPV-01", "Y7-ALG-01", "GH-N5", "AL-P2.1", "FM-CP-08", "CM-LP1"].map(
        (id) => byId.get(id)?.source,
      ),
    ).toEqual([
      "Development Matters",
      "EYFS framework",
      "NC KS3",
      "Edexcel 1MA1",
      "Edexcel 9MA0",
      "Edexcel 9FM0",
      "Edexcel 7MC0",
    ]);
  });

  it("marks only national curriculum statements and Reception ELGs as statutory", () => {
    const statutory = result.statements.filter((s) => s.statutory).map((s) => s.id);
    expect(statutory).toEqual(["R-NPV-02", "Y3-FR-01", "Y7-ALG-01"]);
  });

  it("notes KS5 tables without a Yr column", () => {
    expect(result.notes.map((n) => n.message)).toEqual([
      expect.stringContaining('"Option papers" has no Yr column'),
      expect.stringContaining("Core Maths"),
    ]);
  });
});

describe("importMap errors", () => {
  const errorsFor = (h2: string, h3: string, header: string, row: string) =>
    importMap([`## ${h2}`, `### ${h3}`, table(header, [row])].join("\n")).errors.map(
      (e) => e.message,
    );
  const KS2 = ["Upper Key Stage 2: Years 5 and 6", "Year 5", "| ID | I can… | Needs |"] as const;

  it("rejects IDs that break the scheme", () => {
    expect(errorsFor(...KS2, "| Y5-FRX-01 | Text |  |")).toEqual([
      '"Y5-FRX-01" does not follow the ID scheme',
    ]);
  });

  it("rejects a statement filed under the wrong year", () => {
    expect(errorsFor(...KS2, "| Y6-FR-01 | Text |  |")).toEqual([
      'stage Y6 does not belong in section "Year 5"',
    ]);
  });

  it("rejects malformed Needs entries", () => {
    expect(errorsFor(...KS2, "| Y5-FR-01 | Text | Y4-FR-01; Y4-FR-02 |")).toEqual([
      'Needs entry "Y4-FR-01; Y4-FR-02" does not follow the ID scheme',
    ]);
  });

  it("rejects empty text and rows with the wrong number of cells", () => {
    expect(errorsFor(...KS2, "| Y5-FR-01 |  |  |")).toEqual(["empty I can… text"]);
    expect(errorsFor(...KS2, "| Y5-FR-01 | Text |")).toEqual([
      "row has 2 cells but the header has 3",
    ]);
  });

  it("rejects bad Yr values", () => {
    expect(
      errorsFor(
        "A level Mathematics 9MA0",
        "Pure",
        "| ID | I can… | Yr | Needs |",
        "| AL-P2.1 | T | 11 |  |",
      ),
    ).toEqual(['Yr "11" is not 12, 13 or "12, 13"']);
  });

  it("rejects unknown or mismatched options", () => {
    const header = "| ID | Option | I can… | Needs |";
    expect(
      errorsFor("Further Mathematics 9FM0", "Options", header, "| FM-FS1-01 | Stats | T |  |"),
    ).toEqual(['unknown option "Stats"']);
    expect(
      errorsFor(
        "Further Mathematics 9FM0",
        "Options",
        header,
        "| FM-FS1-01 | Further Pure 1 | T |  |",
      ),
    ).toEqual(["Option column says FP1 but the ID says FS1"]);
  });

  it("rejects statement tables in sections it does not recognise", () => {
    expect(
      errorsFor("Appendix", "Extra", "| ID | I can… | Needs |", "| Y5-FR-01 | T |  |"),
    ).toEqual(['statement table in an unrecognised section: "Appendix / Extra"']);
  });
});

describe("sectionInfo", () => {
  it("recognises every section of the map", () => {
    expect(sectionInfo("Key Stage 1: Years 1 and 2 (ages 5 to 7)", "Year 2")).toEqual({
      stages: ["Y2"],
      source: "NC KS1",
    });
    expect(sectionInfo("EYFS: Nursery and Reception", "How to use")).toBeUndefined();
    expect(sectionInfo(undefined, undefined)).toBeUndefined();
  });
});
