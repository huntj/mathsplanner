// A student's run through a session: their name (kept only in this page), each question in turn,
// and the results, which they download or print for the teacher. Nothing leaves the browser.
import type { Question, Validator } from "@mathsplanner/core";
import { markQuestion, prepareMarking, type QuestionMark } from "@mathsplanner/marking";
import { useMemo, useState, type FormEvent } from "react";
import { emptyDraft, isComplete, toResponse, type Draft } from "./answers.ts";
import { QuestionView } from "./QuestionView.tsx";
import { ResultsView } from "./ResultsView.tsx";
import { answerText, type Attempt } from "./results.ts";
import {
  generatorFor,
  specTitle,
  sessionItems,
  statementById,
  type SessionSpec,
} from "./session.ts";

interface Loaded {
  question: Question;
  validators: ReadonlyMap<number, Validator>;
}

function load(spec: SessionSpec): Loaded[] {
  return sessionItems(spec).flatMap(({ statementId, depth, seed }) => {
    const generator = generatorFor(statementId);
    if (!generator) return [];
    const { question, validators } = generator.generateFull({ depth, numbers: spec.numbers, seed });
    return [{ question, validators }];
  });
}

export function SessionView({ spec, restart }: { spec: SessionSpec; restart: () => void }) {
  const questions = useMemo(() => load(spec), [spec]);
  const [name, setName] = useState("");
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [drafts, setDrafts] = useState<Draft[][]>(() =>
    questions.map(({ question }) => question.parts.map((p) => emptyDraft(p.answer))),
  );
  const [marks, setMarks] = useState<(QuestionMark | undefined)[]>([]);
  const [finished, setFinished] = useState(false);

  if (questions.length === 0) {
    return (
      <p className="banner error">
        None of the chosen statements has questions at the chosen depths.
      </p>
    );
  }

  if (!started) {
    const statements = [...new Set(questions.map((q) => q.question.key.statementId))];
    return (
      <form
        className="start"
        onSubmit={(e) => {
          e.preventDefault();
          setStarted(true);
        }}
      >
        <h1>
          {specTitle(spec, "Practice")}: {questions.length} question
          {questions.length === 1 ? "" : "s"}
        </h1>
        <ul className="statement-summary">
          {statements.map((id) => (
            <li key={id}>
              <code>{id}</code> {statementById.get(id)?.text}
            </li>
          ))}
        </ul>
        <label>
          Your name (it goes on your results and is not saved anywhere)
          <input value={name} autoComplete="name" onChange={(e) => setName(e.target.value)} />
        </label>
        <button type="submit" className="primary">
          Start
        </button>
      </form>
    );
  }

  const attempts: Attempt[] = questions.flatMap(({ question }, i) => {
    const mark = marks[i];
    if (!mark) return [];
    const answers = question.parts.map((part, p) => {
      const response = toResponse(part.answer, drafts[i]?.[p] ?? emptyDraft(part.answer));
      return answerText(part, response);
    });
    return [{ question, mark, answers }];
  });

  if (finished)
    return <ResultsView name={name} attempts={attempts} spec={spec} restart={restart} />;

  const current = questions[index];
  if (!current) return null;
  const { question, validators } = current;
  const mark = marks[index];
  const partDrafts = drafts[index] ?? [];
  const complete = question.parts.every((p, i) =>
    isComplete(p.answer, partDrafts[i] ?? emptyDraft(p.answer)),
  );
  const last = index === questions.length - 1;
  const showFeedback = spec.feedback === "each";

  const next = () => {
    if (last) setFinished(true);
    else {
      setIndex(index + 1);
      window.scrollTo(0, 0);
    }
  };

  const check = async (e: FormEvent) => {
    e.preventDefault();
    if (mark) return next();
    // Exact answers need the Compute Engine, which loads the first time it is needed.
    await prepareMarking(question);
    const responses = question.parts.map((p, i) =>
      toResponse(p.answer, partDrafts[i] ?? emptyDraft(p.answer)),
    );
    const result = markQuestion(question, responses, validators);
    setMarks((all) => {
      const copy = [...all];
      copy[index] = result;
      return copy;
    });
    // With feedback at the end, move straight on.
    if (!showFeedback) next();
  };

  return (
    <form onSubmit={(e) => void check(e)} className="session">
      <div className="progress">
        <span>
          Question {index + 1} of {questions.length}
        </span>
        <progress max={questions.length} value={index + (mark ? 1 : 0)} />
      </div>
      <div className="question-card">
        <QuestionView
          key={index}
          question={question}
          drafts={partDrafts}
          setDraft={(part, draft) =>
            setDrafts((all) => {
              const copy = all.map((d) => [...d]);
              const row = copy[index];
              if (row) row[part] = draft;
              return copy;
            })
          }
          {...(mark ? { mark } : {})}
          showFeedback={showFeedback}
        />
      </div>
      <div className="session-buttons">
        {mark ? (
          <button type="submit" className="primary">
            {last ? "See results" : "Next question"}
          </button>
        ) : (
          <>
            <button type="submit" className="primary" disabled={!complete}>
              {showFeedback ? "Check" : last ? "Finish" : "Next question"}
            </button>
            <button
              type="button"
              className="link"
              onClick={() => {
                setMarks((all) => {
                  const copy = [...all];
                  copy[index] = markQuestion(question, [], validators);
                  return copy;
                });
                if (!showFeedback) next();
              }}
            >
              Skip
            </button>
          </>
        )}
      </div>
    </form>
  );
}
