// Marking a response against a part's AnswerSpec. Pure and synchronous, so it runs in the browser
// and in tests alike.
import type { AnswerValue, Misconception, Part, Question, Validator } from "@mathsplanner/core";
import { equivalent, formProblem } from "./exact.ts";
import { accuracyWords, judgeNumber, parseNumber } from "./number.ts";

export type MarkStatus =
  /** Full marks. */
  | "correct"
  /** Some marks, e.g. the right choice with the wrong reason. */
  | "partial"
  /** The right value in the wrong form, or not rounded as asked. */
  | "wrong-form"
  | "incorrect"
  /** The response could not be read, e.g. "x+" or "abc" for a number. */
  | "invalid"
  | "unanswered"
  /** Not auto-marked: free text, or a condition part with no validator. */
  | "unmarked";

export interface MarkResult {
  status: MarkStatus;
  score: number;
  marks: number;
  /** The predictable wrong answer the response matches, with its feedback. */
  misconception?: Misconception;
  /** A short message for wrong-form, invalid and partial results. */
  message?: string;
}

export interface QuestionMark {
  parts: MarkResult[];
  score: number;
  marks: number;
}

const result = (
  part: Part,
  status: MarkStatus,
  fraction: number,
  extra: Partial<MarkResult> = {},
): MarkResult => ({
  status,
  score: Math.round(part.marks * fraction * 100) / 100,
  marks: part.marks,
  ...extra,
});

const sameSet = (a: readonly string[], b: readonly string[]) =>
  a.length === b.length && a.every((x) => b.includes(x));
const pairKey = ([l, r]: [string, string]) => `${l}\u0000${r}`;

/** The misconception a wrong response matches, if any. */
function matchMisconception(part: Part, response: AnswerValue): Misconception | undefined {
  const a = part.answer;
  return part.misconceptions.find((m) => {
    const w = m.answer;
    switch (response.type) {
      case "number":
        return (
          w.type === "number" &&
          a.type === "number" &&
          judgeNumber(response.value, w.value, a.accuracy) !== "wrong"
        );
      case "exact":
        return w.type === "exact" && equivalent(response.latex, w.latex) === true;
      case "choice":
        return w.type === "choice" && w.id === response.id;
      case "choice-with-reason":
        // A wrong reason's misconception counts whichever option goes with it.
        return (
          (w.type === "choice" && w.id === response.reason) ||
          (w.type === "choice-with-reason" && w.id === response.id && w.reason === response.reason)
        );
      case "choices":
        return w.type === "choices" && sameSet(w.ids, response.ids);
      case "order":
        return w.type === "order" && w.ids.join() === response.ids.join();
      default:
        return false;
    }
  });
}

function wrong(part: Part, response: AnswerValue): MarkResult {
  const misconception = matchMisconception(part, response);
  return result(part, "incorrect", 0, misconception ? { misconception } : {});
}

/** Coordinates and plotted points: within the target's tolerance. */
function plotFraction(
  part: Part & { answer: { type: "plot" } },
  points: Record<string, [number, number]>,
): number {
  const { target, tolerance, place } = part.answer;
  if (target.type === "measure") {
    // The free end of a protractor's second arm, in a frame with the vertex at the origin.
    const arm = points.arm;
    if (!arm || Math.hypot(...arm) === 0 || arm[1] < -1e-9) return 0;
    const angle = Number(target.angle);
    const expected = target.baseline === "left" ? 180 - angle : angle;
    const drawn = (Math.atan2(arm[1], arm[0]) * 180) / Math.PI;
    return Math.abs(drawn - expected) <= tolerance + 1e-9 ? 1 : 0;
  }
  const at = (name: string): [number, number] | undefined => {
    const pts = target.points as
      Record<string, [number, number]> | { at: [number, number] }[] | undefined;
    if (Array.isArray(pts)) return pts[Number(name)]?.at;
    return pts?.[name];
  };
  const hits = place.filter((name) => {
    const want = at(name);
    const got = points[name];
    return want && got && Math.hypot(got[0] - want[0], got[1] - want[1]) <= tolerance + 1e-9;
  });
  return place.length === 0 ? 0 : hits.length / place.length;
}

/**
 * Marks one part. `validator` is needed for condition parts; it comes from generateFull, since
 * validators are functions and stay outside the Question's JSON.
 */
export function markPart(
  part: Part,
  response: AnswerValue | undefined,
  validator?: Validator,
): MarkResult {
  if (response === undefined) return result(part, "unanswered", 0);
  const a = part.answer;
  switch (a.type) {
    case "number": {
      if (response.type !== "number")
        return result(part, "invalid", 0, { message: "Enter a number." });
      const judged = judgeNumber(response.value, a.value, a.accuracy);
      if (judged === "right") return result(part, "correct", 1);
      if (judged === "unrounded")
        return result(part, "wrong-form", 0, {
          message: `Round your answer ${accuracyWords(a.accuracy)}.`,
        });
      return wrong(part, response);
    }
    case "exact": {
      if (response.type !== "exact") return result(part, "invalid", 0);
      const same = equivalent(response.latex, a.value);
      if (same === undefined)
        return result(part, "invalid", 0, {
          message: "Your answer could not be read. Check it is complete.",
        });
      if (!same) return wrong(part, response);
      const problem = a.form ? formProblem(response.latex, a.form) : undefined;
      return problem
        ? result(part, "wrong-form", 0, { message: problem })
        : result(part, "correct", 1);
    }
    case "coordinate": {
      if (response.type !== "coordinate") return result(part, "invalid", 0);
      const axis = (got: string, want: string) => {
        const [g, w] = [parseNumber(got), parseNumber(want)];
        if (g !== undefined && w !== undefined) return Math.abs(g - w) <= (a.tolerance ?? 0) + 1e-9;
        return equivalent(got, want) === true;
      };
      return axis(response.x, a.x) && axis(response.y, a.y)
        ? result(part, "correct", 1)
        : wrong(part, response);
    }
    case "choice":
      if (response.type !== "choice") return result(part, "invalid", 0);
      return response.id === a.correct ? result(part, "correct", 1) : wrong(part, response);
    case "multi-select": {
      if (response.type !== "choices") return result(part, "invalid", 0);
      if (sameSet(response.ids, a.correct)) return result(part, "correct", 1);
      if (!a.partialCredit) return wrong(part, response);
      const hits = response.ids.filter((id) => a.correct.includes(id)).length;
      const misses = response.ids.length - hits;
      const fraction = Math.max(0, hits - misses) / a.correct.length;
      return fraction > 0 ? result(part, "partial", fraction) : wrong(part, response);
    }
    case "choice-with-reason": {
      if (response.type !== "choice-with-reason") return result(part, "invalid", 0);
      const option = response.id === a.correct;
      const reason = response.reason === a.correctReason;
      if (option && reason) return result(part, "correct", 1);
      const misconception = matchMisconception(part, response);
      const message = option
        ? "Right answer, but not the right reason."
        : reason
          ? "Right reason, but check your answer."
          : undefined;
      return result(part, option || reason ? "partial" : "incorrect", option || reason ? 0.5 : 0, {
        ...(misconception ? { misconception } : {}),
        ...(message ? { message } : {}),
      });
    }
    case "order":
      if (response.type !== "order") return result(part, "invalid", 0);
      return response.ids.join() === a.correct.join()
        ? result(part, "correct", 1)
        : wrong(part, response);
    case "match": {
      if (response.type !== "match") return result(part, "invalid", 0);
      const want = new Set(a.correct.map(pairKey));
      const ok =
        response.pairs.length === a.correct.length &&
        response.pairs.every((p) => want.has(pairKey(p)));
      return ok ? result(part, "correct", 1) : wrong(part, response);
    }
    case "plot": {
      if (response.type !== "points") return result(part, "invalid", 0);
      const fraction = plotFraction(part as Part & { answer: { type: "plot" } }, response.points);
      return fraction === 1
        ? result(part, "correct", 1)
        : fraction > 0
          ? result(part, "partial", fraction)
          : result(part, "incorrect", 0);
    }
    case "condition": {
      if (!validator) return result(part, "unmarked", 0);
      if (response.type !== "values") return result(part, "invalid", 0);
      return validator(response.values) ? result(part, "correct", 1) : result(part, "incorrect", 0);
    }
    case "free-text":
      return result(part, "unmarked", 0);
  }
}

/** Marks every part of a question; validators are by part index, as generateFull returns them. */
export function markQuestion(
  question: Question,
  responses: readonly (AnswerValue | undefined)[],
  validators?: ReadonlyMap<number, Validator>,
): QuestionMark {
  const parts = question.parts.map((part, i) => markPart(part, responses[i], validators?.get(i)));
  return {
    parts,
    score: parts.reduce((s, p) => s + p.score, 0),
    marks: parts.reduce((s, p) => s + p.marks, 0),
  };
}
