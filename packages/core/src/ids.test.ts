import { describe, expect, it } from "vitest";
import { keyStageFolder, parseId } from "./ids.ts";

describe("parseId", () => {
  it.each([
    ["N-NPV-01", { stage: "N", strand: "NPV" }],
    ["R-PAT-02", { stage: "R", strand: "PAT" }],
    ["Y6-FR-03", { stage: "Y6", strand: "FR" }],
    ["Y9-PRO-02", { stage: "Y9", strand: "PRO" }],
    ["GF-N16", { stage: "GF", strand: "N", tier: "F" }],
    ["GH-A18", { stage: "GH", strand: "A", tier: "H" }],
    ["AL-P7.4", { stage: "AL", strand: "P7" }],
    ["AL-P10.1a", { stage: "AL", strand: "P10" }],
    ["AL-S5.1b", { stage: "AL", strand: "S5" }],
    ["AL-M7.3a", { stage: "AL", strand: "M7" }],
    ["FM-CP-31", { stage: "FM", strand: "CP" }],
    ["FM-FS1-02", { stage: "FM", strand: "FS1", option: "FS1" }],
    ["FM-D2-06", { stage: "FM", strand: "D2", option: "D2" }],
    ["CM-LP10", { stage: "CM", strand: "LP" }],
    ["CM-A1", { stage: "CM", strand: "A" }],
  ])("derives %s", (id, expected) => {
    expect(parseId(id)).toEqual(expected);
  });

  it.each([
    "Y6-FR-3", // two-digit number
    "Y10-NPV-01", // no Year 10 stage
    "Y6-XYZ-01", // unknown strand
    "GF-X1", // unknown GCSE area
    "AL-P7", // missing sub-topic
    "FM-FP3-01", // no such option
    "CM-Q1",
    "y6-fr-03",
    "",
  ])("rejects %j", (id) => {
    expect(parseId(id)).toBeUndefined();
  });
});

describe("keyStageFolder", () => {
  it("follows the design doc's eyfs … ks5 folders", () => {
    expect(
      ["N", "R", "Y2", "Y3", "Y6", "Y7", "GH", "AL", "FM", "CM"].map((s) =>
        keyStageFolder(s as never),
      ),
    ).toEqual(["eyfs", "eyfs", "ks1", "ks2", "ks2", "ks3", "ks4", "ks5", "ks5", "ks5"]);
  });
});
