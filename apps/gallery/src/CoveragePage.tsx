// The coverage dashboard: every statement as a cell, coloured by whether it has a generator and
// whether a teacher has reviewed it, grouped by stage and strand. Phase 7 ends when every cell is
// reviewed.
import { STAGES, type Statement } from "@mathsplanner/core";
import headers from "virtual:generator-headers";
import { generatorFor, STAGE_NAMES, statements } from "./data.ts";
import { formatRoute, statementRoute } from "./route.ts";

type State = "reviewed" | "generated" | "missing";

const stateOf = (s: Statement): State => {
  const info = generatorFor(s.id);
  if (!info || info.example) return "missing";
  return (headers[s.id]?.reviews.length ?? 0) > 0 ? "reviewed" : "generated";
};

const WORDS: Record<State, string> = {
  reviewed: "generator, reviewed by a teacher",
  generated: "generator, not yet reviewed",
  missing: "no generator yet",
};

function Bar({ counts, total }: { counts: Record<State, number>; total: number }) {
  return (
    <span className="coverage-bar" aria-hidden="true">
      <span className="reviewed" style={{ width: `${(100 * counts.reviewed) / total}%` }} />
      <span className="generated" style={{ width: `${(100 * counts.generated) / total}%` }} />
    </span>
  );
}

const tally = (list: readonly Statement[]) => {
  const counts: Record<State, number> = { reviewed: 0, generated: 0, missing: 0 };
  for (const s of list) counts[stateOf(s)]++;
  return counts;
};

export function CoveragePage() {
  const all = tally(statements);
  const stages = STAGES.map((stage) => ({
    stage,
    list: statements.filter((s) => s.stage === stage),
  })).filter((g) => g.list.length > 0);

  return (
    <>
      <h1>Coverage</h1>
      <p className="lede">
        Every statement in the progression map, coloured by whether it has a generator and whether a
        teacher has reviewed it. Select a cell to open the statement.
      </p>
      <div className="coverage-summary">
        <p>
          <strong>{all.reviewed + all.generated}</strong> of {statements.length} statements have a
          generator; <strong>{all.reviewed}</strong> are reviewed.
        </p>
        <Bar counts={all} total={statements.length} />
        <ul className="coverage-legend">
          {(["reviewed", "generated", "missing"] as const).map((state) => (
            <li key={state}>
              <span className={`cell ${state}`} aria-hidden="true" />{" "}
              {WORDS[state][0]?.toUpperCase()}
              {WORDS[state].slice(1)} ({all[state]})
            </li>
          ))}
        </ul>
      </div>
      {stages.map(({ stage, list }) => {
        const counts = tally(list);
        const strands = [...new Set(list.map((s) => s.strand))];
        return (
          <section key={stage} className="coverage-stage" aria-labelledby={`stage-${stage}`}>
            <h2 id={`stage-${stage}`}>
              {STAGE_NAMES[stage]}{" "}
              <span className="muted">
                {counts.reviewed + counts.generated} / {list.length}
              </span>
            </h2>
            <div className="coverage-strands">
              {strands.map((strand) => (
                <div key={strand} className="coverage-strand">
                  <span className="strand-name">{strand}</span>
                  <span className="cells">
                    {list
                      .filter((s) => s.strand === strand)
                      .map((s) => {
                        const state = stateOf(s);
                        return (
                          <a
                            key={s.id}
                            className={`cell ${state}`}
                            href={formatRoute(statementRoute(s.id))}
                            title={`${s.id}: ${s.text} (${WORDS[state]})`}
                            aria-label={`${s.id}, ${WORDS[state]}`}
                          />
                        );
                      })}
                  </span>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
