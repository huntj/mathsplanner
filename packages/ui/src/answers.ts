// What a student has entered so far for one part (a draft), and turning it into the AnswerValue
// that marking takes.
import type { AnswerSpec, AnswerValue, ConditionInput } from "@mathsplanner/core";
import { parseNumber } from "@mathsplanner/marking";

export type Draft =
  | { type: "text"; text: string }
  | { type: "exact"; latex: string }
  | { type: "coordinate"; x: string; y: string }
  | { type: "choice"; id?: string }
  | { type: "choices"; ids: string[] }
  | { type: "reasoned"; id?: string; reason?: string }
  | { type: "order"; ids: string[] }
  | { type: "match"; pairs: Record<string, string> }
  | { type: "points"; points: Record<string, [number, number]> }
  | { type: "values"; texts: string[] };

/** An empty draft for a part. Order starts in the order given, which is already shuffled. */
export function emptyDraft(answer: AnswerSpec): Draft {
  switch (answer.type) {
    case "number":
    case "free-text":
      return { type: "text", text: "" };
    case "exact":
      return { type: "exact", latex: "" };
    case "coordinate":
      return { type: "coordinate", x: "", y: "" };
    case "choice":
      return { type: "choice" };
    case "multi-select":
      return { type: "choices", ids: [] };
    case "choice-with-reason":
      return { type: "reasoned" };
    case "order":
      return { type: "order", ids: answer.options.map((o) => o.id) };
    case "match":
      return { type: "match", pairs: {} };
    case "plot":
      return { type: "points", points: {} };
    case "condition":
      return { type: "values", texts: answer.inputs.map(() => "") };
  }
}

/** Reads "3, -2" or "(3, -2)" as a coordinate. */
function coordinateParts(text: string): [string, string] | undefined {
  const m = /^\(?\s*([^,()]+?)\s*,\s*([^,()]+?)\s*\)?$/.exec(text.trim());
  return m ? [m[1] ?? "", m[2] ?? ""] : undefined;
}

function conditionValue(input: ConditionInput, text: string): AnswerValue {
  if (input === "number") {
    const value = parseNumber(text);
    return value === undefined ? { type: "text", text } : { type: "number", value };
  }
  if (input === "coordinate") {
    const parts = coordinateParts(text);
    return parts ? { type: "coordinate", x: parts[0], y: parts[1] } : { type: "text", text };
  }
  return { type: "exact", latex: text };
}

/**
 * The response to mark, or undefined if nothing has been entered. Something that cannot be read
 * (letters in a number box) is passed on as text, so marking can say so.
 */
export function toResponse(answer: AnswerSpec, draft: Draft): AnswerValue | undefined {
  switch (draft.type) {
    case "text": {
      if (!draft.text.trim()) return undefined;
      if (answer.type === "free-text") return { type: "text", text: draft.text };
      const value = parseNumber(draft.text);
      return value === undefined ? { type: "text", text: draft.text } : { type: "number", value };
    }
    case "exact":
      return draft.latex.trim() ? { type: "exact", latex: draft.latex } : undefined;
    case "coordinate":
      return draft.x.trim() || draft.y.trim()
        ? { type: "coordinate", x: draft.x.trim(), y: draft.y.trim() }
        : undefined;
    case "choice":
      return draft.id === undefined ? undefined : { type: "choice", id: draft.id };
    case "choices":
      return draft.ids.length ? { type: "choices", ids: draft.ids } : undefined;
    case "reasoned":
      return draft.id === undefined || draft.reason === undefined
        ? undefined
        : { type: "choice-with-reason", id: draft.id, reason: draft.reason };
    case "order":
      return { type: "order", ids: draft.ids };
    case "match": {
      const pairs = Object.entries(draft.pairs);
      return pairs.length ? { type: "match", pairs } : undefined;
    }
    case "points":
      return Object.keys(draft.points).length
        ? { type: "points", points: draft.points }
        : undefined;
    case "values": {
      if (answer.type !== "condition" || draft.texts.every((t) => !t.trim())) return undefined;
      return {
        type: "values",
        values: answer.inputs.map((input, i) => conditionValue(input, draft.texts[i] ?? "")),
      };
    }
  }
}

/** Whether every input the part needs has something in it, so Check can be pressed. */
export function isComplete(answer: AnswerSpec, draft: Draft): boolean {
  switch (draft.type) {
    case "reasoned":
      return draft.id !== undefined && draft.reason !== undefined;
    case "match":
      return answer.type === "match" && Object.keys(draft.pairs).length === answer.left.length;
    case "points":
      return answer.type === "plot" && answer.place.every((name) => draft.points[name]);
    case "values":
      return draft.texts.every((t) => t.trim());
    case "coordinate":
      return Boolean(draft.x.trim() && draft.y.trim());
    default:
      return toResponse(answer, draft) !== undefined;
  }
}
