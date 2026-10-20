// One question: its stem, an input for each part, and (after checking) feedback on each part.
import type { DiagramSpec, Part, Question, Rich } from "@mathsplanner/core";
import type { MarkResult, QuestionMark } from "@mathsplanner/marking";
import { renderAnswer, renderRich, renderSolution } from "@mathsplanner/render";
import { useState } from "react";
import type { Draft } from "./answers.ts";
import { misconceptionText, STATUS_WORDS } from "./results.ts";
import { statementById } from "./session.ts";
import { PartInput } from "./widgets.tsx";

interface Props {
  question: Question;
  drafts: Draft[];
  setDraft: (part: number, draft: Draft) => void;
  /** The marks once checked; feedback shows only when `showFeedback` is on. */
  mark?: QuestionMark;
  showFeedback: boolean;
}

/** The diagram a plot part draws on: the last one in the stem. It becomes the drawing area. */
function canvasIndex(question: Question): number | undefined {
  if (!question.parts.some((p) => p.answer.type === "plot")) return undefined;
  const indices = question.stem.flatMap((n) => (n.t === "diagram" ? [n.i] : []));
  return indices.at(-1);
}

const html = (rich: Rich, diagrams: readonly DiagramSpec[]) => ({
  __html: renderRich(rich, diagrams),
});

function PartFeedback({
  part,
  result,
  diagrams,
}: {
  part: Part;
  result: MarkResult;
  diagrams: readonly DiagramSpec[];
}) {
  const m = result.misconception;
  const feedback = m && m.feedback.length > 0 ? m.feedback : undefined;
  const remediate = m?.remediate ?? undefined;
  const good = result.status === "correct";
  return (
    <div className={`feedback ${result.status}`} role="status">
      <p className="verdict">
        <span aria-hidden="true">
          {good
            ? "✓"
            : result.status === "partial"
              ? "◐"
              : result.status === "unmarked"
                ? "✎"
                : "✗"}
        </span>{" "}
        {STATUS_WORDS[result.status]}
        {result.status !== "unmarked" && (
          <span className="score">
            {" "}
            {result.score} / {result.marks} mark{result.marks === 1 ? "" : "s"}
          </span>
        )}
      </p>
      {result.message && <p>{result.message}</p>}
      {m && (
        <p className="misconception">
          {feedback ? (
            <span dangerouslySetInnerHTML={html(feedback, diagrams)} />
          ) : (
            misconceptionText(m.code)
          )}
          {remediate && statementById.get(remediate) && (
            <>
              {" "}
              <span className="remediate">
                It may help to look back at {remediate}: {statementById.get(remediate)?.text}.
              </span>
            </>
          )}
        </p>
      )}
      {!good && part.answer.type !== "free-text" && part.answer.type !== "plot" && (
        <p className="correct-answer">
          <span className="label">Answer:</span>{" "}
          <span dangerouslySetInnerHTML={{ __html: renderAnswer(part.answer, diagrams) }} />
        </p>
      )}
      {part.answer.type === "free-text" && (
        <p className="correct-answer">
          Mark scheme: <span dangerouslySetInnerHTML={html(part.answer.markScheme, diagrams)} />
        </p>
      )}
    </div>
  );
}

export function QuestionView({ question, drafts, setDraft, mark, showFeedback }: Props) {
  const [solution, setSolution] = useState(false);
  const { diagrams } = question;
  const canvas = canvasIndex(question);
  const stem =
    canvas === undefined
      ? question.stem
      : question.stem.filter((n) => !(n.t === "diagram" && n.i === canvas));
  const locked = mark !== undefined;
  const reveal = locked && showFeedback;
  const labelled = question.parts.length > 1;

  return (
    <article className="mp-question practice-question">
      <div className="mp-stem" dangerouslySetInnerHTML={html(stem, diagrams)} />
      <ol className="parts">
        {question.parts.map((part, i) => {
          const draft = drafts[i];
          const result = mark?.parts[i];
          return (
            <li key={i} className="part">
              <div className="prompt">
                {labelled && (
                  <span className="mp-label">
                    {part.label ?? `(${String.fromCharCode(97 + i)})`}
                  </span>
                )}{" "}
                <span dangerouslySetInnerHTML={html(part.prompt, diagrams)} />
                <span className="mp-marks">
                  [{part.marks} mark{part.marks === 1 ? "" : "s"}]
                </span>
              </div>
              {draft && (
                <PartInput
                  part={part}
                  diagrams={diagrams}
                  draft={draft}
                  setDraft={(d) => setDraft(i, d)}
                  locked={locked}
                  reveal={reveal}
                  {...(canvas !== undefined && part.answer.type === "plot" && diagrams[canvas]
                    ? { canvas: diagrams[canvas] }
                    : {})}
                />
              )}
              {reveal && result && <PartFeedback part={part} result={result} diagrams={diagrams} />}
            </li>
          );
        })}
      </ol>
      {reveal && question.solution.length > 0 && (
        <div className="solution-toggle">
          <button type="button" aria-expanded={solution} onClick={() => setSolution(!solution)}>
            {solution ? "Hide" : "Show"} worked solution
          </button>
          {solution && (
            <div
              dangerouslySetInnerHTML={{ __html: renderSolution(question.solution, diagrams) }}
            />
          )}
        </div>
      )}
    </article>
  );
}
