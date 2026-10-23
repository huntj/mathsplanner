// The teacher's page: choose statements, depths, numbers and how many questions, then share the
// link. Everyone who opens it gets the same questions.
import { DEPTHS, NUMBERS, type Depth, type Numbers } from "@mathsplanner/core";
import { useState } from "react";
import {
  DEFAULT_SHEET,
  formatRoute,
  MAX_QUESTIONS,
  practisable,
  sessionItems,
  stepsOf,
  type FeedbackMode,
  type Route,
  type SessionSpec,
} from "./session.ts";

const DEPTH_NAMES = {
  1: "Fluency",
  2: "Varied fluency",
  3: "Representation",
  4: "Reasoning",
  5: "Problem solving",
} as const;
const randomSeed = () => Math.floor(Math.random() * 1_000_000);

export function SetupView({ navigate }: { navigate: (route: Route) => void }) {
  const [query, setQuery] = useState("");
  const [chosen, setChosen] = useState<string[]>([]);
  const [depths, setDepths] = useState<Depth[]>([1, 2, 3, 4]);
  const [numbers, setNumbers] = useState<Numbers>("standard");
  const [count, setCount] = useState(10);
  const [feedback, setFeedback] = useState<FeedbackMode>("each");
  const [seed, setSeed] = useState(randomSeed);
  const [copied, setCopied] = useState(false);

  const spec: SessionSpec = { statements: chosen, depths, numbers, count, seed, feedback };
  const available = chosen.length > 0 && depths.length > 0 ? sessionItems(spec).length : 0;
  const link = `${window.location.href.split("#")[0]}${formatRoute({ page: "session", spec })}`;

  const q = query.trim().toLowerCase();
  const hit = (s: { id: string; text: string }) =>
    !q || s.id.toLowerCase().includes(q) || s.text.toLowerCase().includes(q);
  // Statements at the top level; a statement also shows when one of its steps matches the search.
  const visible = practisable.filter(
    (s) => !s.parent && (hit(s) || (stepsOf.get(s.id) ?? []).some(hit)),
  );

  const toggle = (id: string) =>
    setChosen((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
  const copy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <h1>Set up a practice session</h1>
      <p className="lede">
        Choose what to practise, then share the link with your class: everyone gets the same
        questions. Nothing is stored. At the end, each student downloads or prints their results for
        you.
      </p>

      <h2>Statements</h2>
      <label>
        Search
        <input
          type="search"
          value={query}
          placeholder="ID or words, e.g. angles"
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <p className="count">
        {chosen.length} chosen · {practisable.filter((s) => !s.parent).length} statements and{" "}
        {practisable.filter((s) => s.parent).length} sub-statements have questions
        {chosen.length > 0 && (
          <>
            {" "}
            ·{" "}
            <button type="button" className="link" onClick={() => setChosen([])}>
              clear
            </button>
          </>
        )}
      </p>
      <ul className="statement-picker">
        {visible.map((s) => {
          const steps = stepsOf.get(s.id) ?? [];
          const open = steps.some((x) => chosen.includes(x.id)) || (q !== "" && steps.some(hit));
          return (
            <li key={s.id}>
              <label className="check">
                <input
                  type="checkbox"
                  checked={chosen.includes(s.id)}
                  onChange={() => toggle(s.id)}
                />
                <code>{s.id}</code> <span>{s.text}</span>
              </label>
              {steps.length > 0 && (
                <details className="steps" open={open || undefined}>
                  <summary>
                    {steps.length} steps{chosen.includes(s.id) ? " (all included)" : ""}
                  </summary>
                  <ul>
                    {steps.map((x) => (
                      <li key={x.id}>
                        <label className="check">
                          <input
                            type="checkbox"
                            checked={chosen.includes(s.id) || chosen.includes(x.id)}
                            disabled={chosen.includes(s.id)}
                            onChange={() => toggle(x.id)}
                          />
                          <code>{x.id}</code> <span>{x.text}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </li>
          );
        })}
      </ul>

      <h2>Questions</h2>
      <div className="controls">
        <fieldset className="depths">
          <legend>Depths</legend>
          {DEPTHS.map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={depths.includes(d)}
              onClick={() =>
                setDepths((ds) => (ds.includes(d) ? ds.filter((x) => x !== d) : [...ds, d].sort()))
              }
            >
              {d} <span>{DEPTH_NAMES[d]}</span>
            </button>
          ))}
        </fieldset>
        <label>
          Numbers
          <select value={numbers} onChange={(e) => setNumbers(e.target.value as Numbers)}>
            {NUMBERS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label>
          How many
          <input
            type="number"
            min={1}
            max={MAX_QUESTIONS}
            value={count}
            onChange={(e) =>
              setCount(
                Math.min(MAX_QUESTIONS, Math.max(1, Math.round(Number(e.target.value)) || 1)),
              )
            }
          />
        </label>
        <fieldset className="radio">
          <legend>Feedback</legend>
          <label className="check">
            <input
              type="radio"
              name="feedback"
              checked={feedback === "each"}
              onChange={() => setFeedback("each")}
            />
            After each question
          </label>
          <label className="check">
            <input
              type="radio"
              name="feedback"
              checked={feedback === "end"}
              onChange={() => setFeedback("end")}
            />
            Only at the end (a quiz)
          </label>
        </fieldset>
        <label>
          Seed
          <span className="seed">
            <input
              type="number"
              min={0}
              value={seed}
              onChange={(e) => setSeed(Math.max(0, Math.round(Number(e.target.value)) || 0))}
            />
            <button type="button" onClick={() => setSeed(randomSeed())}>
              New
            </button>
          </span>
        </label>
      </div>

      {chosen.length > 0 && depths.length > 0 && available === 0 && (
        <p className="banner warning">
          The chosen statements have no questions at these depths. Choose more depths.
        </p>
      )}
      <div className="share">
        <label>
          Link for your class
          <input readOnly value={available ? link : ""} onFocus={(e) => e.target.select()} />
        </label>
        <div className="buttons">
          <button type="button" disabled={!available} onClick={() => void copy()}>
            {copied ? "Link copied" : "Copy link"}
          </button>
          <button
            type="button"
            className="primary"
            disabled={!available}
            onClick={() => navigate({ page: "session", spec })}
          >
            Start
          </button>
          <button
            type="button"
            disabled={!available}
            onClick={() => navigate({ page: "worksheet", spec, sheet: DEFAULT_SHEET })}
          >
            Print a worksheet
          </button>
        </div>
      </div>
    </>
  );
}
