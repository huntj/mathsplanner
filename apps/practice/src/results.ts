// Turning a finished session into rows a teacher can open in a spreadsheet. The CSV is made in the
// browser and downloaded; it is never sent anywhere.
import type { AnswerValue, Part, Question } from "@mathsplanner/core";
import type { QuestionMark } from "@mathsplanner/marking";
import catalogueFile from "../../../data/misconceptions.json" with { type: "json" };
import { statementById } from "./session.ts";

const catalogue = new Map(
  (
    catalogueFile as { misconceptions: { code: string; description: string; remediate?: string }[] }
  ).misconceptions.map((m) => [m.code, m]),
);

/** The catalogue's description of a misconception code. */
export const misconceptionText = (code: string): string | undefined =>
  catalogue.get(code)?.description;

export interface Attempt {
  question: Question;
  mark: QuestionMark;
  /** A short text version of what the student answered, part by part. */
  answers: string[];
}

export const STATUS_WORDS = {
  correct: "Correct",
  partial: "Partly correct",
  "wrong-form": "Right value, wrong form",
  incorrect: "Incorrect",
  invalid: "Could not be read",
  unanswered: "Not answered",
  unmarked: "For the teacher to mark",
} as const;

const HEADERS = [
  "Name",
  "Date",
  "Question",
  "Statement",
  "Statement text",
  "Depth",
  "Numbers",
  "Seed",
  "Generator version",
  "Part",
  "Score",
  "Marks",
  "Result",
  "Misconception",
  "Misconception description",
  "Answer given",
];

/** Quotes a CSV field when it needs it, and stops spreadsheets running it as a formula. */
export function csvField(value: string | number): string {
  let text = String(value);
  if (/^[=+\-@\t\r]/.test(text) && typeof value === "string") text = `'${text}`;
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/** One row per question part. */
export function resultsCsv(name: string, date: Date, attempts: readonly Attempt[]): string {
  const day = date.toISOString().slice(0, 10);
  const rows = attempts.flatMap((attempt, q) =>
    attempt.mark.parts.map((part, p) => {
      const { key } = attempt.question;
      const code = part.misconception?.code ?? "";
      return [
        name,
        day,
        q + 1,
        key.statementId,
        statementById.get(key.statementId)?.text ?? "",
        key.depth,
        key.numbers,
        key.seed,
        key.version,
        attempt.mark.parts.length > 1 ? String.fromCharCode(97 + p) : "",
        part.score,
        part.marks,
        STATUS_WORDS[part.status],
        code,
        code ? (misconceptionText(code) ?? "") : "",
        attempt.answers[p] ?? "",
      ];
    }),
  );
  return [HEADERS, ...rows].map((row) => row.map(csvField).join(",")).join("\r\n") + "\r\n";
}

/** Total score and marks over a session. */
export function totals(attempts: readonly Attempt[]): { score: number; marks: number } {
  return attempts.reduce(
    (t, a) => ({ score: t.score + a.mark.score, marks: t.marks + a.mark.marks }),
    { score: 0, marks: 0 },
  );
}

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** What a student answered, in the letters and numbers they saw, for the CSV. */
export function answerText(part: Part, response: AnswerValue | undefined): string {
  if (!response) return "";
  const a = part.answer;
  const letter = (options: readonly { id: string }[], id: string) =>
    LETTERS[options.findIndex((o) => o.id === id)] ?? id;
  switch (response.type) {
    case "number":
      return String(response.value);
    case "exact":
      return response.latex;
    case "coordinate":
      return `(${response.x}, ${response.y})`;
    case "choice":
      return "options" in a ? letter(a.options, response.id) : response.id;
    case "choices":
    case "order":
      return "options" in a
        ? response.ids.map((id) => letter(a.options, id)).join(", ")
        : response.ids.join(", ");
    case "choice-with-reason":
      return a.type === "choice-with-reason"
        ? `${letter(a.options, response.id)}, reason ${letter(a.reasons, response.reason)}`
        : "";
    case "match":
      return a.type === "match"
        ? response.pairs
            .map(([l, r]) => `${a.left.findIndex((o) => o.id === l) + 1}–${letter(a.right, r)}`)
            .join(", ")
        : "";
    case "points":
      return Object.entries(response.points)
        .map(([name, [x, y]]) =>
          name === "arm"
            ? `arm at ${Math.round((Math.atan2(y, x) * 180) / Math.PI)}°`
            : `${name} (${x}, ${y})`,
        )
        .join(", ");
    case "values":
      return response.values
        .map((v) => answerText({ ...part, answer: { type: "free-text", markScheme: [] } }, v))
        .join(", ");
    case "text":
      return response.text;
  }
}
