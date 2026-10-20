// The end of a session: the score, a row per question, the misconceptions that showed up, and the
// CSV download and print buttons that are the only way results leave the page.
import { useState } from "react";
import { misconceptionText, resultsCsv, STATUS_WORDS, totals, type Attempt } from "./results.ts";
import { statementById, type SessionSpec } from "./session.ts";

interface Props {
  name: string;
  attempts: readonly Attempt[];
  spec: SessionSpec;
  restart: () => void;
}

const DEPTH_NAMES = {
  1: "Fluency",
  2: "Varied fluency",
  3: "Representation",
  4: "Reasoning",
  5: "Problem solving",
} as const;

function download(filename: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ResultsView({ name, attempts, spec, restart }: Props) {
  const [date] = useState(() => new Date());
  const { score, marks } = totals(attempts);
  const codes = attempts.flatMap((a) =>
    a.mark.parts.flatMap((p) => (p.misconception ? [p.misconception.code] : [])),
  );
  const counts = new Map<string, number>();
  for (const c of codes) counts.set(c, (counts.get(c) ?? 0) + 1);
  const slug = (name.trim() || "results").replace(/[^\w-]+/g, "-").toLowerCase();

  return (
    <section className="results" aria-labelledby="results-title">
      <h1 id="results-title">Results{name.trim() && <> for {name.trim()}</>}</h1>
      <p className="facts">
        {date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} ·{" "}
        {spec.numbers} numbers · seed {spec.seed}
      </p>
      <p className="total">
        <strong>
          {score} / {marks}
        </strong>{" "}
        marks ({marks ? Math.round((100 * score) / marks) : 0}%)
      </p>

      <table className="results-table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Statement</th>
            <th scope="col">Depth</th>
            <th scope="col">Result</th>
            <th scope="col">Marks</th>
          </tr>
        </thead>
        <tbody>
          {attempts.map((a, i) => {
            const { key } = a.question;
            const statuses = [...new Set(a.mark.parts.map((p) => STATUS_WORDS[p.status]))].join(
              ", ",
            );
            return (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>
                  <code>{key.statementId}</code>{" "}
                  <span className="muted">{statementById.get(key.statementId)?.text}</span>
                </td>
                <td>
                  {key.depth} <span className="muted">{DEPTH_NAMES[key.depth]}</span>
                </td>
                <td>{statuses}</td>
                <td>
                  {a.mark.score} / {a.mark.marks}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {counts.size > 0 && (
        <>
          <h2>Mistakes to look at</h2>
          <ul className="misconception-list">
            {[...counts].map(([code, n]) => (
              <li key={code}>
                {misconceptionText(code)}{" "}
                <span className="muted">({n === 1 ? "once" : `${n} times`})</span>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="session-buttons no-print">
        <button
          type="button"
          className="primary"
          onClick={() =>
            download(
              `mathsplanner-${slug}-${date.toISOString().slice(0, 10)}.csv`,
              resultsCsv(name.trim(), date, attempts),
            )
          }
        >
          Download CSV
        </button>
        <button type="button" onClick={() => window.print()}>
          Print
        </button>
        <button type="button" onClick={restart}>
          New questions
        </button>
      </div>
      <p className="muted no-print">
        Your results are not saved. Download or print them before you close this page.
      </p>
    </section>
  );
}
