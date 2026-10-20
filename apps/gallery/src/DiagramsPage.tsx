import { REFERENCE_DIAGRAMS, renderDiagram, type DiagramResult } from "@mathsplanner/diagrams";
import { useMemo, useState } from "react";

type Kind = "all" | "geometry" | "cartesian" | "number-line" | "bar-model" | "measure";

const KINDS: [Kind, string][] = [
  ["all", "All"],
  ["geometry", "Geometry"],
  ["cartesian", "Graphs"],
  ["number-line", "Number lines"],
  ["bar-model", "Bar models"],
  ["measure", "Measures"],
];

/** The reference diagrams the Phase 3 exit check reviews, with their automated checks. */
export function DiagramsPage() {
  const [kind, setKind] = useState<Kind>("all");
  const [showSpec, setShowSpec] = useState(false);
  const rendered = useMemo(
    () =>
      REFERENCE_DIAGRAMS.map((r) => {
        try {
          return {
            ...r,
            result: renderDiagram(r.spec) as DiagramResult | undefined,
            error: undefined,
          };
        } catch (error) {
          return { ...r, result: undefined, error: (error as Error).message };
        }
      }),
    [],
  );
  const shown = rendered.filter((r) => kind === "all" || r.spec.type === kind);
  const clean = rendered.filter(
    (r) => r.result && r.result.collisions.length === 0 && r.result.problems.length === 0,
  ).length;

  return (
    <>
      <h1>Reference diagrams</h1>
      <p className="lede">
        The {rendered.length} diagrams that test the diagram engine. Each is checked automatically
        for overlapping labels and for drawings that contradict their numbers; {clean} of{" "}
        {rendered.length} pass. Review them by eye: are the labels where a careful teacher would put
        them?
      </p>
      <div className="controls">
        <fieldset className="depths">
          <legend>Type</legend>
          {KINDS.map(([k, name]) => (
            <button key={k} type="button" aria-pressed={kind === k} onClick={() => setKind(k)}>
              {name}
            </button>
          ))}
        </fieldset>
        <label className="check">
          <input
            type="checkbox"
            checked={showSpec}
            onChange={(e) => setShowSpec(e.target.checked)}
          />
          Show specs
        </label>
      </div>
      <div className="diagram-grid">
        {shown.map((r) => {
          const issues = r.result
            ? [
                ...r.result.problems,
                ...r.result.collisions.map((c) => `${c.label} overlaps ${c.with}`),
              ]
            : [];
          return (
            <section key={r.id} id={r.id} className="diagram-card" aria-label={r.title}>
              <h2>
                {r.title} <code>{r.id}</code>
              </h2>
              {r.result ? (
                <div className="diagram-svg" dangerouslySetInnerHTML={{ __html: r.result.svg }} />
              ) : (
                <p className="banner error">{r.error}</p>
              )}
              {issues.length > 0 ? (
                <ul className="banner error">
                  {issues.map((issue) => (
                    <li key={issue}>{issue}</li>
                  ))}
                </ul>
              ) : (
                <p className="check-ok">No label collisions · tells the truth</p>
              )}
              <p className="description">{r.result?.description}</p>
              {showSpec && <pre className="spec">{JSON.stringify(r.spec, null, 2)}</pre>}
            </section>
          );
        })}
      </div>
    </>
  );
}
