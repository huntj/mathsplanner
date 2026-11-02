// Variety in reasoning questions. A pupil practising a skill again and again should meet different
// claims with different right answers, so for each skill on the Learn Maths path (data/course.json,
// Year 7 so far) this asks that its depth 4 reasoning questions come in at least MIN_FORMS forms and
// that no one right answer is right more than MAX_SHARE of the time. New years on the path need
// banks of claims (see shared/variety.ts) to pass.
import type { Question, Rich } from "@mathsplanner/core";
import { describe, expect, it } from "vitest";
import courseFile from "../../../data/course.json" with { type: "json" };
import { generators } from "./index.ts";

const course = courseFile as { sections: { units: { skills: string[] }[] }[] };
const onThePath = new Set(course.sections.flatMap((s) => s.units.flatMap((u) => u.skills)));
const SEEDS = 80;
const MIN_FORMS = 3;
const MAX_SHARE = 0.7;
const REASONING = new Set(["true-or-false-why", "always-sometimes-never"]);

const text = (rich: Rich) =>
  rich.map((n) => (n.t === "text" ? n.v : n.t === "math" ? "M" : "")).join("");
/** A question's form: its archetype and wording, with numbers and single letters taken out. */
const form = (q: Question) =>
  `${q.archetype}|${[q.stem, ...q.parts.map((p) => p.prompt)]
    .map(text)
    .join("/")
    .replace(/-?\d+(\.\d+)?/g, "#")}`;
/** The right answer's wording, e.g. "Never true". */
const rightAnswer = (q: Question) => {
  const a = q.parts[0]?.answer;
  if (a?.type !== "choice-with-reason") return undefined;
  return text(a.options.find((o) => o.id === a.correct)?.content ?? []);
};

const checked = generators.filter((g) => onThePath.has(g.id) && g.depths.includes(4));

describe("variety in reasoning questions", () => {
  it.each(checked.map((g) => [g.id, g] as const))("%s varies its claims and answers", (_, g) => {
    const questions = Array.from({ length: SEEDS }, (_, i) =>
      g.generate({ depth: 4, numbers: "standard", seed: i + 1 }),
    ).filter((q) => REASONING.has(q.archetype) || q.parts[0]?.answer.type === "choice-with-reason");
    // Generators whose depth 4 is not a reasoning question (a problem in context, say) are skipped.
    if (questions.length < SEEDS / 2) return;

    const forms = new Set(questions.map(form));
    expect(forms.size, `${g.id} has ${forms.size} forms`).toBeGreaterThanOrEqual(MIN_FORMS);

    const answers = new Map<string, number>();
    for (const q of questions) {
      const a = rightAnswer(q);
      if (a) answers.set(a, (answers.get(a) ?? 0) + 1);
    }
    const top = Math.max(...answers.values());
    expect(
      top / questions.length,
      `${g.id}: one answer is right ${top} times in ${questions.length}`,
    ).toBeLessThanOrEqual(MAX_SHARE);
  });
});
