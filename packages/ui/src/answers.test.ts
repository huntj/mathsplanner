import { describe, expect, it } from "vitest";
import { emptyDraft, isComplete, toResponse } from "./answers.ts";

describe("answers", () => {
  const number = { type: "number" as const, value: 40, accuracy: { exact: true as const } };

  it("turns drafts into responses", () => {
    expect(toResponse(number, { type: "text", text: " 40° " })).toEqual({
      type: "number",
      value: 40,
    });
    expect(toResponse(number, { type: "text", text: "forty" })).toEqual({
      type: "text",
      text: "forty",
    });
    expect(toResponse(number, { type: "text", text: "" })).toBeUndefined();
    const condition = {
      type: "condition" as const,
      inputs: ["number", "coordinate"] as ("number" | "coordinate")[],
      describe: [],
    };
    expect(toResponse(condition, { type: "values", texts: ["100", "(3, -2)"] })).toEqual({
      type: "values",
      values: [
        { type: "number", value: 100 },
        { type: "coordinate", x: "3", y: "-2" },
      ],
    });
  });

  it("only lets a part be checked when every input is filled", () => {
    const options = ["A", "B"].map((id) => ({ id, content: [] }));
    const reasoned = {
      type: "choice-with-reason" as const,
      options,
      correct: "A",
      reasons: options,
      correctReason: "B",
    };
    expect(isComplete(reasoned, { type: "reasoned", id: "A" })).toBe(false);
    expect(isComplete(reasoned, { type: "reasoned", id: "A", reason: "B" })).toBe(true);
    const match = {
      type: "match" as const,
      left: options,
      right: options,
      correct: [
        ["A", "B"],
        ["B", "A"],
      ] as [string, string][],
    };
    expect(isComplete(match, { type: "match", pairs: { A: "B" } })).toBe(false);
    expect(isComplete(match, emptyDraft(match))).toBe(false);
  });
});
